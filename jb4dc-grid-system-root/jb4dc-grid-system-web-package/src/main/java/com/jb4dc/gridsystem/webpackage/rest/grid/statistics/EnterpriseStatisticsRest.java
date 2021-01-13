package com.jb4dc.gridsystem.webpackage.rest.grid.statistics;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.service.statistics.IEnterpriseStatistics;
import com.jb4dc.gridsystem.service.statistics.IPersonStatistics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Grid/Statistics/EnterpriseStatistics")
public class EnterpriseStatisticsRest {

    @Autowired
    IEnterpriseStatistics enterpriseStatistics;

    @RequestMapping(value = "/GetStreetEnterpriseStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<Map<String,Object>>> getStreetEnterpriseStatistics(String streetValue) throws JBuild4DCGenerallyException {
        List<Map<String,Object>> statisticsList=enterpriseStatistics.getStreetEnterpriseStatistics(JB4DCSessionUtility.getSession(),streetValue);
        return JBuild4DCResponseVo.getDataSuccess(statisticsList);
    }

}
