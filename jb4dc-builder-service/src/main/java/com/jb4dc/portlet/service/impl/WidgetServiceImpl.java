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
import java.util.List;

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
        String widgetProperties="{\n" +
                "            QuickEntries: [{\n" +
                "                name: \"事务发起\",\n" +
                "                caption: \"事务发起\",\n" +
                "                openType: \"innerIframe\",\n" +
                "                url: \"/QCSystem/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyBootableMyModels.html?menuId=QCSystem-WorkFlow-Client-Bootable\",\n" +
                "                image: \"0265.png\"\n" +
                "            }]\n" +
                "        }";
        create(jb4DCSession,"PortletDefaultQuickEntryWidgetControl",GroupServiceImpl.WidgetGroupForTemplateId,"快速入口","快速入口","PortletDefaultQuickEntryWidgetControl",widgetProperties);

        widgetProperties="{\n" +
                "            list:{\n" +
                "                getListDateRest:\"/%(appContextPath)s/Rest/Extension/Portlet/WorkflowTransform/GetMyProcessTaskListTransform\",\n" +
                "                getListDateRestParas:{\n" +
                "                    modelCategory:\"GeneralProcess\",\n" +
                "                    pageSize:12\n" +
                "                },\n" +
                "                openType:\"frameIframe\",\n" +
                "                dialogConfig:{\n" +
                "                    height: 0,\n" +
                "                    width: 0,\n" +
                "                    title: \"JB4DC\",\n" +
                "                    modal: true\n" +
                "                },\n" +
                "                fieldParsing:{\n" +
                "                    timeFormat:\"%(instanceEntity.instCreateTime)s\",\n" +
                "                    titleFormat:\"[标题]%(instanceEntity.instTitle)s-%(extaskCurNodeName)s\"\n" +
                "                },\n" +
                "                openUrlFormatRest:\"\",\n" +
                "                openUrl:\"/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyProcessInstanceMainTask.html?op=update&extaskId=%(extaskId)s\",\n" +
                "                printRowData:false\n" +
                "            },\n" +
                "            more:{\n" +
                "                openType:\"frameIframe\",\n" +
                "                dialogConfig:{\n" +
                "                    height: 0,\n" +
                "                    width: 0,\n" +
                "                    title: \"JB4DC\",\n" +
                "                    modal: true\n" +
                "                },\n" +
                "                openUrl:\"/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyProcessInstanceMainTaskList.html?menuId=QCSystem-WorkFlow-Client-MyTask\"\n" +
                "            }\n" +
                "        }";
        create(jb4DCSession,"PortletDefaultListWidgetControlForMyProcessInstanceMainTaskList",GroupServiceImpl.WidgetGroupForTemplateId,"待办事务","待办事务","PortletDefaultListWidgetControl",widgetProperties);

        widgetProperties="{\n" +
                "            list:{\n" +
                "                getListDateRest:\"/%(appContextPath)s/Rest/Extension/Portlet/WorkflowTransform/GetMyProcessEndTaskListTransform\",\n" +
                "                getListDateRestParas:{\n" +
                "                    modelCategory:\"GeneralProcess\",\n" +
                "                    pageSize:12\n" +
                "                },\n" +
                "                openType:\"frameIframe\",\n" +
                "                dialogConfig:{\n" +
                "                    height: 0,\n" +
                "                    width: 0,\n" +
                "                    title: \"JB4DC\",\n" +
                "                    modal: true\n" +
                "                },\n" +
                "                fieldParsing:{\n" +
                "                    timeFormat:\"%(instanceEntity.instCreateTime)s\",\n" +
                "                    titleFormat:\"[标题]%(instanceEntity.instTitle)s-%(extaskCurNodeName)s\"\n" +
                "                },\n" +
                "                openUrl:\"/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyEndProcessInstanceMainTask.html?op=update&extaskId=%(extaskId)s\",\n" +
                "                printRowData:false\n" +
                "            },\n" +
                "            more:{\n" +
                "                openType:\"frameIframe\",\n" +
                "                dialogConfig:{\n" +
                "                    height: 0,\n" +
                "                    width: 0,\n" +
                "                    title: \"JB4DC\",\n" +
                "                    modal: true\n" +
                "                },\n" +
                "                openUrl:\"/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyProcessInstanceMainTaskList.html?menuId=QCSystem-WorkFlow-Client-MyTask-End\"\n" +
                "            }\n" +
                "        }";
        create(jb4DCSession,"PortletDefaultListWidgetControlForMyEndProcessInstanceMainTaskList",GroupServiceImpl.WidgetGroupForTemplateId,"已办事务","已办事务","PortletDefaultListWidgetControl",widgetProperties);
    }

    @Override
    public List<WidgetEntity> getALLWithBLOBs(JB4DCSession session) {
        return widgetMapper.selectAllWithBLOBs();
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
