package com.jb4dc.workflow.integrate.impl;

import com.jb4dc.builder.dao.flow.FlowIntegratedMapper;
import com.jb4dc.workflow.integrate.IWFTaskIntegratedService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class WFTaskIntegratedServiceImpl extends WFCamundaIntegrateAbstractService implements IWFTaskIntegratedService {

    private Logger logger= LoggerFactory.getLogger(WFTaskIntegratedServiceImpl.class);

    public WFTaskIntegratedServiceImpl(FlowIntegratedMapper _defaultBaseMapper) {
        super(_defaultBaseMapper);
    }


    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, Object entity) throws JBuild4DCGenerallyException {
        return 0;
    }
}
