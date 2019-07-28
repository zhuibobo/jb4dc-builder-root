package com.jb4dc.builder.po;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public class DataSetVo extends DatasetEntity {

    List<DataSetColumnVo> columnVoList;

    List<DataSetRelatedTableVo> relatedTableVoList;

    public List<DataSetColumnVo> getColumnVoList() {
        return columnVoList;
    }

    public void setColumnVoList(List<DataSetColumnVo> columnVoList) {
        this.columnVoList = columnVoList;
    }

    public List<DataSetRelatedTableVo> getRelatedTableVoList() {
        return relatedTableVoList;
    }

    public void setRelatedTableVoList(List<DataSetRelatedTableVo> relatedTableVoList) {
        this.relatedTableVoList = relatedTableVoList;
    }

    public static DataSetVo parseToVo(DatasetEntity entity) throws IOException {
        String jsonStr= JsonUtility.toObjectString(entity);
        return JsonUtility.toObject(jsonStr,DataSetVo.class);
    }
}
