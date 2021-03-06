package com.jb4dc.builder.dao.envvar;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/29
 * To change this template use File | Settings | File Templates.
 */
public interface EnvVariableMapper extends BaseMapper<EnvVariableEntity> {
    EnvVariableEntity selectByValue(@Param("envVarValue") String envVarValue);

    EnvVariableEntity selectByText(@Param("envVarText") String envVarText);

    List<EnvVariableEntity> selectByGroupId(@Param("groupId") String groupId);
}
