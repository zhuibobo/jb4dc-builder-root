package com.jb4dc.devmock.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.devmock.dao.DemoTreeTableMapper;
import com.jb4dc.devmock.dbentities.DemoTreeTableEntity;
import com.jb4dc.devmock.service.IDemoTreeTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/23
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DemoTreeTableServiceImpl extends BaseServiceImpl<DemoTreeTableEntity> implements IDemoTreeTableService {

    DemoTreeTableMapper devDemoTreeTableMapper;

    private String rootId="0";
    private String rootParentId="-1";

    @Autowired
    public DemoTreeTableServiceImpl(DemoTreeTableMapper _defaultBaseMapper) {
        super(_defaultBaseMapper);
        devDemoTreeTableMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, DemoTreeTableEntity entity) throws JBuild4DCGenerallyException {
        return this.save(jb4DSession, id, entity, new IAddBefore<DemoTreeTableEntity>() {
            @Override
            public DemoTreeTableEntity run(JB4DCSession jb4DSession, DemoTreeTableEntity sourceEntity) throws JBuild4DCGenerallyException {
                sourceEntity.setDdttChildCount(0);
                sourceEntity.setDdttOrderNum(devDemoTreeTableMapper.nextOrderNum());
                sourceEntity.setDdttCreatetime(new Date());
                String parentIdList=rootId;
                if(sourceEntity.getDdttId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setDdttParentId(rootParentId);
                }
                else if(!sourceEntity.getDdttParentId().equals("0"))
                {
                    DemoTreeTableEntity parentEntity=devDemoTreeTableMapper.selectByPrimaryKey(sourceEntity.getDdttParentId());
                    parentIdList=parentEntity.getDdttParentIdlist();
                    parentEntity.setDdttChildCount(parentEntity.getDdttChildCount()+1);
                    devDemoTreeTableMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setDdttParentIdlist(parentIdList+"*"+sourceEntity.getDdttId());
                return sourceEntity;
            }
        });
    }

    @Override
    public DemoTreeTableEntity createRootNode(JB4DCSession jb4DSession) throws JBuild4DCGenerallyException {
        DemoTreeTableEntity treeTableEntity=new DemoTreeTableEntity();
        //treeTableEntity.setDdglParentId(rootId);
        treeTableEntity.setDdttId("0");
        treeTableEntity.setDdttKey("Root");
        treeTableEntity.setDdttName("Root");
        treeTableEntity.setDdttValue("Root");
        treeTableEntity.setDdttStatus("启用");
        this.saveSimple(jb4DSession,treeTableEntity.getDdttId(),treeTableEntity);
        return treeTableEntity;
    }


    @Override
    public void statusChange(JB4DCSession jb4DSession, String ids, String status) throws JBuild4DCGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                DemoTreeTableEntity entity = getByPrimaryKey(jb4DSession, idArray[i]);
                entity.setDdttStatus(status);
                devDemoTreeTableMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }

    @Override
    public void moveUp(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        DemoTreeTableEntity selfEntity=devDemoTreeTableMapper.selectByPrimaryKey(id);
        DemoTreeTableEntity ltEntity=devDemoTreeTableMapper.selectLessThanRecord(id,selfEntity.getDdttParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DSession, String id) throws JBuild4DCGenerallyException {
        DemoTreeTableEntity selfEntity=devDemoTreeTableMapper.selectByPrimaryKey(id);
        DemoTreeTableEntity ltEntity=devDemoTreeTableMapper.selectGreaterThanRecord(id,selfEntity.getDdttParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DemoTreeTableEntity toEntity, DemoTreeTableEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDdttOrderNum();
            toEntity.setDdttOrderNum(selfEntity.getDdttOrderNum());
            selfEntity.setDdttOrderNum(newNum);
            devDemoTreeTableMapper.updateByPrimaryKeySelective(toEntity);
            devDemoTreeTableMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
