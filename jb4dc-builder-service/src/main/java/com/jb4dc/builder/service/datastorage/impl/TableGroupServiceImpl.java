package com.jb4dc.builder.service.datastorage.impl;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dao.datastorage.TableGroupMapper;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
@Service
public class TableGroupServiceImpl extends BaseServiceImpl<TableGroupEntity> implements ITableGroupService
{
    TableGroupMapper tableGroupMapper;

    @Autowired
    ITableService tableService;

    @Autowired
    IDbLinkService dbLinkService;

    @Override
    public String getRootId() {
        return rootId;
    }

    private String rootId="0";
    private String rootParentId="-1";

    //private String TableGroupJBuild4DSystem="TableGroupJBuild4DSystem";
    //private String TableGroupJBuild4DSystemSetting="TableGroupJBuild4DSystemSetting";

    //private String TableGroupJBuild4DSystemAuth="TableGroupJBuild4DSystemAuth";
    //private String TableGroupJBuild4DSystemBuilder="TableGroupJBuild4DSystemBuilder";

    //private String TableGroupJbuild4DFileStore="TableGroupJbuild4DFileStore";

    public TableGroupServiceImpl(TableGroupMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        tableGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, TableGroupEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<TableGroupEntity>() {
            @Override
            public TableGroupEntity run(JB4DCSession jb4DCSession, TableGroupEntity sourceEntity) throws JBuild4DCGenerallyException {
                sourceEntity.setTableGroupOrderNum(tableGroupMapper.nextOrderNum());
                sourceEntity.setTableGroupChildCount(0);
                sourceEntity.setTableGroupCreateTime(new Date());
                sourceEntity.setTableGroupOrganId(jb4DCSession.getOrganId());
                sourceEntity.setTableGroupOrganName(jb4DCSession.getOrganName());
                String parentIdList="-1";
                if(sourceEntity.getTableGroupId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setTableGroupParentId(rootParentId);
                }
                else if(!sourceEntity.getTableGroupParentId().equals(rootParentId))
                {
                    TableGroupEntity parentEntity=tableGroupMapper.selectByPrimaryKey(sourceEntity.getTableGroupParentId());
                    parentIdList=parentEntity.getTableGroupPidList();
                    parentEntity.setTableGroupChildCount(parentEntity.getTableGroupChildCount()+1);
                    tableGroupMapper.updateByPrimaryKeySelective(parentEntity);

                    record.setTableGroupLinkId(parentEntity.getTableGroupLinkId());
                }
                sourceEntity.setTableGroupPidList(parentIdList+"*"+sourceEntity.getTableGroupId());
                return sourceEntity;
            }
        });
    }

    @Override
    public TableGroupEntity createRootNode(JB4DCSession jb4DCSession,String dbLinkId,String text,String value) throws JBuild4DCGenerallyException {
        TableGroupEntity tableGroupEntity=new TableGroupEntity();
        tableGroupEntity.setTableGroupId(dbLinkId);
        tableGroupEntity.setTableGroupParentId(rootParentId);
        tableGroupEntity.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        tableGroupEntity.setTableGroupStatus(EnableTypeEnum.enable.getDisplayName());
        tableGroupEntity.setTableGroupDelEnable(TrueFalseEnum.False.getDisplayName());
        tableGroupEntity.setTableGroupText(text);
        tableGroupEntity.setTableGroupValue(value);
        tableGroupEntity.setTableGroupLinkId(dbLinkId);
        this.saveSimple(jb4DCSession,tableGroupEntity.getTableGroupId(),tableGroupEntity);
        return tableGroupEntity;
    }



    /*@Override
    public TableGroupEntity createSystemTableGroupNode(JB4DCSession jb4DCSession,TableGroupEntity parentGroup) throws JBuild4DCGenerallyException {
        //系统基础
        deleteByKeyNotValidate(jb4DCSession,TableGroupJBuild4DSystem, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemBase=new TableGroupEntity();
        jBuild4DSystemBase.setTableGroupId(TableGroupJBuild4DSystem);
        jBuild4DSystemBase.setTableGroupParentId(parentGroup.getTableGroupId());
        jBuild4DSystemBase.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBase.setTableGroupText("JBuild4D-System");
        jBuild4DSystemBase.setTableGroupValue("JBuild4D-System");
        jBuild4DSystemBase.setTableGroupLinkId(dbLinkService.JBUILD4DC_BUILDER_DB_LINK_ID);
        this.saveSimple(jb4DCSession,TableGroupJBuild4DSystem,jBuild4DSystemBase);

        //系统设置相关表
        deleteByKeyNotValidate(jb4DCSession,TableGroupJBuild4DSystemSetting, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemSetting=new TableGroupEntity();
        jBuild4DSystemSetting.setTableGroupId(TableGroupJBuild4DSystemSetting);
        jBuild4DSystemSetting.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemSetting.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemSetting.setTableGroupText("系统设置相关表");
        jBuild4DSystemSetting.setTableGroupValue("系统设置相关表");
        jBuild4DSystemSetting.setTableGroupLinkId(dbLinkService.JBUILD4DC_BUILDER_DB_LINK_ID);
        this.saveSimple(jb4DCSession,TableGroupJBuild4DSystemSetting,jBuild4DSystemSetting);



        //单点登录相关表


        //权限相关表
        *//*deleteByKeyNotValidate(jb4DCSession,TableGroupJBuild4DSystemAuth, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemAuth=new TableGroupEntity();
        jBuild4DSystemAuth.setTableGroupId(TableGroupJBuild4DSystemAuth);
        jBuild4DSystemAuth.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemAuth.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemAuth.setTableGroupText("权限相关表");
        jBuild4DSystemAuth.setTableGroupValue("权限相关表");
        this.saveSimple(jb4DCSession,TableGroupJBuild4DSystemAuth,jBuild4DSystemAuth);*//*

        //应用设计相关表
        deleteByKeyNotValidate(jb4DCSession,TableGroupJBuild4DSystemBuilder, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemBuilder=new TableGroupEntity();
        jBuild4DSystemBuilder.setTableGroupId(TableGroupJBuild4DSystemBuilder);
        jBuild4DSystemBuilder.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemBuilder.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBuilder.setTableGroupText("应用设计相关表");
        jBuild4DSystemBuilder.setTableGroupValue("应用设计相关表");
        jBuild4DSystemBuilder.setTableGroupLinkId(dbLinkService.JBUILD4DC_BUILDER_DB_LINK_ID);
        this.saveSimple(jb4DCSession,TableGroupJBuild4DSystemBuilder,jBuild4DSystemBuilder);



        //文件存储相关表
        deleteByKeyNotValidate(jb4DCSession,TableGroupJbuild4DFileStore, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity jbuild4DFileStore=new TableGroupEntity();
        jbuild4DFileStore.setTableGroupId(TableGroupJbuild4DFileStore);
        jbuild4DFileStore.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jbuild4DFileStore.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jbuild4DFileStore.setTableGroupText("文件存储相关表");
        jbuild4DFileStore.setTableGroupValue("文件存储相关表");
        jbuild4DFileStore.setTableGroupLinkId(dbLinkService.JBUILD4DC_BUILDER_DB_LINK_ID);
        this.saveSimple(jb4DCSession,TableGroupJbuild4DFileStore,jbuild4DFileStore);

        return jBuild4DSystemBase;
    }*/

    @Override
    public TableGroupEntity getByGroupText(JB4DCSession jb4DCSession, String groupText) {
        return tableGroupMapper.selectByGroupText(groupText);
    }

    @Override
    public TableGroupEntity getLocationTableGroupRoot(JB4DCSession jb4DCSession) {
        return tableGroupMapper.selectTableGroupRoot(dbLinkService.JBUILD4DC_BUILDER_DB_LINK_ID);
    }

    @Override
    public List<TableGroupEntity> getByDBLinkId(JB4DCSession session, String dbLinkId) {
        return tableGroupMapper.selectTableGroupsByDBLinkId(dbLinkId);
    }

    private TableGroupEntity deleteAndSaveGroup(JB4DCSession jb4DCSession,String groupId,String groupName,String dbLinkId) throws JBuild4DCGenerallyException {
        deleteByKeyNotValidate(jb4DCSession,groupId, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity tableGroupEntity=new TableGroupEntity();
        tableGroupEntity.setTableGroupId(groupId);
        tableGroupEntity.setTableGroupParentId(dbLinkId);
        tableGroupEntity.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        tableGroupEntity.setTableGroupText(groupName);
        tableGroupEntity.setTableGroupValue(groupName);
        tableGroupEntity.setTableGroupLinkId(dbLinkId);
        this.saveSimple(jb4DCSession,groupId,tableGroupEntity);
        return tableGroupEntity;
    }

    private void initDevMockSystemTableToBuilderSystem(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        //开发示例相关表
        String TableGroup_DevDemo="TABLE_GROUP_JBUILD4DC_DEV_MOCK_GROUP_ID";
        deleteByKeyNotValidate(jb4DCSession,TableGroup_DevDemo, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemDevDemo=new TableGroupEntity();
        jBuild4DSystemDevDemo.setTableGroupId(TableGroup_DevDemo);
        jBuild4DSystemDevDemo.setTableGroupParentId(IDbLinkService.JBUILD4DC_DEV_MOCK_DB_LINK_ID);
        jBuild4DSystemDevDemo.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemDevDemo.setTableGroupText("系统默认相关表");
        jBuild4DSystemDevDemo.setTableGroupValue("开发示例系统默认相关表");
        jBuild4DSystemDevDemo.setTableGroupLinkId(dbLinkService.JBUILD4DC_DEV_MOCK_DB_LINK_ID);
        this.saveSimple(jb4DCSession,TableGroup_DevDemo,jBuild4DSystemDevDemo);

        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TDEV_DEMO_GEN_LIST",jBuild4DSystemDevDemo);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TDEV_DEMO_TL_TREE",jBuild4DSystemDevDemo);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TDEV_DEMO_TL_TREE_LIST",jBuild4DSystemDevDemo);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TDEV_DEMO_TREE_TABLE",jBuild4DSystemDevDemo);
    }

    private void initSSOSystemTableToBuilderSystem(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException{
        String TableGroupJBuild4DSystemSSORelevance ="TABLE_GROUP_JBUILD4DC_SSO_GROUP_ID";
        deleteByKeyNotValidate(jb4DCSession, TableGroupJBuild4DSystemSSORelevance, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity jBuild4DSSORelevance=new TableGroupEntity();
        jBuild4DSSORelevance.setTableGroupId(TableGroupJBuild4DSystemSSORelevance);
        jBuild4DSSORelevance.setTableGroupParentId(IDbLinkService.JBUILD4DC_SSO_DB_LINK_ID);
        jBuild4DSSORelevance.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSSORelevance.setTableGroupText("单点登录相关表");
        jBuild4DSSORelevance.setTableGroupValue("单点登录相关表");
        jBuild4DSSORelevance.setTableGroupLinkId(dbLinkService.JBUILD4DC_SSO_DB_LINK_ID);
        this.saveSimple(jb4DCSession, TableGroupJBuild4DSystemSSORelevance,jBuild4DSSORelevance);

        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_ORGAN_TYPE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_ORGAN",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_DEPARTMENT",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_DEPARTMENT_USER",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_USER",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_ROLE_GROUP",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_ROLE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_USER_ROLE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_AUTHORITY",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_SSO_APP",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_SSO_APP_INTERFACE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_SSO_APP_FILE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_SSO_APP_USER_MAPPING",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSSO_MENU",jBuild4DSSORelevance);

        String TableGroupJBuild4DSystemSettingRelevance ="TABLE_GROUP_JBUILD4DC_SETTING_GROUP_ID";
        deleteByKeyNotValidate(jb4DCSession, TableGroupJBuild4DSystemSettingRelevance, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemSettingRelevance=new TableGroupEntity();
        jBuild4DSystemSettingRelevance.setTableGroupId(TableGroupJBuild4DSystemSettingRelevance);
        jBuild4DSystemSettingRelevance.setTableGroupParentId(IDbLinkService.JBUILD4DC_SSO_DB_LINK_ID);
        jBuild4DSystemSettingRelevance.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemSettingRelevance.setTableGroupText("系统设置相关表");
        jBuild4DSystemSettingRelevance.setTableGroupValue("系统设置相关表");
        jBuild4DSystemSettingRelevance.setTableGroupLinkId(dbLinkService.JBUILD4DC_SSO_DB_LINK_ID);
        this.saveSimple(jb4DCSession, TableGroupJBuild4DSystemSettingRelevance,jBuild4DSystemSettingRelevance);

        String TableGroupJBuild4DSystemFileRelevance ="TABLE_GROUP_JBUILD4DC_FILES_GROUP_ID";
        deleteByKeyNotValidate(jb4DCSession, TableGroupJBuild4DSystemFileRelevance, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemFileRelevance=new TableGroupEntity();
        jBuild4DSystemFileRelevance.setTableGroupId(TableGroupJBuild4DSystemFileRelevance);
        jBuild4DSystemFileRelevance.setTableGroupParentId(IDbLinkService.JBUILD4DC_SSO_DB_LINK_ID);
        jBuild4DSystemFileRelevance.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemFileRelevance.setTableGroupText("文件存储相关表");
        jBuild4DSystemFileRelevance.setTableGroupValue("文件存储相关表");
        jBuild4DSystemFileRelevance.setTableGroupLinkId(dbLinkService.JBUILD4DC_SSO_DB_LINK_ID);
        this.saveSimple(jb4DCSession, TableGroupJBuild4DSystemFileRelevance,jBuild4DSystemFileRelevance);

        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TFS_FILE_INFO",jBuild4DSystemFileRelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TFS_FILE_CONTENT",jBuild4DSystemFileRelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TFS_FILE_REF",jBuild4DSystemFileRelevance);
    }

    private void initBuilderSystemTableToBuilderSystem(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        //应用构建相关表
        String TableGroup_DevDemo="TABLE_GROUP_JBUILD4DC_BUILDER_GROUP_ID";
        deleteByKeyNotValidate(jb4DCSession,TableGroup_DevDemo, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity tableGroupEntity=new TableGroupEntity();
        tableGroupEntity.setTableGroupId(TableGroup_DevDemo);
        tableGroupEntity.setTableGroupParentId(IDbLinkService.JBUILD4DC_BUILDER_DB_LINK_ID);
        tableGroupEntity.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        tableGroupEntity.setTableGroupText("系统默认相关表");
        tableGroupEntity.setTableGroupValue("应用构建默认相关表");
        tableGroupEntity.setTableGroupLinkId(dbLinkService.JBUILD4DC_BUILDER_DB_LINK_ID);
        this.saveSimple(jb4DCSession,TableGroup_DevDemo,tableGroupEntity);

        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_DB_LINK",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_TABLE_GROUP",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_TABLE",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_TABLE_FIELD",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_TABLE_RELATION_GROUP",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_TABLE_RELATION",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_TABLE_RELATION_HIS",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_DATASET_GROUP",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_DATASET",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_DATASET_COLUMN",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_DATASET_RELATED_TABLE",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_MODULE",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_FLOW_INTEGRATED",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_FORM_CONFIG",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_FORM_RESOURCE",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_LIST_RESOURCE",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TBUILD_LIST_BUTTON",tableGroupEntity);

        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSYS_DICTIONARY_GROUP",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSYS_DICTIONARY",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSYS_OPERATION_LOG",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSYS_SETTING",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TSYS_HISTORY_DATA",tableGroupEntity);
    }

    private void initQCSystemTableToBuilderSystem(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        //QC相关表
        String TableGroup_QC_Group="TABLE_GROUP_QC_SYSTEM_GROUP_ID";
        deleteByKeyNotValidate(jb4DCSession,TableGroup_QC_Group, JBuild4DCYaml.getWarningOperationCode());
        TableGroupEntity tableGroupEntity=new TableGroupEntity();
        tableGroupEntity.setTableGroupId(TableGroup_QC_Group);
        tableGroupEntity.setTableGroupParentId(IDbLinkService.JBUILD4DC_QC_DB_LINK_ID);
        tableGroupEntity.setTableGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        tableGroupEntity.setTableGroupText("运维系统默认相关表");
        tableGroupEntity.setTableGroupValue("运维系统默认相关表");
        tableGroupEntity.setTableGroupLinkId(dbLinkService.JBUILD4DC_QC_DB_LINK_ID);
        this.saveSimple(jb4DCSession,TableGroup_QC_Group,tableGroupEntity);

        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TQC_PROJECT",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TQC_ISSUES",tableGroupEntity);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TQC_ISSUES_REMARK",tableGroupEntity);
    }

    private void initGridSystemTableToBuilderSystem(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {

        //网格相关信息
        TableGroupEntity gridBaseGroupEnt=this.deleteAndSaveGroup(jb4DCSession,"TABLE_GROUP_GRID_SYSTEM_GRID_BASE_GROUP_ID","网格信息相关表",IDbLinkService.JBUILD4DC_GRID_DB_LINK_ID);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_GRID_INFO",gridBaseGroupEnt);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_GATHER_TERMINAL_INFO",gridBaseGroupEnt);

        //建筑物相关信息
        TableGroupEntity buildGroupEnt=this.deleteAndSaveGroup(jb4DCSession,"TABLE_GROUP_GRID_SYSTEM_BUILD_GROUP_ID","房楼相关表",IDbLinkService.JBUILD4DC_GRID_DB_LINK_ID);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_BUILD_INFO",buildGroupEnt);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_HOUSE_INFO",buildGroupEnt);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_HOUSE_RELEVANTER",buildGroupEnt);
        //tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_PERSON_INFO",buildGroupEnt);

        //人口相关信息
        TableGroupEntity personGroupEnt=this.deleteAndSaveGroup(jb4DCSession,"TABLE_GROUP_GRID_SYSTEM_PERSON_GROUP_ID","人口相关表",IDbLinkService.JBUILD4DC_GRID_DB_LINK_ID);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_FAMILY",personGroupEnt);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_PERSON",personGroupEnt);

        //企业相关信息
        TableGroupEntity entGroupEnt=this.deleteAndSaveGroup(jb4DCSession,"TABLE_GROUP_GRID_SYSTEM_ENTERPRISE_GROUP_ID","企业法人相关表",IDbLinkService.JBUILD4DC_GRID_DB_LINK_ID);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_ENTERPRISE_INFO",entGroupEnt);

        //网格事件相关信息
        TableGroupEntity eventGroupEnt=this.deleteAndSaveGroup(jb4DCSession,"TABLE_GROUP_GRID_SYSTEM_EVENT_GROUP_ID","网格事件相关表",IDbLinkService.JBUILD4DC_GRID_DB_LINK_ID);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_EVENT_INFO",eventGroupEnt);
        //tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_EVENT_RELEVANTER",eventGroupEnt);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TGRID_EVENT_PROCESS",eventGroupEnt);

        //文件存储表
        TableGroupEntity fileGroupEnt=this.deleteAndSaveGroup(jb4DCSession,"TABLE_GROUP_GRID_SYSTEM_FILE_GROUP_ID","文件存储相关表",IDbLinkService.JBUILD4DC_GRID_DB_LINK_ID);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TFS_FILE_INFO",fileGroupEnt);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TFS_FILE_CONTENT",fileGroupEnt);
        tableService.registerSystemTableToBuilderToModule(jb4DCSession,"TFS_FILE_REF",fileGroupEnt);
    }

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        //this.initDevMockSystemTableToBuilderSystem(jb4DCSession);
        this.initSSOSystemTableToBuilderSystem(jb4DCSession);
        this.initBuilderSystemTableToBuilderSystem(jb4DCSession);
        this.initQCSystemTableToBuilderSystem(jb4DCSession);
        this.initGridSystemTableToBuilderSystem(jb4DCSession);
    }

    @Override
    public int deleteByKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        TableGroupEntity tableGroupEntity=tableGroupMapper.selectByPrimaryKey(id);
        if(tableGroupEntity!=null){
            if(tableGroupEntity.getTableGroupIsSystem().equals(TrueFalseEnum.True.getDisplayName())){
                throw JBuild4DCGenerallyException.getSystemRecordDelException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE);
            }
            if(tableGroupEntity.getTableGroupDelEnable().equals(TrueFalseEnum.False.getDisplayName())){
                throw JBuild4DCGenerallyException.getDBFieldSettingDelException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE);
            }
            List<TableGroupEntity> childEntityList=tableGroupMapper.selectChilds(id);
            if(childEntityList!=null&&childEntityList.size()>0){
                throw JBuild4DCGenerallyException.getHadChildDelException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE);
            }
            return super.deleteByKey(jb4DCSession, id);
        }
        else
        {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"找不到要删除的记录!");
        }
    }

    @Override
    public void moveUp(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        TableGroupEntity selfEntity=tableGroupMapper.selectByPrimaryKey(id);
        TableGroupEntity ltEntity=tableGroupMapper.selectLessThanRecord(id,selfEntity.getTableGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        TableGroupEntity selfEntity=tableGroupMapper.selectByPrimaryKey(id);
        TableGroupEntity ltEntity=tableGroupMapper.selectGreaterThanRecord(id,selfEntity.getTableGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(TableGroupEntity toEntity,TableGroupEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getTableGroupOrderNum();
            toEntity.setTableGroupOrderNum(selfEntity.getTableGroupOrderNum());
            selfEntity.setTableGroupOrderNum(newNum);
            tableGroupMapper.updateByPrimaryKeySelective(toEntity);
            tableGroupMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}

