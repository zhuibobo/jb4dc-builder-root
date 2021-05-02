package com.jb4dc.gridsystem.service.event.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.event.EventInfoMapper;
import com.jb4dc.gridsystem.dbentities.event.EventInfoEntity;
import com.jb4dc.gridsystem.service.event.IEventInfoService;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class EventInfoServiceImpl extends BaseServiceImpl<EventInfoEntity> implements IEventInfoService
{
    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    EventInfoMapper eventInfoMapper;
    public EventInfoServiceImpl(EventInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        eventInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, EventInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<EventInfoEntity>() {
            @Override
            public EventInfoEntity run(JB4DCSession jb4DCSession,EventInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setEventAcceptDate(new Date());
                sourceEntity.setEventAcceptUnitName(jb4DCSession.getOrganName());
                sourceEntity.setEventAcceptUnitId(jb4DCSession.getOrganId());
                sourceEntity.setEventAcceptUserName(jb4DCSession.getUserName());
                sourceEntity.setEventAcceptUserId(jb4DCSession.getUserId());
                sourceEntity.setEventOrderNum(eventInfoMapper.nextOrderNum()+5);
                return sourceEntity;
            }
        });
    }

    @Override
    public boolean testCodeSingle(EventInfoEntity eventInfoEntity) throws JBuild4DCGenerallyException {
        //判断编号是否唯一
        List<EventInfoEntity> eventInfoEntityList=this.getByEventCode(eventInfoEntity.getEventCode());
        if(eventInfoEntityList.size()>1){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"事件编码不能重复!");
        }
        if(eventInfoEntityList.size()>0&&!eventInfoEntityList.get(0).getEventCode().equals(eventInfoEntity.getEventCode())){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"事件编码不能重复!");
        }
        return true;
    }

    @Override
    public List<EventInfoEntity> getByEventCode(String eventCode) {
        return eventInfoMapper.selectEventByEventCode(eventCode);
    }

    @Override
    public void saveEvent(JB4DCSession jb4DCSession, EventInfoEntity record) throws JBuild4DCGenerallyException {
        OrganEntity organEntity=organRuntimeRemote.getOrganById(jb4DCSession.getOrganId()).getData();
        if (organEntity==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"找不到组织机构信息!");
        }
        if(!organEntity.getOrganTypeValue().equals("GridUnit")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"当前功能仅限于网格员使用!");
        }

        OrganEntity parentOrganEntity=organRuntimeRemote.getOrganById(organEntity.getOrganParentId()).getData();
        if (parentOrganEntity==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"找不到父组织机构信息!");
        }

        this.testCodeSingle(record);

        record.setEventStreetId(parentOrganEntity.getOrganParentId());
        record.setEventCommunityId(organEntity.getOrganParentId());
        record.setEventGridId(organEntity.getOrganId());
        record.setEventProcessNodeName("登记");
        record.setEventProcessNodeValue("create");

        this.saveSimple(jb4DCSession,record.getEventId(),record);
    }

    @Override
    public PageInfo<EventInfoEntity> getMyEvent(JB4DCSession jb4DCSession, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<EventInfoEntity> list=eventInfoMapper.selectEventByUserInput(jb4DCSession.getUserId());
        PageInfo<EventInfoEntity> pageInfo = new PageInfo<EventInfoEntity>(list);
        return pageInfo;
    }

    @Override
    public void deleteEvent(JB4DCSession jb4DCSession,String eventId) throws JBuild4DCGenerallyException {
        EventInfoEntity eventInfoEntity=getByPrimaryKey(jb4DCSession,eventId);
        if(eventInfoEntity.getEventProcessNodeValue().equals("create")){
            deleteByKey(jb4DCSession,eventId);
        }
        else {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"当前状态不允许删除!");
        }
        //
    }

    @Override
    public List<EventInfoEntity> getEventMapLocationByOrganId(JB4DCSession jb4DCSession, String organId) throws JBuild4DCGenerallyException {
        return eventInfoMapper.getEventMapLocationByOrganId(organId);
    }
}
