package com.jb4dc.builder.tool;

import com.jb4dc.builder.po.formdata.FormRecordDataPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/9
 * To change this template use File | Settings | File Templates.
 */
public class FormDataRelationPOUtility {

    public static FormRecordDataRelationPO getMainPO(List<FormRecordDataRelationPO> formRecordDataRelationPOList){
        for (FormRecordDataRelationPO formRecordDataRelationPO : formRecordDataRelationPOList) {
            if(isMain(formRecordDataRelationPO)){
                return formRecordDataRelationPO;
            }
        }
        return null;
    }

    public static FormRecordDataRelationPO getPO(List<FormRecordDataRelationPO> formRecordDataRelationPOList, String id){
        for (FormRecordDataRelationPO formRecordDataRelationPO : formRecordDataRelationPOList) {
            if(formRecordDataRelationPO.getId().equals(id)){
                return formRecordDataRelationPO;
            }
        }
        return null;
    }

    public static FormRecordDataRelationPO getParentPO(List<FormRecordDataRelationPO> formRecordDataRelationPOList, FormRecordDataRelationPO formRecordDataRelationPO){
        String parentId= formRecordDataRelationPO.getParentId();
        return getPO(formRecordDataRelationPOList,parentId);
    }

    public static boolean isMain(FormRecordDataRelationPO formRecordDataRelationPO){
        return formRecordDataRelationPO.getParentId().equals("-1");
    }

    public static boolean isNotMain(FormRecordDataRelationPO formRecordDataRelationPO){
        return !isMain(formRecordDataRelationPO);
    }

    public static boolean hasChild(List<FormRecordDataRelationPO> formRecordDataRelationPOList, String id){
        return ListUtility.Exist(formRecordDataRelationPOList, new IListWhereCondition<FormRecordDataRelationPO>() {
            @Override
            public boolean Condition(FormRecordDataRelationPO item) {
                return item.getParentId().equals(id);
            }
        });
    }

    public static List<FormRecordDataRelationPO> getChildPOList(List<FormRecordDataRelationPO> formRecordDataRelationPOList, String id){
        if(hasChild(formRecordDataRelationPOList,id)){
            return ListUtility.Where(formRecordDataRelationPOList, new IListWhereCondition<FormRecordDataRelationPO>() {
                @Override
                public boolean Condition(FormRecordDataRelationPO item) {
                    return item.getParentId().equals(id);
                }
            });
        }
        return null;
    }

    public static FormRecordDataPO findMainRecordData(List<FormRecordDataRelationPO> formRecordDataRelationPOList){
        FormRecordDataRelationPO formRecordDataRelationPO =getMainPO(formRecordDataRelationPOList);
        List<FormRecordDataPO> recordList= formRecordDataRelationPO.getListDataRecord();
        if(recordList!=null&&recordList.size()>0){
            return recordList.get(0);
        }
        return null;
    }
}
