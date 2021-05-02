package com.jb4dc.gridsystem.service.statistics.impl;

import com.jb4dc.builder.client.tools.SQLStringPlaceholderResultPO;
import com.jb4dc.builder.client.tools.SQLStringPlaceholderUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.service.statistics.IHouseStatistics;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HouseStatisticsImpl extends BaseStatistics implements IHouseStatistics {

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    @Autowired
    SQLStringPlaceholderUtility sqlStringPlaceholderUtility;

    @Override
    public List<Map<String, Object>> getHouseRentalStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {

        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select HOUSE_IS_RENTAL_HOUSING NAME,count(1) VALUE from TGRID_HOUSE_INFO where HOUSE_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by HOUSE_IS_RENTAL_HOUSING";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }

    @Override
    public List<Map<String, Object>> getHouseDesignForStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select HOUSE_DESIGN_FOR NAME,count(1) VALUE from TGRID_HOUSE_INFO where HOUSE_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by HOUSE_DESIGN_FOR";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }

    @Override
    public List<Map<String, Object>> getHouseUseForStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select HOUSE_USE_FOR NAME,count(1) VALUE from TGRID_HOUSE_INFO where HOUSE_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by HOUSE_USE_FOR";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }

    @Override
    public List<Map<String, Object>> getHouseUseAreaForStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId = calculateUseOrganId(streetValue, communityValue, gridValue);

        String sql = "select HOUSE_USE_AREA NAME,count(1) VALUE from (" +
                "select" +
                "  case" +
                "      when HOUSE_USE_AREA<=60 then '0-60'" +
                "      when HOUSE_USE_AREA>60 and HOUSE_USE_AREA<=80 then '60-80'" +
                "      when HOUSE_USE_AREA>80 and HOUSE_USE_AREA<=100 then '80-100'" +
                "      when HOUSE_USE_AREA>100 and HOUSE_USE_AREA<=150 then '100-150'" +
                "      when HOUSE_USE_AREA>150 and HOUSE_USE_AREA<=200 then '100-150'" +
                "  else '>150' end HOUSE_USE_AREA from TGRID_HOUSE_INFO where HOUSE_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}')) temp group by HOUSE_USE_AREA";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO = sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(), useOrganId, sql);

        List<Map<String, Object>> data = sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(), sqlStringPlaceholderResultPO.getSqlParas());

        data.sort(new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                if(o1.get("NAME").toString().equals(">150")) {
                    return 1;
                }
                else if(o2.get("NAME").toString().equals(">150")) {
                    return -1;
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

    @Override
    public List<Map<String, Object>> getStreetHouseStatistics(JB4DCSession session, String streetValue) throws JBuild4DCGenerallyException {
        List<OrganEntity> organEntityList=organRuntimeRemote.getEnableChildOrganRT(streetValue).getData();

        String sql="select BUILD_COMMUNITY_ID ORGAN_ID,count(1) VALUE from TGRID_HOUSE_INFO join TGRID_BUILD_INFO on TGRID_HOUSE_INFO.HOUSE_BUILD_ID=TGRID_BUILD_INFO.BUILD_ID group by TGRID_BUILD_INFO.BUILD_COMMUNITY_ID";
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
}
