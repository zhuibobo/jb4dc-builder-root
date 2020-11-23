package com.jb4dc.builder.client.service.webform.impl;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.client.service.webform.IWebFormDataSaveRuntimeService;
import com.jb4dc.builder.client.service.webform.IWebFormRuntimeService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.builder.po.FormResourceComplexPO;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
@Service
public class WebFormRuntimeServiceImpl implements IWebFormRuntimeService {

    @Autowired
    IHTMLRuntimeResolve htmlRuntimeResolve;

    //@Autowired
    //IDataStorageRuntimeService dataStorageRuntimeService;

    //@Autowired
    //IFormDataRelationService formDataRelationService;

    @Autowired
    IWebFormDataSaveRuntimeService webFormDataSaveRuntimeService;

    @Override
    public FormResourceComplexPO resolveFormResourceComplex(JB4DCSession session,String recordId,
                                                            FormResourcePO remoteSourcePO,
                                                            ListButtonEntity listButtonEntity,
                                                            String operationType,
                                                            String formRuntimeCategory,
                                                            String isIndependenceCurrentOperationType,String loadTimeDesc) throws IOException, JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException, XPathExpressionException, SAXException, ParserConfigurationException {

        FormRecordComplexPO formRecordComplexPO = null;
        //List<FormDataRelationPO> recordData=null;

        //if(BaseUtility.isUpdateOperation(operationType)||BaseUtility.isViewOperation(operationType)) {

        if (StringUtility.isNotEmpty(remoteSourcePO.getFormDataRelation())) {
            List<FormRecordDataRelationPO> formRecordDataRelationPOList = JsonUtility.toObjectList(remoteSourcePO.getFormDataRelation(), FormRecordDataRelationPO.class);

            try {
                long startTime = System.currentTimeMillis();
                formRecordComplexPO = webFormDataSaveRuntimeService.getFormRecordComplexPO(session, recordId, formRecordDataRelationPOList, operationType);
                long endTime = System.currentTimeMillis(); //获取结束时间
                loadTimeDesc += "加载业务数据时间:" + (endTime - startTime) + "ms;";
            } catch (Exception ex) {
                String traceMsg = org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(ex);
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "根据数据源加载数据失败:" + traceMsg, ex, ex.getStackTrace());
            }
        } else {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "该表单未设置数据关系!");
        }
        //}

        DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO = new DynamicBindHTMLControlContextPO();
        dynamicBindHTMLControlContextPO.setRecordId(recordId);
        dynamicBindHTMLControlContextPO.setRemoteSourcePO(remoteSourcePO);
        dynamicBindHTMLControlContextPO.setListButtonEntity(listButtonEntity);
        dynamicBindHTMLControlContextPO.setFormRecordComplexPO(formRecordComplexPO);
        //dynamicBindHTMLControlContextPO.setMainRecordData(formDataRelationService.findMainRecordData(formDataRelationPOList));

        long  startTime=System.currentTimeMillis();
        String resolvedHtml = htmlRuntimeResolve.resolveSourceHTMLAtRuntime(JB4DCSessionUtility.getSession(), remoteSourcePO.getFormId(),remoteSourcePO.getFormHtmlResolve());
        long endTime = System.currentTimeMillis(); //获取结束时间
        loadTimeDesc += "解析表单控件时间:" + (endTime - startTime) + "ms;";

        startTime=System.currentTimeMillis();
        String formHtmlRuntime = htmlRuntimeResolve.dynamicBind(JB4DCSessionUtility.getSession(), remoteSourcePO.getFormId(), resolvedHtml, dynamicBindHTMLControlContextPO);
        endTime = System.currentTimeMillis(); //获取结束时间
        loadTimeDesc += "绑定表单动态数据时间:" + (endTime - startTime) + "ms;";

        //清空掉关联设置,设置getFormRecordComplexPO中计算尝试的关联设置
        //remoteSourcePO.setFormDataRelation("");

        FormResourceComplexPO formResourceComplexPO = new FormResourceComplexPO(remoteSourcePO, formHtmlRuntime, formRecordComplexPO.getFormRecordDataRelationPOList(), formRecordComplexPO, listButtonEntity,formRuntimeCategory,isIndependenceCurrentOperationType);
        formResourceComplexPO.setLoadTimeDesc(loadTimeDesc);
        return formResourceComplexPO;
    }
}
