package com.jb4dc.builder.client.htmldesign.control.webform;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.tools.HttpClientUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.tools.URLUtility;
import com.jb4dc.builder.client.htmldesign.control.HTMLControl;
import com.jb4dc.builder.client.htmldesign.control.IHTMLControl;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/25
 * To change this template use File | Settings | File Templates.
 */
public class WebFormRadioGroup extends HTMLControl implements IHTMLControl {
    @Override
    public void resolveAtRuntime(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException {
        String script=getClientNewInstanceScript(singleControlElem,false,"");
        singleControlElem.append(script);
    }

    @Override
    public void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException, IOException {
        defaultValueDynamicBind(jb4DCSession, sourceHTML, doc, singleControlElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);

        List<Map<String,Object>> datasource=getDataSource(jb4DCSession, sourceHTML, doc, singleControlElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);

        String option= null;
        try {
            option = URLUtility.encode(JsonUtility.toObjectString(datasource));
        } catch (JsonProcessingException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,e.getMessage());
        }
        singleControlElem.attr("datasource",option);

        if(StringUtility.isNotEmpty(singleControlElem.attr("level2bindcontrolid"))){
            List<Map<String,Object>> datasourceAllLevel=getAllLevelDataSource(jb4DCSession, sourceHTML, doc, singleControlElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);

            String optionAllLevel= null;
            try {
                optionAllLevel = URLUtility.encode(JsonUtility.toObjectString(datasourceAllLevel));
            } catch (JsonProcessingException e) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,e.getMessage());
            }
            singleControlElem.attr("datasourceAllLevel",optionAllLevel);
        }
    }
}
