package com.jb4dc.workflow.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;

import java.util.List;

public interface ModelGroupRefMapper extends BaseMapper<ModelGroupRefEntity> {
    void deleteRefByModelKey(String key);

    List<ModelGroupRefEntity> selectByModelKeyList(List<String> modelIdList);
}
