package com.jb4dc.builder.client.service.envvar;

import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.EnvVariableResultPO;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public interface IEnvVariableCreator {
    Document doc=null;
    Node node=null;

    EnvVariableResultPO createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException;
}
