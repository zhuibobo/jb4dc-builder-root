package com.jb4dc.builder.service.envvar.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.IUpdateBefore;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.client.service.envvar.creator.DateTimeVariableCreator;
import com.jb4dc.builder.client.service.envvar.creator.StaticVariableCreator;
import com.jb4dc.builder.client.service.envvar.creator.UUIDVariableCreator;
import com.jb4dc.builder.client.service.envvar.creator.UserSessionVariableCreator;
import com.jb4dc.builder.dao.envvar.EnvVariableMapper;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.client.service.envvar.IEnvVariableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

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
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getEnvVarValue()+"]Value必须唯一!");
                }
                tempEntity = envVariableMapper.selectByText(sourceEntity.getEnvVarText());
                if (tempEntity != null) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getEnvVarText()+"]Text必须唯一!");
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
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getEnvVarValue()+"]Value必须唯一!");
                }
                tempEntity = envVariableMapper.selectByText(sourceEntity.getEnvVarText());
                if(tempEntity!=null&&!tempEntity.getEnvVarId().equals(sourceEntity.getEnvVarId())){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getEnvVarText()+"]Text必须唯一!");
                }
                return sourceEntity;
            }
        });
    }

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        create(jb4DCSession,StaticVariableCreator.ENV_STATIC_YES_VALUE,EnvGroupServiceImpl.ENV_GROUP_STATIC, StaticVariableCreator.ENV_STATIC_YES_TEXT,StaticVariableCreator.ENV_STATIC_YES_VALUE,StaticVariableCreator.class.getCanonicalName(),StaticVariableCreator.ENV_STATIC_YES_PARA,"","");
        create(jb4DCSession,StaticVariableCreator.ENV_STATIC_NO_VALUE,EnvGroupServiceImpl.ENV_GROUP_STATIC,StaticVariableCreator.ENV_STATIC_NO_TEXT,StaticVariableCreator.ENV_STATIC_NO_VALUE,StaticVariableCreator.class.getCanonicalName(),StaticVariableCreator.ENV_STATIC_NO_PARA,"","");
        create(jb4DCSession,StaticVariableCreator.ENV_STATIC_ENABLE_VALUE,EnvGroupServiceImpl.ENV_GROUP_STATIC,StaticVariableCreator.ENV_STATIC_ENABLE_TEXT,StaticVariableCreator.ENV_STATIC_ENABLE_VALUE,StaticVariableCreator.class.getCanonicalName(),StaticVariableCreator.ENV_STATIC_ENABLE_PARA,"","");
        create(jb4DCSession,StaticVariableCreator.ENV_STATIC_DISABLE_VALUE,EnvGroupServiceImpl.ENV_GROUP_STATIC,StaticVariableCreator.ENV_STATIC_DISABLE_TEXT,StaticVariableCreator.ENV_STATIC_DISABLE_VALUE,StaticVariableCreator.class.getCanonicalName(),StaticVariableCreator.ENV_STATIC_DISABLE_PARA,"","");
        create(jb4DCSession,StaticVariableCreator.ENV_STATIC_DEL_VALUE,EnvGroupServiceImpl.ENV_GROUP_STATIC,StaticVariableCreator.ENV_STATIC_DEL_TEXT,StaticVariableCreator.ENV_STATIC_DEL_VALUE,StaticVariableCreator.class.getCanonicalName(),StaticVariableCreator.ENV_STATIC_DEL_PARA,"","");
        create(jb4DCSession,StaticVariableCreator.ENV_STATIC_PROCESS_VALUE,EnvGroupServiceImpl.ENV_GROUP_STATIC,StaticVariableCreator.ENV_STATIC_PROCESS_TEXT,StaticVariableCreator.ENV_STATIC_PROCESS_VALUE,StaticVariableCreator.class.getCanonicalName(),StaticVariableCreator.ENV_STATIC_PROCESS_PARA,"","");
        create(jb4DCSession,StaticVariableCreator.ENV_STATIC_PROCESSED_VALUE,EnvGroupServiceImpl.ENV_GROUP_STATIC,StaticVariableCreator.ENV_STATIC_PROCESSED_TEXT,StaticVariableCreator.ENV_STATIC_PROCESSED_VALUE,StaticVariableCreator.class.getCanonicalName(),StaticVariableCreator.ENV_STATIC_PROCESSED_PARA,"","");


        create(jb4DCSession, DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_VALUE,EnvGroupServiceImpl.ENV_GROUP_DATETIME,DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_TEXT,DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_VALUE,DateTimeVariableCreator.class.getCanonicalName(),DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_PARA,"","");
        create(jb4DCSession,DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_HH_MM_SS_VALUE,EnvGroupServiceImpl.ENV_GROUP_DATETIME,DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_HH_MM_SS_TEXT,DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_HH_MM_SS_VALUE,DateTimeVariableCreator.class.getCanonicalName(),DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_HH_MM_SS_PARA,"","");
        create(jb4DCSession,DateTimeVariableCreator.ENV_DATETIME_YYYY_SMM_SDD_VALUE,EnvGroupServiceImpl.ENV_GROUP_DATETIME,DateTimeVariableCreator.ENV_DATETIME_YYYY_SMM_SDD_TEXT,DateTimeVariableCreator.ENV_DATETIME_YYYY_SMM_SDD_VALUE,DateTimeVariableCreator.class.getCanonicalName(),DateTimeVariableCreator.ENV_DATETIME_YYYY_SMM_SDD_PARA,"","");

        create(jb4DCSession, UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_ID_VALUE,EnvGroupServiceImpl.ENV_GROUP_SYSTEM,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_ID_TEXT,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_ID_VALUE,UserSessionVariableCreator.class.getCanonicalName(),UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_ID_PARA,"","");
        create(jb4DCSession,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_NAME_VALUE,EnvGroupServiceImpl.ENV_GROUP_SYSTEM,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_NAME_TEXT,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_NAME_VALUE,UserSessionVariableCreator.class.getCanonicalName(),UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_NAME_PARA,"","");
        create(jb4DCSession,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ID_VALUE,EnvGroupServiceImpl.ENV_GROUP_SYSTEM,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ID_TEXT,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ID_VALUE,UserSessionVariableCreator.class.getCanonicalName(),UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ID_PARA,"","");
        create(jb4DCSession,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_NAME_VALUE,EnvGroupServiceImpl.ENV_GROUP_SYSTEM,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_NAME_TEXT,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_NAME_VALUE,UserSessionVariableCreator.class.getCanonicalName(),UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_NAME_PARA,"","");

        create(jb4DCSession, UUIDVariableCreator.ENV_ID_CODE_UUID_VALUE,EnvGroupServiceImpl.ENV_GROUP_ID_CODE,UUIDVariableCreator.ENV_ID_CODE_UUID_TEXT,UUIDVariableCreator.ENV_ID_CODE_UUID_VALUE,UUIDVariableCreator.class.getCanonicalName(),"","","");
    }

    private EnvVariableEntity create(JB4DCSession jb4DCSession,String envVarId,String groupId,String text,String value,String className,String classPara,String rest,String restPara) throws JBuild4DCGenerallyException {
        EnvVariableEntity envVariableEntity=new EnvVariableEntity();
        envVariableEntity.setEnvVarId(envVarId);
        envVariableEntity.setEnvVarValue(value);
        envVariableEntity.setEnvVarText(text);
        envVariableEntity.setEnvVarClassName(className);
        envVariableEntity.setEnvVarClassPara(classPara);
        envVariableEntity.setEnvVarRest(rest);
        envVariableEntity.setEnvVarRestPara(restPara);
        envVariableEntity.setEnvVarGroupId(groupId);
        envVariableEntity.setEnvVarIsSystem(TrueFalseEnum.True.getDisplayName());
        envVariableEntity.setEnvVarDelEnable(TrueFalseEnum.False.getDisplayName());
        envVariableEntity.setEnvVarStatus(EnableTypeEnum.enable.getDisplayName());
        envVariableEntity.setEnvVarDesc("");
        envVariableEntity.setEnvVarExAttr1("");
        envVariableEntity.setEnvVarExAttr2("");
        envVariableEntity.setEnvVarExAttr3("");
        envVariableEntity.setEnvVarExAttr4("");

        this.saveSimple(jb4DCSession,envVariableEntity.getEnvVarId(),envVariableEntity);
        return envVariableEntity;
    }

    @Override
    public String getValueByText(JB4DCSession jb4DCSession,String name){
        EnvVariableEntity tempEntity = envVariableMapper.selectByText(name);
        if (tempEntity != null) {
            return tempEntity.getEnvVarValue();
        }
        return "";
    }

    @Override
    public EnvVariableEntity getEntityByValue(JB4DCSession jb4DCSession,String value) {
        return envVariableMapper.selectByValue(value);
    }

    @Override
    public List<EnvVariableEntity> getEntitiesByGroupId(JB4DCSession session, String groupId) {
        return envVariableMapper.selectByGroupId(groupId);
    }
}