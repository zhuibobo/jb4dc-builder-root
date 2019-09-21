/*
package com.jb4dc.builder.webpackage.rest.builder.form;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.service.webform.IFormResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/Builder/FormRuntime")
public class FormRuntimeRest {

    @Autowired
    IFormResourceService formResourceService;

    @RequestMapping("/FormPreview")
    public JBuild4DCResponseVo<FormResourcePO> getFormPreviewHTMLContent(String formId) throws JBuild4DCGenerallyException {
        FormResourcePO po=formResourceService.getFormPreviewHTMLContent(JB4DCSessionUtility.getSession(),formId);
        return JBuild4DCResponseVo.getDataSuccess(po);
    }
}
*/
