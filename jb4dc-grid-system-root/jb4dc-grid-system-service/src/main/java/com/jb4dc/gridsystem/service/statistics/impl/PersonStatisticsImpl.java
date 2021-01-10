package com.jb4dc.gridsystem.service.statistics.impl;

import com.jb4dc.builder.client.tools.SQLStringPlaceholderResultPO;
import com.jb4dc.builder.client.tools.SQLStringPlaceholderUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.service.statistics.IHouseStatistics;
import com.jb4dc.gridsystem.service.statistics.IPersonStatistics;
import com.jb4dc.sso.client.proxy.IOrganRuntimeProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PersonStatisticsImpl  extends BaseStatistics implements IPersonStatistics {

    @Autowired
    IOrganRuntimeProxy organRuntimeProxy;

    @Autowired
    SQLStringPlaceholderUtility sqlStringPlaceholderUtility;

    @Override
    public List<Map<String, Object>> getPersonSexStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select case when PERSON_SEX=1 then '男' else '女' end NAME,count(1) VALUE from TGRID_PERSON where PERSON_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by PERSON_SEX";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }
}
