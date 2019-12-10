package com.jb4dc.builder.service.weblist.impl;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.weblist.ListResourceMapper;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.builder.service.weblist.IListResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

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
    public int saveSimple(JB4DCSession jb4DCSession, String id, ListResourceEntity record) throws JBuild4DCGenerallyException {
        //修改时设置为未解析的状态.
        //record.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
        //保存时进行同步的表单内容的解析,并存入对应的字段中.
        String resolvedHtml=htmlRuntimeResolve.resolveSourceHTML(jb4DCSession,id,record.getListHtmlSource());
        record.setListHtmlResolve(resolvedHtml);
        record.setListIsResolve(TrueFalseEnum.True.getDisplayName());

        return super.save(jb4DCSession,id, record, new IAddBefore<ListResourceEntity>() {
            @Override
            public ListResourceEntity run(JB4DCSession jb4DCSession,ListResourceEntity sourceEntity) throws JBuild4DCGenerallyException {

                sourceEntity.setListCreateTime(new Date());
                sourceEntity.setListCreator(jb4DCSession.getUserName());
                sourceEntity.setListUpdateTime(new Date());
                sourceEntity.setListUpdater(jb4DCSession.getUserName());
                sourceEntity.setListOrderNum(listResourceMapper.nextOrderNum());
                sourceEntity.setListStatus(EnableTypeEnum.enable.getDisplayName());
                sourceEntity.setListOrganId(jb4DCSession.getOrganId());
                sourceEntity.setListOrganName(jb4DCSession.getOrganName());
                sourceEntity.setListCode(moduleService.buildModuleItemCode(sourceEntity.getListOrderNum()));
                return sourceEntity;
            }
        });
    }

    /*@Override
    public ListResourcePO getFormPreviewHTMLContent(JB4DCSession session, String listId) throws JBuild4DCGenerallyException {
        return getListRuntimeHTMLContent(session,listId);
    }*/

    @Override
    public ListResourcePO getListRuntimeHTMLContent(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"1111111111111111111111111111111111111");
        ListResourceEntity listResourceEntity=getByPrimaryKey(jb4DCSession,id);
        String runtimeForm=htmlRuntimeResolve.dynamicBind(jb4DCSession,id,listResourceEntity.getListHtmlResolve(),null);
        return new ListResourcePO(listResourceEntity,runtimeForm,listResourceEntity.getListJsContent());
    }

    @Override
    public List<ListResourceEntity> getByModuleId(JB4DCSession jb4DCSession, String moduleId) {
        return listResourceMapper.selectByModuleId(moduleId);
    }
}
