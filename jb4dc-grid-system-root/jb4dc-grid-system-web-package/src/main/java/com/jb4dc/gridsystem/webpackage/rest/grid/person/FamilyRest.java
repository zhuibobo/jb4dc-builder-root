package com.jb4dc.gridsystem.webpackage.rest.grid.person;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.gridsystem.dbentities.person.FamilyEntity;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.po.FamilyPO;
import com.jb4dc.gridsystem.service.person.IFamilyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Grid/Person/Family")
public class FamilyRest extends GeneralRest<FamilyEntity> {
    @Autowired
    IFamilyService familyService;

    /*@Override
    public String getModuleName() {
        return "网格化社会管理系统-家庭管理";
    }*/

    @Override
    protected IBaseService<FamilyEntity> getBaseService() {
        return familyService;
    }

    @RequestMapping(value = "/SaveFamilyData", method = RequestMethod.POST)
    public JBuild4DCResponseVo saveFamilyData(@RequestBody FamilyPO familyPO) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        familyPO=familyService.saveFamilyData(JB4DCSessionUtility.getSession(),familyPO);
        return JBuild4DCResponseVo.opSuccess(familyPO);
    }

    @RequestMapping(value = "/GetFamilyData", method = RequestMethod.GET)
    public JBuild4DCResponseVo<FamilyPO> getFamilyData(String familyId) throws JBuild4DCGenerallyException, IOException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        FamilyPO familyPO=familyService.getFamilyData(JB4DCSessionUtility.getSession(),familyId);
        return JBuild4DCResponseVo.getDataSuccess(familyPO);
    }
}
