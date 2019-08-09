package com.jb4dc.builder.htmldesign;


import com.jb4dc.builder.po.DesignThemePO;

import javax.xml.bind.JAXBException;
import java.util.List;

public interface IHTMLDesignThemesService {
    List<DesignThemePO> getDesignThemeList() throws JAXBException;
}
