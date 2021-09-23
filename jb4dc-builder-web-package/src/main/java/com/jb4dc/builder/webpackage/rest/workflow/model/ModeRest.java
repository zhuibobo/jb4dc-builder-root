package com.jb4dc.builder.webpackage.rest.workflow.model;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.integrate.extend.IModelGroupExtendService;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.po.FlowInstanceRuntimePO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;

@RestController
@RequestMapping(value = "/Rest/WorkFlow/Model/ModelMain")
public class ModeRest extends GeneralRest<ModelIntegratedEntity> {

    @Autowired
    IModelIntegratedExtendService modelIntegratedExtendService;

    /*@Override
    public String getModuleName() {
        return "流程模型";
    }*/

    @Override
    protected IBaseService<ModelIntegratedEntity> getBaseService() {
        return modelIntegratedExtendService;
    }

    @RequestMapping(
            value = {"/GetLastDeployedVersionModelEntity"},
            method = {RequestMethod.POST, RequestMethod.GET}
    )
    public JBuild4DCResponseVo getLastDeployedVersionModelEntity(String modelReKey) throws IOException, JBuild4DCGenerallyException, JAXBException, XMLStreamException {
        JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();
        ModelIntegratedEntity modelIntegratedEntity=modelIntegratedExtendService.getLastDeployedPOByModelReKey(jb4DSession,modelReKey);
        return JBuild4DCResponseVo.getDataSuccess(modelIntegratedEntity);
    }
}
