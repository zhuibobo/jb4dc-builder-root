package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_model_properties
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class ModelPropertiesEntity {
    //MODEL_PROP_ID:
    @DBKeyField
    private String modelPropId;

    //MODEL_PROP_BELONG_MODEL_ID:所属模型ID
    private String modelPropBelongModelId;

    //MODEL_PROP_NAME:属性名称
    private String modelPropName;

    //MODEL_PROP_VALUE:属性值
    private String modelPropValue;

    //MODEL_PROP_DESC:属性备注
    private String modelPropDesc;

    //MODEL_PROP_ORDER_NUM:排序号
    private Integer modelPropOrderNum;

    /**
     * 构造函数
     * @param modelPropId
     * @param modelPropBelongModelId 所属模型ID
     * @param modelPropName 属性名称
     * @param modelPropValue 属性值
     * @param modelPropDesc 属性备注
     * @param modelPropOrderNum 排序号
     **/
    public ModelPropertiesEntity(String modelPropId, String modelPropBelongModelId, String modelPropName, String modelPropValue, String modelPropDesc, Integer modelPropOrderNum) {
        this.modelPropId = modelPropId;
        this.modelPropBelongModelId = modelPropBelongModelId;
        this.modelPropName = modelPropName;
        this.modelPropValue = modelPropValue;
        this.modelPropDesc = modelPropDesc;
        this.modelPropOrderNum = modelPropOrderNum;
    }

    public ModelPropertiesEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getModelPropId() {
        return modelPropId;
    }

    /**
     *
     * @param modelPropId
     **/
    public void setModelPropId(String modelPropId) {
        this.modelPropId = modelPropId == null ? null : modelPropId.trim();
    }

    /**
     * 所属模型ID
     * @return java.lang.String
     **/
    public String getModelPropBelongModelId() {
        return modelPropBelongModelId;
    }

    /**
     * 所属模型ID
     * @param modelPropBelongModelId 所属模型ID
     **/
    public void setModelPropBelongModelId(String modelPropBelongModelId) {
        this.modelPropBelongModelId = modelPropBelongModelId == null ? null : modelPropBelongModelId.trim();
    }

    /**
     * 属性名称
     * @return java.lang.String
     **/
    public String getModelPropName() {
        return modelPropName;
    }

    /**
     * 属性名称
     * @param modelPropName 属性名称
     **/
    public void setModelPropName(String modelPropName) {
        this.modelPropName = modelPropName == null ? null : modelPropName.trim();
    }

    /**
     * 属性值
     * @return java.lang.String
     **/
    public String getModelPropValue() {
        return modelPropValue;
    }

    /**
     * 属性值
     * @param modelPropValue 属性值
     **/
    public void setModelPropValue(String modelPropValue) {
        this.modelPropValue = modelPropValue == null ? null : modelPropValue.trim();
    }

    /**
     * 属性备注
     * @return java.lang.String
     **/
    public String getModelPropDesc() {
        return modelPropDesc;
    }

    /**
     * 属性备注
     * @param modelPropDesc 属性备注
     **/
    public void setModelPropDesc(String modelPropDesc) {
        this.modelPropDesc = modelPropDesc == null ? null : modelPropDesc.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getModelPropOrderNum() {
        return modelPropOrderNum;
    }

    /**
     * 排序号
     * @param modelPropOrderNum 排序号
     **/
    public void setModelPropOrderNum(Integer modelPropOrderNum) {
        this.modelPropOrderNum = modelPropOrderNum;
    }
}