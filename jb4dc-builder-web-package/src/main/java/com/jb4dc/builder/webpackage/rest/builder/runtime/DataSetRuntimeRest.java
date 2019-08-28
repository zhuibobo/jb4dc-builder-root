package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.service.dataset.IDatasetService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

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

    @RequestMapping(value = "/GetByDataSetId",method = RequestMethod.POST)
    public JBuild4DCResponseVo<DataSetPO> getByDataSetId(String dataSetId) throws JBuild4DCGenerallyException, IOException {
        DataSetPO dataSetPO=datasetService.getVoByPrimaryKey(JB4DCSessionUtility.getSession(),dataSetId);
        return JBuild4DCResponseVo.getDataSuccess(dataSetPO);
    }
}
