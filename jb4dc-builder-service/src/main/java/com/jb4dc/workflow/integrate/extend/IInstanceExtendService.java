package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.po.CompleteTaskResult;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.BpmnUserTask;
import com.jb4dc.workflow.po.receive.ClientSelectedReceiver;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IInstanceExtendService extends IBaseService<InstanceEntity> {

    FlowInstanceRuntimePO getRuntimeModelWithStart(JB4DCSession session, String modelKey) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException;

    FlowInstanceRuntimePO getRuntimeModelWithProcess(JB4DCSession jb4DCSession, String extaskId) throws JBuild4DCGenerallyException, JAXBException, IOException, XMLStreamException;

    List<BpmnTask> resolveNextPossibleFlowNode(JB4DCSession jb4DCSession, String modelKey,String instanceId, String currentNodeKey, String actionCode, Map<String, Object> vars) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException;

    CompleteTaskResult completeTask(JB4DCSession session, boolean isStartInstanceStatus, String modelId, String modelReKey, String currentTaskId, String currentNodeKey, String currentNodeName, String actionCode, Map<String, Object> vars, List<ClientSelectedReceiver> clientSelectedReceiverList, String businessKey,String instanceTitle,String instanceDesc) throws JBuild4DCGenerallyException;

}