package com.jb4dc.builder.client.service.weblist.impl;

import com.jb4dc.builder.client.remote.EnvVariableRuntimeRemote;
import com.jb4dc.builder.client.remote.ListButtonRuntimeRemote;
import com.jb4dc.builder.client.service.weblist.IWebListButtonService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
public class WebListButtonRuntimeResolveServiceImpl {

    @Autowired(required = false)
    IWebListButtonService webListButtonService;

    @Autowired
    ListButtonRuntimeRemote listButtonRuntimeRemote;


}
