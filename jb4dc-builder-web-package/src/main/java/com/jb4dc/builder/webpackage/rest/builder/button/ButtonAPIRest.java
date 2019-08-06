package com.jb4dc.builder.webpackage.rest.builder.button;

import com.jb4dc.builder.service.button.ButtonAPIService;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;

@RestController
@RequestMapping(value = "/Rest/Builder/Button/ButtonApi")
public class ButtonAPIRest {

    @Autowired
    ButtonAPIService buttonAPIService;

    @RequestMapping(value = "/GetButtonApiConfig")
    public JBuild4DCResponseVo getButtonAPIConfig() throws JAXBException {
        JBuild4DCResponseVo responseVo=JBuild4DCResponseVo.success("获取按钮API定义成功!",buttonAPIService.getButtonAPIGroupList());
        return responseVo;
    }
}
