package com.jb4dc.builder.client.service.datastorage;

import com.jb4dc.builder.po.FormDataRelationPO;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
public interface IFormDataRelationService {
    FormDataRelationPO getMainPO(List<FormDataRelationPO> formDataRelationPOList);

    FormDataRelationPO getPO(List<FormDataRelationPO> formDataRelationPOList, String id);

    FormDataRelationPO getParentPO(List<FormDataRelationPO> formDataRelationPOList, FormDataRelationPO formDataRelationPO);

    boolean isMain(FormDataRelationPO formDataRelationPO);

    boolean isNotMain(FormDataRelationPO formDataRelationPO);

    boolean hasChild(List<FormDataRelationPO> formDataRelationPOList, String id);

    List<FormDataRelationPO> getChildPOList(List<FormDataRelationPO> formDataRelationPOList, String id);

    Map findMainRecordData(List<FormDataRelationPO> formDataRelationPOList);
}