package com.jb4dc.gridsystem.webpackage.rest.grid.event;
import java.math.BigDecimal;
import java.util.Date;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;

import com.jb4dc.builder.client.remote.DictionaryRuntimeRemote;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.event.EventInfoEntity;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntity;
import com.jb4dc.gridsystem.po.BuildInfoPO;
import com.jb4dc.gridsystem.po.EventPO;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.event.IEventInfoService;
import com.jb4dc.gridsystem.service.gridinfo.IGridInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
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
    DictionaryRuntimeRemote dictionaryRuntimeRemote;

    @Autowired
    IGridInfoService gridInfoService;

    @Autowired
    IEventInfoService eventInfoService;

    @RequestMapping(value = "/GetMyEventIncludeDD", method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<EventInfoEntity>> getMyEventIncludeDD(int num,int size) throws JBuild4DCGenerallyException, IOException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();

        List<DictionaryEntity> dictionaryEntities = dictionaryRuntimeRemote.getDictionaryByGroup3Level("f476d653-0606-4cb7-8189-4e5beee1bf11").getData();

        /*for (int i = 0; i < 200; i++) {
            EventInfoEntity eventInfoEntity=new EventInfoEntity();
            eventInfoEntity.setEventId(UUIDUtility.getUUID());
            eventInfoEntity.setEventCode(StringUtility.build1W5DCode(i));
            eventInfoEntity.setEventAcceptGridId("");
            eventInfoEntity.setEventAcceptMapLocation("");
            eventInfoEntity.setEventLevel("一级");
            eventInfoEntity.setEventSeverity("重大");
            eventInfoEntity.setEventAddress("大亚湾天天社区一号楼0001室");
            eventInfoEntity.setEventAppealQuestion("测试问题"+i);
            eventInfoService.saveEvent(jb4DCSession,eventInfoEntity);
        }*/

        //List<EventInfoEntity> eventInfoEntityList = new ArrayList<>();
        PageInfo<EventInfoEntity> pageInfo=eventInfoService.getMyEvent(jb4DCSession,num,size);

        JBuild4DCResponseVo<List<EventInfoEntity>> result = new JBuild4DCResponseVo<>();
        GridInfoEntity gridInfoEntity = gridInfoService.getByPrimaryKey(jb4DCSession, jb4DCSession.getOrganId());
        Map<String, Object> exData = new HashMap<>();
        exData.put("dictionaryEntities", dictionaryEntities);
        exData.put("gridInfoEntity", gridInfoEntity);
        result.setExKVData(exData);
        result.setData(pageInfo.getList());
        return result;
    }

    @RequestMapping(value = "/GetEventData", method = RequestMethod.GET)
    public JBuild4DCResponseVo<EventPO> getEventData(String eventId) throws JBuild4DCGenerallyException, IOException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        EventInfoEntity eventInfoEntity=eventInfoService.getByPrimaryKey(jb4DCSession,eventId);
        EventPO eventPO=JsonUtility.parseEntityToPO(eventInfoEntity,EventPO.class);

        JBuild4DCResponseVo<EventPO> responseVo=JBuild4DCResponseVo.getDataSuccess(eventPO);

        return responseVo;
    }

    @RequestMapping(value = "/SaveEvent", method = RequestMethod.POST)
    public JBuild4DCResponseVo saveEvent(@RequestBody EventPO eventPO) throws JBuild4DCGenerallyException, IOException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        eventInfoService.saveEvent(jb4DCSession,eventPO);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/DeleteEvent", method = RequestMethod.DELETE)
    public JBuild4DCResponseVo deleteEvent(String eventId) throws JBuild4DCGenerallyException, IOException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        eventInfoService.deleteEvent(jb4DCSession,eventId);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/GetEventMapLocation", method = RequestMethod.GET)
    public JBuild4DCResponseVo getEventMapLocation(String organId) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        List<EventInfoEntity> mapLocationList = eventInfoService.getEventMapLocationByOrganId(jb4DCSession, organId);
        return JBuild4DCResponseVo.getDataSuccess(mapLocationList);
    }
}
