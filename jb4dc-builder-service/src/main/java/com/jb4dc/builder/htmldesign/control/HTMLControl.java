package com.jb4dc.builder.htmldesign.control;

import com.jb4dc.builder.htmldesign.HTMLControlAttrs;
import com.jb4dc.builder.htmldesign.ICKEditorPluginsService;
import com.jb4dc.builder.po.HtmlControlDefinitionVo;
import com.jb4dc.builder.po.ResolveHTMLControlContextVo;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.ClassUtility;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import java.util.HashMap;
import java.util.Map;

public abstract class HTMLControl implements IHTMLControl {

    private static Map<String,IHTMLControl> controlInstanceMap=new HashMap<String,IHTMLControl>();

    @Autowired
    protected ICKEditorPluginsService ckEditorPluginsService;

    @Autowired
    protected AutowireCapableBeanFactory autowireCapableBeanFactory;

    public IHTMLControl getHTMLControlInstance(String fullClassName) throws IllegalAccessException, InstantiationException,ClassNotFoundException {

        if(controlInstanceMap.containsKey(fullClassName)){
            return controlInstanceMap.get(fullClassName);
        }
        else{
            IHTMLControl ctInstance=(IHTMLControl) ClassUtility.loadClass(fullClassName).newInstance();
            autowireCapableBeanFactory.autowireBean(ctInstance);
            controlInstanceMap.put(fullClassName,ctInstance);
        }
        return controlInstanceMap.get(fullClassName);
    }

    @Override
    public void rendererChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) throws JBuild4DCGenerallyException {
        for (Element singleElem : singleControlElem.children()) {

            if(singleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM).equals("true")){
                //String serverResolveFullClassName = singleElem.attr(HTMLControlAttrs.SERVERRESOLVE);
                String singleName=singleElem.attr(HTMLControlAttrs.SINGLENAME);
                HtmlControlDefinitionVo htmlControlDefinitionVo=ckEditorPluginsService.getVo(singleName);
                String serverResolveFullClassName = htmlControlDefinitionVo.getServerResolve();

                lastParentJbuild4dCustomElem=singleElem;

                if(serverResolveFullClassName!=null&&!serverResolveFullClassName.equals("")){
                    try {
                        IHTMLControl htmlControl = this.getHTMLControlInstance(serverResolveFullClassName);

                        htmlControl.resolveDefAttr(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo, htmlControlDefinitionVo);
                        htmlControl.resolveSelf(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo, htmlControlDefinitionVo);

                        htmlControl.rendererChain(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo);
                    }
                    catch (Exception ex){
                        singleElem.html("控件解析出错！【"+ex.getMessage()+"】");
                    }
                }
                else
                {
                    rendererChain(jb4DCSession, sourceHTML, doc, singleElem, singleElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo);
                }
            }
            else{
                //如果是普通html元素则直接递归处理,如果是自定义控件,则由控件显示调用
                if(singleElem.childNodeSize()>0){
                    rendererChain(jb4DCSession, sourceHTML, doc, singleElem, singleElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextVo);
                }
            }
        }
    }

    //todo 绑定默认值
    @Override
    public void bindDefaultValue(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {

    }

    @Override
    public void resolveDefAttr(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {
        //附件上客户端解析对象,适用于简单控件
        singleControlElem.attr("client_resolve",htmlControlDefinitionVo.getClientResolve());

        //移除掉编辑模式下的样式
        for (String className : singleControlElem.classNames()) {
            if(className.indexOf("wysiwyg-")>=0){
                singleControlElem.removeClass(className);
            }
        }


        //附加上自定义的样式
        String className=singleControlElem.attr("classname");
        if(!className.equals("")){
            singleControlElem.addClass(className);
        }
        singleControlElem.removeAttr("classname");

        //处理自读属性
        String custReadonly=singleControlElem.attr("custreadonly");
        if(custReadonly.equals("readonly")){
            singleControlElem.attr("readonly",custReadonly);
        }
        singleControlElem.removeAttr("custreadonly");

        //处理disable属性
        String custDisabled=singleControlElem.attr("custdisabled");
        if(custDisabled.equals("disabled")){
            singleControlElem.attr("disabled",custDisabled);
        }
        singleControlElem.removeAttr("custdisabled");
    }

    @Override
    public String parseToJson(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {
        return "{}";
    }
}
