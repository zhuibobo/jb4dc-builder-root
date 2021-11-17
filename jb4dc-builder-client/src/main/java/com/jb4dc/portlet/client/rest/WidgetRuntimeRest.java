package com.jb4dc.portlet.client.rest;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.portlet.client.remote.WidgetRuntimeRemote;
import com.jb4dc.portlet.dbentities.WidgetEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Portlet/RunTime/Client/WidgetRuntime")
public class WidgetRuntimeRest {

    @Autowired
    WidgetRuntimeRemote widgetRuntimeRemote;

    @RequestMapping(value = "/GetALLWidget",method = RequestMethod.GET)
    public JBuild4DCResponseVo<List<WidgetEntity>> getALLWidget(String menuId) throws JBuild4DCGenerallyException, IOException {
        return widgetRuntimeRemote.getALLWidget();
    }
}
