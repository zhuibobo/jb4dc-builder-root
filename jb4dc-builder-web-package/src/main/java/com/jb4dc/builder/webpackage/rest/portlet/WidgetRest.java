package com.jb4dc.builder.webpackage.rest.portlet;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.portlet.dbentities.WidgetEntity;
import com.jb4dc.portlet.service.IWidgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/Portlet/Widget")
public class WidgetRest extends GeneralRest<WidgetEntity> {

    @Autowired
    IWidgetService widgetService;

    @Override
    protected IBaseService<WidgetEntity> getBaseService() {
        return widgetService;
    }
}
