package com.jb4dc.builder.client.service.api.mockapi;

import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/1
 * To change this template use File | Settings | File Templates.
 */
public class SoutApi implements IApiForButton {

    @Override
    public ApiRunResult runApi(ApiRunPara apiRunPara) {
        System.out.println(apiRunPara);
        return ApiRunResult.successResult();
    }
}
