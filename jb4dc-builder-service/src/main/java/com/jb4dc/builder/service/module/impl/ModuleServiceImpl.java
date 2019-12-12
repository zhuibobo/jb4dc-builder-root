package com.jb4dc.builder.service.module.impl;

import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.service.envvar.IEnvVariableService;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.builder.dao.module.ModuleMapper;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.builder.po.ModuleContextPO;
import com.jb4dc.builder.service.envvar.IEnvGroupService;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.builder.service.weblist.IListResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class ModuleServiceImpl extends BaseServiceImpl<ModuleEntity> implements IModuleService
{
    @Override
    public String getRootId() {
        return rootId;
    }

    private String rootId="0";
    private String rootParentId="-1";

    @Autowired
    IFormResourceService formResourceService;

    @Autowired
    IListResourceService listResourceService;

    @Autowired
    IEnvGroupService envGroupService;

    @Autowired
    IEnvVariableService envVariableService;

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

    @Override
    public ModuleContextPO getModuleContextPO(JB4DCSession jb4DCSession, String moduleId) throws JBuild4DCGenerallyException, IOException {
        ModuleEntity moduleEntity=getByPrimaryKey(jb4DCSession,moduleId);
        ModuleContextPO moduleContextPO=JsonUtility.parseEntityToPO(moduleEntity,ModuleContextPO.class);

        List<FormResourceEntity> formResourceEntityList=formResourceService.getByModuleId(jb4DCSession,moduleId);

        List<FormResourcePO> formResourcePOList = JsonUtility.parseEntityListToPOList(formResourceEntityList,FormResourcePO.class);
        formResourceService.tryLoadAboutTable(jb4DCSession,formResourcePOList);
        moduleContextPO.setFormResourcePOList(formResourcePOList);

        List<ListResourceEntity> listResourceEntityList=listResourceService.getByModuleId(jb4DCSession,moduleId);
        moduleContextPO.setListResourcePOList(JsonUtility.parseEntityListToPOList(listResourceEntityList,ListResourcePO.class));

        moduleContextPO.setEnvGroupPOList(envGroupService.getALLASC(jb4DCSession));
        moduleContextPO.setEnvVariablePOList(envVariableService.getALL(jb4DCSession));

        return moduleContextPO;
    }
}

