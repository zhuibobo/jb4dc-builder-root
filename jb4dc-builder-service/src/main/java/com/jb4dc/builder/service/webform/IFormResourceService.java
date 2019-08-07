package com.jb4dc.builder.service.webform;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.RecordDataVo;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
public interface IFormResourceService extends IBaseService<FormResourceEntity> {
    FormResourcePO getFormPreviewHTMLContent(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException;

    FormResourcePO getFormRuntimePageContent(JB4DCSession jb4DCSession, String id, RecordDataVo recordDataVo) throws JBuild4DCGenerallyException;
}
