package com.jb4dc.builder.po;

import javax.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "Ref")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "type",
        "path"
})
public class DesignThemeRefPO {

    @XmlAttribute(name="type")
    private String type;

    @XmlAttribute(name="path")
    private String path;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
