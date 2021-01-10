package com.jb4dc.gridsystem.webpackage.rest.grid.statistics;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.service.statistics.IBuildStatistics;
import com.jb4dc.gridsystem.service.statistics.IHouseStatistics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Grid/Statistics/HouseStatistics")
public class HouseStatisticsRest {

    @Autowired
    IHouseStatistics houseStatistics;

    @RequestMapping(value = "/GetHouseRentalStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getHouseRentalStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=houseStatistics.getHouseRentalStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

    @RequestMapping(value = "/GetHouseDesignForStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getHouseDesignForStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=houseStatistics.getHouseDesignForStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

    @RequestMapping(value = "/GetHouseUseForStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getHouseUseForStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=houseStatistics.getHouseUseForStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

    @RequestMapping(value = "/GetHouseUseAreaForStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getHouseUseAreaForStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=houseStatistics.getHouseUseAreaForStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

    @RequestMapping(value = "/GetStreetHouseStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getStreetHouseStatistics(String streetValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=houseStatistics.getStreetHouseStatistics(JB4DCSessionUtility.getSession(),streetValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }
}
