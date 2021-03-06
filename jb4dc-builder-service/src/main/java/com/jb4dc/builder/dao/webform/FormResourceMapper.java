package com.jb4dc.builder.dao.webform;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntityWithBLOBs;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
public interface FormResourceMapper extends BaseMapper<FormResourceEntityWithBLOBs> {
    FormResourceEntityWithBLOBs selectGreaterThanRecord(@Param("id") String id, @Param("formModuleId") String formModuleId);

    FormResourceEntityWithBLOBs selectLessThanRecord(@Param("id") String id, @Param("formModuleId") String formModuleId);

    List<FormResourceEntity> selectByModuleId(@Param("moduleId") String moduleId);
}
