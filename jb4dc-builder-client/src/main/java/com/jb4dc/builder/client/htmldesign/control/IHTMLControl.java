package com.jb4dc.builder.client.htmldesign.control;

import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/15
 * To change this template use File | Settings | File Templates.
 */
public interface IHTMLControl {

    void resolveAtSave(JB4DCSession jb4DCSession,
                       String sourceHTML,
                       Document doc,
                       Element singleControlElem,
                       Element parentElem,
                       Element lastParentJbuild4dCustomElem,
                       ResolveHTMLControlContextPO resolveHTMLControlContextPO,
                       HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;

    void resolveAtRuntime(JB4DCSession jb4DCSession,
                          String sourceHTML,
                          Document doc,
                          Element singleControlElem,
                          Element parentElem,
                          Element lastParentJbuild4dCustomElem,
                          ResolveHTMLControlContextPO resolveHTMLControlContextPO,
                          HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;

    void resolveDefAttr(JB4DCSession jb4DCSession,
                        String sourceHTML,
                        Document doc,
                        Element singleControlElem,
                        Element parentElem,
                        Element lastParentJbuild4dCustomElem,
                        ResolveHTMLControlContextPO resolveHTMLControlContextPO,
                        HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException;

    void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException, IOException;

    void rendererChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO,boolean isAtSave) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;

    void dynamicBindChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;

    String parseToJson(JB4DCSession jb4DCSession,
                       String sourceHTML,
                       Document doc,
                       Element singleControlElem,
                       Element parentElem,
                       Element lastParentJbuild4dCustomElem,
                       ResolveHTMLControlContextPO resolveHTMLControlContextPO,
                       HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException;

    String getClientNewInstanceScript(Element singleControlElem, boolean needInitialize, String initializeParas);
}
