package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "jb4dcAuthority",namespace = BpmnNs.JB4DC_URI)
public class Jb4dcAuthority {
    @XmlAttribute(name = "authorityType")
    String authorityType;

    @XmlAttribute(name = "authorityTableName")
    String authorityTableName;

    @XmlAttribute(name = "authorityFieldName")
    String authorityFieldName;

    @XmlAttribute(name = "authorityEditEnable")
    String authorityEditEnable;

    @XmlAttribute(name = "authorityViewEnable")
    String authorityViewEnable;

    @XmlAttribute(name = "authorityEmptyEditEnable")
    String authorityEmptyEditEnable;

    @XmlAttribute(name = "authorityDesc")
    String authorityDesc;

    public String getAuthorityType() {
        return authorityType;
    }

    public void setAuthorityType(String authorityType) {
        this.authorityType = authorityType;
    }

    public String getAuthorityTableName() {
        return authorityTableName;
    }

    public void setAuthorityTableName(String authorityTableName) {
        this.authorityTableName = authorityTableName;
    }

    public String getAuthorityFieldName() {
        return authorityFieldName;
    }

    public void setAuthorityFieldName(String authorityFieldName) {
        this.authorityFieldName = authorityFieldName;
    }

    public String getAuthorityEditEnable() {
        return authorityEditEnable;
    }

    public void setAuthorityEditEnable(String authorityEditEnable) {
        this.authorityEditEnable = authorityEditEnable;
    }

    public String getAuthorityViewEnable() {
        return authorityViewEnable;
    }

    public void setAuthorityViewEnable(String authorityViewEnable) {
        this.authorityViewEnable = authorityViewEnable;
    }

    public String getAuthorityEmptyEditEnable() {
        return authorityEmptyEditEnable;
    }

    public void setAuthorityEmptyEditEnable(String authorityEmptyEditEnable) {
        this.authorityEmptyEditEnable = authorityEmptyEditEnable;
    }

    public String getAuthorityDesc() {
        return authorityDesc;
    }

    public void setAuthorityDesc(String authorityDesc) {
        this.authorityDesc = authorityDesc;
    }
}
