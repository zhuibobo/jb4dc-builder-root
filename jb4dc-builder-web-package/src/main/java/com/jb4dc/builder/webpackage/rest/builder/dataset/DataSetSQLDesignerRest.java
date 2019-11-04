package com.jb4dc.builder.webpackage.rest.builder.dataset;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/1
 * To change this template use File | Settings | File Templates.
 */

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.po.SQLResolveToDataSetPO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.po.ZTreeNodePOConvert;
import com.jb4dc.builder.service.dataset.IDatasetService;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.service.datastorage.ITableGroupService;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLDecoder;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Builder/DataSet/DataSetSQLDesigner")
public class DataSetSQLDesignerRest {
    //@Autowired
    //IEnvVariableClientService envVariableService;

    @Autowired
    ITableGroupService tableGroupService;

    @Autowired
    ITableService tableService;

    @Autowired
    IDatasetService datasetService;

    @Autowired
    ITableFieldService tableFieldService;


    @RequestMapping(value = "GetSqlDesignerViewData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getSqlDesignerViewData() {
        try {


            //List<EnvVariablePO> dateTimeVoList=envVariableService.getDateTimeVars();
            //List<EnvVariablePO> apiVarVoList=envVariableService.getAPIVars();

            JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();

            List<TableGroupEntity> tableGroupEntityList=tableGroupService.getALL(jb4DCSession);
            List<TableEntity> tableEntityList=tableService.getALL(jb4DCSession);

            //modelAndView.addObject("datetimeTreeData", JsonUtility.toObjectString(dateTimeVoList));
            //modelAndView.addObject("apiVarTreeData",JsonUtility.toObjectString(apiVarVoList));
            //modelAndView.addObject("tableTreeData", JsonUtility.toObjectString(ZTreeNodeVo.parseTableToZTreeNodeList(tableGroupEntityList,tableEntityList)));

            //responseVo.addExKVData("datetimeTreeData",dateTimeVoList);
            //responseVo.addExKVData("apiVarTreeData",apiVarVoList);

            JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
            responseVo.setSuccess(true);
            responseVo.setMessage("获取数据成功！");

            responseVo.addExKVData("tableTreeData", ZTreeNodePOConvert.parseTableToZTreeNodeList(tableGroupEntityList,tableEntityList));

            return responseVo;
        }
        catch (Exception ex){
            return JBuild4DCResponseVo.error(ex.getMessage());
        }
    }

    @RequestMapping(value = "ValidateSQLEnable", method = RequestMethod.POST)
    public JBuild4DCResponseVo validateSQLEnable(String sqlText) {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            //String sqlValue=datasetService.sqlReplaceEnvTextToEnvValue(jb4DCSession,sqlText);
            //String sqlWithEnvText=sqlText;
            sqlText= URLDecoder.decode(sqlText,"utf-8");
            SQLResolveToDataSetPO sqlResolveToDataSetPO =datasetService.sqlResolveToDataSetVo(jb4DCSession,sqlText);
            //List<TableFieldVO> tableFieldVOList=tableFieldService.getTableFieldsByTableId(tableId);
            return JBuild4DCResponseVo.success("校验成功！", sqlResolveToDataSetPO);
        }
        catch (Exception ex){
            return JBuild4DCResponseVo.error(ex.getMessage());
        }
    }

    @RequestMapping(value = "GetTableField", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTableField(String tableId) {
        try {
            JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
            List<TableFieldPO> tableFieldPOList =tableFieldService.getTableFieldsByTableId(tableId);
            return JBuild4DCResponseVo.success("获取成功", tableFieldPOList);
        }
        catch (Exception ex){
            return JBuild4DCResponseVo.error(ex.getMessage());
        }
    }
}
