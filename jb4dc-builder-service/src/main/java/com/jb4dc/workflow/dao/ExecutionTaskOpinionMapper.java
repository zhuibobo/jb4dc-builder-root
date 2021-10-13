package com.jb4dc.workflow.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.dbentities.ExecutionTaskOpinionEntity;
import org.apache.ibatis.annotations.Param;

public interface ExecutionTaskOpinionMapper extends BaseMapper<ExecutionTaskOpinionEntity> {
    int selectNextOrderNumByOpinionExtaskId(@Param("exTaskId") String exTaskId);
}
