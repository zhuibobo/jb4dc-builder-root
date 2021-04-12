package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.dao.flow.FlowIntegratedMapper;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import com.jb4dc.builder.po.FlowIntegratedPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.core.base.tools.IMustBeUnique;
import com.jb4dc.core.base.tools.ValidateUtility;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.service.IFileInfoService;
import com.jb4dc.workflow.custpo.bpmn.BpmnDefinitions;
import com.jb4dc.workflow.integrate.engine.impl.CamundaIntegrate;
import com.jb4dc.workflow.integrate.engine.impl.FlowEngineModelIntegrateServiceImpl;
import com.jb4dc.workflow.integrate.extend.IFlowExtendModelService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.repository.Deployment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class FlowExtendModelServiceImpl extends BaseServiceImpl<FlowIntegratedEntity> implements IFlowExtendModelService {
    private Logger logger= LoggerFactory.getLogger(FlowEngineModelIntegrateServiceImpl.class);

    FlowIntegratedMapper flowIntegratedMapper;

    @Autowired
    private IFileInfoService fileInfoService;

    public FlowExtendModelServiceImpl(FlowIntegratedMapper _defaultBaseMapper){
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

    @Override
    public FlowIntegratedPO saveFlowModel(JB4DCSession jb4DSession, String recordID, FlowIntegratedPO flowIntegratedPO) throws JBuild4DCGenerallyException, IOException, JAXBException, XMLStreamException {
        FlowIntegratedEntity flowIntegratedEntity=flowIntegratedMapper.selectByPrimaryKey(recordID);
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
            //add
            //flowIntegratedPO.setIntegratedDeId("");
            //flowIntegratedPO.setIntegratedDeMessage("");
            //flowIntegratedPO.setIntegratedDeSuccess("");
            //flowIntegratedPO.setIntegratedDeploymentId("");
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
            //update
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
        return flowIntegratedPO;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, FlowIntegratedEntity record) throws JBuild4DCGenerallyException {
        return 0;
        /*return super.save(jb4DCSession,id, record, new IAddBefore<FlowIntegratedEntity>() {
            @Override
            public FlowIntegratedEntity run(JB4DCSession jb4DCSession,FlowIntegratedEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });*/
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
