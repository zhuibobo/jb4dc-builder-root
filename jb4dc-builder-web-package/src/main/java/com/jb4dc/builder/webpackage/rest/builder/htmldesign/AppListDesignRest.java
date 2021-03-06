package com.jb4dc.builder.webpackage.rest.builder.htmldesign;

import com.jb4dc.builder.client.htmldesign.ICKEditorPluginsService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

@RestController
@RequestMapping(value = "/Rest/Builder/HtmlDesign/ListDesign")
public class AppListDesignRest {
    @Autowired
    ICKEditorPluginsService ckEditorPluginsService;

    @RequestMapping(value = "/GetPluginsConfig")
    public JBuild4DCResponseVo getPluginsConfig() throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException {
        return JBuild4DCResponseVo.success("获取插件定义成功!",ckEditorPluginsService.getListControlVoList());
    }
}
