package com.jb4dc.builder.webpackage.rest.workflow.runtime;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.search.GeneralSearchUtility;
import com.jb4dc.builder.webpackage.rest.workflow.FlowModelIntegratedRest;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.ParseException;
import java.util.Map;

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
        return JBuild4DCResponseVo.getDataSuccess("");
    }
}
