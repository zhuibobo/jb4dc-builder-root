package com.jb4dc.builder.htmldesign;


import com.jb4dc.builder.po.DesignThemeVo;

import javax.xml.bind.JAXBException;
import java.util.List;

public interface IHTMLDesignThemesService {
    List<DesignThemeVo> getDesignThemeList() throws JAXBException;
}
