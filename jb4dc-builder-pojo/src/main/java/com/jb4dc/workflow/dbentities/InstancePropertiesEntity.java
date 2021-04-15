package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_instance_properties
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class InstancePropertiesEntity {
    //INST_PROP_ID:
    @DBKeyField
    private String instPropId;

    //INST_PROP_BELONG_INST_ID:所属实例ID
    private String instPropBelongInstId;

    //INST_PROP_BELONG_NODE_ID:所属实例节点ID
    private String instPropBelongNodeId;

    //INST_PROP_NAME:属性名称
    private String instPropName;

    //INST_PROP_VALUE1:属性值1
    private String instPropValue1;

    //INST_PROP_VALUE2:属性值2
    private String instPropValue2;

    //INST_PROP_VALUE3:属性值2
    private String instPropValue3;

    //INST_PROP_TYPE:属性类型
    private String instPropType;

    //INST_PROP_DESC:属性备注
    private String instPropDesc;

    //INST_PROP_ORDER_NUM:排序号
    private Integer instPropOrderNum;

    /**
     * 构造函数
     * @param instPropId
     * @param instPropBelongInstId 所属实例ID
     * @param instPropBelongNodeId 所属实例节点ID
     * @param instPropName 属性名称
     * @param instPropValue1 属性值1
     * @param instPropValue2 属性值2
     * @param instPropValue3 属性值2
     * @param instPropType 属性类型
     * @param instPropDesc 属性备注
     * @param instPropOrderNum 排序号
     **/
    public InstancePropertiesEntity(String instPropId, String instPropBelongInstId, String instPropBelongNodeId, String instPropName, String instPropValue1, String instPropValue2, String instPropValue3, String instPropType, String instPropDesc, Integer instPropOrderNum) {
        this.instPropId = instPropId;
        this.instPropBelongInstId = instPropBelongInstId;
        this.instPropBelongNodeId = instPropBelongNodeId;
        this.instPropName = instPropName;
        this.instPropValue1 = instPropValue1;
        this.instPropValue2 = instPropValue2;
        this.instPropValue3 = instPropValue3;
        this.instPropType = instPropType;
        this.instPropDesc = instPropDesc;
        this.instPropOrderNum = instPropOrderNum;
    }

    public InstancePropertiesEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getInstPropId() {
        return instPropId;
    }

    /**
     *
     * @param instPropId
     **/
    public void setInstPropId(String instPropId) {
        this.instPropId = instPropId == null ? null : instPropId.trim();
    }

    /**
     * 所属实例ID
     * @return java.lang.String
     **/
    public String getInstPropBelongInstId() {
        return instPropBelongInstId;
    }

    /**
     * 所属实例ID
     * @param instPropBelongInstId 所属实例ID
     **/
    public void setInstPropBelongInstId(String instPropBelongInstId) {
        this.instPropBelongInstId = instPropBelongInstId == null ? null : instPropBelongInstId.trim();
    }

    /**
     * 所属实例节点ID
     * @return java.lang.String
     **/
    public String getInstPropBelongNodeId() {
        return instPropBelongNodeId;
    }

    /**
     * 所属实例节点ID
     * @param instPropBelongNodeId 所属实例节点ID
     **/
    public void setInstPropBelongNodeId(String instPropBelongNodeId) {
        this.instPropBelongNodeId = instPropBelongNodeId == null ? null : instPropBelongNodeId.trim();
    }

    /**
     * 属性名称
     * @return java.lang.String
     **/
    public String getInstPropName() {
        return instPropName;
    }

    /**
     * 属性名称
     * @param instPropName 属性名称
     **/
    public void setInstPropName(String instPropName) {
        this.instPropName = instPropName == null ? null : instPropName.trim();
    }

    /**
     * 属性值1
     * @return java.lang.String
     **/
    public String getInstPropValue1() {
        return instPropValue1;
    }

    /**
     * 属性值1
     * @param instPropValue1 属性值1
     **/
    public void setInstPropValue1(String instPropValue1) {
        this.instPropValue1 = instPropValue1 == null ? null : instPropValue1.trim();
    }

    /**
     * 属性值2
     * @return java.lang.String
     **/
    public String getInstPropValue2() {
        return instPropValue2;
    }

    /**
     * 属性值2
     * @param instPropValue2 属性值2
     **/
    public void setInstPropValue2(String instPropValue2) {
        this.instPropValue2 = instPropValue2 == null ? null : instPropValue2.trim();
    }

    /**
     * 属性值2
     * @return java.lang.String
     **/
    public String getInstPropValue3() {
        return instPropValue3;
    }

    /**
     * 属性值2
     * @param instPropValue3 属性值2
     **/
    public void setInstPropValue3(String instPropValue3) {
        this.instPropValue3 = instPropValue3 == null ? null : instPropValue3.trim();
    }

    /**
     * 属性类型
     * @return java.lang.String
     **/
    public String getInstPropType() {
        return instPropType;
    }

    /**
     * 属性类型
     * @param instPropType 属性类型
     **/
    public void setInstPropType(String instPropType) {
        this.instPropType = instPropType == null ? null : instPropType.trim();
    }

    /**
     * 属性备注
     * @return java.lang.String
     **/
    public String getInstPropDesc() {
        return instPropDesc;
    }

    /**
     * 属性备注
     * @param instPropDesc 属性备注
     **/
    public void setInstPropDesc(String instPropDesc) {
        this.instPropDesc = instPropDesc == null ? null : instPropDesc.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getInstPropOrderNum() {
        return instPropOrderNum;
    }

    /**
     * 排序号
     * @param instPropOrderNum 排序号
     **/
    public void setInstPropOrderNum(Integer instPropOrderNum) {
        this.instPropOrderNum = instPropOrderNum;
    }
}