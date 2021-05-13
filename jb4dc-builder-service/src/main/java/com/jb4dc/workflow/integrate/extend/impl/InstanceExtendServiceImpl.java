package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.InstanceMapper;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.integrate.engine.utility.CamundaBpmnUtility;
import com.jb4dc.workflow.integrate.extend.IInstanceExtendService;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.integrate.extend.IReceiverRuntimeResolve;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.BpmnUserTask;
import org.camunda.bpm.model.bpmn.instance.Task;
import org.camunda.bpm.model.bpmn.instance.UserTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InstanceExtendServiceImpl extends BaseServiceImpl<InstanceEntity> implements IInstanceExtendService
{
    @Autowired
    IModelIntegratedExtendService modelIntegratedExtendService;

    @Autowired
    IReceiverRuntimeResolve receiverRuntimeResolve;

    InstanceMapper instanceMapper;
    public InstanceExtendServiceImpl(InstanceMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        instanceMapper=_defaultBaseMapper;
    }

    private String buildLastActionVarValue(String currentNodeKey,String actionCode){
        return "__$FlowAction$$"+currentNodeKey+"$$"+actionCode+"$";
    }

    private String getLastActionVarKey(){
        return "LastActionKey";
    }

    private Map<String,Object> appendFlowDefaultVar(Map<String, Object> vars,String currentNodeKey,String actionCode){
        vars.put(getLastActionVarKey(),buildLastActionVarValue(currentNodeKey,actionCode));
        return vars;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, InstanceEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<InstanceEntity>() {
            @Override
            public InstanceEntity run(JB4DCSession jb4DCSession,InstanceEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public List<BpmnTask> resolveNextPossibleUseTaskWithStartNode(JB4DCSession jb4DCSession, String modelKey,String currentNodeKey,String actionCode, Map<String, Object> vars) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException {

        vars = appendFlowDefaultVar(vars, currentNodeKey, actionCode);

        List<Task> userTaskList = CamundaBpmnUtility.getNextPossibleUseTaskWithStartNode(modelKey, vars);
        if (userTaskList != null && userTaskList.size() > 0) {
            List<String> bpmnTaskIdList = userTaskList.stream().map(item -> item.getId()).collect(Collectors.toList());
            BpmnDefinitions bpmnDefinitions = modelIntegratedExtendService.getDeployedCamundaModelBpmnDefinitionsLastVersion(jb4DCSession, modelKey);
            List<BpmnTask> bpmnTaskList = modelIntegratedExtendService.getLastDeployedCamundaModelBpmnTaskByIdList(jb4DCSession, modelKey, bpmnDefinitions, bpmnTaskIdList);
            bpmnTaskList = receiverRuntimeResolve.resolveToActualUser(jb4DCSession,"", bpmnDefinitions, bpmnTaskList, vars);

            return bpmnTaskList;
        }
        return new ArrayList<>();
    }
}