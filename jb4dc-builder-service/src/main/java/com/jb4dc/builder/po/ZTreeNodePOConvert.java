package com.jb4dc.builder.po;

import com.jb4dc.base.service.po.ZTreeNodePO;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;
import com.jb4dc.builder.dbentities.dataset.DatasetGroupEntity;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableGroupEntity;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/31
 * To change this template use File | Settings | File Templates.
 */
public class ZTreeNodePOConvert extends ZTreeNodePO {
    public static List<ZTreeNodePO> parseTableToZTreeNodeList(List<TableGroupEntity> tableGroupEntityList, List<TableEntity> tableEntityList){
        List<ZTreeNodePO> result=new ArrayList<>();
        for (TableGroupEntity tableGroupEntity : tableGroupEntityList) {
            ZTreeNodePO nodeVo=new ZTreeNodePO();
            nodeVo.setId(tableGroupEntity.getTableGroupId());
            nodeVo.setValue(tableGroupEntity.getTableGroupValue());
            nodeVo.setText(tableGroupEntity.getTableGroupText());
            nodeVo.setAttr1(tableGroupEntity.getTableGroupText());
            nodeVo.setParentId(tableGroupEntity.getTableGroupParentId());
            nodeVo.setNocheck(true);
            nodeVo.setNodeTypeName("TableGroup");
            nodeVo.setOuterId(tableGroupEntity.getTableGroupLinkId());
            result.add(nodeVo);
        }

        for (TableEntity tableEntity : tableEntityList) {
            ZTreeNodePO nodeVo=new ZTreeNodePO();
            nodeVo.setId(tableEntity.getTableId());
            nodeVo.setValue(tableEntity.getTableName());
            nodeVo.setText("【"+tableEntity.getTableCode()+"】"+tableEntity.getTableCaption()+"【"+tableEntity.getTableName()+"】");
            nodeVo.setAttr1(tableEntity.getTableCaption());
            nodeVo.setParentId(tableEntity.getTableGroupId());
            nodeVo.setNodeTypeName("Table");
            nodeVo.setNocheck(false);
            //nodeVo.setOuterId(tableEntity.getTableLinkId());
            nodeVo.setCode(tableEntity.getTableCode());
            result.add(nodeVo);
        }

        return result;
    }

    public static List<ZTreeNodePO> parseDataSetToZTreeNodeList(List<DatasetGroupEntity> datasetGroupEntityList, List<DatasetEntity> datasetEntityList){
        List<ZTreeNodePO> result=new ArrayList<>();
        for (DatasetGroupEntity group : datasetGroupEntityList) {
            ZTreeNodePO nodeVo=new ZTreeNodePO();
            nodeVo.setId(group.getDsGroupId());
            nodeVo.setValue(group.getDsGroupValue());
            nodeVo.setText(group.getDsGroupText());
            nodeVo.setAttr1(group.getDsGroupText());
            nodeVo.setParentId(group.getDsGroupParentId());
            nodeVo.setNocheck(true);
            nodeVo.setNodeTypeName("DataSetGroup");
            result.add(nodeVo);
        }

        for (DatasetEntity datasetEntity : datasetEntityList) {
            ZTreeNodePO nodeVo=new ZTreeNodePO();
            nodeVo.setId(datasetEntity.getDsId());
            nodeVo.setValue(datasetEntity.getDsName());
            nodeVo.setText(datasetEntity.getDsCaption()+"【"+datasetEntity.getDsCode()+"】");
            nodeVo.setAttr1(datasetEntity.getDsCaption());
            nodeVo.setParentId(datasetEntity.getDsGroupId());
            nodeVo.setNodeTypeName("DataSet");
            nodeVo.setNocheck(false);
            result.add(nodeVo);
        }

        return result;
    }

    public static List<ZTreeNodePO> parseWebFormToZTreeNodeList(List<ModuleEntity> moduleEntityList, List<FormResourceEntity> formResourceEntityList) {
        Map<String, ModuleEntity> temp=new HashMap<>();
        List<ZTreeNodePO> result=new ArrayList<>();
        for (ModuleEntity moduleEntity : moduleEntityList) {
            ZTreeNodePO nodeVo=new ZTreeNodePO();
            nodeVo.setId(moduleEntity.getModuleId());
            nodeVo.setValue(moduleEntity.getModuleValue());
            nodeVo.setText(moduleEntity.getModuleText());
            nodeVo.setAttr1(moduleEntity.getModuleText());
            nodeVo.setParentId(moduleEntity.getModuleParentId());
            nodeVo.setNocheck(true);
            nodeVo.setNodeTypeName("Module");
            result.add(nodeVo);

            temp.put(moduleEntity.getModuleId(),moduleEntity);
        }

        for (FormResourceEntity formResourceEntity : formResourceEntityList) {
            ZTreeNodePO nodeVo=new ZTreeNodePO();
            nodeVo.setId(formResourceEntity.getFormId());
            nodeVo.setValue(formResourceEntity.getFormId());
            nodeVo.setText(formResourceEntity.getFormName()+"【"+formResourceEntity.getFormCode()+"】");
            nodeVo.setAttr1(formResourceEntity.getFormName());
            nodeVo.setAttr2(formResourceEntity.getFormCode());
            nodeVo.setAttr3(temp.get(formResourceEntity.getFormModuleId()).getModuleText());
            nodeVo.setAttr4(formResourceEntity.getFormModuleId());
            nodeVo.setParentId(formResourceEntity.getFormModuleId());
            nodeVo.setNodeTypeName("WebForm");
            nodeVo.setNocheck(false);
            result.add(nodeVo);
        }

        return result;
    }

    public static List<ZTreeNodePO> parseApiToZTreeNodeList(List<ApiGroupEntity> apiGroupEntityList, List<ApiItemEntity> apiItemEntityList) {
        List<ZTreeNodePO> result=new ArrayList<>();

        for (ApiGroupEntity groupEntity : apiGroupEntityList) {
            ZTreeNodePO nodeVo=new ZTreeNodePO();
            nodeVo.setId(groupEntity.getApiGroupId());
            nodeVo.setValue(groupEntity.getApiGroupValue());
            nodeVo.setText(groupEntity.getApiGroupText());
            nodeVo.setParentId(groupEntity.getApiGroupParentId());
            nodeVo.setNocheck(true);
            nodeVo.setNodeTypeName("Group");
            result.add(nodeVo);
        }
        for (ApiItemEntity apiEntity : apiItemEntityList) {
            ZTreeNodePO nodeVo=new ZTreeNodePO();
            nodeVo.setId(apiEntity.getApiItemId());
            nodeVo.setValue(apiEntity.getApiItemValue());
            nodeVo.setText(apiEntity.getApiItemText());
            nodeVo.setParentId(apiEntity.getApiItemGroupId());
            nodeVo.setNodeTypeName("API");
            nodeVo.setNocheck(false);
            result.add(nodeVo);
        }
        return result;
    }
}
