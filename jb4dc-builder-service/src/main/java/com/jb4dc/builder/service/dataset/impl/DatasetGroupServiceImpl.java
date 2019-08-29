package com.jb4dc.builder.service.dataset.impl;

import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.dataset.DatasetGroupMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetGroupEntity;
import com.jb4dc.builder.service.dataset.IDatasetGroupService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DatasetGroupServiceImpl extends BaseServiceImpl<DatasetGroupEntity> implements IDatasetGroupService
{
    private String rootId="0";
    private String rootParentId="-1";

    DatasetGroupMapper datasetGroupMapper;

    @Autowired
    public DatasetGroupServiceImpl(DatasetGroupMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        datasetGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, DatasetGroupEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<DatasetGroupEntity>() {
            @Override
            public DatasetGroupEntity run(JB4DCSession jb4DCSession, DatasetGroupEntity sourceEntity) throws JBuild4DCGenerallyException {
                sourceEntity.setDsGroupOrderNum(datasetGroupMapper.nextOrderNum());
                sourceEntity.setDsGroupChildCount(0);
                sourceEntity.setDsGroupCreateTime(new Date());
                sourceEntity.setDsGroupOrganId(jb4DCSession.getOrganId());
                sourceEntity.setDsGroupOrganName(jb4DCSession.getOrganName());
                String parentIdList;
                if(sourceEntity.getDsGroupId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setDsGroupParentId(rootParentId);
                }
                else
                {
                    DatasetGroupEntity parentEntity=datasetGroupMapper.selectByPrimaryKey(sourceEntity.getDsGroupParentId());
                    parentIdList=parentEntity.getDsGroupPidList();
                    parentEntity.setDsGroupChildCount(parentEntity.getDsGroupChildCount()+1);
                    datasetGroupMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setDsGroupPidList(parentIdList+"*"+sourceEntity.getDsGroupId());
                return sourceEntity;
            }
        });
    }

    @Override
    public DatasetGroupEntity initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        DatasetGroupEntity rootEntity=new DatasetGroupEntity();
        rootEntity.setDsGroupId(rootId);
        rootEntity.setDsGroupParentId(rootParentId);
        rootEntity.setDsGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setDsGroupText("数据集分组");
        rootEntity.setDsGroupValue("数据集分组");
        this.saveSimple(jb4DCSession,rootEntity.getDsGroupId(),rootEntity);
        return rootEntity;
    }

    @Override
    public String getRootId() {
        return rootId;
    }

    @Override
    public void moveUp(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        DatasetGroupEntity selfEntity=datasetGroupMapper.selectByPrimaryKey(id);
        DatasetGroupEntity ltEntity=datasetGroupMapper.selectLessThanRecord(id,selfEntity.getDsGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        DatasetGroupEntity selfEntity=datasetGroupMapper.selectByPrimaryKey(id);
        DatasetGroupEntity ltEntity=datasetGroupMapper.selectGreaterThanRecord(id,selfEntity.getDsGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DatasetGroupEntity toEntity,DatasetGroupEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDsGroupOrderNum();
            toEntity.setDsGroupOrderNum(selfEntity.getDsGroupOrderNum());
            selfEntity.setDsGroupOrderNum(newNum);
            datasetGroupMapper.updateByPrimaryKeySelective(toEntity);
            datasetGroupMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
