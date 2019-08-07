package com.jb4dc.builder.service.module.impl;

import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.module.ModuleMapper;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ModuleServiceImpl extends BaseServiceImpl<ModuleEntity> implements IModuleService
{
    @Override
    public String getRootId() {
        return rootId;
    }

    private String rootId="0";
    private String rootParentId="-1";



    ModuleMapper moduleMapper;
    public ModuleServiceImpl(ModuleMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        moduleMapper=_defaultBaseMapper;
    }

    @Override
    public ModuleEntity createRootNode(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        ModuleEntity rootEntity=new ModuleEntity();
        rootEntity.setModuleId(rootId);
        rootEntity.setModuleParentId(rootParentId);
        rootEntity.setModuleIsSystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setModuleText("模块分组");
        rootEntity.setModuleValue("模块分组");
        this.saveSimple(jb4DCSession,rootEntity.getModuleId(),rootEntity);
        return rootEntity;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ModuleEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ModuleEntity>() {
            @Override
            public ModuleEntity run(JB4DCSession jb4DCSession,ModuleEntity sourceEntity) throws JBuild4DCGenerallyException {
                sourceEntity.setModuleOrderNum(moduleMapper.nextOrderNum());
                sourceEntity.setModuleChildCount(0);
                sourceEntity.setModuleCreateTime(new Date());
                sourceEntity.setModuleOrganId(jb4DCSession.getOrganId());
                sourceEntity.setModuleOrganName(jb4DCSession.getOrganName());
                String parentIdList;
                if(sourceEntity.getModuleId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setModuleParentId(rootParentId);
                }
                else
                {
                    ModuleEntity parentEntity=moduleMapper.selectByPrimaryKey(sourceEntity.getModuleParentId());
                    parentIdList=parentEntity.getModulePidList();
                    parentEntity.setModuleChildCount(parentEntity.getModuleChildCount()+1);
                    moduleMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setModulePidList(parentIdList+"*"+sourceEntity.getModuleId());
                return sourceEntity;
            }
        });
    }

    @Override
    public void moveUp(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        ModuleEntity selfEntity=moduleMapper.selectByPrimaryKey(id);
        ModuleEntity ltEntity=moduleMapper.selectLessThanRecord(id,selfEntity.getModuleParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        ModuleEntity selfEntity=moduleMapper.selectByPrimaryKey(id);
        ModuleEntity ltEntity=moduleMapper.selectGreaterThanRecord(id,selfEntity.getModuleParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(ModuleEntity toEntity,ModuleEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getModuleOrderNum();
            toEntity.setModuleOrderNum(selfEntity.getModuleOrderNum());
            selfEntity.setModuleOrderNum(newNum);
            moduleMapper.updateByPrimaryKeySelective(toEntity);
            moduleMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }

    @Override
    public String buildModuleItemCode(int num){
        return String.format("1%05d", num);
    }
}

