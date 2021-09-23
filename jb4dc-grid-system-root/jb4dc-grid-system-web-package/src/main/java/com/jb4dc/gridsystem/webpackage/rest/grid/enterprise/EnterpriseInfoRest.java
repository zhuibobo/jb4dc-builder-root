package com.jb4dc.gridsystem.webpackage.rest.grid.enterprise;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.gridsystem.dbentities.enterprise.EnterpriseInfoEntity;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.po.EnterpriseInfoPO;
import com.jb4dc.gridsystem.po.FamilyPO;
import com.jb4dc.gridsystem.service.enterprise.IEnterpriseInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Grid/Enterprise/EnterpriseMain")
public class EnterpriseInfoRest extends GeneralRest<EnterpriseInfoEntity> {

    @Autowired
    IEnterpriseInfoService enterpriseInfoService;

    @RequestMapping(value = "/GetEnterpriseByHouseId", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<EnterpriseInfoEntity>> getEnterpriseByHouseId(String houseId) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        List<EnterpriseInfoEntity> enterpriseInfoEntities=enterpriseInfoService.getEnterpriseByHouseId(JB4DCSessionUtility.getSession(),houseId);
        return JBuild4DCResponseVo.getDataSuccess(enterpriseInfoEntities);
    }

    @RequestMapping(value = "/SaveEnterpriseData", method = RequestMethod.POST)
    public JBuild4DCResponseVo<EnterpriseInfoEntity> saveEnterpriseData(@RequestBody EnterpriseInfoPO enterpriseInfoPO) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        //List<EnterpriseInfoEntity> enterpriseInfoEntities=enterpriseInfoService.getEnterpriseByHouseId(JB4DCSessionUtility.getSession(),houseId);
        EnterpriseInfoEntity saveEnterpriseData= enterpriseInfoService.saveEnterpriseData(JB4DCSessionUtility.getSession(),enterpriseInfoPO);
        return JBuild4DCResponseVo.opSuccess(saveEnterpriseData);
    }

    /*@Override
    public String getModuleName() {
        return "网格化社会管理系统-企业法人管理";
    }*/

    @Override
    protected IBaseService<EnterpriseInfoEntity> getBaseService() {
        return enterpriseInfoService;
    }
}
