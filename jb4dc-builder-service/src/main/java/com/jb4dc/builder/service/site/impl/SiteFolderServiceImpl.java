package com.jb4dc.builder.service.site.impl;
import java.util.Date;
import java.util.List;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.site.SiteFolderMapper;
import com.jb4dc.builder.dbentities.site.SiteFolderEntity;
import com.jb4dc.builder.service.site.ISiteFolderService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/6/5
 * To change this template use File | Settings | File Templates.
 */
@Service
public class SiteFolderServiceImpl extends BaseServiceImpl<SiteFolderEntity> implements ISiteFolderService
{
    private String rootParentId="-1";

    SiteFolderMapper siteFolderMapper;
    public SiteFolderServiceImpl(SiteFolderMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        siteFolderMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, SiteFolderEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<SiteFolderEntity>() {
            @Override
            public SiteFolderEntity run(JB4DCSession jb4DCSession,SiteFolderEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()

                if(!sourceEntity.getFolderParentId().equals(rootParentId))
                {
                    SiteFolderEntity parentEntity=siteFolderMapper.selectByPrimaryKey(sourceEntity.getFolderParentId());
                    record.setFolderSiteId(parentEntity.getFolderSiteId());
                }

                sourceEntity.setFolderCreateTime(new Date());
                sourceEntity.setFolderCreator(jb4DCSession.getUserName());
                sourceEntity.setFolderUpdateTime(new Date());
                sourceEntity.setFolderUpdater(jb4DCSession.getUserName());
                sourceEntity.setFolderOrderNum(siteFolderMapper.nextOrderNum());
                return sourceEntity;
            }
        });
    }

    @Override
    public SiteFolderEntity createRootNode(JB4DCSession jb4DCSession, String id, String siteName) throws JBuild4DCGenerallyException {
        SiteFolderEntity siteFolderEntity=new SiteFolderEntity();
        siteFolderEntity.setFolderId(id);
        siteFolderEntity.setFolderSiteId(id);
        siteFolderEntity.setFolderName(siteName);
        siteFolderEntity.setFolderParentId("-1");
        siteFolderEntity.setFolderDesc("");
        siteFolderEntity.setFolderStatus(EnableTypeEnum.enable.getDisplayName());
        siteFolderEntity.setFolderType("RootFolder");

        this.saveSimple(jb4DCSession,siteFolderEntity.getFolderId(),siteFolderEntity);
        return siteFolderEntity;
    }

    @Override
    public List<SiteFolderEntity> getBySiteId(JB4DCSession session, String siteId) {
        return siteFolderMapper.selectFolderBySiteId(siteId);
    }
}
