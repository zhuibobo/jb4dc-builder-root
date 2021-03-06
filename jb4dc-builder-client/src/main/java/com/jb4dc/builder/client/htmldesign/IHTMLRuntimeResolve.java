package com.jb4dc.builder.client.htmldesign;


import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

public interface IHTMLRuntimeResolve {
    String resolveSourceHTMLAtRuntime(JB4DCSession jb4DCSession, String id, String htmlSource) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;

    //Element lastParentJbuild4dCustomElem=null;
    //void loopResolveElem(JB4DCSession jb4DCSession, Document doc, Element parentElem, String sourceHTML, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) throws JBuild4DGenerallyException;

    String dynamicBind(JB4DCSession jb4DCSession, String id, String resolveHtml, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;

    String resolveSourceHTMLAtSave(JB4DCSession jb4DCSession, String id, String formHtmlSource) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException;
}
