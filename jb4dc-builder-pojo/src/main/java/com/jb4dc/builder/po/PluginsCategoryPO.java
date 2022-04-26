package com.jb4dc.builder.po;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class PluginsCategoryPO {

    @JsonProperty("groups")
    private List<HtmlControlDefinitionGroupPO> groups;

    @JsonProperty("controls")
    private List<HtmlControlDefinitionPO> htmlControlDefinitionPOList;
    public void setGroups(List<HtmlControlDefinitionGroupPO> groups) {
        this.groups = groups;
    }
    public List<HtmlControlDefinitionGroupPO> getGroups() {
        return groups;
    }

    public void setControls(List<HtmlControlDefinitionPO> controls) {
        this.htmlControlDefinitionPOList = controls;
    }
    public List<HtmlControlDefinitionPO> getControls() {
        return htmlControlDefinitionPOList;
    }
}
