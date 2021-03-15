package com.jb4dc.gridsystem.webpackage.rest.grid.statistics;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.service.statistics.IEnterpriseStatistics;
import com.jb4dc.gridsystem.service.statistics.IEventStatistics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Grid/Statistics/EventStatistics")
public class EventStatisticsRest {

    @Autowired
    IEventStatistics eventStatistics;

    @RequestMapping(value = "/GetStreetEventStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getStreetEventStatistics(String streetValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=eventStatistics.getStreetEventStatistics(JB4DCSessionUtility.getSession(),streetValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

    @RequestMapping(value = "/GetEventSourceStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getEventSourceStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=eventStatistics.getEventSourceStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

    @RequestMapping(value = "/GetEventLevelStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getEventLevelStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=eventStatistics.getEventLevelStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

    @RequestMapping(value = "/GetEventAppealPersonNumStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getEventAppealPersonNumStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=eventStatistics.getEventAppealPersonNumStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }
}
