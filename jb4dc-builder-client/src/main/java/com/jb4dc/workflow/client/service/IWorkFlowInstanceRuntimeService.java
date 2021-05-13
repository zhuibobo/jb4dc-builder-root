package com.jb4dc.workflow.client.service;

import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.BpmnUserTask;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IWorkFlowInstanceRuntimeService extends IWorkFlowRuntimeService {


    JBuild4DCResponseVo<List<BpmnTask>> resolveNextPossibleUseTaskWithStartNode(JB4DCSession jb4DCSession,
                                                                                String modelRuKey,
                                                                                String flowModelRuntimePOCacheKey,
                                                                                FormRecordComplexPO formRecordComplexPO, Map<String, Object> exVars) throws IOException, JBuild4DCGenerallyException;
}
