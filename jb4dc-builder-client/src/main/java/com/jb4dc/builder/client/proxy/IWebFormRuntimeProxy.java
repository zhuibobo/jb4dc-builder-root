package com.jb4dc.builder.client.proxy;

import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/6
 * To change this template use File | Settings | File Templates.
 */
public interface IWebFormRuntimeProxy {
    FormResourcePO getFormRuntimePageContentById(JB4DCSession jb4DCSession, String formId) throws JBuild4DCGenerallyException;
}
