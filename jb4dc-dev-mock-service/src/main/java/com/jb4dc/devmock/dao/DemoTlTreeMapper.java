package com.jb4dc.devmock.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.devmock.dbentities.DemoTlTreeEntity;
import org.apache.ibatis.annotations.Param;

public interface DemoTlTreeMapper extends BaseMapper<DemoTlTreeEntity> {

    DemoTlTreeEntity selectLessThanRecord(@Param("id") String id, @Param("parentId") String ddttParentId);

    DemoTlTreeEntity selectGreaterThanRecord(@Param("id") String id, @Param("parentId") String ddttParentId);
}