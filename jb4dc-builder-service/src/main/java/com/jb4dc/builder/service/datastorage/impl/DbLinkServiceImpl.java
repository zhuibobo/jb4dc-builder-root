package com.jb4dc.builder.service.datastorage.impl;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.DBYaml;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dao.datastorage.DbLinkMapper;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.builder.service.dataset.IDatasetGroupService;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class DbLinkServiceImpl extends BaseServiceImpl<DbLinkEntity> implements IDbLinkService
{
    DbLinkMapper dbLinkMapper;

    @Autowired
    ITableGroupService tableGroupService;

    @Autowired
    IDatasetGroupService datasetGroupService;

    @Autowired
    IModuleService moduleService;

    @Autowired
    public DbLinkServiceImpl(DbLinkMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        dbLinkMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, DbLinkEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<DbLinkEntity>() {
            @Override
            public DbLinkEntity run(JB4DCSession jb4DCSession,DbLinkEntity sourceEntity) throws JBuild4DCGenerallyException {
                //自动创建该连接的表分组根节点
                tableGroupService.deleteByKeyNotValidate(jb4DCSession,id, JBuild4DCYaml.getWarningOperationCode());
                tableGroupService.createRootNode(jb4DCSession,id,record.getDbLinkName(),record.getDbLinkValue());

                datasetGroupService.deleteByKeyNotValidate(jb4DCSession,id,JBuild4DCYaml.getWarningOperationCode());
                datasetGroupService.createRootNode(jb4DCSession,id,record.getDbLinkName(),record.getDbLinkValue());

                moduleService.deleteByKeyNotValidate(jb4DCSession,id,JBuild4DCYaml.getWarningOperationCode());
                moduleService.createRootNode(jb4DCSession,id,record.getDbLinkName(),record.getDbLinkValue());

                sourceEntity.setDbCreateTime(new Date());
                sourceEntity.setDbOrderNum(dbLinkMapper.nextOrderNum());
                sourceEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());
                sourceEntity.setDbOrganId(jb4DCSession.getOrganId());
                sourceEntity.setDbOrganName(jb4DCSession.getOrganName());

                if(record.getDbIsLocation()==null||record.getDbIsLocation().equals("")){
                    record.setDbIsLocation(TrueFalseEnum.False.getDisplayName());
                }
                return sourceEntity;
            }
        });
    }

    //@Override
    //public String getLocationDBLinkId(){
    //    return "JBuild4dLocationDBLink";
    //}

    @Override
    public DbLinkEntity getDBLinkEntity(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        return this.getByPrimaryKey(jb4DCSession,this.JBUILD4DC_BUILDER_DB_LINK_ID);
    }

    @Override
    public DbLinkEntity getLocationDBByYML(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        DbLinkEntity entity=getDBLinkEntity(jb4DCSession);
        entity.setDbDriverName(DBYaml.getDriverName());
        entity.setDbDatabaseName(DBYaml.getDatabaseName());
        entity.setDbPassword(DBYaml.getPassword());
        entity.setDbUrl(DBYaml.getUrl());
        entity.setDbType(DBYaml.getDBType().getDisplayName());
        entity.setDbUser(DBYaml.getUser());
        return entity;
    }

    public void createBuilderDBLink(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        DbLinkEntity dbLinkEntity=new DbLinkEntity();
        dbLinkEntity.setDbId(this.JBUILD4DC_BUILDER_DB_LINK_ID);
        dbLinkEntity.setDbLinkValue("JBUILD4DC_BUILDER_DB_LINK_ID");
        dbLinkEntity.setDbLinkName("应用构建库连接");
        dbLinkEntity.setDbType("Location");
        dbLinkEntity.setDbDriverName("Location");
        dbLinkEntity.setDbDatabaseName("Location");
        dbLinkEntity.setDbUrl("Location");
        dbLinkEntity.setDbUser("Location");
        dbLinkEntity.setDbPassword("Location");
        dbLinkEntity.setDbDesc("应用构建库本身数据库连接");
        dbLinkEntity.setDbIsLocation(TrueFalseEnum.True.getDisplayName());
        dbLinkEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());
        this.saveSimple(jb4DCSession,dbLinkEntity.getDbId(),dbLinkEntity);
    }

    public void createSSODBLink(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        DbLinkEntity dbLinkEntity=new DbLinkEntity();
        dbLinkEntity.setDbId(this.JBUILD4DC_SSO_DB_LINK_ID);
        dbLinkEntity.setDbLinkValue("JBUILD4DC_SSO_DB_LINK_ID");
        dbLinkEntity.setDbLinkName("单点登录库连接");
        /*dbLinkEntity.setDbType("sqlserver");
        dbLinkEntity.setDbDriverName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        dbLinkEntity.setDbDatabaseName("JB4DC_SSO_V01");
        dbLinkEntity.setDbUrl("jdbc:sqlserver://127.0.0.1:1433; DatabaseName=JB4DC_SSO_V01");
        dbLinkEntity.setDbUser("sa");
        dbLinkEntity.setDbPassword("sql");*/
        dbLinkEntity.setDbType("mysql");
        dbLinkEntity.setDbDriverName("com.mysql.cj.jdbc.Driver");
        dbLinkEntity.setDbDatabaseName("JB4DC_SSO_V02");
        dbLinkEntity.setDbUrl("jdbc:mysql://58.51.184.124:6316/JB4DC_SSO_V02?characterEncoding=UTF-8&serverTimezone=Asia/Shanghai&nullCatalogMeansCurrent=true&autoReconnect=true&failOverReadOnly=false");
        dbLinkEntity.setDbUser("root");
        dbLinkEntity.setDbPassword("jb4dc#sz#1234");
        dbLinkEntity.setDbDesc("单点登录数据库连接");
        dbLinkEntity.setDbIsLocation(TrueFalseEnum.False.getDisplayName());
        dbLinkEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());
        this.saveSimple(jb4DCSession,dbLinkEntity.getDbId(),dbLinkEntity);
    }

    public void createQCSystemDBLink(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        DbLinkEntity dbLinkEntity=new DbLinkEntity();
        dbLinkEntity.setDbId(this.JBUILD4DC_QC_DB_LINK_ID);
        dbLinkEntity.setDbLinkValue(this.JBUILD4DC_QC_DB_LINK_ID);
        dbLinkEntity.setDbLinkName("运维服务系统库连接");
        dbLinkEntity.setDbType("mysql");
        dbLinkEntity.setDbDriverName("com.mysql.cj.jdbc.Driver");
        dbLinkEntity.setDbDatabaseName("JB4DC_QC_V02");
        dbLinkEntity.setDbUrl("jdbc:mysql://58.51.184.124:6316/JB4DC_QC_V02?characterEncoding=UTF-8&serverTimezone=Asia/Shanghai&nullCatalogMeansCurrent=true&autoReconnect=true&failOverReadOnly=false");
        dbLinkEntity.setDbUser("root");
        dbLinkEntity.setDbPassword("jb4dc#sz#1234");
        dbLinkEntity.setDbDesc("运维服务系统库连接");
        dbLinkEntity.setDbIsLocation(TrueFalseEnum.False.getDisplayName());
        dbLinkEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());
        this.saveSimple(jb4DCSession,dbLinkEntity.getDbId(),dbLinkEntity);
    }

    public void createDevMockDBLink(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        DbLinkEntity dbLinkEntity=new DbLinkEntity();
        dbLinkEntity.setDbId(this.JBUILD4DC_DEV_MOCK_DB_LINK_ID);
        dbLinkEntity.setDbLinkValue("JBUILD4DC_DEV_MOCK_DB_LINK_ID");
        dbLinkEntity.setDbLinkName("开发样例库连接");
        /*dbLinkEntity.setDbType("sqlserver");
        dbLinkEntity.setDbDriverName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        dbLinkEntity.setDbDatabaseName("JB4DC_DEV_MOCK_V01");
        dbLinkEntity.setDbUrl("jdbc:sqlserver://127.0.0.1:1433; DatabaseName=JB4DC_DEV_MOCK_V01");
        dbLinkEntity.setDbUser("sa");
        dbLinkEntity.setDbPassword("sql");*/
        dbLinkEntity.setDbType("mysql");
        dbLinkEntity.setDbDriverName("com.mysql.cj.jdbc.Driver");
        dbLinkEntity.setDbDatabaseName("JB4DC_DEV_MOCK_V01");
        dbLinkEntity.setDbUrl("jdbc:mysql://127.0.0.1:3306/JB4DC_DEV_MOCK_V01?characterEncoding=UTF-8&serverTimezone=Asia/Shanghai&nullCatalogMeansCurrent=true&autoReconnect=true&failOverReadOnly=false");
        dbLinkEntity.setDbUser("root");
        dbLinkEntity.setDbPassword("root");
        dbLinkEntity.setDbDesc("开发样例数据库连接");
        dbLinkEntity.setDbIsLocation(TrueFalseEnum.False.getDisplayName());
        dbLinkEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());
        this.saveSimple(jb4DCSession,dbLinkEntity.getDbId(),dbLinkEntity);
    }

    /*public void createBusinessTestDBLink(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        DbLinkEntity dbLinkEntity=new DbLinkEntity();
        dbLinkEntity.setDbId(this.JBUILD4DC_BUSINESS_TEST_DB_LINK_ID);
        dbLinkEntity.setDbLinkValue("JBUILD4DC_BUSINESS_TEST_DB_LINK_ID");
        dbLinkEntity.setDbLinkName("业务测试库连接");
        dbLinkEntity.setDbType("sqlserver");
        dbLinkEntity.setDbDriverName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        dbLinkEntity.setDbDatabaseName("JB4DC_BUSINESS_V01");
        dbLinkEntity.setDbUrl("jdbc:sqlserver://127.0.0.1:1433; DatabaseName=JB4DC_BUSINESS_V01");
        dbLinkEntity.setDbUser("sa");
        dbLinkEntity.setDbPassword("sql");
        dbLinkEntity.setDbDesc("业务测试数据库连接");
        dbLinkEntity.setDbIsLocation(TrueFalseEnum.False.getDisplayName());
        dbLinkEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());
        this.saveSimple(jb4DCSession,dbLinkEntity.getDbId(),dbLinkEntity);
    }*/

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        this.createBuilderDBLink(jb4DCSession);
        this.createSSODBLink(jb4DCSession);
        //this.createDevMockDBLink(jb4DCSession);
        this.createQCSystemDBLink(jb4DCSession);
        //this.createBusinessTestDBLink(jb4DCSession);
    }
}