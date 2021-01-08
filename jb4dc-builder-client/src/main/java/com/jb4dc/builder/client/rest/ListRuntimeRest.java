package com.jb4dc.builder.client.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.client.proxy.IDictionaryRuntimeProxy;
import com.jb4dc.builder.client.proxy.IListRuntimeProxy;
import com.jb4dc.builder.client.remote.DictionaryRuntimeRemote;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.proxy.IOrganRuntimeProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/27
 * jb4dc-builder-web-package中存在相同url的bean,在构件系统本身启用时排除掉当前的bean
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/ListRuntime")
public class ListRuntimeRest {

    //@Autowired
    //ListRuntimeProvide listRuntimeProvide;
    @Autowired
    IListRuntimeProxy listRuntimeProxy;

    @Autowired
    IHTMLRuntimeResolve htmlRuntimeResolve;

    @Autowired
    IOrganRuntimeProxy organRuntimeProxy;

    @Autowired
    IDictionaryRuntimeProxy dictionaryRuntimeProxy;

    @RequestMapping("/LoadHTML")
    public JBuild4DCResponseVo<ListResourcePO> loadHTML(String listId) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException {
        ListResourcePO listResourcePO=listRuntimeProxy.loadHTML(JB4DCSessionUtility.getSession(),listId);
        String resolveHTML=htmlRuntimeResolve.resolveSourceHTMLAtRuntime(JB4DCSessionUtility.getSession(),listId,listResourcePO.getListHtmlResolve());
        String runtimeHTML=htmlRuntimeResolve.dynamicBind(JB4DCSessionUtility.getSession(),listId,resolveHTML,null);
        listResourcePO.setListHtmlRuntime(runtimeHTML);
        //dictionaryRuntimeRemote.getAllDictionary()
        listResourcePO.addNewExData("minOrganData",organRuntimeProxy.getEnableOrganMinMapJsonPropRT());
        listResourcePO.addNewExData("minDictionaryData",dictionaryRuntimeProxy.getAllDictionaryMinMapJsonPropRT());
        return JBuild4DCResponseVo.opSuccess(listResourcePO);
    }

}
