package com.jb4dc.builder.client.proxy.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.builder.client.proxy.IDataSetRuntimeProxy;
import com.jb4dc.builder.client.proxy.IDictionaryRuntimeProxy;
import com.jb4dc.builder.client.remote.DictionaryRuntimeRemote;
import com.jb4dc.builder.client.remote.EnvVariableRuntimeRemote;
import com.jb4dc.builder.client.service.RuntimeProxyBase;
import com.jb4dc.builder.client.service.envvar.IEnvVariableService;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/25
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DictionaryRuntimeProxyImpl extends RuntimeProxyBase implements IDictionaryRuntimeProxy {

    //@Autowired
    //IDictionaryService dictionaryService;

    @Autowired
    DictionaryRuntimeRemote dictionaryRuntimeRemote;

    @Override
    public List<DictionaryEntity> getDDByGroupId(String groupId) throws JBuild4DCGenerallyException {
        List<DictionaryEntity> dictionaryEntityList;
        dictionaryEntityList = autoGetFromCache(this.getClass(), "getDDByGroupId_"+groupId, new IBuildGeneralObj<List<DictionaryEntity>>() {
            @Override
            public List<DictionaryEntity> BuildObj() throws JBuild4DCGenerallyException {
                List<DictionaryEntity> temp = dictionaryRuntimeRemote.getDDByGroupId(groupId).getData();
                return temp;
            }
        });
        return dictionaryEntityList;
    }
}
