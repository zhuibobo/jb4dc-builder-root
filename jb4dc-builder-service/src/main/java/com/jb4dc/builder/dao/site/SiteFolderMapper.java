package com.jb4dc.builder.dao.site;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.dbentities.site.SiteFolderEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/6/5
 * To change this template use File | Settings | File Templates.
 */
public interface SiteFolderMapper extends BaseMapper<SiteFolderEntity> {
    List<SiteFolderEntity> selectFolderBySiteId(String siteId);
}
