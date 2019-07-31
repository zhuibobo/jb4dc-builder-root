package com.jb4dc.builder.service.datastorage.impl;

import com.jb4dc.base.dbaccess.exenum.EnableTypeEnum;
import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dao.datastorage.DbLinkMapper;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
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
    public DbLinkServiceImpl(DbLinkMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        dbLinkMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, DbLinkEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DbLinkEntity>() {
            @Override
            public DbLinkEntity run(JB4DCSession jb4DSession,DbLinkEntity sourceEntity) throws JBuild4DCGenerallyException {
                //自动创建该连接的表分组根节点
                tableGroupService.deleteByKeyNotValidate(jb4DSession,id, JBuild4DCYaml.getWarningOperationCode());
                tableGroupService.createRootNode(jb4DSession,id,record.getDbLinkName(),record.getDbLinkValue());

                sourceEntity.setDbCreateTime(new Date());
                sourceEntity.setDbOrderNum(dbLinkMapper.nextOrderNum());
                sourceEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());
                sourceEntity.setDbOrganId(jb4DSession.getOrganId());
                sourceEntity.setDbOrganName(jb4DSession.getOrganName());

                if(record.getDbIsLocation()==null||record.getDbIsLocation().equals("")){
                    record.setDbIsLocation(TrueFalseEnum.False.getDisplayName());
                }
                return sourceEntity;
            }
        });
    }

    @Override
    public String getLocationDBLinkId(){
        return "JBuild4dLocationDBLink";
    }

    @Override
    public DbLinkEntity getDBLinkEntity(JB4DCSession jb4DSession) throws JBuild4DCGenerallyException {
        return this.getByPrimaryKey(jb4DSession,this.getLocationDBLinkId());
    }

    @Override
    public void createLocationDBLink(JB4DCSession jb4DSession) throws JBuild4DCGenerallyException {
        DbLinkEntity dbLinkEntity=new DbLinkEntity();
        dbLinkEntity.setDbId(this.getLocationDBLinkId());
        dbLinkEntity.setDbLinkValue("Location");
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
        this.saveSimple(jb4DSession,dbLinkEntity.getDbId(),dbLinkEntity);
    }
}