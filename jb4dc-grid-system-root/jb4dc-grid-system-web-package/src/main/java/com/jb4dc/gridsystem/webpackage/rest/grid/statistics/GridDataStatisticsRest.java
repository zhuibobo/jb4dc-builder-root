package com.jb4dc.gridsystem.webpackage.rest.grid.statistics;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.service.statistics.IGridStatistics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Grid/Statistics/GridDataStatistics")
public class GridDataStatisticsRest {

    @Autowired
    IGridStatistics gridStatistics;

    @RequestMapping(value = "/GetMyGridGatherDataStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo getMyGridGatherDataStatistics() throws JBuild4DCGenerallyException {
        List<Map<String, Object>> myGridGatherDataStatistics=gridStatistics.getMyGridGatherDataStatistics(JB4DCSessionUtility.getSession().getOrganId());
        return JBuild4DCResponseVo.getDataSuccess(myGridGatherDataStatistics);
    }

    @RequestMapping(value = "/GetAreaGatherDataStatistics", method = RequestMethod.GET)
    public JBuild4DCResponseVo getAreaGatherDataStatistics() throws JBuild4DCGenerallyException {
        List<Map<String, Object>> areaGatherDataStatistics=gridStatistics.getAreaGatherDataStatistics();
        return JBuild4DCResponseVo.getDataSuccess(areaGatherDataStatistics);
    }
}
