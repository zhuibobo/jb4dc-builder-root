package com.jb4dc.builder.client.service.envvar.creator;

import com.jb4dc.builder.client.service.envvar.IEnvVariableCreator;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.EnvVariableResultPO;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/10
 * To change this template use File | Settings | File Templates.
 */
public class StaticVariableCreator implements IEnvVariableCreator {
    @Override
    public EnvVariableResultPO createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException {
        return new EnvVariableResultPO(envVariableEntity.getEnvVarClassPara());
    }

    public static String ENV_STATIC_YES_VALUE="ENV_STATIC_YES";
    public static String ENV_STATIC_YES_TEXT="静态值-是";
    public static String ENV_STATIC_YES_PARA="是";

    public static String ENV_STATIC_NO_VALUE="ENV_STATIC_NO";
    public static String ENV_STATIC_NO_TEXT="静态值-否";
    public static String ENV_STATIC_NO_PARA="否";

    public static String ENV_STATIC_ENABLE_VALUE="ENV_STATIC_ENABLE";
    public static String ENV_STATIC_ENABLE_TEXT="静态值-启用";
    public static String ENV_STATIC_ENABLE_PARA="启用";

    public static String ENV_STATIC_DISABLE_VALUE="ENV_STATIC_DISABLE";
    public static String ENV_STATIC_DISABLE_TEXT="静态值-禁用";
    public static String ENV_STATIC_DISABLE_PARA="禁用";

    public static String ENV_STATIC_DEL_VALUE="ENV_STATIC_DEL";
    public static String ENV_STATIC_DEL_TEXT="静态值-删除";
    public static String ENV_STATIC_DEL_PARA="删除";

    public static String ENV_STATIC_PROCESS_VALUE="ENV_STATIC_PROCESS";
    public static String ENV_STATIC_PROCESS_TEXT="静态值-待处理";
    public static String ENV_STATIC_PROCESS_PARA="待处理";

    public static String ENV_STATIC_PROCESSED_VALUE="ENV_STATIC_PROCESSED";
    public static String ENV_STATIC_PROCESSED_TEXT="静态值-已处理";
    public static String ENV_STATIC_PROCESSED_PARA="已处理";
}
