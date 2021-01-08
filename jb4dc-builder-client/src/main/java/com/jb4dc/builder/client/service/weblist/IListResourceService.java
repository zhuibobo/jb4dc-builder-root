package com.jb4dc.builder.client.service.weblist;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.client.service.dataset.IDatasetService;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntityWithBLOBs;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/18
 * To change this template use File | Settings | File Templates.
 */
public interface IListResourceService extends IBaseService<ListResourceEntityWithBLOBs> {
    //ListResourcePO getFormPreviewHTMLContent(JB4DCSession session, String listId) throws JBuild4DCGenerallyException;

    ListResourcePO getListRuntimeHTMLContent(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException;

    List<ListResourceEntity> getByModuleId(JB4DCSession jb4DCSession, String moduleId);

    List<ListResourcePO> getListDataForModule(JB4DCSession jb4DSession, String listModuleId, IDatasetService datasetService) throws JBuild4DCGenerallyException, IOException;
}
