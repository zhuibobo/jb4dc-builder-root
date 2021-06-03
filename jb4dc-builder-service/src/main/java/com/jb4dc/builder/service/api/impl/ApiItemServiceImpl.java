package com.jb4dc.builder.service.api.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.IUpdateBefore;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.builder.dao.api.ApiItemMapper;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.client.service.api.IApiItemService;
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
public class ApiItemServiceImpl extends BaseServiceImpl<ApiItemEntity> implements IApiItemService
{
    ApiItemMapper apiItemMapper;
    public ApiItemServiceImpl(ApiItemMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        apiItemMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ApiItemEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession, id, record, new IAddBefore<ApiItemEntity>() {
            @Override
            public ApiItemEntity run(JB4DCSession jb4DCSession, ApiItemEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                ApiItemEntity tempEntity = apiItemMapper.selectByValue(sourceEntity.getApiItemValue());
                if (tempEntity != null) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getApiItemValue()+"]Value必须唯一!");
                }
                tempEntity = apiItemMapper.selectByText(sourceEntity.getApiItemText());
                if (tempEntity != null) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getApiItemText()+"]Text必须唯一!");
                }

                sourceEntity.setApiItemOrderNum(apiItemMapper.nextOrderNum());
                sourceEntity.setApiItemCreateTime(new Date());
                sourceEntity.setApiItemUserId(jb4DCSession.getUserId());
                sourceEntity.setApiItemUserName(jb4DCSession.getUserName());
                sourceEntity.setApiItemOrganId(jb4DCSession.getOrganId());
                sourceEntity.setApiItemOrganName(jb4DCSession.getOrganName());
                return sourceEntity;
            }
        }, new IUpdateBefore<ApiItemEntity>() {
            @Override
            public ApiItemEntity run(JB4DCSession jb4DCSession, ApiItemEntity sourceEntity) throws JBuild4DCGenerallyException {
                ApiItemEntity tempEntity = apiItemMapper.selectByValue(sourceEntity.getApiItemValue());
                if(tempEntity!=null&&!tempEntity.getApiItemId().equals(sourceEntity.getApiItemId())){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getApiItemValue()+"]Value必须唯一!");
                }
                tempEntity = apiItemMapper.selectByText(sourceEntity.getApiItemText());
                if(tempEntity!=null&&!tempEntity.getApiItemId().equals(sourceEntity.getApiItemId())){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "["+tempEntity.getApiItemText()+"]Text必须唯一!");
                }
                return sourceEntity;
            }
        });
    }


    @Override
    public void initSystemData(JB4DCSession jb4DCSession) throws JBuild4DCGenerallyException {
        create(jb4DCSession,"API_GLOBAL_DELETE",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除","API_GLOBAL_DELETE","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE1",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除1","API_GLOBAL_DELETE1","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE2",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除2","API_GLOBAL_DELETE2","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE3",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除3","API_GLOBAL_DELETE3","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE4",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除4","API_GLOBAL_DELETE4","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE5",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除5","API_GLOBAL_DELETE5","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE6",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除6","API_GLOBAL_DELETE6","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE7",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除7","API_GLOBAL_DELETE7","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE8",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除8","API_GLOBAL_DELETE8","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE9",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除9","API_GLOBAL_DELETE9","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE10",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除10","API_GLOBAL_DELETE10","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE11",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除11","API_GLOBAL_DELETE11","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE12",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除12","API_GLOBAL_DELETE12","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE13",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除13","API_GLOBAL_DELETE13","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE14",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除14","API_GLOBAL_DELETE14","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE15",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除15","API_GLOBAL_DELETE15","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE16",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除16","API_GLOBAL_DELETE16","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE17",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除17","API_GLOBAL_DELETE17","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE18",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除18","API_GLOBAL_DELETE18","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");
        create(jb4DCSession,"API_GLOBAL_DELETE19",ApiGroupServiceImpl.API_GROUP_GLOBAL,"备份并删除19","API_GLOBAL_DELETE19","com.jb4dc.builder.client.service.api.mockapi.SoutApi","","","");

        create(jb4DCSession,"GeneralPrintLogActionApi","API_GROUP_WORKFLOW_ACTION_GENERAL","将动作Api参数写入到日志","com.jb4dc.workflow.client.action.api.impl.PrintLogActionApi","com.jb4dc.workflow.client.action.api.impl.PrintLogActionApi","","","");
    }

    @Override
    public ApiItemEntity getByValue(JB4DCSession session, String apiValue) {
        return apiItemMapper.selectByValue(apiValue);
    }

    @Override
    public List<ApiItemEntity> getByGroupTypeALL(String groupType, JB4DCSession jb4DCSession) {
        return apiItemMapper.selectByGroupTypeALL(groupType);
    }

    private ApiItemEntity create(JB4DCSession jb4DCSession,String envVarId,String groupId,String text,String value,String className,String classPara,String rest,String restPara) throws JBuild4DCGenerallyException {
        ApiItemEntity envVariableEntity=new ApiItemEntity();
        envVariableEntity.setApiItemId(envVarId);
        envVariableEntity.setApiItemValue(value);
        envVariableEntity.setApiItemText(text);
        envVariableEntity.setApiItemClassName(className);
        envVariableEntity.setApiItemClassPara(classPara);
        envVariableEntity.setApiItemRest(rest);
        envVariableEntity.setApiItemRestPara(restPara);
        envVariableEntity.setApiItemGroupId(groupId);
        envVariableEntity.setApiItemIsSystem(TrueFalseEnum.True.getDisplayName());
        envVariableEntity.setApiItemDelEnable(TrueFalseEnum.False.getDisplayName());
        envVariableEntity.setApiItemStatus(EnableTypeEnum.enable.getDisplayName());
        envVariableEntity.setApiItemDesc("");
        envVariableEntity.setApiItemExAttr1("");
        envVariableEntity.setApiItemExAttr2("");
        envVariableEntity.setApiItemExAttr3("");
        envVariableEntity.setApiItemExAttr4("");

        this.saveSimple(jb4DCSession,envVariableEntity.getApiItemId(),envVariableEntity);
        return envVariableEntity;
    }
}