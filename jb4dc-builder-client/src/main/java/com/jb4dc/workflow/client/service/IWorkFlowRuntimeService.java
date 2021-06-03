package com.jb4dc.workflow.client.service;

import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcAction;

import java.io.IOException;
import java.util.Map;

public interface IWorkFlowRuntimeService {
    //Jb4dcAction findAction(BpmnDefinitions bpmnDefinitions, String currentNodeKey, String actionCode);

    //Map<String, Object> resolveStringToJuelVariables(JB4DCSession jb4DCSession, String juelExpression, FormRecordComplexPO formRecordComplexPO, FlowInstanceRuntimePO flowInstanceRuntimePO) throws IOException, JBuild4DCGenerallyException;

    //Map<String, Object> parseFormRecordComplexPOToJuelVars(JB4DCSession jb4DCSession, FormRecordComplexPO formRecordComplexPO);

    //Map<String, Object> parseFlowModelRuntimePOToJuelVars(JB4DCSession jb4DCSession, FlowInstanceRuntimePO flowInstanceRuntimePO);

    Map<String, Object> parseDefaultFlowInstanceRuntimePOToJuelVars(JB4DCSession jb4DCSession, FlowInstanceRuntimePO flowInstanceRuntimePO, FormRecordComplexPO formRecordComplexPO,String currentNodeKey,String actionCode) throws JBuild4DCGenerallyException, IOException;
}
