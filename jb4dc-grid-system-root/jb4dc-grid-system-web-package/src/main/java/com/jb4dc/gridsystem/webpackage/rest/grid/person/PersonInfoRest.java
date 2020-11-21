package com.jb4dc.gridsystem.webpackage.rest.grid.person;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.person.IPersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Grid/Person/PersonMain")
public class PersonInfoRest extends GeneralRest<PersonEntity> {

    @Autowired
    IPersonService personService;

    @Override
    public String getModuleName() {
        return "网格化社会管理系统-人口管理";
    }

    @Override
    protected IBaseService<PersonEntity> getBaseService() {
        return personService;
    }

    @RequestMapping(value = "/GetPersonByHouseId", method = RequestMethod.GET)
    public JBuild4DCResponseVo getPersonByHouseId(String houseId) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        List<PersonEntity> personEntityList=personService.getPersonByHouseId(JB4DCSessionUtility.getSession(),houseId);
        return JBuild4DCResponseVo.getDataSuccess(personEntityList);
    }

    @RequestMapping(value = "/DeletePersonWithFamily", method = RequestMethod.DELETE)
    public JBuild4DCResponseVo deletePersonWithFamily(String personId) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        personService.deletePersonWithFamily(JB4DCSessionUtility.getSession(),personId);
        return JBuild4DCResponseVo.opSuccess();
    }
}
