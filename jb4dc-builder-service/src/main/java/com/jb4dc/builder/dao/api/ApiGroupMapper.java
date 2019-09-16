package com.jb4dc.builder.dao.api;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/16
 * To change this template use File | Settings | File Templates.
 */
public interface ApiGroupMapper extends BaseMapper<ApiGroupEntity> {
    ApiGroupEntity selectByValue(@Param("apiGroupValue") String apiGroupValue);
}
