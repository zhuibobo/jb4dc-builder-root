package com.jb4dc.builder.service.api.impl;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.api.ApiGroupMapper;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.builder.service.api.IApiGroupService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/16
 * To change this template use File | Settings | File Templates.
 */
@Service
public class ApiGroupServiceImpl extends BaseServiceImpl<ApiGroupEntity> implements IApiGroupService
{
    private String rootId="0";
    private String rootParentId="-1";


    ApiGroupMapper apiGroupMapper;
    public ApiGroupServiceImpl(ApiGroupMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        apiGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ApiGroupEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession, id, record, (jb4DCSession1, sourceEntity) -> {
            //
            ApiGroupEntity tempEntity = apiGroupMapper.selectByValue(sourceEntity.getApiGroupValue());
            if (tempEntity != null) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getApiGroupValue()+"]Value必须唯一!");
            }

            //设置排序,以及其他参数--nextOrderNum()
            sourceEntity.setApiGroupOrderNum(apiGroupMapper.nextOrderNum());
            sourceEntity.setApiGroupChildCount(0);
            sourceEntity.setApiGroupCreateTime(new Date());
            sourceEntity.setApiGroupOrganId(jb4DCSession1.getOrganId());
            sourceEntity.setApiGroupOrganName(jb4DCSession1.getOrganName());
            String parentIdList;
            if (sourceEntity.getApiGroupId().equals(rootId)) {
                parentIdList = rootParentId;
                sourceEntity.setApiGroupParentId(rootParentId);
            } else {
                ApiGroupEntity parentEntity = apiGroupMapper.selectByPrimaryKey(sourceEntity.getApiGroupParentId());
                parentIdList = parentEntity.getApiGroupPidList();
                parentEntity.setApiGroupChildCount(parentEntity.getApiGroupChildCount() + 1);
                apiGroupMapper.updateByPrimaryKeySelective(parentEntity);

                sourceEntity.setApiGroupType(parentEntity.getApiGroupType());
            }
            sourceEntity.setApiGroupPidList(parentIdList + "*" + sourceEntity.getApiGroupId());
            return sourceEntity;
        }, (jb4DCSession12, sourceEntity) -> {
            ApiGroupEntity tempEntity = apiGroupMapper.selectByValue(sourceEntity.getApiGroupValue());
            if(tempEntity!=null&&!tempEntity.getApiGroupId().equals(sourceEntity.getApiGroupId())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getApiGroupValue()+"]Value必须唯一!");
            }
            return sourceEntity;
        });
    }

    public static String API_GROUP_GLOBAL="API_GROUP_GLOBAL";

    public static String API_GROUP_BUILDER_BUTTON_ROOT="API_GROUP_BUILDER_BUTTON_ROOT";
    public static String API_GROUP_WORKFLOW_ACTION_ROOT="API_GROUP_WORKFLOW_ACTION_ROOT";

    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        ApiGroupEntity rootGroupEntity=create(jb4DCSession,rootId,rootParentId,"API根分组","API根分组","0");

        ApiGroupEntity builderButtonApiRootGroupEntity=create(jb4DCSession,API_GROUP_BUILDER_BUTTON_ROOT,rootGroupEntity.getApiGroupId(),"构建按钮API分组","构建按钮API分组","API_GROUP_BUILDER_BUTTON_ROOT");

        ApiGroupEntity generalGroupEntity=create(jb4DCSession,API_GROUP_GLOBAL,builderButtonApiRootGroupEntity.getApiGroupId(),"通用API分组","通用API分组","API_GROUP_BUILDER_BUTTON_ROOT");

        ApiGroupEntity businessGroupEntity=create(jb4DCSession,"API_GROUP_BUSINESS",builderButtonApiRootGroupEntity.getApiGroupId(),"业务系统分组","业务系统分组","API_GROUP_BUILDER_BUTTON_ROOT");

        ApiGroupEntity mockDevGroupEntity=create(jb4DCSession,"ENV_GROUP_BUSINESS_MOCK_DEV",builderButtonApiRootGroupEntity.getApiGroupId(),"开发模拟系统","开发模拟系统","API_GROUP_BUILDER_BUTTON_ROOT");

        ApiGroupEntity workFlowApiRootGroupEntity=create(jb4DCSession,API_GROUP_WORKFLOW_ACTION_ROOT,rootGroupEntity.getApiGroupId(),"工作流动作API分组","工作流动作API分组","API_GROUP_WORKFLOW_ACTION_ROOT");
    }

    @Override
    public List<ApiGroupEntity> getByGroupTypeASC(String groupType, JB4DCSession session) {
        return apiGroupMapper.selectByGroupTypeASC(groupType);
    }

    private ApiGroupEntity create(JB4DCSession jb4DCSession,String groupId,String parentId,String text,String value,String type) throws JBuild4DCGenerallyException {
        ApiGroupEntity rootEntity=new ApiGroupEntity();
        rootEntity.setApiGroupId(groupId);
        rootEntity.setApiGroupParentId(parentId);
        rootEntity.setApiGroupIsSystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setApiGroupDelEnable(TrueFalseEnum.False.getDisplayName());
        rootEntity.setApiGroupText(text);
        rootEntity.setApiGroupValue(value);
        rootEntity.setApiGroupStatus(EnableTypeEnum.enable.getDisplayName());
        rootEntity.setApiGroupType(type);
        this.saveSimple(jb4DCSession,rootEntity.getApiGroupId(),rootEntity);
        return rootEntity;
    }
}
