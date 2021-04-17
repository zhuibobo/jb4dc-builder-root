package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryGroupEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.ModelGroupMapper;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.integrate.extend.IModelGroupExtendService;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ModelGroupExtendServiceImpl extends BaseServiceImpl<ModelGroupEntity> implements IModelGroupExtendService
{
    private String rootParentId="-1";

    ModelGroupMapper modelGroupMapper;
    public ModelGroupExtendServiceImpl(ModelGroupMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        modelGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ModelGroupEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ModelGroupEntity>() {
            @Override
            public ModelGroupEntity run(JB4DCSession jb4DCSession,ModelGroupEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setModelGroupOrderNum(modelGroupMapper.nextOrderNum());
                sourceEntity.setModelGroupChildCount(0);
                sourceEntity.setModelGroupCreateTime(new Date());
                String parentIdList;
                if(sourceEntity.getModelGroupParentId().equals(rootParentId)){
                    parentIdList=rootParentId;
                    //sourceEntity.setModelGroupParentId(rootParentId);
                }
                else
                {
                    ModelGroupEntity parentEntity=modelGroupMapper.selectByPrimaryKey(sourceEntity.getModelGroupParentId());
                    parentIdList=parentEntity.getModelGroupParentIdList();
                    parentEntity.setModelGroupChildCount(parentEntity.getModelGroupChildCount()+1);
                    modelGroupMapper.updateByPrimaryKeySelective(parentEntity);
                    sourceEntity.setModelGroupParentIdList(parentIdList+"*"+sourceEntity.getModelGroupId());
                }
                sourceEntity.setModelGroupParentIdList(parentIdList+"*"+sourceEntity.getModelGroupId());

                return sourceEntity;
            }
        });
    }

    @Override
    public void initSystemData(JB4DCSession JB4DCSession) throws JBuild4DCGenerallyException {
        //根字典分组
        String rootId="0";
        ModelGroupEntity modelGroupEntity = getModelGroupEntity(rootId,"流程模型分组","流程模型分组",rootParentId,"-1*0");
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);

        String groupId="GeneralFlowGroupId";
        modelGroupEntity = getModelGroupEntity(groupId,"日常工作","日常工作",rootId,"-1*0*"+groupId);
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);

        groupId="PersonnelManagementFlowGroupId";
        modelGroupEntity = getModelGroupEntity(groupId,"人事管理","人事管理",rootId,"-1*0*"+groupId);
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);

        groupId="MonitorFlowGroupId";
        modelGroupEntity = getModelGroupEntity(groupId,"纪检监察室","纪检监察室",rootId,"-1*0*"+groupId);
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);

        groupId="OperationAndManagementFlowGroupId";
        modelGroupEntity = getModelGroupEntity(groupId,"经营管理部","经营管理部",rootId,"-1*0*"+groupId);
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);

        groupId="FinancialFlowGroupId";
        modelGroupEntity = getModelGroupEntity(groupId,"财务部","财务部",rootId,"-1*0*"+groupId);
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);

        groupId="MoneyManagementFlowGroupId";
        modelGroupEntity = getModelGroupEntity(groupId,"资金管理部","资金管理部",rootId,"-1*0*"+groupId);
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);

        groupId="ProjectFlowGroupId";
        modelGroupEntity = getModelGroupEntity(groupId,"项目部","项目部",rootId,"-1*0*"+groupId);
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);

        groupId="MarketDevelopmentFlowGroupId";
        modelGroupEntity = getModelGroupEntity(groupId,"市场开发部","市场开发部",rootId,"-1*0*"+groupId);
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);

        groupId="OtherFlowGroupId";
        modelGroupEntity = getModelGroupEntity(groupId,"其他","其他",rootId,"-1*0*"+groupId);
        deleteByKeyNotValidate(JB4DCSession,modelGroupEntity.getModelGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,modelGroupEntity.getModelGroupId(),modelGroupEntity);
    }

    private ModelGroupEntity getModelGroupEntity(String id,String value,String text,String parentId,String parentIdList) {
        ModelGroupEntity modelGroupEntity=new ModelGroupEntity();
        modelGroupEntity.setModelGroupId(id);
        modelGroupEntity.setModelGroupValue(value);
        modelGroupEntity.setModelGroupText(text);
        modelGroupEntity.setModelGroupDesc("");
        modelGroupEntity.setModelGroupStatus(EnableTypeEnum.enable.getDisplayName());
        modelGroupEntity.setModelGroupParentId(parentId);
        modelGroupEntity.setModelGroupIsSystem("是");
        modelGroupEntity.setModelGroupDelEnable("否");
        modelGroupEntity.setModelGroupClassName("las la-stream");
        modelGroupEntity.setModelGroupParentIdList(parentIdList);
        return modelGroupEntity;
    }
}