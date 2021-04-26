package com.jb4dc.workflow.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;

import java.util.List;

public interface ModelGroupMapper extends BaseMapper<ModelGroupEntity> {
    List<ModelGroupEntity> selectByIdList(List<String> idList);
}
