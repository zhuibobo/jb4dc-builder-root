package com.jb4dc.builder.dbentities.systemsetting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TSYS_DICTIONARY_GROUP
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class DictionaryGroupEntity {
    //DICT_GROUP_ID:字典分组ID:随机的UUID,主键
    @DBKeyField
    private String dictGroupId;

    //DICT_GROUP_VALUE:字典项分组的键值:必须唯一
    private String dictGroupValue;

    //DICT_GROUP_TEXT:字典项分组的名称
    private String dictGroupText;

    //DICT_GROUP_ORDER_NUM:排序号
    private Integer dictGroupOrderNum;

    //DICT_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dictGroupCreateTime;

    //DICT_GROUP_DESC:备注
    private String dictGroupDesc;

    //DICT_GROUP_STATUS:状态:启用,禁用
    private String dictGroupStatus;

    //DICT_GROUP_PARENT_ID:父节点的ID
    private String dictGroupParentId;

    //DICT_GROUP_IS_SYSTEM:是否是分组
    private String dictGroupIsSystem;

    //DICT_GROUP_DEL_ENABLE:能否删除
    private String dictGroupDelEnable;

    //DICT_GROUP_ENP_ITEM:是否显示空选项:为是时,将默认显示[请选择]为空选项
    private String dictGroupEnpItem;

    /**
     * 构造函数
     * @param dictGroupId 字典分组ID
     * @param dictGroupValue 字典项分组的键值
     * @param dictGroupText 字典项分组的名称
     * @param dictGroupOrderNum 排序号
     * @param dictGroupCreateTime 创建时间
     * @param dictGroupDesc 备注
     * @param dictGroupStatus 状态
     * @param dictGroupParentId 父节点的ID
     * @param dictGroupIsSystem 是否是分组
     * @param dictGroupDelEnable 能否删除
     * @param dictGroupEnpItem 是否显示空选项
     **/
    public DictionaryGroupEntity(String dictGroupId, String dictGroupValue, String dictGroupText, Integer dictGroupOrderNum, Date dictGroupCreateTime, String dictGroupDesc, String dictGroupStatus, String dictGroupParentId, String dictGroupIsSystem, String dictGroupDelEnable, String dictGroupEnpItem) {
        this.dictGroupId = dictGroupId;
        this.dictGroupValue = dictGroupValue;
        this.dictGroupText = dictGroupText;
        this.dictGroupOrderNum = dictGroupOrderNum;
        this.dictGroupCreateTime = dictGroupCreateTime;
        this.dictGroupDesc = dictGroupDesc;
        this.dictGroupStatus = dictGroupStatus;
        this.dictGroupParentId = dictGroupParentId;
        this.dictGroupIsSystem = dictGroupIsSystem;
        this.dictGroupDelEnable = dictGroupDelEnable;
        this.dictGroupEnpItem = dictGroupEnpItem;
    }

    public DictionaryGroupEntity() {
        super();
    }

    /**
     * 字典分组ID:随机的UUID,主键
     * @return java.lang.String
     **/
    public String getDictGroupId() {
        return dictGroupId;
    }

    /**
     * 字典分组ID:随机的UUID,主键
     * @param dictGroupId 字典分组ID
     **/
    public void setDictGroupId(String dictGroupId) {
        this.dictGroupId = dictGroupId == null ? null : dictGroupId.trim();
    }

    /**
     * 字典项分组的键值:必须唯一
     * @return java.lang.String
     **/
    public String getDictGroupValue() {
        return dictGroupValue;
    }

    /**
     * 字典项分组的键值:必须唯一
     * @param dictGroupValue 字典项分组的键值
     **/
    public void setDictGroupValue(String dictGroupValue) {
        this.dictGroupValue = dictGroupValue == null ? null : dictGroupValue.trim();
    }

    /**
     * 字典项分组的名称
     * @return java.lang.String
     **/
    public String getDictGroupText() {
        return dictGroupText;
    }

    /**
     * 字典项分组的名称
     * @param dictGroupText 字典项分组的名称
     **/
    public void setDictGroupText(String dictGroupText) {
        this.dictGroupText = dictGroupText == null ? null : dictGroupText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getDictGroupOrderNum() {
        return dictGroupOrderNum;
    }

    /**
     * 排序号
     * @param dictGroupOrderNum 排序号
     **/
    public void setDictGroupOrderNum(Integer dictGroupOrderNum) {
        this.dictGroupOrderNum = dictGroupOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getDictGroupCreateTime() {
        return dictGroupCreateTime;
    }

    /**
     * 创建时间
     * @param dictGroupCreateTime 创建时间
     **/
    public void setDictGroupCreateTime(Date dictGroupCreateTime) {
        this.dictGroupCreateTime = dictGroupCreateTime;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getDictGroupDesc() {
        return dictGroupDesc;
    }

    /**
     * 备注
     * @param dictGroupDesc 备注
     **/
    public void setDictGroupDesc(String dictGroupDesc) {
        this.dictGroupDesc = dictGroupDesc == null ? null : dictGroupDesc.trim();
    }

    /**
     * 状态:启用,禁用
     * @return java.lang.String
     **/
    public String getDictGroupStatus() {
        return dictGroupStatus;
    }

    /**
     * 状态:启用,禁用
     * @param dictGroupStatus 状态
     **/
    public void setDictGroupStatus(String dictGroupStatus) {
        this.dictGroupStatus = dictGroupStatus == null ? null : dictGroupStatus.trim();
    }

    /**
     * 父节点的ID
     * @return java.lang.String
     **/
    public String getDictGroupParentId() {
        return dictGroupParentId;
    }

    /**
     * 父节点的ID
     * @param dictGroupParentId 父节点的ID
     **/
    public void setDictGroupParentId(String dictGroupParentId) {
        this.dictGroupParentId = dictGroupParentId == null ? null : dictGroupParentId.trim();
    }

    /**
     * 是否是分组
     * @return java.lang.String
     **/
    public String getDictGroupIsSystem() {
        return dictGroupIsSystem;
    }

    /**
     * 是否是分组
     * @param dictGroupIsSystem 是否是分组
     **/
    public void setDictGroupIsSystem(String dictGroupIsSystem) {
        this.dictGroupIsSystem = dictGroupIsSystem == null ? null : dictGroupIsSystem.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getDictGroupDelEnable() {
        return dictGroupDelEnable;
    }

    /**
     * 能否删除
     * @param dictGroupDelEnable 能否删除
     **/
    public void setDictGroupDelEnable(String dictGroupDelEnable) {
        this.dictGroupDelEnable = dictGroupDelEnable == null ? null : dictGroupDelEnable.trim();
    }

    /**
     * 是否显示空选项:为是时,将默认显示[请选择]为空选项
     * @return java.lang.String
     **/
    public String getDictGroupEnpItem() {
        return dictGroupEnpItem;
    }

    /**
     * 是否显示空选项:为是时,将默认显示[请选择]为空选项
     * @param dictGroupEnpItem 是否显示空选项
     **/
    public void setDictGroupEnpItem(String dictGroupEnpItem) {
        this.dictGroupEnpItem = dictGroupEnpItem == null ? null : dictGroupEnpItem.trim();
    }
}