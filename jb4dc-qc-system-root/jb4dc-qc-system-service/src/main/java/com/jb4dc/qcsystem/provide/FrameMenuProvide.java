package com.jb4dc.qcsystem.provide;

import com.jb4dc.base.service.po.MenuPO;
import com.jb4dc.base.service.provide.IFrameMenuProvide;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.sso.client.remote.MenuRemote;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/13
 * To change this template use File | Settings | File Templates.
 */
@Service
public class FrameMenuProvide implements IFrameMenuProvide {

    MenuRemote menuRemote;

    public FrameMenuProvide(MenuRemote _menuRemote){
        this.menuRemote=_menuRemote;
    }

    @Override
    public List<MenuPO> getMyFrameMenu(JB4DCSession jb4DCSession) {
        List<MenuPO> menuPOList =  menuRemote.getMyAuthMenusBySystemId("QCSystem").getData();
        return menuPOList;
    }
}
