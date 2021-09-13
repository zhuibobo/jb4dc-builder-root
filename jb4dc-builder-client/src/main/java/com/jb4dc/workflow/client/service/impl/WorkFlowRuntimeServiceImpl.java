package com.jb4dc.workflow.client.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;
import com.jb4dc.builder.client.exenum.TableFieldTypeEnum;
import com.jb4dc.builder.client.remote.EnvVariableRuntimeRemote;
import com.jb4dc.builder.client.service.envvar.IEnvVariableRuntimeClient;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.builder.po.formdata.FormRecordFieldDataPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.DateUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.workflow.client.service.IWorkFlowRuntimeService;
import com.jb4dc.workflow.client.utility.JuelUtility;
import com.jb4dc.builder.po.EnvVariableResultPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.JuelRunResultPO;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.po.bpmn.process.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Primary
public class WorkFlowRuntimeServiceImpl implements IWorkFlowRuntimeService {

    protected String CacheModuleName_LoadFlowInstanceRuntimePOSource ="ClientFlowInstanceRuntimePO";

    @Autowired
    IEnvVariableRuntimeClient envVariableRuntimeClient;

    @Autowired
    EnvVariableRuntimeRemote envVariableRuntimeRemote;

    @Autowired
    JB4DCCacheManagerV2 jb4DCCacheManagerV2;

    protected String CacheSysNameName="";

    public String saveFlowInstanceRuntimePOToCache(FlowInstanceRuntimePO flowInstanceRuntimePO) throws JsonProcessingException {
        String cacheKey = UUIDUtility.getUUID();
        FlowInstanceRuntimePO cacheValueObj= flowInstanceRuntimePO.clone();
        cacheValueObj.setBpmnXmlContent("");
        //cacheValueObj.setBpmnDefinitions(null);
        cacheValueObj.getModelIntegratedEntity().setModelContent("");
        saveToCache(CacheModuleName_LoadFlowInstanceRuntimePOSource, cacheKey, cacheValueObj, JB4DCCacheManagerV2.ExpirationTime_1Day);
        return cacheKey;
    }

    public FlowInstanceRuntimePO getFlowInstanceRuntimePOFromCache(String cacheKey) throws IOException {
        return getFromCache(FlowInstanceRuntimePO.class, CacheModuleName_LoadFlowInstanceRuntimePOSource,cacheKey);
    }

    public <T> void saveToCache(String moduleName, String key, T value, long expirationTimeSeconds) throws JsonProcessingException {
        jb4DCCacheManagerV2.putT(JB4DCCacheManagerV2.Jb4dPlatformWorkFlowClientCacheName,moduleName,WorkFlowRuntimeServiceImpl.class,key, value,expirationTimeSeconds);
    }

    public <T> T getFromCache(Class<T> valueType, String moduleName, String key) throws IOException {
        return jb4DCCacheManagerV2.getT(valueType,JB4DCCacheManagerV2.Jb4dPlatformWorkFlowClientCacheName,moduleName,WorkFlowRuntimeServiceImpl.class,key);
    }

    /*private Jb4dcAction findAction(BpmnExtensionElements extensionElements, String currentNodeKey, String actionCode) {
        Jb4dcAction jb4dcAction = null;
        if (extensionElements != null && extensionElements.getJb4dcActions() != null && extensionElements.getJb4dcActions().getJb4dcActionList() != null && extensionElements.getJb4dcActions().getJb4dcActionList().size() > 0) {
            jb4dcAction = extensionElements.getJb4dcActions().getJb4dcActionList().stream().filter(item -> item.getActionCode().equals(actionCode)).findFirst().orElse(null);
        }
        return jb4dcAction;
    }*/

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

    private Map<String,Object> resolveStringToJuelVariables(JB4DCSession jb4DCSession, String juelExpression, FormRecordComplexPO formRecordComplexPO, FlowInstanceRuntimePO flowInstanceRuntimePO) throws IOException, JBuild4DCGenerallyException {
        Map<String, Object> result = new HashMap<>();
        Pattern p = Pattern.compile("\\__\\$[^\\}|^\\ ]*\\$");
        Matcher m = p.matcher(juelExpression);
        while (m.find()) {
            String sourceVarExpressionName = m.group();
            String fullVarExpressionName = StringUtility.removeLastChar(sourceVarExpressionName).replace("__$", "");
            System.out.println("Found value: " + fullVarExpressionName);
            String[] fullVarExpressions = fullVarExpressionName.split("\\$\\$");
            switch (fullVarExpressions[0]) {
                case "EnvVar": {
                    String envValue = fullVarExpressions[1];
                    EnvVariableResultPO envVariableResultPO = envVariableRuntimeClient.execEnvVarResult(jb4DCSession, envValue);
                    result.put(sourceVarExpressionName,envVariableResultPO.getValue());
                }
                break;
                /*case "TableField": {
                    Object tableFieldValue = tableFieldJuelVars.get(sourceVarExpressionName);
                    result.put(sourceVarExpressionName,tableFieldValue);
                }
                break;
                case "FlowAction": {
                    //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"获取变量：" + envValue + "的运行时值失败！" + ex.getMessage());
                }
                break;*/
            }
            //将变量的Value转换为运行时的值
            /*String envValue = m.group().substring(m.group().indexOf(".")+1).replace("}","");
            try {
                String runValue=envVariableClientResolveService.execEnvVarResult(jb4DCSession,envValue);
                String t1=m.group().replace("{","\\{");
                sqlRunValue=sqlRunValue.replaceAll(t1,runValue);
            } catch (Exception ex) {
                ex.printStackTrace();
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"获取变量：" + envValue + "的运行时值失败！" + ex.getMessage());
            }*/
        }
        result.putAll(parseFormRecordComplexPOToJuelVars(jb4DCSession,formRecordComplexPO));
        result.putAll(parseFlowInstanceRuntimePOToJuelVars(jb4DCSession, flowInstanceRuntimePO));
        return result;
    }

    private Map<String, Object> parseFormRecordComplexPOToJuelVars(JB4DCSession jb4DCSession, FormRecordComplexPO formRecordComplexPO) {
        Map<String, Object> businessData = new HashMap<>();
        if (formRecordComplexPO != null && formRecordComplexPO.getFormRecordDataRelationPOList() != null) {
            FormRecordDataRelationPO formRecordDataRelationPO = formRecordComplexPO.getFormRecordDataRelationPOList().stream().filter(item -> item.getParentId().equals("-1")).findFirst().orElse(null);
            for (FormRecordFieldDataPO fieldDataPO : formRecordDataRelationPO.getOneDataRecord().getRecordFieldPOList()) {
                String key = "__$TableField$$" + fieldDataPO.getTableId() + "$$" + fieldDataPO.getFieldName() + "$";
                Object value;
                if (fieldDataPO.getFieldDataType().equals(TableFieldTypeEnum.IntType)) {
                    if (fieldDataPO.getValue() != null && StringUtility.isNotEmpty(fieldDataPO.getValue().toString())) {
                        value = Integer.parseInt(fieldDataPO.getValue().toString());
                    } else {
                        value = 0;
                    }
                } else if (fieldDataPO.getFieldDataType().equals(TableFieldTypeEnum.NumberType)) {
                    if (fieldDataPO.getValue() != null && StringUtility.isNotEmpty(fieldDataPO.getValue().toString())) {
                        value = Long.parseLong(fieldDataPO.getValue().toString());
                    } else {
                        value = 0;
                    }
                } else {
                    if (fieldDataPO.getValue() != null) {
                        value = fieldDataPO.getValue().toString();
                    } else {
                        value = "";
                    }
                }
                businessData.put(key, value);
            }
        }

        Map<String, Object> resultData = new HashMap<>();
        resultData.put("__$BusinessData$",businessData);
        return resultData;
    }

    private Map<String,Object> parseFlowInstanceRuntimePOToJuelVars(JB4DCSession jb4DCSession, FlowInstanceRuntimePO flowInstanceRuntimePO) {
        Map<String, Object> result = new HashMap<>();

        result.put("__$FlowVar$$ModelName$", flowInstanceRuntimePO.getModelName());
        result.put("__$FlowVar$$ModelCategory$", flowInstanceRuntimePO.getModelCategory());
        result.put("__$FlowVar$$NodeName$", flowInstanceRuntimePO.getCurrentNodeName());
        result.put("__$FlowVar$$LastActionName$", "未确定");
        result.put("__$FlowVar$$InstanceCreatTime_yyyy_MM_dd$", DateUtility.getDate_yyyy_MM_dd(flowInstanceRuntimePO.getInstanceEntity().getInstCreateTime()));
        result.put("__$FlowVar$$InstanceCreatTime_yyyy_MM_dd_HH_mm_ss$", DateUtility.getDate_yyyy_MM_dd_HH_mm_ss(flowInstanceRuntimePO.getInstanceEntity().getInstCreateTime()));
        result.put("__$FlowVar$$CurrentUserRoleIdsString$", String.join(StringUtility.SP_CHAR1, jb4DCSession.getRoleKeys() != null ? jb4DCSession.getRoleKeys() : new ArrayList<String>()));
        result.put("__$FlowVar$$CurrentUserRoleNamesString$", String.join(StringUtility.SP_CHAR1, jb4DCSession.getRoleNames() != null ? jb4DCSession.getRoleNames() : new ArrayList<String>()));
        result.put("__$FlowVar$$InstanceCreator$", flowInstanceRuntimePO.getInstanceEntity().getInstCreator());
        result.put("__$FlowVar$$InstanceCreatorId$", flowInstanceRuntimePO.getInstanceEntity().getInstCreatorId());
        result.put("__$FlowVar$$InstanceCreatorOrganName$", flowInstanceRuntimePO.getInstanceEntity().getInstOrganName());
        result.put("__$FlowVar$$InstanceCreatorOrganId$", flowInstanceRuntimePO.getInstanceEntity().getInstOrganId());

        return result;
    }

    /*@Override
    public Jb4dcAction findAction(BpmnDefinitions bpmnDefinitions, String currentNodeKey, String actionCode) {
        Jb4dcAction jb4dcAction = null;
        if (bpmnDefinitions.getBpmnProcess().getStartEvent().getId().equals(currentNodeKey)) {
            jb4dcAction = findAction(bpmnDefinitions.getBpmnProcess().getStartEvent().getExtensionElements(), currentNodeKey, actionCode);
        }
        if (bpmnDefinitions.getBpmnProcess().getUserTaskList() != null) {
            for (BpmnUserTask userTask : bpmnDefinitions.getBpmnProcess().getUserTaskList()) {
                if (userTask.getId().equals(currentNodeKey)) {
                    jb4dcAction = findAction(userTask.getExtensionElements(), currentNodeKey, actionCode);
                }
            }
        }
        return jb4dcAction;
    }*/

    @Override
    public Map<String,Object> parseDefaultFlowInstanceRuntimePOToJuelVars(JB4DCSession jb4DCSession, FlowInstanceRuntimePO flowInstanceRuntimePO, FormRecordComplexPO formRecordComplexPO,String currentNodeKey,String actionCode) throws JBuild4DCGenerallyException, IOException {
        Map<String, Object> result = new HashMap<>();
        List<EnvVariableEntity> envVariableEntityList=envVariableRuntimeRemote.getEnvVariableByGroupId("ENV_GROUP_SYSTEM").getData();
        for (EnvVariableEntity envVariableEntity : envVariableEntityList) {
            String mapKey="__$EnvVar$$"+envVariableEntity.getEnvVarValue()+"$";
            EnvVariableResultPO envVariableResultPO = envVariableRuntimeClient.execEnvVarResult(jb4DCSession, envVariableEntity.getEnvVarValue());
            Object mapValue=envVariableResultPO.getValue();
            result.put(mapKey,mapValue);
        }
        result.putAll(parseFormRecordComplexPOToJuelVars(jb4DCSession,formRecordComplexPO));
        result.putAll(parseFlowInstanceRuntimePOToJuelVars(jb4DCSession, flowInstanceRuntimePO));
        this.appendFlowDefaultVar(result,currentNodeKey,actionCode);
        return result;
    }

    public String buildJuelExpression(JB4DCSession jb4DCSession,String juelExpression, Map<String, Object> vars) throws IOException, JBuild4DCGenerallyException {
        if(StringUtility.isEmpty(juelExpression)){
            return "";
        }
        JuelRunResultPO juelRunResultPO= JuelUtility.buildStringExpression(jb4DCSession,juelExpression,vars);
        return juelRunResultPO.getStringResult();
    }

    public Jb4dcActions buildFlowInstanceRuntimePOBindCurrentActions(JB4DCSession jb4DCSession, FlowInstanceRuntimePO flowInstanceRuntimePO, FormRecordComplexPO formRecordComplexPO) throws IOException, JBuild4DCGenerallyException {
        Jb4dcActions jb4dcActions=null;

        if(flowInstanceRuntimePO.getBpmnDefinitions().getBpmnProcess().getUserTaskList().stream().anyMatch(innerBpmnTask -> innerBpmnTask.getId().equals(flowInstanceRuntimePO.getCurrentNodeKey()))) {
            BpmnTask optionalBpmnTask = flowInstanceRuntimePO.getBpmnDefinitions().getBpmnProcess().getUserTaskList().stream().filter(innerBpmnTask -> innerBpmnTask.getId().equals(flowInstanceRuntimePO.getCurrentNodeKey())).findFirst().get();
            if (optionalBpmnTask.getExtensionElements() != null) {
                jb4dcActions = optionalBpmnTask.getExtensionElements().getJb4dcActions();
            }
        }
        if(jb4dcActions==null&& flowInstanceRuntimePO.getBpmnDefinitions().getBpmnProcess().getStartEvent().getId().equals(flowInstanceRuntimePO.getCurrentNodeKey())) {
            if (flowInstanceRuntimePO.getBpmnDefinitions().getBpmnProcess().getStartEvent().getExtensionElements() != null) {
                jb4dcActions = flowInstanceRuntimePO.getBpmnDefinitions().getBpmnProcess().getStartEvent().getExtensionElements().getJb4dcActions();
            }
        }

        if (jb4dcActions != null&&jb4dcActions.getJb4dcActionList()!=null) {
            for (Jb4dcAction jb4dcAction : jb4dcActions.getJb4dcActionList()) {
                String juelExpression = jb4dcAction.getActionDisplayConditionEditValue();
                if (StringUtility.isNotEmpty(juelExpression)) {
                    Map<String,Object> vars=resolveStringToJuelVariables(jb4DCSession,juelExpression,formRecordComplexPO, flowInstanceRuntimePO);
                    JuelRunResultPO juelRunResultPO= JuelUtility.buildBoolExpression(jb4DCSession,juelExpression,vars);
                    jb4dcAction.setJuelRunResultPO(juelRunResultPO);
                } else {
                    jb4dcAction.setJuelRunResultPO(JuelRunResultPO.Default());
                }
                //JuelRunResultPO juelRunResultPO=JB
            }
        }

        return jb4dcActions;
    }
}
