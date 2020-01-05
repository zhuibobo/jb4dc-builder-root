package com.jb4dc.builder.service.datastorage.impl;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IMetadataService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.service.impl.MetadataServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dao.datastorage.TableFieldMapper;
import com.jb4dc.builder.dao.datastorage.TableMapper;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.exenum.TableFieldTypeEnum;
import com.jb4dc.builder.exenum.TableTypeEnum;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.po.UpdateTableResolvePO;
import com.jb4dc.builder.po.ValidateTableUpdateResultPO;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.builder.service.datastorage.dbtablebuilder.TableBuilederFace;
import com.jb4dc.code.generate.service.ICodeGenerateService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCPhysicalTableException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.exenum.DBTypeEnum;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import org.apache.commons.lang3.StringUtils;
import org.mybatis.generatorex.api.IntrospectedColumn;
import org.mybatis.generatorex.api.IntrospectedTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.beans.PropertyVetoException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
@Service
public class TableServiceImpl extends BaseServiceImpl<TableEntity> implements ITableService
{
    TableBuilederFace tableBuilederFace;
    TableMapper tableMapper;
    TableFieldMapper tableFieldMapper;

    @Autowired
    ICodeGenerateService codeGenerateService;

    //@Autowired
    //IMetadataService metadataService;

    @Autowired
    IDbLinkService dbLinkService;

    @Autowired
    ITableGroupService tableGroupService;

    public TableServiceImpl(TableMapper _tableMapper, TableFieldMapper _tableFieldMapper) throws JBuild4DCGenerallyException {
        super(_tableMapper);
        tableMapper=_tableMapper;
        tableBuilederFace= TableBuilederFace.getInstance();
        tableFieldMapper=_tableFieldMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, TableEntity record) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"未实现该方法");
    }

    @Override
    public int deleteByKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"未实现该方法");
    }

    @Override
    public int deleteByKeyNotValidate(JB4DCSession jb4DCSession, String id, String warningOperationCode) throws JBuild4DCGenerallyException {
        if(warningOperationCode.equals(JBuild4DCYaml.getWarningOperationCode())) {

            tableFieldMapper.deleteByTableId(id);
            return tableMapper.deleteByPrimaryKey(id);
        }
        return 0;
        //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"未实现该方法");
    }

    @Override
    public int deleteAll(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"未实现该方法");
    }

    @Override
    @Transactional(rollbackFor=JBuild4DCGenerallyException.class)
    public void newTable(JB4DCSession jb4DCSession, TableEntity tableEntity, List<TableFieldPO> tableFieldPOList, String groupId) throws JBuild4DCGenerallyException {
        try {
            if (this.existLogicTableName(jb4DCSession,tableEntity.getTableName())) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"TBUILD_TABLE中已经存在表名为" + tableEntity.getTableName() + "的逻辑表!");
            } else {
                TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DCSession,groupId);
                DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DCSession,tableGroupEntity.getTableGroupLinkId());

                //创建物理表
                boolean createPhysicalTable = tableBuilederFace.newTable(tableEntity, tableFieldPOList,tableGroupEntity,dbLinkEntity);
                if (createPhysicalTable) {

                    try {
                        //写入逻辑表
                        tableEntity.setTableGroupId(groupId);
                        tableEntity.setTableCode("T_"+ StringUtility.build1W5DCode(tableMapper.nextOrderNum()));
                        tableEntity.setTableCreator(jb4DCSession.getUserName());
                        tableEntity.setTableCreateTime(new Date());
                        tableEntity.setTableOrderNum(tableMapper.nextOrderNum());
                        tableEntity.setTableUpdater(jb4DCSession.getUserName());
                        tableEntity.setTableUpdateTime(new Date());
                        tableEntity.setTableType(TableTypeEnum.Builder.getText());
                        //tableEntity.setTableDbName(dbLinkEntity.getDbDatabaseName());
                        tableEntity.setTableOrganId(jb4DCSession.getOrganId());
                        tableEntity.setTableOrganName(jb4DCSession.getOrganName());
                        //tableEntity.setTableLinkId(dbLinkEntity.getDbId());
                        if(tableEntity.getTableStatus()==null||tableEntity.getTableStatus().equals("")){
                            tableEntity.setTableStatus(EnableTypeEnum.enable.getDisplayName());
                        }
                        tableMapper.insertSelective(tableEntity);
                        //写入字段
                        List<TableFieldEntity> tableFieldEntityList = TableFieldPO.VoListToEntityList(tableFieldPOList);
                        for (TableFieldEntity fieldEntity : tableFieldEntityList) {
                            fieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNumInTable(tableEntity.getTableId()));
                            fieldEntity.setFieldTableId(tableEntity.getTableId());
                            fieldEntity.setFieldCreator(jb4DCSession.getUserName());
                            fieldEntity.setFieldCreateTime(new Date());
                            fieldEntity.setFieldUpdater(jb4DCSession.getUserName());
                            fieldEntity.setFieldUpdateTime(new Date());
                            tableFieldMapper.insertSelective(fieldEntity);
                        }
                    }
                    catch (Exception ex){
                        //清空数据
                        tableBuilederFace.deleteTable(tableEntity,dbLinkEntity);
                        tableMapper.deleteByPrimaryKey(tableEntity.getTableId());
                        tableFieldMapper.deleteByTableId(tableEntity.getTableId());
                        throw ex;
                    }
                }
            }
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }
    }

    @Override
    public UpdateTableResolvePO updateTableResolve(JB4DCSession jb4DCSession, TableEntity newTableEntity, List<TableFieldPO> newTableFieldPOList) throws IOException, JBuild4DCGenerallyException {
        UpdateTableResolvePO resolveVo=new UpdateTableResolvePO();

        TableEntity oldTableEntity=tableMapper.selectByPrimaryKey(newTableEntity.getTableId());

        //计算出新增列,修改列,删除列的列表
        List<TableFieldEntity> oldTableFieldEntityList=tableFieldMapper.selectByTableId(newTableEntity.getTableId());

        //待删除的字段
        List<TableFieldPO> deleteFields=new ArrayList<>();
        for (TableFieldEntity tableFieldEntity : oldTableFieldEntityList) {
            if(!ListUtility.Exist(newTableFieldPOList, new IListWhereCondition<TableFieldPO>() {
                @Override
                public boolean Condition(TableFieldPO item) {
                    return item.getFieldId().equals(tableFieldEntity.getFieldId());
                }
            })){
                try {
                    deleteFields.add(TableFieldPO.parseToPO(tableFieldEntity));
                } catch (IOException ex) {
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
            }
        }

        //新增的字段
        List<TableFieldPO> newFields=new ArrayList<>();
        for (TableFieldPO tableFieldPO : newTableFieldPOList) {
            if(!ListUtility.Exist(oldTableFieldEntityList, new IListWhereCondition<TableFieldEntity>() {
                @Override
                public boolean Condition(TableFieldEntity item) {
                    return item.getFieldId().equals(tableFieldPO.getFieldId());
                }
            })){
                newFields.add(tableFieldPO);
            }
        }

        //修改的字段
        List<TableFieldPO> updateFields=new ArrayList<>();
        for (TableFieldEntity tableFieldEntity : oldTableFieldEntityList) {
            TableFieldPO newVo = ListUtility.WhereSingle(newTableFieldPOList, new IListWhereCondition<TableFieldPO>() {
                @Override
                public boolean Condition(TableFieldPO item) {
                    return item.getFieldId().equals(tableFieldEntity.getFieldId());
                }
            });
            try {
                if(newVo!=null) {
                    if (TableFieldPO.isUpdate(TableFieldPO.parseToPO(tableFieldEntity), newVo)) {
                        newVo.setOldFieldName(tableFieldEntity.getFieldName());
                        updateFields.add(newVo);
                    }
                    else if (TableFieldPO.isUpdateLogicOnly(TableFieldPO.parseToPO(tableFieldEntity), newVo)) {
                        newVo.setOldFieldName(tableFieldEntity.getFieldName());
                        newVo.setUpdateLogicOnly(true);
                        updateFields.add(newVo);
                    }
                }
            } catch (IOException ex) {
                ex.printStackTrace();
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
            }
        }

        resolveVo.setNewTableEntity(newTableEntity);
        resolveVo.setOldTableEntity(oldTableEntity);
        resolveVo.setNewFields(newFields);
        resolveVo.setUpdateFields(updateFields);
        resolveVo.setDeleteFields(deleteFields);
        resolveVo.setNewTableFieldPOList(newTableFieldPOList);
        resolveVo.setOldTableFieldPOList(TableFieldPO.EntityListToVoList(newTableEntity.getTableName(),newTableEntity.getTableCaption(),oldTableFieldEntityList));

        return resolveVo;
    }

    @Override
    public ValidateTableUpdateResultPO validateTableUpdateEnable(JB4DCSession jb4DCSession, TableEntity newTableEntity, List<TableFieldPO> newTableFieldPOList) throws JBuild4DCGenerallyException, IOException, PropertyVetoException {
        UpdateTableResolvePO updateTableResolvePO =updateTableResolve(jb4DCSession,newTableEntity, newTableFieldPOList);
        return validateTableUpdateEnable(jb4DCSession, updateTableResolvePO);
    }

    @Override
    public ValidateTableUpdateResultPO validateTableUpdateEnable(JB4DCSession jb4DCSession, UpdateTableResolvePO resolveVo) throws JBuild4DCGenerallyException, PropertyVetoException {
        ValidateTableUpdateResultPO validateTableUpdateResultPO =new ValidateTableUpdateResultPO();

        TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DCSession,resolveVo.getNewTableEntity().getTableGroupId());
        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DCSession,tableGroupEntity.getTableGroupLinkId());

        if(!resolveVo.getOldTableEntity().getTableName().equals(resolveVo.getNewTableEntity().getTableName())){
            validateTableUpdateResultPO.setEnable(false);
            validateTableUpdateResultPO.setMessage("表名不能修改!");
            return validateTableUpdateResultPO;
        }
        int limitNum=1000;
        if(tableBuilederFace.recordCount(resolveVo.getOldTableEntity(),dbLinkEntity)>limitNum){
            if(resolveVo.getUpdateFields().size()>0){
                validateTableUpdateResultPO.setEnable(false);
                validateTableUpdateResultPO.setMessage("表"+resolveVo.getOldTableEntity().getTableName()+"的记录条数>"+limitNum+",不允许进行字段的修改,如需修改,请手动修改!");
                return validateTableUpdateResultPO;
            }
            else if(resolveVo.getDeleteFields().size()>0){
                validateTableUpdateResultPO.setEnable(false);
                validateTableUpdateResultPO.setMessage("表"+resolveVo.getOldTableEntity().getTableName()+"的记录条数>"+limitNum+",不允许进行字段的删除,如需修改,请手动修改!");
                return validateTableUpdateResultPO;
            }
        }

        validateTableUpdateResultPO.setEnable(true);
        validateTableUpdateResultPO.setMessage("");
        return validateTableUpdateResultPO;
    }

    @Override
    @Transactional(rollbackFor=JBuild4DCGenerallyException.class)
    public List<String> updateTable(JB4DCSession jb4DCSession, TableEntity newTableEntity, List<TableFieldPO> newTableFieldPOList, boolean ignorePhysicalError) throws JBuild4DCGenerallyException, IOException, PropertyVetoException {
        List<String> resultMessage=new ArrayList<>();

        UpdateTableResolvePO updateTableResolvePO =updateTableResolve(jb4DCSession,newTableEntity, newTableFieldPOList);

        TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DCSession,newTableEntity.getTableGroupId());
        if(newTableEntity.getTableGroupId()==null||newTableEntity.getTableGroupId().equals("")) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"newTableEntity中的TableGroupId不能为空!");
        }
        if(tableGroupEntity.getTableGroupLinkId()==null||tableGroupEntity.getTableGroupLinkId().equals("")) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"newTableEntity中的TableLinkId不能为空!");
        }
        //TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DCSession,newTableEntity.getTableGroupId());
        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DCSession,tableGroupEntity.getTableGroupLinkId());

        //判断能否进行表的修改
        ValidateTableUpdateResultPO validateTableUpdateResultPO =this.validateTableUpdateEnable(jb4DCSession, updateTableResolvePO);
        if(!validateTableUpdateResultPO.isEnable()){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, validateTableUpdateResultPO.getMessage());
        }

        try
        {

            //修改物理表结构
            try {
                tableBuilederFace.updateTable(newTableEntity, updateTableResolvePO.getNewFields(), updateTableResolvePO.getUpdateFields(), updateTableResolvePO.getDeleteFields(),tableGroupEntity,dbLinkEntity);
            }
            catch (Exception ex){
                if(ignorePhysicalError){
                    resultMessage.add("修改物理表失败!");
                }
                else{
                    throw ex;
                }
            }
            //修改表的逻辑结构
            tableMapper.updateByPrimaryKeySelective(newTableEntity);
            //写入逻辑表
            newTableEntity.setTableUpdater(jb4DCSession.getUserName());
            newTableEntity.setTableUpdateTime(new Date());
            tableMapper.updateByPrimaryKeySelective(newTableEntity);
            //新增字段
            for (TableFieldEntity newfieldEntity : updateTableResolvePO.getNewFields()) {
                newfieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNumInTable(newTableEntity.getTableId()));
                newfieldEntity.setFieldTableId(newTableEntity.getTableId());
                newfieldEntity.setFieldCreator(jb4DCSession.getUserName());
                newfieldEntity.setFieldCreateTime(new Date());
                int i;
                newfieldEntity.setFieldUpdater(jb4DCSession.getUserName());
                newfieldEntity.setFieldUpdateTime(new Date());
                tableFieldMapper.insertSelective(newfieldEntity);
            }
            //修改字段
            for (TableFieldEntity updateField : updateTableResolvePO.getUpdateFields()) {
                updateField.setFieldUpdater(jb4DCSession.getUserName());
                updateField.setFieldUpdateTime(new Date());
                tableFieldMapper.updateByPrimaryKeySelective(updateField);
            }
            //删除字段
            for (TableFieldEntity fieldEntity : updateTableResolvePO.getDeleteFields()) {
                tableFieldMapper.deleteByPrimaryKey(fieldEntity.getFieldId());
            }
            return resultMessage;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }
    }

    @Override
    public boolean existLogicTableName(JB4DCSession jb4DCSession,String tableName) {
        return tableMapper.selectByTableName(tableName)!=null;
    }

    @Override
    public boolean existPhysicsTableName(JB4DCSession jb4DCSession,String tableName) throws JBuild4DCGenerallyException, PropertyVetoException {
        TableEntity tableEntity=tableMapper.selectByTableName(tableName);
        if(tableEntity==null){
            return false;
        }
        TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DCSession,tableEntity.getTableGroupId());
        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DCSession,tableGroupEntity.getTableGroupLinkId());
        return tableBuilederFace.isExistTable(tableName,dbLinkEntity);
    }

    @Override
    public boolean deletePhysicsTable(JB4DCSession jb4DCSession, String tableName, String warningOperationCode, boolean validateDeleteEnable) throws JBuild4DCSQLKeyWordException, JBuild4DCPhysicalTableException, JBuild4DCGenerallyException, PropertyVetoException {
        if(JBuild4DCYaml.getWarningOperationCode().equals(warningOperationCode)) {
            TableEntity tableEntity=tableMapper.selectByTableName(tableName);
            TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DCSession,tableEntity.getTableGroupId());
            DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DCSession,tableGroupEntity.getTableGroupLinkId());
            return tableBuilederFace.deleteTable(tableName,dbLinkEntity,validateDeleteEnable);
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"删除失败WarningOperationCode错误");
    }

    @Override
    public boolean deleteLogicTableAndFields(JB4DCSession jb4DCSession, String tableName, String warningOperationCode) throws JBuild4DCGenerallyException {
        TableEntity tableEntity=tableMapper.selectByTableName(tableName);
        if(tableEntity!=null){
            tableMapper.deleteByPrimaryKey(tableEntity.getTableId());
            tableFieldMapper.deleteByTableId(tableEntity.getTableId());
            return true;
        }
        return true;
    }

    @Override
    public TableEntity getByTableName(JB4DCSession jb4DCSession,String newTableName) {
        return tableMapper.selectByTableName(newTableName);
    }

    @Override
    public void registerSystemTableToBuilderToModule(JB4DCSession jb4DCSession, String tableName, TableGroupEntity tableGroupEntity) throws JBuild4DCGenerallyException {
        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DCSession,tableGroupEntity.getTableGroupLinkId());

        if(dbLinkEntity.getDbIsLocation().equals(TrueFalseEnum.True.getDisplayName())){
            dbLinkEntity=dbLinkService.getLocationDBByYML(jb4DCSession);
            //dbLinkEntity.setDbDriverName(DBYaml.get);
        }

        IntrospectedTable tableInfo=codeGenerateService.getTableInfo(tableName,dbLinkEntity.getDbDriverName(),dbLinkEntity.getDbUrl(),dbLinkEntity.getDbUser(),dbLinkEntity.getDbPassword());

        IMetadataService metadataService=MetadataServiceImpl.getInstance(dbLinkEntity.getDbDriverName(),dbLinkEntity.getDbUrl(),dbLinkEntity.getDbUser(),dbLinkEntity.getDbPassword());

        if(tableInfo!=null) {
            //删除旧的逻辑记录.
            this.deleteLogicTableAndFields(jb4DCSession, tableName, JBuild4DCYaml.getWarningOperationCode());
            //写入新的逻辑记录.
            //String tableName=tableInfo.getFullyQualifiedTable().getIntrospectedTableName().toUpperCase();
            String tableComment = tableInfo.getRemarks();
            if (tableComment == null || tableComment.equals("")) {
                tableComment = metadataService.getTableComment(DBTypeEnum.getEnum(dbLinkEntity.getDbType()),tableName,dbLinkEntity.getDbDatabaseName());
                if(tableComment==null||tableComment.equals("")){
                    tableComment=tableName;
                }
            }
            String tableId= StringUtils.join(tableName.split(""), "_");
            TableEntity tableEntity = new TableEntity();
            tableEntity.setTableId(tableId);
            tableEntity.setTableCode("T_"+StringUtility.build1W5DCode(tableMapper.nextOrderNum()));
            tableEntity.setTableCaption(tableComment.split(":")[0]);
            tableEntity.setTableName(tableName);
            //tableEntity.setTableDbname("JBuild4D");
            tableEntity.setTableCreateTime(new Date());
            tableEntity.setTableCreator(jb4DCSession.getUserName());
            tableEntity.setTableUpdateTime(new Date());
            tableEntity.setTableUpdater(jb4DCSession.getUserName());
            tableEntity.setTableServiceValue("");
            tableEntity.setTableType(TableTypeEnum.DBDesign.getText());
            tableEntity.setTableIsSystem(TrueFalseEnum.True.getDisplayName());
            tableEntity.setTableOrderNum(tableMapper.nextOrderNum());
            tableEntity.setTableDesc(tableComment);
            tableEntity.setTableGroupId(tableGroupEntity.getTableGroupId());
            tableEntity.setTableStatus(EnableTypeEnum.enable.getDisplayName());
            //tableEntity.setTableLinkId("");
            tableEntity.setTableOrganId(jb4DCSession.getOrganId());
            tableEntity.setTableOrganName(jb4DCSession.getOrganName());
            //tableEntity.setTableLinkId(dbLinkEntity.getDbId());
            //tableEntity.setTableDbName();
            tableMapper.insert(tableEntity);

            for (IntrospectedColumn primaryKeyColumn : tableInfo.getPrimaryKeyColumns()) {
                this.registerSystemTableFieldToBuilderToModule(jb4DCSession,tableEntity,primaryKeyColumn,true);
            }

            for (IntrospectedColumn nonPrimaryKeyColumn : tableInfo.getNonPrimaryKeyColumns()) {
                this.registerSystemTableFieldToBuilderToModule(jb4DCSession,tableEntity,nonPrimaryKeyColumn,false);
            }

        }
        else {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"获取不到表:"+tableName+"的信息!");
        }
    }

    @Override
    public List<TableEntity> getTablesByTableIds(JB4DCSession session, List<String> tableIds) {
        return tableMapper.selectByTableIds(tableIds);
    }

    @Override
    public boolean testTablesInTheSameDBLink(JB4DCSession jb4DCSession,List tableList) throws JBuild4DCGenerallyException {
        String sameDBLinkId="";
        for (Object o : tableList) {
            String tableName=o.toString();
            TableEntity tableEntity=tableMapper.selectByTableName(tableName);
            TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DCSession,tableEntity.getTableGroupId());
            if(tableEntity==null){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"不存在表:"+tableName);
            }
            if(sameDBLinkId.equals("")){
                sameDBLinkId=tableGroupEntity.getTableGroupLinkId();
            }
            else{
                if(!sameDBLinkId.equals(tableGroupEntity.getTableGroupLinkId())){
                    return false;
                }
            }
        }
        return true;
    }

    @Override
    public DbLinkEntity getDBLinkByTableName(JB4DCSession jb4DCSession,String tableName) throws JBuild4DCGenerallyException {
        TableEntity tableEntity=tableMapper.selectByTableName(tableName);
        TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DCSession,tableEntity.getTableGroupId());
        return dbLinkService.getByPrimaryKey(jb4DCSession,tableGroupEntity.getTableGroupLinkId());
    }

    private void registerSystemTableFieldToBuilderToModule(JB4DCSession jb4DCSession,TableEntity tableEntity,IntrospectedColumn column,boolean isKey) throws JBuild4DCGenerallyException {
        TableFieldEntity tableFieldEntity=new TableFieldEntity();
        tableFieldEntity.setFieldId(tableEntity.getTableName()+tableFieldMapper.nextOrderNumInTable(tableEntity.getTableId())+column.getActualColumnName());
        tableFieldEntity.setFieldTableId(tableEntity.getTableId());
        tableFieldEntity.setFieldName(column.getActualColumnName());

        String tableCaption=column.getActualColumnName().toUpperCase();
        if(column.getRemarks()!=null&&!column.getRemarks().equals("")){
            tableCaption=column.getRemarks().split(":")[0];
        }

        tableFieldEntity.setFieldCaption(tableCaption);
        tableFieldEntity.setFieldIsPk(isKey?TrueFalseEnum.True.getDisplayName():TrueFalseEnum.False.getDisplayName());
        tableFieldEntity.setFieldAllowNull(column.isNullable()?TrueFalseEnum.True.getDisplayName():TrueFalseEnum.False.getDisplayName());

        String dbFieldType="";
        tableFieldEntity.setFieldDecimalLength(0);
        if(column.getJdbcTypeName().toUpperCase().equals("VARCHAR")||column.getJdbcTypeName().toUpperCase().equals("NVARCHAR")){
            dbFieldType= TableFieldTypeEnum.NVarCharType.getText().trim();
        }
        else if(column.getJdbcTypeName().toUpperCase().equals("INTEGER")||column.getJdbcTypeName().toUpperCase().equals("BIGINT")){
            dbFieldType= TableFieldTypeEnum.IntType.getText().trim();
        }
        else if(column.getJdbcTypeName().toUpperCase().equals("TIMESTAMP")){
            dbFieldType= TableFieldTypeEnum.DataTimeType.getText().trim();
        }
        else if(column.getJdbcTypeName().toUpperCase().equals("LONGVARCHAR")||column.getJdbcTypeName().toUpperCase().equals("LONGVARBINARY")||column.getJdbcTypeName().toUpperCase().equals("VARBINARY")){
            dbFieldType= TableFieldTypeEnum.TextType.getText().trim();
        }
        else if(column.getJdbcTypeName().toUpperCase().equals("DECIMAL")){
            dbFieldType= TableFieldTypeEnum.NumberType.getText().trim();
            tableFieldEntity.setFieldDecimalLength(2);
        }
        else{
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"未知类型:"+column.getJdbcTypeName());
        }
        tableFieldEntity.setFieldDataType(dbFieldType);
        tableFieldEntity.setFieldDataLength(column.getLength());

        tableFieldEntity.setFieldDefaultValue("");
        tableFieldEntity.setFieldDefaultText("");
        tableFieldEntity.setFieldCreateTime(new Date());
        tableFieldEntity.setFieldCreator(jb4DCSession.getUserName());
        tableFieldEntity.setFieldUpdateTime(new Date());
        tableFieldEntity.setFieldUpdater(jb4DCSession.getUserName());
        tableFieldEntity.setFieldDesc(column.getRemarks());
        tableFieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNumInTable(tableEntity.getTableId()));
        tableFieldEntity.setFieldTemplateName("");
        tableFieldEntity.setFieldDefaultType("");

        tableFieldMapper.insert(tableFieldEntity);
    }
}
