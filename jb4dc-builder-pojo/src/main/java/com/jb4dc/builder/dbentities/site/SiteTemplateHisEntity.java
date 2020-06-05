package com.jb4dc.builder.dbentities.site;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tbuild_site_template_his
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class SiteTemplateHisEntity {
    //HIS_ID:
    @DBKeyField
    private String hisId;

    //HIS_TEMPLATE_ID:主键:UUID
    private String hisTemplateId;

    //HIS_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date hisCreateTime;

    /**
     * 构造函数
     * @param hisId
     * @param hisTemplateId 主键
     * @param hisCreateTime 创建时间
     **/
    public SiteTemplateHisEntity(String hisId, String hisTemplateId, Date hisCreateTime) {
        this.hisId = hisId;
        this.hisTemplateId = hisTemplateId;
        this.hisCreateTime = hisCreateTime;
    }

    public SiteTemplateHisEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getHisId() {
        return hisId;
    }

    /**
     *
     * @param hisId
     **/
    public void setHisId(String hisId) {
        this.hisId = hisId == null ? null : hisId.trim();
    }

    /**
     * 主键:UUID
     * @return java.lang.String
     **/
    public String getHisTemplateId() {
        return hisTemplateId;
    }

    /**
     * 主键:UUID
     * @param hisTemplateId 主键
     **/
    public void setHisTemplateId(String hisTemplateId) {
        this.hisTemplateId = hisTemplateId == null ? null : hisTemplateId.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getHisCreateTime() {
        return hisCreateTime;
    }

    /**
     * 创建时间
     * @param hisCreateTime 创建时间
     **/
    public void setHisCreateTime(Date hisCreateTime) {
        this.hisCreateTime = hisCreateTime;
    }

    //HIS_CONTENT_HTML:模版HTML内容
    private String hisContentHtml;

    //HIS_CONTENT_JS:模版JS内容
    private String hisContentJs;

    //HIS_CONTENT_CSS:模版CSS内容
    private String hisContentCss;

    public String getHisContentHtml() {
        return hisContentHtml;
    }

    public void setHisContentHtml(String hisContentHtml) {
        this.hisContentHtml = hisContentHtml == null ? null : hisContentHtml.trim();
    }

    public String getHisContentJs() {
        return hisContentJs;
    }

    public void setHisContentJs(String hisContentJs) {
        this.hisContentJs = hisContentJs == null ? null : hisContentJs.trim();
    }

    public String getHisContentCss() {
        return hisContentCss;
    }

    public void setHisContentCss(String hisContentCss) {
        this.hisContentCss = hisContentCss == null ? null : hisContentCss.trim();
    }
}