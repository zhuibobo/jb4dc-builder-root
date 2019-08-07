package com.jb4dc.builder.webpackage.rest.builder.module;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.builder.webpackage.RestTestBase;
import com.jb4dc.core.base.session.JB4DCSession;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;


public class ModuleRestTest extends RestTestBase {
    @Autowired
    IModuleService moduleService;

    String moduleId="DevMockModuleId";

    @Test
    public void addDevTestGroup() throws Exception {
        moduleService.deleteByKeyNotValidate(JB4DCSessionUtility.getInitSystemSession(),moduleId, JBuild4DCYaml.getWarningOperationCode());
        ModuleEntity moduleEntity=new ModuleEntity();
        moduleEntity.setModuleId(moduleId);
        moduleEntity.setModuleValue(moduleId);
        moduleEntity.setModuleText("开发样例分组");
        moduleEntity.setModuleStatus(EnableTypeEnum.enable.getDisplayName());
        moduleEntity.setModuleParentId("0");
        moduleEntity.setModuleIsSystem(TrueFalseEnum.False.getDisplayName());
        moduleEntity.setModuleDelEnable(EnableTypeEnum.enable.getDisplayName());

        moduleService.saveSimple(JB4DCSessionUtility.getInitSystemSession(),moduleId,moduleEntity);
    }
}
