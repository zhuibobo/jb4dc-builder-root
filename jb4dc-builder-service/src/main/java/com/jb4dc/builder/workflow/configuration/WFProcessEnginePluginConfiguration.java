package com.jb4dc.builder.workflow.configuration;

import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.cfg.ProcessEnginePlugin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.camunda.bpm.spring.boot.starter.configuration.Ordering;

@Component
@Order(Ordering.DEFAULT_ORDER + 1)
public class WFProcessEnginePluginConfiguration implements ProcessEnginePlugin {


    @Override
    public void preInit(ProcessEngineConfigurationImpl processEngineConfiguration) {
        System.out.println("1111111111111111preInit1111111111111111");
    }

    @Override
    public void postInit(ProcessEngineConfigurationImpl processEngineConfiguration) {
        System.out.println("2222222222222222preInit22222222222222222");
    }

    @Override
    public void postProcessEngineBuild(ProcessEngine processEngine) {
        //processEngine.getProcessEngineConfiguration().property
    }

}
