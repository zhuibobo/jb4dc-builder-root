package com.jb4dc.builder.client.service.webform.proxy;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.builder.client.remote.FormRuntimeRemote;
import com.jb4dc.builder.client.remote.ListButtonRuntimeRemote;
import com.jb4dc.builder.client.service.RuntimeProxyBase;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.builder.client.service.webform.IWebFormRuntimeService;
import com.jb4dc.builder.po.FormResourceComplexPO;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/6
 * To change this template use File | Settings | File Templates.
 */
@Service
public class WebFormRuntimeProxyImpl extends RuntimeProxyBase implements IWebFormRuntimeProxy {

    @Autowired
    FormRuntimeRemote formRuntimeRemote;

    @Autowired(required = false)
    IFormResourceService formResourceService;

    @Override
    public FormResourcePO getFormRuntimePageContentById(JB4DCSession jb4DCSession, String formId) throws JBuild4DCGenerallyException {
        FormResourcePO formResourcePO=new FormResourcePO();
        if(formResourceService!=null){
            formResourcePO = formResourceService.getFormRuntimePageContent(jb4DCSession,formId);
        }
        else{
            formResourcePO = this.autoGetFromCache(this.getClass(), formId, new IBuildGeneralObj<FormResourcePO>() {
                @Override
                public FormResourcePO BuildObj() throws JBuild4DCGenerallyException {
                    FormResourcePO temp = formRuntimeRemote.loadHTML(formId).getData();
                    return temp;
                }
            });
        }
        return formResourcePO;
    }
}
