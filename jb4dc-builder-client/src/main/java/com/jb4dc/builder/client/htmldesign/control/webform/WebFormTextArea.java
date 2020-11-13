package com.jb4dc.builder.client.htmldesign.control.webform;

import com.jb4dc.builder.client.htmldesign.control.HTMLControl;
import com.jb4dc.builder.client.htmldesign.control.IHTMLControl;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/24
 * To change this template use File | Settings | File Templates.
 */
public class WebFormTextArea extends HTMLControl implements IHTMLControl {

    @Override
    public void resolveSelf(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException {
        singleControlElem.tagName("textarea");
        singleControlElem.text("");
        //singleControlElem.attr("type","text");
    }

    @Override
    public void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException, IOException {
        defaultValueDynamicBind(jb4DCSession, sourceHTML, doc, singleControlElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);
    }
}
