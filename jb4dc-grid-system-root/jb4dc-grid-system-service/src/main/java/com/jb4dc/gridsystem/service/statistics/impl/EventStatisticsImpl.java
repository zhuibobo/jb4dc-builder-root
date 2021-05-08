package com.jb4dc.gridsystem.service.statistics.impl;

import com.jb4dc.builder.po.SQLStringPlaceholderResultPO;
import com.jb4dc.builder.client.utility.SQLStringPlaceholderUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.service.statistics.IEventStatistics;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EventStatisticsImpl extends BaseStatistics implements IEventStatistics {

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    @Autowired
    SQLStringPlaceholderUtility sqlStringPlaceholderUtility;

    @Override
    public List<Map<String, Object>> getStreetEventStatistics(JB4DCSession session, String streetValue) throws JBuild4DCGenerallyException {
        List<OrganEntity> organEntityList=organRuntimeRemote.getEnableChildOrganRT(streetValue).getData();

        String sql="select EVENT_COMMUNITY_ID ORGAN_ID,count(1) VALUE from TGRID_EVENT_INFO group by TGRID_EVENT_INFO.EVENT_COMMUNITY_ID";
        List<Map<String, Object>> buildData=sqlBuilderService.selectList(sql);

        List<Map<String,Object>> result=new ArrayList<>();
        for (OrganEntity organEntity : organEntityList) {
            String id=organEntity.getOrganId();
            String name=organEntity.getOrganName();
            Map<String,Object> organValue=buildData.stream().filter(data->data.get("ORGAN_ID").equals(id)).findFirst().orElse(null);
            Map<String,Object> nameValue=new HashMap<>();
            if(organValue==null){
                nameValue.put("NAME",name);
                nameValue.put("VALUE",0);
            }
            else{
                nameValue.put("NAME",name);
                nameValue.put("VALUE",organValue.get("VALUE"));
            }
            result.add(nameValue);
        }
        return result;
    }

    @Override
    public List<Map<String, Object>> getEventSourceStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select EVENT_SOURCE NAME,count(1) VALUE from TGRID_EVENT_INFO where EVENT_ACCEPT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by EVENT_SOURCE";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }

    @Override
    public List<Map<String, Object>> getEventLevelStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select EVENT_LEVEL NAME,count(1) VALUE from TGRID_EVENT_INFO where EVENT_ACCEPT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by EVENT_LEVEL";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }

    @Override
    public List<Map<String, Object>> getEventAppealPersonNumStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId = calculateUseOrganId(streetValue, communityValue, gridValue);

        String sql = "select EVENT_APPEAL_PERSON_NUM NAME,count(1) VALUE from (" +
                "select" +
                "  case" +
                "      when EVENT_APPEAL_PERSON_NUM is null then '无'" +
                "      when EVENT_APPEAL_PERSON_NUM>=1 and EVENT_APPEAL_PERSON_NUM<=5 then '1-5人'" +
                "      when EVENT_APPEAL_PERSON_NUM>5 and EVENT_APPEAL_PERSON_NUM<=10 then '6-10人'" +
                "      when EVENT_APPEAL_PERSON_NUM>10 and EVENT_APPEAL_PERSON_NUM<=20 then '11-20人'" +
                "      when EVENT_APPEAL_PERSON_NUM>20 and EVENT_APPEAL_PERSON_NUM<=30 then '21-30人'" +
                "      when EVENT_APPEAL_PERSON_NUM>30 and EVENT_APPEAL_PERSON_NUM<=40 then '31-40人'" +
                "      when EVENT_APPEAL_PERSON_NUM>40 and EVENT_APPEAL_PERSON_NUM<=50 then '41-50人'" +
                "  else '50-XX人' end EVENT_APPEAL_PERSON_NUM from TGRID_EVENT_INFO where EVENT_ACCEPT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}')) temp group by EVENT_APPEAL_PERSON_NUM";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO = sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(), useOrganId, sql);

        List<Map<String, Object>> data = sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(), sqlStringPlaceholderResultPO.getSqlParas());

        data.sort(new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                if(o1.get("NAME").toString().equals("无")) {
                    return -1;
                }
                else if(o2.get("NAME").toString().equals("无")) {
                    return 1;
                }
                else {
                    String o1StartNum = o1.get("NAME").toString().split("-")[0];
                    String o2StartNum = o2.get("NAME").toString().split("-")[0];
                    if (Integer.parseInt(o1StartNum) < Integer.parseInt(o2StartNum)) {
                        return -1;
                    }
                    return 1;
                }
                //return 0;
            }
        });
        return data;
    }
}
