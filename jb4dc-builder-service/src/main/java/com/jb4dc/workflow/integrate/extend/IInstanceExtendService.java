package com.jb4dc.workflow.integrate.extend;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.po.SimplePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.po.*;
import com.jb4dc.workflow.po.receive.ClientSelectedReceiver;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IInstanceExtendService extends IBaseService<InstanceEntity> {

    FlowInstanceRuntimePO getInstanceRuntimePOWithStart(JB4DCSession session, String modelKey) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException;

    FlowInstanceRuntimePO getInstanceRuntimePOWithProcessTask(JB4DCSession jb4DCSession, String extaskId) throws JBuild4DCGenerallyException, JAXBException, IOException, XMLStreamException;

    FlowInstanceRuntimePO getInstanceRuntimePOWithEndTask(JB4DCSession jb4DCSession, String extaskId) throws XMLStreamException, JAXBException, IOException, JBuild4DCGenerallyException;

    PageInfo<InstancePO> getMyManageEnableInstance(JB4DCSession jb4DCSession, int pageNum, int pageSize) throws IOException;

    ResolveNextPossibleFlowNodePO resolveNextPossibleFlowNode(JB4DCSession jb4DCSession, String modelKey, String currentTaskId, String currentNodeKey, String actionCode, Map<String, Object> vars) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException;

    TaskActionResult completeTask(JB4DCSession session, boolean isStartInstanceStatus, String instanceId, String modelId, String modelReKey, String currentTaskId, String currentNodeKey, String currentNodeName, String actionCode, Map<String, Object> vars, List<ClientSelectedReceiver> clientSelectedReceiverList, String businessKey, String instanceTitle, String instanceDesc) throws JBuild4DCGenerallyException;

    FlowInstanceRuntimePO getInstanceRuntimePOByInstanceId(JB4DCSession jb4DCSession, String instanceId) throws JBuild4DCGenerallyException, JAXBException, IOException, XMLStreamException;

    FlowInstanceRuntimePO updateInstanceToVersion(JB4DCSession jb4DSession, String instanceId, String newModelReId) throws JBuild4DCGenerallyException, JAXBException, IOException, XMLStreamException;

    TaskActionResult completeTaskEnable(JB4DCSession jb4DCSession, boolean isStartInstanceStatus, String modelId, String modelReKey, String currentTaskId, String currentNodeKey, String currentNodeName, String actionCode, Map<String, Object> vars, List<ClientSelectedReceiver> clientSelectedReceiverList, String businessKey, String instanceTitle, String instanceDesc);

    //SimplePO recallMySendTaskEnable(JB4DCSession jb4DCSession, String userId, String organId, String extaskId) throws JBuild4DCGenerallyException, XMLStreamException, JAXBException, IOException;

    TaskActionResult recallMySendTask(JB4DCSession jb4DCSession, String userId, String organId, String extaskId) throws JBuild4DCGenerallyException;

    void clearData(JB4DCSession jb4DCSession,ClearDataPO clearDataPO) throws JBuild4DCGenerallyException;
}