package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.builder.service.webform.IFormResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/9
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/FormRuntime")
public class FormRuntimeRest {

    @Autowired
    IFormResourceService formResourceService;

    @RequestMapping(value = "/LoadHTML",method = RequestMethod.POST)
    public JBuild4DCResponseVo<FormResourcePO> loadHTML(String formId) throws JBuild4DCGenerallyException {
        FormResourcePO formResourcePO=formResourceService.getFormRuntimePageContent(JB4DCSessionUtility.getSession(),formId);
        return JBuild4DCResponseVo.getDataSuccess(formResourcePO);
    }

}
