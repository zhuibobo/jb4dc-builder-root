package com.jb4dc.gridsystem.api;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

public class NewHouseSupplementFieldDataApi implements IApiForButton {

    @Autowired
    IHouseInfoService houseInfoService;

    @Autowired
    IBuildInfoService buildInfoService;

    @Override
    public ApiRunResult runApi(ApiRunPara apiRunPara) throws JBuild4DCGenerallyException {
        //apiRunPara.
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        HouseInfoEntity houseInfoEntity=houseInfoService.getByPrimaryKey(jb4DCSession,apiRunPara.getRecordId());
        BuildInfoEntity buildInfoEntity=buildInfoService.getByPrimaryKey(jb4DCSession,houseInfoEntity.getHouseBuildId());
        if(buildInfoEntity==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"找不到关联的房屋信息!");
        }

        if(BaseUtility.isAddOperation(apiRunPara.getOperationTypeName())){
            houseInfoEntity.setHouseCodeFull(buildInfoEntity.getBuildCode()+houseInfoEntity.getHouseCode());
            houseInfoEntity.setHouseInputUnitName(jb4DCSession.getOrganName());
            houseInfoEntity.setHouseInputUnitId(jb4DCSession.getOrganId());
            houseInfoEntity.setHouseInputDate(new Date());
            houseInfoEntity.setHouseInputUserName(jb4DCSession.getUserName());
            houseInfoEntity.setHouseInputUserId(jb4DCSession.getUserId());

            houseInfoService.updateByKeySelective(jb4DCSession,houseInfoEntity);
        }
        else{
            houseInfoEntity.setHouseCodeFull(buildInfoEntity.getBuildCode()+houseInfoEntity.getHouseCode());
            houseInfoService.updateByKeySelective(jb4DCSession,houseInfoEntity);
        }
        //判断编号是否唯一
        List<HouseInfoEntity> codeHouseInfoEntities=houseInfoService.getByHouseFullCode(houseInfoEntity.getHouseCodeFull());
        if(codeHouseInfoEntities.size()>1){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"房屋编码不能重复!");
        }
        if(!codeHouseInfoEntities.get(0).getHouseId().equals(houseInfoEntity.getHouseId())){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"房屋编码不能重复!");
        }

        return ApiRunResult.successResult();
    }
}
