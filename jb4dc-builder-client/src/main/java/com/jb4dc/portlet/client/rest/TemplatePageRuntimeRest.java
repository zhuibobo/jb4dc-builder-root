package com.jb4dc.portlet.client.rest;

import com.jb4dc.base.service.po.MenuPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.portlet.client.remote.TemplatePageRuntimeRemote;
import com.jb4dc.portlet.client.remote.WidgetRuntimeRemote;
import com.jb4dc.portlet.dbentities.TemplatePageEntityWithBLOBs;
import com.jb4dc.portlet.dbentities.WidgetEntity;
import com.jb4dc.sso.client.remote.MenuRuntimeRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Portlet/RunTime/Client/TemplatePageRuntime")
public class TemplatePageRuntimeRest {
    @Autowired
    MenuRuntimeRemote menuRuntimeRemote;

    @Autowired
    TemplatePageRuntimeRemote templatePageRuntimeRemote;

    @Autowired
    WidgetRuntimeRemote widgetRuntimeRemote;

    @RequestMapping(value = "/GetTemplatePageWithSSOMenu",method = RequestMethod.GET)
    public JBuild4DCResponseVo<TemplatePageEntityWithBLOBs> getTemplatePageWithSSOMenu(String menuId) throws JBuild4DCGenerallyException, IOException {
        MenuPO menuPO = menuRuntimeRemote.getMenuById(menuId).getData();
        TemplatePageEntityWithBLOBs templatePageEntityWithBLOBs = templatePageRuntimeRemote.getPageById(menuPO.getMenuOuterId()).getData();
        List<WidgetEntity> widgetEntityList=widgetRuntimeRemote.getALLWidget().getData();
        return JBuild4DCResponseVo.getDataSuccess(templatePageEntityWithBLOBs,"Widgets",widgetEntityList);
    }
}
