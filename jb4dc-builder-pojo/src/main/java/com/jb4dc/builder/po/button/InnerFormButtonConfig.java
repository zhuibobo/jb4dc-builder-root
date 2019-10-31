package com.jb4dc.builder.po.button;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
public class InnerFormButtonConfig {
    public String id;
    public String caption;
    public String saveAndClose;
    public String buttonType;
    public String custServerResolveMethod;
    public String custServerResolveMethodPara;
    public String custClientRendererMethod;
    public String custClientRendererMethodPara;
    public String custClientRendererAfterMethod;
    public String custClientRendererAfterMethodPara;
    public String custClientClickBeforeMethod;
    public String custClientClickBeforeMethodPara;

    List<InnerFormButtonConfigAPI> apis;
    List<InnerFormButtonConfigField> fields;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getSaveAndClose() {
        return saveAndClose;
    }

    public void setSaveAndClose(String saveAndClose) {
        this.saveAndClose = saveAndClose;
    }

    public String getButtonType() {
        return buttonType;
    }

    public void setButtonType(String buttonType) {
        this.buttonType = buttonType;
    }

    public String getCustServerResolveMethod() {
        return custServerResolveMethod;
    }

    public void setCustServerResolveMethod(String custServerResolveMethod) {
        this.custServerResolveMethod = custServerResolveMethod;
    }

    public String getCustServerResolveMethodPara() {
        return custServerResolveMethodPara;
    }

    public void setCustServerResolveMethodPara(String custServerResolveMethodPara) {
        this.custServerResolveMethodPara = custServerResolveMethodPara;
    }

    public String getCustClientRendererMethod() {
        return custClientRendererMethod;
    }

    public void setCustClientRendererMethod(String custClientRendererMethod) {
        this.custClientRendererMethod = custClientRendererMethod;
    }

    public String getCustClientRendererMethodPara() {
        return custClientRendererMethodPara;
    }

    public void setCustClientRendererMethodPara(String custClientRendererMethodPara) {
        this.custClientRendererMethodPara = custClientRendererMethodPara;
    }

    public String getCustClientRendererAfterMethod() {
        return custClientRendererAfterMethod;
    }

    public void setCustClientRendererAfterMethod(String custClientRendererAfterMethod) {
        this.custClientRendererAfterMethod = custClientRendererAfterMethod;
    }

    public String getCustClientRendererAfterMethodPara() {
        return custClientRendererAfterMethodPara;
    }

    public void setCustClientRendererAfterMethodPara(String custClientRendererAfterMethodPara) {
        this.custClientRendererAfterMethodPara = custClientRendererAfterMethodPara;
    }

    public String getCustClientClickBeforeMethod() {
        return custClientClickBeforeMethod;
    }

    public void setCustClientClickBeforeMethod(String custClientClickBeforeMethod) {
        this.custClientClickBeforeMethod = custClientClickBeforeMethod;
    }

    public String getCustClientClickBeforeMethodPara() {
        return custClientClickBeforeMethodPara;
    }

    public void setCustClientClickBeforeMethodPara(String custClientClickBeforeMethodPara) {
        this.custClientClickBeforeMethodPara = custClientClickBeforeMethodPara;
    }

    public List<InnerFormButtonConfigAPI> getApis() {
        return apis;
    }

    public void setApis(List<InnerFormButtonConfigAPI> apis) {
        this.apis = apis;
    }

    public List<InnerFormButtonConfigField> getFields() {
        return fields;
    }

    public void setFields(List<InnerFormButtonConfigField> fields) {
        this.fields = fields;
    }
}
