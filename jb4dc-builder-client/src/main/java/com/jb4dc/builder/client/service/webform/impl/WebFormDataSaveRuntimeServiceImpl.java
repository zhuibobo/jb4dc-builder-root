package com.jb4dc.builder.client.service.webform.impl;

import com.jb4dc.builder.client.service.webform.IWebFormDataSaveRuntimeService;
import com.jb4dc.builder.client.service.weblist.IWebListButtonRuntimeResolveService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.SubmitResultPO;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Override
    public SubmitResultPO SaveFormRecordComplexPO(JB4DCSession session, String recordId, FormRecordComplexPO formRecordComplexPO, String listButtonId, String innerFormButtonId) throws JBuild4DCGenerallyException {
        SubmitResultPO submitResultPO=new SubmitResultPO();

        ListButtonEntity listButtonEntity=webListButtonRuntimeResolveService.getButtonPO(listButtonId);


        return submitResultPO;
    }

}
