package com.jb4dc.builder.po;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntityWithBLOBs;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/6
 * To change this template use File | Settings | File Templates.
 */
public class FormResourcePO extends FormResourceEntityWithBLOBs {

    public String getFormHtmlRuntime() {
        return formHtmlRuntime;
    }

    public void setFormHtmlRuntime(String formHtmlRuntime) {
        this.formHtmlRuntime = formHtmlRuntime;
    }

    private String formHtmlRuntime;

    private List<TablePO> tablePOList;

    private String isIndependenceCurrentOperationType;

    public FormResourcePO() {
    }

    public FormResourcePO(FormResourceEntityWithBLOBs source,String formHtmlRuntime){
        this.setFormId(source.getFormId());
        this.setFormCode(source.getFormCode());
        this.setFormName(source.getFormName());
        this.setFormSingleName(source.getFormSingleName());
        this.setFormCreateTime(source.getFormCreateTime());
        this.setFormCreator(source.getFormCreator());
        this.setFormUpdateTime(source.getFormUpdateTime());
        this.setFormUpdater(source.getFormUpdater());
        this.setFormType(source.getFormType());
        this.setFormIsSystem(source.getFormIsSystem());
        this.setFormOrderNum(source.getFormOrderNum());
        this.setFormDesc(source.getFormDesc());
        this.setFormModuleId(source.getFormModuleId());
        this.setFormStatus(source.getFormStatus());
        this.setFormOrganId(source.getFormOrganId());
        this.setFormOrganName(source.getFormOrganName());
        this.setFormMainTableName(source.getFormMainTableName());
        this.setFormMainTableCaption(source.getFormMainTableCaption());
        this.setFormDataRelation(source.getFormDataRelation());
        this.setFormIsTemplate(source.getFormIsTemplate());
        this.setFormIsResolve(source.getFormIsResolve());
        this.setFormEveryTimeResolve(source.getFormEveryTimeResolve());
        this.setFormHtmlSource(source.getFormHtmlSource());
        this.setFormHtmlResolve(source.getFormHtmlResolve());
        this.setFormJsContent(source.getFormJsContent());
        this.setFormCssContent(source.getFormCssContent());
        this.setFormConfigContent(source.getFormConfigContent());
        this.setFormSource(source.getFormSource());
        this.setFormContentUrl(source.getFormContentUrl());
        this.setFormTheme(source.getFormTheme());
        this.setFormCustServerRenderer(source.getFormCustServerRenderer());
        this.setFormCustRefJs(source.getFormCustRefJs());
        this.setFormCustClientRenderer(source.getFormCustClientRenderer());
        this.setFormCustDesc(source.getFormCustDesc());
        this.setFormMainTableId(source.getFormMainTableId());
        this.setFormInnerButton(source.getFormInnerButton());
        this.setFormOperationType(source.getFormOperationType());
        this.setFormJudgeApi(source.getFormJudgeApi());
        this.setFormJudgeSql(source.getFormJudgeSql());
        this.setFormDesignRemark(source.getFormDesignRemark());
        this.formHtmlRuntime=formHtmlRuntime;
    }

    /*public static FormResourcePO parseToPO(FormResourceEntity entity) throws IOException, JsonProcessingException {
        String jsonStr= JsonUtility.toObjectString(entity);
        return JsonUtility.toObject(jsonStr, FormResourcePO.class);
    }*/

    /*public static List<FormResourcePO> parseToPOList(List<FormResourceEntity> entityList) throws IOException, JsonProcessingException {
        if(entityList==null){
            return new ArrayList<>();
        }
        String jsonStr= JsonUtility.toObjectString(entityList);
        return JsonUtility.toObjectListIgnoreProp(jsonStr, FormResourcePO.class);
    }*/

    public List<TablePO> getTablePOList() {
        return tablePOList;
    }

    public void setTablePOList(List<TablePO> tablePOList) {
        this.tablePOList = tablePOList;
    }

    public String getIsIndependenceCurrentOperationType() {
        return isIndependenceCurrentOperationType;
    }

    public void setIsIndependenceCurrentOperationType(String isIndependenceCurrentOperationType) {
        this.isIndependenceCurrentOperationType = isIndependenceCurrentOperationType;
    }
}
