package com.jb4dc.builder.client.envvariable.impl;


import com.jb4dc.builder.client.envvariable.IAPIVariableCreator;
import com.jb4dc.builder.po.EnvVariablePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class DateTimeVariableCreator implements IAPIVariableCreator {

    @Override
    public String createVar(JB4DCSession jb4DCSession, EnvVariablePO vo) throws JBuild4DCGenerallyException {
        try {
            String result;
            Date date = new Date();
            SimpleDateFormat formatter = new SimpleDateFormat();
            formatter.applyPattern(vo.getEnvVarClassPara());
            result = formatter.format(date);
            return result;
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,this.getClass().getName()+" Error:"+ex.getMessage());
        }
    }
}