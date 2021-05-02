package com.jb4dc.builder.webpackage.ssoclient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCUnitSessionSessionUtility;
import com.jb4dc.base.service.po.MenuPO;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.webpackage.RestTestBase;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.MenuRuntimeRemote;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class MenuRuntimeRemoteTest  extends RestTestBase {
    //@Autowired
    //AppRuntimeProxy appRuntimeProxy;

    @Autowired
    MenuRuntimeRemote menuRuntimeRemote;

    @Test
    public void getMyAuthMenusBySystemIdRT() throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCUnitSessionSessionUtility.mockLogin(getAlex4DSession());
        JBuild4DCResponseVo<List<MenuPO>> result = menuRuntimeRemote.getMyAuthMenusBySystemIdRT("Alex4D","BuilderMainApp");
        for (MenuPO menuPO : result.getData()) {
            System.out.println(menuPO.getMenuName());
        }

        String json = JsonUtility.toObjectString(result);
        System.out.println(json);
    }
}