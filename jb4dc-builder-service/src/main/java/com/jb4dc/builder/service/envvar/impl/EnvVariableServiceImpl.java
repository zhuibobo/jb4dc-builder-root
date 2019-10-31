package com.jb4dc.builder.service.envvar.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.IUpdateBefore;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.envvar.EnvVariableMapper;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.client.service.envvar.IEnvVariableService;
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
        create(jb4DCSession,"ENV_STATIC_YES",EnvGroupServiceImpl.ENV_GROUP_STATIC,"静态值-是","ENV_STATIC_YES","com.jb4dc.builder.client.service.envvar.creator.StaticVariableCreater","是","","");
        create(jb4DCSession,"ENV_STATIC_NO",EnvGroupServiceImpl.ENV_GROUP_STATIC,"静态值-否","ENV_STATIC_NO","com.jb4dc.builder.client.service.envvar.creator.StaticVariableCreater","否","","");
        create(jb4DCSession,"ENV_STATIC_ENABLE",EnvGroupServiceImpl.ENV_GROUP_STATIC,"静态值-启用","ENV_STATIC_ENABLE","com.jb4dc.builder.client.service.envvar.creator.StaticVariableCreater","启用","","");
        create(jb4DCSession,"ENV_STATIC_DISABLE",EnvGroupServiceImpl.ENV_GROUP_STATIC,"静态值-禁用","ENV_STATIC_DISABLE","com.jb4dc.builder.client.service.envvar.creator.StaticVariableCreater","禁用","","");
        create(jb4DCSession,"ENV_STATIC_DEL",EnvGroupServiceImpl.ENV_GROUP_STATIC,"静态值-删除","ENV_STATIC_DEL","com.jb4dc.builder.client.service.envvar.creator.StaticVariableCreater","删除","","");
        create(jb4DCSession,"ENV_STATIC_PROCESS",EnvGroupServiceImpl.ENV_GROUP_STATIC,"静态值-待处理","ENV_STATIC_PROCESS","com.jb4dc.builder.client.service.envvar.creator.StaticVariableCreater","待处理","","");
        create(jb4DCSession,"ENV_STATIC_PROCESSED",EnvGroupServiceImpl.ENV_GROUP_STATIC,"静态值-已处理","ENV_STATIC_PROCESSED","com.jb4dc.builder.client.service.envvar.creator.StaticVariableCreater","已处理","","");


        create(jb4DCSession,"ENV_DATETIME_YYYY_MM_DD",EnvGroupServiceImpl.ENV_GROUP_DATETIME,"年年年年-月月-日日","ENV_DATETIME_YYYY_MM_DD","com.jb4dc.builder.client.service.envvar.creator.DateTimeVariableCreator","yyyy-MM-dd","","");
        create(jb4DCSession,"ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",EnvGroupServiceImpl.ENV_GROUP_DATETIME,"年年年年-月月-日日 时:分:秒","ENV_DATETIME_YYYY_MM_DD_HH_MM_SS","com.jb4dc.builder.client.service.envvar.creator.DateTimeVariableCreator","yyyy-MM-dd HH:mm:ss","","");
        create(jb4DCSession,"ENV_DATETIME_YYYY_SMM_SDD",EnvGroupServiceImpl.ENV_GROUP_DATETIME,"年年年年/月月/日日","ENV_DATETIME_YYYY_SMM_SDD","com.jb4dc.builder.client.service.envvar.creator.DateTimeVariableCreator","yyyy/MM/dd","","");

        create(jb4DCSession,"ENV_SYSTEM_CURRENT_USER_ORGAN_ID",EnvGroupServiceImpl.ENV_GROUP_SYSTEM,"当前用户所在组织ID","ENV_SYSTEM_CURRENT_USER_ORGAN_ID","com.jb4dc.builder.client.service.envvar.creator.UserSessionVariableCreator","ApiVarCurrentUserOrganId","","");
        create(jb4DCSession,"ENV_SYSTEM_CURRENT_USER_ORGAN_NAME",EnvGroupServiceImpl.ENV_GROUP_SYSTEM,"当前用户所在组织名称","ENV_SYSTEM_CURRENT_USER_ORGAN_NAME","com.jb4dc.builder.client.service.envvar.creator.UserSessionVariableCreator","ApiVarCurrentUserOrganName","","");
        create(jb4DCSession,"ENV_SYSTEM_CURRENT_USER_ID",EnvGroupServiceImpl.ENV_GROUP_SYSTEM,"当前用户ID","ENV_SYSTEM_CURRENT_USER_ID","com.jb4dc.builder.client.service.envvar.creator.UserSessionVariableCreator","ApiVarCurrentUserId","","");
        create(jb4DCSession,"ENV_SYSTEM_CURRENT_USER_NAME",EnvGroupServiceImpl.ENV_GROUP_SYSTEM,"当前用户名称","ENV_SYSTEM_CURRENT_USER_NAME","com.jb4dc.builder.client.service.envvar.creator.UserSessionVariableCreator","ApiVarCurrentUserName","","");

        create(jb4DCSession,"ENV_ID_CODE_UUID",EnvGroupServiceImpl.ENV_GROUP_ID_CODE,"通用唯一识别码","ENV_ID_CODE_UUID","com.jb4dc.builder.client.service.envvar.creator.UUIDVariableCreater","","","");
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
    public String getValueByText(String name){
        EnvVariableEntity tempEntity = envVariableMapper.selectByText(name);
        if (tempEntity != null) {
            return tempEntity.getEnvVarValue();
        }
        return "";
    }

    @Override
    public EnvVariableEntity getEntityByValue(String value) {
        return envVariableMapper.selectByValue(value);
    }
}