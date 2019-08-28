package com.jb4dc.builder.client.service;

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
public interface IEnvVariableClientService {
    List<EnvVariablePO> getDateTimeVars() throws JBuild4DCGenerallyException;

    List<EnvVariablePO> getAPIVars() throws XPathExpressionException, ParserConfigurationException, IOException, SAXException, JBuild4DCGenerallyException;

    String execEnvVarResult(JB4DCSession jb4DCSession, String value) throws XPathExpressionException, JBuild4DCGenerallyException, IOException, SAXException, ParserConfigurationException;

    String getValueByName(String name) throws XPathExpressionException, ParserConfigurationException, IOException, SAXException, JBuild4DCGenerallyException;
}
