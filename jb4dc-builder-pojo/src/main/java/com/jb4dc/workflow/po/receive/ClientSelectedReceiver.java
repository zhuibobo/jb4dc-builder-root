package com.jb4dc.workflow.po.receive;

import com.jb4dc.base.tools.JsonUtility;

import java.io.IOException;
import java.util.List;

public class ClientSelectedReceiver {
    private String nextNodeId;
    private String receiverId;
    private String receiverName;
    private String receiverTypeName;
    private String receiveType;

    public static String ReceiveType_Main="main";
    public static String ReceiveType_CC="cc";

    public String getNextNodeId() {
        return nextNodeId;
    }

    public void setNextNodeId(String nextNodeId) {
        this.nextNodeId = nextNodeId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverTypeName() {
        return receiverTypeName;
    }

    public void setReceiverTypeName(String receiverTypeName) {
        this.receiverTypeName = receiverTypeName;
    }

    public String getReceiveType() {
        return receiveType;
    }

    public void setReceiveType(String receiveType) {
        this.receiveType = receiveType;
    }

    public static List<ClientSelectedReceiver> parse(String str) throws IOException {
        return JsonUtility.toObjectList(str,ClientSelectedReceiver.class);
    }
}
