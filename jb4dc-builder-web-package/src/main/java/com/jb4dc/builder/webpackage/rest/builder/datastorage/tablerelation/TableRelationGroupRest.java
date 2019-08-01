package com.jb4dc.builder.webpackage.rest.builder.datastorage.tablerelation;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.datastorage.TableRelationGroupEntity;
import com.jb4dc.builder.service.datastorage.ITableRelationGroupService;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Builder/DataStorage/TableRelation/TableRelationGroup")
public class TableRelationGroupRest extends GeneralRest<TableRelationGroupEntity> {

    @Autowired
    ITableRelationGroupService tableRelationGroupService;

    @Override
    protected IBaseService<TableRelationGroupEntity> getBaseService() {
        return tableRelationGroupService;
    }

    @Override
    public String getModuleName() {
        return "表关系分组";
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTreeData() {
        List<TableRelationGroupEntity> tableGroupEntityList=tableRelationGroupService.getALLASC(JB4DCSessionUtility.getSession());
        return JBuild4DCResponseVo.getDataSuccess(tableGroupEntityList);
    }

}
