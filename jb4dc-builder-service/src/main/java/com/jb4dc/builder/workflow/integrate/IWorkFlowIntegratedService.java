package com.jb4dc.builder.workflow.integrate;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import com.jb4dc.builder.po.FlowIntegratedPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
public interface IWorkFlowIntegratedService extends IBaseService<FlowIntegratedEntity> {
    FlowIntegratedPO getPOByIntegratedId(JB4DCSession jb4DSession, String recordId);

    FlowIntegratedPO saveFlowModel(JB4DCSession jb4DSession, String recordID, FlowIntegratedPO flowIntegratedPO) throws JBuild4DCGenerallyException;
}
