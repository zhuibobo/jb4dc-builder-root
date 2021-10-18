package com.jb4dc.builder.webpackage.rest.portlet;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.portlet.dbentities.TemplatePageEntityWithBLOBs;
import com.jb4dc.portlet.service.ITemplatePageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/Portlet/TemplatePage")
public class TemplatePageRest extends GeneralRest<TemplatePageEntityWithBLOBs> {

    @Autowired
    ITemplatePageService templatePageService;

    @Override
    protected IBaseService<TemplatePageEntityWithBLOBs> getBaseService() {
        return templatePageService;
    }
}
