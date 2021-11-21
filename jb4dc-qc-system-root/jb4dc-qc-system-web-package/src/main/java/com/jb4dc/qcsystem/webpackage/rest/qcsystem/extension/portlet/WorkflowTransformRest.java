package com.jb4dc.qcsystem.webpackage.rest.qcsystem.extension.portlet;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.workflow.client.rest.InstanceRuntimeRest;
import com.jb4dc.workflow.exenum.WorkFlowEnum;
import com.jb4dc.workflow.po.ExecutionTaskPO;
import com.jb4dc.workflow.searchmodel.ExecutionTaskSearchModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Extension/Portlet/WorkflowTransform")
public class WorkflowTransformRest {

    @Autowired
    InstanceRuntimeRest instanceRuntimeRest;

    @RequestMapping(value = "/GetMyProcessTaskListTransform", method = {RequestMethod.GET, RequestMethod.POST})
    public JBuild4DCResponseVo<List<ExecutionTaskPO>> getMyProcessTaskListTransform(String modelCategory,int pageSize) throws JBuild4DCGenerallyException {
        ExecutionTaskSearchModel executionTaskSearchModel=new ExecutionTaskSearchModel();
        executionTaskSearchModel.setModelCategory(modelCategory);
        executionTaskSearchModel.setExtaskType(WorkFlowEnum.ExTask_Type_Main);
        executionTaskSearchModel.setLinkId(JBuild4DCYaml.getLinkId());
        executionTaskSearchModel.setJb4DCSession(JB4DCSessionUtility.getSession());
        executionTaskSearchModel.setPageNum(1);
        executionTaskSearchModel.setPageSize(pageSize);
        executionTaskSearchModel.setLoadDict(false);
        //executionTaskSearchModel.setInstanceTitle("");

        List<ExecutionTaskPO> executionTaskPOList=instanceRuntimeRest.getMyProcessTaskList(executionTaskSearchModel).getData().getList();
        return JBuild4DCResponseVo.getDataSuccess(executionTaskPOList);
    }

    @RequestMapping(value = "/GetMyProcessEndTaskListTransform", method = {RequestMethod.GET, RequestMethod.POST})
    public JBuild4DCResponseVo<List<ExecutionTaskPO>> getMyProcessEndTaskListTransform(String modelCategory,int pageSize) throws JBuild4DCGenerallyException {
        ExecutionTaskSearchModel executionTaskSearchModel=new ExecutionTaskSearchModel();
        executionTaskSearchModel.setModelCategory(modelCategory);
        executionTaskSearchModel.setExtaskType(WorkFlowEnum.ExTask_Type_Main);
        executionTaskSearchModel.setLinkId(JBuild4DCYaml.getLinkId());
        executionTaskSearchModel.setJb4DCSession(JB4DCSessionUtility.getSession());
        executionTaskSearchModel.setPageNum(1);
        executionTaskSearchModel.setPageSize(pageSize);
        executionTaskSearchModel.setLoadDict(false);
        //executionTaskSearchModel.setInstanceTitle("");

        List<ExecutionTaskPO> executionTaskPOList=instanceRuntimeRest.getMyProcessEndTaskList(executionTaskSearchModel).getData().getList();
        return JBuild4DCResponseVo.getDataSuccess(executionTaskPOList);
    }
}
