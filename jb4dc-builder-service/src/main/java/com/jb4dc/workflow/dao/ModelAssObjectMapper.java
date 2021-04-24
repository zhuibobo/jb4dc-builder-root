package com.jb4dc.workflow.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dbentities.ModelAssObjectEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;

public interface ModelAssObjectMapper extends BaseMapper<ModelAssObjectEntity> {

    void deleteRefByModelKey(String key);
}
