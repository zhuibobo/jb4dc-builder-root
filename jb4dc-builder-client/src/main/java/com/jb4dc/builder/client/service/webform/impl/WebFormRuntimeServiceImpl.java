package com.jb4dc.builder.client.service.webform.impl;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.client.service.datastorage.IDataStorageRuntimeService;
import com.jb4dc.builder.client.service.datastorage.impl.DataStorageRuntimeServiceImpl;
import com.jb4dc.builder.client.service.webform.IWebFormRuntimeService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.FormDataRelationPO;
import com.jb4dc.builder.po.FormResourceComplexPO;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

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

    @Autowired
    IDataStorageRuntimeService dataStorageRuntimeService;

    @Override
    public FormResourceComplexPO resolveFormResourceComplex(JB4DCSession session,String recordId, FormResourcePO remoteSourcePO, ListButtonEntity listButtonEntity) throws IOException, JBuild4DCGenerallyException {

        List<FormDataRelationPO> formDataRelationPOList;
        Map recordData=null;

        if(!listButtonEntity.getButtonOperationType().toUpperCase().equals("ADD")) {

            if (StringUtility.isNotEmpty(remoteSourcePO.getFormDataRelation())) {
                formDataRelationPOList = JsonUtility.toObjectList(remoteSourcePO.getFormDataRelation(), FormDataRelationPO.class);

                recordData=dataStorageRuntimeService.getStorageDate(session,recordId,formDataRelationPOList);

            } else {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "该表单未设置数据关系!");
            }
        }

        DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO=new DynamicBindHTMLControlContextPO();
        dynamicBindHTMLControlContextPO.setRecordId(recordId);
        dynamicBindHTMLControlContextPO.setRemoteSourcePO(remoteSourcePO);
        dynamicBindHTMLControlContextPO.setListButtonEntity(listButtonEntity);
        dynamicBindHTMLControlContextPO.setFullRecordData(recordData);
        dynamicBindHTMLControlContextPO.setMainRecordData((Map) recordData.get(DataStorageRuntimeServiceImpl.MAIN_RECORD_KEY));

        String formHtmlRuntime=htmlRuntimeResolve.dynamicBind(JB4DCSessionUtility.getSession(),remoteSourcePO.getFormId(),remoteSourcePO.getFormHtmlResolve(),dynamicBindHTMLControlContextPO);

        FormResourceComplexPO formResourceComplexPO=new FormResourceComplexPO(remoteSourcePO,formHtmlRuntime,recordData,listButtonEntity);

        return formResourceComplexPO;
    }
}
