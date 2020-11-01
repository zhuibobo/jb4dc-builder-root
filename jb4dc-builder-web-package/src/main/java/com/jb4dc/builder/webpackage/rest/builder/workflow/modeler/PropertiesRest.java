package com.jb4dc.builder.webpackage.rest.builder.workflow.modeler;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.po.ModuleContextPO;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/12/8
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Workflow/Modeler/Properties")
public class PropertiesRest {

    @Autowired
    IModuleService moduleService;

    @RequestMapping(value = "/GetModuleContext")
    public JBuild4DCResponseVo getModuleContext(String moduleId) throws JBuild4DCGenerallyException, IOException {
        ModuleContextPO moduleContextPO=moduleService.getModuleContextPO(JB4DCSessionUtility.getSession(),moduleId);
        return JBuild4DCResponseVo.success("获取流程上下文定义!",moduleContextPO);
    }
}
