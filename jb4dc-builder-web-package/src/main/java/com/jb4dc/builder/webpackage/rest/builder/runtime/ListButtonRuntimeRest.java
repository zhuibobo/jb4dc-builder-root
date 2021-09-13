/*
package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.weblist.IWebListButtonService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

*/
/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 *//*

@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/ListButtonRuntime")
public class ListButtonRuntimeRest {

    @Autowired
    IWebListButtonService webListButtonService;

    @RequestMapping(value = "/GetButtonPO",method = RequestMethod.POST)
    public JBuild4DCResponseVo<ListButtonEntity> getButtonPO(String buttonId) throws JBuild4DCGenerallyException {
        ListButtonEntity listButtonEntity=webListButtonService.getByPrimaryKey(JB4DCSessionUtility.getSession(),buttonId);
        return JBuild4DCResponseVo.getDataSuccess(listButtonEntity);
    }
}
*/
