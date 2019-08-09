package com.jb4dc.builder.po;

import com.jb4dc.core.base.tools.XMLDocumentUtility;
import org.w3c.dom.Node;

import javax.xml.xpath.XPathExpressionException;

public class HtmlControlDefinitionPO {
    private String singleName;
    private String text;
    private String toolbarLocation;
    private String serverResolve;
    private String clientResolve;
    private String clientResolveJs;
    private String desc;
    private String config;
    private String isJBuild4DCData;
    private String controlCategory;
    private String serverDynamicBind;
    private String showRemoveButton;
    private String showInEditorToolbar;


    public String getShowRemoveButton() {
        return showRemoveButton;
    }

    public void setShowRemoveButton(String showRemoveButton) {
        this.showRemoveButton = showRemoveButton;
    }

    public String getShowInEditorToolbar() {
        return showInEditorToolbar;
    }

    public void setShowInEditorToolbar(String showInEditorToolbar) {
        this.showInEditorToolbar = showInEditorToolbar;
    }

    public String getServerDynamicBind() {
        return serverDynamicBind;
    }

    public void setServerDynamicBind(String serverDynamicBind) {
        this.serverDynamicBind = serverDynamicBind;
    }

    public String getControlCategory() {
        return controlCategory;
    }

    public void setControlCategory(String controlCategory) {
        this.controlCategory = controlCategory;
    }

    public String getIsJBuild4DCData() {
        return isJBuild4DCData;
    }

    public void setIsJBuild4DCData(String isJBuild4DCData) {
        this.isJBuild4DCData = isJBuild4DCData;
    }

    private int dialogWidth;
    private int dialogHeight;

    public String getSingleName() {
        return singleName;
    }

    public void setSingleName(String singleName) {
        this.singleName = singleName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getToolbarLocation() {
        return toolbarLocation;
    }

    public void setToolbarLocation(String toolbarLocation) {
        this.toolbarLocation = toolbarLocation;
    }

    public String getServerResolve() {
        return serverResolve;
    }

    public void setServerResolve(String serverResolve) {
        this.serverResolve = serverResolve;
    }

    public String getClientResolve() {
        return clientResolve;
    }

    public void setClientResolve(String clientResolve) {
        this.clientResolve = clientResolve;
    }

    public String getClientResolveJs() {
        return clientResolveJs;
    }

    public void setClientResolveJs(String clientResolveJs) {
        this.clientResolveJs = clientResolveJs;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    public int getDialogWidth() {
        return dialogWidth;
    }

    public void setDialogWidth(int dialogWidth) {
        this.dialogWidth = dialogWidth;
    }

    public int getDialogHeight() {
        return dialogHeight;
    }

    public void setDialogHeight(int dialogHeight) {
        this.dialogHeight = dialogHeight;
    }

    public static HtmlControlDefinitionPO parseWebFormControlNode(Node node) throws XPathExpressionException {
        HtmlControlDefinitionPO vo=new HtmlControlDefinitionPO();
        vo.setSingleName(XMLDocumentUtility.getAttribute(node,"SingleName"));
        vo.setText(XMLDocumentUtility.getAttribute(node,"Text"));
        vo.setToolbarLocation(XMLDocumentUtility.getAttribute(node,"ToolbarLocation"));
        vo.setServerResolve(XMLDocumentUtility.getAttribute(node,"ServerResolve"));
        vo.setClientResolve(XMLDocumentUtility.getAttribute(node,"ClientResolve"));
        vo.setClientResolveJs(XMLDocumentUtility.getAttribute(node,"ClientResolveJs"));
        vo.setDialogWidth(Integer.parseInt(XMLDocumentUtility.getAttribute(node,"DialogWidth")));
        vo.setDialogHeight(Integer.parseInt(XMLDocumentUtility.getAttribute(node,"DialogHeight")));
        vo.setDesc(XMLDocumentUtility.parseForString(node,"Desc"));
        vo.setConfig(XMLDocumentUtility.parseForString(node,"Config"));
        vo.setIsJBuild4DCData(XMLDocumentUtility.getAttribute(node,"IsJBuild4DCData"));
        vo.setControlCategory(XMLDocumentUtility.getAttribute(node,"ControlCategory"));
        vo.setServerDynamicBind(XMLDocumentUtility.getAttribute(node,"ServerDynamicBind"));
        vo.setShowRemoveButton(XMLDocumentUtility.getAttribute(node,"ShowRemoveButton"));
        vo.setShowInEditorToolbar(XMLDocumentUtility.getAttribute(node,"ShowInEditorToolbar"));
        return vo;
    }
}
