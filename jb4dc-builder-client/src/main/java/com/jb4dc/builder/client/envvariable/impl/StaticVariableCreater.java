package com.jb4dc.builder.client.envvariable.impl;

import com.jb4dc.builder.client.envvariable.IEnvvariableVariableCreator;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/10
 * To change this template use File | Settings | File Templates.
 */
public class StaticVariableCreater implements IEnvvariableVariableCreator {
    @Override
    public String createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException {
        return envVariableEntity.getEnvVarClassPara();
    }
}
