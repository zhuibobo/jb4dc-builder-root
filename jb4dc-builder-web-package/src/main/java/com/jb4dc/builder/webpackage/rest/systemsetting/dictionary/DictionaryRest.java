package com.jb4dc.builder.webpackage.rest.systemsetting.dictionary;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.builder.service.systemsetting.IDictionaryService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/SystemSetting/Dict/Dictionary")
public class DictionaryRest extends GeneralRest<DictionaryEntity> {

    @Autowired
    IDictionaryService dictionaryService;

    @Override
    public String getModuleName() {
        return "数据字典";
    }

    @Override
    protected IBaseService<DictionaryEntity> getBaseService() {
        return dictionaryService;
    }

    @RequestMapping(value = "/GetEnableListDataByGroupId", method = RequestMethod.POST)
    public JBuild4DCResponseVo getEnableListDataByGroupId(String groupValue) {
        List<DictionaryEntity> dictionaryEntityList=dictionaryService.getEnableListDataByGroupValue(JB4DCSessionUtility.getSession(),groupValue);
        return JBuild4DCResponseVo.success("",dictionaryEntityList);
    }

    @RequestMapping(value = "/GetListDataByGroupId", method = RequestMethod.POST)
    public JBuild4DCResponseVo getListDataByGroupId(String groupId) {
        List<DictionaryEntity> dictionaryEntityList=dictionaryService.getListDataByGroupId(JB4DCSessionUtility.getSession(),groupId);
        return JBuild4DCResponseVo.success("",dictionaryEntityList);
    }

    @RequestMapping(value = "/SetSelected", method = RequestMethod.POST)
    public JBuild4DCResponseVo setSelected(String recordId) throws JBuild4DCGenerallyException {
        dictionaryService.setSelected(JB4DCSessionUtility.getSession(),recordId);
        return JBuild4DCResponseVo.opSuccess();
    }
}
