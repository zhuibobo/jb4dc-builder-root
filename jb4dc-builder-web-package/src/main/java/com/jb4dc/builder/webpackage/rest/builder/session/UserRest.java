package com.jb4dc.builder.webpackage.rest.builder.session;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/Session/User")
public class UserRest {
    @RequestMapping(value = "GetMySessionUser")
    public JBuild4DCResponseVo getMySessionUser() throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,jb4DCSession);
    }
}
