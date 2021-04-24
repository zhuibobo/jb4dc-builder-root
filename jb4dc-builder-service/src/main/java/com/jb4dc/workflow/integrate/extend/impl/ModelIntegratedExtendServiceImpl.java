package com.jb4dc.workflow.integrate.extend.impl;
import java.io.FileNotFoundException;
import java.io.StringWriter;
import java.net.URISyntaxException;
import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.util.*;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.*;
import com.jb4dc.workflow.dbentities.ModelAssObjectEntity;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;
import com.jb4dc.workflow.exenum.ModelDesignSourceTypeEnum;
import com.jb4dc.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.workflow.integrate.engine.IFlowEngineModelIntegratedService;
import com.jb4dc.workflow.integrate.engine.impl.CamundaIntegrate;
import com.jb4dc.workflow.integrate.extend.IModelAssObjectExtendService;
import com.jb4dc.workflow.integrate.extend.IModelGroupRefExtendService;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.dao.ModelIntegratedMapper;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.integrate.engine.impl.FlowEngineModelIntegrateServiceImpl;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.po.FlowIntegratedPO;
import com.jb4dc.workflow.po.bpmn.process.BpmnProcess;
import org.apache.commons.io.IOUtils;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
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

@Service
public class ModelIntegratedExtendServiceImpl extends BaseServiceImpl<ModelIntegratedEntity> implements IModelIntegratedExtendService {
    private Logger logger= LoggerFactory.getLogger(FlowEngineModelIntegrateServiceImpl.class);

    ModelIntegratedMapper flowIntegratedMapper;

    @Autowired
    IFlowEngineModelIntegratedService flowEngineModelIntegrateService;

    @Autowired
    IModelGroupRefExtendService modelGroupRefExtendService;

    @Autowired
    IModelAssObjectExtendService modelAssObjectExtendService;

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
    public FlowIntegratedPO getPOByIntegratedId(JB4DCSession jb4DSession, String recordId) throws JBuild4DCGenerallyException, IOException {
        ModelIntegratedEntity modelIntegratedEntity=getByPrimaryKey(jb4DSession,recordId);
        return FlowIntegratedPO.parseToPO(modelIntegratedEntity);
    }

    @Override
    public PageInfo<ModelIntegratedEntity> getPageByModule(JB4DCSession jb4DCSession, int pageNum, int pageSize, Map<String, Object> searchItemMap) {
        PageHelper.startPage(pageNum, pageSize);
        List<ModelIntegratedEntity> list = flowIntegratedMapper.selectByModule(searchItemMap);
        PageInfo<ModelIntegratedEntity> pageInfo = new PageInfo(list);
        return pageInfo.getSize() == 0 && pageInfo.getPageNum() > 1 ? this.getPage(jb4DCSession, pageNum - 1, pageSize, searchItemMap) : pageInfo;
    }

    private FlowIntegratedPO appendFieldValueFromModelContentPO(JB4DCSession jb4DSession,FlowIntegratedPO flowIntegratedPO,BpmnDefinitions bpmnDefinitions,ModelIntegratedEntity lastPreSaveModelIntegratedEntity) {
        //flowIntegratedPO.setModelReKey(bpmnDefinitions.getBpmnProcess().getId());
        //flowIntegratedPO.setModelName(bpmnDefinitions.getBpmnProcess().getName());
        //flowIntegratedPO.setModelCode(bpmnDefinitions.getBpmnProcess().getJb4dcCode());
        BpmnProcess bpmnProcess = bpmnDefinitions.getBpmnProcess();
        //flowIntegratedPO.setModelId("");
        flowIntegratedPO.setModelReEd("否");
        flowIntegratedPO.setModelReId("");
        flowIntegratedPO.setModelReSuccess("否");
        flowIntegratedPO.setModelReKey(bpmnProcess.getId());
        //flowIntegratedPO.setModelModuleId("");

        flowIntegratedPO.setModelFlowCategory(bpmnProcess.getJb4dcFlowCategory());
        flowIntegratedPO.setModelImageClass(bpmnProcess.getJb4dcProcessModelImageClass());
        flowIntegratedPO.setModelPesTitleText(bpmnProcess.getJb4dcProcessTitleEditText());
        flowIntegratedPO.setModelPesTitleValue(bpmnProcess.getJb4dcProcessTitleEditValue());
        flowIntegratedPO.setModelPesDescText(bpmnProcess.getJb4dcProcessDescriptionEditText());
        flowIntegratedPO.setModelPesDescValue(bpmnProcess.getJb4dcProcessDescriptionEditValue());
        flowIntegratedPO.setModelPesRestartEnb(bpmnProcess.getJb4dcProcessRestartEnable());
        flowIntegratedPO.setModelPesAnyJumpEnb(bpmnProcess.getJb4dcProcessAnyJumpEnable());
        flowIntegratedPO.setModelName(bpmnProcess.getName());
        flowIntegratedPO.setModelCreateTime(new Date());
        flowIntegratedPO.setModelCreator(jb4DSession.getUserId());
        flowIntegratedPO.setModelUpdateTime(new Date());
        flowIntegratedPO.setModelUpdater(jb4DSession.getUserId());
        flowIntegratedPO.setModelDesc(bpmnProcess.getDocumentation().getText());
        flowIntegratedPO.setModelStatus("启用");
        flowIntegratedPO.setModelOrderNum(flowIntegratedMapper.nextOrderNum());
        flowIntegratedPO.setModelDeploymentId("");
        flowIntegratedPO.setModelResourceName(ModelDesignSourceTypeEnum.builderWebDesign.getDisplayName());
        flowIntegratedPO.setModelFromType(ModelDesignSourceTypeEnum.builderWebDesign.getDisplayName());
        flowIntegratedPO.setModelTenantId(ModelTenantIdEnum.builderGeneralTenant.getDisplayName());

        if (lastPreSaveModelIntegratedEntity == null) {
            flowIntegratedPO.setModelSaveVersion(1);
            flowIntegratedPO.setModelCode(moduleService.buildModuleItemCode(flowIntegratedPO.getModelOrderNum()));
        } else {
            flowIntegratedPO.setModelSaveVersion(lastPreSaveModelIntegratedEntity.getModelSaveVersion() + 1);
            flowIntegratedPO.setModelCode(lastPreSaveModelIntegratedEntity.getModelCode());
        }
        flowIntegratedPO.setModelLastVersion("是");
        flowIntegratedPO.setModelId(flowIntegratedPO.getModelReKey()+":"+flowIntegratedPO.getModelSaveVersion());
        return flowIntegratedPO;
    }


    public FlowIntegratedPO saveFlowModel1(JB4DCSession jb4DSession, FlowIntegratedPO flowIntegratedPO) throws JBuild4DCGenerallyException {

        ModelIntegratedEntity lastPreSaveModelIntegratedEntity = this.getLastPreSaveModelIntegratedEntity(jb4DSession, flowIntegratedPO.getModelReKey());
        lastPreSaveModelIntegratedEntity.setModelLastVersion("否");
        //flowIntegratedMapper.updateByPrimaryKeySelective(lastPreSaveModelIntegratedEntity);
        //flowIntegratedMapper.insert(flowIntegratedPO);
        //deployment.

        return flowIntegratedPO;
    }

    @Override
    @Transactional(rollbackFor= JBuild4DCGenerallyException.class)
    public FlowIntegratedPO saveFlowModel(JB4DCSession jb4DSession, FlowIntegratedPO flowIntegratedPO) throws JBuild4DCGenerallyException {

        //模型分为三个:当前保存模型,上一版本保存模型,已经部署模型.
        BpmnDefinitions bpmnDefinitions = null;
        BpmnProcess bpmnProcess = null;
        String bpmnDefinitionKey;
        try {
            bpmnDefinitions = parseToPO(flowIntegratedPO.getModelContent());
            bpmnProcess = bpmnDefinitions.getBpmnProcess();
            bpmnDefinitionKey = bpmnProcess.getId();
        } catch (JAXBException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, e.getMessage(), e, e.getStackTrace());
        } catch (XMLStreamException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, e.getMessage(), e, e.getStackTrace());
        }

        //获取最后一个保存版本的模型
        ModelIntegratedEntity lastPreSaveModelIntegratedEntity = this.getLastPreSaveModelIntegratedEntity(jb4DSession, bpmnDefinitions.getBpmnProcess().getId());
        flowIntegratedPO = appendFieldValueFromModelContentPO(jb4DSession, flowIntegratedPO, bpmnDefinitions, lastPreSaveModelIntegratedEntity);

        ValidateUtility.isNotEmptyException(flowIntegratedPO.getModelReKey(), JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "启动KEY");
        ValidateUtility.isNotEmptyException(flowIntegratedPO.getModelCode(), JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "Code");
        ValidateUtility.isNotEmptyException(flowIntegratedPO.getModelModuleId(), JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "所属模块");

        if (flowIntegratedPO.isTryDeployment()) {
            //尝试部署模型到工作流引擎
            try {
                Deployment deployment = flowEngineModelIntegrateService.deploymentCamundaModel(jb4DSession, flowIntegratedPO.getModelName(), ModelDesignSourceTypeEnum.builderWebDesign,
                        ModelTenantIdEnum.builderGeneralTenant, flowIntegratedPO.getModelContent());
                flowIntegratedPO.setModelDeploymentId(deployment.getId());
                flowIntegratedPO.setModelReEd("是");
                flowIntegratedPO.setModelReSuccess("是");
                flowIntegratedPO.setModelReId(flowEngineModelIntegrateService.getProcessDefinitionByDeploymentId(jb4DSession, deployment.getId()).getId());
                //deployment.
            } catch (Exception ex) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, ex.getMessage(), ex.getCause(), ex.getStackTrace());
            }
        }

        if (lastPreSaveModelIntegratedEntity != null) {
            lastPreSaveModelIntegratedEntity.setModelLastVersion("否");
            flowIntegratedMapper.updateByPrimaryKeySelective(lastPreSaveModelIntegratedEntity);
        }
        flowIntegratedMapper.insert(flowIntegratedPO);
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
                    modelGroupRefEntity.setGrefModelId(flowIntegratedPO.getModelModuleId());
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
                jb4DSession, bpmnProcess.getJb4dcProcessCandidateStarterGroups(), flowIntegratedPO.getModelId(), "StarterRole",
                flowIntegratedPO.getModelReKey(), "rolePath", "roleId", modelAssObjectEntityList.size() + modelAssObjectMaxOrderNum));
        //启动用户
        modelAssObjectEntityList.addAll(buildModelAssObjectEntities(
                jb4DSession, bpmnProcess.getJb4dcProcessCandidateStarterUsers(), flowIntegratedPO.getModelId(), "StarterUser",
                flowIntegratedPO.getModelReKey(), "userPath", "userId", modelAssObjectEntityList.size() + modelAssObjectMaxOrderNum));
        //管理角色
        modelAssObjectEntityList.addAll(buildModelAssObjectEntities(
                jb4DSession, bpmnProcess.getJb4dcProcessModelManagerGroups(), flowIntegratedPO.getModelId(), "ManagerRole",
                flowIntegratedPO.getModelReKey(), "rolePath", "roleId", modelAssObjectEntityList.size() + modelAssObjectMaxOrderNum));
        //管理用户
        modelAssObjectEntityList.addAll(buildModelAssObjectEntities(
                jb4DSession, bpmnProcess.getJb4dcProcessModelManagerUsers(), flowIntegratedPO.getModelId(), "ManagerUser",
                flowIntegratedPO.getModelReKey(), "userPath", "userId", modelAssObjectEntityList.size() + modelAssObjectMaxOrderNum));

        for (ModelAssObjectEntity modelAssObjectEntity : modelAssObjectEntityList) {
            modelAssObjectExtendService.saveSimple(jb4DSession, modelAssObjectEntity.getObjectId(), modelAssObjectEntity);
        }


        return flowIntegratedPO;
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

    private ModelIntegratedEntity getLastPreSaveModelIntegratedEntity(JB4DCSession jb4DCSession,String modelReKey) {
        List<ModelIntegratedEntity> modelIntegratedEntityList = flowIntegratedMapper.selectLastPreSaveModelIntegratedEntity(modelReKey);
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

    //private List<ModelAssObjectEntity> buildModelAssObjectEntity
    /*@Override
    public BpmnDefinitions parseToPO(String xml) throws JAXBException, XMLStreamException {
        return XMLUtility.toObject(xml, BpmnDefinitions.class);
    }

    @Override
    public BpmnDefinitions parseToPO(InputStream is) throws JAXBException, XMLStreamException {
        return XMLUtility.toObject(is, BpmnDefinitions.class);
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, FlowIntegratedEntity entity) throws JBuild4DCGenerallyException {
        return 0;
    }*/
}
