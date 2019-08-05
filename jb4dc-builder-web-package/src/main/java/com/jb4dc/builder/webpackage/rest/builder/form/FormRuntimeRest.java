package com.jb4dc.builder.webpackage.rest.builder.form;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.service.webform.IFormResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/Builder/FormRuntime")
public class FormRuntimeRest {

    @Autowired
    IFormResourceService formResourceService;

    @RequestMapping("/FormPreview")
    public String getFormPreviewHTMLContent(String formId) throws JBuild4DCGenerallyException {
        return formResourceService.getFormPreviewHTMLContent(JB4DCSessionUtility.getSession(),formId);
    }
}
