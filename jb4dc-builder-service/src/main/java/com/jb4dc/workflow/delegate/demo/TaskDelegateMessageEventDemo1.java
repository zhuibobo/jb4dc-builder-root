package com.jb4dc.workflow.delegate.demo;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

import java.util.HashMap;

public class TaskDelegateMessageEventDemo1 implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) throws Exception {
        execution.setVariable("act","经办人1");
        System.out.println("------------------------execution.getBusinessKey():"+execution.getBusinessKey()+"------------------------");
        System.out.println("------------------------execution.getCurrentActivityName():"+execution.getCurrentActivityName()+"------------------------");
        HashMap vars=new HashMap<>();
        vars.put("JB2UserId","JB2UserId02");
        execution.getProcessEngine().getRuntimeService().messageEventReceived("Message_2omahq6",execution.getId(),vars);
        //execution.getProcessEngine().getRuntimeService().sig();
    }
}
