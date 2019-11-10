package com.jb4dc.builder.tool;

import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.builder.po.formdata.FormRecordDataPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.builder.po.formdata.FormRecordFieldDataPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/2
 * To change this template use File | Settings | File Templates.
 */
public class FormRecordComplexPOUtility {

    public static FormRecordDataRelationPO findMainFormRecordDataRelationPO(FormRecordComplexPO formRecordComplexPO){
        FormRecordDataRelationPO mainFormRecordDataRelationPO = formRecordComplexPO.getFormRecordDataRelationPOList().stream().filter(item -> item.isMain() == true).findFirst().get();
        return mainFormRecordDataRelationPO;
    }

    public static List<FormRecordDataRelationPO> findNotMainFormRecordDataRelationPO(FormRecordComplexPO formRecordComplexPO){
        if(formRecordComplexPO.getFormRecordDataRelationPOList().stream().filter(item -> item.isMain() != true).count()>0){
            return formRecordComplexPO.getFormRecordDataRelationPOList().stream().filter(item -> item.isMain() != true).collect(Collectors.toList());
        }
        return null;
    }



}
