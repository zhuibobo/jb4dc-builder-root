package com.jb4dc.builder.dbentities.systemsetting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tsys_notice_message
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class NoticeMessageEntity {
    //MESSAGE_ID:
    @DBKeyField
    private String messageId;

    //MESSAGE_ORDER_NUM:排序号
    private Integer messageOrderNum;

    //MESSAGE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date messageCreateTime;

    //MESSAGE_EXPIRED_TIME:过期时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date messageExpiredTime;

    //MESSAGE_DELETE_TIME:删除时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date messageDeleteTime;

    //MESSAGE_TYPE:通知类型:SMS[短信];Push[推送];IM[即时通讯]
    private String messageType;

    //MESSAGE_TITLE:标题
    private String messageTitle;

    //MESSAGE_CONTENT:内容
    private String messageContent;

    //MESSAGE_STATUS:状态:NotSend[未发送];Send[已发送];Received[已送达]
    private String messageStatus;

    //MESSAGE_SENDER_ID:发送人Id
    private String messageSenderId;

    //MESSAGE_SENDER_NAME:发送人名称
    private String messageSenderName;

    //MESSAGE_RECEIVER_ID:接收人Id
    private String messageReceiverId;

    //MESSAGE_RECEIVER_NAME:接收人名称
    private String messageReceiverName;

    //MESSAGE_RECEIVER_KEY:接收键:作为接收端的唯一凭证,手机号码,手机编号,im编号等
    private String messageReceiverKey;

    /**
     * 构造函数
     * @param messageId
     * @param messageOrderNum 排序号
     * @param messageCreateTime 创建时间
     * @param messageExpiredTime 过期时间
     * @param messageDeleteTime 删除时间
     * @param messageType 通知类型
     * @param messageTitle 标题
     * @param messageContent 内容
     * @param messageStatus 状态
     * @param messageSenderId 发送人Id
     * @param messageSenderName 发送人名称
     * @param messageReceiverId 接收人Id
     * @param messageReceiverName 接收人名称
     * @param messageReceiverKey 接收键
     **/
    public NoticeMessageEntity(String messageId, Integer messageOrderNum, Date messageCreateTime, Date messageExpiredTime, Date messageDeleteTime, String messageType, String messageTitle, String messageContent, String messageStatus, String messageSenderId, String messageSenderName, String messageReceiverId, String messageReceiverName, String messageReceiverKey) {
        this.messageId = messageId;
        this.messageOrderNum = messageOrderNum;
        this.messageCreateTime = messageCreateTime;
        this.messageExpiredTime = messageExpiredTime;
        this.messageDeleteTime = messageDeleteTime;
        this.messageType = messageType;
        this.messageTitle = messageTitle;
        this.messageContent = messageContent;
        this.messageStatus = messageStatus;
        this.messageSenderId = messageSenderId;
        this.messageSenderName = messageSenderName;
        this.messageReceiverId = messageReceiverId;
        this.messageReceiverName = messageReceiverName;
        this.messageReceiverKey = messageReceiverKey;
    }

    public NoticeMessageEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getMessageId() {
        return messageId;
    }

    /**
     *
     * @param messageId
     **/
    public void setMessageId(String messageId) {
        this.messageId = messageId == null ? null : messageId.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getMessageOrderNum() {
        return messageOrderNum;
    }

    /**
     * 排序号
     * @param messageOrderNum 排序号
     **/
    public void setMessageOrderNum(Integer messageOrderNum) {
        this.messageOrderNum = messageOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getMessageCreateTime() {
        return messageCreateTime;
    }

    /**
     * 创建时间
     * @param messageCreateTime 创建时间
     **/
    public void setMessageCreateTime(Date messageCreateTime) {
        this.messageCreateTime = messageCreateTime;
    }

    /**
     * 过期时间
     * @return java.util.Date
     **/
    public Date getMessageExpiredTime() {
        return messageExpiredTime;
    }

    /**
     * 过期时间
     * @param messageExpiredTime 过期时间
     **/
    public void setMessageExpiredTime(Date messageExpiredTime) {
        this.messageExpiredTime = messageExpiredTime;
    }

    /**
     * 删除时间
     * @return java.util.Date
     **/
    public Date getMessageDeleteTime() {
        return messageDeleteTime;
    }

    /**
     * 删除时间
     * @param messageDeleteTime 删除时间
     **/
    public void setMessageDeleteTime(Date messageDeleteTime) {
        this.messageDeleteTime = messageDeleteTime;
    }

    /**
     * 通知类型:SMS[短信];Push[推送];IM[即时通讯]
     * @return java.lang.String
     **/
    public String getMessageType() {
        return messageType;
    }

    /**
     * 通知类型:SMS[短信];Push[推送];IM[即时通讯]
     * @param messageType 通知类型
     **/
    public void setMessageType(String messageType) {
        this.messageType = messageType == null ? null : messageType.trim();
    }

    /**
     * 标题
     * @return java.lang.String
     **/
    public String getMessageTitle() {
        return messageTitle;
    }

    /**
     * 标题
     * @param messageTitle 标题
     **/
    public void setMessageTitle(String messageTitle) {
        this.messageTitle = messageTitle == null ? null : messageTitle.trim();
    }

    /**
     * 内容
     * @return java.lang.String
     **/
    public String getMessageContent() {
        return messageContent;
    }

    /**
     * 内容
     * @param messageContent 内容
     **/
    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent == null ? null : messageContent.trim();
    }

    /**
     * 状态:NotSend[未发送];Send[已发送];Received[已送达]
     * @return java.lang.String
     **/
    public String getMessageStatus() {
        return messageStatus;
    }

    /**
     * 状态:NotSend[未发送];Send[已发送];Received[已送达]
     * @param messageStatus 状态
     **/
    public void setMessageStatus(String messageStatus) {
        this.messageStatus = messageStatus == null ? null : messageStatus.trim();
    }

    /**
     * 发送人Id
     * @return java.lang.String
     **/
    public String getMessageSenderId() {
        return messageSenderId;
    }

    /**
     * 发送人Id
     * @param messageSenderId 发送人Id
     **/
    public void setMessageSenderId(String messageSenderId) {
        this.messageSenderId = messageSenderId == null ? null : messageSenderId.trim();
    }

    /**
     * 发送人名称
     * @return java.lang.String
     **/
    public String getMessageSenderName() {
        return messageSenderName;
    }

    /**
     * 发送人名称
     * @param messageSenderName 发送人名称
     **/
    public void setMessageSenderName(String messageSenderName) {
        this.messageSenderName = messageSenderName == null ? null : messageSenderName.trim();
    }

    /**
     * 接收人Id
     * @return java.lang.String
     **/
    public String getMessageReceiverId() {
        return messageReceiverId;
    }

    /**
     * 接收人Id
     * @param messageReceiverId 接收人Id
     **/
    public void setMessageReceiverId(String messageReceiverId) {
        this.messageReceiverId = messageReceiverId == null ? null : messageReceiverId.trim();
    }

    /**
     * 接收人名称
     * @return java.lang.String
     **/
    public String getMessageReceiverName() {
        return messageReceiverName;
    }

    /**
     * 接收人名称
     * @param messageReceiverName 接收人名称
     **/
    public void setMessageReceiverName(String messageReceiverName) {
        this.messageReceiverName = messageReceiverName == null ? null : messageReceiverName.trim();
    }

    /**
     * 接收键:作为接收端的唯一凭证,手机号码,手机编号,im编号等
     * @return java.lang.String
     **/
    public String getMessageReceiverKey() {
        return messageReceiverKey;
    }

    /**
     * 接收键:作为接收端的唯一凭证,手机号码,手机编号,im编号等
     * @param messageReceiverKey 接收键
     **/
    public void setMessageReceiverKey(String messageReceiverKey) {
        this.messageReceiverKey = messageReceiverKey == null ? null : messageReceiverKey.trim();
    }
}