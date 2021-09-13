package com.jb4dc.builder.webpackage.rest.builder.list;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.remote.WebListButtonRuntimeRemote;
import com.jb4dc.builder.client.service.weblist.IWebListButtonService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/Builder/ListButton")
public class ListButtonRest implements WebListButtonRuntimeRemote {
    @Autowired
    IWebListButtonService webListButtonService;

    @Override
    public JBuild4DCResponseVo<ListButtonEntity> getButtonPO(String buttonId) throws JBuild4DCGenerallyException {
        ListButtonEntity listButtonEntity=webListButtonService.getByPrimaryKey(JB4DCSessionUtility.getSession(),buttonId);
        return JBuild4DCResponseVo.getDataSuccess(listButtonEntity);
    }
}
