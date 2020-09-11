package com.jb4dc.builder.webpackage.rest.systemsetting.parassetting;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.systemsetting.SettingEntity;
import com.jb4dc.builder.service.systemsetting.ISettingService;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/SystemSetting/Para/ParasSetting")
public class ParasSettingRest extends GeneralRest<SettingEntity> {
    @Autowired
    ISettingService settingService;

    @Override
    public String getModuleName() {
        return "系统参数设置";
    }

    @Override
    protected IBaseService<SettingEntity> getBaseService() {
        return settingService;
    }

}
