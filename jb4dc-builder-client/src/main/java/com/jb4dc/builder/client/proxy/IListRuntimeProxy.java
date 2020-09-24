package com.jb4dc.builder.client.proxy;

import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/22
 * To change this template use File | Settings | File Templates.
 */
public interface IListRuntimeProxy {
    ListResourcePO loadHTML(JB4DCSession jb4DCSession, String listId) throws JBuild4DCGenerallyException;
}
