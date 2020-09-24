package com.jb4dc.builder.client.rest;

import com.jb4dc.builder.client.remote.WebListButtonRuntimeRemote;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/28
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/ListButtonRuntime")
public class ListButtonRuntimeRest {
    @Autowired
    WebListButtonRuntimeRemote listButtonRuntimeRemote;

    @RequestMapping(value = "/GetButtonPO",method = RequestMethod.POST)
    public JBuild4DCResponseVo<ListButtonEntity> getButtonPO(String buttonId) throws JBuild4DCGenerallyException {
        JBuild4DCResponseVo<ListButtonEntity> jBuild4DCResponseVo=listButtonRuntimeRemote.getButtonPO(buttonId);
        return jBuild4DCResponseVo;
    }
}
