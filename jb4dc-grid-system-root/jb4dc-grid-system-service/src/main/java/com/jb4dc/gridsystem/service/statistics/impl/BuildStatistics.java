package com.jb4dc.gridsystem.service.statistics.impl;

import com.jb4dc.builder.client.tools.SQLStringPlaceholderResultPO;
import com.jb4dc.builder.client.tools.SQLStringPlaceholderUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.gridsystem.service.statistics.IBuildStatistics;
import com.jb4dc.sso.client.proxy.IOrganRuntimeProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BuildStatistics extends BaseStatistics implements IBuildStatistics {

    @Autowired
    IOrganRuntimeProxy organRuntimeProxy;

    @Autowired
    SQLStringPlaceholderUtility sqlStringPlaceholderUtility;

    @Override
    public List<Map<String, Object>> getBuildTypeStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select case when BUILD_TYPE is null then '其他' else BUILD_TYPE end NAME," +
                "count(1) VALUE from tgrid_build_info where BUILD_CATEGORY='一般建筑物' and BUILD_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by BUILD_TYPE";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }

    @Override
    public List<Map<String, Object>> getBuildCategoryStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select BUILD_CATEGORY NAME," +
                "count(1) VALUE from tgrid_build_info where BUILD_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by BUILD_CATEGORY";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }

    @Override
    public List<Map<String, Object>> getBuildPropertyStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select case when BUILD_PROPERTY='' then '其他' else BUILD_PROPERTY end NAME," +
                "count(1) VALUE from tgrid_build_info where BUILD_CATEGORY='一般建筑物' and BUILD_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by BUILD_PROPERTY";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }
}
