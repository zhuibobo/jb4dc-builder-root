package com.jb4dc.builder.client.service.webform.impl;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.service.api.IApiRuntimeService;
import com.jb4dc.builder.client.service.webform.IWebFormDataSaveRuntimeService;
import com.jb4dc.builder.client.service.weblist.IWebListButtonRuntimeResolveService;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.SubmitResultPO;
import com.jb4dc.builder.po.button.InnerFormButtonConfig;
import com.jb4dc.builder.po.button.InnerFormButtonConfigAPI;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
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

    @Override
    @Transactional(rollbackFor= JBuild4DCGenerallyException.class)
    public SubmitResultPO SaveFormRecordComplexPO(JB4DCSession session, String recordId, FormRecordComplexPO formRecordComplexPO, String listButtonId, String innerFormButtonId) throws JBuild4DCGenerallyException, IOException {
        SubmitResultPO submitResultPO=new SubmitResultPO();

        ListButtonEntity listButtonEntity=webListButtonRuntimeResolveService.getButtonPO(listButtonId);
        List<InnerFormButtonConfig> innerFormButtonConfigList= JsonUtility.toObjectListIgnoreProp(listButtonEntity.getButtonInnerConfig(),InnerFormButtonConfig.class);
        InnerFormButtonConfig innerFormButtonConfig=innerFormButtonConfigList.parallelStream().filter(item->item.id.equals(innerFormButtonId)).findFirst().get();

        //执行前置API
        if(innerFormButtonConfig.getApis()!=null&&innerFormButtonConfig.getApis().size()>0){
            List<InnerFormButtonConfigAPI> beforeApiList=innerFormButtonConfig.getApis().parallelStream().filter(item->item.getRunTime().equals("之前")).collect(Collectors.toList());
            for (InnerFormButtonConfigAPI innerFormButtonConfigAPI : beforeApiList) {
                ApiItemEntity apiItemEntity=apiRuntimeService.getApiPOByValue(innerFormButtonConfigAPI.getValue());
            }
        }

        //保存数据

        //修改字段

        //执行后置API
        if(innerFormButtonConfig.getApis()!=null&&innerFormButtonConfig.getApis().size()>0){
            List<InnerFormButtonConfigAPI> afterApiList=innerFormButtonConfig.getApis().parallelStream().filter(item->item.getRunTime().equals("之后")).collect(Collectors.toList());
            for (InnerFormButtonConfigAPI innerFormButtonConfigAPI : afterApiList) {
                ApiItemEntity apiItemEntity=apiRuntimeService.getApiPOByValue(innerFormButtonConfigAPI.getValue());
            }
        }

        return submitResultPO;
    }

    //public
}
