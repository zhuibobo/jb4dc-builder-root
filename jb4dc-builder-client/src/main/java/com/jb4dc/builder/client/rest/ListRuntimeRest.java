package com.jb4dc.builder.client.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.client.proxy.IListRuntimeProxy;
import com.jb4dc.builder.client.remote.ListRuntimeRemote;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @RequestMapping("/LoadHTML")
    public JBuild4DCResponseVo<ListResourcePO> loadHTML(String listId) throws JBuild4DCGenerallyException {
        ListResourcePO listResourcePO=listRuntimeProxy.loadHTML(JB4DCSessionUtility.getSession(),listId);
        String runtimeHTML=htmlRuntimeResolve.dynamicBind(JB4DCSessionUtility.getSession(),listId,listResourcePO.getListHtmlResolve(),null);
        listResourcePO.setListHtmlRuntime(runtimeHTML);
        return JBuild4DCResponseVo.opSuccess(listResourcePO);
    }

}
