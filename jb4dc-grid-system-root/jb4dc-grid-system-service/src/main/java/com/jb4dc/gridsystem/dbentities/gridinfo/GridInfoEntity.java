package com.jb4dc.gridsystem.dbentities.gridinfo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_grid_info
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class GridInfoEntity {
    //GRID_ID:
    @DBKeyField
    private String gridId;

    //GRID_CODE:网格编号:作为房屋编号的前缀编号
    private String gridCode;

    //GRID_ORGAN_ID:关联组织机构ID
    private String gridOrganId;

    //GRID_REMARK:备注
    private String gridRemark;

    //GRID_PARENT_ID:父节点ID
    private String gridParentId;

    /**
     * 构造函数
     * @param gridId
     * @param gridCode 网格编号
     * @param gridOrganId 关联组织机构ID
     * @param gridRemark 备注
     * @param gridParentId 父节点ID
     **/
    public GridInfoEntity(String gridId, String gridCode, String gridOrganId, String gridRemark, String gridParentId) {
        this.gridId = gridId;
        this.gridCode = gridCode;
        this.gridOrganId = gridOrganId;
        this.gridRemark = gridRemark;
        this.gridParentId = gridParentId;
    }

    public GridInfoEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getGridId() {
        return gridId;
    }

    /**
     *
     * @param gridId
     **/
    public void setGridId(String gridId) {
        this.gridId = gridId == null ? null : gridId.trim();
    }

    /**
     * 网格编号:作为房屋编号的前缀编号
     * @return java.lang.String
     **/
    public String getGridCode() {
        return gridCode;
    }

    /**
     * 网格编号:作为房屋编号的前缀编号
     * @param gridCode 网格编号
     **/
    public void setGridCode(String gridCode) {
        this.gridCode = gridCode == null ? null : gridCode.trim();
    }

    /**
     * 关联组织机构ID
     * @return java.lang.String
     **/
    public String getGridOrganId() {
        return gridOrganId;
    }

    /**
     * 关联组织机构ID
     * @param gridOrganId 关联组织机构ID
     **/
    public void setGridOrganId(String gridOrganId) {
        this.gridOrganId = gridOrganId == null ? null : gridOrganId.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getGridRemark() {
        return gridRemark;
    }

    /**
     * 备注
     * @param gridRemark 备注
     **/
    public void setGridRemark(String gridRemark) {
        this.gridRemark = gridRemark == null ? null : gridRemark.trim();
    }

    /**
     * 父节点ID
     * @return java.lang.String
     **/
    public String getGridParentId() {
        return gridParentId;
    }

    /**
     * 父节点ID
     * @param gridParentId 父节点ID
     **/
    public void setGridParentId(String gridParentId) {
        this.gridParentId = gridParentId == null ? null : gridParentId.trim();
    }
}