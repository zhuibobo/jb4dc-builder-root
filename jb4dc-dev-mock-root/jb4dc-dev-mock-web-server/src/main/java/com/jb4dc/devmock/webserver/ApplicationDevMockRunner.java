package com.jb4dc.devmock.webserver;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.devmock.service.IDemoTLTreeService;
import com.jb4dc.devmock.service.IDemoTreeTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/27
 * To change this template use File | Settings | File Templates.
 */
@Component
public class ApplicationDevMockRunner implements ApplicationRunner {

    @Autowired
    IDemoTreeTableService demoTreeTableService;

    @Autowired
    IDemoTLTreeService demoTLTreeService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        demoTreeTableService.createRootNode(JB4DCSessionUtility.getInitSystemSession());
        demoTLTreeService.createRootNode(JB4DCSessionUtility.getInitSystemSession());
    }
}
