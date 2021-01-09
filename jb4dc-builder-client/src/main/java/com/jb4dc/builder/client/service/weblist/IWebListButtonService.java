package com.jb4dc.builder.client.service.weblist;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/19
 * To change this template use File | Settings | File Templates.
 */
public interface IWebListButtonService extends IBaseService<ListButtonEntity> {
    ListButtonEntity getByCustSingleName(JB4DCSession jb4DCSession, String custSingleName);

    List<ListButtonEntity> getByListId(JB4DCSession session, String listId);
}