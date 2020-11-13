package com.jb4dc.builder.client.proxy;

import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/3
 * To change this template use File | Settings | File Templates.
 */
public interface IEnvVariableRuntimeProxy {
    /*List<EnvVariablePO> getDateTimeVars() throws JBuild4DCGenerallyException;

    List<EnvVariablePO> getAPIVars() throws XPathExpressionException, ParserConfigurationException, IOException, SAXException, JBuild4DCGenerallyException;*/

    String execDefaultValueResult(JB4DCSession jb4DCSession, String fieldDefaultType, String fieldDefaultValue) throws JBuild4DCGenerallyException, IOException;

    EnvVariableEntity getEnvVariableEntityByValue(JB4DCSession jb4DCSession, String value) throws JBuild4DCGenerallyException, IOException;

    String execEnvVarResult(JB4DCSession jb4DCSession, String value) throws JBuild4DCGenerallyException, IOException;

}
