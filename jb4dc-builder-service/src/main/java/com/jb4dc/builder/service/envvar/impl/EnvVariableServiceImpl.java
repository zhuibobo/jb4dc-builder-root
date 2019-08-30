package com.jb4dc.builder.service.envvar.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.IUpdateBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.envvar.EnvVariableMapper;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.service.envvar.IEnvVariableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/29
 * To change this template use File | Settings | File Templates.
 */
@Service
public class EnvVariableServiceImpl extends BaseServiceImpl<EnvVariableEntity> implements IEnvVariableService
{
    EnvVariableMapper envVariableMapper;

    @Autowired
    public EnvVariableServiceImpl(EnvVariableMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        envVariableMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, EnvVariableEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession, id, record, new IAddBefore<EnvVariableEntity>() {
            @Override
            public EnvVariableEntity run(JB4DCSession jb4DCSession, EnvVariableEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                EnvVariableEntity tempEntity = envVariableMapper.selectByValue(sourceEntity.getEnvVarValue());
                if (tempEntity != null) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "Value必须唯一!");
                }

                sourceEntity.setEnvVarOrderNum(envVariableMapper.nextOrderNum());
                sourceEntity.setEnvVarCreateTime(new Date());
                sourceEntity.setEnvVarUserId(jb4DCSession.getUserId());
                sourceEntity.setEnvVarUserName(jb4DCSession.getUserName());
                sourceEntity.setEnvVarOrganId(jb4DCSession.getOrganId());
                sourceEntity.setEnvVarOrganName(jb4DCSession.getOrganName());
                return sourceEntity;
            }
        }, new IUpdateBefore<EnvVariableEntity>() {
            @Override
            public EnvVariableEntity run(JB4DCSession jb4DCSession, EnvVariableEntity sourceEntity) throws JBuild4DCGenerallyException {
                EnvVariableEntity tempEntity = envVariableMapper.selectByValue(sourceEntity.getEnvVarValue());
                if(tempEntity!=null&&!tempEntity.getEnvVarId().equals(sourceEntity.getEnvVarId())){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "Value必须唯一!");
                }
                return sourceEntity;
            }
        });
    }

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {

    }
}