package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.client.remote.RoleRuntimeRemote;
import com.jb4dc.sso.client.remote.UserRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import com.jb4dc.sso.dbentities.role.RoleEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;
import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.dbentities.ModelAssObjectEntity;
import com.jb4dc.workflow.integrate.extend.IExecutionTaskExtendService;
import com.jb4dc.workflow.integrate.extend.IInstanceExtendService;
import com.jb4dc.workflow.integrate.extend.IModelAssObjectExtendService;
import com.jb4dc.workflow.integrate.extend.IReceiverRuntimeResolve;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcAction;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcReceiveObject;
import com.jb4dc.workflow.po.receive.RuntimeReceiverGroup;
import com.jb4dc.workflow.po.receive.RuntimeReceiverUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ReceiverRuntimeResolveImpl implements IReceiverRuntimeResolve {

    @Autowired
    UserRuntimeRemote userRuntimeRemote;

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    @Autowired
    RoleRuntimeRemote roleRuntimeRemote;

    @Autowired
    IInstanceExtendService instanceExtendService;

    @Autowired
    IModelAssObjectExtendService modelAssObjectExtendService;

    @Autowired
    IExecutionTaskExtendService executionTaskExtendService;

    //Users:834b97a7-7fd0-46ba-b87b-4113b1303c59,21ae6b28-dcd4-4f3f-b00f-c3b884f96d7e,2d6945a3-46d8-42d2-babf-6f9e402d46e3
    //Organs:4480608b-cb6f-4bff-9030-a656463fefbf,bf653078-8830-43c7-a625-f5385bfc8b8f,55dc1d44-c37f-4222-9e52-6f1a65ef29da
    //Role:SSOMainAppRole-General-Role,BuilderMainAppRole-General-Role,GridMainAppRoleGroup-Center-Role,GridMainAppRoleGroup-Dept-Role
    //flowAboutUser:instanceStarter
    //flowAboutUser:modelManager
    //ExcludeUsers:604ff9bc-d9ab-4686-a6af-3e8f2574e4b6,52cee6fd-6809-41d9-825e-aaf8b9582112
    private List<RuntimeReceiverGroup> resolveToActualUser(JB4DCSession jb4DCSession, String instanceId,String currentTaskId, String currentNodeKey, String actionCode, BpmnDefinitions bpmnDefinitions, List<BpmnTask> bpmnTaskList, Map<String, Object> vars, List<Jb4dcReceiveObject> jb4dcReceiveObjectList) throws JBuild4DCGenerallyException {
        List<RuntimeReceiverGroup> resultRuntimeReceiverGroupList = new ArrayList<>();

        //List<RuntimeReceiverUser> excludeUserList=new ArrayList<>();
        String[] excludeUserIdArray = null;

        for (Jb4dcReceiveObject jb4dcReceiveObject : jb4dcReceiveObjectList) {
            String receiveObjectValue = jb4dcReceiveObject.getReceiveObjectValue();
            String groupName = jb4dcReceiveObject.getReceiveObjectGroupName();
            boolean isCustGroupName = StringUtility.isNotEmpty(groupName) ? true : false;

            switch (jb4dcReceiveObject.getReceiveObjectType()) {
                case "Users": {
                    groupName = isCustGroupName ? groupName : "指定用户";
                    String finalGroupName = groupName;
                    RuntimeReceiverGroup runtimeReceiverGroup = null;
                    if (resultRuntimeReceiverGroupList.stream().anyMatch(singleGroup -> singleGroup.getName().equals(finalGroupName))) {
                        runtimeReceiverGroup = resultRuntimeReceiverGroupList.stream().filter(singleGroup -> singleGroup.getName().equals(finalGroupName)).findFirst().get();
                    } else {
                        runtimeReceiverGroup = new RuntimeReceiverGroup(groupName, UUIDUtility.getUUID(), UUIDUtility.getUUID(), true, isCustGroupName,
                                jb4dcReceiveObject.getReceiveObjectType(), "", "", "", 1);
                    }
                    List<UserEntity> userEntityList = userRuntimeRemote.searchUserByUserIdList(receiveObjectValue).getData();
                    runtimeReceiverGroup.getRuntimeReceiveUsers().addAll(RuntimeReceiverUser.parseUserEntityListToReceiverList(userEntityList, "指定用户"));
                    runtimeReceiverGroup.getRuntimeReceiveUsers().stream().distinct();

                    RuntimeReceiverGroup finalRuntimeReceiverGroup = runtimeReceiverGroup;
                    if (resultRuntimeReceiverGroupList.stream().noneMatch(temp -> temp.getId().equals(finalRuntimeReceiverGroup.getId()))) {
                        resultRuntimeReceiverGroupList.add(runtimeReceiverGroup);
                    }
                }
                break;
                case "Organs": {
                    String[] organIdArray = receiveObjectValue.split(",");
                    for (String organId : organIdArray) {
                        OrganEntity organEntity = organRuntimeRemote.getOrganById(organId).getData();
                        if (resultRuntimeReceiverGroupList.stream().noneMatch(singleGroup -> singleGroup.getName().equals(organEntity.getOrganName()) && singleGroup.getTypeName().equals(jb4dcReceiveObject.getReceiveObjectType()))) {
                            RuntimeReceiverGroup runtimeReceiverGroup = new RuntimeReceiverGroup(
                                    organEntity.getOrganName(), organEntity.getOrganId(), organEntity.getOrganCode(), true, false,
                                    jb4dcReceiveObject.getReceiveObjectType(), organEntity.getOrganDesc(), organEntity.getOrganStatus(), "", organEntity.getOrganOrderNum());
                            runtimeReceiverGroup.setIsParent("true");
                            runtimeReceiverGroup.setOpen(false);
                            runtimeReceiverGroup.setRuntimeReceiveUsers(null);
                            resultRuntimeReceiverGroupList.add(runtimeReceiverGroup);
                        }
                    }
                }
                break;
                case "Role": {
                    String[] roleIdArray = receiveObjectValue.split(",");
                    for (String roleId : roleIdArray) {
                        if (resultRuntimeReceiverGroupList.stream().noneMatch(singleGroup -> singleGroup.getId().equals(roleId) && singleGroup.getTypeName().equals(jb4dcReceiveObject.getReceiveObjectType()))) {
                            RoleEntity roleEntity = roleRuntimeRemote.getRoleById(roleId).getData();
                            List<UserEntity> userEntityList = userRuntimeRemote.getUserByRoleId(roleId).getData();
                            List<RuntimeReceiverUser> runtimeReceiverUserList = RuntimeReceiverUser.parseUserEntityListToReceiverList(userEntityList, "角色相关人员");

                            RuntimeReceiverGroup runtimeReceiverGroup = new RuntimeReceiverGroup(
                                    roleEntity.getRoleName(), roleEntity.getRoleId(), roleEntity.getRoleKey(), true, false,
                                    jb4dcReceiveObject.getReceiveObjectType(), roleEntity.getRoleDesc(), roleEntity.getRoleStatus(), "", roleEntity.getRoleOrderNum());
                            runtimeReceiverGroup.setRuntimeReceiveUsers(runtimeReceiverUserList);

                            resultRuntimeReceiverGroupList.add(runtimeReceiverGroup);
                        }
                    }
                }
                break;
                case "ExcludeUsers": {
                    excludeUserIdArray = receiveObjectValue.split(",");
                }
                break;
                case "flowAboutUser": {

                    groupName = isCustGroupName ? groupName : "流程相关人员";
                    String finalGroupName = groupName;
                    RuntimeReceiverGroup runtimeReceiverGroup = null;
                    if (resultRuntimeReceiverGroupList.stream().anyMatch(singleGroup -> singleGroup.getName().equals(finalGroupName))) {
                        runtimeReceiverGroup = resultRuntimeReceiverGroupList.stream().filter(singleGroup -> singleGroup.getName().equals(finalGroupName)).findFirst().get();
                    } else {
                        runtimeReceiverGroup = new RuntimeReceiverGroup(groupName, UUIDUtility.getUUID(), UUIDUtility.getUUID(), true, isCustGroupName,
                                jb4dcReceiveObject.getReceiveObjectType(), "", "", "", 1);
                    }

                    if (receiveObjectValue.equals("instanceStarter")) {
                        //#region
                        if (StringUtility.isEmpty(instanceId)) {
                            RuntimeReceiverUser runtimeReceiverUser = new RuntimeReceiverUser(jb4DCSession.getUserName(), jb4DCSession.getUserId(), "", false, false, "SingleUser", "流程启动人员", "", "", 0);
                            runtimeReceiverGroup.getRuntimeReceiveUsers().add(runtimeReceiverUser);

                        } else {
                            InstanceEntity instanceEntity = instanceExtendService.getByPrimaryKey(jb4DCSession, instanceId);
                            RuntimeReceiverUser runtimeReceiverUser = new RuntimeReceiverUser(instanceEntity.getInstCreator(), instanceEntity.getInstCreatorId(), "", false, false, "SingleUser", "流程启动人员", "", "", 0);
                            runtimeReceiverGroup.getRuntimeReceiveUsers().add(runtimeReceiverUser);
                        }
                        //#endregion
                    } else if (receiveObjectValue.equals("modelManager")) {
                        //#region
                        List<ModelAssObjectEntity> modelAssObjectEntityList = modelAssObjectExtendService.getManagerByModelReKey(jb4DCSession, bpmnDefinitions.getBpmnProcess().getId());
                        for (ModelAssObjectEntity modelAssObjectEntity : modelAssObjectEntityList) {
                            if (modelAssObjectEntity.getObjectType().equals("ManagerUser")) {
                                UserEntity userEntity = userRuntimeRemote.getUserById(modelAssObjectEntity.getObjectValue()).getData();
                                if (runtimeReceiverGroup.getRuntimeReceiveUsers().stream().noneMatch(tUser -> tUser.getId().equals(userEntity.getUserId()))) {
                                    runtimeReceiverGroup.getRuntimeReceiveUsers().add(RuntimeReceiverUser.parseUserEntityToReceiver(userEntity, "模型管理人员"));
                                }
                            } else if (modelAssObjectEntity.getObjectType().equals("ManagerRole")) {
                                List<UserEntity> userEntityList = userRuntimeRemote.getUserByRoleId(modelAssObjectEntity.getObjectValue()).getData();
                                for (UserEntity userEntity : userEntityList) {
                                    if (runtimeReceiverGroup.getRuntimeReceiveUsers().stream().noneMatch(tUser -> tUser.getId().equals(userEntity.getUserId()))) {
                                        runtimeReceiverGroup.getRuntimeReceiveUsers().add(RuntimeReceiverUser.parseUserEntityToReceiver(userEntity, "模型管理人员"));
                                    }
                                }
                            }
                        }
                        //#endregion
                    } else if (receiveObjectValue.equals("previousNodeSender")) {
                        if(StringUtility.isNotEmpty(currentTaskId)) {
                            ExecutionTaskEntity currentExecutionTaskEntity = executionTaskExtendService.getByPrimaryKey(jb4DCSession, currentTaskId);
                            //String formTaskId=currentExecutionTaskEntity.getExtaskFromTaskId();
                            //ExecutionTaskEntity fromExecutionTaskEntity = executionTaskExtendService.getByPrimaryKey(jb4DCSession, formTaskId);
                            RuntimeReceiverUser runtimeReceiverUser = new RuntimeReceiverUser(currentExecutionTaskEntity.getExtaskSenderName(), currentExecutionTaskEntity.getExtaskSenderId(), "", false, false, "SingleUser", "任务发送人员", "", "", 0);
                            runtimeReceiverGroup.getRuntimeReceiveUsers().add(runtimeReceiverUser);
                        }
                    }


                    RuntimeReceiverGroup finalRuntimeReceiverGroup = runtimeReceiverGroup;
                    if (resultRuntimeReceiverGroupList.stream().noneMatch(temp -> temp.getId().equals(finalRuntimeReceiverGroup.getId()))) {
                        resultRuntimeReceiverGroupList.add(runtimeReceiverGroup);
                    }
                }
                break;
            }
        }

        if (excludeUserIdArray != null) {

        }

        return resultRuntimeReceiverGroupList;
    }

    @Override
    public List<BpmnTask> resolveToActualUser(JB4DCSession jb4DCSession,String instanceId,String currentTaskId, String currentNodeKey, String actionCode, BpmnDefinitions bpmnDefinitions, List<BpmnTask> bpmnTaskList, Map<String, Object> vars, Jb4dcAction jb4dcAction) throws JBuild4DCGenerallyException, IOException {
        for (BpmnTask task : bpmnTaskList) {
            if(StringUtility.isNotEmpty(jb4dcAction.getActionMainReceiveObjects())&&!jb4dcAction.getActionMainReceiveObjects().equals("[]")){
                //获取动作设置的主送人员
                List<Jb4dcReceiveObject> jb4dcReceiveObjectList= JsonUtility.toObjectList(jb4dcAction.getActionMainReceiveObjects(),Jb4dcReceiveObject.class);
                task.getExtensionElements().getJb4dcMainReceiveObjects().setRuntimeReceiveGroups(
                        resolveToActualUser(
                                jb4DCSession, instanceId, currentTaskId,  currentNodeKey,  actionCode, bpmnDefinitions, bpmnTaskList, vars, jb4dcReceiveObjectList
                        )
                );
            }
            else {
                //获取环节设置的主送人员
                if (task.getExtensionElements() != null && task.getExtensionElements().getJb4dcMainReceiveObjects() != null && task.getExtensionElements().getJb4dcMainReceiveObjects().getJb4dcReceiveObjectList() != null) {
                    task.getExtensionElements().getJb4dcMainReceiveObjects().setRuntimeReceiveGroups(
                            resolveToActualUser(
                                    jb4DCSession, instanceId, currentTaskId,  currentNodeKey,  actionCode, bpmnDefinitions, bpmnTaskList, vars, task.getExtensionElements().getJb4dcMainReceiveObjects().getJb4dcReceiveObjectList()
                            )
                    );
                }
            }

            if(StringUtility.isNotEmpty(jb4dcAction.getActionCCReceiveObjects())&&!jb4dcAction.getActionCCReceiveObjects().equals("[]")){
                //获取动作设置的抄送人员
                List<Jb4dcReceiveObject> jb4dcReceiveObjectList= JsonUtility.toObjectList(jb4dcAction.getActionCCReceiveObjects(),Jb4dcReceiveObject.class);
                task.getExtensionElements().getJb4dcCCReceiveObjects().setRuntimeReceiveGroups(
                        resolveToActualUser(
                                jb4DCSession, instanceId, currentTaskId,  currentNodeKey,  actionCode, bpmnDefinitions, bpmnTaskList, vars, jb4dcReceiveObjectList
                        )
                );
            }
            else {
                //获取环节设置的抄送人员
                if (task.getExtensionElements() != null && task.getExtensionElements().getJb4dcCCReceiveObjects() != null && task.getExtensionElements().getJb4dcCCReceiveObjects().getJb4dcReceiveObjectList() != null) {
                    task.getExtensionElements().getJb4dcCCReceiveObjects().setRuntimeReceiveGroups(
                            resolveToActualUser(
                                    jb4DCSession, instanceId, currentTaskId,  currentNodeKey,  actionCode, bpmnDefinitions, bpmnTaskList, vars, task.getExtensionElements().getJb4dcCCReceiveObjects().getJb4dcReceiveObjectList()
                            )
                    );
                }
            }
        }
        return bpmnTaskList;
    }
}
