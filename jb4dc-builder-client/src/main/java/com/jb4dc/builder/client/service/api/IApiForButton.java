package com.jb4dc.builder.client.service.api;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/1
 * To change this template use File | Settings | File Templates.
 */
public interface IApiForButton {
    ApiRunResult runApi(ApiRunPara apiRunPara) throws JBuild4DCGenerallyException;
}
