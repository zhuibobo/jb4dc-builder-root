package com.jb4dc.portlet.service;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.portlet.dbentities.GroupEntity;

import java.util.List;

public interface IGroupService  extends IBaseService<GroupEntity> {

    void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;

    List<GroupEntity> getByGroupTypeASC(JB4DCSession session,String groupType);
}
