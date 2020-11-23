package com.jb4dc.gridsystem.api;
import java.math.BigDecimal;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.dbentities.enterprise.EnterpriseInfoEntity;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import com.jb4dc.gridsystem.service.enterprise.IEnterpriseInfoService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/15
 * To change this template use File | Settings | File Templates.
 */
public class NewEnterpriseSupplementFieldDataApi implements IApiForButton {
    @Autowired
    IEnterpriseInfoService enterpriseInfoService;

    @Autowired
    IHouseInfoService houseInfoService;

    @Override
    public ApiRunResult runApi(ApiRunPara apiRunPara) throws JBuild4DCGenerallyException {

        JB4DCSession jb4DCSession=JB4DCSessionUtility.getSession();
        EnterpriseInfoEntity enterpriseInfoEntity=enterpriseInfoService.getByPrimaryKey(jb4DCSession,apiRunPara.getRecordId());

        //验证房屋编码是否正确
        List<HouseInfoEntity> codeHouseInfoEntities=houseInfoService.getByHouseFullCode(enterpriseInfoEntity.getEntHouseCode());
        if(codeHouseInfoEntities.size()==0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"房屋编码不存在!");
        }
        HouseInfoEntity houseInfoEntity=codeHouseInfoEntities.get(0);

        if(BaseUtility.isAddOperation(apiRunPara.getOperationTypeName())){
            enterpriseInfoEntity.setEntGridId(jb4DCSession.getOrganId());
            enterpriseInfoEntity.setEntHouseId(houseInfoEntity.getHouseId());
            enterpriseInfoEntity.setEntInputUnitName(jb4DCSession.getOrganName());
            enterpriseInfoEntity.setEntInputUnitId(jb4DCSession.getOrganId());
            enterpriseInfoEntity.setEntInputDate(new Date());
            enterpriseInfoEntity.setEntInputUserName(jb4DCSession.getUserName());
            enterpriseInfoEntity.setEntInputUserId(jb4DCSession.getUserId());
            enterpriseInfoService.updateByKeySelective(jb4DCSession,enterpriseInfoEntity);
        }

        return ApiRunResult.successResult();
    }
}
