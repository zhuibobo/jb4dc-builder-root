package com.jb4dc.workflow.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ExecutionTaskMapper extends BaseMapper<ExecutionTaskEntity> {
    List<ExecutionTaskEntity> selectByInstanceId(String instId);

    List<ExecutionTaskPO> selectMyProcessTask(@Param("userId") String userId, @Param("linkId") String linkId, @Param("modelCategory") String modelCategory, @Param("extaskType") String extaskType);

}
