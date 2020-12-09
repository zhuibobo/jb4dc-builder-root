package com.jb4dc.gridsystem.service.build.impl;
import java.math.BigDecimal;
import java.util.Date;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.gridsystem.dao.build.HouseRelevanterMapper;
import com.jb4dc.gridsystem.dbentities.build.HouseRelevanterEntity;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.po.HouseRelevanterPO;
import com.jb4dc.gridsystem.service.build.IHouseRelevanterService;
import org.springframework.stereotype.Service;
import sun.misc.BASE64Encoder;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@Service
public class HouseRelevanterServiceImpl extends BaseServiceImpl<HouseRelevanterEntity> implements IHouseRelevanterService
{
    HouseRelevanterMapper houseRelevanterMapper;
    public HouseRelevanterServiceImpl(HouseRelevanterMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        houseRelevanterMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, HouseRelevanterEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<HouseRelevanterEntity>() {
            @Override
            public HouseRelevanterEntity run(JB4DCSession jb4DCSession,HouseRelevanterEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setReterOrderNum(houseRelevanterMapper.nextOrderNum()+5);
                return sourceEntity;
            }
        });
    }

    @Override
    public List<HouseRelevanterEntity> getRelevanterByHouseId(JB4DCSession session, String houseId) {
        //List<HouseRelevanterPO> houseRelevanterPOList=new ArrayList<>();
        List<HouseRelevanterEntity> houseRelevanterEntityList=houseRelevanterMapper.selectByHouseId(houseId);
        /*for (HouseRelevanterEntity houseRelevanterEntity : houseRelevanterEntityList) {
            String photoId=houseRelevanterEntity.getReterPhotoId();
            String imageBase64String="";
            if(StringUtility.isNotEmpty(photoId)){
                File
            }
        }*/
        return houseRelevanterEntityList;
    }

    /*@Override
    public String getPersonHeaderBase64String(JB4DCSession session, String personId) throws JBuild4DCGenerallyException, IOException, URISyntaxException {
        PersonEntity personEntity=getByPrimaryKey(session,personId);
        if(StringUtility.isNotEmpty(personEntity.getPersonPhotoId())){
            *//*FileInfoEntity fileInfoEntity=fileInfoService.getByPrimaryKey(session,personEntity.getPersonPhotoId());
            String filePath=fileInfoService.buildFilePath(fileInfoEntity);
            File file = new File(filePath);
            FileInputStream fileInputStream = new FileInputStream(file);
            byte[] datas = new byte[fileInputStream.available()];
            fileInputStream.read(datas);
            fileInputStream.close();*//*
            byte[] datas = fileInfoService.getContentInFileSystem(session,personEntity.getPersonPhotoId());
            BASE64Encoder encoder = new BASE64Encoder();
            return encoder.encode(datas);//返回Base64编码过的字节数组字符串
        }
        return "";
    }*/
}