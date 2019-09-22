package com.jb4dc.builder.client.service.datastorage.impl;

import com.jb4dc.builder.client.service.datastorage.IFormDataRelationService;
import com.jb4dc.builder.po.FormDataRelationPO;
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
    public FormDataRelationPO getMainPO(List<FormDataRelationPO> formDataRelationPOList){
        for (FormDataRelationPO formDataRelationPO : formDataRelationPOList) {
            if(formDataRelationPO.getParentId().equals("-1")){
                return formDataRelationPO;
            }
        }
        return null;
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
}
