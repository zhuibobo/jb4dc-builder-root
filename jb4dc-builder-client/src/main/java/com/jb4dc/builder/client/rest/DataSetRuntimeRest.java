package com.jb4dc.builder.client.rest;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.remote.DataSetRuntimeRemote;
import com.jb4dc.builder.client.service.IDatasetClientService;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.QueryDataSetPO;
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
    DataSetRuntimeRemote dataSetRuntimeRemote;

    @Autowired
    IDatasetClientService datasetClientService;

    @RequestMapping(value = "/GetByDataSetId",method = RequestMethod.POST)
    public JBuild4DCResponseVo<DataSetPO> getByDataSetId(String dataSetId) throws JBuild4DCGenerallyException, IOException {
        JBuild4DCResponseVo<DataSetPO> responseVo=dataSetRuntimeRemote.getByDataSetId(dataSetId);
        return responseVo;
    }

    @RequestMapping(value = "/GetDataSetData",method = RequestMethod.POST)
    public JBuild4DCResponseVo<PageInfo<List<Map<String, Object>>>> getDataSetData(@RequestBody QueryDataSetPO queryDataSetPO) throws JBuild4DCGenerallyException {
        String dataSetId=queryDataSetPO.getDataSetId();
        DataSetPO dataSetPO=dataSetRuntimeRemote.getByDataSetId(dataSetId).getData();

        PageInfo<List<Map<String, Object>>> data=datasetClientService.getDataSetData(JB4DCSessionUtility.getSession(),queryDataSetPO,dataSetPO);

        return JBuild4DCResponseVo.getDataSuccess(data);
    }
}
