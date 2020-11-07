package com.jb4dc.devmock.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.devmock.dao.DemoTlTreeMapper;
import com.jb4dc.devmock.dbentities.DemoTlTreeEntity;
import com.jb4dc.devmock.service.IDemoTLTreeService;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DemoTLTreeServiceImpl extends BaseServiceImpl<DemoTlTreeEntity> implements IDemoTLTreeService {

    DemoTlTreeMapper devDemoTLTreeMapper;

    private String rootId="0";
    private String rootParentId="-1";

    public DemoTLTreeServiceImpl(DemoTlTreeMapper _defaultBaseMapper) {
        super(_defaultBaseMapper);
        devDemoTLTreeMapper=_defaultBaseMapper;
    }

    @Override
    public DemoTlTreeEntity createRootNode(JB4DCSession jb4DSession) throws JBuild4DCGenerallyException {
        DemoTlTreeEntity treeTableEntity=new DemoTlTreeEntity();
        treeTableEntity.setDdttId("0");
        treeTableEntity.setDdttKey("Root");
        treeTableEntity.setDdttName("Root");
        treeTableEntity.setDdttValue("Root");
        treeTableEntity.setDdttStatus("启用");
        this.saveSimple(jb4DSession,treeTableEntity.getDdttId(),treeTableEntity);
        return treeTableEntity;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, DemoTlTreeEntity entity) throws JBuild4DCGenerallyException {
        return this.save(jb4DSession, id, entity, new IAddBefore<DemoTlTreeEntity>() {
            @Override
            public DemoTlTreeEntity run(JB4DCSession jb4DSession, DemoTlTreeEntity sourceEntity) throws JBuild4DCGenerallyException {
                sourceEntity.setDdttChildCount(0);
                sourceEntity.setDdttOrderNum(devDemoTLTreeMapper.nextOrderNum());
                sourceEntity.setDdttCreatetime(new Date());
                String parentIdList;
                if(sourceEntity.getDdttId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setDdttParentId(rootParentId);
                }
                else
                {
                    DemoTlTreeEntity parentEntity=devDemoTLTreeMapper.selectByPrimaryKey(sourceEntity.getDdttParentId());
                    parentIdList=parentEntity.getDdttParentIdlist();
                    parentEntity.setDdttChildCount(parentEntity.getDdttChildCount()+1);
                    devDemoTLTreeMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setDdttParentIdlist(parentIdList+"*"+sourceEntity.getDdttId());
                return sourceEntity;
            }
        });
    }

    @Override
    public void moveUp(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        DemoTlTreeEntity selfEntity=devDemoTLTreeMapper.selectByPrimaryKey(id);
        DemoTlTreeEntity ltEntity=devDemoTLTreeMapper.selectLessThanRecord(id,selfEntity.getDdttParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        DemoTlTreeEntity selfEntity=devDemoTLTreeMapper.selectByPrimaryKey(id);
        DemoTlTreeEntity ltEntity=devDemoTLTreeMapper.selectGreaterThanRecord(id,selfEntity.getDdttParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DemoTlTreeEntity toEntity, DemoTlTreeEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDdttOrderNum();
            toEntity.setDdttOrderNum(selfEntity.getDdttOrderNum());
            selfEntity.setDdttOrderNum(newNum);
            String temp="";
            devDemoTLTreeMapper.updateByPrimaryKeySelective(toEntity);
            devDemoTLTreeMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
