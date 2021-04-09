package com.jb4dc.builder.client.service.api;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/16
 * To change this template use File | Settings | File Templates.
 */
public interface IApiItemService extends IBaseService<ApiItemEntity> {
    void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;

    ApiItemEntity getByValue(JB4DCSession session, String apiValue);

    List<ApiItemEntity> getByGroupTypeALL(String groupType, JB4DCSession jb4DCSession);
}
