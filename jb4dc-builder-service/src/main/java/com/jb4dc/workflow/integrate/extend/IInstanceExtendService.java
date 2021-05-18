package com.jb4dc.workflow.integrate.extend;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.BpmnUserTask;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IInstanceExtendService extends IBaseService<InstanceEntity> {

    List<BpmnTask> resolveNextPossibleFlowNodeWithStartNode(JB4DCSession jb4DCSession, String modelKey, String currentNodeKey, String actionCode, Map<String, Object> vars) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException;
}