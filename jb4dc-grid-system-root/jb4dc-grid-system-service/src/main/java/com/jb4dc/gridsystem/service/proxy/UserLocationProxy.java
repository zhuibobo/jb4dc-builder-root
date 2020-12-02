package com.jb4dc.gridsystem.service.proxy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.encryption.digitaldigest.MD5Utility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.gridsystem.cache.GridCacheManager;
import com.jb4dc.gridsystem.dbentities.terminal.GatherTerminalInfoEntity;
import com.jb4dc.gridsystem.service.terminal.IGatherTerminalInfoService;
import com.jb4dc.sso.client.proxy.IOrganRuntimeProxy;
import com.jb4dc.sso.client.proxy.IUserRuntimeProxy;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;
import org.springframework.stereotype.Service;

import javax.servlet.ServletException;
import java.io.IOException;

@Service
public class UserLocationProxy {
    //@Autowired
    IUserRuntimeProxy userRuntimeProxy;

    IOrganRuntimeProxy organRuntimeProxy;

    IGatherTerminalInfoService gatherTerminalInfoService;

    GridCacheManager gridCacheManager;

    public UserLocationProxy(IUserRuntimeProxy userRuntimeProxy, IOrganRuntimeProxy organRuntimeProxy, IGatherTerminalInfoService gatherTerminalInfoService, GridCacheManager gridCacheManager) {
        this.userRuntimeProxy = userRuntimeProxy;
        this.organRuntimeProxy = organRuntimeProxy;
        this.gatherTerminalInfoService = gatherTerminalInfoService;
        this.gridCacheManager = gridCacheManager;
    }

    public JB4DCSession checkUser(String accountName, String password, String terminalToken) throws JBuild4DCGenerallyException, JsonProcessingException {

        UserEntity userEntity=userRuntimeProxy.getUserByAccountName(accountName).getData();
        if (userEntity!=null) {
            String inputPassword = MD5Utility.GetMD5Code(password, true);
            if (userEntity.getUserPassword().equals(inputPassword)) {
                GatherTerminalInfoEntity gatherTerminalInfoEntity = gatherTerminalInfoService.getByCode(terminalToken);
                if (gatherTerminalInfoEntity == null) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, "该设备未获得登录授权!");
                } else {
                    OrganEntity organEntity=organRuntimeProxy.getOrganById(userEntity.getUserOrganId()).getData();
                    JB4DCSession jb4DCSession=new JB4DCSession();
                    jb4DCSession.setOrganId(userEntity.getUserOrganId());
                    jb4DCSession.setOrganName(organEntity.getOrganName());
                    jb4DCSession.setUserId(userEntity.getUserId());
                    jb4DCSession.setUserName(userEntity.getUserName());
                    String appClientToken= UUIDUtility.getUUID();
                    jb4DCSession.setAppClientToken(appClientToken);
                    String json= JsonUtility.toObjectString(jb4DCSession);
                    gridCacheManager.put(GridCacheManager.GRID_APP_CLIENT_LOGIN_STORE_CACHE_MANAGER,appClientToken,json);
                    return jb4DCSession;
                }
            }
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"用户名或者密码错误!");
    }

    public JB4DCSession getAppClientSession(String appClientToken) throws ServletException {
        try {
            if(gridCacheManager.exist(GridCacheManager.GRID_APP_CLIENT_LOGIN_STORE_CACHE_MANAGER,appClientToken)){
               String sessionJson= gridCacheManager.getString(GridCacheManager.GRID_APP_CLIENT_LOGIN_STORE_CACHE_MANAGER,appClientToken);
                JB4DCSession jb4DCSession=JsonUtility.toObject(sessionJson,JB4DCSession.class);
                JB4DCSessionUtility.addLocationLoginedJB4DCSession(jb4DCSession);
            }
        } catch (JBuild4DCGenerallyException | IOException e) {
            e.printStackTrace();
            throw new ServletException(e.getMessage());
        }
        return null;
    }
}
