package com.jb4dc.qcsystem.service.issues;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.qcsystem.dbentities.issues.IssuesEntity;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/10/17
 * To change this template use File | Settings | File Templates.
 */
public interface IIssuesService  extends IBaseService<IssuesEntity> {
    String getNextNumByProjectId(String issProjectId);

    void updateNum(String nextNum, String recordId);
}
