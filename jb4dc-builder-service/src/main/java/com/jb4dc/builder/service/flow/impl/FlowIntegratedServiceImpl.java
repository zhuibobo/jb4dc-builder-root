package com.jb4dc.builder.service.flow.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.flow.FlowIntegratedMapper;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import com.jb4dc.builder.service.flow.IFlowIntegratedService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
@Service
public class FlowIntegratedServiceImpl extends BaseServiceImpl<FlowIntegratedEntity> implements IFlowIntegratedService
{
    FlowIntegratedMapper flowIntegratedMapper;
    public FlowIntegratedServiceImpl(FlowIntegratedMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        flowIntegratedMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, FlowIntegratedEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<FlowIntegratedEntity>() {
            @Override
            public FlowIntegratedEntity run(JB4DCSession jb4DCSession,FlowIntegratedEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
