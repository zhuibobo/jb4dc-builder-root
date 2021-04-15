package com.jb4dc.workflow.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tflow_agent_config
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class AgentConfigEntity {
    //AGENT_ID:
    @DBKeyField
    private String agentId;

    //AGENT_TYPE:代理类型:全部模型;指定模型
    private String agentType;

    //AGENT_MODEL_RE_KEY:启动键:act_de_model表的KEY_,充当ROOT_ID使用
    private String agentModelReKey;

    //AGENT_START_TIME:代理开始时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date agentStartTime;

    //AGENT_END_TIME:代理结束时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date agentEndTime;

    //AGENT_FROM_USER_ID:来自用户ID
    private String agentFromUserId;

    //AGENT_FROM_USER_NAME:来自用户名称
    private String agentFromUserName;

    //AGENT_TO_USER_ID:目标用户ID
    private String agentToUserId;

    //AGENT_TO_USER_NAME:目标用户名称
    private String agentToUserName;

    //AGENT_DESC:备注
    private String agentDesc;

    //AGENT_ORDER_NUM:排序号
    private Integer agentOrderNum;

    //AGENT_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date agentCreateTime;

    /**
     * 构造函数
     * @param agentId
     * @param agentType 代理类型
     * @param agentModelReKey 启动键
     * @param agentStartTime 代理开始时间
     * @param agentEndTime 代理结束时间
     * @param agentFromUserId 来自用户ID
     * @param agentFromUserName 来自用户名称
     * @param agentToUserId 目标用户ID
     * @param agentToUserName 目标用户名称
     * @param agentDesc 备注
     * @param agentOrderNum 排序号
     * @param agentCreateTime 创建时间
     **/
    public AgentConfigEntity(String agentId, String agentType, String agentModelReKey, Date agentStartTime, Date agentEndTime, String agentFromUserId, String agentFromUserName, String agentToUserId, String agentToUserName, String agentDesc, Integer agentOrderNum, Date agentCreateTime) {
        this.agentId = agentId;
        this.agentType = agentType;
        this.agentModelReKey = agentModelReKey;
        this.agentStartTime = agentStartTime;
        this.agentEndTime = agentEndTime;
        this.agentFromUserId = agentFromUserId;
        this.agentFromUserName = agentFromUserName;
        this.agentToUserId = agentToUserId;
        this.agentToUserName = agentToUserName;
        this.agentDesc = agentDesc;
        this.agentOrderNum = agentOrderNum;
        this.agentCreateTime = agentCreateTime;
    }

    public AgentConfigEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getAgentId() {
        return agentId;
    }

    /**
     *
     * @param agentId
     **/
    public void setAgentId(String agentId) {
        this.agentId = agentId == null ? null : agentId.trim();
    }

    /**
     * 代理类型:全部模型;指定模型
     * @return java.lang.String
     **/
    public String getAgentType() {
        return agentType;
    }

    /**
     * 代理类型:全部模型;指定模型
     * @param agentType 代理类型
     **/
    public void setAgentType(String agentType) {
        this.agentType = agentType == null ? null : agentType.trim();
    }

    /**
     * 启动键:act_de_model表的KEY_,充当ROOT_ID使用
     * @return java.lang.String
     **/
    public String getAgentModelReKey() {
        return agentModelReKey;
    }

    /**
     * 启动键:act_de_model表的KEY_,充当ROOT_ID使用
     * @param agentModelReKey 启动键
     **/
    public void setAgentModelReKey(String agentModelReKey) {
        this.agentModelReKey = agentModelReKey == null ? null : agentModelReKey.trim();
    }

    /**
     * 代理开始时间
     * @return java.util.Date
     **/
    public Date getAgentStartTime() {
        return agentStartTime;
    }

    /**
     * 代理开始时间
     * @param agentStartTime 代理开始时间
     **/
    public void setAgentStartTime(Date agentStartTime) {
        this.agentStartTime = agentStartTime;
    }

    /**
     * 代理结束时间
     * @return java.util.Date
     **/
    public Date getAgentEndTime() {
        return agentEndTime;
    }

    /**
     * 代理结束时间
     * @param agentEndTime 代理结束时间
     **/
    public void setAgentEndTime(Date agentEndTime) {
        this.agentEndTime = agentEndTime;
    }

    /**
     * 来自用户ID
     * @return java.lang.String
     **/
    public String getAgentFromUserId() {
        return agentFromUserId;
    }

    /**
     * 来自用户ID
     * @param agentFromUserId 来自用户ID
     **/
    public void setAgentFromUserId(String agentFromUserId) {
        this.agentFromUserId = agentFromUserId == null ? null : agentFromUserId.trim();
    }

    /**
     * 来自用户名称
     * @return java.lang.String
     **/
    public String getAgentFromUserName() {
        return agentFromUserName;
    }

    /**
     * 来自用户名称
     * @param agentFromUserName 来自用户名称
     **/
    public void setAgentFromUserName(String agentFromUserName) {
        this.agentFromUserName = agentFromUserName == null ? null : agentFromUserName.trim();
    }

    /**
     * 目标用户ID
     * @return java.lang.String
     **/
    public String getAgentToUserId() {
        return agentToUserId;
    }

    /**
     * 目标用户ID
     * @param agentToUserId 目标用户ID
     **/
    public void setAgentToUserId(String agentToUserId) {
        this.agentToUserId = agentToUserId == null ? null : agentToUserId.trim();
    }

    /**
     * 目标用户名称
     * @return java.lang.String
     **/
    public String getAgentToUserName() {
        return agentToUserName;
    }

    /**
     * 目标用户名称
     * @param agentToUserName 目标用户名称
     **/
    public void setAgentToUserName(String agentToUserName) {
        this.agentToUserName = agentToUserName == null ? null : agentToUserName.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getAgentDesc() {
        return agentDesc;
    }

    /**
     * 备注
     * @param agentDesc 备注
     **/
    public void setAgentDesc(String agentDesc) {
        this.agentDesc = agentDesc == null ? null : agentDesc.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getAgentOrderNum() {
        return agentOrderNum;
    }

    /**
     * 排序号
     * @param agentOrderNum 排序号
     **/
    public void setAgentOrderNum(Integer agentOrderNum) {
        this.agentOrderNum = agentOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getAgentCreateTime() {
        return agentCreateTime;
    }

    /**
     * 创建时间
     * @param agentCreateTime 创建时间
     **/
    public void setAgentCreateTime(Date agentCreateTime) {
        this.agentCreateTime = agentCreateTime;
    }
}