package com.jb4dc.devmock.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.devmock.dao.DemoGenListMapper;
import com.jb4dc.devmock.dbentities.DemoGenListEntity;
import com.jb4dc.devmock.service.IDemoGenListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/15
 * To change this template use File | Settings | File Templates.
 */

@Service
public class DemoGenListServiceImpl extends BaseServiceImpl<DemoGenListEntity> implements IDemoGenListService
{
    DemoGenListMapper devDemoGenListMapper;

    @Autowired
    public DemoGenListServiceImpl(DemoGenListMapper _defaultBaseMapper) {
        super(_defaultBaseMapper);
        devDemoGenListMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, DemoGenListEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DemoGenListEntity>() {
            @Override
            public DemoGenListEntity run(JB4DCSession jb4DSession, DemoGenListEntity item) throws JBuild4DCGenerallyException {
                item.setDdglUserId(jb4DSession.getUserId());
                item.setDdglUserName(jb4DSession.getUserName());
                item.setDdglOrganId(jb4DSession.getOrganId());
                item.setDdglOrganName(jb4DSession.getOrganName());
                item.setDdglOrderNum(devDemoGenListMapper.nextOrderNum());
                item.setDdglStatus("启用");
                return item;
            }
        });
    }

    @Override
    public void statusChange(JB4DCSession jb4DSession,String ids,String status) throws JBuild4DCGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                DemoGenListEntity entity = getByPrimaryKey(jb4DSession, idArray[i]);
                entity.setDdglStatus(status);
                devDemoGenListMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }

    @Override
    public void moveUp(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        DemoGenListEntity gtEntity=devDemoGenListMapper.selectGreaterThanRecord(id);
        switchOrder(id, gtEntity);
    }

    private void switchOrder(String id, DemoGenListEntity toEntity) {
        if(toEntity !=null){
            DemoGenListEntity selfEntity=devDemoGenListMapper.selectByPrimaryKey(id);
            int newNum= toEntity.getDdglOrderNum();
            toEntity.setDdglOrderNum(selfEntity.getDdglOrderNum());
            selfEntity.setDdglOrderNum(newNum);
            devDemoGenListMapper.updateByPrimaryKeySelective(toEntity);
            devDemoGenListMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }

    @Override
    public void moveDown(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        DemoGenListEntity ltEntity=devDemoGenListMapper.selectLessThanRecord(id);
        switchOrder(id, ltEntity);
    }
}
