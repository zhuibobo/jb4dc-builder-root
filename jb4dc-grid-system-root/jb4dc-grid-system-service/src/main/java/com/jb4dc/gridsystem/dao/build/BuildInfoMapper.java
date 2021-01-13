package com.jb4dc.gridsystem.dao.build;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntityWithBLOBs;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/15
 * To change this template use File | Settings | File Templates.
 */
public interface BuildInfoMapper extends BaseMapper<BuildInfoEntity> {
    List<BuildInfoEntity> selectByInputUnitId(String organId);

    List<BuildInfoEntity> selectByInputUserId(String userId);

    List<BuildInfoEntity> selectByBuildCode(String buildCode);

    List<BuildInfoEntity> selectBuildMapLocationByOrganId(@Param("organId") String organId,@Param("buildCategory") String buildCategory);
}
