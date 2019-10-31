package com.jb4dc.builder.client.service.webform.impl;

import com.jb4dc.builder.client.service.webform.IWebFormDataSaveRuntimeService;
import com.jb4dc.builder.po.SubmitResultPO;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
public class WebFormDataSaveRuntimeServiceImpl implements IWebFormDataSaveRuntimeService {

    @Override
    public SubmitResultPO SaveFormRecordComplexPO(JB4DCSession session, String recordId, FormRecordComplexPO formRecordComplexPO, String listButtonId, String innerFormButtonId){
        SubmitResultPO submitResultPO=new SubmitResultPO();



        return submitResultPO;
    }

}
