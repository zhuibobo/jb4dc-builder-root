package com.jb4dc.builder.client.htmldesign.control;

import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class VirtualBodyControl extends HTMLControl implements IHTMLControl {

    public static VirtualBodyControl getInstance(){
        return new VirtualBodyControl();
    }

    @Override
    public void resolveSelf(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) {

    }

    @Override
    public void dynamicBind(JB4DCSession jb4DCSession, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) {

    }
}
