package com.jb4dc.builder.dao.systemsetting;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DictionaryMapper extends BaseMapper<DictionaryEntity> {
    List<DictionaryEntity> selectByGroupId(String groupId);

    List<DictionaryEntity> selectByParentId(String parentId);

    DictionaryEntity selectLessThanRecord(@Param("dictId") String id, @Param("dictParentId") String dictParentId);

    DictionaryEntity selectGreaterThanRecord(@Param("dictId") String id, @Param("dictParentId") String dictParentId);

    List<DictionaryEntity> selectByGroupValue(String groupValue);

    List<DictionaryEntity> selectEnableListByGroupValue(String groupValue);

    List<DictionaryEntity> selectByGroup3Level(@Param("groupId") String groupId);
}