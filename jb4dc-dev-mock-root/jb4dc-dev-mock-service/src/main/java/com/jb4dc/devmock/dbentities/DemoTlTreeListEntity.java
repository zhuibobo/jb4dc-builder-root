package com.jb4dc.devmock.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TDEV_DEMO_TL_TREE_LIST
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class DemoTlTreeListEntity {
    //DDTL_ID:null
    @DBKeyField
    private String ddtlId;

    //DDTL_GROUP_ID:null
    private String ddtlGroupId;

    //DDTL_KEY:null
    private String ddtlKey;

    //DDTL_NAME:null
    private String ddtlName;

    //DDTL_VALUE:null
    private String ddtlValue;

    //DDTL_STATUS:null
    private String ddtlStatus;

    //DDTL_DESC:null
    private String ddtlDesc;

    //DDTL_CREATETIME:null
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date ddtlCreatetime;

    //DDTL_ORDER_NUM:null
    private Integer ddtlOrderNum;

    //DDTL_BIND_DIC_SELECTED:null
    private String ddtlBindDicSelected;

    //DDTL_BIND_DIC_RADIO:null
    private String ddtlBindDicRadio;

    //DDTL_DDTT_BIND_DIC_MUCHECKBOX:null
    private String ddtlDdttBindDicMucheckbox;

    /**
     * 构造函数
     * @param ddtlId
     * @param ddtlGroupId
     * @param ddtlKey
     * @param ddtlName
     * @param ddtlValue
     * @param ddtlStatus
     * @param ddtlDesc
     * @param ddtlCreatetime
     * @param ddtlOrderNum
     * @param ddtlBindDicSelected
     * @param ddtlBindDicRadio
     * @param ddtlDdttBindDicMucheckbox
     **/
    public DemoTlTreeListEntity(String ddtlId, String ddtlGroupId, String ddtlKey, String ddtlName, String ddtlValue, String ddtlStatus, String ddtlDesc, Date ddtlCreatetime, Integer ddtlOrderNum, String ddtlBindDicSelected, String ddtlBindDicRadio, String ddtlDdttBindDicMucheckbox) {
        this.ddtlId = ddtlId;
        this.ddtlGroupId = ddtlGroupId;
        this.ddtlKey = ddtlKey;
        this.ddtlName = ddtlName;
        this.ddtlValue = ddtlValue;
        this.ddtlStatus = ddtlStatus;
        this.ddtlDesc = ddtlDesc;
        this.ddtlCreatetime = ddtlCreatetime;
        this.ddtlOrderNum = ddtlOrderNum;
        this.ddtlBindDicSelected = ddtlBindDicSelected;
        this.ddtlBindDicRadio = ddtlBindDicRadio;
        this.ddtlDdttBindDicMucheckbox = ddtlDdttBindDicMucheckbox;
    }

    public DemoTlTreeListEntity() {
        super();
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlId() {
        return ddtlId;
    }

    /**
     * null
     * @param ddtlId
     **/
    public void setDdtlId(String ddtlId) {
        this.ddtlId = ddtlId == null ? null : ddtlId.trim();
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlGroupId() {
        return ddtlGroupId;
    }

    /**
     * null
     * @param ddtlGroupId
     **/
    public void setDdtlGroupId(String ddtlGroupId) {
        this.ddtlGroupId = ddtlGroupId == null ? null : ddtlGroupId.trim();
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlKey() {
        return ddtlKey;
    }

    /**
     * null
     * @param ddtlKey
     **/
    public void setDdtlKey(String ddtlKey) {
        this.ddtlKey = ddtlKey == null ? null : ddtlKey.trim();
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlName() {
        return ddtlName;
    }

    /**
     * null
     * @param ddtlName
     **/
    public void setDdtlName(String ddtlName) {
        this.ddtlName = ddtlName == null ? null : ddtlName.trim();
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlValue() {
        return ddtlValue;
    }

    /**
     * null
     * @param ddtlValue
     **/
    public void setDdtlValue(String ddtlValue) {
        this.ddtlValue = ddtlValue == null ? null : ddtlValue.trim();
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlStatus() {
        return ddtlStatus;
    }

    /**
     * null
     * @param ddtlStatus
     **/
    public void setDdtlStatus(String ddtlStatus) {
        this.ddtlStatus = ddtlStatus == null ? null : ddtlStatus.trim();
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlDesc() {
        return ddtlDesc;
    }

    /**
     * null
     * @param ddtlDesc
     **/
    public void setDdtlDesc(String ddtlDesc) {
        this.ddtlDesc = ddtlDesc == null ? null : ddtlDesc.trim();
    }

    /**
     * null
     * @return java.util.Date
     **/
    public Date getDdtlCreatetime() {
        return ddtlCreatetime;
    }

    /**
     * null
     * @param ddtlCreatetime
     **/
    public void setDdtlCreatetime(Date ddtlCreatetime) {
        this.ddtlCreatetime = ddtlCreatetime;
    }

    /**
     * null
     * @return java.lang.Integer
     **/
    public Integer getDdtlOrderNum() {
        return ddtlOrderNum;
    }

    /**
     * null
     * @param ddtlOrderNum
     **/
    public void setDdtlOrderNum(Integer ddtlOrderNum) {
        this.ddtlOrderNum = ddtlOrderNum;
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlBindDicSelected() {
        return ddtlBindDicSelected;
    }

    /**
     * null
     * @param ddtlBindDicSelected
     **/
    public void setDdtlBindDicSelected(String ddtlBindDicSelected) {
        this.ddtlBindDicSelected = ddtlBindDicSelected == null ? null : ddtlBindDicSelected.trim();
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlBindDicRadio() {
        return ddtlBindDicRadio;
    }

    /**
     * null
     * @param ddtlBindDicRadio
     **/
    public void setDdtlBindDicRadio(String ddtlBindDicRadio) {
        this.ddtlBindDicRadio = ddtlBindDicRadio == null ? null : ddtlBindDicRadio.trim();
    }

    /**
     * null
     * @return java.lang.String
     **/
    public String getDdtlDdttBindDicMucheckbox() {
        return ddtlDdttBindDicMucheckbox;
    }

    /**
     * null
     * @param ddtlDdttBindDicMucheckbox
     **/
    public void setDdtlDdttBindDicMucheckbox(String ddtlDdttBindDicMucheckbox) {
        this.ddtlDdttBindDicMucheckbox = ddtlDdttBindDicMucheckbox == null ? null : ddtlDdttBindDicMucheckbox.trim();
    }
}