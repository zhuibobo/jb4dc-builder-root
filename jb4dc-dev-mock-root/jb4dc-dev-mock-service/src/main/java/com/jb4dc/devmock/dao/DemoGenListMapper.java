package com.jb4dc.devmock.dao;


import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.devmock.dbentities.DemoGenListEntity;

public interface DemoGenListMapper extends BaseMapper<DemoGenListEntity> {

    DemoGenListEntity selectLessThanRecord(String id);

    DemoGenListEntity selectGreaterThanRecord(String id);
}