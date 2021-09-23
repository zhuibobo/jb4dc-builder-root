package com.jb4dc.builder.webpackage.rest.builder.list;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.search.GeneralSearchUtility;
import com.jb4dc.builder.client.remote.ListRuntimeRemote;
import com.jb4dc.builder.client.service.dataset.IDatasetService;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntityWithBLOBs;
import com.jb4dc.builder.client.service.weblist.IListResourceService;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.builder.po.QueryDataSetPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Builder/List")
public class ListRest extends GeneralRest<ListResourceEntityWithBLOBs> implements ListRuntimeRemote {

    @Autowired
    IListResourceService listResourceService;

    @Autowired
    IDatasetService datasetService;

    @Override
    protected IBaseService<ListResourceEntityWithBLOBs> getBaseService() {
        return listResourceService;
    }

    /*@Override
    public String getModuleName() {
        return "模块设计-列表设计";
    }*/

    @RequestMapping(value = "/GetListDataForModule", method = {RequestMethod.POST})
    public JBuild4DCResponseVo<List<ListResourcePO>> getListDataForModule(Integer pageSize, Integer pageNum, String searchCondition) throws IOException, ParseException, JBuild4DCGenerallyException {
        JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();
        Map<String, Object> searchMap = GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<ListResourcePO> proPageInfo = new PageInfo<>();
        List<ListResourcePO> listResourcePOList = listResourceService.getListDataForModule(jb4DSession, searchMap.get("listModuleId").toString(),datasetService);
        proPageInfo.setList(listResourcePOList);
        JBuild4DCResponseVo responseVo = new JBuild4DCResponseVo();
        responseVo.setData(proPageInfo);
        responseVo.setMessage("获取成功");
        responseVo.setSuccess(true);

        return responseVo;
    }

    @RequestMapping(value = "CopyList",method = RequestMethod.POST)
    public JBuild4DCResponseVo copyList(String listId) throws JBuild4DCGenerallyException, IOException {
        listResourceService.copyList(JB4DCSessionUtility.getSession(),listId);
        return JBuild4DCResponseVo.opSuccess();
    }

    @Override
    public JBuild4DCResponseVo<ListResourcePO> loadHTML(String listId) throws JBuild4DCGenerallyException {
        ListResourcePO listResourcePO=listResourceService.getListRuntimeHTMLContent(JB4DCSessionUtility.getSession(),listId);
        //htmlRuntimeResolve.dynamicBind(JB4DCSessionUtility.getSession(),listId,)
        return JBuild4DCResponseVo.getDataSuccess(listResourcePO);
    }

    /*@Override
    public JBuild4DCResponseVo<PageInfo<List<Map<String, Object>>>> getDataSetData(@RequestBody QueryDataSetPO queryDataSetPO) throws JBuild4DCGenerallyException, IOException {
        PageInfo<List<Map<String, Object>>> data=datasetService.getDataSetData(JB4DCSessionUtility.getSession(),queryDataSetPO);
        return JBuild4DCResponseVo.getDataSuccess(data);
    }*/
}
