package com.jb4dc.builder.service.button;

import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.po.ButtonAPIConfigPO;
import com.jb4dc.builder.po.ButtonAPIGroupPO;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import java.io.InputStream;
import java.util.List;

@Service
public class ButtonAPIService {

    public List<ButtonAPIGroupPO> getButtonAPIGroupList() throws JAXBException {
        InputStream is = this.getClass().getResourceAsStream("/config/builder/button-api-config.xml");
        return XMLUtility.toObject(is, ButtonAPIConfigPO.class).getButtonAPIGroupVoList();
    }
}
