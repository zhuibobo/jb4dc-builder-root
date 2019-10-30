package com.jb4dc.builder.client.rest;

import com.jb4dc.builder.po.SubmitResultPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLDecoder;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/10/30
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/InnerFormButtonRuntime")
public class InnerFormButtonRuntimeRest {

    @RequestMapping("/ReceiveHandler")
    public JBuild4DCResponseVo<SubmitResultPO> receiveHandler(String formRecordComplexPO, String recordId, String innerFormButtonId,String listButtonId) throws JBuild4DCGenerallyException, IOException {
        SubmitResultPO submitResultPO=new SubmitResultPO();

        System.out.println(String.format("recordId:%s,innerFormButtonId:%s,listButtonId:%s",recordId,innerFormButtonId,listButtonId));
        System.out.println(URLDecoder.decode(formRecordComplexPO,"utf-8"));

        submitResultPO.setRecordId(recordId);
        return JBuild4DCResponseVo.opSuccess(submitResultPO);
    }

}
