package com.jb4dc.builder.po;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public class TableFieldPO extends TableFieldEntity {
    public String oldFieldName;

    public boolean isUpdateLogicOnly;

    public String tableName;

    public String getOldFieldName() {
        return oldFieldName;
    }

    public void setOldFieldName(String oldFieldName) {
        this.oldFieldName = oldFieldName;
    }

    public boolean isUpdateLogicOnly() {
        return isUpdateLogicOnly;
    }

    public void setUpdateLogicOnly(boolean updateLogicOnly) {
        isUpdateLogicOnly = updateLogicOnly;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    @Override
    public String toString() {
        return super.toString();
    }

    public static List<TableFieldEntity> VoListToEntityList(List<TableFieldPO> tableFieldPOList) throws IOException {
        if(tableFieldPOList ==null)
            return null;
        else if(tableFieldPOList.size()==0){
            return new ArrayList<>();
        }
        String json= JsonUtility.toObjectString(tableFieldPOList);
        List<TableFieldEntity> entityList= JsonUtility.toObjectListIgnoreProp(json,TableFieldEntity.class);
        return entityList;
    }

    public static List<TableFieldPO> EntityListToVoList(String tableName, List<TableFieldEntity> source) throws IOException {
        if(source==null)
            return null;
        else if(source.size()==0){
            return new ArrayList<>();
        }
        String json= JsonUtility.toObjectString(source);
        List<TableFieldPO> result=JsonUtility.toObjectListIgnoreProp(json, TableFieldPO.class);
        for (TableFieldPO tableFieldPO : result) {
            tableFieldPO.setTableName(tableName);
        }

        return result;
    }

    public static TableFieldPO parseToVo(TableFieldEntity entity) throws IOException {
        String jsonStr=JsonUtility.toObjectString(entity);
        return JsonUtility.toObject(jsonStr, TableFieldPO.class);
    }

    public static TableFieldEntity parseToEntity(TableFieldPO vo) throws IOException {
        String jsonStr=JsonUtility.toObjectString(vo);
        return JsonUtility.toObject(jsonStr,TableFieldEntity.class);
    }

    public static boolean isUpdate(TableFieldPO oldVo, TableFieldPO newVo) throws JBuild4DCGenerallyException {
        if(oldVo.getFieldId().equals(newVo.getFieldId())){
            if(!newVo.getFieldName().equals(oldVo.getFieldName())){
                return true;
            }
            else if(!newVo.getFieldDataType().equals(oldVo.getFieldDataType())){
                return true;
            }
            else if(newVo.getFieldDataLength().intValue()!=oldVo.getFieldDataLength().intValue()){
                return true;
            }
            else if(newVo.getFieldDecimalLength().intValue()!=newVo.getFieldDecimalLength().intValue()){
                return true;
            }
            else if(!newVo.getFieldAllowNull().equals(oldVo.getFieldAllowNull())){
                return true;
            }
            return false;
        }
        else
        {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"比较的字段Id不一致!");
        }
    }

    public static boolean isUpdateLogicOnly(TableFieldPO oldVo, TableFieldPO newVo) throws JBuild4DCGenerallyException {
        if(oldVo.getFieldId().equals(newVo.getFieldId())){
            if(!newVo.getFieldDefaultValue().equals(oldVo.getFieldDefaultValue())){
                return true;
            }
            return false;
        }
        else
        {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"比较的字段Id不一致!");
        }
    }
}
