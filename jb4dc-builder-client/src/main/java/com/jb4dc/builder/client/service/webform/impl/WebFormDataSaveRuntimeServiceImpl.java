package com.jb4dc.builder.client.service.webform.impl;

import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.builder.client.service.api.IApiRuntimeService;
import com.jb4dc.builder.client.service.envvar.IEnvVariableRuntimeResolveService;
import com.jb4dc.builder.client.service.webform.IWebFormDataSaveRuntimeService;
import com.jb4dc.builder.client.service.weblist.IWebListButtonRuntimeResolveService;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.SubmitResultPO;
import com.jb4dc.builder.po.button.InnerFormButtonConfig;
import com.jb4dc.builder.po.button.InnerFormButtonConfigAPI;
import com.jb4dc.builder.po.button.InnerFormButtonConfigField;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.ClassUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
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
    private IApiRuntimeService apiRuntimeService;

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    private IEnvVariableRuntimeResolveService envVariableRuntimeResolveService;

    @Autowired
    private ISQLBuilderService sqlBuilderService;

    @Override
    @Transactional(rollbackFor= JBuild4DCGenerallyException.class)
    public SubmitResultPO SaveFormRecordComplexPO(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO, String listButtonId, String innerFormButtonId) throws JBuild4DCGenerallyException, IOException {
        SubmitResultPO submitResultPO=new SubmitResultPO();

        ListButtonEntity listButtonEntity=webListButtonRuntimeResolveService.getButtonPO(listButtonId);
        List<InnerFormButtonConfig> innerFormButtonConfigList= JsonUtility.toObjectListIgnoreProp(listButtonEntity.getButtonInnerConfig(),InnerFormButtonConfig.class);
        InnerFormButtonConfig innerFormButtonConfig=innerFormButtonConfigList.parallelStream().filter(item->item.id.equals(innerFormButtonId)).findFirst().get();

        //执行前置API
        if(innerFormButtonConfig.getApis()!=null&&innerFormButtonConfig.getApis().size()>0){
            List<InnerFormButtonConfigAPI> beforeApiList=innerFormButtonConfig.getApis().parallelStream().filter(item->item.getRunTime().equals("之前")).collect(Collectors.toList());
            for (InnerFormButtonConfigAPI innerFormButtonConfigAPI : beforeApiList) {
                ApiRunResult apiRunResult=rubApi(innerFormButtonConfigAPI,formRecordComplexPO,listButtonEntity,innerFormButtonConfigList,innerFormButtonConfig);
                if(!apiRunResult.isSuccess()){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"执行前置API"+innerFormButtonConfigAPI.getValue()+"失败!");
                }
            }
        }

        //保存数据

        //修改字段
        for (InnerFormButtonConfigField field : innerFormButtonConfig.getFields()) {
            this.updateField(jb4DCSession,field,formRecordComplexPO);
        }

        //执行后置API
        if(innerFormButtonConfig.getApis()!=null&&innerFormButtonConfig.getApis().size()>0){
            List<InnerFormButtonConfigAPI> afterApiList=innerFormButtonConfig.getApis().parallelStream().filter(item->item.getRunTime().equals("之后")).collect(Collectors.toList());
            for (InnerFormButtonConfigAPI innerFormButtonConfigAPI : afterApiList) {
                ApiRunResult apiRunResult=rubApi(innerFormButtonConfigAPI,formRecordComplexPO,listButtonEntity,innerFormButtonConfigList,innerFormButtonConfig);
                if(!apiRunResult.isSuccess()){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"执行后置API"+innerFormButtonConfigAPI.getValue()+"失败!");
                }
            }
        }

        return submitResultPO;
    }

    public void updateField(JB4DCSession jb4DCSession,InnerFormButtonConfigField field, FormRecordComplexPO formRecordComplexPO) throws JBuild4DCGenerallyException {
        String tableName=field.getTableName();
        String fieldName=field.getFieldName();
        String fieldDefaultType=field.getFieldDefaultType();
        String fieldDefaultText=field.getFieldDefaultText();
        String fieldDefaultValue=field.getFieldDefaultValue();
        String value=envVariableRuntimeResolveService.execDefaultValueResult(jb4DCSession,fieldDefaultType,fieldDefaultValue);
        String sql=String.format("update %s set %s=#{%s} where id=#{id}",tableName,fieldName,fieldName);
        Map paraMap=new HashMap();
        paraMap.put(fieldName,value);
        paraMap.put("id",formRecordComplexPO.getRecordId());
        sqlBuilderService.update(sql,paraMap);
    }

    public ApiRunResult rubApi(InnerFormButtonConfigAPI innerFormButtonConfigAPI, FormRecordComplexPO formRecordComplexPO, ListButtonEntity listButtonEntity,List<InnerFormButtonConfig> innerFormButtonConfigList,InnerFormButtonConfig innerFormButtonConfig) throws JBuild4DCGenerallyException {
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
