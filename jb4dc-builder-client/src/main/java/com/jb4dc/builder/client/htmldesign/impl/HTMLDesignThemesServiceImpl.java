package com.jb4dc.builder.client.htmldesign.impl;


import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.client.htmldesign.IHTMLDesignThemesService;
import com.jb4dc.builder.po.DesignThemeConfigPO;
import com.jb4dc.builder.po.DesignThemePO;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import java.io.InputStream;
import java.util.List;

@Service
public class HTMLDesignThemesServiceImpl implements IHTMLDesignThemesService {

    @Override
    public List<DesignThemePO> getDesignThemeList() throws JAXBException {
        InputStream is = getClass().getResourceAsStream("/config/builder/htmldesign/design-themes-config.xml");
        return XMLUtility.toObject(is, DesignThemeConfigPO.class).getThemes();
    }
}
