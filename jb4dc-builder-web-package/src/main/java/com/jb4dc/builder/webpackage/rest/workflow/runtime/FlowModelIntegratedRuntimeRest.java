package com.jb4dc.builder.webpackage.rest.workflow.runtime;

import com.jb4dc.base.service.general.JB4DCSessionCenter;
import com.jb4dc.builder.webpackage.rest.workflow.FlowModelIntegratedRest;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.integrate.extend.IModelGroupExtendService;
import com.jb4dc.workflow.integrate.extend.IModelGroupRefExtendService;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.FlowModelRuntimePO;
import org.json.XML;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.stream.Collectors;


/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2021/4/23
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/FlowModelIntegrated")
public class FlowModelIntegratedRuntimeRest extends FlowModelIntegratedRest {

    @Autowired
    IModelIntegratedExtendService modelIntegratedExtendService;

    @Autowired
    IModelGroupExtendService modelGroupExtendService;

    @Autowired
    IModelGroupRefExtendService modelGroupRefExtendService;

    @RequestMapping(
            value = {"/GetMyBootableModel"},
            method = {RequestMethod.GET}
    )
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(String userId) throws IOException, ParseException, JBuild4DCGenerallyException {
        //XMLSerializer xmlSerializer = new XMLSerializer();
        JB4DCSession session = JB4DCSessionCenter.getUserSessionByUserId(userId);
        List<ModelIntegratedEntity> modelIntegratedEntityList = modelIntegratedExtendService.getMyStartEnableModel(session);
        List<ModelGroupRefEntity> modelGroupRefEntityList=modelGroupRefExtendService.getByModelKeyList(modelIntegratedEntityList.stream().map(item->item.getModelReKey()).collect(Collectors.toList()));
        List<ModelGroupEntity> modelGroupEntityList=modelGroupExtendService.getByIdList(modelGroupRefEntityList.stream().map(item->item.getGrefGroupId()).collect(Collectors.toList()));
        //XML.toJSONObject("").toString(2);

        FlowModelListIntegratedPO flowModelListIntegratedPO=new FlowModelListIntegratedPO();
        flowModelListIntegratedPO.setModelIntegratedEntityList(modelIntegratedEntityList);
        flowModelListIntegratedPO.setModelGroupRefEntityList(modelGroupRefEntityList);
        flowModelListIntegratedPO.setModelGroupEntityList(modelGroupEntityList);
        return JBuild4DCResponseVo.getDataSuccess(flowModelListIntegratedPO);
    }

    @RequestMapping(
            value = {"/GetRuntimeModelWithStart"},
            method = {RequestMethod.GET}
    )
    public JBuild4DCResponseVo<FlowModelRuntimePO> getRuntimeModelWithStart(String userId,String modelKey) throws IOException, ParseException, JBuild4DCGenerallyException, JAXBException, XMLStreamException {
        JB4DCSession session = JB4DCSessionCenter.getUserSessionByUserId(userId);
        FlowModelRuntimePO flowModelRuntimePO=modelIntegratedExtendService.getRuntimeModelWithStart(session,modelKey);
        return JBuild4DCResponseVo.getDataSuccess(flowModelRuntimePO);
    }
}
