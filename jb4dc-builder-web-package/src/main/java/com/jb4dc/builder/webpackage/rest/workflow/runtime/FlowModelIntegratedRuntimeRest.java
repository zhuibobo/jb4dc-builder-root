package com.jb4dc.builder.webpackage.rest.workflow.runtime;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.webpackage.rest.workflow.FlowModelIntegratedRest;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.remote.FlowModelIntegratedRuntimeRemote;
import com.jb4dc.workflow.dbentities.ModelGroupEntity;
import com.jb4dc.workflow.dbentities.ModelGroupRefEntity;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.integrate.extend.IModelGroupExtendService;
import com.jb4dc.workflow.integrate.extend.IModelGroupRefExtendService;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.po.FlowModelListIntegratedPO;
import com.jb4dc.workflow.po.ModelFilterPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2021/4/23
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/FlowModelIntegratedRuntime")
public class FlowModelIntegratedRuntimeRest extends FlowModelIntegratedRest implements FlowModelIntegratedRuntimeRemote {

    @Autowired
    IModelIntegratedExtendService modelIntegratedExtendService;

    @Autowired
    IModelGroupExtendService modelGroupExtendService;

    @Autowired
    IModelGroupRefExtendService modelGroupRefExtendService;

    @Override
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModel(String userId,String organId,String linkId) throws JBuild4DCGenerallyException {
        //XMLSerializer xmlSerializer = new XMLSerializer();
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        List<ModelIntegratedEntity> modelIntegratedEntityList = modelIntegratedExtendService.getMyStartEnableModel(jb4DCSession,linkId);
        //FlowModelListIntegratedPO flowModelListIntegratedPO=buildFlowModelListIntegratedPO(modelIntegratedEntityList);

        List<ModelGroupRefEntity> modelGroupRefEntityList=modelGroupRefExtendService.getByModelKeyList(modelIntegratedEntityList.stream().map(item->item.getModelReKey()).collect(Collectors.toList()));
        List<ModelGroupEntity> modelGroupEntityList=new ArrayList<>();
        if(modelGroupRefEntityList.size()>0) {
            modelGroupEntityList = modelGroupExtendService.getByIdList(modelGroupRefEntityList.stream().map(item -> item.getGrefGroupId()).collect(Collectors.toList()));
        }
        //XML.toJSONObject("").toString(2);
        FlowModelListIntegratedPO flowModelListIntegratedPO=new FlowModelListIntegratedPO();
        flowModelListIntegratedPO.setModelIntegratedEntityList(modelIntegratedEntityList);
        flowModelListIntegratedPO.setModelGroupRefEntityList(modelGroupRefEntityList);
        flowModelListIntegratedPO.setModelGroupEntityList(modelGroupEntityList);

        return JBuild4DCResponseVo.getDataSuccess(flowModelListIntegratedPO);
    }

    @Override
    public JBuild4DCResponseVo<FlowModelListIntegratedPO> getMyBootableModelWithModelFilterPO(ModelFilterPO modelFilterPO) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession = JB4DCSessionUtility.getSession();
        List<ModelIntegratedEntity> modelIntegratedEntityList = modelIntegratedExtendService.getMyStartEnableModel(jb4DCSession,modelFilterPO);
        List<ModelGroupRefEntity> modelGroupRefEntityList=modelGroupRefExtendService.getByModelKeyList(modelIntegratedEntityList.stream().map(item->item.getModelReKey()).collect(Collectors.toList()));
        List<ModelGroupEntity>  modelGroupEntityList = modelGroupExtendService.getByIdList(modelFilterPO.getSelectedModelGroup().stream().map(item -> item.getGroupId()).collect(Collectors.toList()));

        FlowModelListIntegratedPO flowModelListIntegratedPO=new FlowModelListIntegratedPO();
        flowModelListIntegratedPO.setModelIntegratedEntityList(modelIntegratedEntityList);
        flowModelListIntegratedPO.setModelGroupRefEntityList(modelGroupRefEntityList);
        flowModelListIntegratedPO.setModelGroupEntityList(modelGroupEntityList);

        return JBuild4DCResponseVo.getDataSuccess(flowModelListIntegratedPO);
    }

    /*private FlowModelListIntegratedPO buildFlowModelListIntegratedPO(List<ModelIntegratedEntity> modelIntegratedEntityList){

    }*/
}
