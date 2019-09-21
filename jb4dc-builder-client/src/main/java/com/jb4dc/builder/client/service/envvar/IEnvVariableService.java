package com.jb4dc.builder.client.service.envvar;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/29
 * To change this template use File | Settings | File Templates.
 */
public interface IEnvVariableService extends IBaseService<EnvVariableEntity> {
    void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;

    String getValueByText(String name);

    EnvVariableEntity getEntityByValue(String value);
}
