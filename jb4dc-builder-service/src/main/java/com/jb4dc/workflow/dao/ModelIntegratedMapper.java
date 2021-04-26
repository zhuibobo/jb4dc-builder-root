package com.jb4dc.workflow.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface ModelIntegratedMapper extends BaseMapper<ModelIntegratedEntity> {
    List<ModelIntegratedEntity> selectLastSaveModelIntegratedEntity(String ruKey);

    List<ModelIntegratedEntity> selectByModule(Map<String, Object> searchItemMap);

    List<ModelIntegratedEntity> selectAllStartEnableModel();

    List<ModelIntegratedEntity> selectStartEnableModelByRole(@Param("userId") String userId,@Param("roleKeys") List<String> roleKeys);
}
