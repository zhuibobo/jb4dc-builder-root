package com.jb4dc.gridsystem.service.person.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.po.SimpleFilePathPO;
import com.jb4dc.files.service.IFileInfoService;
import com.jb4dc.gridsystem.dao.person.FamilyMapper;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.dbentities.person.FamilyEntity;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.po.FamilyPO;
import com.jb4dc.gridsystem.po.PersonPO;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import com.jb4dc.gridsystem.service.person.IFamilyService;
import com.jb4dc.gridsystem.service.person.IPersonService;
import liquibase.pro.packaged.A;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sun.misc.BASE64Decoder;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class FamilyServiceImpl extends BaseServiceImpl<FamilyEntity> implements IFamilyService
{
    @Autowired
    IHouseInfoService houseInfoService;

    @Autowired
    IBuildInfoService buildInfoService;

    @Autowired
    IPersonService personService;

    @Autowired
    IFileInfoService fileInfoService;

    FamilyMapper familyMapper;
    public FamilyServiceImpl(FamilyMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        familyMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, FamilyEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<FamilyEntity>() {
            @Override
            public FamilyEntity run(JB4DCSession jb4DCSession,FamilyEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()

                sourceEntity.setFamilyInputDate(new Date());
                sourceEntity.setFamilyInputUnitId(jb4DCSession.getOrganId());
                sourceEntity.setFamilyInputUnitName(jb4DCSession.getOrganName());
                sourceEntity.setFamilyInputUserId(jb4DCSession.getUserId());
                sourceEntity.setFamilyInputUserName(jb4DCSession.getUserName());
                return sourceEntity;
            }
        });
    }

    @Override
    @Transactional(rollbackFor= {JBuild4DCGenerallyException.class, JBuild4DCSQLKeyWordException.class})
    public FamilyPO saveFamilyData(JB4DCSession session, FamilyPO familyPO) throws JBuild4DCGenerallyException {
        try {

            if (StringUtility.isEmpty(familyPO.getEditFamilyInfo().getFamilyHouseId())) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, "房屋ID不能为空!");
            }

            HouseInfoEntity houseInfoEntity = houseInfoService.getByPrimaryKey(session, familyPO.getEditFamilyInfo().getFamilyHouseId());
            BuildInfoEntity buildInfoEntity=buildInfoService.getByPrimaryKey(session,houseInfoEntity.getHouseBuildId());

            //获取户主相关信息
            if(familyPO.getFamilyPersons().size()==0){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"必须填写户主信息!");
            }
            if(familyPO.getFamilyPersons().size()>1){
                if(familyPO.getFamilyPersons().stream().filter(item->item.getPersonRelationship()!=null&&item.getPersonRelationship().equals("0")).count()>1) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, "只能有一个户主!");
                }
            }
            //获取户主
            PersonEntity headHouseHoldPersonEntity=familyPO.getFamilyPersons().stream().filter(item->item.getPersonRelationship()!=null&&item.getPersonRelationship().equals("0")).findFirst().orElse(null);
            if(headHouseHoldPersonEntity==null){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"必须填写户主信息!");
            }

            //保存家庭信息
            FamilyEntity familyEntity=familyPO.getEditFamilyInfo();

            //if(familyMapper.selectByPrimaryKey(familyEntity.getFamilyId())==null) {
                familyEntity.setFamilyHouseCodeFull(houseInfoEntity.getHouseCodeFull());
                familyEntity.setFamilyCityId(buildInfoEntity.getBuildCityId());
                familyEntity.setFamilyAreaId(buildInfoEntity.getBuildAreaId());
                familyEntity.setFamilyStreetId(buildInfoEntity.getBuildStreetId());
                familyEntity.setFamilyCommunityId(buildInfoEntity.getBuildCommunityId());
                familyEntity.setFamilyGridId(buildInfoEntity.getBuildGridId());
                familyEntity.setFamilyHeadHouseholdName(headHouseHoldPersonEntity.getPersonName());
                familyEntity.setFamilyHeadHouseholdId(headHouseHoldPersonEntity.getPersonId());
            //}

            this.saveSimple(session, familyPO.getEditFamilyInfo().getFamilyId(), familyPO.getEditFamilyInfo());

            //保存人员信息
            if(familyPO.getFamilyPersons()!=null){
                for (PersonPO familyPerson : familyPO.getFamilyPersons()) {
                    familyPerson.setPersonCityId(buildInfoEntity.getBuildCityId());
                    familyPerson.setPersonAreaId(buildInfoEntity.getBuildAreaId());
                    familyPerson.setPersonStreetId(buildInfoEntity.getBuildStreetId());
                    familyPerson.setPersonCommunityId(buildInfoEntity.getBuildCommunityId());
                    familyPerson.setPersonGridId(buildInfoEntity.getBuildGridId());
                    familyPerson.setPersonCategory("中国居民");
                    familyPerson.setPersonFamilyId(familyEntity.getFamilyId());
                    familyPerson.setPersonHouseCodeFull(houseInfoEntity.getHouseCodeFull());
                    familyPerson.setPersonHeadHouseholdName(headHouseHoldPersonEntity.getPersonName());
                    familyPerson.setPersonHeadHouseholdId(headHouseHoldPersonEntity.getPersonId());
                    familyPerson.setPersonHouseId(houseInfoEntity.getHouseId());

                    if(StringUtility.isNotEmpty(familyPerson.getPersonHeaderImageBase64())){
                        BASE64Decoder decoder = new BASE64Decoder();
                        byte[] byteData = decoder.decodeBuffer(familyPerson.getPersonHeaderImageBase64());
                        FileInfoEntity fileInfoEntity=fileInfoService.addFileToFileSystem(session, UUIDUtility.getUUID(),"人口照片.jpg",byteData,byteData.length,familyPerson.getPersonId(),familyPerson.getPersonName(),"人口","人口照片",true);

                        String sourcePath=fileInfoService.buildFilePath(fileInfoEntity);
                        SimpleFilePathPO simpleFilePathPO=fileInfoService.buildSavePath("person",familyPerson.getPersonId(),familyPerson.getPersonIdCard()+"-HeadPhone.jpg");
                        File sourceFile = new File(sourcePath);
                        File newFile=new File(simpleFilePathPO.getFullFileStorePath());
                        FileUtils.copyFile(sourceFile,newFile);

                        familyPerson.setPersonPhotoId(fileInfoEntity.getFileId());
                    }
                    //保存照片
                    //byte[] bytes=new byte[];
                    //fileInfoService.addFileToFileSystem(session,"人口照片.png",)

                    personService.saveSimple(session,familyPerson.getPersonId(),familyPerson);
                }
            }

            return familyPO;
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, "保存户信息失败!--中断测试--");
            //return null;
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, ex.getMessage());
        }
    }

    @Override
    public FamilyPO getFamilyData(JB4DCSession session, String familyId) throws IOException {
        FamilyEntity familyEntity=familyMapper.selectByPrimaryKey(familyId);
        List<PersonEntity> familyPersonList=personService.getByFamilyId(familyId);
        FamilyPO familyPO=new FamilyPO();
        familyPO.setEditFamilyInfo(familyEntity);

        String personJson= JsonUtility.toObjectString(familyPersonList);

        List<PersonPO> familyPersonPOList=JsonUtility.toObjectList(personJson,PersonPO.class);
        familyPO.setFamilyPersons(familyPersonPOList);
        return familyPO;
    }
}