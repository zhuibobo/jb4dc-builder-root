package com.jb4dc.gridsystem.webpackage.rest.grid.statistics;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.service.statistics.IBuildStatistics;
import liquibase.pro.packaged.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Grid/Statistics/BuildStatistics")
public class BuildStatisticsRest {

    @Autowired
    IBuildStatistics buildStatistics;

    @RequestMapping(value = "/GetBuildTypeStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getBuildTypeStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=buildStatistics.getBuildTypeStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

    @RequestMapping(value = "/GetBuildCategoryStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getBuildCategoryStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=buildStatistics.getBuildCategoryStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

    @RequestMapping(value = "/GetBuildPropertyStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getBuildPropertyStatistics(String streetValue,String communityValue,String gridValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=buildStatistics.getBuildPropertyStatistics(JB4DCSessionUtility.getSession(),streetValue,communityValue,gridValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }
}
