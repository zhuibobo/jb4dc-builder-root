package com.jb4dc.builder.service.envvar.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.envvar.EnvGroupMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetGroupEntity;
import com.jb4dc.builder.dbentities.envvar.EnvGroupEntity;
import com.jb4dc.builder.service.envvar.IEnvGroupService;
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
public class EnvGroupServiceImpl extends BaseServiceImpl<EnvGroupEntity> implements IEnvGroupService
{
    private String rootId="0";
    private String rootParentId="-1";

    EnvGroupMapper envGroupMapper;

    @Autowired
    public EnvGroupServiceImpl(EnvGroupMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        envGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, EnvGroupEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<EnvGroupEntity>() {
            @Override
            public EnvGroupEntity run(JB4DCSession jb4DCSession,EnvGroupEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setEnvGroupOrderNum(envGroupMapper.nextOrderNum());
                sourceEntity.setEnvGroupChildCount(0);
                sourceEntity.setEnvGroupCreateTime(new Date());
                sourceEntity.setEnvGroupOrganId(jb4DCSession.getOrganId());
                sourceEntity.setEnvGroupOrganName(jb4DCSession.getOrganName());
                String parentIdList;
                if(sourceEntity.getEnvGroupId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setEnvGroupParentId(rootParentId);
                }
                else
                {
                    EnvGroupEntity parentEntity=envGroupMapper.selectByPrimaryKey(sourceEntity.getEnvGroupParentId());
                    parentIdList=parentEntity.getEnvGroupPidList();
                    parentEntity.setEnvGroupChildCount(parentEntity.getEnvGroupChildCount()+1);
                    envGroupMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setEnvGroupPidList(parentIdList+"*"+sourceEntity.getEnvGroupId());
                return sourceEntity;
            }
        });
    }

    @Override
    public EnvGroupEntity initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        EnvGroupEntity rootEntity=new EnvGroupEntity();
        rootEntity.setEnvGroupId(rootId);
        rootEntity.setEnvGroupParentId(rootParentId);
        rootEntity.setEnvGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setEnvGroupText("环境变量分组");
        rootEntity.setEnvGroupValue("环境变量分组");
        this.saveSimple(jb4DCSession,rootEntity.getEnvGroupId(),rootEntity);
        return rootEntity;
    }
}