package com.jb4dc.builder.webpackage.rest.builder.dataset;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.dataset.DatasetGroupEntity;
import com.jb4dc.builder.service.dataset.IDatasetGroupService;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Builder/DataSet/DataSetGroup")
public class DataSetGroupRest extends GeneralRest<DatasetGroupEntity> {
    @Autowired
    IDatasetGroupService datasetGroupService;

    @Override
    protected IBaseService<DatasetGroupEntity> getBaseService() {
        return datasetGroupService;
    }

    /*@Override
    public String getModuleName() {
        return "模块设计--数据集分组";
    }*/

    @RequestMapping(value = "GetTreeData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTreeData(String dbLinkId) {
        List<DatasetGroupEntity> datasetGroupEntityList=datasetGroupService.getByDBLinkId(JB4DCSessionUtility.getSession(),dbLinkId);
        //List<DatasetGroupEntity> datasetGroupEntityList=datasetGroupService.getALL(JB4DCSessionUtility.getSession());
        return JBuild4DCResponseVo.getDataSuccess(datasetGroupEntityList);
    }
}
