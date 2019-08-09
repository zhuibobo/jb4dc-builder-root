package com.jb4dc.builder.service.webform.impl;

import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.webform.FormResourceMapper;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.RecordDataPO;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.builder.service.webform.IFormResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
@Service
public class FormResourceServiceImpl extends BaseServiceImpl<FormResourceEntity> implements IFormResourceService {
    FormResourceMapper formResourceMapper;
    IModuleService moduleService;

    @Autowired
    IHTMLRuntimeResolve htmlRuntimeResolve;

    public FormResourceServiceImpl(FormResourceMapper _defaultBaseMapper, IModuleService _moduleService) {
        super(_defaultBaseMapper);
        formResourceMapper = _defaultBaseMapper;
        moduleService = _moduleService;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, FormResourceEntity record) throws JBuild4DCGenerallyException {

        //修改时设置为未解析的状态.
        //record.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
        //保存时进行同步的表单内容的解析,并存入对应的字段中.
        String resolvedHtml=htmlRuntimeResolve.resolveSourceHTML(jb4DCSession,id,record.getFormHtmlSource());
        record.setFormHtmlResolve(resolvedHtml);
        record.setFormIsResolve(TrueFalseEnum.True.getDisplayName());

        return super.save(jb4DCSession, id, record, new IAddBefore<FormResourceEntity>() {
            @Override
            public FormResourceEntity run(JB4DCSession jb4DCSession, FormResourceEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setFormOrderNum(formResourceMapper.nextOrderNum());
                sourceEntity.setFormCreator(jb4DCSession.getUserName());
                sourceEntity.setFormCreateTime(new Date());
                sourceEntity.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
                sourceEntity.setFormIsSystem(TrueFalseEnum.False.getDisplayName());
                sourceEntity.setFormIsTemplate(TrueFalseEnum.False.getDisplayName());
                sourceEntity.setFormOrganId(jb4DCSession.getOrganId());
                sourceEntity.setFormOrganName(jb4DCSession.getOrganName());
                sourceEntity.setFormUpdater(jb4DCSession.getUserName());
                sourceEntity.setFormUpdateTime(new Date());
                sourceEntity.setFormCode(moduleService.buildModuleItemCode(sourceEntity.getFormOrderNum()));
                return sourceEntity;
            }
        });
    }

    @Override
    public void moveUp(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        FormResourceEntity selfEntity = formResourceMapper.selectByPrimaryKey(id);
        FormResourceEntity ltEntity = formResourceMapper.selectGreaterThanRecord(id, selfEntity.getFormModuleId());
        switchOrder(ltEntity, selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        FormResourceEntity selfEntity = formResourceMapper.selectByPrimaryKey(id);
        FormResourceEntity ltEntity = formResourceMapper.selectLessThanRecord(id, selfEntity.getFormModuleId());
        switchOrder(ltEntity, selfEntity);
    }

    private void switchOrder(FormResourceEntity toEntity, FormResourceEntity selfEntity) {
        if (toEntity != null) {
            int newNum = toEntity.getFormOrderNum();
            toEntity.setFormOrderNum(selfEntity.getFormOrderNum());
            selfEntity.setFormOrderNum(newNum);
            formResourceMapper.updateByPrimaryKeySelective(toEntity);
            formResourceMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }

    @Override
    public FormResourcePO getFormPreviewHTMLContent(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        return getFormRuntimePageContent(jb4DCSession,id,null);
    }

    @Override
    public FormResourcePO getFormRuntimePageContent(JB4DCSession jb4DCSession, String id, RecordDataPO recordDataVo) throws JBuild4DCGenerallyException {
        FormResourceEntity formResourceEntity=getByPrimaryKey(jb4DCSession,id);
        String formHtmlRuntime=htmlRuntimeResolve.dynamicBind(jb4DCSession,id,formResourceEntity.getFormHtmlResolve());
        return new FormResourcePO(formResourceEntity,formHtmlRuntime);
    }
}
