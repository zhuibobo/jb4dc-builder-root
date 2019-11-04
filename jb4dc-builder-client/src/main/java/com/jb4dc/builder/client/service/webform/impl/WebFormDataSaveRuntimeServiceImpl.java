package com.jb4dc.builder.client.service.webform.impl;

import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.builder.client.service.api.proxy.IApiRuntimeProxy;
import com.jb4dc.builder.client.service.datastorage.ITableRuntimeService;
import com.jb4dc.builder.client.service.envvar.IEnvVariableRuntimeResolveService;
import com.jb4dc.builder.client.service.webform.IWebFormDataSaveRuntimeService;
import com.jb4dc.builder.client.service.weblist.IWebListButtonRuntimeResolveService;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.SubmitResultPO;
import com.jb4dc.builder.po.button.InnerFormButtonConfig;
import com.jb4dc.builder.po.button.InnerFormButtonConfigAPI;
import com.jb4dc.builder.po.button.InnerFormButtonConfigField;
import com.jb4dc.builder.po.formdata.*;
import com.jb4dc.builder.tool.FormRecordComplexPOUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.core.base.tools.ClassUtility;
import com.jb4dc.core.base.tools.SQLKeyWordUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
@Service
public class WebFormDataSaveRuntimeServiceImpl implements IWebFormDataSaveRuntimeService {

    @Autowired
    private IWebListButtonRuntimeResolveService webListButtonRuntimeResolveService;

    @Autowired
    private IApiRuntimeProxy apiRuntimeService;

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    private IEnvVariableRuntimeResolveService envVariableRuntimeResolveService;

    @Autowired
    private ITableRuntimeService tableRuntimeService;

    @Autowired
    private ISQLBuilderService sqlBuilderService;

    @Override
    @Transactional(rollbackFor= {JBuild4DCGenerallyException.class,JBuild4DCSQLKeyWordException.class})
    public SubmitResultPO SaveFormRecordComplexPO(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO, String listButtonId, String innerFormButtonId,String operationTypeName) throws JBuild4DCGenerallyException, IOException, JBuild4DCSQLKeyWordException {
        SubmitResultPO submitResultPO = new SubmitResultPO();

        ListButtonEntity listButtonEntity = webListButtonRuntimeResolveService.getButtonPO(listButtonId);
        List<InnerFormButtonConfig> innerFormButtonConfigList = JsonUtility.toObjectListIgnoreProp(listButtonEntity.getButtonInnerConfig(), InnerFormButtonConfig.class);
        InnerFormButtonConfig innerFormButtonConfig = innerFormButtonConfigList.parallelStream().filter(item -> item.id.equals(innerFormButtonId)).findFirst().get();

        //执行前置API
        if (innerFormButtonConfig.getApis() != null && innerFormButtonConfig.getApis().size() > 0) {
            List<InnerFormButtonConfigAPI> beforeApiList = innerFormButtonConfig.getApis().parallelStream().filter(item -> item.getRunTime().equals("之前")).collect(Collectors.toList());
            for (InnerFormButtonConfigAPI innerFormButtonConfigAPI : beforeApiList) {
                ApiRunResult apiRunResult = rubApi(innerFormButtonConfigAPI, formRecordComplexPO, listButtonEntity, innerFormButtonConfigList, innerFormButtonConfig);
                if (!apiRunResult.isSuccess()) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "执行前置API" + innerFormButtonConfigAPI.getValue() + "失败!");
                }
            }
        }

        //验证数据
        validateFormRecordComplexPO(jb4DCSession, recordId, formRecordComplexPO, operationTypeName);

        //保存数据
        List<PendingSQLPO> pendingSQLPOList = resolveFormRecordComplexPOTOPendingSQL(jb4DCSession, recordId, formRecordComplexPO, operationTypeName);
        for (PendingSQLPO pendingSQLPO : pendingSQLPOList) {

        }

        //修改字段
        for (InnerFormButtonConfigField field : innerFormButtonConfig.getFields()) {
            this.updateField(jb4DCSession, field, formRecordComplexPO);
        }

        //执行后置API
        if (innerFormButtonConfig.getApis() != null && innerFormButtonConfig.getApis().size() > 0) {
            List<InnerFormButtonConfigAPI> afterApiList = innerFormButtonConfig.getApis().parallelStream().filter(item -> item.getRunTime().equals("之后")).collect(Collectors.toList());
            for (InnerFormButtonConfigAPI innerFormButtonConfigAPI : afterApiList) {
                ApiRunResult apiRunResult = rubApi(innerFormButtonConfigAPI, formRecordComplexPO, listButtonEntity, innerFormButtonConfigList, innerFormButtonConfig);
                if (!apiRunResult.isSuccess()) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "执行后置API" + innerFormButtonConfigAPI.getValue() + "失败!");
                }
            }
        }

        return submitResultPO;
    }

    private void validateFormRecordComplexPO(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO,String operationTypeName) throws JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        FormRecordDataRelationPO mainFormRecordDataRelationPO = FormRecordComplexPOUtility.findMainFormRecordDataRelationPO(formRecordComplexPO);
        if(BaseUtility.isAddOperation(operationTypeName)){
            if(this.formRecordDataPOIsExist(mainFormRecordDataRelationPO.getOneDataRecord(),mainFormRecordDataRelationPO.getTableName())){
                String idValue = FormRecordComplexPOUtility.findIdInFormRecordFieldDataPO(mainFormRecordDataRelationPO.getOneDataRecord());
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"操作类型:"+operationTypeName+",已经存在ID为:"+idValue+"的记录!");
            }
        }
    }

    private List<PendingSQLPO> resolveFormRecordComplexPOTOPendingSQL(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO,String operationTypeName) throws JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        List<PendingSQLPO> pendingSQLPOList = new ArrayList<>();

        FormRecordDataRelationPO mainFormRecordDataRelationPO = FormRecordComplexPOUtility.findMainFormRecordDataRelationPO(formRecordComplexPO);
        String idValue = FormRecordComplexPOUtility.findIdInFormRecordFieldDataPO(mainFormRecordDataRelationPO.getOneDataRecord());

        return pendingSQLPOList;
    }

    private PendingSQLPO resolveFormRecordDataPOTOPendingSQL(JB4DCSession jb4DCSession, String recordId,String tableName,FormRecordDataPO formRecordDataPO, FormRecordComplexPO formRecordComplexPO,String operationTypeName) throws JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException {
        PendingSQLPO pendingSQLPO=new PendingSQLPO();
        if (!SQLKeyWordUtility.singleWord(tableName)) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "表名检测失败");
        }
        StringBuilder sqlBuilder=new StringBuilder();
        Map<String,Object> sqlMapPara=new HashMap<>();
        List<FormRecordFieldDataPO> recordFieldPOList=FormRecordComplexPOUtility.findExcludeIdFormRecordFieldList(formRecordDataPO);
        if(!this.formRecordDataPOIsExist(formRecordDataPO,tableName)){

        }
        else{
            sqlBuilder.append("update "+tableName+" set ");

            for (FormRecordFieldDataPO fieldDataPO : recordFieldPOList) {
                sqlBuilder.append(String.format("%s=#{%s},",fieldDataPO.getFieldName(),fieldDataPO.getFieldName()));
                sqlMapPara.put(fieldDataPO.getFieldName(),fieldDataPO.getValue());
            }

            sqlBuilder.append("where ID=${ID}");
            sqlMapPara.put("ID",recordId);
        }

        pendingSQLPO.setSql(sqlBuilder.toString());
        pendingSQLPO.setSqlPara(sqlMapPara);

        return pendingSQLPO;
    }

    private boolean formRecordDataPOIsExist(FormRecordDataPO formRecordDataPO,String tableName) throws JBuild4DCSQLKeyWordException, JBuild4DCGenerallyException {
        String idValue = FormRecordComplexPOUtility.findIdInFormRecordFieldDataPO(formRecordDataPO);
        if (!SQLKeyWordUtility.singleWord(tableName)) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "表名检测失败");
        }
        String sql = "select count(1) from " + tableName + " where ID=#{ID}";
        Map paraMap = new HashMap();
        paraMap.put("ID", idValue);
        Object count = sqlBuilderService.selectOneScalar(sql, paraMap);
        return Integer.parseInt(count.toString()) > 0;
    }

    protected void updateField(JB4DCSession jb4DCSession,InnerFormButtonConfigField field, FormRecordComplexPO formRecordComplexPO) throws JBuild4DCGenerallyException {
        try {
            String tableName = field.getTableName();
            String fieldName = field.getFieldName();
            String fieldDefaultType = field.getFieldDefaultType();
            String fieldDefaultText = field.getFieldDefaultText();
            String fieldDefaultValue = field.getFieldDefaultValue();
            String value = envVariableRuntimeResolveService.execDefaultValueResult(jb4DCSession, fieldDefaultType, fieldDefaultValue);
            //value = "123";
            String sql = String.format("update %s set %s=#{%s} where id=#{id}", tableName, fieldName, fieldName);
            Map paraMap = new HashMap();
            paraMap.put(fieldName, value);
            paraMap.put("id", formRecordComplexPO.getRecordId());
            //paraMap.put("id","57d35380-844f-c403-29e4-3d3e88a87b3c");
            sqlBuilderService.update(sql, paraMap);
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage(),ex.getCause());
        }
    }

    protected ApiRunResult rubApi(InnerFormButtonConfigAPI innerFormButtonConfigAPI, FormRecordComplexPO formRecordComplexPO, ListButtonEntity listButtonEntity,List<InnerFormButtonConfig> innerFormButtonConfigList,InnerFormButtonConfig innerFormButtonConfig) throws JBuild4DCGenerallyException {
        try {
            ApiItemEntity apiItemEntity = apiRuntimeService.getApiPOByValue(innerFormButtonConfigAPI.getValue());
            ApiRunPara apiRunPara = new ApiRunPara();
            apiRunPara.setInnerFormButtonConfigAPI(innerFormButtonConfigAPI);
            apiRunPara.setApiItemEntity(apiItemEntity);
            apiRunPara.setFormRecordComplexPO(formRecordComplexPO);
            apiRunPara.setListButtonEntity(listButtonEntity);
            apiRunPara.setInnerFormButtonConfigList(innerFormButtonConfigList);
            apiRunPara.setInnerFormButtonConfig(innerFormButtonConfig);

            String className = apiItemEntity.getApiItemClassName();
            IApiForButton apiForButton = (IApiForButton) ClassUtility.loadClass(className).newInstance();
            autowireCapableBeanFactory.autowireBean(apiForButton);
            return apiForButton.runApi(apiRunPara);
        } catch (IllegalAccessException e) {
            throw new JBuild4DCGenerallyException(e.hashCode(),e.getMessage(),e);
        } catch (InstantiationException e) {
            throw new JBuild4DCGenerallyException(e.hashCode(),e.getMessage(),e);
        }
    }
}
