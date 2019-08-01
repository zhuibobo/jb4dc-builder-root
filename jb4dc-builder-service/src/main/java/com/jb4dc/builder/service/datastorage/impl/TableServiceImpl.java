package com.jb4dc.builder.service.datastorage.impl;

import com.jb4dc.base.dbaccess.exenum.EnableTypeEnum;
import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IMetadataService;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dao.datastorage.TableFieldMapper;
import com.jb4dc.builder.dao.datastorage.TableMapper;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.exenum.TableFieldTypeEnum;
import com.jb4dc.builder.exenum.TableTypeEnum;
import com.jb4dc.builder.po.TableFieldVO;
import com.jb4dc.builder.po.UpdateTableResolveVo;
import com.jb4dc.builder.po.ValidateTableUpdateResultVo;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.builder.service.datastorage.dbtablebuilder.TableBuilederFace;
import com.jb4dc.code.generate.service.ICodeGenerateService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCPhysicalTableException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import org.mybatis.generatorex.api.IntrospectedColumn;
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

    //@Autowired
    //ICodeGenerateService codeGenerateService;

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
    public int saveSimple(JB4DCSession jb4DSession, String id, TableEntity record) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"未实现该方法");
    }

    @Override
    public int deleteByKey(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"未实现该方法");
    }

    @Override
    public int deleteByKeyNotValidate(JB4DCSession jb4DSession, String id, String warningOperationCode) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"未实现该方法");
    }

    @Override
    public int deleteAll(JB4DCSession jb4DSession) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"未实现该方法");
    }

    @Override
    @Transactional(rollbackFor=JBuild4DCGenerallyException.class)
    public void newTable(JB4DCSession jb4DSession, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList, String groupId) throws JBuild4DCGenerallyException {
        try {
            if (this.existLogicTableName(jb4DSession,tableEntity.getTableName())) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"TBUILD_TABLE中已经存在表名为" + tableEntity.getTableName() + "的逻辑表!");
            } else {
                TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DSession,groupId);
                DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,tableGroupEntity.getTableGroupLinkId());

                //创建物理表
                boolean createPhysicalTable = tableBuilederFace.newTable(tableEntity, tableFieldVOList,tableGroupEntity,dbLinkEntity);
                if (createPhysicalTable) {

                    try {
                        //写入逻辑表
                        tableEntity.setTableGroupId(groupId);
                        tableEntity.setTableCode("T_"+ StringUtility.build1W5DCode(tableMapper.nextOrderNum()));
                        tableEntity.setTableCreator(jb4DSession.getUserName());
                        tableEntity.setTableCreateTime(new Date());
                        tableEntity.setTableOrderNum(tableMapper.nextOrderNum());
                        tableEntity.setTableUpdater(jb4DSession.getUserName());
                        tableEntity.setTableUpdateTime(new Date());
                        tableEntity.setTableType(TableTypeEnum.Builder.getText());
                        tableEntity.setTableDbName(dbLinkEntity.getDbDatabaseName());
                        tableEntity.setTableOrganId(jb4DSession.getOrganId());
                        tableEntity.setTableOrganName(jb4DSession.getOrganName());
                        tableEntity.setTableLinkId(dbLinkEntity.getDbId());
                        if(tableEntity.getTableStatus()==null||tableEntity.getTableStatus().equals("")){
                            tableEntity.setTableStatus(EnableTypeEnum.enable.getDisplayName());
                        }
                        tableMapper.insertSelective(tableEntity);
                        //写入字段
                        List<TableFieldEntity> tableFieldEntityList = TableFieldVO.VoListToEntityList(tableFieldVOList);
                        for (TableFieldEntity fieldEntity : tableFieldEntityList) {
                            fieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNumInTable(tableEntity.getTableId()));
                            fieldEntity.setFieldTableId(tableEntity.getTableId());
                            fieldEntity.setFieldCreator(jb4DSession.getUserName());
                            fieldEntity.setFieldCreateTime(new Date());
                            fieldEntity.setFieldUpdater(jb4DSession.getUserName());
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
    public UpdateTableResolveVo updateTableResolve(JB4DCSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws IOException, JBuild4DCGenerallyException {
        UpdateTableResolveVo resolveVo=new UpdateTableResolveVo();

        TableEntity oldTableEntity=tableMapper.selectByPrimaryKey(newTableEntity.getTableId());

        //计算出新增列,修改列,删除列的列表
        List<TableFieldEntity> oldTableFieldEntityList=tableFieldMapper.selectByTableId(newTableEntity.getTableId());

        //待删除的字段
        List<TableFieldVO> deleteFields=new ArrayList<>();
        for (TableFieldEntity tableFieldEntity : oldTableFieldEntityList) {
            if(!ListUtility.Exist(newTableFieldVOList, new IListWhereCondition<TableFieldVO>() {
                @Override
                public boolean Condition(TableFieldVO item) {
                    return item.getFieldId().equals(tableFieldEntity.getFieldId());
                }
            })){
                try {
                    deleteFields.add(TableFieldVO.parseToVo(tableFieldEntity));
                } catch (IOException ex) {
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
            }
        }

        //新增的字段
        List<TableFieldVO> newFields=new ArrayList<>();
        for (TableFieldVO tableFieldVO : newTableFieldVOList) {
            if(!ListUtility.Exist(oldTableFieldEntityList, new IListWhereCondition<TableFieldEntity>() {
                @Override
                public boolean Condition(TableFieldEntity item) {
                    return item.getFieldId().equals(tableFieldVO.getFieldId());
                }
            })){
                newFields.add(tableFieldVO);
            }
        }

        //修改的字段
        List<TableFieldVO> updateFields=new ArrayList<>();
        for (TableFieldEntity tableFieldEntity : oldTableFieldEntityList) {
            TableFieldVO newVo = ListUtility.WhereSingle(newTableFieldVOList, new IListWhereCondition<TableFieldVO>() {
                @Override
                public boolean Condition(TableFieldVO item) {
                    return item.getFieldId().equals(tableFieldEntity.getFieldId());
                }
            });
            try {
                if(newVo!=null) {
                    if (TableFieldVO.isUpdate(TableFieldVO.parseToVo(tableFieldEntity), newVo)) {
                        newVo.setOldFieldName(tableFieldEntity.getFieldName());
                        updateFields.add(newVo);
                    }
                    else if (TableFieldVO.isUpdateLogicOnly(TableFieldVO.parseToVo(tableFieldEntity), newVo)) {
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
        resolveVo.setNewTableFieldVOList(newTableFieldVOList);
        resolveVo.setOldTableFieldVOList(TableFieldVO.EntityListToVoList(newTableEntity.getTableName(),oldTableFieldEntityList));

        return resolveVo;
    }

    @Override
    public ValidateTableUpdateResultVo validateTableUpdateEnable(JB4DCSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws JBuild4DCGenerallyException, IOException, PropertyVetoException {
        UpdateTableResolveVo updateTableResolveVo=updateTableResolve(jb4DSession,newTableEntity,newTableFieldVOList);
        return validateTableUpdateEnable(jb4DSession,updateTableResolveVo);
    }

    @Override
    public ValidateTableUpdateResultVo validateTableUpdateEnable(JB4DCSession jb4DSession, UpdateTableResolveVo resolveVo) throws JBuild4DCGenerallyException, PropertyVetoException {
        ValidateTableUpdateResultVo validateTableUpdateResultVo=new ValidateTableUpdateResultVo();

        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,resolveVo.getNewTableEntity().getTableLinkId());

        if(!resolveVo.getOldTableEntity().getTableName().equals(resolveVo.getNewTableEntity().getTableName())){
            validateTableUpdateResultVo.setEnable(false);
            validateTableUpdateResultVo.setMessage("表名不能修改!");
            return validateTableUpdateResultVo;
        }
        int limitNum=1000;
        if(tableBuilederFace.recordCount(resolveVo.getOldTableEntity(),dbLinkEntity)>limitNum){
            if(resolveVo.getUpdateFields().size()>0){
                validateTableUpdateResultVo.setEnable(false);
                validateTableUpdateResultVo.setMessage("表"+resolveVo.getOldTableEntity().getTableName()+"的记录条数>"+limitNum+",不允许进行字段的修改,如需修改,请手动修改!");
                return validateTableUpdateResultVo;
            }
            else if(resolveVo.getDeleteFields().size()>0){
                validateTableUpdateResultVo.setEnable(false);
                validateTableUpdateResultVo.setMessage("表"+resolveVo.getOldTableEntity().getTableName()+"的记录条数>"+limitNum+",不允许进行字段的删除,如需修改,请手动修改!");
                return validateTableUpdateResultVo;
            }
        }

        validateTableUpdateResultVo.setEnable(true);
        validateTableUpdateResultVo.setMessage("");
        return validateTableUpdateResultVo;
    }

    @Override
    @Transactional(rollbackFor=JBuild4DCGenerallyException.class)
    public List<String> updateTable(JB4DCSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList,boolean ignorePhysicalError) throws JBuild4DCGenerallyException, IOException, PropertyVetoException {
        List<String> resultMessage=new ArrayList<>();

        UpdateTableResolveVo updateTableResolveVo=updateTableResolve(jb4DSession,newTableEntity,newTableFieldVOList);

        if(newTableEntity.getTableGroupId()==null||newTableEntity.getTableGroupId().equals("")) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"newTableEntity中的TableGroupId不能为空!");
        }
        if(newTableEntity.getTableLinkId()==null||newTableEntity.getTableLinkId().equals("")) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"newTableEntity中的TableLinkId不能为空!");
        }
        TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DSession,newTableEntity.getTableGroupId());
        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,newTableEntity.getTableLinkId());

        //判断能否进行表的修改
        ValidateTableUpdateResultVo validateTableUpdateResultVo=this.validateTableUpdateEnable(jb4DSession,updateTableResolveVo);
        if(!validateTableUpdateResultVo.isEnable()){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,validateTableUpdateResultVo.getMessage());
        }

        try
        {

            //修改物理表结构
            try {
                tableBuilederFace.updateTable(newTableEntity,updateTableResolveVo.getNewFields(),updateTableResolveVo.getUpdateFields(),updateTableResolveVo.getDeleteFields(),tableGroupEntity,dbLinkEntity);
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
            newTableEntity.setTableUpdater(jb4DSession.getUserName());
            newTableEntity.setTableUpdateTime(new Date());
            tableMapper.updateByPrimaryKeySelective(newTableEntity);
            //新增字段
            for (TableFieldEntity newfieldEntity : updateTableResolveVo.getNewFields()) {
                newfieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNumInTable(newTableEntity.getTableId()));
                newfieldEntity.setFieldTableId(newTableEntity.getTableId());
                newfieldEntity.setFieldCreator(jb4DSession.getUserName());
                newfieldEntity.setFieldCreateTime(new Date());
                int i;
                newfieldEntity.setFieldUpdater(jb4DSession.getUserName());
                newfieldEntity.setFieldUpdateTime(new Date());
                tableFieldMapper.insertSelective(newfieldEntity);
            }
            //修改字段
            for (TableFieldEntity updateField : updateTableResolveVo.getUpdateFields()) {
                updateField.setFieldUpdater(jb4DSession.getUserName());
                updateField.setFieldUpdateTime(new Date());
                tableFieldMapper.updateByPrimaryKeySelective(updateField);
            }
            //删除字段
            for (TableFieldEntity fieldEntity : updateTableResolveVo.getDeleteFields()) {
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
    public boolean existLogicTableName(JB4DCSession jb4DSession,String tableName) {
        return tableMapper.selectByTableName(tableName)!=null;
    }

    @Override
    public boolean existPhysicsTableName(JB4DCSession jb4DSession,String tableName) throws JBuild4DCGenerallyException, PropertyVetoException {
        TableEntity tableEntity=tableMapper.selectByTableName(tableName);
        if(tableEntity==null){
            return false;
        }
        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,tableEntity.getTableLinkId());
        return tableBuilederFace.isExistTable(tableName,dbLinkEntity);
    }

    @Override
    public boolean deletePhysicsTable(JB4DCSession jb4DSession, String tableName, String warningOperationCode) throws JBuild4DCSQLKeyWordException, JBuild4DCPhysicalTableException, JBuild4DCGenerallyException, PropertyVetoException {
        if(JBuild4DCYaml.getWarningOperationCode().equals(warningOperationCode)) {
            TableEntity tableEntity=tableMapper.selectByTableName(tableName);
            DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,tableEntity.getTableLinkId());
            return tableBuilederFace.deleteTable(tableName,dbLinkEntity);
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"删除失败WarningOperationCode错误");
    }

    @Override
    public boolean deleteLogicTableAndFields(JB4DCSession jb4DSession, String tableName, String warningOperationCode) throws JBuild4DCGenerallyException {
        TableEntity tableEntity=tableMapper.selectByTableName(tableName);
        if(tableEntity!=null){
            tableMapper.deleteByPrimaryKey(tableEntity.getTableId());
            tableFieldMapper.deleteByTableId(tableEntity.getTableId());
            return true;
        }
        return true;
    }

    @Override
    public TableEntity getByTableName(JB4DCSession jb4DSession,String newTableName) {
        return tableMapper.selectByTableName(newTableName);
    }

    @Override
    public void registerSystemTableToBuilderToModule(JB4DCSession jb4DSession, String tableName, TableGroupEntity tableGroupEntity) throws JBuild4DCGenerallyException {
        /*IntrospectedTable tableInfo=codeGenerateService.getTableInfo(tableName);
        if(tableInfo!=null) {
            //删除旧的逻辑记录.
            this.deleteLogicTableAndFields(jb4DSession, tableName, JBuild4DCYaml.getWarningOperationCode());
            //写入新的逻辑记录.
            //String tableName=tableInfo.getFullyQualifiedTable().getIntrospectedTableName().toUpperCase();
            String tableComment = tableInfo.getRemarks();
            if (tableComment == null || tableComment.equals("")) {
                tableComment = metadataService.getTableComment();
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
            tableEntity.setTableCreator(jb4DSession.getUserName());
            tableEntity.setTableUpdateTime(new Date());
            tableEntity.setTableUpdater(jb4DSession.getUserName());
            tableEntity.setTableServiceValue("");
            tableEntity.setTableType(TableTypeEnum.DBDesign.getText());
            tableEntity.setTableIsSystem(TrueFalseEnum.True.getDisplayName());
            tableEntity.setTableOrderNum(tableMapper.nextOrderNum());
            tableEntity.setTableDesc(tableComment);
            tableEntity.setTableGroupId(tableGroupEntity.getTableGroupId());
            tableEntity.setTableStatus(EnableTypeEnum.enable.getDisplayName());
            tableEntity.setTableLinkId("");
            tableEntity.setTableOrganId(jb4DSession.getOrganId());
            tableEntity.setTableOrganName(jb4DSession.getOrganName());
            tableEntity.setTableLinkId(dbLinkService.getLocationDBLinkId());
            tableMapper.insert(tableEntity);

            for (IntrospectedColumn primaryKeyColumn : tableInfo.getPrimaryKeyColumns()) {
                this.registerSystemTableFieldToBuilderToModule(jb4DSession,tableEntity,primaryKeyColumn,true);
            }

            for (IntrospectedColumn nonPrimaryKeyColumn : tableInfo.getNonPrimaryKeyColumns()) {
                this.registerSystemTableFieldToBuilderToModule(jb4DSession,tableEntity,nonPrimaryKeyColumn,false);
            }

        }
        else {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"获取不到表:"+tableName+"的信息!");
        }*/
    }

    @Override
    public List<TableEntity> getTablesByTableIds(JB4DCSession session, List<String> tableIds) {
        return tableMapper.selectByTableIds(tableIds);
    }

    @Override
    public boolean testTablesInTheSameDBLink(JB4DCSession jb4DSession,List tableList) throws JBuild4DCGenerallyException {
        String sameDBLinkId="";
        for (Object o : tableList) {
            String tableName=o.toString();
            TableEntity tableEntity=tableMapper.selectByTableName(tableName);
            if(tableEntity==null){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"不存在表:"+tableName);
            }
            if(sameDBLinkId.equals("")){
                sameDBLinkId=tableEntity.getTableLinkId();
            }
            else{
                if(!sameDBLinkId.equals(tableEntity.getTableLinkId())){
                    return false;
                }
            }
        }
        return true;
    }

    @Override
    public DbLinkEntity getDBLinkByTableName(JB4DCSession jb4DSession,String tableName) throws JBuild4DCGenerallyException {
        TableEntity tableEntity=tableMapper.selectByTableName(tableName);
        return dbLinkService.getByPrimaryKey(jb4DSession,tableEntity.getTableLinkId());
    }

    private void registerSystemTableFieldToBuilderToModule(JB4DCSession jb4DSession,TableEntity tableEntity,IntrospectedColumn column,boolean isKey) throws JBuild4DCGenerallyException {
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
        tableFieldEntity.setFieldCreator(jb4DSession.getUserName());
        tableFieldEntity.setFieldUpdateTime(new Date());
        tableFieldEntity.setFieldUpdater(jb4DSession.getUserName());
        tableFieldEntity.setFieldDesc(column.getRemarks());
        tableFieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNumInTable(tableEntity.getTableId()));
        tableFieldEntity.setFieldTemplateName("");
        tableFieldEntity.setFieldDefaultType("");

        tableFieldMapper.insert(tableFieldEntity);
    }
}
