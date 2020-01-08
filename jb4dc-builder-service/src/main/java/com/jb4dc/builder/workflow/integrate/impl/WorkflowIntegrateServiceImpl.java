package com.jb4dc.builder.workflow.integrate.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.dao.flow.FlowIntegratedMapper;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import com.jb4dc.builder.po.FlowIntegratedPO;
import com.jb4dc.builder.workflow.integrate.IWorkFlowIntegratedService;
import com.jb4dc.builder.workflow.po.bpmn.BpmnDefinitions;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/25
 * To change this template use File | Settings | File Templates.
 */
@Service
public class WorkflowIntegrateServiceImpl extends BaseServiceImpl<FlowIntegratedEntity> implements IWorkFlowIntegratedService
{
    FlowIntegratedMapper flowIntegratedMapper;
    public WorkflowIntegrateServiceImpl(FlowIntegratedMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        flowIntegratedMapper=_defaultBaseMapper;
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

    public BpmnDefinitions parseToPO(String xml) throws JAXBException, XMLStreamException {
        return XMLUtility.toObject(xml, BpmnDefinitions.class);
    }

    public BpmnDefinitions parseToPO(InputStream is) throws JAXBException, XMLStreamException {
        return XMLUtility.toObject(is, BpmnDefinitions.class);
    }

    @Override
    public FlowIntegratedPO getPOByIntegratedId(JB4DCSession jb4DSession, String recordId) {
        return null;
    }

    @Override
    public FlowIntegratedPO saveFlowModel(JB4DCSession jb4DSession, String recordID, FlowIntegratedPO flowIntegratedPO) throws JBuild4DCGenerallyException {
        FlowIntegratedEntity flowIntegratedEntity=flowIntegratedMapper.selectByPrimaryKey(recordID);
        if(flowIntegratedEntity==null){
            //add
        }
        else {
            //update
        }
        return flowIntegratedPO;
    }
}
