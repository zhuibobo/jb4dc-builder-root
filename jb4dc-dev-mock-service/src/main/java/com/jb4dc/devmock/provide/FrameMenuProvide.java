package com.jb4dc.devmock.provide;

import com.jb4dc.base.service.po.MenuPO;
import com.jb4dc.base.service.provide.IFrameMenuProvide;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.sso.client.remote.MenuRemote;
import com.jb4dc.sso.client.remote.MenuRuntimeRemote;
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

    MenuRuntimeRemote menuRemote;

    public FrameMenuProvide(MenuRuntimeRemote _menuRemote){
        this.menuRemote=_menuRemote;
    }

    @Override
    public List<MenuPO> getMyFrameMenu(JB4DCSession jb4DCSession) {
        List<MenuPO> menuPOList =  menuRemote.getMyAuthMenusBySystemIdRT(jb4DCSession.getUserId(),"DevMockApp").getData();
        if(jb4DCSession.getUserId().equals("Alex4D")){
            return menuPOList;
        }
        return ListUtility.Where(menuPOList, new IListWhereCondition<MenuPO>() {
            @Override
            public boolean Condition(MenuPO item) {
                return item.getMenuOuterName().equals(jb4DCSession.getUserId());
            }
        });
    }
}
