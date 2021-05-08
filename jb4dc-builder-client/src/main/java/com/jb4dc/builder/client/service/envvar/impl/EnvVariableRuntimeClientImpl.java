package com.jb4dc.builder.client.service.envvar.impl;

import com.jb4dc.builder.client.service.envvar.IEnvVariableRuntimeClient;
import com.jb4dc.builder.client.proxy.DelRuntimeProxyBase;
import com.jb4dc.builder.client.service.envvar.IEnvVariableCreator;
import com.jb4dc.builder.client.remote.EnvVariableRuntimeRemote;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.ClassUtility;
import com.jb4dc.workflow.po.EnvVariableResultPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/11
 * To change this template use File | Settings | File Templates.
 */
@Service
public class EnvVariableRuntimeClientImpl implements IEnvVariableRuntimeClient {

    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    //@Autowired(required = false)
    //IEnvVariableService envVariableService;

    @Autowired
    EnvVariableRuntimeRemote envVariableRuntimeRemote;

    @Override
    public EnvVariableResultPO execDefaultValueResult(JB4DCSession jb4DCSession, String fieldDefaultType, String fieldDefaultValue) throws JBuild4DCGenerallyException, IOException {
        if(fieldDefaultType.toUpperCase().equals("CONST")){
            return new EnvVariableResultPO(fieldDefaultValue);
        }
        else {
            return this.execEnvVarResult(jb4DCSession,fieldDefaultValue);
        }
    }

    /*@Override
    public EnvVariableEntity getEnvVariableEntityByValue(JB4DCSession jb4DCSession, String value) throws JBuild4DCGenerallyException, IOException {
        EnvVariableEntity envVariableEntity;
        //通过本地bean获取环境变量实体,如果不存在业务bean,则通过rest接口远程获取.
        if(envVariableService!=null){
            envVariableEntity=envVariableService.getEntityByValue(value);
        }
        else{
            //envVariableEntity=new EnvVariableEntity();
            //则通过rest接口远程获取.
            envVariableEntity=jb4DCCacheManagerV2.autoGetFromCache(JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName,
                    "Proxy",
                    this.getClass(), "GetEnvVariableEntityByValue_"+value, new IBuildGeneralObj<EnvVariableEntity>() {
                @Override
                public EnvVariableEntity BuildObj() throws JBuild4DCGenerallyException {
                    EnvVariableEntity temp=envVariableRuntimeRemote.getEnvVariableByEnvValue(value).getData();
                    return temp;
                }
            },EnvVariableEntity.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
        }
        return envVariableEntity;
    }*/

    @Override
    public EnvVariableResultPO execEnvVarResult(JB4DCSession jb4DCSession, String value) throws JBuild4DCGenerallyException, IOException {

        EnvVariableEntity envVariableEntity=envVariableRuntimeRemote.getEnvVariableByEnvValue(value).getData();

        IEnvVariableCreator varCreater=null;
        try {
            varCreater=(IEnvVariableCreator) ClassUtility.loadClass(envVariableEntity.getEnvVarClassName()).newInstance();
            autowireCapableBeanFactory.autowireBean(varCreater);

        } catch (InstantiationException ex) {
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        } catch (IllegalAccessException ex) {
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }

        try {
            return varCreater.createVar(jb4DCSession,envVariableEntity);
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }
    }
}
