package com.jb4dc.gridsystem.service.statistics;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;
import java.util.Map;

public interface IEnterpriseStatistics {
    List<Map<String, Object>> getStreetEnterpriseStatistics(JB4DCSession session, String streetValue) throws JBuild4DCGenerallyException;
}
