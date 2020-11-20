package com.jb4dc.gridsystem.api;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import org.springframework.beans.factory.annotation.Autowired;

public class NewHouseSupplementFieldDataApi implements IApiForButton {

    @Autowired
    IHouseInfoService houseInfoService;

    @Override
    public ApiRunResult runApi(ApiRunPara apiRunPara) throws JBuild4DCGenerallyException {
        //apiRunPara.
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        if(BaseUtility.isAddOperation(apiRunPara.getOperationTypeName())){
            HouseInfoEntity houseInfoEntity=houseInfoService.getByPrimaryKey(jb4DCSession,apiRunPara.getRecordId());

            houseInfoService.updateByKeySelective(jb4DCSession,houseInfoEntity);
        }
        return ApiRunResult.successResult();
    }
}
