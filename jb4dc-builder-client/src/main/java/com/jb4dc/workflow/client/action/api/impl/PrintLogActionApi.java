package com.jb4dc.workflow.client.action.api.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.workflow.client.action.api.ActionApiPara;
import com.jb4dc.workflow.client.action.api.ActionApiRunResult;
import com.jb4dc.workflow.client.action.api.IActionApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PrintLogActionApi implements IActionApi {

    private Logger logger= LoggerFactory.getLogger(PrintLogActionApi.class);

    @Override
    public ActionApiRunResult runApi(ActionApiPara actionApiPara) throws JBuild4DCGenerallyException {
        try {
            logger.info(JsonUtility.toObjectString(actionApiPara));
        } catch (JsonProcessingException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,e);
        }
        return ActionApiRunResult.getSuccessResult();
    }
}
