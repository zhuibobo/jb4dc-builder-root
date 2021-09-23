package com.jb4dc.builder.webpackage.rest.builder.datastorage.tablerelation;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.datastorage.TableRelationEntity;
import com.jb4dc.builder.service.datastorage.ITableRelationService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Builder/DataStorage/TableRelation/TableRelation")
public class TableRelationRest extends GeneralRest<TableRelationEntity> {

    @Autowired
    ITableRelationService tableRelationService;

    @Override
    protected IBaseService<TableRelationEntity> getBaseService() {
        return tableRelationService;
    }

    /*@Override
    public String getModuleName() {
        return "表关系";
    }*/

    @RequestMapping(value = "/GetRelationByGroup", method = RequestMethod.POST)
    public JBuild4DCResponseVo getRelationByGroup(String groupId) {
        List<TableRelationEntity> relationEntityList=tableRelationService.getRelationByGroup(JB4DCSessionUtility.getSession(),groupId);
        return JBuild4DCResponseVo.getDataSuccess(relationEntityList);
    }

    @RequestMapping(value = "/SaveDiagram",method = RequestMethod.POST)
    public JBuild4DCResponseVo saveDiagram(String recordId,String relationContent,String relationDiagramJson) throws JBuild4DCGenerallyException {
        tableRelationService.updateDiagram(JB4DCSessionUtility.getSession(),recordId,relationContent,relationDiagramJson);
        return JBuild4DCResponseVo.opSuccess();
    }
}
