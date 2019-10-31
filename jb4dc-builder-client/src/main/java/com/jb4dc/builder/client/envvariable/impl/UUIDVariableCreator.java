package com.jb4dc.builder.client.envvariable.impl;

import com.jb4dc.builder.client.envvariable.IEnvvariableVariableCreator;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class UUIDVariableCreator implements IEnvvariableVariableCreator {
    @Override
    public String createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException {
        return UUIDUtility.getUUID();
    }
}
