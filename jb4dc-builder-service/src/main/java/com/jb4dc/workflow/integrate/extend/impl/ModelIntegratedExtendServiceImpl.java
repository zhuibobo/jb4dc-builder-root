package com.jb4dc.workflow.integrate.extend.impl;
import java.io.StringWriter;
import java.net.URISyntaxException;
import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.util.*;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.service.po.SimplePO;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.tools.URLUtility;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.*;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.dbentities.ModelAssObjectEntity;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;
import com.jb4dc.workflow.exenum.ModelDesignSourceTypeEnum;
import com.jb4dc.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.workflow.integrate.engine.IFlowEngineModelIntegratedService;
import com.jb4dc.workflow.integrate.extend.IModelAssObjectExtendService;
import com.jb4dc.workflow.integrate.extend.IModelGroupRefExtendService;
import com.jb4dc.workflow.po.FlowModelIntegratedPO;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.dao.ModelIntegratedMapper;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.integrate.engine.impl.FlowEngineModelIntegrateServiceImpl;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.po.bpmn.process.*;
import org.apache.commons.io.IOUtils;
import org.camunda.bpm.engine.repository.Deployment;
import org.camunda.bpm.engine.repository.ProcessDefinition;
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
import java.util.stream.Stream;

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
        BpmnDefinitions bpmnDefinitions=XMLUtility.toObject(xml, BpmnDefinitions.class);
        if(bpmnDefinitions.getBpmnProcess().getUserTaskList()!=null) {
            for (BpmnTask bpmnTask : bpmnDefinitions.getBpmnProcess().getUserTaskList()) {
                bpmnTask.setTaskTypeName(BpmnUserTask.class.getTypeName());

                if(bpmnTask.getMultiInstanceLoopCharacteristics()==null){
                    bpmnTask.setMultiInstanceTask(false);
                    bpmnTask.setMultiInstanceType("Single");
                }
                else {
                    bpmnTask.setMultiInstanceTask(true);
                    if(bpmnTask.getMultiInstanceLoopCharacteristics().getIsSequential()!=null&&bpmnTask.getMultiInstanceLoopCharacteristics().getIsSequential().equals("true")){
                        bpmnTask.setMultiInstanceType("Sequential");
                    }
                    else{
                        bpmnTask.setMultiInstanceType("Parallel");
                    }
                }
            }
        }
        if(bpmnDefinitions.getBpmnProcess().getServiceTaskList()!=null) {
            for (BpmnTask bpmnTask : bpmnDefinitions.getBpmnProcess().getServiceTaskList()) {
                bpmnTask.setTaskTypeName(BpmnServiceTask.class.getTypeName());
            }
        }

        return bpmnDefinitions;
    }

    @Override
    public BpmnDefinitions parseToPO(InputStream is) throws JAXBException, XMLStreamException, IOException {
        String str = IOUtils.toString(is, "utf-8");
        return parseToPO(str);
    }

    //public List<List<>>

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

    @Override
    public ModelIntegratedEntity getLastSaveModelIntegratedEntity(JB4DCSession jb4DCSession, String modelReKey) {
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

    @Override
    public FlowModelIntegratedPO getLastSavePOByModelReKey(JB4DCSession jb4DSession, String modelReKey) throws IOException {
        ModelIntegratedEntity modelIntegratedEntity = getLastSaveModelIntegratedEntity(jb4DSession, modelReKey);
        if (modelIntegratedEntity != null) {
            return FlowModelIntegratedPO.parseToPO(modelIntegratedEntity);
        }
        return null;
    }

    @Override
    public ModelIntegratedEntity getLastDeployedPOByModelReKey(JB4DCSession jb4DSession, String modelReKey){
        ProcessDefinition processDefinition=flowEngineModelIntegratedService.getDeployedCamundaModelLastVersion(jb4DSession,modelReKey,ModelTenantIdEnum.builderGeneralTenant);
        String processDefinitionId=processDefinition.getId();
        ModelIntegratedEntity modelIntegratedEntity=flowIntegratedMapper.selectByReId(processDefinitionId);
        return modelIntegratedEntity;
    }

    @Override
    public ModelIntegratedEntity getLastDeployedPOByDefinitionId(JB4DCSession jb4DSession, String processDefinitionId){
        ModelIntegratedEntity modelIntegratedEntity=flowIntegratedMapper.selectByReId(processDefinitionId);
        return modelIntegratedEntity;
    }

    @Override
    public BpmnDefinitions getLastDeployedCamundaModelBpmnDefinitions(JB4DCSession jb4DCSession, String modelReKey) throws IOException, JAXBException, XMLStreamException {
        String modelContent = flowEngineModelIntegratedService.getDeployedCamundaModelContentLastVersion(jb4DCSession, modelReKey, ModelTenantIdEnum.builderGeneralTenant);
        BpmnDefinitions bpmnDefinitions = this.parseToPO(modelContent);
        return bpmnDefinitions;
    }

    @Override
    public BpmnDefinitions getDeployedCamundaModelBpmnDefinitions(JB4DCSession jb4DCSession, String processDefinitionId) throws IOException, JAXBException, XMLStreamException {
        String modelContent = flowEngineModelIntegratedService.getDeployedCamundaModelContent(jb4DCSession, processDefinitionId);
        BpmnDefinitions bpmnDefinitions = this.parseToPO(modelContent);
        return bpmnDefinitions;
    }

    @Override
    public List<BpmnTask> getDeployedCamundaModelBpmnFlowNodeByIdList(JB4DCSession jb4DCSession, String modelReKey, BpmnDefinitions bpmnDefinitions, List<String> bpmnTaskIdList) throws JAXBException, XMLStreamException, IOException {
        //String modelContent = flowEngineModelIntegratedService.getDeployedCamundaModelContentLastVersion(jb4DCSession, modelReKey, ModelTenantIdEnum.builderGeneralTenant);
        //BpmnDefinitions bpmnDefinitions = this.parseToPO(modelContent);
        List<BpmnTask> userTaskResult=new ArrayList<>();

        if(bpmnDefinitions.getBpmnProcess().getUserTaskList()!=null&&bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item -> bpmnTaskIdList.contains(item.getId())).count()>0){
            userTaskResult=bpmnDefinitions.getBpmnProcess().getUserTaskList().stream().filter(item -> bpmnTaskIdList.contains(item.getId())).collect(Collectors.toList());
        }
        if(bpmnDefinitions.getBpmnProcess().getServiceTaskList()!=null&&bpmnDefinitions.getBpmnProcess().getServiceTaskList().stream().filter(item -> bpmnTaskIdList.contains(item.getId())).count()>0) {
            List<BpmnTask> serviceTaskResult = bpmnDefinitions.getBpmnProcess().getServiceTaskList().stream().filter(item -> bpmnTaskIdList.contains(item.getId())).collect(Collectors.toList());
            userTaskResult.addAll(serviceTaskResult);
        }
        return userTaskResult;
    }

    @Override
    public List<ModelIntegratedEntity> getListByPrimaryKey(JB4DCSession jb4DCSession, List<String> modelIds) {
        return flowIntegratedMapper.selectListByPrimaryKey(modelIds);
    }

    @Override
    public SimplePO saveValidate(JB4DCSession jb4DSession, FlowModelIntegratedPO flowModelIntegratedPO) throws JBuild4DCGenerallyException {
        BpmnDefinitions bpmnDefinitions = null;
        BpmnProcess bpmnProcess = null;
        String bpmnDefinitionKey;
        SimplePO simplePO=new SimplePO();
        simplePO.setSuccess(true);
        simplePO.setMessage("验证成功!");
        try {
            bpmnDefinitions = parseToPO(flowModelIntegratedPO.getModelContent());
            bpmnProcess = bpmnDefinitions.getBpmnProcess();
            bpmnDefinitionKey = bpmnProcess.getId();

            if(StringUtility.isEmpty(bpmnProcess.getName())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,"流程名称不能为空!");
            }
            if(flowModelIntegratedPO.getOperationName().equals(BaseUtility.getAddOperationName())) {
                ModelIntegratedEntity modelIntegratedEntity = getLastSaveModelIntegratedEntity(jb4DSession, bpmnDefinitionKey);
                if (modelIntegratedEntity != null) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, "已经存在ReKey为:" + bpmnDefinitionKey + "的流程模型!");
                }
            }

            return simplePO;
        } catch (Exception e) {
            logger.error("ModelIntegratedExtendServiceImpl.saveValidate",e);
            simplePO.setMessage(e.getMessage());
            simplePO.setSuccess(false);
            return simplePO;
        }
    }
}
