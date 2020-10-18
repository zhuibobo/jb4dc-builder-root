package com.jb4dc.builder.client.htmldesign.control.weblist;

import com.jb4dc.builder.client.service.weblist.IWebListButtonService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.client.htmldesign.HTMLControlAttrs;
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
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/15
 * To change this template use File | Settings | File Templates.
 */
public class WebListListButtonContainer  extends HTMLControl implements IHTMLControl {

    @Autowired(required = false)
    IWebListButtonService listButtonService;

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
    public void resolveSelf(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextPO resolveHTMLControlContextPO, HtmlControlDefinitionPO htmlControlDefinitionPO) throws JBuild4DCGenerallyException {
        //获取所有的自定义控件
        Elements allElems=singleControlElem.getElementsByTag("div");
        for (Element singleInnerElem : allElems) {
            if (singleInnerElem.attr("jbuild4dc_custom").equals("true")) {
                String singleName=singleInnerElem.attr(HTMLControlAttrs.SINGLENAME);
                if(!singleName.equals("WLDCT_ListButtonContainer")) {
                    HtmlControlDefinitionPO htmlControlDefinitionVo = ckEditorPluginsService.getVo(singleName);
                    System.out.println(singleInnerElem.outerHtml());

                    String buttonElemId=singleInnerElem.id();
                    String listId=resolveHTMLControlContextPO.getRecordId();
                    String buttonId=listId+"-"+buttonElemId;

                    singleInnerElem.attr("buttonid",buttonId);
                    listButtonService.deleteByKey(jb4DCSession,buttonId);

                    String custSingleName=singleInnerElem.attr("custsinglename");
                    String buttonCaption=singleInnerElem.attr("buttoncaption");
                    String custProp1=singleInnerElem.attr("custprop1");
                    String custProp2=singleInnerElem.attr("custprop2");
                    String custProp3=singleInnerElem.attr("custprop3");
                    String custProp4=singleInnerElem.attr("custprop4");

                    String outerId="";
                    String innerConfig="";
                    String operationType="";
                    if(singleInnerElem.attr("singlename").equals("WLDCT_FormButton")) {
                        outerId=singleInnerElem.attr("formid");
                        operationType=singleInnerElem.attr("operation");
                        try {
                            innerConfig= URLDecoder.decode(singleInnerElem.attr("innerbuttonjsonstring"),"utf-8");
                        } catch (UnsupportedEncodingException e) {
                            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"解析内部innerbuttonjsonstring出错!"+e.getMessage());
                        }
                    }

                    if(StringUtility.isNotEmpty(custSingleName)){
                        ListButtonEntity listButtonEntity=listButtonService.getByCustSingleName(jb4DCSession,custSingleName);
                        if(listButtonEntity!=null){
                            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"按钮【"+buttonCaption+"】在开发属性中定义了唯一名【"+custSingleName+"】,但是该名称已经被使用,请修改名称!");
                        }
                    }

                    ListButtonEntity listButtonEntity=new ListButtonEntity();
                    listButtonEntity.setButtonId(buttonId);
                    listButtonEntity.setButtonListId(listId);
                    listButtonEntity.setButtonListElemId(buttonElemId);
                    listButtonEntity.setButtonSingleName(singleName);
                    listButtonEntity.setButtonCaption(buttonCaption);
                    listButtonEntity.setButtonContent(singleInnerElem.outerHtml());
                    listButtonEntity.setButtonAuth(singleInnerElem.attr("bindauthority"));
                    listButtonEntity.setButtonRtContentRenderer("");
                    listButtonEntity.setButtonDesc("");
                    listButtonEntity.setButtonCustSingleName(custSingleName);
                    listButtonEntity.setButtonCustProp1(custProp1);
                    listButtonEntity.setButtonCustProp1(custProp2);
                    listButtonEntity.setButtonCustProp1(custProp3);
                    listButtonEntity.setButtonCustProp1(custProp4);
                    listButtonEntity.setButtonOuterId(outerId);
                    listButtonEntity.setButtonInnerConfig(innerConfig);
                    listButtonEntity.setButtonOperationType(operationType);
                    listButtonService.saveSimple(jb4DCSession,buttonId,listButtonEntity);
                }
            }
        }

        String script=getClientNewInstanceScript(singleControlElem,false,"");
        singleControlElem.ownerDocument().body().append(script);
    }

    @Override
    public void dynamicBind(JB4DCSession jb4DCSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO) throws JBuild4DCGenerallyException {

    }

}