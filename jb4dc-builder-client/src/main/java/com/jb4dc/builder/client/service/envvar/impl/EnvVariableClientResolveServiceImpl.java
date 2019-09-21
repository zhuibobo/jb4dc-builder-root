package com.jb4dc.builder.client.service.envvar.impl;

import com.jb4dc.builder.client.envvariable.IAPIVariableCreator;
import com.jb4dc.builder.client.remote.EnvVariableRuntimeRemote;
import com.jb4dc.builder.client.service.envvar.IEnvVariableClientResolveService;
import com.jb4dc.builder.client.service.envvar.IEnvVariableService;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.ClassUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/11
 * To change this template use File | Settings | File Templates.
 */
@Service
public class EnvVariableClientResolveServiceImpl implements IEnvVariableClientResolveService {

    @Autowired(required = false)
    IEnvVariableService envVariableService;

    @Autowired
    EnvVariableRuntimeRemote envVariableRuntimeRemote;

    @Override
    public String execEnvVarResult(JB4DCSession jb4DCSession, String value) throws JBuild4DCGenerallyException {
        EnvVariableEntity envVariableEntity;
        //通过本地bean获取环境变量实体,如果不存在业务bean,则通过rest接口远程获取.
        if(envVariableService!=null){
            envVariableEntity=envVariableService.getEntityByValue(value);
        }
        else{
            //envVariableEntity=new EnvVariableEntity();
            //则通过rest接口远程获取.
            envVariableEntity=envVariableRuntimeRemote.getEnvVariableByEnvValue(value).getData();
        }

        IAPIVariableCreator varCreater=null;
        try {
            varCreater=(IAPIVariableCreator) ClassUtility.loadClass(envVariableEntity.getEnvVarClassName()).newInstance();
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
