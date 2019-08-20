package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.builder.po.QueryDataSetPO;
import com.jb4dc.builder.service.dataset.IDatasetService;
import com.jb4dc.builder.service.weblist.IListResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/9
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/ListRuntime")
public class ListRuntimeRest {
    @Autowired
    IListResourceService listResourceService;

    @Autowired
    IDatasetService datasetService;

    @RequestMapping("/LoadHTML")
    public JBuild4DCResponseVo<ListResourcePO> loadHTML(String listId) throws JBuild4DCGenerallyException {
        ListResourcePO listResourcePO=listResourceService.getListRuntimeHTMLContent(JB4DCSessionUtility.getSession(),listId);
        return JBuild4DCResponseVo.getDataSuccess(listResourcePO);
    }

    @RequestMapping(value = "/GetDataSetData",method = RequestMethod.POST)
    public JBuild4DCResponseVo<PageInfo<List<Map<String, Object>>>> getDataSetData(@RequestBody QueryDataSetPO queryDataSetPO) throws JBuild4DCGenerallyException {
        PageInfo<List<Map<String, Object>>> data=datasetService.getDataSetData(JB4DCSessionUtility.getSession(),queryDataSetPO);
        return JBuild4DCResponseVo.getDataSuccess(data);
    }
}
