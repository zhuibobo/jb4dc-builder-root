package com.jb4dc.portlet.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.portlet.dao.GroupMapper;
import com.jb4dc.portlet.dbentities.GroupEntity;
import com.jb4dc.portlet.service.IGroupService;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class GroupServiceImpl extends BaseServiceImpl<GroupEntity> implements IGroupService
{
    private String rootId="0";
    private String rootParentId="-1";

    GroupMapper groupMapper;
    public GroupServiceImpl(GroupMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        groupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, GroupEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<GroupEntity>() {
            @Override
            public GroupEntity run(JB4DCSession jb4DCSession,GroupEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setPortletGroupCreateTime(new Date());
                sourceEntity.setPortletGroupOrderNum(groupMapper.nextOrderNum());

                if(StringUtility.isEmpty(record.getPortletGroupType())){
                    GroupEntity parentGroup=getByPrimaryKey(jb4DCSession,record.getPortletGroupParentId());
                    record.setPortletGroupType(parentGroup.getPortletGroupType());
                }

                return sourceEntity;
            }
        });
    }

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        //ApiGroupEntity rootGroupEntity = create(jb4DCSession, rootId, rootParentId, "API根分组", "API根分组", "0");
        GroupEntity rootGroupEntity = create(jb4DCSession, rootId,"Group", rootParentId, "根分组", "根分组");

        GroupEntity WidgetGroup0 = create(jb4DCSession, "WidgetGroup0", "WidgetGroup",rootGroupEntity.getPortletGroupId(), "Widget分组", "Widget分组");

        create(jb4DCSession, "WidgetGroup1", "WidgetGroup",WidgetGroup0.getPortletGroupId(), "服务运维Widget", "服务运维Widget");
        create(jb4DCSession, "WidgetGroup2", "WidgetGroup",WidgetGroup0.getPortletGroupId(), "协同办公Widget", "协同办公Widget");


        GroupEntity PageGroup0 = create(jb4DCSession, "PageGroup0", "PageGroup",rootGroupEntity.getPortletGroupId(), "模板页面分组", "模板页面分组");

        create(jb4DCSession, "PageGroup1", "PageGroup",PageGroup0.getPortletGroupId(), "服务运维模板页面", "服务运维模板页面");
        create(jb4DCSession, "PageGroup2", "PageGroup",PageGroup0.getPortletGroupId(), "协同办公模板页面", "协同办公模板页面");
    }

    @Override
    public List<GroupEntity> getByGroupTypeASC(JB4DCSession session, String groupType) {
        return groupMapper.selectByGroupTypeASC(groupType);
    }

    private GroupEntity create(JB4DCSession jb4DCSession,String groupId,String groupType,String parentId,String text,String value) throws JBuild4DCGenerallyException {
        GroupEntity rootEntity=new GroupEntity();
        rootEntity.setPortletGroupId(groupId);
        rootEntity.setPortletGroupType(groupType);
        rootEntity.setPortletGroupValue(value);
        rootEntity.setPortletGroupText(text);
        //rootEntity.setPortletGroupOrderNum();
        //rootEntity.setPortletGroupCreateTime();
        rootEntity.setPortletGroupDesc("");
        rootEntity.setPortletGroupStatus(EnableTypeEnum.enable.getDisplayName());
        rootEntity.setPortletGroupParentId(parentId);
        rootEntity.setPortletGroupDelEnable(TrueFalseEnum.False.getDisplayName());

        this.saveSimple(jb4DCSession,rootEntity.getPortletGroupId(),rootEntity);
        return rootEntity;
    }

    @Override
    public int deleteByKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        GroupEntity groupEntity=getByPrimaryKey(jb4DCSession,id);
        if(groupEntity.getPortletGroupDelEnable().equals("否")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PORTLET_CODE,"不允许删除!");
        }
        return super.deleteByKey(jb4DCSession, id);
    }
}