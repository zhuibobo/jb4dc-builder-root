package com.jb4dc.gridsystem.service.gridinfo.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.gridinfo.GridInfoMapper;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntityWithBLOBs;
import com.jb4dc.gridsystem.service.gridinfo.IGridInfoService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/14
 * To change this template use File | Settings | File Templates.
 */
@Service
public class GridInfoServiceImpl extends BaseServiceImpl<GridInfoEntityWithBLOBs> implements IGridInfoService
{
    GridInfoMapper gridInfoMapper;
    public GridInfoServiceImpl(GridInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        gridInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, GridInfoEntityWithBLOBs record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<GridInfoEntityWithBLOBs>() {
            @Override
            public GridInfoEntityWithBLOBs run(JB4DCSession jb4DCSession,GridInfoEntityWithBLOBs sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void saveGridMapPath(JB4DCSession jb4DCSession,String organId, String gridMapPath,String parentId) throws JBuild4DCGenerallyException {
        GridInfoEntityWithBLOBs gridInfoEntityWithBLOBs=new GridInfoEntityWithBLOBs();
        gridInfoEntityWithBLOBs.setGridMapPath(gridMapPath);
        gridInfoEntityWithBLOBs.setGridId(organId);
        gridInfoEntityWithBLOBs.setGridOrganId(organId);
        gridInfoEntityWithBLOBs.setGridParentId(parentId);
        this.saveSimple(jb4DCSession,organId,gridInfoEntityWithBLOBs);
    }

    @Override
    public List<GridInfoEntityWithBLOBs> getSameLevelGrid(JB4DCSession session, String parentId,String excludeId) {
        return gridInfoMapper.selectByParentId(parentId,excludeId);
    }

    @Override
    public void saveGridInfo(JB4DCSession jb4DCSession, String organId, String gridCode, String gridContent, String gridRemark, String gridParentId) throws JBuild4DCGenerallyException {
        GridInfoEntityWithBLOBs gridInfoEntityWithBLOBs=new GridInfoEntityWithBLOBs();
        gridInfoEntityWithBLOBs.setGridId(organId);
        gridInfoEntityWithBLOBs.setGridCode(gridCode);
        gridInfoEntityWithBLOBs.setGridContent(gridContent);
        gridInfoEntityWithBLOBs.setGridRemark(gridRemark);
        gridInfoEntityWithBLOBs.setGridParentId(gridParentId);
        gridInfoEntityWithBLOBs.setGridOrganId(organId);
        this.saveSimple(jb4DCSession,organId,gridInfoEntityWithBLOBs);
    }
}
