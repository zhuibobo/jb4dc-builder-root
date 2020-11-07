package com.jb4dc.devmock.webserver.rest.devdemo;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.devmock.dbentities.DemoTlTreeEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/6
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/DevDemo/LogDemo")
public class LogDemoRest {
    Logger logger= LoggerFactory.getLogger(this.getClass());

    @RequestMapping(value = "/DebugLog", method = RequestMethod.POST)
    public JBuild4DCResponseVo debugLog() {
        logger.debug(BaseUtility.wrapDevLog("debugLog............"));
        return JBuild4DCResponseVo.opSuccess();
    }
}
