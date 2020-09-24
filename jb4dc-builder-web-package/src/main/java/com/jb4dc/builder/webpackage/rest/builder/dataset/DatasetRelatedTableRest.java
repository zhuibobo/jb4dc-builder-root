package com.jb4dc.builder.webpackage.rest.builder.dataset;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.po.DataSetRelatedTablePO;
import com.jb4dc.builder.client.service.dataset.IDatasetRelatedTableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/22
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/DataSet/DatasetRelatedTable")
public class DatasetRelatedTableRest {

    private final IDatasetRelatedTableService datasetRelatedTableService;

    final ITableFieldService tableFieldService;

    public DatasetRelatedTableRest(IDatasetRelatedTableService datasetRelatedTableService, ITableFieldService tableFieldService) {
        this.datasetRelatedTableService = datasetRelatedTableService;
        this.tableFieldService = tableFieldService;
    }

    @RequestMapping(value = "/GetMainRTTable")
    public JBuild4DCResponseVo getMainRTTable(String dataSetId) throws JBuild4DCGenerallyException, IOException {
        DataSetRelatedTablePO dataSetRelatedTablePO = datasetRelatedTableService.getMainRTTable(JB4DCSessionUtility.getSession(),dataSetId);
        //datasetService.saveDataSetVo(JB4DCSessionUtility.getSession(), dataSetId, dataSetPO);
        return JBuild4DCResponseVo.opSuccess(dataSetRelatedTablePO);
    }

    @RequestMapping(value = "/GetDataSetMainTableFields")
    public JBuild4DCResponseVo getTableFieldsByTableId(String dataSetId) throws IOException, JBuild4DCGenerallyException {
        DataSetRelatedTablePO dataSetRelatedTablePO = datasetRelatedTableService.getMainRTTable(JB4DCSessionUtility.getSession(),dataSetId);
        return JBuild4DCResponseVo.getDataSuccess(tableFieldService.getTableFieldsByTableId(dataSetRelatedTablePO.getRtTableId()));
    }
}
