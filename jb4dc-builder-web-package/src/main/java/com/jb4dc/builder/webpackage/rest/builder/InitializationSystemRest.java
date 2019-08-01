package com.jb4dc.builder.webpackage.rest.builder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.service.dataset.IDatasetGroupService;
import com.jb4dc.builder.service.datastorage.ITableFieldService;
import com.jb4dc.builder.service.datastorage.ITableRelationGroupService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/11
 * To change this template use File | Settings | File Templates.
 */

@RestController
@RequestMapping(value = "/Rest/Builder/InitializationSystem")
public class InitializationSystemRest {

    @Autowired
    ITableFieldService tableFieldService;

    @Autowired
    ITableRelationGroupService tableRelationGroupService;

    @Autowired
    IDatasetGroupService datasetGroupService;

    @RequestMapping(value = "/Running", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DCResponseVo running(String createTestData) throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCSession jb4DSession= JB4DCSessionUtility.getInitSystemSession();

        tableFieldService.createTableFieldTemplates(jb4DSession);

        tableRelationGroupService.createRootNode(jb4DSession);

        datasetGroupService.createRootNode(jb4DSession);

        return JBuild4DCResponseVo.success("系统数据初始化成功！");
    }

}
