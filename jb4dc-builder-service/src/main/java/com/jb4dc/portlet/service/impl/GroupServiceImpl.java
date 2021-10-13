package com.jb4dc.portlet.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.portlet.dao.GroupMapper;
import com.jb4dc.portlet.dbentities.GroupEntity;
import com.jb4dc.portlet.service.IGroupService;

public class GroupServiceImpl extends BaseServiceImpl<GroupEntity> implements IGroupService
{
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
                return sourceEntity;
            }
        });
    }
}