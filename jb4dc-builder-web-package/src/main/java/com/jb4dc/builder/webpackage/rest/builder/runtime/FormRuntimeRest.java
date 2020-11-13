package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.po.DynamicBindHTMLControlContextPO;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

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

    @Autowired
    IHTMLRuntimeResolve htmlRuntimeResolve;

    @RequestMapping(value = "/LoadHTML",method = RequestMethod.POST)
    public JBuild4DCResponseVo<FormResourcePO> loadHTML(String formId) throws JBuild4DCGenerallyException {
        FormResourcePO formResourcePO=formResourceService.getFormRuntimePageContent(JB4DCSessionUtility.getSession(),formId);
        return JBuild4DCResponseVo.getDataSuccess(formResourcePO);
    }

    @RequestMapping(value = "/LoadHTMLForPreView",method = RequestMethod.POST)
    public JBuild4DCResponseVo<FormResourcePO> loadHTMLForPreView(String formId) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException {
        FormResourcePO formResourcePO=formResourceService.getFormRuntimePageContent(JB4DCSessionUtility.getSession(),formId);
        DynamicBindHTMLControlContextPO dynamicBindHTMLControlContextPO=new DynamicBindHTMLControlContextPO();
        String runTimeHtml=htmlRuntimeResolve.dynamicBind(JB4DCSessionUtility.getSession(),formId,formResourcePO.getFormHtmlResolve(),dynamicBindHTMLControlContextPO);
        formResourcePO.setFormHtmlRuntime(runTimeHtml);
        return JBuild4DCResponseVo.getDataSuccess(formResourcePO);
    }
}
