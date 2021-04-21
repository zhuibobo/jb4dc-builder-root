package com.jb4dc.workflow.integrate.extend.impl;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.ValidateUtility;
import com.jb4dc.workflow.exenum.ModelDesignSourceTypeEnum;
import com.jb4dc.workflow.exenum.ModelTenantIdEnum;
import com.jb4dc.workflow.integrate.engine.IFlowEngineModelIntegratedService;
import com.jb4dc.workflow.integrate.engine.impl.CamundaIntegrate;
import com.jb4dc.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.dao.ModelIntegratedMapper;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.integrate.engine.impl.FlowEngineModelIntegrateServiceImpl;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.po.FlowIntegratedPO;
import com.jb4dc.workflow.po.bpmn.process.BpmnProcess;
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
    public FlowIntegratedPO getPOByIntegratedId(JB4DCSession jb4DSession, String recordId) {
        return null;
    }

    private FlowIntegratedPO appendFieldValueFromModelContentPO(JB4DCSession jb4DSession,FlowIntegratedPO flowIntegratedPO,BpmnDefinitions bpmnDefinitions,ModelIntegratedEntity lastPreSaveModelIntegratedEntity){
        //flowIntegratedPO.setModelReKey(bpmnDefinitions.getBpmnProcess().getId());
        //flowIntegratedPO.setModelName(bpmnDefinitions.getBpmnProcess().getName());
        //flowIntegratedPO.setModelCode(bpmnDefinitions.getBpmnProcess().getJb4dcCode());
        BpmnProcess bpmnProcess=bpmnDefinitions.getBpmnProcess();
        flowIntegratedPO.setModelId("");
        flowIntegratedPO.setModelReEd("否");
        flowIntegratedPO.setModelReId("");
        flowIntegratedPO.setModelReSuccess("否");
        flowIntegratedPO.setModelReKey(bpmnProcess.getId());
        //flowIntegratedPO.setModelModuleId("");
        flowIntegratedPO.setModelCode(bpmnProcess.getJb4dcCode());
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
        flowIntegratedPO.setModelDesc("");
        flowIntegratedPO.setModelStatus("启用");
        flowIntegratedPO.setModelOrderNum(flowIntegratedMapper.nextOrderNum());
        flowIntegratedPO.setModelDeploymentId("");
        flowIntegratedPO.setModelResourceName(ModelDesignSourceTypeEnum.builderWebDesign.getDisplayName());
        flowIntegratedPO.setModelFromType(ModelDesignSourceTypeEnum.builderWebDesign.getDisplayName());

        if(lastPreSaveModelIntegratedEntity==null) {
            flowIntegratedPO.setModelSaveVersion(1);
        }
        else{
            flowIntegratedPO.setModelSaveVersion(lastPreSaveModelIntegratedEntity.getModelSaveVersion()+1);
        }
        flowIntegratedPO.setModelLastVersion("是");
        return flowIntegratedPO;
    }

    @Override
    @Transactional(rollbackFor= JBuild4DCGenerallyException.class)
    public FlowIntegratedPO saveFlowModel(JB4DCSession jb4DSession, String recordID, FlowIntegratedPO flowIntegratedPO) throws JBuild4DCGenerallyException {
        //获取最后一个保存版本的模型
        ModelIntegratedEntity lastPreSaveModelIntegratedEntity = this.getLastPreSaveModelIntegratedEntity(jb4DSession, flowIntegratedPO.getModelReKey());

        //模型分为三个:当前保存模型,上一版本保存模型,已经部署模型.
        BpmnDefinitions bpmnDefinitions = null;
        try {
            bpmnDefinitions = parseToPO(flowIntegratedPO.getModelContent());
        } catch (JAXBException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, e.getMessage(), e, e.getStackTrace());
        } catch (XMLStreamException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE, e.getMessage(), e, e.getStackTrace());
        }
        flowIntegratedPO = appendFieldValueFromModelContentPO(jb4DSession, flowIntegratedPO, bpmnDefinitions, lastPreSaveModelIntegratedEntity);

        ValidateUtility.isNotEmptyException(flowIntegratedPO.getModelReKey(), JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "启动KEY");
        ValidateUtility.isNotEmptyException(flowIntegratedPO.getModelCode(), JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "Code");
        ValidateUtility.isNotEmptyException(flowIntegratedPO.getModelModuleId(), JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "所属模块");

        Deployment deployment;
        if (flowIntegratedPO.isTryDeployment()) {
            //尝试部署模型到工作流引擎
            //byte[] flowModelerByte=flowIntegratedPO.getModelContent().getBytes(StandardCharsets.UTF_8);
            //FileInfoEntity fileInfoEntity =fileInfoService.addSmallFileToDB(jb4DSession,"模型文件.bpmn",flowModelerByte,flowIntegratedPO.getIntegratedId(),"TBUILD_FLOW_INTEGRATED", IFileInfoService.FILE_OBJ_TYPE_TABLE_NAME,IFileInfoService.FILE_CATEGORY_BPMN_XML);

            /*ProcessEngine processEngine= CamundaIntegrate.getProcessEngine();
            RepositoryService repositoryService = processEngine.getRepositoryService();
            deployment =repositoryService.createDeployment()
                    .name(flowIntegratedPO.getModelName())
                    .source(flowIntegratedPO.getModelFromType())
                    .tenantId(bpmnDefinitions.getBpmnProcess().getJb4dcTenantId())
                    .addString(flowIntegratedPO.getModelName(),flowIntegratedPO.getModelContent())
                    .deploy();*/
            flowEngineModelIntegrateService.deploymentCamundaModel(jb4DSession, flowIntegratedPO.getModelName(), ModelDesignSourceTypeEnum.builderWebDesign, ModelTenantIdEnum.builderGeneralTenant, flowIntegratedPO.getModelContent());
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

    private ModelIntegratedEntity getLastPreSaveModelIntegratedEntity(JB4DCSession jb4DCSession,String modelReKey) {
        return flowIntegratedMapper.selectLastPreSaveModelIntegratedEntity(modelReKey);
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
   /* @Override
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
