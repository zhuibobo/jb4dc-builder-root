package com.jb4dc.builder.webpackage.rest.builder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.datastorage.TableRelationGroupEntity;
import com.jb4dc.builder.service.api.IApiGroupService;
import com.jb4dc.builder.service.api.IApiItemService;
import com.jb4dc.builder.service.dataset.IDatasetGroupService;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.builder.service.datastorage.ITableFieldService;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.builder.service.datastorage.ITableRelationGroupService;
import com.jb4dc.builder.service.envvar.IEnvGroupService;
import com.jb4dc.builder.client.service.envvar.IEnvVariableService;
import com.jb4dc.builder.service.module.IModuleService;
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

    @Autowired
    IDbLinkService dbLinkService;

    @Autowired
    ITableGroupService tableGroupService;

    @Autowired
    IModuleService moduleService;

    @Autowired
    IEnvGroupService envGroupService;

    @Autowired
    IEnvVariableService envVariableService;

    @Autowired
    IApiGroupService apiGroupService;

    @Autowired
    IApiItemService apiItemService;

    @RequestMapping(value = "/Running", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DCResponseVo running(String createTestData) throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getInitSystemSession();

        envGroupService.initSystemData(jb4DCSession);

        envVariableService.initSystemData(jb4DCSession);

        apiGroupService.initSystemData(jb4DCSession);

        apiItemService.initSystemData(jb4DCSession);

        tableFieldService.createTableFieldTemplates(jb4DCSession);

        TableRelationGroupEntity rootTableRelationGroupEntity=tableRelationGroupService.createRootNode(jb4DCSession);

        tableRelationGroupService.createSystemTableRelationGroupNode(jb4DCSession,rootTableRelationGroupEntity);

        datasetGroupService.initSystemData(jb4DCSession);

        dbLinkService.initSystemData(jb4DCSession);

        tableGroupService.initSystemData(jb4DCSession);

        moduleService.createRootNode(jb4DCSession);

        return JBuild4DCResponseVo.success("系统数据初始化成功！");
    }

}
