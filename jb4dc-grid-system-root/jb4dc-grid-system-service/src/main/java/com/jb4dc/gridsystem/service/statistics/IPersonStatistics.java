package com.jb4dc.gridsystem.service.statistics;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;
import java.util.Map;

public interface IPersonStatistics {
    List<Map<String, Object>> getPersonSexStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getPersonHRLocationStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getPersonEducationStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getStreetPersonStatistics(JB4DCSession session, String streetValue) throws JBuild4DCGenerallyException;
}
