package com.jb4dc.builder.client.htmldesign.control.webform;


import com.jb4dc.builder.client.htmldesign.control.HTMLControl;
import com.jb4dc.builder.client.htmldesign.control.IHTMLControl;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class WebFormTextBox extends HTMLControl implements IHTMLControl {

    //@Autowired
    //IDictionaryService dictionaryService;

    @Override
    public void resolveSelf(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) {
        //System.out.println(sourceHTML);
        singleControlElem.tagName("input");
        singleControlElem.text("");
        singleControlElem.attr("type","text");
    }

}
