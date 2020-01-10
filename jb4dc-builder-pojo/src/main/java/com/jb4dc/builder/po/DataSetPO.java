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
public class DataSetPO extends DatasetEntity {

    List<DataSetColumnPO> columnVoList;

    List<DataSetRelatedTablePO> relatedTableVoList;

    public List<DataSetColumnPO> getColumnVoList() {
        return columnVoList;
    }

    public void setColumnVoList(List<DataSetColumnPO> columnVoList) {
        this.columnVoList = columnVoList;
    }

    public List<DataSetRelatedTablePO> getRelatedTableVoList() {
        return relatedTableVoList;
    }

    public void setRelatedTableVoList(List<DataSetRelatedTablePO> relatedTableVoList) {
        this.relatedTableVoList = relatedTableVoList;
    }

    public static DataSetPO parseToPO(DatasetEntity entity) throws IOException {
        String jsonStr= JsonUtility.toObjectString(entity);
        return JsonUtility.toObject(jsonStr, DataSetPO.class);
    }
}
