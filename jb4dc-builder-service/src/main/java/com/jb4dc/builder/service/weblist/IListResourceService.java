package com.jb4dc.builder.service.weblist;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/18
 * To change this template use File | Settings | File Templates.
 */
public interface IListResourceService extends IBaseService<ListResourceEntity> {
    String getFormPreviewHTMLContent(JB4DCSession session, String listId) throws JBuild4DCGenerallyException;

    String getListRuntimeHTMLContent(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException;
}
