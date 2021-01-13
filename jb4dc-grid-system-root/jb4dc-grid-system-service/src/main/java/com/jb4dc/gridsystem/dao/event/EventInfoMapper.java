package com.jb4dc.gridsystem.dao.event;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.gridsystem.dbentities.enterprise.EnterpriseInfoEntity;
import com.jb4dc.gridsystem.dbentities.event.EventInfoEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface EventInfoMapper extends BaseMapper<EventInfoEntity> {
    List<EventInfoEntity> selectEventByUserInput(@Param("userId") String userId);

    List<EventInfoEntity> selectEventByEventCode(@Param("eventCode") String eventCode);

    List<EventInfoEntity> getEventMapLocationByOrganId(@Param("organId") String organId);
}
