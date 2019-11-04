package com.jb4dc.builder.tool;

import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.builder.po.formdata.FormRecordDataPO;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.builder.po.formdata.FormRecordFieldDataPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.util.List;
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

    public static String findIdInFormRecordFieldDataPO(FormRecordDataPO formRecordDataPO) throws JBuild4DCGenerallyException {
        Stream<FormRecordFieldDataPO> formRecordDataPOStream =  formRecordDataPO.getRecordFieldPOList().stream().filter(item -> item.getFieldName().toUpperCase().equals("ID"));
        if(formRecordDataPOStream.count()>0) {
            return formRecordDataPOStream.findFirst().get().getValue();
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"在formRecordDataPO中不存在ID字段!");
    }

    public static List<FormRecordFieldDataPO> findExcludeIdFormRecordFieldList(FormRecordDataPO formRecordDataPO){
        List<FormRecordFieldDataPO> formRecordFieldDataPOList=formRecordDataPO.getRecordFieldPOList().stream().filter(item -> !item.getFieldName().toUpperCase().equals("ID")).collect(Collectors.toList());
        return formRecordFieldDataPOList;
    }

}
