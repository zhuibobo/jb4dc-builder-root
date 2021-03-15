package com.jb4dc.builder.workflow.integrate.impl;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dao.flow.FlowIntegratedMapper;
import com.jb4dc.builder.workflow.integrate.IWFTaskIntegratedService;
import com.jb4dc.builder.workflow.utility.CamundaBpmnUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.impl.javax.el.ExpressionFactory;
import org.camunda.bpm.engine.impl.javax.el.PropertyNotFoundException;
import org.camunda.bpm.engine.impl.javax.el.ValueExpression;
import org.camunda.bpm.engine.impl.juel.ExpressionFactoryImpl;
import org.camunda.bpm.engine.impl.juel.SimpleContext;
import org.camunda.bpm.engine.impl.juel.SimpleResolver;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.SequenceFlow;
import org.camunda.bpm.model.bpmn.instance.UserTask;
import org.camunda.bpm.model.xml.instance.ModelElementInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@Service
public class WFTaskIntegratedServiceImpl extends WFCamundaIntegrateAbstractService implements IWFTaskIntegratedService {

    private Logger logger= LoggerFactory.getLogger(WFTaskIntegratedServiceImpl.class);

    public WFTaskIntegratedServiceImpl(FlowIntegratedMapper _defaultBaseMapper) {
        super(_defaultBaseMapper);
    }


    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, Object entity) throws JBuild4DCGenerallyException {
        return 0;
    }
}
