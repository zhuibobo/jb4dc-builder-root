package com.jb4dc.builder.client.service.weblist.impl;

import com.jb4dc.builder.client.remote.ListButtonRuntimeRemote;
import com.jb4dc.builder.client.service.weblist.IWebListButtonRuntimeResolveService;
import com.jb4dc.builder.client.service.weblist.IWebListButtonService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
@Service
public class WebListButtonRuntimeResolveServiceImpl implements IWebListButtonRuntimeResolveService {

    @Autowired(required = false)
    IWebListButtonService webListButtonService;

    @Autowired
    ListButtonRuntimeRemote listButtonRuntimeRemote;

    @Override
    public ListButtonEntity getButtonPO(String buttonId) throws JBuild4DCGenerallyException {
        //通过本地bean获取环境变量实体,如果不存在业务bean,则通过rest接口远程获取.
        if(webListButtonService!=null){
            return webListButtonService.getByPrimaryKey(null,buttonId);
        }
        else{
            //envVariableEntity=new EnvVariableEntity();
            //则通过rest接口远程获取.
            return listButtonRuntimeRemote.getButtonPO(buttonId).getData();
        }
    }
}
