package com.jb4dc.builder.service.weblist.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.weblist.ListButtonMapper;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.service.weblist.IListButtonService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/19
 * To change this template use File | Settings | File Templates.
 */
public class ListButtonServiceImpl extends BaseServiceImpl<ListButtonEntity> implements IListButtonService
{
    ListButtonMapper listButtonMapper;

    @Autowired
    public ListButtonServiceImpl(ListButtonMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        listButtonMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ListButtonEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<ListButtonEntity>() {
            @Override
            public ListButtonEntity run(JB4DCSession jb4DCSession,ListButtonEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}