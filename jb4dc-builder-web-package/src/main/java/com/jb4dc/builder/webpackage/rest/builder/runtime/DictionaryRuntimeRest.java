package com.jb4dc.builder.webpackage.rest.builder.runtime;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.builder.service.systemsetting.IDictionaryService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/25
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/DictionaryRuntime")
public class DictionaryRuntimeRest {

    @Autowired
    IDictionaryService dictionaryService;

    @RequestMapping(value = "/GetDDByGroupId", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<DictionaryEntity>> getDDByGroupId(String groupId) {
        List<DictionaryEntity> dictionaryEntityList=dictionaryService.getListDataByGroupId(JB4DCSessionUtility.getSessionNotException(),groupId);
        return JBuild4DCResponseVo.success("",dictionaryEntityList);
    }

    @RequestMapping(value = "/GetAllDictionary", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<DictionaryEntity>> getAllDictionary() {
        List<DictionaryEntity> dictionaryEntityList=dictionaryService.getALLASC(JB4DCSessionUtility.getSessionNotException());
        return JBuild4DCResponseVo.success("",dictionaryEntityList);
    }

    @RequestMapping(value = "/GetDictionaryByGroup3Level", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<DictionaryEntity>> getDictionaryByGroup3Level(String groupId) {
        List<DictionaryEntity> dictionaryEntityList=dictionaryService.getDictionaryByGroup3Level(groupId);
        return JBuild4DCResponseVo.success("",dictionaryEntityList);
    }

    @RequestMapping(value = "/GetAllDictionaryMinMapJsonProp", method = RequestMethod.GET)
    public JBuild4DCResponseVo<Map<String, Map<String,Object>>> getAllDictionaryMinMapJsonProp() {
        Map<String, Map<String,Object>> allDictionaryMinMapJsonProp=dictionaryService.getAllDictionaryMinMapJsonProp();
        return JBuild4DCResponseVo.success("",allDictionaryMinMapJsonProp);
    }
}
