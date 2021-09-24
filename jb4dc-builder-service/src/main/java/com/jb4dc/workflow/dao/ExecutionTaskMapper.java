package com.jb4dc.workflow.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.ExecutionTaskEntity;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ExecutionTaskMapper extends BaseMapper<ExecutionTaskEntity> {
    List<ExecutionTaskEntity> selectByInstanceId(@Param("instId") String instId);

    List<ExecutionTaskEntity> selectByInstanceIdAndStatus(@Param("instId") String instId,@Param("status")  String status);

    List<ExecutionTaskPO> selectMyProcessTask(@Param("userId") String userId, @Param("linkId") String linkId, @Param("modelCategory") String modelCategory, @Param("extaskType") String extaskType);

    List<ExecutionTaskPO> selectMyProcessEndTask(@Param("userId") String userId, @Param("linkId") String linkId, @Param("modelCategory") String modelCategory, @Param("extaskType") String extaskType);

    List<ExecutionTaskEntity> selectListByInstanceAndStatus(@Param("instanceIds") List<String> instanceIds,@Param("exTaskStatus") String exTaskStatus);

    void updateProcessingToCancelStatus(@Param("instanceId") String instanceId);

    int selectNextExtaskIndexByInstanceId(@Param("instanceId") String instanceId);

    List<ExecutionTaskEntity> selectProcessingTaskByInstanceIdAndFromTaskId(@Param("instanceId") String instanceId,@Param("extaskFromTaskId") String extaskFromTaskId);
}
