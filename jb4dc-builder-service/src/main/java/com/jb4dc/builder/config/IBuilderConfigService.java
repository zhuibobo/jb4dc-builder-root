package com.jb4dc.builder.config;

import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.net.URISyntaxException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/31
 * To change this template use File | Settings | File Templates.
 */
public interface IBuilderConfigService {

    String getTablePrefix() throws XPathExpressionException;

    boolean getResolveSQLEnable() throws IOException, SAXException, ParserConfigurationException, XPathExpressionException, URISyntaxException;

}
