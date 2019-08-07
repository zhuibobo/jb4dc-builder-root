package com.jb4dc.builder.webpackage.rest.builder.dataset;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/1
 * To change this template use File | Settings | File Templates.
 */

import com.github.pagehelper.PageInfo;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.search.GeneralSearchUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;
import com.jb4dc.builder.dbentities.dataset.DatasetGroupEntity;
import com.jb4dc.builder.po.DataSetVo;
import com.jb4dc.builder.po.ZTreeNodePOConvert;
import com.jb4dc.builder.service.dataset.IDatasetGroupService;
import com.jb4dc.builder.service.dataset.IDatasetService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Builder/DataSet/DataSetMain")
public class DataSetMainRest  {
    @Autowired
    IDatasetService datasetService;

    @Autowired
    IDatasetGroupService datasetGroupService;

    @RequestMapping(value = "/GetDataSetData")
    public JBuild4DCResponseVo getDataSetData(String op, String recordId) throws JBuild4DCGenerallyException, IOException {
        DataSetVo dataSetVo = datasetService.getVoByPrimaryKey(JB4DCSessionUtility.getSession(),recordId);
        return JBuild4DCResponseVo.success("获取数据成功!",dataSetVo);
    }

    @RequestMapping(value = "/GetApiDataSetVoStructure")
    public JBuild4DCResponseVo getApiDataSetVoStructure(String op,String recordId,String groupId,String fullClassName) throws InstantiationException, IllegalAccessException {
        DataSetVo dataSetVo = datasetService.getApiDataSetVoStructure(JB4DCSessionUtility.getSession(),recordId,op,groupId,fullClassName);
        return JBuild4DCResponseVo.success("获取数据成功!",dataSetVo);
    }

    @RequestMapping(value = "/SaveDataSetEdit")
    public JBuild4DCResponseVo saveDataSetEdit(String op,String dataSetId, String dataSetVoJson) throws JBuild4DCGenerallyException, IOException {
        DataSetVo dataSetVo = JsonUtility.toObjectIgnoreProp(dataSetVoJson, DataSetVo.class);
        datasetService.saveDataSetVo(JB4DCSessionUtility.getSession(), dataSetId, dataSetVo);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/DeleteDataSet")
    public JBuild4DCResponseVo deleteDataSet(String dataSetId) throws JBuild4DCGenerallyException, IOException {
        datasetService.deleteByKey(JB4DCSessionUtility.getSession(), dataSetId);
        return JBuild4DCResponseVo.success("删除数据集成功!");
    }

    @RequestMapping(value = "/GetListData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getListData(Integer pageSize,Integer pageNum,String searchCondition) throws IOException, ParseException {

        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<DatasetEntity> proOrganPageInfo=datasetService.getPage(jb4DCSession,pageNum,pageSize,searchMap);
        JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
        responseVo.setData(proOrganPageInfo);
        responseVo.setMessage("获取成功");
        responseVo.setSuccess(true);
        return responseVo;
    }

    @RequestMapping(value = "/GetDataSetsForZTreeNodeList", method = RequestMethod.POST)
    public JBuild4DCResponseVo getDataSetsForZTreeNodeList(){
        try {
            JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
            responseVo.setSuccess(true);
            responseVo.setMessage("获取数据成功！");

            JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();

            List<DatasetGroupEntity> tableGroupEntityList=datasetGroupService.getALL(jb4DCSession);
            List<DatasetEntity> tableEntityList=datasetService.getALL(jb4DCSession);

            responseVo.setData(ZTreeNodePOConvert.parseDataSetToZTreeNodeList(tableGroupEntityList,tableEntityList));

            return responseVo;
        }
        catch (Exception ex){
            return JBuild4DCResponseVo.error(ex.getMessage());
        }
    }
}