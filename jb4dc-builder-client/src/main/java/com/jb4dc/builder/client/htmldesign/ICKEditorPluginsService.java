package com.jb4dc.builder.client.htmldesign;

import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */
public interface ICKEditorPluginsService {
    List<HtmlControlDefinitionPO> getWebFormControlVoList() throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;

    List<HtmlControlDefinitionPO> getListControlVoList() throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;

    List<HtmlControlDefinitionPO> getAllControlVoList() throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;

    HtmlControlDefinitionPO getVo(String singleName) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;
}
