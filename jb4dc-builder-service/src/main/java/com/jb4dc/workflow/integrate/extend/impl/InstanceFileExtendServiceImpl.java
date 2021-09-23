package com.jb4dc.workflow.integrate.extend.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.dao.InstanceFileMapper;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;
import com.jb4dc.workflow.integrate.extend.IInstanceFileExtendService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InstanceFileExtendServiceImpl extends BaseServiceImpl<InstanceFileEntity> implements IInstanceFileExtendService
{
    InstanceFileMapper instanceFileMapper;
    public InstanceFileExtendServiceImpl(InstanceFileMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        instanceFileMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, InstanceFileEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<InstanceFileEntity>() {
            @Override
            public InstanceFileEntity run(JB4DCSession jb4DCSession, InstanceFileEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public List<InstanceFileEntity> getAttachmentFileListData(JB4DCSession jb4DCSession, String instanceId) {
        return instanceFileMapper.selectAttachmentByInstanceId(instanceId);
    }

    @Override
    public List<InstanceFileEntity> getDocumentFileListData(JB4DCSession jb4DCSession, String instanceId) {
        return instanceFileMapper.selectDocumentByInstanceId(instanceId);
    }

    @Override
    public InstanceFileEntity tryGetLastOnlineDocument(JB4DCSession jb4DCSession, String instanceId) {
        List<InstanceFileEntity> instanceFileEntityList=getDocumentFileListData(jb4DCSession,instanceId);
        if(instanceFileEntityList.stream().anyMatch((item->item.getFileTypeCate().equals("Online")))){
            instanceFileEntityList=instanceFileEntityList.stream().filter(item->item.getFileTypeCate().equals("Online")).sorted(Comparator.comparing(InstanceFileEntity::getFileCreateTime).reversed()).collect(Collectors.toList());
            return  instanceFileEntityList.get(0);
            //instanceFileEntityList.sort(Comparator.comparing(o -> o.getFileCreateTime()).reversed());
            //return instanceFileEntityList.stream().filter(item->item.getFileTypeCate().equals("Online"))
        }
        return null;
    }
}