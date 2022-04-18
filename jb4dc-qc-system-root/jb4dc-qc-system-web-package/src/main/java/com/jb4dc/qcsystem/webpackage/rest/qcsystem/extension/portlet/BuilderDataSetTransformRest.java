package com.jb4dc.qcsystem.webpackage.rest.qcsystem.extension.portlet;
import com.google.common.collect.Lists;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.rest.DataSetRuntimeRest;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.QueryDataSetPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.searchmodel.ExecutionTaskSearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Extension/Portlet/BuilderDataSetTransform")
public class BuilderDataSetTransformRest {

    @Autowired
    DataSetRuntimeRest dataSetRuntimeRemote;

    @RequestMapping(value = "/GetDataSetDataTransform",method = RequestMethod.POST)
    public JBuild4DCResponseVo<PageInfo<List<Map<String, Object>>>> getDataSetDataTransform(String dataSetId,int pageSize) throws JBuild4DCGenerallyException, IOException {
        DataSetPO dataSetPO=dataSetRuntimeRemote.getByDataSetId(dataSetId).getData();
        QueryDataSetPO queryDataSetPO=new QueryDataSetPO();
        queryDataSetPO.setDataSetId(dataSetId);
        queryDataSetPO.setPageSize(pageSize);
        queryDataSetPO.setPageNum(1);
        queryDataSetPO.setListQueryPOList(Lists.newArrayList());
        queryDataSetPO.setExValue1("");
        queryDataSetPO.setExValue2("");
        queryDataSetPO.setExValue3("");

        JBuild4DCResponseVo<PageInfo<List<Map<String, Object>>>> responseVo=dataSetRuntimeRemote.getDataSetData(queryDataSetPO);
        return responseVo;
    }
}
