package com.jb4dc.gridsystem.api;
import java.util.Date;
import java.util.List;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.dbentities.person.FamilyEntity;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import com.jb4dc.gridsystem.service.person.IFamilyService;
import com.jb4dc.gridsystem.service.person.IPersonService;
import org.springframework.beans.factory.annotation.Autowired;

public class NewFamilyPersonSupplementFieldDataApi implements IApiForButton {

    @Autowired
    IHouseInfoService houseInfoService;

    @Autowired
    IBuildInfoService buildInfoService;

    @Autowired
    IFamilyService familyService;

    @Autowired
    IPersonService personService;

    @Override
    public ApiRunResult runApi(ApiRunPara apiRunPara) throws JBuild4DCGenerallyException {
        //apiRunPara.
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();

        FamilyEntity familyEntity=familyService.getByPrimaryKey(jb4DCSession,apiRunPara.getRecordId());

        HouseInfoEntity houseInfoEntity=houseInfoService.getByPrimaryKey(jb4DCSession,familyEntity.getFamilyHouseId());
        BuildInfoEntity buildInfoEntity=buildInfoService.getByPrimaryKey(jb4DCSession,houseInfoEntity.getHouseBuildId());
        List<PersonEntity> personEntityList=personService.getByFamilyId(familyEntity.getFamilyId());

        if(personEntityList.size()==0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"必须填写户主信息!");
        }
        if(personEntityList.size()>1){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"只能有一个户主!");
        }
        //获取户主
        PersonEntity headHouseHoldPersonEntity=personEntityList.stream().filter(item->item.getPersonRelationship()!=null&&item.getPersonRelationship().equals("0")).findFirst().orElse(null);
        if(headHouseHoldPersonEntity==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"必须填写户主信息!");
        }

        for (PersonEntity personEntity : personEntityList) {
            personEntity.setPersonHouseId(familyEntity.getFamilyHouseId());
            personEntity.setPersonHouseCodeFull(familyEntity.getFamilyHouseCodeFull());
            if(StringUtility.isEmpty(personEntity.getPersonInputUnitName())) {
                personEntity.setPersonInputUnitName(jb4DCSession.getOrganName());
                personEntity.setPersonInputUnitId(jb4DCSession.getOrganId());
                personEntity.setPersonInputDate(new Date());
                personEntity.setPersonInputUserName(jb4DCSession.getUserName());
                personEntity.setPersonInputUserId(jb4DCSession.getUserId());
            }
            personEntity.setPersonCityId(buildInfoEntity.getBuildCityId());
            personEntity.setPersonAreaId(buildInfoEntity.getBuildAreaId());
            personEntity.setPersonStreetId(buildInfoEntity.getBuildStreetId());
            personEntity.setPersonCommunityId(buildInfoEntity.getBuildCommunityId());
            personEntity.setPersonGridId(buildInfoEntity.getBuildGridId());
            personEntity.setPersonCategory("中国居民");
            personEntity.setPersonHeadHouseholdId(headHouseHoldPersonEntity.getPersonId());
            personEntity.setPersonHeadHouseholdName(headHouseHoldPersonEntity.getPersonName());

            if(StringUtility.isEmpty(personEntity.getPersonName())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"姓名不能为空!");
            }

            if(StringUtility.isEmpty(personEntity.getPersonRelationship())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,personEntity.getPersonName()+"与户主关系不能为空!");
            }

            String idCard=personEntity.getPersonIdCard();
            if(idCard.length()!=18){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,personEntity.getPersonName()+"的身份证长度必须为18位!");
            }

            personService.updateByKeySelective(jb4DCSession,personEntity);
        }

        if(BaseUtility.isAddOperation(apiRunPara.getOperationTypeName())){
            familyEntity.setFamilyInputUnitName(jb4DCSession.getOrganName());
            familyEntity.setFamilyInputUnitId(jb4DCSession.getOrganId());
            familyEntity.setFamilyInputDate(new Date());
            familyEntity.setFamilyInputUserName(jb4DCSession.getUserName());
            familyEntity.setFamilyInputUserId(jb4DCSession.getUserId());
            familyEntity.setFamilyHeadHouseholdId(headHouseHoldPersonEntity.getPersonId());
            familyEntity.setFamilyHeadHouseholdName(headHouseHoldPersonEntity.getPersonName());
            familyService.updateByKeySelective(jb4DCSession,familyEntity);
        }


        return ApiRunResult.successResult();
    }
}
