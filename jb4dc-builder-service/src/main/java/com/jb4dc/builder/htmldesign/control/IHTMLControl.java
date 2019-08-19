package com.jb4dc.builder.htmldesign.control;

import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public interface IHTMLControl {

    void resolveSelf(JB4DCSession jb4DCSession,
                     String sourceHTML,
                     Document doc,
                     Element singleControlElem,
                     Element parentElem,
                     Element lastParentJbuild4dCustomElem,
                     ResolveHTMLControlContextPO resolveHTMLControlContextPO,
                     HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException;

    void resolveDefAttr(JB4DCSession jb4DCSession,
                        String sourceHTML,
                        Document doc,
                        Element singleControlElem,
                        Element parentElem,
                        Element lastParentJbuild4dCustomElem,
                        ResolveHTMLControlContextPO resolveHTMLControlContextPO,
                        HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException;

    void bindDefaultValue(JB4DCSession jb4DCSession,
                          String sourceHTML,
                          Document doc,
                          Element singleControlElem,
                          Element parentElem,
                          Element lastParentJbuild4dCustomElem,
                          ResolveHTMLControlContextPO resolveHTMLControlContextPO,
                          HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException;

    void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO, HtmlControlDefinitionPO htmlControlPluginDefinitionVo) throws JBuild4DCGenerallyException;

    void rendererChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO) throws JBuild4DCGenerallyException;

    String parseToJson(JB4DCSession jb4DCSession,
                       String sourceHTML,
                       Document doc,
                       Element singleControlElem,
                       Element parentElem,
                       Element lastParentJbuild4dCustomElem,
                       ResolveHTMLControlContextPO resolveHTMLControlContextPO,
                       HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException;
}
