package com.jb4dc.builder.htmldesign.control.weblist;

import com.jb4dc.builder.htmldesign.control.HTMLControl;
import com.jb4dc.builder.htmldesign.control.IHTMLControl;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class WebListListButtonContainer  extends HTMLControl implements IHTMLControl {

    /*@Override
    public void rendererChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) throws JBuild4DGenerallyException {

        StringBuilder buttonsJson=new StringBuilder();
        buttonsJson.append("<script>");
        //获取其中的按钮,将html装换为json格式,提供给前端做二次解析.
        //获取所有的自定义控件
        Elements allElems=singleControlElem.getElementsByTag("div");
        for (Element singleInnerElem : allElems) {
            if(singleInnerElem.attr("jbuild4dc_custom").equals("true")){
                String singleName=singleInnerElem.attr(HTMLControlAttrs.SINGLENAME);
                HtmlControlDefinitionVo htmlControlDefinitionVo=ckEditorPluginsService.getVo(singleName);
                String serverResolveFullClassName = htmlControlDefinitionVo.getServerResolve();
                if(serverResolveFullClassName!=null&&!serverResolveFullClassName.equals("")){
                    try {
                        IHTMLControl htmlControl = this.getHTMLControlInstance(serverResolveFullClassName);

                        String buttonJson=htmlControl.parseToJson(jb4DCSession, sourceHTML, doc, singleInnerElem, singleControlElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo, htmlControlDefinitionVo);

                        buttonsJson.append(buttonJson);
                    }
                    catch (Exception ex){
                        singleInnerElem.html("控件解析出错！【"+ex.getMessage()+"】");
                    }
                }
            }
        }
        buttonsJson.append("</script>");
        //查找其中的wldct-list-button-inner-wrap,将其内容清空
        Elements elements=singleControlElem.getElementsByClass("wldct-list-button-inner-wrap");
        if(elements!=null&&elements.size()>0){
            elements.get(0).html(buttonsJson.toString());
        }

        return;
    }*/

    @Override
    public void resolveSelf(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) {

    }

    @Override
    public void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO, HtmlControlDefinitionPO htmlControlPluginDefinitionVo) {

    }
}