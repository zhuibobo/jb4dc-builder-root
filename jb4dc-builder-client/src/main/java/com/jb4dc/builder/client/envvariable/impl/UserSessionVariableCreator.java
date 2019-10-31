package com.jb4dc.builder.client.envvariable.impl;


import com.jb4dc.builder.client.envvariable.IEnvVariableCreator;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class UserSessionVariableCreator implements IEnvVariableCreator {
    @Override
    public String createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException {
        if(envVariableEntity.getEnvVarClassPara().equals("ApiVarCurrentUserOrganId")){
            return jb4DCSession.getOrganId();
        }
        else if(envVariableEntity.getEnvVarClassPara().equals("ApiVarCurrentUserOrganName")){
            return jb4DCSession.getOrganName();
        }
        else if(envVariableEntity.getEnvVarClassPara().equals("ApiVarCurrentUserId")){
            return jb4DCSession.getUserId();
        }
        else if(envVariableEntity.getEnvVarClassPara().equals("ApiVarCurrentUserName")){
            return jb4DCSession.getUserName();
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,this.getClass().getName()+"中无法根据"+envVariableEntity.getEnvVarClassPara()+"查询到对应的数据！");
    }
}
