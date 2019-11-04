package com.jb4dc.builder.webpackage.rest.builder.datastorage.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.search.GeneralSearchUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.config.IBuilderConfigService;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.exenum.TableFieldTypeEnum;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.po.ZTreeNodePOConvert;
import com.jb4dc.builder.service.datastorage.IDbLinkService;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.xml.xpath.XPathExpressionException;
import java.beans.PropertyVetoException;
import java.io.IOException;
import java.net.URLDecoder;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Builder/DataStorage/DataBase/Table")
public class TableRest {

    @Autowired
    ITableFieldService tableFieldService;

    @Autowired
    ITableService tableService;

    @Autowired
    IBuilderConfigService builderConfigService;

    @Autowired
    ITableGroupService tableGroupService;

    @Autowired
    IDbLinkService dbLinkService;

    @RequestMapping(value = "/ValidateTableIsNoExist")
    public JBuild4DCResponseVo validateTableIsExist(String tableName) throws PropertyVetoException, JBuild4DCGenerallyException {
        //TableEntity tableEntity=tableService.getByTableName(tableName);
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        if(tableService.existLogicTableName(jb4DCSession,tableName)){
            return JBuild4DCResponseVo.error("已经存在名称为"+tableName+"的逻辑表！");
        }
        else{
            if(tableService.existPhysicsTableName(jb4DCSession,tableName)){
                return JBuild4DCResponseVo.error("已经存在名称为"+tableName+"的物理表！");
            }
        }
        return JBuild4DCResponseVo.success("不存在同名的表！");
    }


    @RequestMapping(value = "/GetEditTableData")
    public JBuild4DCResponseVo getEditTableData(String recordId, String op,String groupId) throws IOException, XPathExpressionException, JBuild4DCGenerallyException {
        JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
        responseVo.setSuccess(true);
        responseVo.setMessage("获取数据成功！");
        List<String> templateNames=tableFieldService.getFieldTemplateName();
        Map<String,List<TableFieldPO>> templateFieldMap=new HashMap<>();
        for (String templateName : templateNames) {
            List<TableFieldPO> templateFields=tableFieldService.getTemplateFieldsByName(templateName);
            for (TableFieldPO templateField : templateFields) { //修改模版的字段ID,避免重复
                templateField.setFieldId(UUIDUtility.getUUID());
                templateField.setFieldTemplateName("FromTemplate:"+templateField.getFieldTemplateName());
            }
            templateFieldMap.put(templateName,templateFields);
        }
        if(op.equals("add")){
            recordId= UUIDUtility.getUUID();
            TableEntity tableEntity=new TableEntity();
            tableEntity.setTableId(recordId);
            tableEntity.setTableGroupId(groupId);
            //modelAndView.addObject("tableEntity",tableEntity);
            //modelAndView.addObject("tableFieldsData","[]");
            responseVo.setData(tableEntity);
            responseVo.addExKVData("tableFieldsData",new ArrayList<>());
        }
        else {
            //modelAndView.addObject("tableEntity",tableService.getByPrimaryKey(JB4DCSessionUtility.getSession(),recordId));
            responseVo.setData(tableService.getByPrimaryKey(JB4DCSessionUtility.getSession(),recordId));
            List<TableFieldPO> tableFieldPOList =tableFieldService.getTableFieldsByTableId(recordId);
            //modelAndView.addObject("tableFieldsData",JsonUtility.toObjectString(tableFieldVOList));
            responseVo.addExKVData("tableFieldsData", tableFieldPOList);
        }
        //modelAndView.addObject("templateFieldGroup",JsonUtility.toObjectString(templateFieldMap));
        //modelAndView.addObject("tablePrefix",builderConfigService.getTablePrefix());
        responseVo.addExKVData("templateFieldGroup",templateFieldMap);
        responseVo.addExKVData("tablePrefix",builderConfigService.getTablePrefix());
        return responseVo;
    }

    @RequestMapping(value = "/GetTableFieldsByTableId")
    public JBuild4DCResponseVo getTableFieldsByTableId(String tableId) throws IOException {
        return JBuild4DCResponseVo.getDataSuccess(tableFieldService.getTableFieldsByTableId(tableId));
    }

    @RequestMapping(value = "/GetTableFieldType")
    public JBuild4DCResponseVo getFieldDataType() throws JBuild4DCGenerallyException {
        return JBuild4DCResponseVo.success("", TableFieldTypeEnum.getJsonString());
    }

    @RequestMapping(value = "/GetFieldTemplateName")
    public JBuild4DCResponseVo getFieldTemplateName(){
        List<String> namesList=tableFieldService.getFieldTemplateName();
        return JBuild4DCResponseVo.success("",namesList);
    }

    @RequestMapping(value = "/GetTemplateFieldsByName")
    public JBuild4DCResponseVo getTemplateFieldsByName(String templateName) throws IOException {
        List<TableFieldPO> tableFieldEntityList=tableFieldService.getTemplateFieldsByName(templateName);
        return JBuild4DCResponseVo.success("",tableFieldEntityList);
    }

    @RequestMapping(value = "/SaveTableEdit")
    public JBuild4DCResponseVo saveTableEdit(String op, String tableEntityJson,String fieldVoListJson,String groupId,boolean ignorePhysicalError) throws IOException, JBuild4DCGenerallyException {
        try {
            tableEntityJson = URLDecoder.decode(URLDecoder.decode(tableEntityJson, "utf-8"),"utf-8");
            fieldVoListJson = URLDecoder.decode(URLDecoder.decode(fieldVoListJson, "utf-8"),"utf-8");
            TableEntity tableEntity = JsonUtility.toObject(tableEntityJson, TableEntity.class);
            List<TableFieldPO> tableFieldPOList = JsonUtility.toObjectListIgnoreProp(fieldVoListJson, TableFieldPO.class);
            if (op.equals("add")) {
                if(groupId==null||groupId.equals("")){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"groupId不能为空!");
                }
                tableService.newTable(JB4DCSessionUtility.getSession(), tableEntity, tableFieldPOList,groupId);
            } else if (op.equals("update")) {
                tableService.updateTable(JB4DCSessionUtility.getSession(), tableEntity, tableFieldPOList, ignorePhysicalError);
            }
            return JBuild4DCResponseVo.opSuccess();
        }
        catch (Exception ex){
            ex.printStackTrace();
            return JBuild4DCResponseVo.error(ex.getMessage());
        }
    }

    @RequestMapping(value = "/GetListData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getListData(Integer pageSize,Integer pageNum,String searchCondition) throws IOException, ParseException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<TableEntity> proOrganPageInfo=tableService.getPage(jb4DCSession,pageNum,pageSize,searchMap);
        return JBuild4DCResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "/Move", method = RequestMethod.POST)
    public JBuild4DCResponseVo move(String recordId, String type , HttpServletRequest request) throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCSession jb4DCSession=JB4DCSessionUtility.getSession();
        if(type.equals("up")) {
            tableFieldService.moveUp(jb4DCSession, recordId);
        }
        else {
            tableFieldService.moveDown(jb4DCSession,recordId);
        }
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/Delete", method = RequestMethod.POST)
    public JBuild4DCResponseVo delete(String recordId) throws JBuild4DCGenerallyException {
        try {
            tableService.deleteByKey(JB4DCSessionUtility.getSession(), recordId);
            return JBuild4DCResponseVo.opSuccess();
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }
    }

    @RequestMapping(value = "/GetTablesForZTreeNodeList", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTablesForZTreeNodeList(){
        try {
            JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
            responseVo.setSuccess(true);
            responseVo.setMessage("获取数据成功！");

            JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();

            List<TableGroupEntity> tableGroupEntityList=tableGroupService.getALL(jb4DCSession);
            List<TableEntity> tableEntityList=tableService.getALL(jb4DCSession);

            responseVo.setData(ZTreeNodePOConvert.parseTableToZTreeNodeList(tableGroupEntityList,tableEntityList));

            List<DbLinkEntity> dbLinkEntityList=dbLinkService.getALL(jb4DCSession);

            Map<String,Object> exKVData=new HashMap<>();
            exKVData.put("dbLinkEntityList",dbLinkEntityList);
            responseVo.setExKVData(exKVData);

            return responseVo;
        }
        catch (Exception ex){
            return JBuild4DCResponseVo.error(ex.getMessage());
        }
    }

    @RequestMapping(value = "/GetTablesFieldsByTableIds",method = RequestMethod.POST)
    public JBuild4DCResponseVo getTablesFieldsByTableIds(@RequestParam("tableIds[]") List<String> tableIds){
        List<TableFieldEntity> tableFieldEntityList=tableFieldService.getTablesFieldsByTableIds(JB4DCSessionUtility.getSession(),tableIds);
        List<TableEntity> tableEntityList=tableService.getTablesByTableIds(JB4DCSessionUtility.getSession(),tableIds);
        JBuild4DCResponseVo responseVo=JBuild4DCResponseVo.getDataSuccess(tableFieldEntityList);
        Map<String,Object> exData=new HashMap();
        exData.put("Tables",tableEntityList);
        responseVo.setExKVData(exData);
        return responseVo;
    }


}
