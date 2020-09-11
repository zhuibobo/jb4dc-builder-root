package com.jb4dc.builder.dbentities.systemsetting;

import com.jb4dc.base.service.po.DictionaryPO;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TSYS_DICTIONARY
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class DictionaryEntity extends DictionaryPO {

    public DictionaryEntity(String dictId, String dictKey, String dictValue, String dictText, String dictGroupId, Integer dictOrderNum, Date dictCreateTime, String dictParentId, String dictParentIdList, String dictIsSystem, String dictDelEnable, String dictStatus, String dictIsSelected, String dictDesc, Integer dictChildCount, String dictExAttr1, String dictExAttr2, String dictExAttr3, String dictExAttr4, String dictUserId, String dictUserName, String dictOrganId, String dictOrganName) {
        super(dictId, dictKey, dictValue, dictText, dictGroupId, dictOrderNum, dictCreateTime, dictParentId, dictParentIdList, dictIsSystem, dictDelEnable, dictStatus, dictIsSelected, dictDesc, dictChildCount, dictExAttr1, dictExAttr2, dictExAttr3, dictExAttr4, dictUserId, dictUserName, dictOrganId, dictOrganName);
    }

    public DictionaryEntity() {
        super();
    }

}