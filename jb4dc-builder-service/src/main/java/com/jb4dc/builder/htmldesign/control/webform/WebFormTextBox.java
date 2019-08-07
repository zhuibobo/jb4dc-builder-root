package com.jb4dc.builder.htmldesign.control.webform;


import com.jb4dc.builder.htmldesign.control.HTMLControl;
import com.jb4dc.builder.htmldesign.control.IHTMLControl;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextVo;
import com.jb4dc.builder.po.HtmlControlDefinitionVo;
import com.jb4dc.builder.po.ResolveHTMLControlContextVo;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;

public class WebFormTextBox extends HTMLControl implements IHTMLControl {

    //@Autowired
    //IDictionaryService dictionaryService;

    @Override
    public void resolveSelf(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {
        //System.out.println(sourceHTML);
        singleControlElem.tagName("input");
        singleControlElem.text("");
        singleControlElem.attr("type","text");
    }

    @Override
    public void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextVo dynamicBindHTMLControlContextVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo) {

    }
}
