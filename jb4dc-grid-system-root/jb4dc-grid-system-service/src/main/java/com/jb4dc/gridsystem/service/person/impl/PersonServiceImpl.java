package com.jb4dc.gridsystem.service.person.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.service.IFileInfoService;
import com.jb4dc.gridsystem.dao.person.PersonMapper;
import com.jb4dc.gridsystem.dbentities.person.FamilyEntity;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.service.person.IFamilyService;
import com.jb4dc.gridsystem.service.person.IPersonService;
import liquibase.pro.packaged.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sun.misc.BASE64Encoder;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;

@Service
public class PersonServiceImpl extends BaseServiceImpl<PersonEntity> implements IPersonService
{
    public static String HEAD_HOUSEHOLD_TYPE_VALUE="0";

    @Autowired
    IFamilyService familyService;

    @Autowired
    IFileInfoService fileInfoService;

    PersonMapper personMapper;
    public PersonServiceImpl(PersonMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        personMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, PersonEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<PersonEntity>() {
            @Override
            public PersonEntity run(JB4DCSession jb4DCSession,PersonEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setPersonInputDate(new Date());
                sourceEntity.setPersonInputUnitId(jb4DCSession.getOrganId());
                sourceEntity.setPersonInputUnitName(jb4DCSession.getOrganName());
                sourceEntity.setPersonInputUserId(jb4DCSession.getUserId());
                sourceEntity.setPersonInputUserName(jb4DCSession.getUserName());
                sourceEntity.setPersonOrderNum(personMapper.nextOrderNum());

                if(sourceEntity.getPersonEducation()==null){
                    sourceEntity.setPersonEducation("");
                }
                return sourceEntity;
            }
        });
    }

    @Override
    public List<PersonEntity> getByFamilyId(String familyId) {
        return personMapper.selectByFamilyId(familyId);
    }

    @Override
    public List<PersonEntity> getPersonByHouseId(JB4DCSession session, String houseId) {
        return personMapper.selectByHouseId(houseId);
    }

    @Override
    public void deletePersonWithFamily(JB4DCSession session, String personId) throws JBuild4DCGenerallyException {
        PersonEntity personEntity=getByPrimaryKey(session,personId);
        if(personEntity==null){
            return;
        }
        if(personEntity.getPersonRelationship().equals(HEAD_HOUSEHOLD_TYPE_VALUE)){
            List<PersonEntity> familyPersons=getByFamilyId(personEntity.getPersonFamilyId());
            if(familyPersons.size()>1){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"户中还存在其他成员,不允许删除户主!");
            }
            FamilyEntity familyEntity=familyService.getByPrimaryKey(session,personEntity.getPersonFamilyId());
            deleteByKey(session,personId);
            familyService.deleteByKey(session,familyEntity.getFamilyId());
        }
        else{
            deleteByKey(session,personId);
        }
    }

    @Override
    public String getPersonHeaderBase64String(JB4DCSession session, String personId) throws JBuild4DCGenerallyException, IOException, URISyntaxException {
        PersonEntity personEntity=getByPrimaryKey(session,personId);
        if(StringUtility.isNotEmpty(personEntity.getPersonPhotoId())){
            /*FileInfoEntity fileInfoEntity=fileInfoService.getByPrimaryKey(session,personEntity.getPersonPhotoId());
            String filePath=fileInfoService.buildFilePath(fileInfoEntity);
            File file = new File(filePath);
            FileInputStream fileInputStream = new FileInputStream(file);
            byte[] datas = new byte[fileInputStream.available()];
            fileInputStream.read(datas);
            fileInputStream.close();*/
            byte[] datas = fileInfoService.getContentInFileSystem(session,personEntity.getPersonPhotoId());
            BASE64Encoder encoder = new BASE64Encoder();
            return encoder.encode(datas);//返回Base64编码过的字节数组字符串
        }
        return "";
    }
}