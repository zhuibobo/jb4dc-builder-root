package com.jb4dc.builder.service.envvar.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.envvar.EnvVariableMapper;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.service.envvar.IEnvVariableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/29
 * To change this template use File | Settings | File Templates.
 */
public class EnvVariableServiceImpl extends BaseServiceImpl<EnvVariableEntity> implements IEnvVariableService
{
    EnvVariableMapper envVariableMapper;
    public EnvVariableServiceImpl(EnvVariableMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        envVariableMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, EnvVariableEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<EnvVariableEntity>() {
            @Override
            public EnvVariableEntity run(JB4DCSession jb4DCSession,EnvVariableEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}