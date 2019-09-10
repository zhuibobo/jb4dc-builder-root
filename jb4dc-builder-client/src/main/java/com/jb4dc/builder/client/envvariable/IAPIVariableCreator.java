package com.jb4dc.builder.client.envvariable;

import com.jb4dc.builder.po.EnvVariablePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public interface IAPIVariableCreator {
    Document doc=null;
    Node node=null;

    String createVar(JB4DCSession jb4DCSession, EnvVariablePO vo) throws JBuild4DCGenerallyException;
}
