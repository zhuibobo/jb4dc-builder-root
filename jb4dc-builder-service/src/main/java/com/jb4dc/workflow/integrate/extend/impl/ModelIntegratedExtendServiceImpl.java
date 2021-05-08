package com.jb4dc.workflow.integrate.extend.impl;
import java.io.StringWriter;
import java.net.URISyntaxException;
import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.util.*;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.tools.URLUtility;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.*;
import com.jb4dc.sso.client.utils.HttpClientUtil;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.dbentities.ModelAssObjectEntity;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;
import com.jb4dc.workflow.exenum.ModelDesignSourceTypeEnum;
import com.jb4dc.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.workflow.integrate.engine.IFlowEngineModelIntegratedService;
import com.jb4dc.workflow.integrate.extend.IModelAssObjectExtendService;
import com.jb4dc.workflow.integrate.extend.IModelGroupRefExtendService;
import com.jb4dc.workflow.po.FlowModelIntegratedPO;
import com.jb4dc.workflow.po.FlowModelRuntimePO;
import com.jb4dc.workflow.po.JuelRunResultPO;
import com.jb4dc.workflow.po.TypeNamesPO;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.dao.ModelIntegratedMapper;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.integrate.engine.impl.FlowEngineModelIntegrateServiceImpl;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.po.bpmn.process.*;
import org.apache.commons.io.IOUtils;
import org.camunda.bpm.engine.repository.Deployment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;
import java.util.stream.Collectors;

@Service
public class ModelIntegratedExtendServiceImpl extends BaseServiceImpl<ModelIntegratedEntity> implements IModelIntegratedExtendService {
    private Logger logger= LoggerFactory.getLogger(FlowEngineModelIntegrateServiceImpl.class);

    ModelIntegratedMapper flowIntegratedMapper;

    @Autowired
    IFlowEngineModelIntegratedService flowEngineModelIntegratedService;

    @Autowired
    IModelGroupRefExtendService modelGroupRefExtendService;

    @Autowired
    IModelAssObjectExtendService modelAssObjectExtendService;

    @Autowired
    IFormResourceService formResourceService;

    @Autowired
    IModuleService moduleService;
    //@Autowired
    //private IFileInfoService fileInfoService;

    public ModelIntegratedExtendServiceImpl(ModelIntegratedMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        flowIntegratedMapper=_defaultBaseMapper;
    }

    @Override
    public BpmnDefinitions parseToPO(String xml) throws JAXBException, XMLStreamException {
        return XMLUtility.toObject(xml, BpmnDefinitions.class);
    }

    @Override
    public BpmnDefinitions parseToPO(InputStream is) throws JAXBException, XMLStreamException {
        return XMLUtility.toObject(is, BpmnDefinitions.class);
    }

    @Override
    public FlowModelIntegratedPO getPOByIntegratedId(JB4DCSession jb4DSession, String recordId) throws JBuild4DCGenerallyException, IOException {
        ModelIntegratedEntity modelIntegratedEntity=getByPrimaryKey(jb4DSession,recordId);
        return FlowModelIntegratedPO.parseToPO(modelIntegratedEntity);
    }

    @Override
    public PageInfo<ModelIntegratedEntity> getPageByModule(JB4DCSession jb4DCSession, int pageNum, int pageSize, Map<String, Object> searchItemMap) {
        PageHelper.startPage(pageNum, pageSize);
        List<ModelIntegratedEntity> list = flowIntegratedMapper.selectByModule(searchItemMap);
        PageInfo<ModelIntegratedEntity> pageInfo = new PageInfo(list);
        return pageInfo.getSize() == 0 && pageInfo.getPageNum() > 1 ? this.getPage(jb4DCSession, pageNum - 1, pageSize, searchItemMap) : pageInfo;
    }

    private FlowModelIntegratedPO appendFieldValueFromModelContentPO(JB4DCSession jb4DSession, FlowModelIntegratedPO flowModelIntegratedPO, BpmnDefinitions bpmnDefinitions, ModelIntegratedEntity lastPreSaveModelIntegratedEntity) {
        //flowIntegratedPO.setModelReKey(bpmnDefinitions.getBpmnProcess().getId());
        //flowIntegratedPO.setModelName(bpmnDefinitions.getBpmnProcess().getName());
        //flowIntegratedPO.setModelCode(bpmnDefinitions.getBpmnProcess().getJb4dcCode());
        BpmnProcess bpmnProcess = bpmnDefinitions.getBpmnProcess();
        //flowIntegratedPO.setModelId("");
        flowModelIntegratedPO.setModelReEd("否");
        flowModelIntegratedPO.setModelReId("");
        flowModelIntegratedPO.setModelReSuccess("否");
        flowModelIntegratedPO.setModelLastReEd("否");
        flowModelIntegratedPO.setModelReKey(bpmnProcess.getId());
        //flowIntegratedPO.setModelModuleId("");

        flowModelIntegratedPO.setModelFlowCategory(bpmnProcess.getJb4dcFlowCategory());
        flowModelIntegratedPO.setModelImageClass(bpmnProcess.getJb4dcProcessModelImageClass());
        flowModelIntegratedPO.setModelPesTitleText(bpmnProcess.getJb4dcProcessTitleEditText());
        flowModelIntegratedPO.setModelPesTitleValue(bpmnProcess.getJb4dcProcessTitleEditValue());
        flowModelIntegratedPO.setModelPesDescText(bpmnProcess.getJb4dcProcessDescriptionEditText());
        flowModelIntegratedPO.setModelPesDescValue(bpmnProcess.getJb4dcProcessDescriptionEditValue());
        flowModelIntegratedPO.setModelPesRestartEnb(bpmnProcess.getJb4dcProcessRestartEnable());
        flowModelIntegratedPO.setModelPesAnyJumpEnb(bpmnProcess.getJb4dcProcessAnyJumpEnable());
        flowModelIntegratedPO.setModelName(bpmnProcess.getName());
        flowModelIntegratedPO.setModelCreateTime(new Date());
        flowModelIntegratedPO.setModelCreator(jb4DSession.getUserId());
        flowModelIntegratedPO.setModelUpdateTime(new Date());
        flowModelIntegratedPO.setModelUpdater(jb4DSession.getUserId());
        flowModelIntegratedPO.setModelDesc(bpmnProcess.getDocumentation().getText());
        flowModelIntegratedPO.setModelStatus("启用");
        flowModelIntegratedPO.setModelOrderNum(flowIntegratedMapper.nextOrderNum());
        flowModelIntegratedPO.setModelDeploymentId("");
        flowModelIntegratedPO.setModelResourceName(ModelDesignSourceTypeEnum.builderWebDesign.getDisplayName());
        flowModelIntegratedPO.setModelFromType(ModelDesignSourceTypeEnum.builderWebDesign.getDisplayName());
        flowModelIntegratedPO.setModelTenantId(ModelTenantIdEnum.builderGeneralTenant.getDisplayName());

        if (lastPreSaveModelIntegratedEntity == null) {
            flowModelIntegratedPO.setModelSaveVersion(1);
            flowModelIntegratedPO.setModelCode(moduleService.buildModuleItemCode(flowModelIntegratedPO.getModelOrderNum()));
        } else {
            flowModelIntegratedPO.setModelSaveVersion(lastPreSaveModelIntegratedEntity.getModelSaveVersion() + 1);
            flowModelIntegratedPO.setModelCode(lastPreSaveModelIntegratedEntity.getModelCode());
        }
        flowModelIntegratedPO.setModelLastVersion("是");
        flowModelIntegratedPO.setModelId(flowModelIntegratedPO.getModelReKey()+":"+ flowModelIntegratedPO.getModelSaveVersion());
        return flowModelIntegratedPO;
    }


    public FlowModelIntegratedPO saveFlowModel1(JB4DCSession jb4DSession, FlowModelIntegratedPO flowModelIntegratedPO) throws JBuild4DCGenerallyException {

        ModelIntegratedEntity lastPreSaveModelIntegratedEntity = this.getLastSaveModelIntegratedEntity(jb4DSession, flowModelIntegratedPO.getModelReKey());
        lastPreSaveModelIntegratedEntity.setModelLastVersion("否");
        //flowIntegratedMapper.updateByPrimaryKeySelective(lastPreSaveModelIntegratedEntity);
        //flowIntegratedMapper.insert(flowIntegratedPO);
        //deployment.

        return flowModelIntegratedPO;
    }

    @Override
    @Transactional(rollbackFor= JBuild4DCGenerallyException.class)
    public FlowModelIntegratedPO saveFlowModel(JB4DCSession jb4DSession, FlowModelIntegratedPO flowModelIntegratedPO) throws JBuild4DCGenerallyException {

        //模型分为三个:当前保存模型,上一版本保存模型,已经部署模型.
        BpmnDefinitions bpmnDefinitions = null;
        BpmnProcess bpmnProcess = null;
        String bpmnDefinitionKey;
        try {
            bpmnDefinitions = parseToPO(flowModelIntegratedPO.getModelContent());
            bpmnProcess = bpmnDefinitions.getBpmnProcess();
            bpmnDefinitionKey = bpmnProcess.getId();
        } catch (JAXBException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, e.getMessage(), e, e.getStackTrace());
        } catch (XMLStreamException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, e.getMessage(), e, e.getStackTrace());
        }

        //获取最后一个保存版本的模型
        ModelIntegratedEntity lastPreSaveModelIntegratedEntity = this.getLastSaveModelIntegratedEntity(jb4DSession, bpmnDefinitions.getBpmnProcess().getId());
        flowModelIntegratedPO = appendFieldValueFromModelContentPO(jb4DSession, flowModelIntegratedPO, bpmnDefinitions, lastPreSaveModelIntegratedEntity);

        ValidateUtility.isNotEmptyException(flowModelIntegratedPO.getModelReKey(), JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "启动KEY");
        ValidateUtility.isNotEmptyException(flowModelIntegratedPO.getModelCode(), JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "Code");
        ValidateUtility.isNotEmptyException(flowModelIntegratedPO.getModelModuleId(), JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "所属模块");

        if (flowModelIntegratedPO.isTryDeployment()) {
            //尝试部署模型到工作流引擎d
            try {
                Deployment deployment = flowEngineModelIntegratedService.deploymentCamundaModel(jb4DSession, flowModelIntegratedPO.getModelName(), ModelDesignSourceTypeEnum.builderWebDesign,
                        ModelTenantIdEnum.builderGeneralTenant, flowModelIntegratedPO.getModelContent());
                flowModelIntegratedPO.setModelDeploymentId(deployment.getId());
                flowModelIntegratedPO.setModelReEd("是");
                flowModelIntegratedPO.setModelReSuccess("是");
                flowModelIntegratedPO.setModelLastReEd("是");
                flowModelIntegratedPO.setModelReId(flowEngineModelIntegratedService.getProcessDefinitionByDeploymentId(jb4DSession, deployment.getId()).getId());
                //deployment.
            } catch (Exception ex) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex.getMessage(), ex.getCause(), ex.getStackTrace());
            }
        }

        if (lastPreSaveModelIntegratedEntity != null) {
            lastPreSaveModelIntegratedEntity.setModelLastVersion("否");
            lastPreSaveModelIntegratedEntity.setModelLastReEd("否");
            flowIntegratedMapper.updateByPrimaryKeySelective(lastPreSaveModelIntegratedEntity);
        }
        flowIntegratedMapper.insert(flowModelIntegratedPO);
        //deployment.
        //设置关联分组
        modelGroupRefExtendService.deleteRefByModelKey(jb4DSession, bpmnDefinitionKey);
        String jb4dcProcessModelGroups = bpmnProcess.getJb4dcProcessModelGroups();
        if (StringUtility.isNotEmpty(jb4dcProcessModelGroups)) {
            try {
                List<Map> groupList = JsonUtility.toObjectList(jb4dcProcessModelGroups, Map.class);
                for (Map map : groupList) {
                    //System.out.printf(map.get("groupId").toString());
                    ModelGroupRefEntity modelGroupRefEntity = new ModelGroupRefEntity();
                    modelGroupRefEntity.setGrefId(UUID.randomUUID().toString());
                    modelGroupRefEntity.setGrefGroupId(map.get("groupId").toString());
                    modelGroupRefEntity.setGrefModelKey(bpmnProcess.getId());
                    modelGroupRefEntity.setGrefModelId(flowModelIntegratedPO.getModelModuleId());
                    modelGroupRefExtendService.saveSimple(jb4DSession, modelGroupRefEntity.getGrefId(), modelGroupRefEntity);
                }
            } catch (IOException ex) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex.getMessage(), ex.getCause(), ex.getStackTrace());
            }
        }

        //设置关联对象
        modelAssObjectExtendService.deleteRefByModelKey(jb4DSession, bpmnDefinitionKey);
        List<ModelAssObjectEntity> modelAssObjectEntityList = new ArrayList<>();
        int modelAssObjectMaxOrderNum=modelAssObjectExtendService.getNextOrderNum(jb4DSession);
        //启动角色
        modelAssObjectEntityList.addAll(buildModelAssObjectEntities(
                jb4DSession, bpmnProcess.getJb4dcProcessCandidateStarterGroups(), flowModelIntegratedPO.getModelId(), "StarterRole",
                flowModelIntegratedPO.getModelReKey(), "rolePath", "roleId", modelAssObjectEntityList.size() + modelAssObjectMaxOrderNum));
        //启动用户
        modelAssObjectEntityList.addAll(buildModelAssObjectEntities(
                jb4DSession, bpmnProcess.getJb4dcProcessCandidateStarterUsers(), flowModelIntegratedPO.getModelId(), "StarterUser",
                flowModelIntegratedPO.getModelReKey(), "userPath", "userId", modelAssObjectEntityList.size() + modelAssObjectMaxOrderNum));
        //管理角色
        modelAssObjectEntityList.addAll(buildModelAssObjectEntities(
                jb4DSession, bpmnProcess.getJb4dcProcessModelManagerGroups(), flowModelIntegratedPO.getModelId(), "ManagerRole",
                flowModelIntegratedPO.getModelReKey(), "rolePath", "roleId", modelAssObjectEntityList.size() + modelAssObjectMaxOrderNum));
        //管理用户
        modelAssObjectEntityList.addAll(buildModelAssObjectEntities(
                jb4DSession, bpmnProcess.getJb4dcProcessModelManagerUsers(), flowModelIntegratedPO.getModelId(), "ManagerUser",
                flowModelIntegratedPO.getModelReKey(), "userPath", "userId", modelAssObjectEntityList.size() + modelAssObjectMaxOrderNum));

        for (ModelAssObjectEntity modelAssObjectEntity : modelAssObjectEntityList) {
            modelAssObjectExtendService.saveSimple(jb4DSession, modelAssObjectEntity.getObjectId(), modelAssObjectEntity);
        }


        return flowModelIntegratedPO;
        /*FlowIntegratedEntity flowIntegratedEntity=flowIntegratedMapper.selectByPrimaryKey(recordID);
        ValidateUtility.isNotEmptyException(flowIntegratedPO.getIntegratedStartKey(),JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"启动KEY");
        ValidateUtility.isNotEmptyException(flowIntegratedPO.getIntegratedCode(),JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"Code");
        ValidateUtility.isNotEmptyException(flowIntegratedPO.getIntegratedModuleId(),JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"所属模块");
        BpmnDefinitions bpmnDefinitions=parseToPO(flowIntegratedPO.getBpmnXMLModeler());
        if(flowIntegratedEntity==null) {
            ValidateUtility.isBeUnique(recordID, new IMustBeUnique() {
                @Override
                public String beUniquePOId() {
                    FlowIntegratedEntity entity=flowIntegratedMapper.selectByStartKey(flowIntegratedPO.getIntegratedStartKey());
                    return entity!=null?entity.getIntegratedId():null;
                }
            }, BaseUtility.getAddOperationName(), "模型的Key必须唯一,且不能更改!");
            ValidateUtility.isBeUnique(recordID, new IMustBeUnique() {
                @Override
                public String beUniquePOId() {
                    FlowIntegratedEntity entity=flowIntegratedMapper.selectByCode(flowIntegratedPO.getIntegratedCode());
                    return entity!=null?entity.getIntegratedId():null;
                }
            }, BaseUtility.getAddOperationName(), "模型的Code必须唯一,且不能更改!");
            flowIntegratedPO.setIntegratedCreateTime(new Date());
            flowIntegratedPO.setIntegratedCreator(jb4DSession.getUserName());
            flowIntegratedPO.setIntegratedUpdateTime(new Date());
            flowIntegratedPO.setIntegratedUpdater(jb4DSession.getUserName());
            flowIntegratedPO.setIntegratedStatus(EnableTypeEnum.enable.getDisplayName());
            flowIntegratedPO.setIntegratedOrderNum(flowIntegratedMapper.nextOrderNum());
            flowIntegratedPO.setIntegratedResourceName("");
            flowIntegratedPO.setIntegratedFromType("BPMN-JS-Web-DESIGN");
            flowIntegratedMapper.insert(flowIntegratedPO);
        }
        else {
            ValidateUtility.isBeUnique(recordID, new IMustBeUnique() {
                @Override
                public String beUniquePOId() {
                    FlowIntegratedEntity entity=flowIntegratedMapper.selectByStartKey(flowIntegratedPO.getIntegratedStartKey());
                    return entity!=null?entity.getIntegratedId():null;
                }
            }, BaseUtility.getUpdateOperationName(), "模型的Key必须唯一,且不能更改!");
            ValidateUtility.isBeUnique(recordID, new IMustBeUnique() {
                @Override
                public String beUniquePOId() {
                    FlowIntegratedEntity entity=flowIntegratedMapper.selectByCode(flowIntegratedPO.getIntegratedCode());
                    return entity!=null?entity.getIntegratedId():null;
                }
            }, BaseUtility.getUpdateOperationName(), "模型的Code必须唯一,且不能更改!");

            flowIntegratedPO.setIntegratedUpdateTime(new Date());
            flowIntegratedPO.setIntegratedUpdater(jb4DSession.getUserName());
            flowIntegratedMapper.updateByPrimaryKey(flowIntegratedPO);
        }
        byte[] flowModelerByte=flowIntegratedPO.getBpmnXMLModeler().getBytes(StandardCharsets.UTF_8);
        FileInfoEntity fileInfoEntity =fileInfoService.addSmallFileToDB(jb4DSession,"模型文件.bpmn",flowModelerByte,flowIntegratedPO.getIntegratedId(),"TBUILD_FLOW_INTEGRATED", IFileInfoService.FILE_OBJ_TYPE_TABLE_NAME,IFileInfoService.FILE_CATEGORY_BPMN_XML);

        ProcessEngine processEngine= CamundaIntegrate.getProcessEngine();
        RepositoryService repositoryService = processEngine.getRepositoryService();
        Deployment deployment =repositoryService.createDeployment()
                .name(flowIntegratedPO.getIntegratedName())
                .source(flowIntegratedPO.getIntegratedFromType())
                .tenantId(bpmnDefinitions.getBpmnProcess().getJb4dcTenantId())
                .addString(flowIntegratedPO.getIntegratedName(),flowIntegratedPO.getBpmnXMLModeler())
                .deploy();
        System.out.println(deployment);
        return flowIntegratedPO;*/
    }

    private List<ModelAssObjectEntity> buildModelAssObjectEntities(JB4DCSession jb4DCSession,String json,String modelId,String type,String reKey,String textKey,String valueKey,int orderNum) throws JBuild4DCGenerallyException {
        List<ModelAssObjectEntity> modelAssObjectEntityList = new ArrayList<>();
        if(StringUtility.isNotEmpty(json)){
            try {
                List<Map> groupList = JsonUtility.toObjectList(json, Map.class);
                for (int i = 0; i < groupList.size(); i++) {
                    Map map = groupList.get(i);
                    ModelAssObjectEntity modelGroupRefEntity = new ModelAssObjectEntity();
                    modelGroupRefEntity.setObjectId(UUIDUtility.getUUID());
                    modelGroupRefEntity.setObjectModelId(modelId);
                    modelGroupRefEntity.setObjectType(type);
                    modelGroupRefEntity.setObjectReKey(reKey);
                    modelGroupRefEntity.setObjectText(map.get(textKey).toString());
                    modelGroupRefEntity.setObjectValue(map.get(valueKey).toString());
                    modelGroupRefEntity.setObjectOrderNum(orderNum+i+1);
                    modelGroupRefEntity.setObjectCreateTime(new Date());
                    modelGroupRefEntity.setObjectCreator(jb4DCSession.getUserName());
                    modelGroupRefEntity.setObjectCreatorId(jb4DCSession.getUserId());
                    modelGroupRefEntity.setObjectDesc("");

                    modelAssObjectEntityList.add(modelGroupRefEntity);
                }
            } catch (IOException ex) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex.getMessage(), ex.getCause(), ex.getStackTrace());
            }
        }
        return modelAssObjectEntityList;
    }

    private ModelIntegratedEntity getLastSaveModelIntegratedEntity(JB4DCSession jb4DCSession, String modelReKey) {
        List<ModelIntegratedEntity> modelIntegratedEntityList = flowIntegratedMapper.selectLastSaveModelIntegratedEntity(modelReKey);
        if(modelIntegratedEntityList!=null&&modelIntegratedEntityList.size()>0){
            return modelIntegratedEntityList.get(0);
        }
        return null;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ModelIntegratedEntity record) throws JBuild4DCGenerallyException {
        return 0;
        /*return super.save(jb4DCSession,id, record, new IAddBefore<FlowIntegratedEntity>() {
            @Override
            public FlowIntegratedEntity run(JB4DCSession jb4DCSession,FlowIntegratedEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });*/
    }

    @Override
    public boolean modelMustReDeployment(JB4DCSession jb4DCSession,String sourceModelXML,String newModelXML){
        return true;
    }

    @Override
    public String getBpmnTemplateModelByName(String templateName) throws IOException, URISyntaxException {
        String result="";
        InputStream is= FileUtility.getStreamByLevel("/ModelerServerResource/Template/"+templateName+".bpmn");
        StringWriter writer = new StringWriter();
        IOUtils.copy(is, writer,StandardCharsets.UTF_8);
        result = writer.toString();

        result=result.replace("Flow_Model_Empty","Flow_Model_"+ DateUtility.getTimestampString());
        result=result.replace("Flow_Model_JB4DC_Code_Empty","Flow_Model_JB4DC_Code_"+ DateUtility.getTimestampString());

        return result;
    }

    @Override
    public List<ModelIntegratedEntity> getMyStartEnableModel(JB4DCSession session) {
        if(session.isFullAuthority()){
            return flowIntegratedMapper.selectAllStartEnableModel();
        }
        else{
            return flowIntegratedMapper.selectStartEnableModelByRole(session.getUserId(),session.getRoleKeys());
        }
        //return null;
    }

    private void buildFlowModelRuntimePOBaseInfo(JB4DCSession session,FlowModelRuntimePO flowModelRuntimePO, String modelKey,boolean isStart,String currentNodeKey) throws JAXBException, XMLStreamException, IOException, JBuild4DCGenerallyException {
        //FlowModelRuntimePO flowModelRuntimePO = new FlowModelRuntimePO();

        String modelXml = flowEngineModelIntegratedService.getDeployedCamundaModelContentLastVersion(session, modelKey, ModelTenantIdEnum.builderGeneralTenant);
        BpmnDefinitions bpmnDefinitions = parseToPO(modelXml);
        BpmnProcess bpmnProcess = bpmnDefinitions.getBpmnProcess();

        flowModelRuntimePO.setStartEvent(isStart);
        flowModelRuntimePO.setJb4dcFormId(bpmnProcess.getJb4dcFormId());
        flowModelRuntimePO.setJb4dcFormPlugin(bpmnProcess.getJb4dcFormPlugin());
        flowModelRuntimePO.setJb4dcFormParas(bpmnProcess.getJb4dcFormParas());

        flowModelRuntimePO.setJb4dcFormEx1Id(bpmnProcess.getJb4dcFormEx1Id());
        flowModelRuntimePO.setJb4dcFormEx1Plugin(bpmnProcess.getJb4dcFormEx1Plugin());
        flowModelRuntimePO.setJb4dcFormEx1Paras(bpmnProcess.getJb4dcFormEx1Paras());
        if (isStart) {
            BpmnStartEvent bpmnStartEvent = bpmnDefinitions.getBpmnProcess().getStartEvent();
            flowModelRuntimePO.setCurrentNodeKey(bpmnStartEvent.getId());
            flowModelRuntimePO.setCurrentNodeName(bpmnStartEvent.getName());

            if(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcFormId())){
                flowModelRuntimePO.setJb4dcFormId(bpmnStartEvent.getJb4dcFormId());
                flowModelRuntimePO.setJb4dcFormPlugin(bpmnStartEvent.getJb4dcFormPlugin());
                flowModelRuntimePO.setJb4dcFormParas(bpmnStartEvent.getJb4dcFormParas());
            }
            if(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcFormEx1Id())){
                flowModelRuntimePO.setJb4dcFormEx1Id(bpmnStartEvent.getJb4dcFormEx1Id());
                flowModelRuntimePO.setJb4dcFormEx1Plugin(bpmnStartEvent.getJb4dcFormEx1Plugin());
                flowModelRuntimePO.setJb4dcFormEx1Paras(bpmnStartEvent.getJb4dcFormEx1Paras());
            }

            flowModelRuntimePO.setJb4dcOuterFormUrl(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcOuterFormUrl()) ? bpmnStartEvent.getJb4dcOuterFormUrl() : bpmnProcess.getJb4dcOuterFormUrl());
            flowModelRuntimePO.setJb4dcOuterFormEx1Url(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcOuterFormEx1Url()) ? bpmnStartEvent.getJb4dcOuterFormEx1Url() : bpmnProcess.getJb4dcOuterFormEx1Url());
            flowModelRuntimePO.setJb4dcProcessTitleEditText(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcProcessTitleEditText()) ? bpmnStartEvent.getJb4dcProcessTitleEditText() : bpmnProcess.getJb4dcProcessTitleEditText());
            flowModelRuntimePO.setJb4dcProcessTitleEditValue(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcProcessTitleEditValue()) ? bpmnStartEvent.getJb4dcProcessTitleEditValue() : bpmnProcess.getJb4dcProcessTitleEditValue());
            flowModelRuntimePO.setJb4dcProcessDescriptionEditText(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcProcessDescriptionEditText()) ? bpmnStartEvent.getJb4dcProcessDescriptionEditText() : bpmnProcess.getJb4dcProcessDescriptionEditText());
            flowModelRuntimePO.setJb4dcProcessDescriptionEditValue(StringUtility.isNotEmpty(bpmnStartEvent.getJb4dcProcessDescriptionEditValue()) ? bpmnStartEvent.getJb4dcProcessDescriptionEditValue() : bpmnProcess.getJb4dcProcessDescriptionEditValue());
            flowModelRuntimePO.setJb4dcProcessActionConfirm(bpmnProcess.getJb4dcProcessActionConfirm());
            if (bpmnStartEvent.getJb4dcUseContentDocument()!=null&&(bpmnStartEvent.getJb4dcUseContentDocument().equals("byNodeConfig") || bpmnStartEvent.getJb4dcUseContentDocument().equals("notUse"))) {
                flowModelRuntimePO.setJb4dcUseContentDocument(bpmnStartEvent.getJb4dcUseContentDocument());
                flowModelRuntimePO.setJb4dcContentDocumentPlugin(bpmnStartEvent.getJb4dcContentDocumentPlugin());
                flowModelRuntimePO.setJb4dcContentDocumentRedHeadTemplate(bpmnStartEvent.getJb4dcContentDocumentRedHeadTemplate());
            } else {
                flowModelRuntimePO.setJb4dcUseContentDocument(bpmnProcess.getJb4dcUseContentDocument());
                flowModelRuntimePO.setJb4dcContentDocumentPlugin(bpmnProcess.getJb4dcContentDocumentPlugin());
                flowModelRuntimePO.setJb4dcContentDocumentRedHeadTemplate(bpmnProcess.getJb4dcContentDocumentRedHeadTemplate());
            }

            InstanceEntity instanceEntity=new InstanceEntity();
            instanceEntity.setInstCreateTime(new Date());
            instanceEntity.setInstCreator(session.getUserName());
            instanceEntity.setInstCreatorId(session.getUserId());
            instanceEntity.setInstOrganName(session.getOrganName());
            instanceEntity.setInstOrganId(session.getOrganId());
            flowModelRuntimePO.setInstanceEntity(instanceEntity);

        } else {
            BpmnUserTask userTask = bpmnProcess.getUserTaskList().stream().filter(item -> item.getId().equals(currentNodeKey)).findFirst().orElse(null);
            if (userTask != null) {
                flowModelRuntimePO.setCurrentNodeKey(userTask.getId());
                flowModelRuntimePO.setCurrentNodeName(userTask.getName());

                if(StringUtility.isNotEmpty(userTask.getJb4dcFormId())){
                    flowModelRuntimePO.setJb4dcFormId(userTask.getJb4dcFormId());
                    flowModelRuntimePO.setJb4dcFormPlugin(userTask.getJb4dcFormPlugin());
                    flowModelRuntimePO.setJb4dcFormParas(userTask.getJb4dcFormParas());
                }
                if(StringUtility.isNotEmpty(userTask.getJb4dcFormEx1Id())){
                    flowModelRuntimePO.setJb4dcFormEx1Id(userTask.getJb4dcFormEx1Id());
                    flowModelRuntimePO.setJb4dcFormEx1Plugin(userTask.getJb4dcFormEx1Plugin());
                    flowModelRuntimePO.setJb4dcFormEx1Paras(userTask.getJb4dcFormEx1Paras());
                }

                flowModelRuntimePO.setJb4dcOuterFormUrl(StringUtility.isNotEmpty(userTask.getJb4dcOuterFormUrl()) ? userTask.getJb4dcOuterFormUrl() : bpmnProcess.getJb4dcOuterFormUrl());
                flowModelRuntimePO.setJb4dcOuterFormEx1Url(StringUtility.isNotEmpty(userTask.getJb4dcOuterFormEx1Url()) ? userTask.getJb4dcOuterFormEx1Url() : bpmnProcess.getJb4dcOuterFormEx1Url());
                flowModelRuntimePO.setJb4dcProcessTitleEditText(StringUtility.isNotEmpty(userTask.getJb4dcProcessTitleEditText()) ? userTask.getJb4dcProcessTitleEditText() : bpmnProcess.getJb4dcProcessTitleEditText());
                flowModelRuntimePO.setJb4dcProcessTitleEditValue(StringUtility.isNotEmpty(userTask.getJb4dcProcessTitleEditValue()) ? userTask.getJb4dcProcessTitleEditValue() : bpmnProcess.getJb4dcProcessTitleEditValue());
                flowModelRuntimePO.setJb4dcProcessDescriptionEditText(StringUtility.isNotEmpty(userTask.getJb4dcProcessDescriptionEditText()) ? userTask.getJb4dcProcessDescriptionEditText() : bpmnProcess.getJb4dcProcessDescriptionEditText());
                flowModelRuntimePO.setJb4dcProcessDescriptionEditValue(StringUtility.isNotEmpty(userTask.getJb4dcProcessDescriptionEditValue()) ? userTask.getJb4dcProcessDescriptionEditValue() : bpmnProcess.getJb4dcProcessDescriptionEditValue());
                flowModelRuntimePO.setJb4dcProcessActionConfirm(bpmnProcess.getJb4dcProcessActionConfirm());
                if (userTask.getJb4dcUseContentDocument().equals("byNodeConfig") || userTask.getJb4dcUseContentDocument().equals("notUse")) {
                    flowModelRuntimePO.setJb4dcUseContentDocument(userTask.getJb4dcUseContentDocument());
                    flowModelRuntimePO.setJb4dcContentDocumentPlugin(userTask.getJb4dcContentDocumentPlugin());
                    flowModelRuntimePO.setJb4dcContentDocumentRedHeadTemplate(userTask.getJb4dcContentDocumentRedHeadTemplate());
                } else {
                    flowModelRuntimePO.setJb4dcUseContentDocument(bpmnProcess.getJb4dcUseContentDocument());
                    flowModelRuntimePO.setJb4dcContentDocumentPlugin(bpmnProcess.getJb4dcContentDocumentPlugin());
                    flowModelRuntimePO.setJb4dcContentDocumentRedHeadTemplate(bpmnProcess.getJb4dcContentDocumentRedHeadTemplate());
                }
            } else {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "从模型中找不到Key为" + currentNodeKey + "的节点!");
            }
        }

        flowModelRuntimePO.setModelIntegratedEntity(getLastSaveModelIntegratedEntity(session, modelKey));
        flowModelRuntimePO.setBpmnDefinitions(bpmnDefinitions);
        flowModelRuntimePO.setBpmnXmlContent(URLUtility.encode(modelXml));
    }



    @Override
    public FlowModelRuntimePO getRuntimeModelWithStart(JB4DCSession session, String modelKey) throws IOException, JAXBException, XMLStreamException, JBuild4DCGenerallyException {
        FlowModelRuntimePO result = new FlowModelRuntimePO();
        buildFlowModelRuntimePOBaseInfo(session, result, modelKey, true, "");
        //buildFlowModelRuntimePOBindFormInfo(session, result, modelKey, true, modelKey);
        return result;
    }

    @Override
    public FlowModelIntegratedPO getLastPOByModelReKey(JB4DCSession jb4DSession, String modelReKey) throws IOException {
        ModelIntegratedEntity modelIntegratedEntity = getLastSaveModelIntegratedEntity(jb4DSession, modelReKey);
        if (modelIntegratedEntity != null) {
            return FlowModelIntegratedPO.parseToPO(modelIntegratedEntity);
        }
        return null;
    }

    @Override
    public List<BpmnUserTask> getLastDeployedCamundaModelBpmnUserTaskByIdList(JB4DCSession jb4DCSession, String modelReKey, List<String> bpmnTaskIdList) throws JAXBException, XMLStreamException, IOException {
        String modelContent = flowEngineModelIntegratedService.getDeployedCamundaModelContentLastVersion(jb4DCSession, modelReKey, ModelTenantIdEnum.builderGeneralTenant);
        BpmnDefinitions bpmnDefinitions = this.parseToPO(modelContent);
        return bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item->bpmnTaskIdList.contains(item.getId())).collect(Collectors.toList());
    }
}
