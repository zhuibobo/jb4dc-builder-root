package com.jb4dc.builder.client.service.envvar.creator;


import com.jb4dc.builder.client.service.envvar.IEnvVariableCreator;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.EnvVariableResultPO;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class UserSessionVariableCreator implements IEnvVariableCreator {
    @Override
    public EnvVariableResultPO createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException {
        if(envVariableEntity.getEnvVarClassPara().equals("ApiVarCurrentUserOrganId")){
            return new EnvVariableResultPO(jb4DCSession.getOrganId());
        }
        else if(envVariableEntity.getEnvVarClassPara().equals("ApiVarCurrentUserOrganName")){
            return new EnvVariableResultPO( jb4DCSession.getOrganName());
        }
        else if(envVariableEntity.getEnvVarClassPara().equals("ApiVarCurrentUserId")){
            return new EnvVariableResultPO( jb4DCSession.getUserId());
        }
        else if(envVariableEntity.getEnvVarClassPara().equals("ApiVarCurrentUserName")){
            return new EnvVariableResultPO( jb4DCSession.getUserName());
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,this.getClass().getName()+"中无法根据"+envVariableEntity.getEnvVarClassPara()+"查询到对应的数据！");
    }

    public static String ENV_SYSTEM_CURRENT_USER_ORGAN_ID_VALUE="ENV_SYSTEM_CURRENT_USER_ORGAN_ID";
    public static String ENV_SYSTEM_CURRENT_USER_ORGAN_ID_TEXT="当前用户所在组织ID";
    public static String ENV_SYSTEM_CURRENT_USER_ORGAN_ID_PARA="ApiVarCurrentUserOrganId";

    public static String ENV_SYSTEM_CURRENT_USER_ORGAN_NAME_VALUE="ENV_SYSTEM_CURRENT_USER_ORGAN_NAME";
    public static String ENV_SYSTEM_CURRENT_USER_ORGAN_NAME_TEXT="当前用户所在组织名称";
    public static String ENV_SYSTEM_CURRENT_USER_ORGAN_NAME_PARA="ApiVarCurrentUserOrganName";

    public static String ENV_SYSTEM_CURRENT_USER_ID_VALUE="ENV_SYSTEM_CURRENT_USER_ID";
    public static String ENV_SYSTEM_CURRENT_USER_ID_TEXT="当前用户ID";
    public static String ENV_SYSTEM_CURRENT_USER_ID_PARA="ApiVarCurrentUserId";

    public static String ENV_SYSTEM_CURRENT_USER_NAME_VALUE="ENV_SYSTEM_CURRENT_USER_NAME";
    public static String ENV_SYSTEM_CURRENT_USER_NAME_TEXT="当前用户名称";
    public static String ENV_SYSTEM_CURRENT_USER_NAME_PARA="ApiVarCurrentUserName";
}
