package com.jb4dc.builder.client.htmldesign.control.webform;

import com.jb4dc.base.dbaccess.dynamic.impl.SQLBuilderMapper;
import com.jb4dc.builder.client.htmldesign.control.HTMLControl;
import com.jb4dc.builder.client.htmldesign.control.IHTMLControl;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/23
 * To change this template use File | Settings | File Templates.
 */
public class WebFormDropDownSelect extends HTMLControl implements IHTMLControl {
    @Autowired
    SQLBuilderMapper sqlBuilderMapper;

    @Override
    public void resolveSelf(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException {
        singleControlElem.tagName("select");
    }

    @Override
    public void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException {
        defaultDynamicBind(jb4DCSession, sourceHTML, doc, singleControlElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);

        String sql= null;
        List<Map<String,Object>> datasource;
        try {
            sql = URLDecoder.decode(singleControlElem.attr("sqldatasource"),"utf-8");
            datasource = sqlBuilderMapper.selectList(sql);
        } catch (UnsupportedEncodingException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"decode sqldatasource error"+e.getMessage());
        }

        System.out.println(datasource);
    }
}
