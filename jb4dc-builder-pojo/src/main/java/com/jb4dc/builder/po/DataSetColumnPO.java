package com.jb4dc.builder.po;



import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.dataset.DatasetColumnEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public class DataSetColumnPO extends DatasetColumnEntity {

    public static List<DataSetColumnPO> EntityListToVoList(List<DatasetColumnEntity> source) throws IOException {
        if(source==null)
            return null;
        else if(source.size()==0){
            return new ArrayList<>();
        }
        String json= JsonUtility.toObjectString(source);
        List<DataSetColumnPO> result=JsonUtility.toObjectListIgnoreProp(json, DataSetColumnPO.class);
        return result;
    }
}
