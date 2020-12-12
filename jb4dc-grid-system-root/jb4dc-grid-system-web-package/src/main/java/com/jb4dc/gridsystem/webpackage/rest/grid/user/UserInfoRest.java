package com.jb4dc.gridsystem.webpackage.rest.grid.user;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gridsystem.cache.GridCacheManager;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntity;
import com.jb4dc.gridsystem.service.gridinfo.IGridInfoService;
import com.jb4dc.gridsystem.service.proxy.UserLocationProxy;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(tags = "用户信息")
@RestController
@RequestMapping(value = "/Rest/Grid/User/UserInfo")
public class UserInfoRest {

    @Autowired
    UserLocationProxy userLocationProxy;

    @Autowired
    IGridInfoService gridInfoService;

    @RequestMapping(value = "/GetSessionInfoByTokenId", method = RequestMethod.GET)
    public JBuild4DCResponseVo getSessionInfoByTokenId(String tokenId) throws JBuild4DCGenerallyException, ServletException {
        JB4DCSession session=userLocationProxy.getAppClientSession(tokenId);
        if(session==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"通过TokenId:["+tokenId+"]无法找到相关的用户信息!");
        }

        GridInfoEntity gridInfoEntity=gridInfoService.getByPrimaryKey(session,session.getOrganId());

        JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
        responseVo.setData(session);
        Map<String,Object> exMap=new HashMap<>();
        exMap.put("gridInfoEntity",gridInfoEntity);
        responseVo.setExKVData(exMap);
        return responseVo;
    }
}
