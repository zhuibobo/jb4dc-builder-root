package com.jb4dc.workflow.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.workflow.dbentities.InstanceEntity;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface InstanceFileMapper extends BaseMapper<InstanceFileEntity> {
    List<InstanceFileEntity> selectAttachmentByInstanceId(@Param("instanceId") String instanceId);
}
