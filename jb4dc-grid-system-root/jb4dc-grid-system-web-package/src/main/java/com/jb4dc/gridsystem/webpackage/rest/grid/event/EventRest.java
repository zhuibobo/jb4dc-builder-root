package com.jb4dc.gridsystem.webpackage.rest.grid.event;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.proxy.IDictionaryRuntimeProxy;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.event.EventInfoEntity;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntity;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.gridinfo.IGridInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Grid/Event/EventMain")
public class EventRest {

    @Autowired
    IBuildInfoService buildInfoService;

    @Autowired
    IDictionaryRuntimeProxy dictionaryRuntimeProxy;

    @Autowired
    IGridInfoService gridInfoService;

    @RequestMapping(value = "/GetMyEventIncludeDD", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<EventInfoEntity>> getMyEventIncludeDD() throws JBuild4DCGenerallyException, IOException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();

        List<DictionaryEntity> dictionaryEntities=dictionaryRuntimeProxy.getDictionaryByGroup3Level("f476d653-0606-4cb7-8189-4e5beee1bf11");

        GridInfoEntity gridInfoEntity=gridInfoService.getByPrimaryKey(jb4DCSession,jb4DCSession.getOrganId());
        List<EventInfoEntity> eventInfoEntityList=new ArrayList<>();
        JBuild4DCResponseVo<List<EventInfoEntity>> result=new JBuild4DCResponseVo<>();
        Map<String,Object> exData=new HashMap<>();
        exData.put("dictionaryEntities",dictionaryEntities);
        exData.put("gridInfoEntity",gridInfoEntity);
        result.setExKVData(exData);
        result.setData(eventInfoEntityList);
        return result;
    }

}
