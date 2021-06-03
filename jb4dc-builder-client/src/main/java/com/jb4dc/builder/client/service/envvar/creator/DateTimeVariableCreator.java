package com.jb4dc.builder.client.service.envvar.creator;


import com.jb4dc.builder.client.service.envvar.IEnvVariableCreator;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.builder.po.EnvVariableResultPO;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class DateTimeVariableCreator implements IEnvVariableCreator {

    @Override
    public EnvVariableResultPO createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException {
        try {
            String result;
            Date date = new Date();
            SimpleDateFormat formatter = new SimpleDateFormat();
            formatter.applyPattern(envVariableEntity.getEnvVarClassPara());
            result = formatter.format(date);
            return new EnvVariableResultPO(result);
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,this.getClass().getName()+" Error:"+ex.getMessage());
        }
    }

    public static String ENV_DATETIME_YYYY_MM_DD_VALUE="ENV_DATETIME_YYYY_MM_DD";
    public static String ENV_DATETIME_YYYY_MM_DD_TEXT="年年年年-月月-日日";
    public static String ENV_DATETIME_YYYY_MM_DD_PARA="yyyy-MM-dd";

    public static String ENV_DATETIME_YYYY_MM_DD_HH_MM_SS_VALUE="ENV_DATETIME_YYYY_MM_DD_HH_MM_SS";
    public static String ENV_DATETIME_YYYY_MM_DD_HH_MM_SS_TEXT="年年年年-月月-日日 时:分:秒";
    public static String ENV_DATETIME_YYYY_MM_DD_HH_MM_SS_PARA="yyyy-MM-dd HH:mm:ss";

    public static String ENV_DATETIME_YYYY_SMM_SDD_VALUE="ENV_DATETIME_YYYY_SMM_SDD";
    public static String ENV_DATETIME_YYYY_SMM_SDD_TEXT="年年年年/月月/日日";
    public static String ENV_DATETIME_YYYY_SMM_SDD_PARA="yyyy/MM/dd";
}
