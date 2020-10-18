package com.jb4dc.qcsystem.service.issues.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.qcsystem.dao.issues.IssuesMapper;
import com.jb4dc.qcsystem.dbentities.issues.IssuesEntity;
import com.jb4dc.qcsystem.service.issues.IIssuesService;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/10/17
 * To change this template use File | Settings | File Templates.
 */
@Service
public class IssuesServiceImpl extends BaseServiceImpl<IssuesEntity> implements IIssuesService
{
    IssuesMapper issuesMapper;
    public IssuesServiceImpl(IssuesMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        issuesMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, IssuesEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<IssuesEntity>() {
            @Override
            public IssuesEntity run(JB4DCSession jb4DCSession,IssuesEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public String getNextNumByProjectId(String issProjectId) {
        String nextCode="00001";
        if(StringUtility.isNotEmpty(issProjectId)) {
            String maxNum=issuesMapper.selectMaxNumByProjectId(issProjectId);
            if (maxNum.equals("0")) {
                //nextCode = "10001";
            } else {
                nextCode = String.valueOf(Integer.parseInt(maxNum) + 1);
                nextCode=StringUtility.fillZero(nextCode,5);
            }
        }
        return nextCode;
    }

    @Override
    public void updateNum(String nextCode, String id) {
        issuesMapper.updateNumByPrimaryKey(nextCode,id);
    }

    //public String getIssuesCodeByProjectId
}