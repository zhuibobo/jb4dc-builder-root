package com.jb4dc.builder.client.service.datastorage;

import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.builder.po.formdata.FormRecordDataPO;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
public interface IFormDataRelationService {
    FormRecordDataRelationPO getMainPO(List<FormRecordDataRelationPO> formRecordDataRelationPOList);

    FormRecordDataRelationPO getPO(List<FormRecordDataRelationPO> formRecordDataRelationPOList, String id);

    FormRecordDataRelationPO getParentPO(List<FormRecordDataRelationPO> formRecordDataRelationPOList, FormRecordDataRelationPO formRecordDataRelationPO);

    boolean isMain(FormRecordDataRelationPO formRecordDataRelationPO);

    boolean isNotMain(FormRecordDataRelationPO formRecordDataRelationPO);

    boolean hasChild(List<FormRecordDataRelationPO> formRecordDataRelationPOList, String id);

    List<FormRecordDataRelationPO> getChildPOList(List<FormRecordDataRelationPO> formRecordDataRelationPOList, String id);

    FormRecordDataPO findMainRecordData(List<FormRecordDataRelationPO> formRecordDataRelationPOList);
}
