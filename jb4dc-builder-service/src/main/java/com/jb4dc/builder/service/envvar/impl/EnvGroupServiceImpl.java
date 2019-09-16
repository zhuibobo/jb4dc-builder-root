package com.jb4dc.builder.service.envvar.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.IUpdateBefore;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
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
        return super.save(jb4DCSession, id, record, (jb4DCSession1, sourceEntity) -> {
            //
            EnvGroupEntity tempEntity = envGroupMapper.selectByValue(sourceEntity.getEnvGroupValue());
            if (tempEntity != null) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getEnvGroupValue()+"]Value必须唯一!");
            }

            //设置排序,以及其他参数--nextOrderNum()
            sourceEntity.setEnvGroupOrderNum(envGroupMapper.nextOrderNum());
            sourceEntity.setEnvGroupChildCount(0);
            sourceEntity.setEnvGroupCreateTime(new Date());
            sourceEntity.setEnvGroupOrganId(jb4DCSession1.getOrganId());
            sourceEntity.setEnvGroupOrganName(jb4DCSession1.getOrganName());
            String parentIdList;
            if (sourceEntity.getEnvGroupId().equals(rootId)) {
                parentIdList = rootParentId;
                sourceEntity.setEnvGroupParentId(rootParentId);
            } else {
                EnvGroupEntity parentEntity = envGroupMapper.selectByPrimaryKey(sourceEntity.getEnvGroupParentId());
                parentIdList = parentEntity.getEnvGroupPidList();
                parentEntity.setEnvGroupChildCount(parentEntity.getEnvGroupChildCount() + 1);
                envGroupMapper.updateByPrimaryKeySelective(parentEntity);
            }
            sourceEntity.setEnvGroupPidList(parentIdList + "*" + sourceEntity.getEnvGroupId());
            return sourceEntity;
        }, (jb4DCSession12, sourceEntity) -> {
            EnvGroupEntity tempEntity = envGroupMapper.selectByValue(sourceEntity.getEnvGroupValue());
            if(tempEntity!=null&&!tempEntity.getEnvGroupId().equals(sourceEntity.getEnvGroupId())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getEnvGroupValue()+"]Value必须唯一!");
            }
            return sourceEntity;
        });
    }

    public static String ENV_GROUP_STATIC="ENV_GROUP_STATIC";
    public static String ENV_GROUP_DATETIME="ENV_GROUP_DATETIME";
    public static String ENV_GROUP_SYSTEM="ENV_GROUP_SYSTEM";
    public static String ENV_GROUP_NUMBER_CODE="ENV_GROUP_NUMBER_CODE";
    public static String ENV_GROUP_ID_CODE="ENV_GROUP_ID_CODE";
    public static String ENV_GROUP_DEV_MOCK="ENV_GROUP_DEV_MOCK";

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        EnvGroupEntity rootGroupEntity=create(jb4DCSession,rootId,rootParentId,"环境变量分组","环境变量分组");

        EnvGroupEntity generalGroupEntity=create(jb4DCSession,"ENV_GROUP_GENERAL",rootGroupEntity.getEnvGroupId(),"通用变量分组","通用变量分组");

        create(jb4DCSession,ENV_GROUP_STATIC,generalGroupEntity.getEnvGroupId(),"静态值",ENV_GROUP_STATIC);
        create(jb4DCSession,ENV_GROUP_DATETIME,generalGroupEntity.getEnvGroupId(),"时间日期",ENV_GROUP_DATETIME);
        create(jb4DCSession,ENV_GROUP_SYSTEM,generalGroupEntity.getEnvGroupId(),"系统变量",ENV_GROUP_SYSTEM);
        create(jb4DCSession,ENV_GROUP_NUMBER_CODE,generalGroupEntity.getEnvGroupId(),"序号编码",ENV_GROUP_NUMBER_CODE);
        create(jb4DCSession,ENV_GROUP_ID_CODE,generalGroupEntity.getEnvGroupId(),"主键生成",ENV_GROUP_ID_CODE);
        create(jb4DCSession,ENV_GROUP_DEV_MOCK,generalGroupEntity.getEnvGroupId(),"开发模拟系统",ENV_GROUP_DEV_MOCK);

        EnvGroupEntity businessGroupEntity=create(jb4DCSession,"ENV_GROUP_BUSINESS",rootGroupEntity.getEnvGroupId(),"业务系统分组","业务系统分组");

        EnvGroupEntity mockDevGroupEntity=create(jb4DCSession,"ENV_GROUP_BUSINESS_MOCK_DEV",businessGroupEntity.getEnvGroupId(),"开发模拟系统","开发模拟系统");
    }

    private EnvGroupEntity create(JB4DCSession jb4DCSession,String groupId,String parentId,String text,String value) throws JBuild4DCGenerallyException {
        EnvGroupEntity rootEntity=new EnvGroupEntity();
        rootEntity.setEnvGroupId(groupId);
        rootEntity.setEnvGroupParentId(parentId);
        rootEntity.setEnvGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setEnvGroupDelEnable(TrueFalseEnum.False.getDisplayName());
        rootEntity.setEnvGroupText(text);
        rootEntity.setEnvGroupValue(value);
        rootEntity.setEnvGroupStatus(EnableTypeEnum.enable.getDisplayName());
        this.saveSimple(jb4DCSession,rootEntity.getEnvGroupId(),rootEntity);
        return rootEntity;
    }
}