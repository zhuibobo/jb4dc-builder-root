package com.jb4dc.builder.client.htmldesign.control;

import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/15
 * To change this template use File | Settings | File Templates.
 */
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

    String getDefaultValue(JB4DCSession jb4DCSession,
                          String sourceHTML,
                          Document doc,
                          Element singleControlElem,
                          Element parentElem,
                          Element lastParentJbuild4dCustomElem,
                           DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO,
                          HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException;

    void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException;

    void rendererChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO) throws JBuild4DCGenerallyException;

    void dynamicBindChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException;

    String parseToJson(JB4DCSession jb4DCSession,
                       String sourceHTML,
                       Document doc,
                       Element singleControlElem,
                       Element parentElem,
                       Element lastParentJbuild4dCustomElem,
                       ResolveHTMLControlContextPO resolveHTMLControlContextPO,
                       HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException;

}
