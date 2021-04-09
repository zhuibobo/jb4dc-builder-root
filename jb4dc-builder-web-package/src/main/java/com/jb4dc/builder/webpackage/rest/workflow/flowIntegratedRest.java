package com.jb4dc.builder.webpackage.rest.workflow;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.dbentities.flow.FlowIntegratedEntity;
import com.jb4dc.builder.po.FlowIntegratedPO;
import com.jb4dc.workflow.integrate.IWFModelIntegratedService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/6
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/FlowIntegrated")
public class flowIntegratedRest extends GeneralRest<FlowIntegratedEntity> {

    @Autowired
    IWFModelIntegratedService workFlowIntegratedService;

    @Override
    protected IBaseService<FlowIntegratedEntity> getBaseService() {
        return workFlowIntegratedService;
    }

    @Override
    public String getModuleName() {
        return "模块设计-流程设计";
    }

    @RequestMapping(
            value = {"/GetFlowModel"},
            method = {RequestMethod.POST}
    )
    public JBuild4DCResponseVo getDetailData(String recordId, String op) throws IllegalAccessException, InstantiationException, JsonProcessingException, JBuild4DCGenerallyException {
        JBuild4DCResponseVo responseVo = new JBuild4DCResponseVo();
        if (StringUtility.isEmpty(recordId)) {
            recordId = UUIDUtility.getUUID();
            FlowIntegratedPO flowIntegratedPO=new FlowIntegratedPO();
            responseVo.addExKVData("recordId", recordId);
            flowIntegratedPO.setIntegratedId(recordId);
            responseVo.setData(flowIntegratedPO);
        } else {
            JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();
            FlowIntegratedPO flowIntegratedPO = workFlowIntegratedService.getPOByIntegratedId(jb4DSession, recordId);
            responseVo.addExKVData("recordId", recordId);
            responseVo.setData(flowIntegratedPO);
        }

        return responseVo;
    }

    //@Override
    @RequestMapping(value = "/SaveFlowModel", method = RequestMethod.POST)
    public JBuild4DCResponseVo saveFlowModel(@RequestBody FlowIntegratedPO flowIntegratedPO, HttpServletRequest request) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DSession = JB4DCSessionUtility.getSession();

            String recordID = flowIntegratedPO.getIntegratedId();
            if (recordID.equals("") || recordID == null) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE, "recordID不能为空或字符串!");
            }

            if (getBaseService().getByPrimaryKey(jb4DSession, recordID) == null) {
                this.writeOperationLog("新增数据", "用户[" + jb4DSession.getUserName() + "]新增了ID为" + recordID + "的数据[" + getMyClass().getSimpleName() + "]", JsonUtility.toObjectString(flowIntegratedPO), request);
            } else {
                this.writeOperationLog("修改数据", "用户[" + jb4DSession.getUserName() + "]修改了ID为" + recordID + "的数据[" + getMyClass().getSimpleName() + "]", JsonUtility.toObjectString(flowIntegratedPO), request);
            }
            flowIntegratedPO=workFlowIntegratedService.saveFlowModel(jb4DSession, recordID, flowIntegratedPO);
            return JBuild4DCResponseVo.saveSuccess(flowIntegratedPO);

        } catch (JBuild4DCGenerallyException e) {
            return JBuild4DCResponseVo.error(e.getMessage());
        }
        catch (Exception e){
            return JBuild4DCResponseVo.error(e.getMessage());
        }
    }
}
