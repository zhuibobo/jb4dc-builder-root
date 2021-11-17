package com.jb4dc.portlet.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.portlet.dbentities.WidgetEntity;

import java.util.List;

public interface WidgetMapper extends BaseMapper<WidgetEntity> {
    List<WidgetEntity> selectAllWithBLOBs();
}

