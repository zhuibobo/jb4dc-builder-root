package com.jb4dc.portlet.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.portlet.dbentities.GroupEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface GroupMapper extends BaseMapper<GroupEntity> {
    List<GroupEntity> selectByGroupTypeASC(@Param("groupType") String groupType);
    //selectByPortletGroupTypeOrderByPortletGroupOrderNum
}
