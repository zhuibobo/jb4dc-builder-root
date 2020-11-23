package com.jb4dc.gridsystem.service.statistics.impl;

import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.gridsystem.service.statistics.IGridStatistics;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GridStatistics implements IGridStatistics {

    private ISQLBuilderService sqlBuilderService;

    public GridStatistics(ISQLBuilderService sqlBuilderService) {
        this.sqlBuilderService = sqlBuilderService;
    }

    @Override
    public List<Map<String,Object>> getMyGridGatherDataStatistics(String organId){
        String sql="select count(*) DATA_COUNT,'一般建筑物' DATA_NAME from tgrid_build_info where BUILD_CATEGORY='一般建筑物' and BUILD_INPUT_UNIT_ID=#{organId}\n" +
                "union all\n" +
                "select count(*) DATA_COUNT,'特殊建筑物' DATA_NAME from tgrid_build_info where BUILD_CATEGORY='特殊建筑物' and BUILD_INPUT_UNIT_ID=#{organId}\n" +
                "union all\n" +
                "select count(*) DATA_COUNT,'房屋' DATA_NAME from tgrid_house_info where HOUSE_INPUT_UNIT_ID=#{organId}\n" +
                "union all\n" +
                "select count(*) DATA_COUNT,'户' DATA_NAME from tgrid_family where FAMILY_INPUT_UNIT_ID=#{organId}\n" +
                "union all\n" +
                "select count(*) DATA_COUNT,'人口' DATA_NAME from tgrid_person where PERSON_INPUT_UNIT_ID=#{organId}\n" +
                "union all\n" +
                "select count(*) DATA_COUNT,'企业法人' DATA_NAME from tgrid_enterprise_info where ENT_INPUT_UNIT_ID=#{organId}\n" +
                "union all\n" +
                "select count(*) DATA_COUNT,'网格事件' DATA_NAME from tgrid_event_info where EVENT_ACCEPT_UNIT_ID=#{organId}";
        List<Map<String, Object>> result=sqlBuilderService.selectList(sql,organId);
        return result;
    }
}
