package com.jb4dc.builder.htmldesign.control;

import com.jb4dc.builder.po.DynamicBindHTMLControlContextVo;
import com.jb4dc.builder.po.HtmlControlDefinitionVo;
import com.jb4dc.builder.po.ResolveHTMLControlContextVo;
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
                     ResolveHTMLControlContextVo resolveHTMLControlContextVo,
                     HtmlControlDefinitionVo htmlControlDefinitionVo);

    void resolveDefAttr(JB4DCSession jb4DCSession,
                        String sourceHTML,
                        Document doc,
                        Element singleControlElem,
                        Element parentElem,
                        Element lastParentJbuild4dCustomElem,
                        ResolveHTMLControlContextVo resolveHTMLControlContextVo,
                        HtmlControlDefinitionVo htmlControlDefinitionVo);

    void bindDefaultValue(JB4DCSession jb4DCSession,
                          String sourceHTML,
                          Document doc,
                          Element singleControlElem,
                          Element parentElem,
                          Element lastParentJbuild4dCustomElem,
                          ResolveHTMLControlContextVo resolveHTMLControlContextVo,
                          HtmlControlDefinitionVo htmlControlDefinitionVo);

    void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextVo dynamicBindHTMLControlContextVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo);

    void rendererChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) throws JBuild4DCGenerallyException;

    String parseToJson(JB4DCSession jb4DCSession,
                       String sourceHTML,
                       Document doc,
                       Element singleControlElem,
                       Element parentElem,
                       Element lastParentJbuild4dCustomElem,
                       ResolveHTMLControlContextVo resolveHTMLControlContextVo,
                       HtmlControlDefinitionVo htmlControlDefinitionVo);
}