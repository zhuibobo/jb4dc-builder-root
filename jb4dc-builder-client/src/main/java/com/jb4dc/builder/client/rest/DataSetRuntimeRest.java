package com.jb4dc.builder.client.rest;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.remote.DataSetRuntimeRemote;
import com.jb4dc.builder.client.service.dataset.IDatasetRuntimeService;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.QueryDataSetPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
 * jb4dc-builder-web-package中存在相同url的bean,在构件系统本身启用时排除掉当前的bean
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/DataSetRuntime")
public class DataSetRuntimeRest {

    @Qualifier("com.jb4dc.builder.client.remote.DataSetRuntimeRemote")
    @Autowired
    DataSetRuntimeRemote dataSetRuntimeRemote;

    @Autowired
    IDatasetRuntimeService datasetRuntimeService;

    @RequestMapping(value = "/GetByDataSetId",method = RequestMethod.POST)
    public JBuild4DCResponseVo<DataSetPO> getByDataSetId(String dataSetId) throws JBuild4DCGenerallyException, IOException {
        DataSetPO dataSetPO=dataSetRuntimeRemote.getByDataSetId(dataSetId).getData();
        return JBuild4DCResponseVo.opSuccess(dataSetPO);
    }

    @RequestMapping(value = "/GetDataSetData",method = RequestMethod.POST)
    public JBuild4DCResponseVo<PageInfo<List<Map<String, Object>>>> getDataSetData(@RequestBody QueryDataSetPO queryDataSetPO) throws JBuild4DCGenerallyException, IOException {
        String dataSetId=queryDataSetPO.getDataSetId();
        DataSetPO dataSetPO=dataSetRuntimeRemote.getByDataSetId(dataSetId).getData();

        PageInfo<List<Map<String, Object>>> data=datasetRuntimeService.getDataSetData(JB4DCSessionUtility.getSession(),queryDataSetPO,dataSetPO);

        return JBuild4DCResponseVo.getDataSuccess(data);
    }

    @RequestMapping(value = "/DeleteDataSetRecord",method = RequestMethod.POST)
    public JBuild4DCResponseVo deleteDataSetRecord(String dataSetId,String pkValue) throws JBuild4DCGenerallyException {
        datasetRuntimeService.deleteDataSetRecord(JB4DCSessionUtility.getSession(),dataSetId,pkValue);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/DeleteTableRecord",method = RequestMethod.POST)
    public JBuild4DCResponseVo deleteTableRecord(String tableId,String pkValue) throws JBuild4DCGenerallyException {
        datasetRuntimeService.deleteTableRecord(JB4DCSessionUtility.getSession(),tableId,pkValue);
        return JBuild4DCResponseVo.opSuccess();
    }
}
