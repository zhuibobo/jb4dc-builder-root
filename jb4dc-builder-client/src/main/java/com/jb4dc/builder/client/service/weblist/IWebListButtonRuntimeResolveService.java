package com.jb4dc.builder.client.service.weblist;

import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/31
 * To change this template use File | Settings | File Templates.
 */
public interface IWebListButtonRuntimeResolveService {
    ListButtonEntity getButtonPO(String buttonId) throws JBuild4DCGenerallyException;
}
