package com.jb4dc.builder.po;


import javax.xml.bind.annotation.*;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "ButtonAPIConfig")

// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "buttonAPIGroupVoList"
})
public class ButtonAPIConfigPO {

    @XmlElement(name = "Group")
    private List<ButtonAPIGroupPO> buttonAPIGroupVoList;

    public List<ButtonAPIGroupPO> getButtonAPIGroupVoList() {
        return buttonAPIGroupVoList;
    }

    public void setButtonAPIGroupVoList(List<ButtonAPIGroupPO> buttonAPIGroupVoList) {
        this.buttonAPIGroupVoList = buttonAPIGroupVoList;
    }
}
