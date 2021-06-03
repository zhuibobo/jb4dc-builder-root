package com.jb4dc.builder.client.service.envvar;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.builder.po.EnvVariableResultPO;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/3
 * To change this template use File | Settings | File Templates.
 */
public interface IEnvVariableRuntimeClient {
    /*List<EnvVariablePO> getDateTimeVars() throws JBuild4DCGenerallyException;

    List<EnvVariablePO> getAPIVars() throws XPathExpressionException, ParserConfigurationException, IOException, SAXException, JBuild4DCGenerallyException;*/

    EnvVariableResultPO execDefaultValueResult(JB4DCSession jb4DCSession, String fieldDefaultType, String fieldDefaultValue) throws JBuild4DCGenerallyException, IOException;

    //EnvVariableEntity getEnvVariableEntityByValue(JB4DCSession jb4DCSession, String value) throws JBuild4DCGenerallyException, IOException;

    EnvVariableResultPO execEnvVarResult(JB4DCSession jb4DCSession, String value) throws JBuild4DCGenerallyException, IOException;

}
