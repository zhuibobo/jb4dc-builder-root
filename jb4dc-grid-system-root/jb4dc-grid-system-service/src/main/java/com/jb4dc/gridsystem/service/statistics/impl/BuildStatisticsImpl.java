package com.jb4dc.gridsystem.service.statistics.impl;

import com.jb4dc.builder.po.SQLStringPlaceholderResultPO;
import com.jb4dc.builder.client.utility.SQLStringPlaceholderUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.service.statistics.IBuildStatistics;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BuildStatisticsImpl extends BaseStatistics implements IBuildStatistics {

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

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

    @Override
    public List<Map<String, Object>> getBuildDesignForStatistics(JB4DCSession session, String streetValue, String communityValue, String gridValue) throws JBuild4DCGenerallyException {
        String useOrganId=calculateUseOrganId(streetValue,communityValue,gridValue);

        String sql="select case when BUILD_DESIGN_FOR='' then '其他' else BUILD_DESIGN_FOR end NAME," +
                "count(1) VALUE from tgrid_build_info where BUILD_CATEGORY='一般建筑物' and BUILD_INPUT_UNIT_ID in ('#{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}') group by BUILD_DESIGN_FOR";

        SQLStringPlaceholderResultPO sqlStringPlaceholderResultPO=sqlStringPlaceholderUtility.generalPlaceholderHandler(session.getUserId(),useOrganId,sql);

        List<Map<String, Object>> data=sqlBuilderService.selectList(sqlStringPlaceholderResultPO.getSql(),sqlStringPlaceholderResultPO.getSqlParas());
        return data;
    }

    @Override
    public List<Map<String, Object>> getStreetBuildStatistics(JB4DCSession session, String streetValue,String category) throws JBuild4DCGenerallyException {
        List<OrganEntity> organEntityList=organRuntimeRemote.getEnableChildOrganRT(streetValue).getData();

        String sql="select BUILD_COMMUNITY_ID ORGAN_ID,count(1) VALUE from tgrid_build_info where BUILD_CATEGORY='"+category+"' group by BUILD_COMMUNITY_ID";
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
