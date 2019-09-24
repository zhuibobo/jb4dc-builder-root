package com.jb4dc.builder.client.htmldesign.control;

import com.jb4dc.base.dbaccess.dynamic.impl.SQLBuilderMapper;
import com.jb4dc.builder.client.htmldesign.HTMLControlAttrs;
import com.jb4dc.builder.client.htmldesign.ICKEditorPluginsService;
import com.jb4dc.builder.client.service.envvar.IEnvVariableRuntimeResolveService;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.builder.po.ResolveHTMLControlContextPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.ClassUtility;
import com.jb4dc.core.base.tools.StringUtility;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/15
 * To change this template use File | Settings | File Templates.
 */
public abstract class HTMLControl implements IHTMLControl {

    @Autowired
    SQLBuilderMapper sqlBuilderMapper;

    private static Map<String,IHTMLControl> controlInstanceMap=new HashMap<String,IHTMLControl>();

    @Autowired
    protected ICKEditorPluginsService ckEditorPluginsService;

    @Autowired
    protected AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    protected IEnvVariableRuntimeResolveService envVariableClientResolveService;

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
    public void rendererChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO) throws JBuild4DCGenerallyException {
        for (Element singleElem : singleControlElem.children()) {

            if(singleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM).equals("true")){
                //String serverResolveFullClassName = singleElem.attr(HTMLControlAttrs.SERVERRESOLVE);
                String singleName=singleElem.attr(HTMLControlAttrs.SINGLENAME);
                HtmlControlDefinitionPO htmlControlDefinitionPO =ckEditorPluginsService.getVo(singleName);
                String serverResolveFullClassName = htmlControlDefinitionPO.getServerResolve();

                lastParentJbuild4dCustomElem=singleElem;

                if(serverResolveFullClassName!=null&&!serverResolveFullClassName.equals("")){
                    try {
                        IHTMLControl htmlControl = this.getHTMLControlInstance(serverResolveFullClassName);

                        htmlControl.resolveDefAttr(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextPO, htmlControlDefinitionPO);

                        htmlControl.resolveSelf(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextPO, htmlControlDefinitionPO);

                        htmlControl.rendererChain(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextPO);
                    }
                    catch (Exception ex){
                        singleElem.html("<div class=\"ResolveControllerErrorMsg\">"+htmlControlDefinitionPO.getSingleName()+"控件解析出错！【"+ex.getMessage()+"】</div>");
                        //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex);
                    }
                }
                else
                {
                    rendererChain(jb4DCSession, sourceHTML, doc, singleElem, singleElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextPO);
                }
            }
            else{
                //如果是普通html元素则直接递归处理,如果是自定义控件,则由控件显示调用
                if(singleElem.childNodeSize()>0){
                    rendererChain(jb4DCSession, sourceHTML, doc, singleElem, singleElem, lastParentJbuild4dCustomElem, resolveHTMLControlContextPO);
                }
            }
        }
    }

    @Override
    public void dynamicBindChain(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException {
        for (Element singleElem : singleControlElem.children()) {

            if(singleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM).equals("true")){
                //String serverResolveFullClassName = singleElem.attr(HTMLControlAttrs.SERVERRESOLVE);
                String singleName=singleElem.attr(HTMLControlAttrs.SINGLENAME);
                HtmlControlDefinitionPO htmlControlDefinitionPO =ckEditorPluginsService.getVo(singleName);
                String serverResolveFullClassName = htmlControlDefinitionPO.getServerResolve();

                lastParentJbuild4dCustomElem=singleElem;

                if(serverResolveFullClassName!=null&&!serverResolveFullClassName.equals("")){
                    try {
                        IHTMLControl htmlControl = this.getHTMLControlInstance(serverResolveFullClassName);

                        //htmlControl.resolveDefAttr(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO, htmlControlDefinitionPO);
                        //htmlControl.resolveSelf(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO, htmlControlDefinitionPO);
                        htmlControl.dynamicBind(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);

                        htmlControl.dynamicBindChain(jb4DCSession, sourceHTML, doc, singleElem, parentElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);
                    }
                    catch (Exception ex){
                        singleElem.html("<div class=\"ResolveControllerErrorMsg\">"+htmlControlDefinitionPO.getSingleName()+"控件解析出错！【"+ex.getMessage()+"】</div>");
                        //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex);
                    }
                }
                else
                {
                    dynamicBindChain(jb4DCSession, sourceHTML, doc, singleElem, singleElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);
                }
            }
            else{
                //如果是普通html元素则直接递归处理,如果是自定义控件,则由控件显示调用
                if(singleElem.childNodeSize()>0){
                    dynamicBindChain(jb4DCSession, sourceHTML, doc, singleElem, singleElem, lastParentJbuild4dCustomElem, dynamicBindHTMLControlContextPO);
                }
            }
        }
    }

    public void defaultValueDynamicBind(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException {
        String defaultValue=getDefaultValue(jb4DCSession,sourceHTML,doc,singleControlElem,parentElem,lastParentJbuild4dCustomElem,dynamicBindHTMLControlContextPO,null);
        String value="";
        if (StringUtility.isNotEmpty(defaultValue)){
            value=defaultValue;
        }
        singleControlElem.val(value);
    }

    public String getDefaultValue(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException {
        String valueType = singleControlElem.attr("defaulttype");
        String value = singleControlElem.attr("defaultvalue");
        if (StringUtility.isNotEmpty(valueType)) {
            if (valueType.toUpperCase().equals("ENVVAR")) {
                return envVariableClientResolveService.execEnvVarResult(jb4DCSession, value);
            } else {
                return value;
            }
        }
        return "";
    }

    public List<Map<String,Object>> getDataSource(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> datasource=new ArrayList<>();
        //获取数据源优先级别->Rest接口->本地接口->sql->静态值

        try {
            String sql = URLDecoder.decode(singleControlElem.attr("sqldatasource"),"utf-8");
            if(StringUtility.isNotEmpty(sql)) {
                datasource = sqlBuilderMapper.selectList(sql);
            }
        } catch (UnsupportedEncodingException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"decode sqldatasource error"+e.getMessage());
        }

        return datasource;
    }

    @Override
    public void resolveDefAttr(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) {
        //附件上客户端解析对象,适用于简单控件
        singleControlElem.attr("client_resolve", htmlControlDefinitionPO.getClientResolve());

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
    public String parseToJson(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) {
        return "{}";
    }
}
