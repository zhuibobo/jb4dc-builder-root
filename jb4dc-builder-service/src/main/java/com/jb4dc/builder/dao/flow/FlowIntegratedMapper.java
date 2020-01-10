package com.jb4dc.builder.dao.flow;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
public interface FlowIntegratedMapper extends BaseMapper<FlowIntegratedEntity> {
    FlowIntegratedEntity selectByStartKey(@Param("integratedStartKey") String integratedStartKey);

    FlowIntegratedEntity selectByCode(@Param("integratedCode") String integratedCode);
}
