package com.jb4dc.gridsystem.service.statistics.impl;

import com.jb4dc.builder.client.tools.SQLStringPlaceholderResultPO;
import com.jb4dc.builder.client.tools.SQLStringPlaceholderUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.service.statistics.IPersonStatistics;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PersonStatisticsImpl  extends BaseStatistics implements IPersonStatistics {

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

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

    @Override
    public List<Map<String, Object>> getPersonHRLocationStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select case when PERSON_HR_LOCATION='1' then '本村(居)委会'" +
                "when PERSON_HR_LOCATION='3' then '本街道其他村（居）委会' " +
                "when PERSON_HR_LOCATION='4' then '本区其街道' " +
                "when PERSON_HR_LOCATION='5' then '非本区' " +
                "when PERSON_HR_LOCATION='6' then '香港、澳门、台湾地区' " +
                "when PERSON_HR_LOCATION='6' then '国外' " +
                "when PERSON_HR_LOCATION='8' then '户口待定' end NAME," +
                "count(1) VALUE from TGRID_PERSON where PERSON_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by PERSON_HR_LOCATION";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }

    @Override
    public List<Map<String, Object>> getPersonEducationStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select case when PERSON_EDUCATION='1' then '未上过学'" +
                "when PERSON_EDUCATION='2' then '学前教育' " +
                "when PERSON_EDUCATION='3' then '小学' " +
                "when PERSON_EDUCATION='4' then '初中' " +
                "when PERSON_EDUCATION='5' then '高中' " +
                "when PERSON_EDUCATION='6' then '大学专科' " +
                "when PERSON_EDUCATION='7' then '大学本科' " +
                "when PERSON_EDUCATION='8' then '硕士研究生' " +
                "when PERSON_EDUCATION='9' then '博士研究生' " +
                "when PERSON_EDUCATION='' then '未知' end NAME," +
                "count(1) VALUE from TGRID_PERSON where PERSON_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by PERSON_EDUCATION";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());

        data.sort(new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                if(o1.get("NAME").toString().equals("未知")||o2.get("NAME").toString().equals("未知")) {
                    return 1;
                }
                return -1;
            }
        });

        return data;
    }

    @Override
    public List<Map<String, Object>> getStreetPersonStatistics(JB4DCSession session, String streetValue) throws JBuild4DCGenerallyException {
        List<OrganEntity> organEntityList=organRuntimeRemote.getEnableChildOrganRT(streetValue).getData();

        String sql="select PERSON_COMMUNITY_ID ORGAN_ID,count(1) VALUE from TGRID_PERSON group by TGRID_PERSON.PERSON_COMMUNITY_ID";
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
