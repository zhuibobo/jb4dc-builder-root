package com.jb4dc.builder.service.datastorage.impl;

import com.jb4dc.base.dbaccess.exenum.EnableTypeEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.datastorage.TableRelationMapper;
import com.jb4dc.builder.dbentities.datastorage.TableRelationEntity;
import com.jb4dc.builder.service.datastorage.ITableRelationService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;
import java.util.List;

public class TableRelationServiceImpl extends BaseServiceImpl<TableRelationEntity> implements ITableRelationService
{
    TableRelationMapper tableRelationMapper;
    public TableRelationServiceImpl(TableRelationMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        tableRelationMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, TableRelationEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableRelationEntity>() {
            @Override
            public TableRelationEntity run(JB4DCSession jb4DSession, TableRelationEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setRelationUserId(jb4DSession.getUserId());
                sourceEntity.setRelationUserName(jb4DSession.getUserName());
                sourceEntity.setRelationOrderNum(tableRelationMapper.nextOrderNum());
                sourceEntity.setRelationCreateTime(new Date());
                sourceEntity.setRelationStatus(EnableTypeEnum.enable.getDisplayName());
                return sourceEntity;
            }
        });
    }

    @Override
    public List<TableRelationEntity> getRelationByGroup(JB4DCSession jb4DSession, String groupId) {
        return tableRelationMapper.selectByGroupId(groupId);
    }

    @Override
    public void updateDiagram(JB4DCSession jb4DSession, String recordId, String relationContent, String relationDiagramJson) throws JBuild4DCGenerallyException {
        TableRelationEntity tableRelationEntityWithBLOBs=getByPrimaryKey(jb4DSession,recordId);
        if(tableRelationEntityWithBLOBs!=null){
            tableRelationEntityWithBLOBs.setRelationContent(relationContent);
            tableRelationEntityWithBLOBs.setRelationDiagramJson(relationDiagramJson);
            this.updateByKeySelective(jb4DSession,tableRelationEntityWithBLOBs);
        }
        else {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"不存在记录为" + recordId + "的数据!");
        }
    }

    @Override
    public void moveUp(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        TableRelationEntity selfEntity=tableRelationMapper.selectByPrimaryKey(id);
        TableRelationEntity ltEntity=tableRelationMapper.selectLessThanRecord(id,selfEntity.getRelationGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        TableRelationEntity selfEntity=tableRelationMapper.selectByPrimaryKey(id);
        TableRelationEntity ltEntity=tableRelationMapper.selectGreaterThanRecord(id,selfEntity.getRelationGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(TableRelationEntity toEntity,TableRelationEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getRelationOrderNum();
            toEntity.setRelationOrderNum(selfEntity.getRelationOrderNum());
            selfEntity.setRelationOrderNum(newNum);
            tableRelationMapper.updateByPrimaryKeySelective(toEntity);
            tableRelationMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
