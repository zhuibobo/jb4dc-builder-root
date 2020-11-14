package com.jb4dc.gridsystem.webpackage.rest.grid.gridinfo;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntityWithBLOBs;
import com.jb4dc.gridsystem.service.gridinfo.IGridInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/14
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Grid/GridInfo/GridInfoMain")
public class GridInfoRest {

    @Autowired
    IGridInfoService gridInfoService;

    @RequestMapping(value = "/SaveGridInfo", method = RequestMethod.POST)
    public JBuild4DCResponseVo saveGridInfo(String organId,String gridCode,String gridContent,String gridRemark,String gridParentId) throws JBuild4DCGenerallyException {
        gridInfoService.saveGridInfo(JB4DCSessionUtility.getSession(), organId, gridCode, gridContent, gridRemark, gridParentId);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/SaveGridMapPath", method = RequestMethod.POST)
    public JBuild4DCResponseVo saveGridMapPath(String organId,String gridMapPath,String parentId) throws JBuild4DCGenerallyException {
        gridInfoService.saveGridMapPath(JB4DCSessionUtility.getSession(),organId,gridMapPath,parentId);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/GetGridInfo", method = RequestMethod.GET)
    public JBuild4DCResponseVo getGridInfo(String organId) throws JBuild4DCGenerallyException {
        GridInfoEntityWithBLOBs gridInfoEntityWithBLOBs=gridInfoService.getByPrimaryKey(JB4DCSessionUtility.getSession(),organId);
        return JBuild4DCResponseVo.getDataSuccess(gridInfoEntityWithBLOBs);
    }

    @RequestMapping(value = "/GetSameLevelGrid", method = RequestMethod.GET)
    public JBuild4DCResponseVo getSameLevelGrid(String parentId,String excludeId) throws JBuild4DCGenerallyException {
        List<GridInfoEntityWithBLOBs> gridInfoEntityWithBLOBsList=gridInfoService.getByParentId(JB4DCSessionUtility.getSession(),parentId,excludeId);
        return JBuild4DCResponseVo.getDataSuccess(gridInfoEntityWithBLOBsList);
    }
}
