package com.jb4dc.workflow.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;

import java.util.List;
import java.util.Map;

public interface ModelIntegratedMapper extends BaseMapper<ModelIntegratedEntity> {
    List<ModelIntegratedEntity> selectLastPreSaveModelIntegratedEntity(String ruKey);

    List<ModelIntegratedEntity> selectByModule(Map<String, Object> searchItemMap);
}
