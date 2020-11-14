package com.jb4dc.gridsystem.dbentities.gridinfo;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_grid_info
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class GridInfoEntityWithBLOBs extends GridInfoEntity {
    //GRID_CONTENT:网格介绍
    private String gridContent;

    //GRID_MAP_PATH:地图上网格的路径
    private String gridMapPath;

    public GridInfoEntityWithBLOBs(String gridId, String gridCode, String gridOrganId, String gridRemark, String gridParentId, String gridContent, String gridMapPath) {
        super(gridId, gridCode, gridOrganId, gridRemark, gridParentId);
        this.gridContent = gridContent;
        this.gridMapPath = gridMapPath;
    }

    public GridInfoEntityWithBLOBs() {
        super();
    }

    public String getGridContent() {
        return gridContent;
    }

    public void setGridContent(String gridContent) {
        this.gridContent = gridContent == null ? null : gridContent.trim();
    }

    public String getGridMapPath() {
        return gridMapPath;
    }

    public void setGridMapPath(String gridMapPath) {
        this.gridMapPath = gridMapPath == null ? null : gridMapPath.trim();
    }
}