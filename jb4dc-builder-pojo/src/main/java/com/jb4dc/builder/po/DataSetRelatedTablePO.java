package com.jb4dc.builder.po;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.dataset.DatasetRelatedTableEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public class DataSetRelatedTablePO extends DatasetRelatedTableEntity {
    public static List<DataSetRelatedTablePO> EntityListToVoList(List<DatasetRelatedTableEntity> source) throws IOException {
        if(source==null)
            return null;
        else if(source.size()==0){
            return new ArrayList<>();
        }
        String json= JsonUtility.toObjectString(source);
        List<DataSetRelatedTablePO> result=JsonUtility.toObjectListIgnoreProp(json, DataSetRelatedTablePO.class);
        return result;
    }
}
