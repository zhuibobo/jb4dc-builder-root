package com.jb4dc.qcsystem.api;

import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.builder.client.service.api.IApiItemService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.qcsystem.dbentities.issues.IssuesEntity;
import com.jb4dc.qcsystem.service.issues.IIssuesService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/10/17
 * To change this template use File | Settings | File Templates.
 */
public class NewIssuesProcessApi implements IApiForButton {
    @Autowired
    IIssuesService iIssuesService;

    @Override
    public ApiRunResult runApi(ApiRunPara apiRunPara) throws JBuild4DCGenerallyException {
        if(true){
            //apiRunPara.get
            String recordId=apiRunPara.getRecordId();
            IssuesEntity issuesEntity=iIssuesService.getByPrimaryKey(apiRunPara.getJb4DCSession(),recordId);
            String nextCode=iIssuesService.getNextNumByProjectId(issuesEntity.getIssProjectId());
            iIssuesService.updateNum(nextCode,recordId);
            //System.out.println("1");
        }
        return ApiRunResult.successResult();
    }
}
