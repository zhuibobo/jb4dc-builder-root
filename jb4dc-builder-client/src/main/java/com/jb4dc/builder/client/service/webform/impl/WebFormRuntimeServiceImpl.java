package com.jb4dc.builder.client.service.webform.impl;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.client.service.webform.IWebFormRuntimeService;
import com.jb4dc.builder.po.FormDataRelationPO;
import com.jb4dc.builder.po.FormResourceComplexPO;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
@Service
public class WebFormRuntimeServiceImpl implements IWebFormRuntimeService {

    @Autowired
    IHTMLRuntimeResolve htmlRuntimeResolve;

    @Override
    public FormResourceComplexPO resolveFormResourceComplex(JB4DCSession session, FormResourcePO remoteSourcePO) throws IOException, JBuild4DCGenerallyException {

        List<FormDataRelationPO> formDataRelationPOList;

        if(StringUtility.isNotEmpty(remoteSourcePO.getFormDataRelation())) {
            formDataRelationPOList = JsonUtility.toObjectList(remoteSourcePO.getFormDataRelation(), FormDataRelationPO.class);

        }
        else
        {
            throw  new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"该表单未设置数据关系!");
        }

        String formHtmlRuntime=htmlRuntimeResolve.dynamicBind(JB4DCSessionUtility.getSession(),remoteSourcePO.getFormId(),remoteSourcePO.getFormHtmlResolve());

        FormResourceComplexPO formResourceComplexPO=new FormResourceComplexPO(remoteSourcePO,formHtmlRuntime,"",null);

        return formResourceComplexPO;
    }
}
