package com.jb4dc.builder.extend.apivariable.impl;


import com.jb4dc.builder.extend.apivariable.IAPIVariableCreator;
import com.jb4dc.builder.po.EnvVariableVo;
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
    public String createVar(JB4DCSession jb4DSession, EnvVariableVo vo) throws JBuild4DCGenerallyException {
        try {
            String result;
            Date date = new Date();
            SimpleDateFormat formater = new SimpleDateFormat();
            formater.applyPattern(vo.getPara());
            result = formater.format(date);
            return result;
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"com.jb4dc.builder.apivariable.impl.DateTimeVariableCreater Error:"+ex.getMessage());
        }
    }
}
