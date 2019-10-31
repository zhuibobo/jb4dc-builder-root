package com.jb4dc.builder.client.service.datastorage.impl;

import com.jb4dc.builder.client.service.datastorage.IFormDataRelationService;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.builder.po.formdata.FormRecordDataPO;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
@Service
public class FormDataRelationServiceImpl implements IFormDataRelationService {

    @Override
    public FormRecordDataRelationPO getMainPO(List<FormRecordDataRelationPO> formRecordDataRelationPOList){
        for (FormRecordDataRelationPO formRecordDataRelationPO : formRecordDataRelationPOList) {
            if(this.isMain(formRecordDataRelationPO)){
                return formRecordDataRelationPO;
            }
        }
        return null;
    }

    @Override
    public FormRecordDataRelationPO getPO(List<FormRecordDataRelationPO> formRecordDataRelationPOList, String id){
        for (FormRecordDataRelationPO formRecordDataRelationPO : formRecordDataRelationPOList) {
            if(formRecordDataRelationPO.getId().equals(id)){
                return formRecordDataRelationPO;
            }
        }
        return null;
    }

    @Override
    public FormRecordDataRelationPO getParentPO(List<FormRecordDataRelationPO> formRecordDataRelationPOList, FormRecordDataRelationPO formRecordDataRelationPO){
        String parentId= formRecordDataRelationPO.getParentId();
        return this.getPO(formRecordDataRelationPOList,parentId);
    }

    @Override
    public boolean isMain(FormRecordDataRelationPO formRecordDataRelationPO){
        return formRecordDataRelationPO.getParentId().equals("-1");
    }

    @Override
    public boolean isNotMain(FormRecordDataRelationPO formRecordDataRelationPO){
        return !this.isMain(formRecordDataRelationPO);
    }

    @Override
    public boolean hasChild(List<FormRecordDataRelationPO> formRecordDataRelationPOList, String id){
        return ListUtility.Exist(formRecordDataRelationPOList, new IListWhereCondition<FormRecordDataRelationPO>() {
            @Override
            public boolean Condition(FormRecordDataRelationPO item) {
                return item.getParentId().equals(id);
            }
        });
    }

    @Override
    public List<FormRecordDataRelationPO> getChildPOList(List<FormRecordDataRelationPO> formRecordDataRelationPOList, String id){
        if(this.hasChild(formRecordDataRelationPOList,id)){
            return ListUtility.Where(formRecordDataRelationPOList, new IListWhereCondition<FormRecordDataRelationPO>() {
                @Override
                public boolean Condition(FormRecordDataRelationPO item) {
                    return item.getParentId().equals(id);
                }
            });
        }
        return null;
    }

    @Override
    public FormRecordDataPO findMainRecordData(List<FormRecordDataRelationPO> formRecordDataRelationPOList){
        FormRecordDataRelationPO formRecordDataRelationPO =getMainPO(formRecordDataRelationPOList);
        List<FormRecordDataPO> recordList= formRecordDataRelationPO.getListDataRecord();
        if(recordList!=null&&recordList.size()>0){
            return recordList.get(0);
        }
        return null;
    }
}
