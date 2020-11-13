package com.jb4dc.gridsystem.provide;

import com.jb4dc.base.service.po.MenuPO;
import com.jb4dc.base.service.po.SsoAppPO;
import com.jb4dc.base.service.provide.IFramePageProvide;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.sso.client.proxy.IAppRuntimeProxy;
import com.jb4dc.sso.client.proxy.IMenuRuntimeProxy;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/13
 * To change this template use File | Settings | File Templates.
 */
@Service
public class FrameMenuProvide implements IFramePageProvide {

    IMenuRuntimeProxy menuRuntimeProxy;

    IAppRuntimeProxy appRuntimeProxy;

    JBuild4DCYaml jBuild4DCYaml;

    public FrameMenuProvide(IMenuRuntimeProxy _menuRemoteProxy,IAppRuntimeProxy appRuntimeProxy,JBuild4DCYaml _jBuild4DCYaml){
        this.menuRuntimeProxy=_menuRemoteProxy;
        this.appRuntimeProxy=appRuntimeProxy;
        this.jBuild4DCYaml=_jBuild4DCYaml;
    }

    @Override
    public List<MenuPO> getMyFrameMenu(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        List<MenuPO> menuPOList =  menuRuntimeProxy.getMyAuthMenusBySystemIdRT(jb4DCSession.getUserId(),"GRIDSystem").getData();
        return menuPOList;
    }

    @Override
    public List<SsoAppPO> getMyFrameAuthorityApp(String userId) throws JBuild4DCGenerallyException {
        return appRuntimeProxy.getHasAuthorityAppSSO(userId).getData();
    }

    @Override
    public String getMyFrameLogoutUrl(String userId) throws JBuild4DCGenerallyException {
        return jBuild4DCYaml.getSsoLogoutUrl();
    }
}
