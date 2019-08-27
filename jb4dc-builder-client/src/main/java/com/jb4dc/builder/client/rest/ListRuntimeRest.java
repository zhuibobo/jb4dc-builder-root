package com.jb4dc.builder.client.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.remote.ListRuntimeRemote;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/27
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/ListRuntime")
public class ListRuntimeRest {

    //@Autowired
    //ListRuntimeProvide listRuntimeProvide;
    @Autowired
    ListRuntimeRemote listRuntimeRemote;

    @RequestMapping("/LoadHTML")
    public JBuild4DCResponseVo<ListResourcePO> loadHTML(String listId) throws JBuild4DCGenerallyException {
        return listRuntimeRemote.loadHTML(listId);
    }

}
