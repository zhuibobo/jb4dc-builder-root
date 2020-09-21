package com.jb4dc.builder.dao.weblist;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntityWithBLOBs;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/18
 * To change this template use File | Settings | File Templates.
 */
public interface ListResourceMapper extends BaseMapper<ListResourceEntityWithBLOBs> {
    List<ListResourceEntity> selectByModuleId(@Param("moduleId") String moduleId);
}
