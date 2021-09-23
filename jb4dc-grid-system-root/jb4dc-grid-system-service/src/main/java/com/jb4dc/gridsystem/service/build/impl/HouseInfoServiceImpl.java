package com.jb4dc.gridsystem.service.build.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.po.SimpleFilePathPO;
import com.jb4dc.files.service.IFileInfoService;
import com.jb4dc.gridsystem.dao.build.HouseInfoMapper;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.po.HouseInfoPO;
import com.jb4dc.gridsystem.po.HouseRelevanterPO;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import com.jb4dc.gridsystem.service.build.IHouseRelevanterService;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sun.misc.BASE64Decoder;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;

@Service
public class HouseInfoServiceImpl extends BaseServiceImpl<HouseInfoEntity> implements IHouseInfoService
{
    HouseInfoMapper houseInfoMapper;

    @Autowired
    IBuildInfoService buildInfoService;

    @Autowired
    IFileInfoService fileInfoService;

    @Autowired
    IHouseRelevanterService houseRelevanterService;

    public HouseInfoServiceImpl(HouseInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        houseInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, HouseInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<HouseInfoEntity>() {
            @Override
            public HouseInfoEntity run(JB4DCSession jb4DCSession,HouseInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setHouseOrderNum(houseInfoMapper.nextOrderNum()+5);
                sourceEntity.setHouseInputUnitName(jb4DCSession.getOrganName());
                sourceEntity.setHouseInputUnitId(jb4DCSession.getOrganId());
                sourceEntity.setHouseInputDate(new Date());
                sourceEntity.setHouseInputUserName(jb4DCSession.getUserName());
                sourceEntity.setHouseInputUserId(jb4DCSession.getUserId());
                return sourceEntity;
            }
        });
    }

    @Override
    public boolean testCodeSingle(HouseInfoEntity houseInfoEntity) throws JBuild4DCGenerallyException {
        //判断编号是否唯一
        List<HouseInfoEntity> codeHouseInfoEntities=this.getByHouseFullCode(houseInfoEntity.getHouseCodeFull());
        if(codeHouseInfoEntities.size()>1){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"房屋编码不能重复!");
        }
        if(codeHouseInfoEntities.size()>0&&!codeHouseInfoEntities.get(0).getHouseId().equals(houseInfoEntity.getHouseId())){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"房屋编码不能重复!");
        }
        return true;
    }

    @Override
    public List<HouseInfoEntity> getHouseByBuildId(JB4DCSession session, String buildId) {
        return houseInfoMapper.selectByBuildId(buildId);
    }

    @Override
    public List<HouseInfoEntity> getByHouseFullCode(String houseCodeFull) {
        return houseInfoMapper.selectByHouseFullCode(houseCodeFull);
    }

    @Override
    @Transactional(rollbackFor= {JBuild4DCGenerallyException.class, JBuild4DCSQLKeyWordException.class})
    public HouseInfoPO saveHouseData(JB4DCSession session, HouseInfoPO houseInfoPO) throws JBuild4DCGenerallyException {
        try {
            HouseInfoEntity houseInfoEntity = houseInfoPO.getEditHouseData();

            if (houseInfoEntity.getHouseCode().length() != 5) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, "房屋编码必须为5位!");
            }

            if (StringUtility.isEmpty(houseInfoEntity.getHouseBuildId())) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, "无法确认建筑物ID!");
            }

            BuildInfoEntity buildInfoEntity = buildInfoService.getByPrimaryKey(session, houseInfoEntity.getHouseBuildId());
            if (buildInfoEntity == null) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, "找不到具体的建筑物信息!");
            }

            houseInfoEntity.setHouseCodeFull(buildInfoEntity.getBuildCode() + houseInfoEntity.getHouseCode());

            this.testCodeSingle(houseInfoEntity);

            this.saveSimple(session,houseInfoEntity.getHouseId(),houseInfoEntity);

            for (HouseRelevanterPO editRelevanterPerson : houseInfoPO.getEditRelevanterPersons()) {
                //editRelevanterPerson.setReterHeaderImageBase64();
                editRelevanterPerson.setReterHouseId(houseInfoEntity.getHouseId());

                if (StringUtility.isNotEmpty(editRelevanterPerson.getReterHeaderImageBase64())) {
                    BASE64Decoder decoder = new BASE64Decoder();
                    byte[] byteData = decoder.decodeBuffer(editRelevanterPerson.getReterHeaderImageBase64());
                    FileInfoEntity fileInfoEntity = fileInfoService.addFileToFileSystem(session, UUIDUtility.getUUID(),"房屋相关人员照片.jpg", byteData,byteData.length, editRelevanterPerson.getReterId(), editRelevanterPerson.getReterName(), "房屋相关人员", "房屋相关人员照片",true);

                    String sourcePath = fileInfoService.buildFilePath(fileInfoEntity);
                    SimpleFilePathPO simpleFilePathPO = fileInfoService.buildSavePath("houseRelevanter", editRelevanterPerson.getReterId(), editRelevanterPerson.getReterCertCode() + "-HeadPhone.jpg");
                    File sourceFile = new File(sourcePath);
                    File newFile = new File(simpleFilePathPO.getFullFileStorePath());
                    FileUtils.copyFile(sourceFile, newFile);

                    editRelevanterPerson.setReterPhotoId(fileInfoEntity.getFileId());
                }

                houseRelevanterService.saveSimple(session,editRelevanterPerson.getReterId(),editRelevanterPerson);
            }

            return houseInfoPO;
        } catch (Exception ex) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, ex.getMessage());
        }
    }
}