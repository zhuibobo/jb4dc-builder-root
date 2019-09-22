package com.jb4dc.builder.client.htmldesign.impl;

import com.jb4dc.builder.client.htmldesign.HTMLControlAttrs;
import com.jb4dc.builder.client.htmldesign.ICKEditorPluginsService;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.client.htmldesign.control.VirtualBodyControl;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Service;

@Service
public class HTMLRuntimeResolveImpl implements IHTMLRuntimeResolve {

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    private ICKEditorPluginsService ckEditorPluginsService;

    @Override
    public String resolveSourceHTML(JB4DCSession jb4DCSession, String id, String htmlSource) throws JBuild4DCGenerallyException {
        String sourceHTML=htmlSource;
        if(sourceHTML!=null&&!sourceHTML.equals("")){
            //获取并解析HTML
            Document doc= Jsoup.parseBodyFragment(sourceHTML);

            ResolveHTMLControlContextPO resolveHTMLControlContextPO =new ResolveHTMLControlContextPO();
            resolveHTMLControlContextPO.setRecordId(id);

            //将标识为runtime_auto_remove的标签移除掉
            Elements removeElems = doc.getElementsByAttribute(HTMLControlAttrs.RUNTIME_AUTO_REMOVE);
            if(removeElems!=null&&removeElems.size()>0){
                for (Element elem : removeElems) {
                    elem.remove();
                }
            }

            VirtualBodyControl bodyControl= VirtualBodyControl.getInstance();
            autowireCapableBeanFactory.autowireBean(bodyControl);
            bodyControl.rendererChain(jb4DCSession,htmlSource,doc,doc,doc,null, resolveHTMLControlContextPO);
            //this.loopResolveElem(jb4DCSession,doc,doc,sourceHTML,null,resolveHTMLControlContextVo);

            return doc.getElementsByTag("body").html();
        }
        return "解析HTML内容异常!";
    }

    //Element lastParentJbuild4dCustomElem=null;
    //public void loopResolveElem(JB4DCSession jb4DCSession, Document doc, Element parentElem, String sourceHTML, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, boolean resolveSelf) throws JBuild4DGenerallyException {
        /*for (Element singleElem : parentElem.children()) {

            if(singleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM).equals("true")){
                //String serverResolveFullClassName = singleElem.attr(HTMLControlAttrs.SERVERRESOLVE);
                String singleName=singleElem.attr(HTMLControlAttrs.SINGLENAME);
                HtmlControlDefinitionVo htmlControlDefinitionVo=ckEditorPluginsService.getVo(singleName);
                String serverResolveFullClassName = htmlControlDefinitionVo.getServerResolve();

                lastParentJbuild4dCustomElem=singleElem;

                if(serverResolveFullClassName!=null&&!serverResolveFullClassName.equals("")){
                    try {
                        IHTMLControl htmlControl = this.getHTMLControlInstance(serverResolveFullClassName);
                        if(resolveSelf){
                            htmlControl.resolveSelf();
                        }
                        else {
                            htmlControl.renderer(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo, htmlControlDefinitionVo);
                        }
                    }
                    catch (Exception ex){
                        singleElem.html("控件解析出错！【"+ex.getMessage()+"】");
                    }
                }
            }
            else{
                //如果是普通html元素则直接递归处理,如果是自定义控件,则由控件显示调用
                if(singleElem.childNodeSize()>0){
                    loopResolveElem(jb4DCSession,doc,singleElem,sourceHTML,lastParentJbuild4dCustomElem,resolveHTMLControlContextVo);
                }
            }
        }*/
    //}

    //控件是否动态绑定,交由控件解析时,控件本身解析自行设定,动态绑定完成字后,需要控件自身移除敏感属性.
    @Override
    public String dynamicBind(JB4DCSession jb4DCSession, String id, String resolveHtml,DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException {
        String sourceHTML=resolveHtml;
        if(sourceHTML!=null&&!sourceHTML.equals("")){
            //获取并解析HTML
            Document doc= Jsoup.parseBodyFragment(sourceHTML);

            //DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO =new DynamicBindHTMLControlContextPO();
            //dynamicBindHTMLControlContextPO.setRecordId(id);

            VirtualBodyControl bodyControl= VirtualBodyControl.getInstance();
            autowireCapableBeanFactory.autowireBean(bodyControl);
            bodyControl.dynamicBindChain(jb4DCSession,resolveHtml,doc,doc,doc,null, dynamicBindHTMLControlContextPO);
            //this.loopResolveElem(jb4DCSession,doc,doc,sourceHTML,null,resolveHTMLControlContextVo);

            return doc.getElementsByTag("body").html();
        }
        return "动态绑定数据异常!";
    }
}
