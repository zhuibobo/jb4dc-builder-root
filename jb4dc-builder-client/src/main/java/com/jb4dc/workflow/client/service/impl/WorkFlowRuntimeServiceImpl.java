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
import com.jb4dc.workflow.po.EnvVariableResultPO;
import com.jb4dc.workflow.po.FlowModelRuntimePO;
import com.jb4dc.workflow.po.JuelRunResultPO;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcAction;
import com.jb4dc.workflow.po.bpmn.process.Jb4dcActions;
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

    protected String CacheModuleName_LoadFlowModelRuntimePOSource="LoadFlowModelRuntimePOSource";

    @Autowired
    IEnvVariableRuntimeClient envVariableRuntimeClient;

    @Autowired
    EnvVariableRuntimeRemote envVariableRuntimeRemote;

    @Autowired
    JB4DCCacheManagerV2 jb4DCCacheManagerV2;

    protected String CacheSysNameName="";

    public String SaveFlowModelRuntimePOToCacheAtLoadingStatus(FlowModelRuntimePO flowModelRuntimePO) throws JsonProcessingException {
        String cacheKey = UUIDUtility.getUUID();
        FlowModelRuntimePO cacheValueObj= flowModelRuntimePO.clone();
        cacheValueObj.setBpmnXmlContent("");
        cacheValueObj.setBpmnDefinitions(null);
        cacheValueObj.getModelIntegratedEntity().setModelContent("");
        saveToCache(CacheModuleName_LoadFlowModelRuntimePOSource, cacheKey, cacheValueObj, JB4DCCacheManagerV2.ExpirationTime_1Day);
        return cacheKey;
    }

    public FlowModelRuntimePO getLoadingStatusFlowModelRuntimePOFromCache(String cacheKey) throws IOException {
        return getFromCache(FlowModelRuntimePO.class,CacheModuleName_LoadFlowModelRuntimePOSource,cacheKey);
    }

    public <T> void saveToCache(String moduleName, String key, T value, long expirationTimeSeconds) throws JsonProcessingException {
        jb4DCCacheManagerV2.putT(JB4DCCacheManagerV2.Jb4dPlatformWorkFlowClientCacheName,moduleName,WorkFlowRuntimeServiceImpl.class,key, value,expirationTimeSeconds);
    }

    public <T> T getFromCache(Class<T> valueType, String moduleName, String key) throws IOException {
        return jb4DCCacheManagerV2.getT(valueType,JB4DCCacheManagerV2.Jb4dPlatformWorkFlowClientCacheName,moduleName,WorkFlowRuntimeServiceImpl.class,key);
    }

    @Override
    public Map<String,Object> resolveStringToJuelVariables(JB4DCSession jb4DCSession, String juelExpression, FormRecordComplexPO formRecordComplexPO, FlowModelRuntimePO flowModelRuntimePO) throws IOException, JBuild4DCGenerallyException {
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
        result.putAll(parseFlowModelRuntimePOToJuelVars(jb4DCSession,flowModelRuntimePO));
        return result;
    }

    @Override
    public Map<String, Object> parseFormRecordComplexPOToJuelVars(JB4DCSession jb4DCSession, FormRecordComplexPO formRecordComplexPO) {
        Map<String, Object> result = new HashMap<>();
        if (formRecordComplexPO != null && formRecordComplexPO.getFormRecordDataRelationPOList() != null) {
            FormRecordDataRelationPO formRecordDataRelationPO = formRecordComplexPO.getFormRecordDataRelationPOList().stream().filter(item -> item.getParentId().equals("-1")).findFirst().orElse(null);
            for (FormRecordFieldDataPO fieldDataPO : formRecordDataRelationPO.getOneDataRecord().getRecordFieldPOList()) {
                String key = "__$TableField$$" + fieldDataPO.getFieldTableId() + "$$" + fieldDataPO.getFieldName() + "$";
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
                result.put(key, value);
            }
        }
        return result;
    }

    @Override
    public Map<String,Object> parseFlowModelRuntimePOToJuelVars(JB4DCSession jb4DCSession, FlowModelRuntimePO flowModelRuntimePO) {
        Map<String, Object> result = new HashMap<>();

        result.put("__$FlowVar$$ModelName$", flowModelRuntimePO.getModelName());
        result.put("__$FlowVar$$ModelCategory$", flowModelRuntimePO.getModelCategory());
        result.put("__$FlowVar$$NodeName$", flowModelRuntimePO.getCurrentNodeName());
        result.put("__$FlowVar$$LastActionName$", "未确定");
        result.put("__$FlowVar$$InstanceCreatTime_yyyy_MM_dd$", DateUtility.getDate_yyyy_MM_dd(flowModelRuntimePO.getInstanceEntity().getInstCreateTime()));
        result.put("__$FlowVar$$InstanceCreatTime_yyyy_MM_dd_HH_mm_ss$", DateUtility.getDate_yyyy_MM_dd_HH_mm_ss(flowModelRuntimePO.getInstanceEntity().getInstCreateTime()));
        result.put("__$FlowVar$$CurrentUserRoleIdsString$", String.join(StringUtility.SP_CHAR1, jb4DCSession.getRoleKeys() != null ? jb4DCSession.getRoleKeys() : new ArrayList<String>()));
        result.put("__$FlowVar$$CurrentUserRoleNamesString$", String.join(StringUtility.SP_CHAR1, jb4DCSession.getRoleNames() != null ? jb4DCSession.getRoleNames() : new ArrayList<String>()));
        result.put("__$FlowVar$$InstanceCreator$", flowModelRuntimePO.getInstanceEntity().getInstCreator());
        result.put("__$FlowVar$$InstanceCreatorId$", flowModelRuntimePO.getInstanceEntity().getInstCreatorId());
        result.put("__$FlowVar$$InstanceCreatorOrganName$", flowModelRuntimePO.getInstanceEntity().getInstOrganName());
        result.put("__$FlowVar$$InstanceCreatorOrganId$", flowModelRuntimePO.getInstanceEntity().getInstOrganId());

        return result;
    }

    @Override
    public Map<String,Object> parseDefaultFlowModelRuntimePOToJuelVars(JB4DCSession jb4DCSession, FlowModelRuntimePO flowModelRuntimePO, FormRecordComplexPO formRecordComplexPO) throws JBuild4DCGenerallyException, IOException {
        Map<String, Object> result = new HashMap<>();
        List<EnvVariableEntity> envVariableEntityList=envVariableRuntimeRemote.getEnvVariableByGroupId("ENV_GROUP_SYSTEM").getData();
        for (EnvVariableEntity envVariableEntity : envVariableEntityList) {
            String mapKey="__$EnvVar$$"+envVariableEntity.getEnvVarValue()+"$";
            EnvVariableResultPO envVariableResultPO = envVariableRuntimeClient.execEnvVarResult(jb4DCSession, envVariableEntity.getEnvVarValue());
            Object mapValue=envVariableResultPO.getValue();
            result.put(mapKey,mapValue);
        }
        result.putAll(parseFormRecordComplexPOToJuelVars(jb4DCSession,formRecordComplexPO));
        result.putAll(parseFlowModelRuntimePOToJuelVars(jb4DCSession,flowModelRuntimePO));

        return result;
    }

    public Jb4dcActions buildFlowModelRuntimePOBindCurrentActions(JB4DCSession jb4DCSession, FlowModelRuntimePO flowModelRuntimePO, FormRecordComplexPO formRecordComplexPO) throws IOException, JBuild4DCGenerallyException {
        Jb4dcActions jb4dcActions=null;

        if(flowModelRuntimePO.getBpmnDefinitions().getBpmnProcess().getUserTaskList().stream().anyMatch(innerBpmnTask -> innerBpmnTask.getId().equals(flowModelRuntimePO.getCurrentNodeKey()))) {
            BpmnTask optionalBpmnTask = flowModelRuntimePO.getBpmnDefinitions().getBpmnProcess().getTaskList().stream().filter(innerBpmnTask -> innerBpmnTask.getId().equals(flowModelRuntimePO.getCurrentNodeKey())).findFirst().get();
            jb4dcActions=optionalBpmnTask.getExtensionElements().getJb4dcActions();
        }
        if(jb4dcActions==null&&flowModelRuntimePO.getBpmnDefinitions().getBpmnProcess().getStartEvent().getId().equals(flowModelRuntimePO.getCurrentNodeKey())){
            jb4dcActions=flowModelRuntimePO.getBpmnDefinitions().getBpmnProcess().getStartEvent().getExtensionElements().getJb4dcActions();
        }

        if (jb4dcActions != null) {
            for (Jb4dcAction jb4dcAction : jb4dcActions.getJb4dcActionList()) {
                String juelExpression = jb4dcAction.getActionDisplayConditionEditValue();
                if (StringUtility.isNotEmpty(juelExpression)) {
                    Map<String,Object> vars=resolveStringToJuelVariables(jb4DCSession,juelExpression,formRecordComplexPO,flowModelRuntimePO);
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
