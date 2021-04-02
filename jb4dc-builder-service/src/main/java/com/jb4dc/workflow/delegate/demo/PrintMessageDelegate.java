package com.jb4dc.workflow.delegate.demo;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

public class PrintMessageDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) throws Exception {
        execution.setVariable("act","经办人1");
        System.out.println("------------------------execution.getBusinessKey():"+execution.getBusinessKey()+"------------------------");
        System.out.println("------------------------execution.getCurrentActivityName():"+execution.getCurrentActivityName()+"------------------------");
    }
}
