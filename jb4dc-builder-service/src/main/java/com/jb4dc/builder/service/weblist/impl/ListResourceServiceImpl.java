package com.jb4dc.builder.service.weblist.impl;

import com.jb4dc.base.dbaccess.exenum.EnableTypeEnum;
import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.weblist.ListResourceMapper;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.builder.service.weblist.IListResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/18
 * To change this template use File | Settings | File Templates.
 */

@Service
public class ListResourceServiceImpl extends BaseServiceImpl<ListResourceEntity> implements IListResourceService
{
    IModuleService moduleService;
    ListResourceMapper listResourceMapper;

    @Autowired
    IHTMLRuntimeResolve htmlRuntimeResolve;

    public ListResourceServiceImpl(ListResourceMapper _defaultBaseMapper, IModuleService _moduleService){
        super(_defaultBaseMapper);
        listResourceMapper=_defaultBaseMapper;
        moduleService=_moduleService;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, ListResourceEntity record) throws JBuild4DCGenerallyException {
        //修改时设置为未解析的状态.
        //record.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
        //保存时进行同步的表单内容的解析,并存入对应的字段中.
        String resolvedHtml=htmlRuntimeResolve.resolveSourceHTML(jb4DSession,id,record.getListHtmlSource());
        record.setListHtmlResolve(resolvedHtml);
        record.setListIsResolve(TrueFalseEnum.True.getDisplayName());

        return super.save(jb4DSession,id, record, new IAddBefore<ListResourceEntity>() {
            @Override
            public ListResourceEntity run(JB4DCSession jb4DSession,ListResourceEntity sourceEntity) throws JBuild4DCGenerallyException {

                sourceEntity.setListCreateTime(new Date());
                sourceEntity.setListCreator(jb4DSession.getUserName());
                sourceEntity.setListUpdateTime(new Date());
                sourceEntity.setListUpdater(jb4DSession.getUserName());
                sourceEntity.setListOrderNum(listResourceMapper.nextOrderNum());
                sourceEntity.setListStatus(EnableTypeEnum.enable.getDisplayName());
                sourceEntity.setListOrganId(jb4DSession.getOrganId());
                sourceEntity.setListOrganName(jb4DSession.getOrganName());
                sourceEntity.setListCode(moduleService.buildModuleItemCode(sourceEntity.getListOrderNum()));
                return sourceEntity;
            }
        });
    }

    @Override
    public String getFormPreviewHTMLContent(JB4DCSession session, String listId) throws JBuild4DCGenerallyException {
        return getListRuntimeHTMLContent(session,listId);
    }

    @Override
    public String getListRuntimeHTMLContent(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        ListResourceEntity listResourceEntity=getByPrimaryKey(jb4DSession,id);
        String runtimeForm=htmlRuntimeResolve.dynamicBind(jb4DSession,id,listResourceEntity.getListHtmlResolve());
        return runtimeForm;
    }
}
