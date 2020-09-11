package com.jb4dc.builder.service.systemsetting.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.IOperationLogService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.InetAddressUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.builder.dao.systemsetting.OperationLogMapper;
import com.jb4dc.builder.dbentities.systemsetting.OperationLogEntity;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */


public class OperationLogServiceImpl extends BaseServiceImpl<OperationLogEntity> implements IOperationLogService, IBaseService<OperationLogEntity> {

    OperationLogMapper operationLogMapper;

    @Autowired
    public OperationLogServiceImpl(OperationLogMapper _defaultBaseMapper) {
        super(_defaultBaseMapper);
        operationLogMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, OperationLogEntity entity) throws JBuild4DCGenerallyException {
        return this.save(jb4DCSession, id, entity, new IAddBefore<OperationLogEntity>() {
            @Override
            public OperationLogEntity run(JB4DCSession JB4DCSession, OperationLogEntity sourceEntity) throws JBuild4DCGenerallyException {
                sourceEntity.setLogOrderNum(operationLogMapper.nextOrderNum());
                sourceEntity.setLogOrganId(JB4DCSession.getOrganId());
                sourceEntity.setLogOrganName(JB4DCSession.getOrganName());
                sourceEntity.setLogUserId(JB4DCSession.getUserId());
                sourceEntity.setLogUserName(JB4DCSession.getUserName());
                sourceEntity.setLogCreateTime(new Date());
                return sourceEntity;
            }
        });
    }

    @Override
    public void writeUserLoginLog(JB4DCSession jb4DCSession, Class targetClass, HttpServletRequest request) throws JsonProcessingException, JBuild4DCGenerallyException {
        OperationLogEntity logEntity=new OperationLogEntity();
        logEntity.setLogActionName("登录系统");
        logEntity.setLogClassName(targetClass.getName());
        logEntity.setLogCreateTime(new Date());
        logEntity.setLogId(UUIDUtility.getUUID());
        logEntity.setLogModuleName("基础信息");
        logEntity.setLogSystemName("应用管理系统");
        logEntity.setLogOrderNum(operationLogMapper.nextOrderNum());
        logEntity.setLogOrganId(jb4DCSession.getOrganId());
        logEntity.setLogOrganName(jb4DCSession.getOrganName());
        logEntity.setLogUserId(jb4DCSession.getUserId());
        logEntity.setLogUserName(jb4DCSession.getUserName());
        logEntity.setLogStatus("正常");
        logEntity.setLogText("用户["+jb4DCSession.getUserName()+"]登录了系统!");
        logEntity.setLogData(JsonUtility.toObjectString(jb4DCSession));
        logEntity.setLogType("登录日志");
        logEntity.setLogIp(InetAddressUtility.getClientIpAdrress(request));
        this.save(jb4DCSession, logEntity.getLogId(), logEntity, new IAddBefore<OperationLogEntity>() {
            @Override
            public OperationLogEntity run(JB4DCSession JB4DCSession, OperationLogEntity sourceEntity) throws JBuild4DCGenerallyException {
                return sourceEntity;
            }
        });
    }

    @Override
    public void writeUserExitLog(JB4DCSession jb4DCSession, Class targetClass, HttpServletRequest request) throws JsonProcessingException, JBuild4DCGenerallyException {
        OperationLogEntity logEntity=new OperationLogEntity();
        logEntity.setLogActionName("退出系统");
        logEntity.setLogClassName(targetClass.getName());
        logEntity.setLogCreateTime(new Date());
        logEntity.setLogId(UUIDUtility.getUUID());
        logEntity.setLogModuleName("基础信息");
        logEntity.setLogSystemName("应用管理系统");
        logEntity.setLogOrderNum(operationLogMapper.nextOrderNum());
        logEntity.setLogOrganId(jb4DCSession.getOrganId());
        logEntity.setLogOrganName(jb4DCSession.getOrganName());
        logEntity.setLogUserId(jb4DCSession.getUserId());
        logEntity.setLogUserName(jb4DCSession.getUserName());
        logEntity.setLogStatus("正常");
        logEntity.setLogText("用户["+jb4DCSession.getUserName()+"]退出了系统!");
        logEntity.setLogData(JsonUtility.toObjectString(jb4DCSession));
        logEntity.setLogType("登录日志");
        logEntity.setLogIp(InetAddressUtility.getClientIpAdrress(request));
        this.save(jb4DCSession, logEntity.getLogId(), logEntity, new IAddBefore<OperationLogEntity>() {
            @Override
            public OperationLogEntity run(JB4DCSession jb4DCSession, OperationLogEntity sourceEntity) throws JBuild4DCGenerallyException {
                return sourceEntity;
            }
        });
    }

    @Override
    public void writeOperationLog(JB4DCSession jb4DCSession, String subSystemName, String moduleName, String actionName, String type, String text, String data, Class targetClass, HttpServletRequest request) throws JsonProcessingException, JBuild4DCGenerallyException {
       this.writeOperationLog(jb4DCSession,subSystemName,moduleName,actionName,type,text,data,targetClass.getName(),request);
    }

    @Override
    public void writeOperationLog(JB4DCSession jb4DCSession, String subSystemName, String moduleName, String actionName, String type, String text, String data, String targetClass, HttpServletRequest request) throws JsonProcessingException, JBuild4DCGenerallyException {
        OperationLogEntity logEntity=new OperationLogEntity();
        logEntity.setLogSystemName(subSystemName);
        logEntity.setLogModuleName(moduleName);
        logEntity.setLogActionName(actionName);
        logEntity.setLogType(type);
        logEntity.setLogText(text);
        logEntity.setLogData(data);
        logEntity.setLogClassName(targetClass);
        logEntity.setLogId(UUIDUtility.getUUID());
        logEntity.setLogStatus("正常");
        logEntity.setLogIp(InetAddressUtility.getClientIpAdrress(request));
        this.saveSimple(jb4DCSession, logEntity.getLogId(), logEntity);
    }

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JsonProcessingException, JBuild4DCGenerallyException {
        this.writeOperationLog(jb4DCSession,"初始化测试","初始化测试","初始化测试","初始化测试","初始化测试","初始化测试",this.getClass(),null);
    }
}
