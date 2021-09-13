package com.jb4dc.workflow.integrate.engine.impl;

import org.camunda.bpm.engine.ProcessEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/8
 * To change this template use File | Settings | File Templates.
 */
@Service
/*@Lazy*/
public class CamundaIntegrate {
    public static ProcessEngine processEngine;

    @Autowired
    public CamundaIntegrate(@Lazy ProcessEngine _processEngine) {
        processEngine=_processEngine;
    }

    public static ProcessEngine getProcessEngine() {
        return processEngine;
    }

    public static void setProcessEngine(ProcessEngine processEngine) {
        CamundaIntegrate.processEngine = processEngine;
    }
}
