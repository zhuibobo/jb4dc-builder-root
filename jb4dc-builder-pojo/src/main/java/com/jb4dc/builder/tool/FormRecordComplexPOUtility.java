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

    public static String findIdInFormRecordFieldDataPO(FormRecordDataPO formRecordDataPO) throws JBuild4DCGenerallyException {
        FormRecordFieldDataPO formRecordFieldDataPO =  formRecordDataPO.getRecordFieldPOList().stream().filter(item -> item.getFieldName().toUpperCase().equals("ID")).findFirst().orElse(null);
        if(formRecordFieldDataPO==null) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"在formRecordDataPO中不存在ID字段!");
        }
        return formRecordFieldDataPO.getValue().toString();
    }

    public static List<FormRecordFieldDataPO> findExcludeIdFormRecordFieldList(FormRecordDataPO formRecordDataPO){
        List<FormRecordFieldDataPO> formRecordFieldDataPOList=formRecordDataPO.getRecordFieldPOList().stream().filter(item -> !item.getFieldName().toUpperCase().equals("ID")).collect(Collectors.toList());
        return formRecordFieldDataPOList;
    }

    public static Map<String,FormRecordFieldDataPO> converFormRecordFieldDataPOListToMap(List<FormRecordFieldDataPO> recordFieldPOList) throws JBuild4DCGenerallyException {
        Map<String,FormRecordFieldDataPO> result=new HashMap<>();
        for (FormRecordFieldDataPO formRecordFieldDataPO : recordFieldPOList) {
            if(!result.containsKey(formRecordFieldDataPO.getFieldName())){
                result.put(formRecordFieldDataPO.getFieldName(),formRecordFieldDataPO);
            }
            else{
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"包含多个同名的字段:"+formRecordFieldDataPO.getFieldName()+",表:"+formRecordFieldDataPO.getTableCaption());
            }
        }
        return result;
    }

}
