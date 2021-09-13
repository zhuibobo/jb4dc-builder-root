package com.jb4dc.builder.webpackage.rest.workflow;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.search.GeneralSearchUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.workflow.dbentities.ModelIntegratedEntity;
import com.jb4dc.workflow.integrate.extend.IModelIntegratedExtendService;
import com.jb4dc.workflow.po.FlowModelIntegratedPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Workflow/FlowModelIntegrated")
public class FlowModelIntegratedRest extends GeneralRest<ModelIntegratedEntity> {

    @Autowired
    IModelIntegratedExtendService flowExtendModelService;

    @Override
    protected IBaseService<ModelIntegratedEntity> getBaseService() {
        return flowExtendModelService;
    }

    @Override
    public String getModuleName() {
        return "模块设计-流程设计";
    }

    @RequestMapping(
            value = {"/GetFlowModel"},
            method = {RequestMethod.POST}
    )
    public JBuild4DCResponseVo<FlowModelIntegratedPO> getFlowModel(String modelReKey, String op, String templateName) throws IllegalAccessException, InstantiationException, JsonProcessingException, IOException, JBuild4DCGenerallyException, URISyntaxException {
        JBuild4DCResponseVo responseVo = new JBuild4DCResponseVo();
        if (StringUtility.isEmpty(modelReKey)) {
            String recordId = UUIDUtility.getUUID();
            FlowModelIntegratedPO flowModelIntegratedPO =new FlowModelIntegratedPO();
            responseVo.addExKVData("recordId", recordId);
            flowModelIntegratedPO.setModelId(recordId);
            flowModelIntegratedPO.setModelerTemplateContent(flowExtendModelService.getBpmnTemplateModelByName(templateName));
            responseVo.setData(flowModelIntegratedPO);
        } else {
            JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();
            FlowModelIntegratedPO flowModelIntegratedPO = flowExtendModelService.getLastSavePOByModelReKey(jb4DSession, modelReKey);
            responseVo.addExKVData("recordId", flowModelIntegratedPO.getModelId());
            responseVo.setData(flowModelIntegratedPO);
        }

        return responseVo;
    }

    @RequestMapping(
            value = {"/GetModuleFlowListData"},
            method = {RequestMethod.POST, RequestMethod.GET}
    )
    public JBuild4DCResponseVo getModuleFlowListData(Integer pageSize, Integer pageNum, String searchCondition, boolean loadDict) throws IOException, ParseException, JBuild4DCGenerallyException {
        JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();
        Map<String, Object> searchMap = GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<ModelIntegratedEntity> proPageInfo = flowExtendModelService.getPageByModule(jb4DSession, pageNum, pageSize, searchMap);
        JBuild4DCResponseVo responseVo = new JBuild4DCResponseVo();
        responseVo.setData(proPageInfo);
        responseVo.setMessage("获取成功");
        responseVo.setSuccess(true);
        return responseVo;
    }

    //@Override
    @RequestMapping(value = "/SaveFlowModel", method = RequestMethod.POST)
    public JBuild4DCResponseVo saveFlowModel(@RequestBody FlowModelIntegratedPO flowModelIntegratedPO, HttpServletRequest request) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();

            //String recordID = flowIntegratedPO.getModelId();
            //if (recordID.equals("") || recordID == null) {
            //    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE, "recordID不能为空或字符串!");
            //}

            //if (getBaseService().getByPrimaryKey(jb4DSession, recordID) == null) {
            //    this.writeOperationLog("新增数据", "用户[" + jb4DSession.getUserName() + "]新增了ID为" + recordID + "的数据[" + getMyClass().getSimpleName() + "]", JsonUtility.toObjectString(flowIntegratedPO), request);
            //} else {
            //    this.writeOperationLog("修改数据", "用户[" + jb4DSession.getUserName() + "]修改了ID为" + recordID + "的数据[" + getMyClass().getSimpleName() + "]", JsonUtility.toObjectString(flowIntegratedPO), request);
            //}
            flowModelIntegratedPO =flowExtendModelService.saveFlowModel(jb4DSession, flowModelIntegratedPO);
            return JBuild4DCResponseVo.saveSuccess(flowModelIntegratedPO);

        } catch (JBuild4DCGenerallyException e) {
            e.printStackTrace();
            return JBuild4DCResponseVo.error(e.getMessage());
        }
    }
}
