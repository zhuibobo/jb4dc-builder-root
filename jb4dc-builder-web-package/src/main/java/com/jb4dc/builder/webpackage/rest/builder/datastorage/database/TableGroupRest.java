package com.jb4dc.builder.webpackage.rest.builder.datastorage.database;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Builder/DataStorage/DataBase/TableGroup")
public class TableGroupRest extends GeneralRest<TableGroupEntity> {

    @Autowired
    ITableGroupService tableGroupService;

    @Override
    protected IBaseService<TableGroupEntity> getBaseService() {
        return tableGroupService;
    }

    @Override
    public String getModuleName() {
        return "表分组";
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTreeData(String dbLinkId) {
        //List<TableGroupEntity> tableGroupEntityList=tableGroupService.getALLASC(JB4DSessionUtility.getSession());
        List<TableGroupEntity> tableGroupEntityList=tableGroupService.getByDBLinkId(JB4DCSessionUtility.getSession(),dbLinkId);
        return JBuild4DCResponseVo.getDataSuccess(tableGroupEntityList);
    }
}
