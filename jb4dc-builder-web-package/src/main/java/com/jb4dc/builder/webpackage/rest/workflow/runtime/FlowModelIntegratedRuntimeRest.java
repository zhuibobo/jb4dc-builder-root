package com.jb4dc.builder.webpackage.rest.workflow.runtime;

import com.jb4dc.builder.webpackage.rest.workflow.FlowModelIntegratedRest;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.json.XML;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.ParseException;


/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2021/4/23
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/FlowModelIntegrated")
public class FlowModelIntegratedRuntimeRest extends FlowModelIntegratedRest {

    @RequestMapping(
            value = {"/GetMyStartEnableModel"},
            method = {RequestMethod.GET}
    )
    public JBuild4DCResponseVo getMyStartEnableModel(String userId) throws IOException, ParseException, JBuild4DCGenerallyException {
        //XMLSerializer xmlSerializer = new XMLSerializer();
        XML.toJSONObject("").toString(2);
        return JBuild4DCResponseVo.getDataSuccess("");
    }
}
