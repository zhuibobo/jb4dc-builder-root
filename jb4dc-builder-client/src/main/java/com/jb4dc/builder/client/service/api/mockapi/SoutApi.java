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
        System.out.println(String.format("执行了运行类型[%s]的API:[%s]",apiRunPara.getInnerFormButtonConfigAPI().getRunTime(),apiRunPara.getApiItemEntity().getApiItemClassName()));
        System.out.println(String.format("记录ID:%s",apiRunPara.getFormRecordComplexPO().getRecordId()));
        return ApiRunResult.successResult();
    }
}
