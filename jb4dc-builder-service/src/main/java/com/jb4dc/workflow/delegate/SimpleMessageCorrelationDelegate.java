package com.jb4dc.workflow.delegate;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.bpm.model.bpmn.instance.MessageEventDefinition;
import org.camunda.bpm.model.bpmn.instance.ThrowEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SimpleMessageCorrelationDelegate implements JavaDelegate {
    private static final Logger logger = LoggerFactory.getLogger(SimpleMessageCorrelationDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        logger.info("Passing: {}", execution.getCurrentActivityName());

        ThrowEvent messageEvent = (ThrowEvent) execution.getBpmnModelElementInstance();
        MessageEventDefinition messageEventDefinition = (MessageEventDefinition) messageEvent
                .getEventDefinitions().iterator().next();
        String receivingMessageName = messageEventDefinition.getMessage().getName();
        logger.info("Message: {} :correlate begin", receivingMessageName);

        execution.getProcessEngineServices()
                .getRuntimeService()
                .createMessageCorrelation(receivingMessageName)
                .correlate();

        //execution.getProcessEngineServices().getRuntimeService().messageEventReceived(receivingMessageName,execution.getId());

        logger.info("Message: {} :correlate end", receivingMessageName);
    }
}
