package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_instance_file
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class InstanceFileEntity {
    //FILE_ID:
    @DBKeyField
    private String fileId;

    //FILE_INST_ID:所属实例ID
    private String fileInstId;

    //FILE_NAME:文件名称
    private String fileName;

    //FILE_STORE_PATH:存储路径
    private String fileStorePath;

    //FILE_STORE_NAME:存储名称
    private String fileStoreName;

    //FILE_EXTENSION:扩展名
    private String fileExtension;

    //FILE_DESCRIPTION:备注
    private String fileDescription;

    //FILE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date fileCreateTime;

    //FILE_CREATOR:创建者
    private String fileCreator;

    //FILE_CREATOR_ID:创建者
    private String fileCreatorId;

    //FILE_ORGAN_NAME:创建者所在组织
    private String fileOrganName;

    //FILE_ORGAN_ID:创建者所在组织ID
    private String fileOrganId;

    //FILE_ORDER_NUM:排序号
    private Integer fileOrderNum;

    //FILE_STATUS:状态
    private String fileStatus;

    //FILE_TYPE:文件类型:Draft[稿纸];Document[正文];Attachment[附件]
    private String fileType;

    //FILE_SIZE:文件大小
    private Integer fileSize;

    //FILE_PRE_ID:前一文件ID
    private Integer filePreId;

    /**
     * 构造函数
     * @param fileId
     * @param fileInstId 所属实例ID
     * @param fileName 文件名称
     * @param fileStorePath 存储路径
     * @param fileStoreName 存储名称
     * @param fileExtension 扩展名
     * @param fileDescription 备注
     * @param fileCreateTime 创建时间
     * @param fileCreator 创建者
     * @param fileCreatorId 创建者
     * @param fileOrganName 创建者所在组织
     * @param fileOrganId 创建者所在组织ID
     * @param fileOrderNum 排序号
     * @param fileStatus 状态
     * @param fileType 文件类型
     * @param fileSize 文件大小
     * @param filePreId 前一文件ID
     **/
    public InstanceFileEntity(String fileId, String fileInstId, String fileName, String fileStorePath, String fileStoreName, String fileExtension, String fileDescription, Date fileCreateTime, String fileCreator, String fileCreatorId, String fileOrganName, String fileOrganId, Integer fileOrderNum, String fileStatus, String fileType, Integer fileSize, Integer filePreId) {
        this.fileId = fileId;
        this.fileInstId = fileInstId;
        this.fileName = fileName;
        this.fileStorePath = fileStorePath;
        this.fileStoreName = fileStoreName;
        this.fileExtension = fileExtension;
        this.fileDescription = fileDescription;
        this.fileCreateTime = fileCreateTime;
        this.fileCreator = fileCreator;
        this.fileCreatorId = fileCreatorId;
        this.fileOrganName = fileOrganName;
        this.fileOrganId = fileOrganId;
        this.fileOrderNum = fileOrderNum;
        this.fileStatus = fileStatus;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePreId = filePreId;
    }

    public InstanceFileEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getFileId() {
        return fileId;
    }

    /**
     *
     * @param fileId
     **/
    public void setFileId(String fileId) {
        this.fileId = fileId == null ? null : fileId.trim();
    }

    /**
     * 所属实例ID
     * @return java.lang.String
     **/
    public String getFileInstId() {
        return fileInstId;
    }

    /**
     * 所属实例ID
     * @param fileInstId 所属实例ID
     **/
    public void setFileInstId(String fileInstId) {
        this.fileInstId = fileInstId == null ? null : fileInstId.trim();
    }

    /**
     * 文件名称
     * @return java.lang.String
     **/
    public String getFileName() {
        return fileName;
    }

    /**
     * 文件名称
     * @param fileName 文件名称
     **/
    public void setFileName(String fileName) {
        this.fileName = fileName == null ? null : fileName.trim();
    }

    /**
     * 存储路径
     * @return java.lang.String
     **/
    public String getFileStorePath() {
        return fileStorePath;
    }

    /**
     * 存储路径
     * @param fileStorePath 存储路径
     **/
    public void setFileStorePath(String fileStorePath) {
        this.fileStorePath = fileStorePath == null ? null : fileStorePath.trim();
    }

    /**
     * 存储名称
     * @return java.lang.String
     **/
    public String getFileStoreName() {
        return fileStoreName;
    }

    /**
     * 存储名称
     * @param fileStoreName 存储名称
     **/
    public void setFileStoreName(String fileStoreName) {
        this.fileStoreName = fileStoreName == null ? null : fileStoreName.trim();
    }

    /**
     * 扩展名
     * @return java.lang.String
     **/
    public String getFileExtension() {
        return fileExtension;
    }

    /**
     * 扩展名
     * @param fileExtension 扩展名
     **/
    public void setFileExtension(String fileExtension) {
        this.fileExtension = fileExtension == null ? null : fileExtension.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getFileDescription() {
        return fileDescription;
    }

    /**
     * 备注
     * @param fileDescription 备注
     **/
    public void setFileDescription(String fileDescription) {
        this.fileDescription = fileDescription == null ? null : fileDescription.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getFileCreateTime() {
        return fileCreateTime;
    }

    /**
     * 创建时间
     * @param fileCreateTime 创建时间
     **/
    public void setFileCreateTime(Date fileCreateTime) {
        this.fileCreateTime = fileCreateTime;
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getFileCreator() {
        return fileCreator;
    }

    /**
     * 创建者
     * @param fileCreator 创建者
     **/
    public void setFileCreator(String fileCreator) {
        this.fileCreator = fileCreator == null ? null : fileCreator.trim();
    }

    /**
     * 创建者
     * @return java.lang.String
     **/
    public String getFileCreatorId() {
        return fileCreatorId;
    }

    /**
     * 创建者
     * @param fileCreatorId 创建者
     **/
    public void setFileCreatorId(String fileCreatorId) {
        this.fileCreatorId = fileCreatorId == null ? null : fileCreatorId.trim();
    }

    /**
     * 创建者所在组织
     * @return java.lang.String
     **/
    public String getFileOrganName() {
        return fileOrganName;
    }

    /**
     * 创建者所在组织
     * @param fileOrganName 创建者所在组织
     **/
    public void setFileOrganName(String fileOrganName) {
        this.fileOrganName = fileOrganName == null ? null : fileOrganName.trim();
    }

    /**
     * 创建者所在组织ID
     * @return java.lang.String
     **/
    public String getFileOrganId() {
        return fileOrganId;
    }

    /**
     * 创建者所在组织ID
     * @param fileOrganId 创建者所在组织ID
     **/
    public void setFileOrganId(String fileOrganId) {
        this.fileOrganId = fileOrganId == null ? null : fileOrganId.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getFileOrderNum() {
        return fileOrderNum;
    }

    /**
     * 排序号
     * @param fileOrderNum 排序号
     **/
    public void setFileOrderNum(Integer fileOrderNum) {
        this.fileOrderNum = fileOrderNum;
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getFileStatus() {
        return fileStatus;
    }

    /**
     * 状态
     * @param fileStatus 状态
     **/
    public void setFileStatus(String fileStatus) {
        this.fileStatus = fileStatus == null ? null : fileStatus.trim();
    }

    /**
     * 文件类型:Draft[稿纸];Document[正文];Attachment[附件]
     * @return java.lang.String
     **/
    public String getFileType() {
        return fileType;
    }

    /**
     * 文件类型:Draft[稿纸];Document[正文];Attachment[附件]
     * @param fileType 文件类型
     **/
    public void setFileType(String fileType) {
        this.fileType = fileType == null ? null : fileType.trim();
    }

    /**
     * 文件大小
     * @return java.lang.Integer
     **/
    public Integer getFileSize() {
        return fileSize;
    }

    /**
     * 文件大小
     * @param fileSize 文件大小
     **/
    public void setFileSize(Integer fileSize) {
        this.fileSize = fileSize;
    }

    /**
     * 前一文件ID
     * @return java.lang.Integer
     **/
    public Integer getFilePreId() {
        return filePreId;
    }

    /**
     * 前一文件ID
     * @param filePreId 前一文件ID
     **/
    public void setFilePreId(Integer filePreId) {
        this.filePreId = filePreId;
    }
}