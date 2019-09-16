package com.jb4dc.builder.service.api;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/16
 * To change this template use File | Settings | File Templates.
 */
public interface IApiGroupService  extends IBaseService<ApiGroupEntity> {
    void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException;
}
