package com.jb4dc.builder.dao.envvar;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.envvar.EnvGroupEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/29
 * To change this template use File | Settings | File Templates.
 */
public interface EnvGroupMapper extends BaseMapper<EnvGroupEntity> {
    EnvGroupEntity selectByValue(@Param("envGroupValue") String envGroupValue);
}
