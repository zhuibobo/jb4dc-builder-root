package com.jb4dc.builder.client.service.envvar.proxy;

import com.jb4dc.builder.po.EnvVariablePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/3
 * To change this template use File | Settings | File Templates.
 */
public interface IEnvVariableRuntimeResolveProxy {
    /*List<EnvVariablePO> getDateTimeVars() throws JBuild4DCGenerallyException;

    List<EnvVariablePO> getAPIVars() throws XPathExpressionException, ParserConfigurationException, IOException, SAXException, JBuild4DCGenerallyException;*/

    String execDefaultValueResult(JB4DCSession jb4DCSession, String fieldDefaultType, String fieldDefaultValue) throws JBuild4DCGenerallyException;

    String execEnvVarResult(JB4DCSession jb4DCSession, String value) throws JBuild4DCGenerallyException;

}
