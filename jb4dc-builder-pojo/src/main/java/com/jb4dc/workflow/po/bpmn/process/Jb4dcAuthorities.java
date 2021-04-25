package com.jb4dc.workflow.po.bpmn.process;

import com.jb4dc.workflow.po.bpmn.BpmnNs;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "jb4dcAuthorities",namespace = BpmnNs.JB4DC_URI)
public class Jb4dcAuthorities {
    @XmlAttribute(name = "authoritiesUsed")
    String authoritiesUsed;

    @XmlAttribute(name = "authoritiesOnlySendBackCanEdit")
    String authoritiesOnlySendBackCanEdit;

    @XmlAttribute(name = "authoritiesAllFieldAuthority")
    String authoritiesAllFieldAuthority;

    @XmlAttribute(name = "authoritiesFileAuthority")
    String authoritiesFileAuthority;

    @XmlAttribute(name = "authoritiesDocumentAuthority")
    String authoritiesDocumentAuthority;

    @XmlAttribute(name = "authoritiesJsApi")
    String authoritiesJsApi;

    @XmlAttribute(name = "authoritiesJavaApi")
    String authoritiesJavaApi;

    @XmlAttribute(name = "authoritiesDesc")
    String authoritiesDesc;

    @XmlElement(name = "jb4dcAuthority",namespace = BpmnNs.JB4DC_URI)
    List<Jb4dcAuthority> jb4dcAuthority;

    public String getAuthoritiesUsed() {
        return authoritiesUsed;
    }

    public void setAuthoritiesUsed(String authoritiesUsed) {
        this.authoritiesUsed = authoritiesUsed;
    }

    public String getAuthoritiesOnlySendBackCanEdit() {
        return authoritiesOnlySendBackCanEdit;
    }

    public void setAuthoritiesOnlySendBackCanEdit(String authoritiesOnlySendBackCanEdit) {
        this.authoritiesOnlySendBackCanEdit = authoritiesOnlySendBackCanEdit;
    }

    public String getAuthoritiesAllFieldAuthority() {
        return authoritiesAllFieldAuthority;
    }

    public void setAuthoritiesAllFieldAuthority(String authoritiesAllFieldAuthority) {
        this.authoritiesAllFieldAuthority = authoritiesAllFieldAuthority;
    }

    public String getAuthoritiesFileAuthority() {
        return authoritiesFileAuthority;
    }

    public void setAuthoritiesFileAuthority(String authoritiesFileAuthority) {
        this.authoritiesFileAuthority = authoritiesFileAuthority;
    }

    public String getAuthoritiesDocumentAuthority() {
        return authoritiesDocumentAuthority;
    }

    public void setAuthoritiesDocumentAuthority(String authoritiesDocumentAuthority) {
        this.authoritiesDocumentAuthority = authoritiesDocumentAuthority;
    }

    public String getAuthoritiesJsApi() {
        return authoritiesJsApi;
    }

    public void setAuthoritiesJsApi(String authoritiesJsApi) {
        this.authoritiesJsApi = authoritiesJsApi;
    }

    public String getAuthoritiesJavaApi() {
        return authoritiesJavaApi;
    }

    public void setAuthoritiesJavaApi(String authoritiesJavaApi) {
        this.authoritiesJavaApi = authoritiesJavaApi;
    }

    public String getAuthoritiesDesc() {
        return authoritiesDesc;
    }

    public void setAuthoritiesDesc(String authoritiesDesc) {
        this.authoritiesDesc = authoritiesDesc;
    }

    public List<Jb4dcAuthority> getJb4dcAuthority() {
        return jb4dcAuthority;
    }

    public void setJb4dcAuthority(List<Jb4dcAuthority> jb4dcAuthority) {
        this.jb4dcAuthority = jb4dcAuthority;
    }
}

