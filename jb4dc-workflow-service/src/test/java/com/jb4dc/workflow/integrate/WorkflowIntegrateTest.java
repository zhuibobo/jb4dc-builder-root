package com.jb4dc.workflow.integrate;


import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import org.junit.Assert;
import org.junit.Test;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */

public class WorkflowIntegrateTest {

    @Test
    public void parseToPO() throws JAXBException, XMLStreamException, FileNotFoundException {

        InputStream is=new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject13\\src\\main\\resources\\bpmn\\P004_001_发文流程.bpmn");

        //RepositoryService repositoryService = processEngine.getRepositoryService();
        //repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addClasspathResource("bpmn/P004_001_发文流程.bpmn").deploy();

        WorkflowIntegrate workflowIntegrate=new WorkflowIntegrate();
        BpmnDefinitions bpmnDefinitions=workflowIntegrate.parseToPO(is);

        Assert.assertEquals("发文流程",bpmnDefinitions.getBpmnProcess().getName());
        Assert.assertEquals("发文流程V1",bpmnDefinitions.getBpmnProcess().getVersionTag());

        System.out.println(XMLUtility.toXMLString(bpmnDefinitions));
    }
}
