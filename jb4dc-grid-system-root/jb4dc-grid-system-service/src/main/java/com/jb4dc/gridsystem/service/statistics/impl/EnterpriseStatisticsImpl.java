package com.jb4dc.gridsystem.service.statistics.impl;

import com.jb4dc.builder.client.utility.SQLStringPlaceholderUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.service.statistics.IEnterpriseStatistics;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EnterpriseStatisticsImpl  extends BaseStatistics implements IEnterpriseStatistics {

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    @Autowired
    SQLStringPlaceholderUtility sqlStringPlaceholderUtility;

    @Override
    public List<Map<String, Object>> getStreetEnterpriseStatistics(JB4DCSession session, String streetValue) throws JBuild4DCGenerallyException {
        List<OrganEntity> organEntityList=organRuntimeRemote.getEnableChildOrganRT(streetValue).getData();

        String sql="select BUILD_COMMUNITY_ID ORGAN_ID,count(1) VALUE from TGRID_ENTERPRISE_INFO" +
                "    join TGRID_HOUSE_INFO on TGRID_ENTERPRISE_INFO.ENT_HOUSE_ID=TGRID_HOUSE_INFO.HOUSE_ID" +
                "    join TGRID_BUILD_INFO on TGRID_HOUSE_INFO.HOUSE_BUILD_ID=TGRID_BUILD_INFO.BUILD_ID  group by TGRID_BUILD_INFO.BUILD_COMMUNITY_ID";
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
