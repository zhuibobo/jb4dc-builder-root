package com.jb4dc.builder.client.service.webform;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntityWithBLOBs;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
public interface IFormResourceService extends IBaseService<FormResourceEntityWithBLOBs> {
    FormResourcePO getFormPreviewHTMLContent(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException;

    FormResourcePO getFormRuntimePageContent(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException;

    List<FormResourceEntity> getByModuleId(JB4DCSession jb4DCSession, String moduleId);

    void tryLoadAboutTable(JB4DCSession jb4DCSession,List<FormResourcePO> formResourceEntityList,boolean includeField) throws IOException, JBuild4DCGenerallyException;

    void copyForm(JB4DCSession jb4DCSession, String formId) throws JBuild4DCGenerallyException;
}
