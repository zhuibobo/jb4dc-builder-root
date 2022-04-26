package com.jb4dc.builder.po;


import com.fasterxml.jackson.annotation.JsonProperty;

public class ControlPluginsPO {
    @JsonProperty("appFormDesign")
    private PluginsCategoryPO appFormDesign;

    @JsonProperty("appListDesign")
    private PluginsCategoryPO appListDesign;

    @JsonProperty("webFormDesign")
    private PluginsCategoryPO webFormDesign;

    @JsonProperty("webListDesign")
    private PluginsCategoryPO webListDesign;

    public PluginsCategoryPO getAppFormDesign() {
        return appFormDesign;
    }

    public void setAppFormDesign(PluginsCategoryPO appFormDesign) {
        this.appFormDesign = appFormDesign;
    }

    public PluginsCategoryPO getAppListDesign() {
        return appListDesign;
    }

    public void setAppListDesign(PluginsCategoryPO appListDesign) {
        this.appListDesign = appListDesign;
    }

    public PluginsCategoryPO getWebFormDesign() {
        return webFormDesign;
    }

    public void setWebFormDesign(PluginsCategoryPO webFormDesign) {
        this.webFormDesign = webFormDesign;
    }

    public PluginsCategoryPO getWebListDesign() {
        return webListDesign;
    }

    public void setWebListDesign(PluginsCategoryPO webListDesign) {
        this.webListDesign = webListDesign;
    }
}
