package com.jb4dc.builder.webpackage.rest.builder.list;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.search.GeneralSearchUtility;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntityWithBLOBs;
import com.jb4dc.builder.client.service.weblist.IListResourceService;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Builder/List")
public class ListRest extends GeneralRest<ListResourceEntityWithBLOBs> {

    @Autowired
    IListResourceService listResourceService;

    @Override
    protected IBaseService<ListResourceEntityWithBLOBs> getBaseService() {
        return listResourceService;
    }

    @Override
    public String getModuleName() {
        return "模块设计-列表设计";
    }

    @RequestMapping(value = "/GetListDataForModule", method = {RequestMethod.POST})
    public JBuild4DCResponseVo<List<ListResourcePO>> getListDataForModule(Integer pageSize, Integer pageNum, String searchCondition) throws IOException, ParseException, JBuild4DCGenerallyException {
        JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();
        Map<String, Object> searchMap = GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<ListResourcePO> proPageInfo = new PageInfo<>();
        List<ListResourcePO> listResourcePOList = listResourceService.getListDataForModule(jb4DSession, searchMap.get("listModuleId").toString());
        proPageInfo.setList(listResourcePOList);
        JBuild4DCResponseVo responseVo = new JBuild4DCResponseVo();
        responseVo.setData(proPageInfo);
        responseVo.setMessage("获取成功");
        responseVo.setSuccess(true);

        return responseVo;
    }
}
