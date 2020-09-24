package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.DataSetRelatedTablePO;
import com.jb4dc.builder.po.QueryDataSetPO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.client.service.dataset.IDatasetRelatedTableService;
import com.jb4dc.builder.client.service.dataset.IDatasetService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/28
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/DataSetRuntime")
public class DataSetRuntimeRest {

    @Autowired
    IDatasetService datasetService;

    @Autowired
    IDatasetRelatedTableService datasetRelatedTableService;

    @Autowired
    ITableFieldService tableFieldService;

    @RequestMapping(value = "/GetByDataSetId",method = RequestMethod.POST)
    public JBuild4DCResponseVo<DataSetPO> getByDataSetId(String dataSetId) throws JBuild4DCGenerallyException, IOException {
        DataSetPO dataSetPO=datasetService.getVoByPrimaryKey(JB4DCSessionUtility.getSession(),dataSetId);
        return JBuild4DCResponseVo.getDataSuccess(dataSetPO);
    }


    @RequestMapping(value = "/GetDataSetData",method = RequestMethod.POST)
    public JBuild4DCResponseVo<PageInfo<List<Map<String, Object>>>> getDataSetData(@RequestBody QueryDataSetPO queryDataSetPO) throws JBuild4DCGenerallyException, IOException {
        String dataSetId=queryDataSetPO.getDataSetId();
        //DataSetPO dataSetPO=datasetService.getVoByPrimaryKey(JB4DCSessionUtility.getSession(),dataSetId);

        PageInfo<List<Map<String, Object>>> data=datasetService.getDataSetData(JB4DCSessionUtility.getSession(),queryDataSetPO);

        return JBuild4DCResponseVo.getDataSuccess(data);
    }

    @RequestMapping(value = "/GetMainRTTable")
    public JBuild4DCResponseVo<DataSetRelatedTablePO> getMainRTTable(String dataSetId) throws JBuild4DCGenerallyException, IOException {
        DataSetRelatedTablePO dataSetRelatedTablePO = datasetRelatedTableService.getMainRTTable(JB4DCSessionUtility.getSession(),dataSetId);
        //datasetService.saveDataSetVo(JB4DCSessionUtility.getSession(), dataSetId, dataSetPO);
        return JBuild4DCResponseVo.opSuccess(dataSetRelatedTablePO);
    }

    @RequestMapping(value = "/GetDataSetMainTableFields")
    public JBuild4DCResponseVo<List<TableFieldPO>> getTableFieldsByTableId(String dataSetId) throws IOException, JBuild4DCGenerallyException {
        DataSetRelatedTablePO dataSetRelatedTablePO = datasetRelatedTableService.getMainRTTable(JB4DCSessionUtility.getSession(),dataSetId);
        return JBuild4DCResponseVo.getDataSuccess(tableFieldService.getTableFieldsByTableId(dataSetRelatedTablePO.getRtTableId()));
    }
}
