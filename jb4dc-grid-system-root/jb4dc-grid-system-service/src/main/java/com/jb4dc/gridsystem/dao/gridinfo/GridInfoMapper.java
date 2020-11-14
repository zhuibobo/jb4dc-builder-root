package com.jb4dc.gridsystem.dao.gridinfo;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntityWithBLOBs;
import com.jb4dc.sso.dbentities.authority.AuthorityEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/14
 * To change this template use File | Settings | File Templates.
 */
public interface GridInfoMapper extends BaseMapper<GridInfoEntityWithBLOBs> {
    List<GridInfoEntityWithBLOBs> selectByParentId(@Param("parentId") String parentId,@Param("excludeId") String excludeId);
}
