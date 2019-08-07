package com.jb4dc.builder.service.datastorage.impl;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dao.datastorage.TableRelationGroupMapper;
import com.jb4dc.builder.dbentities.datastorage.TableRelationEntity;
import com.jb4dc.builder.dbentities.datastorage.TableRelationGroupEntity;
import com.jb4dc.builder.service.datastorage.ITableRelationGroupService;
import com.jb4dc.builder.service.datastorage.ITableRelationService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TableRelationGroupServiceImpl extends BaseServiceImpl<TableRelationGroupEntity> implements ITableRelationGroupService
{
    @Override
    public String getRootId() {
        return rootId;
    }

    private String rootId="0";
    private String rootParentId="-1";

    TableRelationGroupMapper tableRelationGroupMapper;

    @Autowired
    ITableRelationService tableRelationService;

    public TableRelationGroupServiceImpl(TableRelationGroupMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        tableRelationGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, TableRelationGroupEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<TableRelationGroupEntity>() {
            @Override
            public TableRelationGroupEntity run(JB4DCSession jb4DCSession, TableRelationGroupEntity sourceEntity) throws JBuild4DCGenerallyException {
                sourceEntity.setRelGroupOrderNum(tableRelationGroupMapper.nextOrderNum());
                sourceEntity.setRelGroupChildCount(0);
                sourceEntity.setRelGroupCreateTime(new Date());
                sourceEntity.setRelGroupUserId(jb4DCSession.getUserId());
                sourceEntity.setRelGroupUserName(jb4DCSession.getUserName());
                String parentIdList;
                if(sourceEntity.getRelGroupId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setRelGroupParentId(rootParentId);
                }
                else
                {
                    TableRelationGroupEntity parentEntity=tableRelationGroupMapper.selectByPrimaryKey(sourceEntity.getRelGroupParentId());
                    parentIdList=parentEntity.getRelGroupPidList();
                    parentEntity.setRelGroupChildCount(parentEntity.getRelGroupChildCount()+1);
                    tableRelationGroupMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setRelGroupPidList(parentIdList+"*"+sourceEntity.getRelGroupId());
                return sourceEntity;
            }
        });
    }

    @Override
    public TableRelationGroupEntity createRootNode(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        TableRelationGroupEntity treeTableEntity=new TableRelationGroupEntity();
        treeTableEntity.setRelGroupId(rootId);
        treeTableEntity.setRelGroupParentId(rootParentId);
        treeTableEntity.setRelGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        treeTableEntity.setRelGroupText("表关系分组");
        treeTableEntity.setRelGroupValue("表关系分组");
        this.saveSimple(jb4DCSession,treeTableEntity.getRelGroupId(),treeTableEntity);
        return treeTableEntity;
    }

    @Override
    public int deleteByKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        TableRelationGroupEntity groupEntity=tableRelationGroupMapper.selectByPrimaryKey(id);
        if(groupEntity!=null){
            if(groupEntity.getRelGroupIsSystem().equals(TrueFalseEnum.True.getDisplayName())){
                throw JBuild4DCGenerallyException.getSystemRecordDelException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE);
            }
            if(groupEntity.getRelGroupDelEnable().equals(TrueFalseEnum.False.getDisplayName())){
                throw JBuild4DCGenerallyException.getDBFieldSettingDelException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE);
            }
            List<TableRelationGroupEntity> childEntityList=tableRelationGroupMapper.selectChilds(id);
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
    public TableRelationGroupEntity createSystemTableRelationGroupNode(JB4DCSession jb4DCSession, TableRelationGroupEntity parentGroup) throws JBuild4DCGenerallyException{
        String TableRelationGroupJBuild4DSystem="TableRelationGroupJBuild4DSystem";
        String TableRelationGroupJBuild4DSystemSetting="TableRelationGroupJBuild4DSystemSetting";
        String TableRelationGroupJBuild4DSystemSSORelevance ="TableRelationGroupJBuild4DSystemSSORelevance";
        String TableRelationGroupJBuild4DSystemBuilder="TableRelationGroupJBuild4DSystemBuilder";
        String TableRelationGroupJBuild4DSystemDevDemo="TableRelationGroupJBuild4DSystemDevDemo";
        String TableRelationGroupJbuild4DFileStore="TableRelationGroupJbuild4DFileStore";

        //系统基础
        deleteByKeyNotValidate(jb4DCSession,TableRelationGroupJBuild4DSystem, JBuild4DCYaml.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSystemBaseEntity=new TableRelationGroupEntity();
        jBuild4DSystemBaseEntity.setRelGroupId(TableRelationGroupJBuild4DSystem);
        jBuild4DSystemBaseEntity.setRelGroupParentId(parentGroup.getRelGroupId());
        jBuild4DSystemBaseEntity.setRelGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBaseEntity.setRelGroupText("JBuild4D-System-Relation");
        jBuild4DSystemBaseEntity.setRelGroupValue("JBuild4D-System-Relation");
        this.saveSimple(jb4DCSession,TableRelationGroupJBuild4DSystem,jBuild4DSystemBaseEntity);

        //系统设置相关表
        deleteByKeyNotValidate(jb4DCSession,TableRelationGroupJBuild4DSystemSetting, JBuild4DCYaml.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSystemSetting=new TableRelationGroupEntity();
        jBuild4DSystemSetting.setRelGroupId(TableRelationGroupJBuild4DSystemSetting);
        jBuild4DSystemSetting.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jBuild4DSystemSetting.setRelGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemSetting.setRelGroupText("系统设置相关表关系");
        jBuild4DSystemSetting.setRelGroupValue("系统设置相关表关系");
        this.saveSimple(jb4DCSession,TableRelationGroupJBuild4DSystemSetting,jBuild4DSystemSetting);

        this.createTableRelation(jb4DCSession,jBuild4DSystemSetting,"TSYS_DICTIONARY_RELATION","数据字典关系图","数据字典分组与数据字典的关系图","{\n" +
                "  \"tableList\": [\n" +
                "    {\n" +
                "      \"tableId\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y\",\n" +
                "      \"loc\": \"129 -91\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"tableId\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y___G_R_O_U_P\",\n" +
                "      \"loc\": \"-722 -69\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"lineList\": [\n" +
                "    {\n" +
                "      \"lineId\": \"86c490ac-068e-0db0-893b-62817463bcac\",\n" +
                "      \"from\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y\",\n" +
                "      \"to\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y\",\n" +
                "      \"fromText\": \"DICT_PARENT_ID[1]\",\n" +
                "      \"toText\": \"DICT_ID[1]\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"lineId\": \"030ab739-f5f6-6e8b-581f-afaa9f024688\",\n" +
                "      \"from\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y___G_R_O_U_P\",\n" +
                "      \"to\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y\",\n" +
                "      \"fromText\": \"DICT_GROUP_ID[1]\",\n" +
                "      \"toText\": \"DICT_GROUP_ID[0..N]\"\n" +
                "    }\n" +
                "  ]\n" +
                "}","");

        //单点登录相关表
        deleteByKeyNotValidate(jb4DCSession, TableRelationGroupJBuild4DSystemSSORelevance, JBuild4DCYaml.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSSORelevance=new TableRelationGroupEntity();
        jBuild4DSSORelevance.setRelGroupId(TableRelationGroupJBuild4DSystemSSORelevance);
        jBuild4DSSORelevance.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jBuild4DSSORelevance.setRelGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSSORelevance.setRelGroupText("单点登录相关表关系");
        jBuild4DSSORelevance.setRelGroupValue("单点登录相关表关系");
        this.saveSimple(jb4DCSession, TableRelationGroupJBuild4DSystemSSORelevance,jBuild4DSSORelevance);

        this.createTableRelation(jb4DCSession,jBuild4DSSORelevance,"TSSO_ORGAN_DEPT_USER","机构部门人员关系图","机构部门人员关系图的关系图","{\n" +
                "  \"tableList\": [\n" +
                "    {\n" +
                "      \"tableId\": \"T_S_S_O___O_R_G_A_N___T_Y_P_E\",\n" +
                "      \"loc\": \"-900.7440062418058 -154.21857306871425\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"tableId\": \"T_S_S_O___O_R_G_A_N\",\n" +
                "      \"loc\": \"-392.1044826922499 -568.9561130429586\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"tableId\": \"T_S_S_O___D_E_P_A_R_T_M_E_N_T\",\n" +
                "      \"loc\": \"208.13277100053585 -563.213045560886\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"tableId\": \"T_S_S_O___D_E_P_A_R_T_M_E_N_T___U_S_E_R\",\n" +
                "      \"loc\": \"482.96538312008204 -128.44846413696922\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"tableId\": \"T_S_S_O___U_S_E_R\",\n" +
                "      \"loc\": \"-33.75732327971846 35.067299690821244\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"lineList\": [\n" +
                "    {\n" +
                "      \"lineId\": \"2c1078db-7b59-1b25-48bc-a9107cd91592\",\n" +
                "      \"from\": \"T_S_S_O___O_R_G_A_N___T_Y_P_E\",\n" +
                "      \"to\": \"T_S_S_O___O_R_G_A_N\",\n" +
                "      \"fromText\": \"ORGAN_TYPE_ID[1]\",\n" +
                "      \"toText\": \"ORGAN_TYPE_VALUE[0..N]\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"lineId\": \"63c401de-f40b-85d1-f3d4-4f0873a7bec0\",\n" +
                "      \"from\": \"T_S_S_O___O_R_G_A_N\",\n" +
                "      \"to\": \"T_S_S_O___D_E_P_A_R_T_M_E_N_T\",\n" +
                "      \"fromText\": \"ORGAN_ID[1]\",\n" +
                "      \"toText\": \"DEPT_ORGAN_ID[0..N]\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"lineId\": \"748e5ef1-fc21-0b04-e414-d3f55bc5e524\",\n" +
                "      \"from\": \"T_S_S_O___D_E_P_A_R_T_M_E_N_T\",\n" +
                "      \"to\": \"T_S_S_O___D_E_P_A_R_T_M_E_N_T___U_S_E_R\",\n" +
                "      \"fromText\": \"DEPT_ID[1]\",\n" +
                "      \"toText\": \"DU_DEPT_ID[0..N]\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"lineId\": \"91686e49-c1e7-022c-78f5-ec82b3866639\",\n" +
                "      \"from\": \"T_S_S_O___D_E_P_A_R_T_M_E_N_T___U_S_E_R\",\n" +
                "      \"to\": \"T_S_S_O___U_S_E_R\",\n" +
                "      \"fromText\": \"DU_USER_ID[1..N]\",\n" +
                "      \"toText\": \"USER_ID[1]\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"lineId\": \"c5b09c39-b84c-2a4b-78a1-f6d1e44ea329\",\n" +
                "      \"from\": \"T_S_S_O___O_R_G_A_N\",\n" +
                "      \"to\": \"T_S_S_O___U_S_E_R\",\n" +
                "      \"fromText\": \"ORGAN_ID[1]\",\n" +
                "      \"toText\": \"USER_ORGAN_ID[0..N]\"\n" +
                "    }\n" +
                "  ]\n" +
                "}","");

        //应用设计相关表
        deleteByKeyNotValidate(jb4DCSession,TableRelationGroupJBuild4DSystemBuilder, JBuild4DCYaml.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSystemBuilder=new TableRelationGroupEntity();
        jBuild4DSystemBuilder.setRelGroupId(TableRelationGroupJBuild4DSystemBuilder);
        jBuild4DSystemBuilder.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jBuild4DSystemBuilder.setRelGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBuilder.setRelGroupText("应用设计相关表关系");
        jBuild4DSystemBuilder.setRelGroupValue("应用设计相关表关系");
        this.saveSimple(jb4DCSession,TableRelationGroupJBuild4DSystemBuilder,jBuild4DSystemBuilder);


        //文件存储相关表
        deleteByKeyNotValidate(jb4DCSession,TableRelationGroupJbuild4DFileStore, JBuild4DCYaml.getWarningOperationCode());
        TableRelationGroupEntity jbuild4DFileStore=new TableRelationGroupEntity();
        jbuild4DFileStore.setRelGroupId(TableRelationGroupJbuild4DFileStore);
        jbuild4DFileStore.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jbuild4DFileStore.setRelGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jbuild4DFileStore.setRelGroupText("文件存储相关表关系");
        jbuild4DFileStore.setRelGroupValue("文件存储相关表表关系");
        this.saveSimple(jb4DCSession,TableRelationGroupJbuild4DFileStore,jbuild4DFileStore);

        //开发示例相关表
        deleteByKeyNotValidate(jb4DCSession,TableRelationGroupJBuild4DSystemDevDemo, JBuild4DCYaml.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSystemDevDemo=new TableRelationGroupEntity();
        jBuild4DSystemDevDemo.setRelGroupId(TableRelationGroupJBuild4DSystemDevDemo);
        jBuild4DSystemDevDemo.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jBuild4DSystemDevDemo.setRelGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemDevDemo.setRelGroupText("开发示例相关表关系");
        jBuild4DSystemDevDemo.setRelGroupValue("开发示例相关表关系");
        this.saveSimple(jb4DCSession,TableRelationGroupJBuild4DSystemDevDemo,jBuild4DSystemDevDemo);

        return jBuild4DSystemBaseEntity;
    }

    private void createTableRelation(JB4DCSession jb4DCSession,TableRelationGroupEntity tableGroup,String tableRelationId,String tableRelationName,String tableRelationDesc,String contentJson,String diagramJson) throws JBuild4DCGenerallyException {
        tableRelationService.deleteByKeyNotValidate(jb4DCSession,tableRelationId,JBuild4DCYaml.getWarningOperationCode());
        TableRelationEntity tableRelationEntity=new TableRelationEntity();
        tableRelationEntity.setRelationId(tableRelationId);
        tableRelationEntity.setRelationGroupId(tableGroup.getRelGroupId());
        tableRelationEntity.setRelationName(tableRelationName);
        tableRelationEntity.setRelationDesc(tableRelationDesc);
        tableRelationEntity.setRelationStatus(EnableTypeEnum.enable.getDisplayName());
        tableRelationEntity.setRelationContent(contentJson);
        tableRelationEntity.setRelationDiagramJson(diagramJson);

        tableRelationService.saveSimple(jb4DCSession,tableRelationId,tableRelationEntity);
    }
}