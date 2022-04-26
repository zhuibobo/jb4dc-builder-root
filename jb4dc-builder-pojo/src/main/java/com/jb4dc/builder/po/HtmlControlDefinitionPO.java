package com.jb4dc.builder.po;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jb4dc.core.base.tools.XMLDocumentUtility;
import org.w3c.dom.Node;

import javax.xml.xpath.XPathExpressionException;
import java.util.List;

public class HtmlControlDefinitionPO {
    /*private String singleName;
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
    private String enableChildControls;

    public String getEnableChildControls() {
        return enableChildControls;
    }

    public void setEnableChildControls(String enableChildControls) {
        this.enableChildControls = enableChildControls;
    }

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
        vo.setEnableChildControls(XMLDocumentUtility.getAttribute(node,"EnableChildControls"));
        return vo;
    }*/
    private String designType;
    @JsonProperty("group")
    private String group;
    @JsonProperty("singleName")
    private String singleName;
    @JsonProperty("text")
    private String text;
    @JsonProperty("class")
    private String className;
    @JsonProperty("icon")
    private String icon;
    @JsonProperty("dragTo")
    private String dragTo;
    @JsonProperty("serverResolve")
    private String serverResolve;
    @JsonProperty("clientResolve")
    private String clientResolve;
    @JsonProperty("clientResolveJs")
    private String clientResolveJs;
    @JsonProperty("enableChildControls")
    private String enableChildControls;
    @JsonProperty("dialogWidth")
    private String dialogWidth;
    @JsonProperty("dialogHeight")
    private String dialogHeight;
    @JsonProperty("isJBuild4DCData")
    private String isJBuild4DCData;
    @JsonProperty("controlCategory")
    private String controlCategory;
    @JsonProperty("serverDynamicBind")
    private String serverDynamicBind;
    @JsonProperty("showRemoveButton")
    private String showRemoveButton;
    @JsonProperty("showInEditorToolbar")
    private String showInEditorToolbar;

    @JsonProperty("children")
    private List<HtmlControlDefinitionPO> children;

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

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

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDragTo() {
        return dragTo;
    }

    public void setDragTo(String dragTo) {
        this.dragTo = dragTo;
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

    public String getEnableChildControls() {
        return enableChildControls;
    }

    public void setEnableChildControls(String enableChildControls) {
        this.enableChildControls = enableChildControls;
    }

    public String getDialogWidth() {
        return dialogWidth;
    }

    public void setDialogWidth(String dialogWidth) {
        this.dialogWidth = dialogWidth;
    }

    public String getDialogHeight() {
        return dialogHeight;
    }

    public void setDialogHeight(String dialogHeight) {
        this.dialogHeight = dialogHeight;
    }

    public String getIsJBuild4DCData() {
        return isJBuild4DCData;
    }

    public void setIsJBuild4DCData(String isJBuild4DCData) {
        this.isJBuild4DCData = isJBuild4DCData;
    }

    public String getControlCategory() {
        return controlCategory;
    }

    public void setControlCategory(String controlCategory) {
        this.controlCategory = controlCategory;
    }

    public String getServerDynamicBind() {
        return serverDynamicBind;
    }

    public void setServerDynamicBind(String serverDynamicBind) {
        this.serverDynamicBind = serverDynamicBind;
    }

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

    public List<HtmlControlDefinitionPO> getChildren() {
        return children;
    }

    public void setChildren(List<HtmlControlDefinitionPO> children) {
        this.children = children;
    }

    public String getDesignType() {
        return designType;
    }

    public void setDesignType(String designType) {
        this.designType = designType;
    }
}
