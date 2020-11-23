package com.jb4dc.builder.client.htmldesign.control.weblist;

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
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/10/21
 * To change this template use File | Settings | File Templates.
 */
public class WebListSearchDropDownSelect extends HTMLControl implements IHTMLControl {
    @Override
    public void resolveAtRuntime(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException {
        singleControlElem.tagName("select");
    }

    @Override
    public void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException, IOException {
        defaultValueDynamicBind(jb4DCSession, sourceHTML, doc, singleControlElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);

        List<Map<String,Object>> datasource=getDataSource(jb4DCSession, sourceHTML, doc, singleControlElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);

        String option="";
        for (Map<String, Object> stringObjectMap : datasource) {
            String value=stringObjectMap.get("IVALUE").toString();
            String text=stringObjectMap.get("ITEXT").toString();
            option+="<option value="+value+">"+text+"</option>";
        }

        singleControlElem.html(option);
    }
}
