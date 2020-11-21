package com.jb4dc.gridsystem.api;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/15
 * To change this template use File | Settings | File Templates.
 */
public class NewBuildSupplementFieldDataApi implements IApiForButton {
    @Autowired
    IBuildInfoService buildInfoService;

    @Override
    public ApiRunResult runApi(ApiRunPara apiRunPara) throws JBuild4DCGenerallyException {
        //apiRunPara.
        JB4DCSession jb4DCSession=JB4DCSessionUtility.getSession();
        BuildInfoEntity buildInfoEntity=buildInfoService.getByPrimaryKey(jb4DCSession,apiRunPara.getRecordId());
        if(BaseUtility.isAddOperation(apiRunPara.getOperationTypeName())){
            buildInfoEntity.setBuildInputDate(new Date());
            buildInfoEntity.setBuildInputUnitName(jb4DCSession.getOrganName());
            buildInfoEntity.setBuildInputUnitId(jb4DCSession.getOrganId());
            buildInfoEntity.setBuildInputUserName(jb4DCSession.getUserName());
            buildInfoEntity.setBuildInputUserId(jb4DCSession.getUserId());
            buildInfoEntity.setBuildChildCount(0);
            buildInfoEntity.setBuildIsVirtual(TrueFalseEnum.False.getDisplayName());
            buildInfoEntity.setBuildParentId("0");
            buildInfoEntity.setBuildParentIdList("0*"+buildInfoEntity.getBuildId());
            buildInfoEntity.setBuildRecordStatus(EnableTypeEnum.enable.getDisplayName());
            buildInfoService.updateByKeySelective(jb4DCSession,buildInfoEntity);
        }
        //判断编号是否唯一
        List<BuildInfoEntity> codeBuildInfoEntities=buildInfoService.getByBuildCode(buildInfoEntity.getBuildCode());
        if(codeBuildInfoEntities.size()>1){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"建筑物编码不能重复!");
        }
        if(!codeBuildInfoEntities.get(0).getBuildId().equals(buildInfoEntity.getBuildId())){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"建筑物编码不能重复!");
        }

        return ApiRunResult.successResult();
    }
}
