package com.jb4dc.builder.htmldesign.control.weblist;

import com.jb4dc.builder.htmldesign.control.HTMLControl;
import com.jb4dc.builder.htmldesign.control.IHTMLControl;
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
public class WebListListHideContainer  extends HTMLControl implements IHTMLControl {
    @Override
    public void resolveSelf(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException {
        singleControlElem.addClass("wraper-hide");
    }

    @Override
    public void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO, HtmlControlDefinitionPO htmlControlPluginDefinitionVo) throws JBuild4DCGenerallyException {

    }
}
