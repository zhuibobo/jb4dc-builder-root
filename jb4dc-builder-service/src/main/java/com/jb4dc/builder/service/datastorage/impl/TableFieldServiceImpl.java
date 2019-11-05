package com.jb4dc.builder.service.datastorage.impl;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.client.service.envvar.creator.DateTimeVariableCreator;
import com.jb4dc.builder.client.service.envvar.creator.UUIDVariableCreator;
import com.jb4dc.builder.client.service.envvar.creator.UserSessionVariableCreator;
import com.jb4dc.builder.dao.datastorage.TableFieldMapper;
import com.jb4dc.builder.dao.datastorage.TableMapper;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.builder.exenum.TableFieldTypeEnum;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
@Service
public class TableFieldServiceImpl extends BaseServiceImpl<TableFieldEntity> implements ITableFieldService
{
    TableFieldMapper tableFieldMapper;
    TableMapper tableMapper;

    //private TableFieldServiceImpl(TableFieldMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){}

    @Autowired
    public TableFieldServiceImpl(TableFieldMapper _defaultBaseMapper, TableMapper _tableMapper){
        super(_defaultBaseMapper);
        tableFieldMapper=_defaultBaseMapper;
        tableMapper=_tableMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, TableFieldEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<TableFieldEntity>() {
            @Override
            public TableFieldEntity run(JB4DCSession jb4DCSession, TableFieldEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public List<String> getFieldTemplateName() {
        return tableFieldMapper.selectFieldTemplateName();
    }

    @Override
    public List<TableFieldPO> getTemplateFieldsByName(String templateName) throws IOException {
        return TableFieldPO.EntityListToVoList(templateName,tableFieldMapper.selectTemplateFieldsByName(templateName));
    }

    @Override
    public void createTableFieldTemplates(JB4DCSession jb4DCSession) {
        tableFieldMapper.deleteTemplate("通用模版");
        this.createGeneralTableFieldTemplate("通用模版",jb4DCSession);

        tableFieldMapper.deleteTemplate("新闻类模版");
        this.createCMSTableFieldTemplate("新闻类模版",jb4DCSession);

        tableFieldMapper.deleteTemplate("树结构数据模版");
        this.createTreeStructureFieldTemplate("树结构数据模版",jb4DCSession);
    }

    private void createGeneralTableFieldTemplate(String templateName,JB4DCSession jb4DCSession){

        TableFieldEntity idField=newFiled(jb4DCSession,"Template","ID","ID",
                TrueFalseEnum.True,TrueFalseEnum.False,
                TableFieldTypeEnum.NVarCharType,50,0,
                "EnvVar", UUIDVariableCreator.ENV_ID_CODE_UUID_VALUE,UUIDVariableCreator.ENV_ID_CODE_UUID_TEXT,
                "表主键",templateName);
        tableFieldMapper.insert(idField);

        TableFieldEntity createTimeField=newFiled(jb4DCSession,"Template","F_CREATE_TIME","记录时间",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.DataTimeType,20,0,
                "EnvVar", DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_HH_MM_SS_VALUE,DateTimeVariableCreator.ENV_DATETIME_YYYY_MM_DD_HH_MM_SS_TEXT,
                "",templateName);
        tableFieldMapper.insert(createTimeField);

        TableFieldEntity orderNumField=newFiled(jb4DCSession,"Template","F_ORDER_NUM","排序号",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.IntType,20,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(orderNumField);

        TableFieldEntity organIdField=newFiled(jb4DCSession,"Template","F_ORGAN_ID","组织ID",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "EnvVar", UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_ID_VALUE,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_ID_TEXT,
                "",templateName);
        tableFieldMapper.insert(organIdField);

        TableFieldEntity organNameField=newFiled(jb4DCSession,"Template","F_ORGAN_NAME","组织名称",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,100,0,
                "EnvVar",UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_NAME_VALUE,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ORGAN_NAME_TEXT,
                "",templateName);
        tableFieldMapper.insert(organNameField);

        TableFieldEntity userIdField=newFiled(jb4DCSession,"Template","F_USER_ID","用户ID",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "EnvVar",UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ID_VALUE,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_ID_TEXT,
                "",templateName);
        tableFieldMapper.insert(userIdField);

        TableFieldEntity userNameField=newFiled(jb4DCSession,"Template","F_USER_NAME","用户名称",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "EnvVar",UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_NAME_VALUE,UserSessionVariableCreator.ENV_SYSTEM_CURRENT_USER_NAME_TEXT,
                "",templateName);
        tableFieldMapper.insert(userNameField);
    }

    private void createCMSTableFieldTemplate(String templateName,JB4DCSession jb4DCSession){
        this.createGeneralTableFieldTemplate(templateName,jb4DCSession);

        TableFieldEntity mainImgField=newFiled(jb4DCSession,"Template","F_MAIN_IMG_ID","主题图片ID",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(mainImgField);

        TableFieldEntity titleField=newFiled(jb4DCSession,"Template","F_TITLE","标题",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,200,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(titleField);

        TableFieldEntity contentField=newFiled(jb4DCSession,"Template","F_CONTENT","内容",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.TextType,0,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(contentField);

        TableFieldEntity publicTimeField=newFiled(jb4DCSession,"Template","F_PUBLIC_TIME","发布时间",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.DataTimeType,20,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(publicTimeField);

        TableFieldEntity statueField=newFiled(jb4DCSession,"Template","F_PUBLIC_STATUS","发布状态",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(statueField);

        TableFieldEntity keyWordField=newFiled(jb4DCSession,"Template","F_KEY_WORDS","关键字",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,200,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(keyWordField);

        TableFieldEntity columnIdField=newFiled(jb4DCSession,"Template","F_COLUMN_ID","所属栏目ID",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(columnIdField);

        TableFieldEntity authorField=newFiled(jb4DCSession,"Template","F_AUTHOR","作者",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(authorField);
    }

    private void createTreeStructureFieldTemplate(String templateName,JB4DCSession jb4DCSession){
        this.createGeneralTableFieldTemplate(templateName,jb4DCSession);

        TableFieldEntity codeField=newFiled(jb4DCSession,"Template","F_CODE_VALUE","节点编码",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(codeField);

        TableFieldEntity mainImgField=newFiled(jb4DCSession,"Template","F_MAIN_IMG_ID","主题图片ID",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(mainImgField);

        TableFieldEntity parentIdField=newFiled(jb4DCSession,"Template","F_PARENT_ID","父节点ID",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(parentIdField);

        TableFieldEntity parentIdListField=newFiled(jb4DCSession,"Template","F_PARENT_IDLIST","父节点ID列表",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,500,0,
                "","","",
                "",templateName);
        tableFieldMapper.insert(parentIdListField);

        TableFieldEntity parentChildCountField=newFiled(jb4DCSession,"Template","F_CHILD_COUNT","子节点的数量",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.IntType,20,0,
                "","","",
                "子节点的数量:不包含孙节点",templateName);
        tableFieldMapper.insert(parentChildCountField);
    }

    @Override
    public List<TableFieldPO> getTableFieldsByTableId(String tableId) throws IOException {
        TableEntity tableEntity=tableMapper.selectByPrimaryKey(tableId);
        if(tableEntity==null){
            return null;
        }
        return TableFieldPO.EntityListToVoList(tableEntity.getTableName(),tableFieldMapper.selectByTableId(tableId));
    }

    @Override
    public List<TableFieldPO> getTableFieldsByTableName(String rtTableName) throws IOException {
        return TableFieldPO.EntityListToVoList(rtTableName,tableFieldMapper.selectByTableName(rtTableName));
    }

    @Override
    public void deleteByTableId(JB4DCSession session, String tableId) {
        tableFieldMapper.deleteByTableId(tableId);
    }

    @Override
    public List<TableFieldEntity> getTablesFieldsByTableIds(JB4DCSession session, List<String> tableIds) {
        return tableFieldMapper.selectByTableIds(tableIds);
    }

    private TableFieldEntity newFiled(JB4DCSession jb4DCSession, String tableId, String fieldName, String fieldCaption,
                                      TrueFalseEnum pk, TrueFalseEnum allowNull,
                                      TableFieldTypeEnum fieldDataType,int dataLength,int decimalLength,
                                      String fieldDefaultType,String fieldDefaultValue,String fieldDefaultText,String fieldDesc,String templateName
    ){
        TableFieldEntity fieldEntity=new TableFieldEntity();
        fieldEntity.setFieldId(UUIDUtility.getUUID());
        fieldEntity.setFieldTableId(tableId);
        fieldEntity.setFieldName(fieldName);
        fieldEntity.setFieldCaption(fieldCaption);
        fieldEntity.setFieldIsPk(pk.getDisplayName());
        fieldEntity.setFieldAllowNull(allowNull.getDisplayName());
        fieldEntity.setFieldDataType(fieldDataType.getText());
        fieldEntity.setFieldDataLength(dataLength);
        fieldEntity.setFieldDecimalLength(decimalLength);
        fieldEntity.setFieldDefaultType(fieldDefaultType);
        fieldEntity.setFieldDefaultValue(fieldDefaultValue);
        fieldEntity.setFieldDefaultText(fieldDefaultText);
        fieldEntity.setFieldCreateTime(new Date());
        fieldEntity.setFieldCreator(jb4DCSession.getUserName());
        fieldEntity.setFieldUpdateTime(new Date());
        fieldEntity.setFieldUpdater(jb4DCSession.getUserName());
        fieldEntity.setFieldDesc(fieldDesc);
        fieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNum());
        fieldEntity.setFieldTemplateName(templateName);
        return fieldEntity;
    }

    public TableFieldServiceImpl(BaseMapper<TableFieldEntity> _defaultBaseMapper) {
        super(_defaultBaseMapper);
    }

    @Override
    public void moveUp(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        TableFieldEntity selfEntity=tableFieldMapper.selectByPrimaryKey(id);
        TableFieldEntity ltEntity=tableFieldMapper.selectLessThanRecord(id,selfEntity.getFieldTableId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        TableFieldEntity selfEntity=tableFieldMapper.selectByPrimaryKey(id);
        TableFieldEntity ltEntity=tableFieldMapper.selectGreaterThanRecord(id,selfEntity.getFieldTableId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(TableFieldEntity toEntity,TableFieldEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getFieldOrderNum();
            toEntity.setFieldOrderNum(selfEntity.getFieldOrderNum());
            selfEntity.setFieldOrderNum(newNum);
            tableFieldMapper.updateByPrimaryKeySelective(toEntity);
            tableFieldMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
