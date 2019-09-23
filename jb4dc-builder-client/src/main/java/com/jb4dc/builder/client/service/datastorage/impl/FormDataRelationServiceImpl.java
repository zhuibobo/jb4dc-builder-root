package com.jb4dc.builder.client.service.datastorage.impl;

import com.jb4dc.builder.client.service.datastorage.IFormDataRelationService;
import com.jb4dc.builder.po.FormDataRelationPO;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
@Service
public class FormDataRelationServiceImpl implements IFormDataRelationService {

    @Override
    public FormDataRelationPO getMainPO(List<FormDataRelationPO> formDataRelationPOList){
        for (FormDataRelationPO formDataRelationPO : formDataRelationPOList) {
            if(this.isMain(formDataRelationPO)){
                return formDataRelationPO;
            }
        }
        return null;
    }

    @Override
    public FormDataRelationPO getPO(List<FormDataRelationPO> formDataRelationPOList,String id){
        for (FormDataRelationPO formDataRelationPO : formDataRelationPOList) {
            if(formDataRelationPO.getId().equals(id)){
                return formDataRelationPO;
            }
        }
        return null;
    }

    @Override
    public FormDataRelationPO getParentPO(List<FormDataRelationPO> formDataRelationPOList,FormDataRelationPO formDataRelationPO){
        String parentId=formDataRelationPO.getParentId();
        return this.getPO(formDataRelationPOList,parentId);
    }

    @Override
    public boolean isMain(FormDataRelationPO formDataRelationPO){
        return formDataRelationPO.getParentId().equals("-1");
    }

    @Override
    public boolean isNotMain(FormDataRelationPO formDataRelationPO){
        return !this.isMain(formDataRelationPO);
    }

    @Override
    public boolean hasChild(List<FormDataRelationPO> formDataRelationPOList, String id){
        return ListUtility.Exist(formDataRelationPOList, new IListWhereCondition<FormDataRelationPO>() {
            @Override
            public boolean Condition(FormDataRelationPO item) {
                return item.getParentId().equals(id);
            }
        });
    }

    @Override
    public List<FormDataRelationPO> getChildPOList(List<FormDataRelationPO> formDataRelationPOList, String id){
        if(this.hasChild(formDataRelationPOList,id)){
            return ListUtility.Where(formDataRelationPOList, new IListWhereCondition<FormDataRelationPO>() {
                @Override
                public boolean Condition(FormDataRelationPO item) {
                    return item.getParentId().equals(id);
                }
            });
        }
        return null;
    }

    @Override
    public Map findMainRecordData(List<FormDataRelationPO> formDataRelationPOList){
        FormDataRelationPO formDataRelationPO=getMainPO(formDataRelationPOList);
        List<Map> recordList=formDataRelationPO.getDataRecordList();
        if(recordList!=null&&recordList.size()>0){
            return recordList.get(0);
        }
        return null;
    }
}
