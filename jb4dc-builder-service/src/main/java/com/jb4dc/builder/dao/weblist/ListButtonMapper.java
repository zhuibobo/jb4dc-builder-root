package com.jb4dc.builder.dao.weblist;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/19
 * To change this template use File | Settings | File Templates.
 */
public interface ListButtonMapper  extends BaseMapper<ListButtonEntity> {
    ListButtonEntity selectByCustSingleName(String custSingleName);
}
