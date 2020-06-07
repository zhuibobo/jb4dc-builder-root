package com.jb4dc.builder.service.site.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dao.site.SiteInfoMapper;
import com.jb4dc.builder.dbentities.site.SiteInfoEntity;
import com.jb4dc.builder.service.site.ISiteFolderService;
import com.jb4dc.builder.service.site.ISiteInfoService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.DateUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/6/5
 * To change this template use File | Settings | File Templates.
 */
@Service
public class SiteInfoServiceImpl extends BaseServiceImpl<SiteInfoEntity> implements ISiteInfoService
{
    @Autowired
    ISiteFolderService siteFolderService;

    SiteInfoMapper siteInfoMapper;
    public SiteInfoServiceImpl(SiteInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        siteInfoMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, SiteInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<SiteInfoEntity>() {
            @Override
            public SiteInfoEntity run(JB4DCSession jb4DCSession,SiteInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                //自动创建该连接的表分组根节点
                siteFolderService.deleteByKeyNotValidate(jb4DCSession,id, JBuild4DCYaml.getWarningOperationCode());
                siteFolderService.createRootNode(jb4DCSession,id,record.getSiteName());

                sourceEntity.setSiteCreateTime(new Date());
                sourceEntity.setSiteOrderNum(siteInfoMapper.nextOrderNum());
                sourceEntity.setSiteStatus(EnableTypeEnum.enable.getDisplayName());

                return sourceEntity;
            }
        });
    }

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        SiteInfoEntity siteInfoEntity=new SiteInfoEntity();
        siteInfoEntity.setSiteId("JB4DCDefaultSite");
        siteInfoEntity.setSiteName("默认站点");
        siteInfoEntity.setSiteSingleName("DefaultSite");
        siteInfoEntity.setSitePublicRootPath("D:/JavaProject/jb4dc/jb4dc-site-root/Site_TL");
        siteInfoEntity.setSiteDomain("www.jb4dcsite.com");
        siteInfoEntity.setSiteContextPath("JB4DCSite");
        siteInfoEntity.setSiteCreateTime(new Date());
        siteInfoEntity.setSiteCreator(jb4DCSession.getUserName());
        siteInfoEntity.setSiteUpdateTime(new Date());
        siteInfoEntity.setSiteUpdater(jb4DCSession.getUserName());
        siteInfoEntity.setSiteDesc("");
        siteInfoEntity.setSiteStatus(EnableTypeEnum.enable.getDisplayName());
        siteInfoEntity.setSiteOrderNum(1);

        this.deleteByKeyNotValidate(jb4DCSession,siteInfoEntity.getSiteId(), JBuild4DCYaml.getWarningOperationCode());
        this.saveSimple(jb4DCSession,siteInfoEntity.getSiteId(),siteInfoEntity);
    }
}

