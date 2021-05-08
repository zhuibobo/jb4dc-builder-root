package com.jb4dc.workflow.client.service;

import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.FlowModelRuntimePO;

import java.io.IOException;
import java.util.Map;

public interface IWorkFlowRuntimeService {
    Map<String,Object> resolveStringToJuelVariables(JB4DCSession jb4DCSession, String juelExpression, FormRecordComplexPO formRecordComplexPO, FlowModelRuntimePO flowModelRuntimePO) throws IOException, JBuild4DCGenerallyException;

    Map<String, Object> parseFormRecordComplexPOToJuelVars(JB4DCSession jb4DCSession, FormRecordComplexPO formRecordComplexPO);

    Map<String,Object> parseFlowModelRuntimePOToJuelVars(JB4DCSession jb4DCSession, FlowModelRuntimePO flowModelRuntimePO);
}
