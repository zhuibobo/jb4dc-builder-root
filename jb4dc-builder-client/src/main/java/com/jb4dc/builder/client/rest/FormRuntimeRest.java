package com.jb4dc.builder.client.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.client.remote.FormRuntimeRemote;
import com.jb4dc.builder.client.remote.ListButtonRuntimeRemote;
import com.jb4dc.builder.client.service.webform.IWebFormRuntimeService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.FormDataRelationPO;
import com.jb4dc.builder.po.FormResourceComplexPO;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/21
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/FormRuntime")
public class FormRuntimeRest {

    @Autowired
    FormRuntimeRemote formRuntimeRemote;

    @Autowired
    ListButtonRuntimeRemote listButtonRuntimeRemote;

    @Autowired
    IWebFormRuntimeService webFormRuntimeService;

    @RequestMapping("/LoadHTML")
    public JBuild4DCResponseVo<FormResourceComplexPO> loadHTML(String formId, String recordId, String buttonId) throws JBuild4DCGenerallyException, IOException {

        JBuild4DCResponseVo<FormResourcePO> formResourcePOJBuild4DCResponseVo = formRuntimeRemote.loadHTML(formId);
        if (!formResourcePOJBuild4DCResponseVo.isSuccess()) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "获取远程窗体失败!" + formResourcePOJBuild4DCResponseVo.getMessage());
        }

        JBuild4DCResponseVo<ListButtonEntity> listButtonEntityJBuild4DCResponseVo = listButtonRuntimeRemote.getButtonPO(buttonId);
        if (!listButtonEntityJBuild4DCResponseVo.isSuccess()) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "获取远程按钮设置失败!" + listButtonEntityJBuild4DCResponseVo.getMessage());
        }

        FormResourceComplexPO formResourceComplexPO = webFormRuntimeService.resolveFormResourceComplex(JB4DCSessionUtility.getSession(),recordId, formResourcePOJBuild4DCResponseVo.getData(),listButtonEntityJBuild4DCResponseVo.getData());
        return JBuild4DCResponseVo.getDataSuccess(formResourceComplexPO);

    }
}
