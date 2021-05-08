package com.jb4dc.builder.client.service.envvar.creator;

import com.jb4dc.builder.client.service.envvar.IEnvVariableCreator;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.workflow.po.EnvVariableResultPO;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class UUIDVariableCreator implements IEnvVariableCreator {
    @Override
    public EnvVariableResultPO createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException {
        return new EnvVariableResultPO(UUIDUtility.getUUID());
    }

    public static String ENV_ID_CODE_UUID_VALUE="ENV_ID_CODE_UUID";
    public static String ENV_ID_CODE_UUID_TEXT="通用唯一识别码";
}
