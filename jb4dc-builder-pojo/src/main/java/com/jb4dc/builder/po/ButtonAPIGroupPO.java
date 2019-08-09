package com.jb4dc.builder.po;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "Group")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "name",
        "buttonAPIPOList"
})
public class ButtonAPIGroupPO {

    @XmlAttribute(name = "name")
    private String name;

    @XmlElement(name = "API")
    private List<ButtonAPIPO> buttonAPIPOList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ButtonAPIPO> getButtonAPIPOList() {
        return buttonAPIPOList;
    }

    public void setButtonAPIPOList(List<ButtonAPIPO> buttonAPIPOList) {
        this.buttonAPIPOList = buttonAPIPOList;
    }
}
