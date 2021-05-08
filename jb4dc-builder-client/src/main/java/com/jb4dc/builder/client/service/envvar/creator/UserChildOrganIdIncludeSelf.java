package com.jb4dc.builder.client.service.envvar.creator;

import com.jb4dc.builder.client.service.envvar.IEnvVariableCreator;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.workflow.po.EnvVariableResultPO;
import org.springframework.beans.factory.annotation.Autowired;

public class UserChildOrganIdIncludeSelf implements IEnvVariableCreator {
    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    @Override
    public EnvVariableResultPO createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException {
        return new EnvVariableResultPO("");
    }
}
