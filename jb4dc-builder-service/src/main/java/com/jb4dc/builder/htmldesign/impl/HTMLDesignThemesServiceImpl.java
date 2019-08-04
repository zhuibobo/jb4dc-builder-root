package com.jb4dc.builder.htmldesign.impl;


import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.builder.htmldesign.IHTMLDesignThemesService;
import com.jb4dc.builder.po.DesignThemeConfigVo;
import com.jb4dc.builder.po.DesignThemeVo;

import javax.xml.bind.JAXBException;
import java.io.InputStream;
import java.util.List;

public class HTMLDesignThemesServiceImpl implements IHTMLDesignThemesService {

    @Override
    public List<DesignThemeVo> getDesignThemeList() throws JAXBException {
        InputStream is = getClass().getResourceAsStream("/builder/htmldesign/DesignThemesConfig.xml");
        return XMLUtility.toObject(is, DesignThemeConfigVo.class).getThemes();
    }
}
