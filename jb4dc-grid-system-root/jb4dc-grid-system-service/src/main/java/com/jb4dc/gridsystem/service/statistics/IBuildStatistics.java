package com.jb4dc.gridsystem.service.statistics;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;
import java.util.Map;

public interface IBuildStatistics {

    List<Map<String, Object>> getBuildTypeStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getBuildCategoryStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getBuildPropertyStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;
}
