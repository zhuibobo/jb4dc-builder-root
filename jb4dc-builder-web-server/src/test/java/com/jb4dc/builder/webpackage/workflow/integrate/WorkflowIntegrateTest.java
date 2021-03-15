package com.jb4dc.builder.webpackage.workflow.integrate;


import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.webpackage.RestTestBase;
import com.jb4dc.builder.workflow.exenum.ModelDesignSourceTypeEnum;
import com.jb4dc.builder.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.builder.workflow.integrate.IWFModelIntegratedService;
import com.jb4dc.builder.workflow.integrate.IWFTaskIntegratedService;
import com.jb4dc.builder.workflow.integrate.IWFExecutionIntegratedService;
import com.jb4dc.builder.workflow.integrate.IWFInstanceIntegratedService;
import com.jb4dc.builder.workflow.integrate.impl.CamundaIntegrate;
import com.jb4dc.builder.workflow.integrate.impl.WFModelIntegrateServiceImpl;
import com.jb4dc.builder.workflow.custpo.bpmn.BpmnDefinitions;
import com.jb4dc.builder.workflow.utility.CamundaBpmnUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.runtime.Execution;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.runtime.ProcessInstanceQuery;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.engine.task.TaskQuery;
import org.camunda.bpm.model.bpmn.instance.FlowNode;
import org.camunda.bpm.model.bpmn.instance.SequenceFlow;
import org.camunda.bpm.model.bpmn.instance.UserTask;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */

public class WorkflowIntegrateTest extends RestTestBase {

    @Autowired
    IWFTaskIntegratedService iwfTaskIntegratedService;

    @Autowired
    IWFExecutionIntegratedService iwfExecutionIntegratedService;

    @Autowired
    IWFInstanceIntegratedService iwfInstanceIntegratedService;

    @Autowired
    IWFModelIntegratedService iwfModelIntegratedService;

    @Autowired
    ProcessEngine processEngine;

    @Test
    public void parseToPO() throws JAXBException, XMLStreamException, FileNotFoundException {

        InputStream is=new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject13\\src\\main\\resources\\bpmn\\P004_001_发文流程_解析XML模型用.bpmn");

        //RepositoryService repositoryService = processEngine.getRepositoryService();
        //repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addClasspathResource("bpmn/P004_001_发文流程.bpmn").deploy();

        WFModelIntegrateServiceImpl workflowIntegrate=new WFModelIntegrateServiceImpl(null);
        BpmnDefinitions bpmnDefinitions=workflowIntegrate.parseToPO(is);

        Assert.assertEquals("发文流程",bpmnDefinitions.getBpmnProcess().getName());
        Assert.assertEquals("发文流程V1",bpmnDefinitions.getBpmnProcess().getVersionTag());
        Assert.assertEquals("P004_001",bpmnDefinitions.getBpmnProcess().getId());

        System.out.println(XMLUtility.toXMLString(bpmnDefinitions));
    }

    @Test
    public void processEngineVersion() throws JAXBException, XMLStreamException, FileNotFoundException {
        //ProcessEngine processEngine= CamundaIntegrate.processEngine;
        String databaseVersion=processEngine.getProcessEngineConfiguration().getDatabaseVersion();
        System.out.println(databaseVersion);
        //iwfTaskIntegratedService.
    }

    public static ProcessInstanceQuery deleteAllProcessInstance(RuntimeService runtimeService) {
        ProcessInstanceQuery processInstanceQuery = runtimeService.createProcessInstanceQuery();
        for (ProcessInstance processInstance : processInstanceQuery.list()) {
            runtimeService.deleteProcessInstance(processInstance.getId(),"unit-test");
        }
        return processInstanceQuery;
    }

    @Test
    public void NextPossibleUseTaskTest1() throws FileNotFoundException {
        CamundaIntegrate.setProcessEngine(processEngine);
        ProcessEngine processEngine= CamundaIntegrate.getProcessEngine();
        ((ProcessEngineConfigurationImpl)processEngine.getProcessEngineConfiguration()).getBeans();
        InputStream is=new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V1.bpmn");

        RepositoryService repositoryService = processEngine.getRepositoryService();
        repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addInputStream("P004_002_bpmn",is).deploy();

        deleteAllProcessInstance(processEngine.getRuntimeService());

        RuntimeService runtimeService=processEngine.getRuntimeService();
        runtimeService.startProcessInstanceByKey("P004_002","P004_002_bpmn");

        TaskService taskService=processEngine.getTaskService();
        TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee("起草人");
        Task task=taskQuery.singleResult();
        Assert.assertEquals("起草",task.getName());

        //WFTaskIntegratedServiceImpl wfTaskIntegratedService=new WFTaskIntegratedServiceImpl();
        List<SequenceFlow> outgoingSequenceFlow = CamundaBpmnUtility.getOutgoingSequenceFlow(task.getProcessDefinitionId(),"Task_1uhc294");
        System.out.println(outgoingSequenceFlow.get(0).getTarget().getElementType());
        System.out.println(outgoingSequenceFlow);

        Map<String,Object> vars=new HashMap<>();
        vars.put("act","送负责人");
        vars.put("level",1);

        List<UserTask> userTasks = CamundaBpmnUtility.getNextPossibleUseTask(task,vars);
        Assert.assertEquals(2,userTasks.size());
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("相关负责人")));
        //Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("相关负责人2")));
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("相关负责人1")));
        //wfTaskIntegratedService.getSequenceFlow(task.getProcessDefinitionId(),"Task_1uhc294");

        vars=new HashMap<>();
        vars.put("act","送负责人");
        vars.put("level",6);

        userTasks = CamundaBpmnUtility.getNextPossibleUseTask(task,vars);
        Assert.assertEquals(3,userTasks.size());
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("相关负责人")));
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("相关负责人2")));
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("相关负责人1")));
        UserTask abUserTask1=userTasks.stream().filter(us->us.getName().equals("相关负责人1")).findFirst().get();
        Assert.assertEquals(false, CamundaBpmnUtility.isSequential(abUserTask1));
        Assert.assertEquals(false, CamundaBpmnUtility.isMultiInstance(abUserTask1));
        Assert.assertEquals(false, CamundaBpmnUtility.isParallel(abUserTask1));

        //Integer.parseInt()
        vars=new HashMap<>();
        vars.put("act","送部门负责人");
        vars.put("level",6);

        userTasks = CamundaBpmnUtility.getNextPossibleUseTask(task,vars);
        Assert.assertEquals(2,userTasks.size());
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("部门负责人1")));
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("部门负责人2")));
        UserTask depLUserTask=userTasks.stream().filter(us->us.getName().equals("部门负责人1")).findFirst().get();
        Assert.assertEquals(true, CamundaBpmnUtility.isMultiInstance(depLUserTask));
        Assert.assertEquals(true, CamundaBpmnUtility.isSequential(depLUserTask));
        depLUserTask=userTasks.stream().filter(us->us.getName().equals("部门负责人2")).findFirst().get();
        Assert.assertEquals(true, CamundaBpmnUtility.isMultiInstance(depLUserTask));
        Assert.assertEquals(false, CamundaBpmnUtility.isSequential(depLUserTask));
        Assert.assertEquals(true, CamundaBpmnUtility.isParallel(depLUserTask));

        vars=new HashMap<>();
        vars.put("act","送分管领导");
        vars.put("level",6);

        userTasks = CamundaBpmnUtility.getNextPossibleUseTask(task,vars);
        Assert.assertEquals(1,userTasks.size());
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("分管领导")));
    }

    @Test
    public void NextPossibleUseTaskTest2() throws FileNotFoundException {
        CamundaIntegrate.setProcessEngine(processEngine);
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        ((ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration()).getBeans();
        InputStream is = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2.bpmn");

        RepositoryService repositoryService = processEngine.getRepositoryService();
        repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addInputStream("P004_002_bpmn", is).deploy();

        deleteAllProcessInstance(processEngine.getRuntimeService());

        RuntimeService runtimeService = processEngine.getRuntimeService();
        runtimeService.startProcessInstanceByKey("P004_002", "P004_002_bpmn");

        TaskService taskService = processEngine.getTaskService();
        TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee("起草人");
        Task task = taskQuery.singleResult();

        //完成起草环节
        Map<String, Object> vars = new HashMap<>();
        vars.put("UserId", "User002");
        vars.put("UserName", "alex");
        vars.put("act", "送核稿");
        //taskService.setVariablesLocal(task.getId(),vars);
        taskService.complete(task.getId(),vars);

        //核稿环节
        taskQuery = taskService.createTaskQuery().taskAssignee("User002");
        task = taskQuery.singleResult();
        Assert.assertEquals("核稿",task.getName());
        FlowNode flowNode=CamundaBpmnUtility.getFlowNode(task);
        Assert.assertEquals("11111",flowNode.getDocumentations().iterator().next().getTextContent());
        //System.out.println(task.getDescription());

        //获取可能环节
        vars=new HashMap<>();
        vars.put("UserId", "User003");
        List<UserTask> userTasks = CamundaBpmnUtility.getNextPossibleUseTask(task,vars);
        Assert.assertEquals(1,userTasks.size());
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("经办人1")));

        vars=new HashMap<>();
        vars.put("UserId", "User003");
        vars.put("act", "送经办人2");
        userTasks = CamundaBpmnUtility.getNextPossibleUseTask(task,vars);
        Assert.assertEquals(1,userTasks.size());
        Assert.assertEquals(true,userTasks.stream().anyMatch(us->us.getName().equals("经办人2")));

        //送到经办人2
        vars = new HashMap<>();
        vars.put("UserId", "User003");
        vars.put("UserName", "alex");
        vars.put("act", "送经办人2");
        taskService.complete(task.getId(), vars);

        taskQuery = taskService.createTaskQuery().taskAssignee("User003");
        Assert.assertEquals(1,taskQuery.count());
        task = taskQuery.singleResult();
        Assert.assertEquals("经办人2",task.getName());

        //送到核稿
        vars = new HashMap<>();
        vars.put("UserId", "User002");
        vars.put("UserName", "alex");
        taskService.complete(task.getId(), vars);

        taskQuery = taskService.createTaskQuery().taskAssignee("User002");
        Assert.assertEquals(1,taskQuery.count());
        task = taskQuery.singleResult();
        Assert.assertEquals("核稿",task.getName());

        //送到经办人1
        vars = new HashMap<>();
        vars.put("UserId", "User003");
        vars.put("UserName", "alex");
        vars.put("act", "");
        Map<String, Object> values=taskService.getVariables(task.getId());

        taskService.complete(task.getId(), vars);

        taskQuery = taskService.createTaskQuery().taskAssignee("User003");
        Assert.assertEquals(1,taskQuery.count());
        task = taskQuery.singleResult();
        Assert.assertEquals("经办人1",task.getName());

        Assert.assertEquals(false,iwfExecutionIntegratedService.isMultiInstance(getSession(),task.getExecutionId()));
    }

    @Test
    public void SequentialUserTaskTest1() throws FileNotFoundException {
        CamundaIntegrate.setProcessEngine(processEngine);
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        ((ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration()).getBeans();
        InputStream is = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2.bpmn");

        RepositoryService repositoryService = processEngine.getRepositoryService();
        repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addInputStream("P004_002_bpmn", is).deploy();

        deleteAllProcessInstance(processEngine.getRuntimeService());

        RuntimeService runtimeService = processEngine.getRuntimeService();
        runtimeService.startProcessInstanceByKey("P004_002", "P004_002_bpmn");

        TaskService taskService = processEngine.getTaskService();

        TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee("起草人");
        Task task = taskQuery.singleResult();

        //串行处理,设置Collection集合对象,设置Collection的Element Variable的变量为assignee,作为接受人的${assignee}变量
        Map<String,Object> vars=new HashMap<>();
        vars.put("act","送部门负责人");
        List<String> assigneeList=new ArrayList<>();
        assigneeList.add("User003");
        assigneeList.add("User004");
        assigneeList.add("User005");
        assigneeList.add("User006");
        assigneeList.add("User007");
        vars.put("assigneeList",assigneeList);
        taskService.complete(task.getId(),vars);

        //多人实例数量
        //List<Execution> executionList=processEngine.getRuntimeService().createProcessInstanceQuery().active().processInstanceBusinessKey("P004_002_bpmn").list();
        List<ProcessInstance> processInstance=processEngine.getRuntimeService().createProcessInstanceQuery().active().processInstanceBusinessKey("P004_002_bpmn").list();
        List<Execution> executionList=processEngine.getRuntimeService().createExecutionQuery().processInstanceId(processInstance.get(0).getId()).list();
        Assert.assertEquals(1,processInstance.size());

        Execution newEx=executionList.stream().filter(ex->!((ExecutionEntity)ex).isProcessInstanceExecution()).findFirst().get();

        Assert.assertEquals(true,iwfExecutionIntegratedService.isMultiInstance(getSession(),newEx.getId()));

        Assert.assertEquals(5,iwfExecutionIntegratedService.multiCountInstances(getSession(),newEx.getId()));
        Assert.assertEquals(0,iwfExecutionIntegratedService.multiCompletedInstances(getSession(),newEx.getId()));
        Assert.assertEquals(1,iwfExecutionIntegratedService.multiActiveInstances(getSession(),newEx.getId()));

        taskQuery = taskService.createTaskQuery().taskAssignee("User003");
        Task taskUser003 = taskQuery.singleResult();
        Assert.assertEquals("部门负责人1",taskUser003.getName());

        taskQuery = taskService.createTaskQuery().taskAssignee("User004");
        task = taskQuery.singleResult();
        Assert.assertEquals(null,task);

        taskService.complete(taskUser003.getId(),vars);

        taskQuery = taskService.createTaskQuery().taskAssignee("User004");
        task = taskQuery.singleResult();
        Assert.assertEquals("部门负责人1",task.getName());

        Assert.assertEquals(5,iwfExecutionIntegratedService.multiCountInstances(getSession(),newEx.getId()));
        Assert.assertEquals(1,iwfExecutionIntegratedService.multiCompletedInstances(getSession(),newEx.getId()));
        Assert.assertEquals(1,iwfExecutionIntegratedService.multiActiveInstances(getSession(),newEx.getId()));
    }

    @Test
    public void ParallelUserTaskTest1() throws FileNotFoundException {
        CamundaIntegrate.setProcessEngine(processEngine);
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        ((ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration()).getBeans();
        InputStream is = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2.bpmn");

        RepositoryService repositoryService = processEngine.getRepositoryService();
        repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addInputStream("P004_002_bpmn", is).deploy();

        deleteAllProcessInstance(processEngine.getRuntimeService());

        RuntimeService runtimeService = processEngine.getRuntimeService();
        runtimeService.startProcessInstanceByKey("P004_002", "P004_002_bpmn");

        TaskService taskService = processEngine.getTaskService();

        TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee("起草人");
        Task task = taskQuery.singleResult();

        //串行处理,设置Collection集合对象,设置Collection的Element Variable的变量为assignee,作为接受人的${assignee}变量
        Map<String,Object> vars=new HashMap<>();
        vars.put("act","送分管领导");
        List<String> assigneeList=new ArrayList<>();
        assigneeList.add("User003");
        assigneeList.add("User004");
        assigneeList.add("User005");
        assigneeList.add("User006");
        assigneeList.add("User007");
        vars.put("assigneeList",assigneeList);
        taskService.complete(task.getId(),vars);

        //多人实例数量
        //List<Execution> executionList=processEngine.getRuntimeService().createProcessInstanceQuery().active().processInstanceBusinessKey("P004_002_bpmn").list();
        List<ProcessInstance> processInstance=processEngine.getRuntimeService().createProcessInstanceQuery().active().processInstanceBusinessKey("P004_002_bpmn").list();
        List<Execution> executionList=processEngine.getRuntimeService().createExecutionQuery().processInstanceId(processInstance.get(0).getId()).list();
        Assert.assertEquals(1,processInstance.size());

        Execution newEx=executionList.stream().filter(ex->!((ExecutionEntity)ex).isProcessInstanceExecution()).findFirst().get();

        Assert.assertEquals(true,iwfExecutionIntegratedService.isMultiInstance(getSession(),newEx.getId()));

        Assert.assertEquals(5,iwfExecutionIntegratedService.multiCountInstances(getSession(),newEx.getId()));
        Assert.assertEquals(0,iwfExecutionIntegratedService.multiCompletedInstances(getSession(),newEx.getId()));
        Assert.assertEquals(5,iwfExecutionIntegratedService.multiActiveInstances(getSession(),newEx.getId()));

        taskQuery = taskService.createTaskQuery().taskAssignee("User003");
        Task taskUser003 = taskQuery.singleResult();
        Assert.assertEquals("分管领导",taskUser003.getName());
        taskService.complete(taskUser003.getId(),vars);

        taskQuery = taskService.createTaskQuery().taskAssignee("User004");
        task = taskQuery.singleResult();
        Assert.assertEquals("分管领导",task.getName());

        Assert.assertEquals(5,iwfExecutionIntegratedService.multiCountInstances(getSession(),newEx.getId()));
        Assert.assertEquals(1,iwfExecutionIntegratedService.multiCompletedInstances(getSession(),newEx.getId()));
        Assert.assertEquals(4,iwfExecutionIntegratedService.multiActiveInstances(getSession(),newEx.getId()));
    }

    @Test
    public void ParallelUserTaskTest2() throws FileNotFoundException {
        CamundaIntegrate.setProcessEngine(processEngine);
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        ((ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration()).getBeans();
        InputStream is = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2.bpmn");

        RepositoryService repositoryService = processEngine.getRepositoryService();
        repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addInputStream("P004_002_bpmn", is).deploy();

        deleteAllProcessInstance(processEngine.getRuntimeService());

        RuntimeService runtimeService = processEngine.getRuntimeService();
        runtimeService.startProcessInstanceByKey("P004_002", "P004_002_bpmn");

        TaskService taskService = processEngine.getTaskService();

        TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee("起草人");
        Task task = taskQuery.singleResult();

        //串行处理,设置Collection集合对象,设置Collection的Element Variable的变量为assignee,作为接受人的${assignee}变量
        Map<String,Object> vars=new HashMap<>();
        vars.put("act","送分管领导");
        List<String> assigneeList=new ArrayList<>();
        assigneeList.add("User003");
        assigneeList.add("User004");
        assigneeList.add("User005");
        assigneeList.add("User006");
        assigneeList.add("User007");
        vars.put("assigneeList",assigneeList);
        vars.put("UserId","User008");
        taskService.complete(task.getId(),vars);

        ProcessInstance processInstance=iwfInstanceIntegratedService.getActiveProcessInstanceBusinessKey(getSession(),"P004_002_bpmn").get(0);
        processEngine.getRuntimeService().removeVariable(processInstance.getId(),"UserId");

        taskQuery = taskService.createTaskQuery().taskAssignee("User003");
        Task taskUser003 = taskQuery.singleResult();
        Assert.assertEquals("分管领导",taskUser003.getName());
        taskService.complete(taskUser003.getId());

        task = taskService.createTaskQuery().taskAssignee("User004").singleResult();
        taskService.complete(task.getId());

        task = taskService.createTaskQuery().taskAssignee("User005").singleResult();
        taskService.complete(task.getId());

        task = taskService.createTaskQuery().taskAssignee("User006").singleResult();
        taskService.complete(task.getId());

        vars=new HashMap<>();
        vars.put("UserId","User009");
        task = taskService.createTaskQuery().taskAssignee("User007").singleResult();
        taskService.complete(task.getId(),vars);

        task = taskService.createTaskQuery().taskAssignee("User009").singleResult();
        Assert.assertEquals("经办人1",task.getName());
    }

    @Test
    public void JumpToNoteTest1() throws FileNotFoundException, JBuild4DCGenerallyException {
        CamundaIntegrate.setProcessEngine(processEngine);
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        ((ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration()).getBeans();
        InputStream is = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2_Jump.bpmn");

        RepositoryService repositoryService = processEngine.getRepositoryService();
        repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addInputStream("P004_002_bpmn", is).deploy();

        deleteAllProcessInstance(processEngine.getRuntimeService());

        RuntimeService runtimeService = processEngine.getRuntimeService();

        Map<String,Object> vars=new HashMap<>();
        vars.put("Creater","User001");
        runtimeService.startProcessInstanceByKey("P004_002", "P004_002_bpmn",vars);

        TaskService taskService = processEngine.getTaskService();

        TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee("User001");
        Task task = taskQuery.singleResult();

        //串行处理,设置Collection集合对象,设置Collection的Element Variable的变量为assignee,作为接受人的${assignee}变量
        vars=new HashMap<>();
        vars.put("act","送分管领导");
        List<String> assigneeList=new ArrayList<>();
        assigneeList.add("User003");
        assigneeList.add("User004");
        assigneeList.add("User005");
        assigneeList.add("User006");
        assigneeList.add("User007");
        vars.put("assigneeList",assigneeList);
        vars.put("BackUserId","BackUserId001");
        //vars.put("UserId","User008");
        taskService.complete(task.getId(),vars);

        List<String> activityNodeIds= iwfExecutionIntegratedService.getCurrentActivityNodeIds(getSession(),task.getProcessInstanceId());
        String i="1";
        //iwfInstanceIntegratedService.recallProcess(task.getProcessInstanceId(),task.getId(),"Task_1uhc294");
        String jumpToActivityNodeId="Task_1uhc294";
        iwfInstanceIntegratedService.jumpToUserTaskActivityNode(getSession(),task.getProcessInstanceId(),jumpToActivityNodeId,activityNodeIds,"JumpUser001",null);

        taskQuery = taskService.createTaskQuery().taskAssignee("JumpUser001");
        task = taskQuery.singleResult();
        Assert.assertEquals("起草",task.getName());

        activityNodeIds= iwfExecutionIntegratedService.getCurrentActivityNodeIds(getSession(),task.getProcessInstanceId());
        //jumpToActivityNodeId="Task_0j813kr";
        //vars=new HashMap<>();
        //vars.put("JB1UserId","JB1UserId001");
        iwfInstanceIntegratedService.jumpToUserTaskActivityNode(getSession(),task.getProcessInstanceId(),jumpToActivityNodeId,activityNodeIds,"JumpUser002",null);

        taskQuery = taskService.createTaskQuery().taskAssignee("JumpUser002");
        task = taskQuery.singleResult();
        Assert.assertEquals("起草",task.getName());

        activityNodeIds= iwfExecutionIntegratedService.getCurrentActivityNodeIds(getSession(),task.getProcessInstanceId());
        jumpToActivityNodeId="Task_0j813kr";
        iwfInstanceIntegratedService.jumpToUserTaskActivityNode(getSession(),task.getProcessInstanceId(),jumpToActivityNodeId,activityNodeIds,"JumpUser003",null);
        taskQuery = taskService.createTaskQuery().taskAssignee("JumpUser003");
        task = taskQuery.singleResult();
        Assert.assertEquals("经办人1",task.getName());
        vars=new HashMap<>();
        vars.put("TH1UserId","TH1UserId001");
        taskService.complete(task.getId(),vars);

        jumpToActivityNodeId="Task_0l7j5un";
        activityNodeIds= iwfExecutionIntegratedService.getCurrentActivityNodeIds(getSession(),task.getProcessInstanceId());
        assigneeList=new ArrayList<>();
        assigneeList.add("User003");
        assigneeList.add("User004");
        assigneeList.add("User005");
        assigneeList.add("User006");
        assigneeList.add("User007");
        iwfInstanceIntegratedService.jumpToUserTaskActivityNode(getSession(),task.getProcessInstanceId(),jumpToActivityNodeId,activityNodeIds,assigneeList,null);
    }

    @Test
    public void recallProcessTest1() throws FileNotFoundException, JBuild4DCGenerallyException {
        CamundaIntegrate.setProcessEngine(processEngine);
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        ((ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration()).getBeans();
        InputStream is = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2_Jump.bpmn");

        RepositoryService repositoryService = processEngine.getRepositoryService();
        repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addInputStream("P004_002_bpmn", is).deploy();

        deleteAllProcessInstance(processEngine.getRuntimeService());

        RuntimeService runtimeService = processEngine.getRuntimeService();

        Map<String,Object> vars=new HashMap<>();
        vars.put("Creater","User001");
        runtimeService.startProcessInstanceByKey("P004_002", "P004_002_bpmn",vars);

        TaskService taskService = processEngine.getTaskService();

        TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee("User001");
        Task task = taskQuery.singleResult();

        //串行处理,设置Collection集合对象,设置Collection的Element Variable的变量为assignee,作为接受人的${assignee}变量
        vars=new HashMap<>();
        vars.put("act","送分管领导");
        List<String> assigneeList=new ArrayList<>();
        assigneeList.add("User003");
        assigneeList.add("User004");
        assigneeList.add("User005");
        assigneeList.add("User006");
        assigneeList.add("User007");
        vars.put("assigneeList",assigneeList);
        vars.put("BackUserId","BackUserId001");
        taskService.complete(task.getId(),vars);

        TaskQuery ldTaskQuery = taskService.createTaskQuery().taskAssignee("User003");
        Task ldTask = ldTaskQuery.singleResult();
        taskService.complete(ldTask.getId());

        iwfInstanceIntegratedService.recallProcessForUserTask(getSession(),task.getProcessInstanceId(),task.getId(),"","User001",null);
        taskQuery = taskService.createTaskQuery().taskAssignee("User001");
        task = taskQuery.singleResult();
        Assert.assertEquals("起草",task.getName());

        vars=new HashMap<>();
        vars.put("act","送分管领导");
        assigneeList=new ArrayList<>();
        assigneeList.add("User003");
        assigneeList.add("User004");
        assigneeList.add("User005");
        assigneeList.add("User006");
        assigneeList.add("User007");
        vars.put("assigneeList",assigneeList);
        vars.put("BackUserId","BackUserId001");
        taskService.complete(task.getId(),vars);

        ldTaskQuery = taskService.createTaskQuery().taskAssignee("User003");
        ldTask = ldTaskQuery.singleResult();
        taskService.complete(ldTask.getId());

        ldTaskQuery = taskService.createTaskQuery().taskAssignee("User004");
        ldTask = ldTaskQuery.singleResult();
        taskService.complete(ldTask.getId());

        iwfInstanceIntegratedService.recallProcessForUserTask(getSession(),ldTask.getProcessInstanceId(),ldTask.getId(),"","User004",null);

        Assert.assertEquals(6,iwfExecutionIntegratedService.multiCountInstances(getSession(),ldTask.getExecutionId()));
        Assert.assertEquals(2,iwfExecutionIntegratedService.multiCompletedInstances(getSession(),ldTask.getExecutionId()));
        Assert.assertEquals(4,iwfExecutionIntegratedService.multiActiveInstances(getSession(),ldTask.getExecutionId()));

        ldTaskQuery = taskService.createTaskQuery().taskAssignee("User004");
        ldTask = ldTaskQuery.singleResult();
        taskService.complete(ldTask.getId());
        ldTaskQuery = taskService.createTaskQuery().taskAssignee("User005");
        ldTask = ldTaskQuery.singleResult();
        taskService.complete(ldTask.getId());
        ldTaskQuery = taskService.createTaskQuery().taskAssignee("User006");
        ldTask = ldTaskQuery.singleResult();
        taskService.complete(ldTask.getId());

        vars=new HashMap<>();
        vars.put("JB1UserId","JB1UserId001");
        ldTaskQuery = taskService.createTaskQuery().taskAssignee("User007");
        ldTask = ldTaskQuery.singleResult();
        taskService.complete(ldTask.getId(),vars);

        taskQuery = taskService.createTaskQuery().taskAssignee("JB1UserId001");
        task = taskQuery.singleResult();
        Assert.assertEquals("经办人1",task.getName());
    }

    @Test
    public void restartProcessAndJumpToActivityNodeTest1() throws FileNotFoundException, JBuild4DCGenerallyException {
        CamundaIntegrate.setProcessEngine(processEngine);
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        ((ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration()).getBeans();
        InputStream is = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2_Restart.bpmn");

        RepositoryService repositoryService = processEngine.getRepositoryService();
        repositoryService.createDeployment().name("P004Test-NAME").source("P004Test-Source").tenantId("P004Test-TenantId").addInputStream("P004_002_bpmn", is).deploy();

        deleteAllProcessInstance(processEngine.getRuntimeService());

        RuntimeService runtimeService = processEngine.getRuntimeService();

        Map<String,Object> vars=new HashMap<>();
        vars.put("Creater","User001");
        runtimeService.startProcessInstanceByKey("P004_002", "P004_002_bpmn",vars);
        //runtimeService.startProcessInstanceById("P004_002", "P004_002_bpmn",vars);
        //runtimeService.star

        TaskService taskService = processEngine.getTaskService();

        TaskQuery taskQuery = taskService.createTaskQuery().taskAssignee("User001");
        Task task = taskQuery.singleResult();
        vars=new HashMap<>();
        vars.put("act","送负责人");
        vars.put("UserId","User002");
        taskService.complete(task.getId(),vars);

        taskQuery = taskService.createTaskQuery().taskAssignee("User002");
        task = taskQuery.singleResult();
        vars=new HashMap<>();
        vars.put("JB1UserId","User003");
        taskService.complete(task.getId(),vars);

        taskQuery = taskService.createTaskQuery().taskAssignee("User003");
        task = taskQuery.singleResult();
        vars=new HashMap<>();
        vars.put("TH1UserId","User004");
        taskService.complete(task.getId(),vars);

        taskQuery = taskService.createTaskQuery().taskAssignee("User004");
        task = taskQuery.singleResult();
        taskService.complete(task.getId(),vars);

        Assert.assertEquals(true,iwfInstanceIntegratedService.instanceIsComplete(getSession(),task.getProcessInstanceId()));

        iwfInstanceIntegratedService.restartProcessAndJumpToActivityNode(getSession(),task.getProcessInstanceId(),"Task_0j813kr","JBR001",null);

        taskQuery = taskService.createTaskQuery().taskAssignee("JBR001");
        task = taskQuery.singleResult();
        Assert.assertEquals("经办人1",task.getName());
    }

    @Test
    public void clearAllDeploymentModelTest() {
        CamundaIntegrate.setProcessEngine(processEngine);

        iwfInstanceIntegratedService.deleteAllInstance(getSession(),"测试删除");
        iwfModelIntegratedService.clearAllDeployedModel(getSession());
    }

    @Test
    public void deploymentTest01() throws FileNotFoundException {
        clearAllDeploymentModelTest();

        CamundaIntegrate.setProcessEngine(processEngine);
        InputStream is1 = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2_Dep1.bpmn");
        iwfModelIntegratedService.deploymentCamundaModel(getSession(),"部署名称001", ModelDesignSourceTypeEnum.builderWebDesign, ModelTenantIdEnum.builderGeneralTenant,is1);
        InputStream is2 = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2_Dep1.bpmn");
        iwfModelIntegratedService.deploymentCamundaModel(getSession(),"部署名称002", ModelDesignSourceTypeEnum.builderWebDesign, ModelTenantIdEnum.builderGeneralTenant,is2);
        InputStream is3 = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V2_Dep1.bpmn");
        iwfModelIntegratedService.deploymentCamundaModel(getSession(),"部署名称003", ModelDesignSourceTypeEnum.builderWebDesign, ModelTenantIdEnum.builderGeneralTenant,is3);

        int version=iwfModelIntegratedService.getDeployedCamundaModelLastVersion(getSession(),"P004_002_DEP1",ModelTenantIdEnum.builderGeneralTenant).getVersion();
        Assert.assertEquals(3,version);

        Assert.assertEquals(1,iwfModelIntegratedService.getDeployedCamundaModelLatestVersionList(getSession(),ModelTenantIdEnum.builderGeneralTenant).size());
        Assert.assertEquals(3,iwfModelIntegratedService.getDeployedCamundaModelList(getSession(),"P004_002_DEP1",ModelTenantIdEnum.builderGeneralTenant).size());

        iwfInstanceIntegratedService.deleteAllInstance(getSession(),"测试删除");

        RuntimeService runtimeService = processEngine.getRuntimeService();

        Map<String,Object> vars=new HashMap<>();
        vars.put("Creater","User001");
        runtimeService.startProcessInstanceByKey("P004_002_DEP1", "P004_002_bpmn_v001",vars);
        //runtimeService.startProcessInstanceById("P004_002_DEP1:1:ecf9cabe-849c-11eb-a3da-005056c00001", "P004_002_bpmn_v002",vars);
    }

    @Test
    public void ComplexTest3() throws FileNotFoundException {
        CamundaIntegrate.setProcessEngine(processEngine);
        ProcessEngine processEngine = CamundaIntegrate.getProcessEngine();
        ((ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration()).getBeans();
        InputStream is1 = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V3_1.bpmn");
        InputStream is2 = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V3_2.bpmn");
        InputStream is3 = new FileInputStream("D:\\JavaProject\\JavaTestProject\\CamundaProject714_20\\src\\main\\resources\\bpmn\\P004_002_发文流程_2021_V3_3.bpmn");

        RepositoryService repositoryService = processEngine.getRepositoryService();
        repositoryService.createDeployment().name("2021_V3_1").source("P004Test-Source").tenantId("P004Test-TenantId").addInputStream("2021_V3_1_bpmn", is1).deploy();
    }
}
