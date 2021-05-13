package com.jb4dc.builder.service.module.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.service.po.ZTreeNodePO;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.service.api.IApiItemService;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.client.service.envvar.IEnvVariableService;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.builder.client.service.weblist.IListResourceService;
import com.jb4dc.builder.dao.module.ModuleMapper;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.po.ZTreeNodePOConvert;
import com.jb4dc.builder.service.api.IApiGroupService;
import com.jb4dc.builder.service.envvar.IEnvGroupService;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.client.remote.RoleGroupRuntimeRemote;
import com.jb4dc.sso.client.remote.RoleRuntimeRemote;
import com.jb4dc.sso.client.remote.UserRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import com.jb4dc.sso.dbentities.role.RoleEntity;
import com.jb4dc.sso.dbentities.role.RoleGroupEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.integrate.extend.IModelGroupExtendService;
import com.jb4dc.workflow.po.ModuleContextPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class ModuleServiceImpl extends BaseServiceImpl<ModuleEntity> implements IModuleService
{
    /*@Override
    public String getRootId() {
        return rootId;
    }*/

    //private String rootId="0";
    private String rootParentId="-1";

    @Autowired
    IFormResourceService formResourceService;

    @Autowired
    IListResourceService listResourceService;

    @Autowired
    IEnvGroupService envGroupService;

    @Autowired
    IEnvVariableService envVariableService;

    @Autowired
    RoleGroupRuntimeRemote roleGroupRuntimeRemote;

    @Autowired
    RoleRuntimeRemote roleRuntimeRemote;

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    @Autowired
    UserRuntimeRemote userRuntimeRemote;

    @Autowired
    IApiGroupService apiGroupService;

    @Autowired
    IApiItemService apiItemService;

    @Autowired
    IModelGroupExtendService modelGroupExtendService;

    @Autowired
    ITableFieldService tableFieldService;

    ModuleMapper moduleMapper;
    public ModuleServiceImpl(ModuleMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        moduleMapper=_defaultBaseMapper;
    }

    @Autowired
    public void setSqlSessionTemplate(ISQLBuilderService sqlBuilderService) {
        this.sqlBuilderService = sqlBuilderService;
    }

    @Override
    public ModuleEntity createRootNode(JB4DCSession jb4DCSession, String id, String dbLinkName, String dbLinkValue) throws JBuild4DCGenerallyException {
        ModuleEntity rootEntity=new ModuleEntity();
        rootEntity.setModuleId(id);
        rootEntity.setModuleParentId(rootParentId);
        rootEntity.setModuleIsSystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setModuleText(dbLinkName);
        rootEntity.setModuleValue(dbLinkValue);
        rootEntity.setModuleLinkId(id);
        rootEntity.setModuleIsSystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setModuleStatus(EnableTypeEnum.enable.getDisplayName());
        rootEntity.setModuleDelEnable(TrueFalseEnum.False.getDisplayName());
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
                if(sourceEntity.getModuleParentId().equals(rootParentId)){
                    parentIdList=rootParentId;
                    sourceEntity.setModuleParentId(rootParentId);
                }
                else
                {
                    ModuleEntity parentEntity=moduleMapper.selectByPrimaryKey(sourceEntity.getModuleParentId());
                    parentIdList=parentEntity.getModulePidList();
                    parentEntity.setModuleChildCount(parentEntity.getModuleChildCount()+1);
                    moduleMapper.updateByPrimaryKeySelective(parentEntity);

                    record.setModuleLinkId(parentEntity.getModuleLinkId());
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
        formResourceService.tryLoadAboutTable(jb4DCSession,formResourcePOList,false);
        moduleContextPO.setFormResourcePOList(formResourcePOList);

        List<ListResourceEntity> listResourceEntityList=listResourceService.getByModuleId(jb4DCSession,moduleId);
        moduleContextPO.setListResourcePOList(JsonUtility.parseEntityListToPOList(listResourceEntityList,ListResourcePO.class));

        moduleContextPO.setEnvGroupPOList(envGroupService.getALLASC(jb4DCSession));
        moduleContextPO.setEnvVariablePOList(envVariableService.getALL(jb4DCSession));

        JBuild4DCResponseVo<List<RoleGroupEntity>> jBuild4DCResponseVoRoleGroupEntity=roleGroupRuntimeRemote.getALLRoleGroup();
        JBuild4DCResponseVo<List<RoleEntity>> jBuild4DCResponseVoRoleEntity=roleRuntimeRemote.getFullEnableRole();
        JBuild4DCResponseVo<List<OrganEntity>> jBuild4DCResponseVoOrganEntity=organRuntimeRemote.getEnableOrganMinPropRT();
        JBuild4DCResponseVo<List<UserEntity>> jBuild4DCResponseVoUserEntity=userRuntimeRemote.getEnableUserMinPropRT();

        List<ApiGroupEntity> apiGroupEntityList=apiGroupService.getByGroupTypeASC("API_GROUP_WORKFLOW_ACTION_ROOT",jb4DCSession);
        List<ApiItemEntity> apiItemEntityList=apiItemService.getByGroupTypeALL("API_GROUP_WORKFLOW_ACTION_ROOT",jb4DCSession);
        List<ZTreeNodePO> apisForZTreeNodeList=ZTreeNodePOConvert.parseApiToZTreeNodeList(apiGroupEntityList,apiItemEntityList);
        List<ModelGroupEntity> modelGroupEntityList=modelGroupExtendService.getALL(jb4DCSession);

        List<TableFieldPO> allTableFieldPOList=tableFieldService.getFormUsedTableFieldList(jb4DCSession,formResourcePOList);

        moduleContextPO.setTableFieldPOList(allTableFieldPOList);
        moduleContextPO.setRoleGroupEntityList(jBuild4DCResponseVoRoleGroupEntity.getData());
        moduleContextPO.setRoleEntityList(jBuild4DCResponseVoRoleEntity.getData());
        moduleContextPO.setOrganEntityList(jBuild4DCResponseVoOrganEntity.getData());
        moduleContextPO.setUserEntityList(jBuild4DCResponseVoUserEntity.getData());
        moduleContextPO.setApisForZTreeNodeList(apisForZTreeNodeList);
        moduleContextPO.setModelGroupEntityList(modelGroupEntityList);
        return moduleContextPO;
    }

    @Override
    public List<ModuleEntity> getByDBLinkId(JB4DCSession session, String dbLinkId) {
        return moduleMapper.selectModulesByDBLinkId(dbLinkId);
    }

    @Override
    public List<Map<String, Object>> getModuleItems(JB4DCSession session, String selectModuleId, String selectModuleObjectType) throws JBuild4DCGenerallyException {
        String sql="";
        if(selectModuleObjectType.equals("Web模块列表")){
            sql="select LIST_ID as ID,LIST_CODE as CODE,LIST_NAME as NAME,LIST_SINGLE_NAME as SINGLE_NAME,LIST_TYPE as OBJECT_TYPE,LIST_DESC as DESCRIPTION,LIST_MODULE_ID,LIST_ORGAN_ID,LIST_DATASET_ID,LIST_DATASET_NAME,LIST_DATASET_PRIMARY_KEY from tbuild_list_resource where LIST_TYPE='WebList' and LIST_MODULE_ID=#{module_Id}";
        }
        else if(selectModuleObjectType.equals("Web模块窗体")){
            sql="select FORM_ID as ID,FORM_CODE as CODE,FORM_NAME as NAME,FORM_SINGLE_NAME as SINGLE_NAME,FORM_TYPE as OBJECT_TYPE,FORM_DESC as DESCRIPTION,FORM_MODULE_ID,FORM_ORGAN_ID,FORM_MAIN_TABLE_ID,FORM_MAIN_TABLE_NAME,FORM_MAIN_TABLE_CAPTION from tbuild_form_resource where FORM_TYPE='WebForm' and FORM_MODULE_ID=#{module_Id}";
        }
        else if(selectModuleObjectType.equals("流程分组")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"暂不支持!");
        }
        else if(selectModuleObjectType.equals("流程实例")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"暂不支持!");
        }
        else if(selectModuleObjectType.equals("统计列表")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"暂不支持!");
        }
        else if(selectModuleObjectType.equals("工作桌面")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"暂不支持!");
        }
        return sqlBuilderService.selectList(sql,selectModuleId);
    }
}

