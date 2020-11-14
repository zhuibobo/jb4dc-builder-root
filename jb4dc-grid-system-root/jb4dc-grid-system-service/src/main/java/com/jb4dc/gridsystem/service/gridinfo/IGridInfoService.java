package com.jb4dc.gridsystem.service.gridinfo;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntityWithBLOBs;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/14
 * To change this template use File | Settings | File Templates.
 */
public interface IGridInfoService extends IBaseService<GridInfoEntityWithBLOBs> {
    void saveGridMapPath(JB4DCSession jb4DCSession, String organId, String gridMapPath,String parentId) throws JBuild4DCGenerallyException;

    List<GridInfoEntityWithBLOBs> getByParentId(JB4DCSession session, String parentId,String excludeId);

    void saveGridInfo(JB4DCSession session, String organId, String gridCode, String gridContent, String gridRemark, String gridParentId) throws JBuild4DCGenerallyException;
}