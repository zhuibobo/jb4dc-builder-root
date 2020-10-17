package com.jb4dc.qcsystem.dao.issues;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.qcsystem.dbentities.issues.IssuesEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/10/17
 * To change this template use File | Settings | File Templates.
 */
public interface IssuesMapper extends BaseMapper<IssuesEntity> {
    String selectMaxNumByProjectId(String issProjectId);

    void updateNumByPrimaryKey(@Param("issNum") String code, @Param("issId") String id);
}
