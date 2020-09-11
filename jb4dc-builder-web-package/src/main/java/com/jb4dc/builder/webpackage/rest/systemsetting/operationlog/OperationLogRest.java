package com.jb4dc.builder.webpackage.rest.systemsetting.operationlog;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.IOperationLogService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.po.OperationLogPO;
import com.jb4dc.builder.dbentities.systemsetting.OperationLogEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/Rest/SystemSetting/Oper/OperationLog")
public class OperationLogRest extends GeneralRest<OperationLogEntity> {

    @Autowired
    IOperationLogService operationLogService;

    @Override
    public String getModuleName() {
        return "操作日志";
    }

    @Override
    protected IBaseService<OperationLogEntity> getBaseService() {
        return (IBaseService)operationLogService;
    }

    @RequestMapping("/WriteOperationLog")
    public JBuild4DCResponseVo writeOperationLog(@RequestBody OperationLogPO logPO, HttpServletRequest request) throws JsonProcessingException, JBuild4DCGenerallyException {
        operationLogService.writeOperationLog(JB4DCSessionUtility.getSession(),logPO.getLogSystemName(),logPO.getLogModuleName(),logPO.getLogActionName(),logPO.getLogType(),logPO.getLogText(),logPO.getLogData(),logPO.getLogClassName(),request);
        return JBuild4DCResponseVo.opSuccess();
    }
}
