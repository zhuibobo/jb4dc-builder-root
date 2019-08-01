package com.jb4dc.builder.extend;

import com.jb4dc.builder.po.DataSetVo;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/7
 * To change this template use File | Settings | File Templates.
 */
public interface IDataSetAPI {
    public DataSetVo getDataSetStructure(JB4DCSession session, String dsId, String op, String groupId, String paras);
}
