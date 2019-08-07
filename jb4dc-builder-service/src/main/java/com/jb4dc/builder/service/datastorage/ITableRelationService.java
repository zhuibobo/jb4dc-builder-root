package com.jb4dc.builder.service.datastorage;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.datastorage.TableRelationEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

public interface ITableRelationService extends IBaseService<TableRelationEntity> {
    List<TableRelationEntity> getRelationByGroup(JB4DCSession jb4DCSession, String groupId);


    void updateDiagram(JB4DCSession jb4DCSession, String recordId, String relationContent, String relationDiagramJson) throws JBuild4DCGenerallyException;
}
