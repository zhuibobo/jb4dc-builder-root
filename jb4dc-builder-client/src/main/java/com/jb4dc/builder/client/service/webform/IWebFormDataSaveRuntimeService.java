package com.jb4dc.builder.client.service.webform;

import com.jb4dc.builder.po.SubmitResultPO;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
public interface IWebFormDataSaveRuntimeService {
    SubmitResultPO SaveFormRecordComplexPO(JB4DCSession jb4DCSession, String recordId, FormRecordComplexPO formRecordComplexPO, String listButtonId, String innerFormButtonId,String operationTypeName) throws JBuild4DCGenerallyException, IOException, JBuild4DCSQLKeyWordException;

    List<FormRecordDataRelationPO> getFormRecordComplexPO(JB4DCSession session, String recordId, List<FormRecordDataRelationPO> formRecordDataRelationPOList);
}
