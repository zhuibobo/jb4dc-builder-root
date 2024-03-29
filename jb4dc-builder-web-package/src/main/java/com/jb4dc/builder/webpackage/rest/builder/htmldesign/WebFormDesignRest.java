package com.jb4dc.builder.webpackage.rest.builder.htmldesign;

import com.jb4dc.builder.client.htmldesign.ICKEditorPluginsService;
import com.jb4dc.builder.client.htmldesign.IHTMLDesignThemesService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Builder/HtmlDesign/WebFormDesign")
public class WebFormDesignRest {

    @Autowired
    ICKEditorPluginsService ckEditorPluginsService;

    @Autowired
    IHTMLDesignThemesService htmlDesignThemesService;

    @RequestMapping(value = "/GetPluginsConfig")
    public JBuild4DCResponseVo getPluginsConfig() throws JBuild4DCGenerallyException, JAXBException, ParserConfigurationException, SAXException, XPathExpressionException, IOException {
        JBuild4DCResponseVo responseVo= JBuild4DCResponseVo.success("获取插件定义成功!",ckEditorPluginsService.getWebFormControlVoList());

        Map<String,Object> exKVData=new HashMap<>();
        exKVData.put("designThemes",htmlDesignThemesService.getDesignThemeList());
        responseVo.setExKVData(exKVData);

        return responseVo;
    }
}
