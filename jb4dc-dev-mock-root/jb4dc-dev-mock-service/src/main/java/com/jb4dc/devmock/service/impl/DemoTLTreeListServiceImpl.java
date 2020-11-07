package com.jb4dc.devmock.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.devmock.dao.DemoTlTreeListMapper;
import com.jb4dc.devmock.dbentities.DemoTlTreeListEntity;
import com.jb4dc.devmock.service.IDemoTLTreeListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DemoTLTreeListServiceImpl extends BaseServiceImpl<DemoTlTreeListEntity> implements IDemoTLTreeListService {

    DemoTlTreeListMapper devDemoTLTreeListMapper;

    @Autowired
    public DemoTLTreeListServiceImpl(DemoTlTreeListMapper _defaultBaseMapper) {
        super(_defaultBaseMapper);
        devDemoTLTreeListMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, DemoTlTreeListEntity entity) throws JBuild4DCGenerallyException {
        return this.save(jb4DSession, id, entity, new IAddBefore<DemoTlTreeListEntity>() {
            @Override
            public DemoTlTreeListEntity run(JB4DCSession jb4DSession, DemoTlTreeListEntity sourceEntity) throws JBuild4DCGenerallyException {
                sourceEntity.setDdtlCreatetime(new Date());
                sourceEntity.setDdtlOrderNum(devDemoTLTreeListMapper.nextOrderNum());
                return sourceEntity;
            }
        });
    }


    @Override
    public void moveUp(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        DemoTlTreeListEntity selfEntity=devDemoTLTreeListMapper.selectByPrimaryKey(id);
        DemoTlTreeListEntity ltEntity=devDemoTLTreeListMapper.selectGreaterThanRecord(id,selfEntity.getDdtlGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        DemoTlTreeListEntity selfEntity=devDemoTLTreeListMapper.selectByPrimaryKey(id);
        DemoTlTreeListEntity ltEntity=devDemoTLTreeListMapper.selectLessThanRecord(id,selfEntity.getDdtlGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DemoTlTreeListEntity toEntity, DemoTlTreeListEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDdtlOrderNum();
            toEntity.setDdtlOrderNum(selfEntity.getDdtlOrderNum());
            selfEntity.setDdtlOrderNum(newNum);
            devDemoTLTreeListMapper.updateByPrimaryKeySelective(toEntity);
            devDemoTLTreeListMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
