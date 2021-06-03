package com.jb4dc.workflow.client.action.api;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

public interface IActionApi {
    ActionApiRunResult runApi(ActionApiPara actionApiPara) throws JBuild4DCGenerallyException;
}
