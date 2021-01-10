package com.jb4dc.gridsystem.service.statistics;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.service.statistics.impl.BaseStatistics;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

public interface IHouseStatistics {

    List<Map<String, Object>> getHouseRentalStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getHouseDesignForStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getHouseUseForStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getHouseUseAreaForStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getStreetHouseStatistics(JB4DCSession session, String streetValue) throws JBuild4DCGenerallyException;
}
