package com.jb4dc.builder.extend.apivariable.impl;


import com.jb4dc.builder.extend.apivariable.IAPIVariableCreator;
import com.jb4dc.builder.po.EnvVariablePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class UserSessionVariableCreator implements IAPIVariableCreator {
    @Override
    public String createVar(JB4DCSession jb4DCSession, EnvVariablePO vo) throws JBuild4DCGenerallyException {
        if(vo.getPara().equals("ApiVarCurrentUserOrganId")){
            return jb4DCSession.getOrganId();
        }
        else if(vo.getPara().equals("ApiVarCurrentUserOrganName")){
            return jb4DCSession.getOrganName();
        }
        else if(vo.getPara().equals("ApiVarCurrentUserId")){
            return jb4DCSession.getUserId();
        }
        else if(vo.getPara().equals("ApiVarCurrentUserName")){
            return jb4DCSession.getUserName();
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,this.getClass().getName()+"中无法根据"+vo.getPara()+"查询到对应的数据！");
    }
}
