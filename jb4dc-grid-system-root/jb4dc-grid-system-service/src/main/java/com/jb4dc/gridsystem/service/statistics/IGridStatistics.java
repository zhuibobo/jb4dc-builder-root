package com.jb4dc.gridsystem.service.statistics;

import java.util.List;
import java.util.Map;

public interface IGridStatistics {
    List<Map<String,Object>> getMyGridGatherDataStatistics(String organId);
}
