package com.jb4dc.portlet.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.portlet.dao.WidgetMapper;
import com.jb4dc.portlet.dbentities.GroupEntity;
import com.jb4dc.portlet.dbentities.WidgetEntity;
import com.jb4dc.portlet.service.IWidgetService;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class WidgetServiceImpl extends BaseServiceImpl<WidgetEntity> implements IWidgetService
{
    WidgetMapper widgetMapper;
    public WidgetServiceImpl(WidgetMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        widgetMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, WidgetEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<WidgetEntity>() {
            @Override
            public WidgetEntity run(JB4DCSession jb4DCSession,WidgetEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setWidgetUpdateTime(new Date());
                sourceEntity.setWidgetUpdater(jb4DCSession.getUserName());
                sourceEntity.setWidgetOrderNum(widgetMapper.nextOrderNum());
                return sourceEntity;
            }
        });
    }

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        create(jb4DCSession,"WidgetQuickEntry",GroupServiceImpl.WidgetGroupForGeneralId,"快速入口","快速入口","PortletDefaultQuickEntryWidgetControl","{\"Desc\":\"Widget相关属性\"}");
    }

    private WidgetEntity create(JB4DCSession jb4DCSession,String widgetId,String groupId,String widgetTitle,String widgetName,String widgetClientRender,String widgetProperties) throws JBuild4DCGenerallyException {
        WidgetEntity widgetEntity=new WidgetEntity();
        widgetEntity.setWidgetId(widgetId);
        widgetEntity.setWidgetGroupId(groupId);
        widgetEntity.setWidgetTitle(widgetTitle);
        widgetEntity.setWidgetName(widgetName);
        widgetEntity.setWidgetDesc("");
        widgetEntity.setWidgetClientRender(widgetClientRender);
        widgetEntity.setWidgetBefRender("");
        widgetEntity.setWidgetAftRender("");
        widgetEntity.setWidgetStatus(EnableTypeEnum.enable.getDisplayName());
        widgetEntity.setWidgetProperties(widgetProperties);

        this.saveSimple(jb4DCSession,widgetEntity.getWidgetId(),widgetEntity);
        return widgetEntity;
    }
}
