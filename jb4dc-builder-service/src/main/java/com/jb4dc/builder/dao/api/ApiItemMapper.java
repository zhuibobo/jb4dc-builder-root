package com.jb4dc.builder.dao.api;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/16
 * To change this template use File | Settings | File Templates.
 */
public interface ApiItemMapper  extends BaseMapper<ApiItemEntity> {
    ApiItemEntity selectByValue(@Param("apiItemValue") String apiItemValue);

    ApiItemEntity selectByText(@Param("apiItemText") String apiItemText);

    List<ApiItemEntity> selectByGroupTypeALL(@Param("groupType") String groupType);
}
