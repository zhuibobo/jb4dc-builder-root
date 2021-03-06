package com.jb4dc.gridsystem.envvar.creator;

import com.jb4dc.builder.client.service.envvar.IEnvVariableCreator;
import com.jb4dc.builder.dbentities.envvar.EnvVariableEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.gridsystem.dbentities.gridinfo.GridInfoEntity;
import com.jb4dc.gridsystem.service.gridinfo.IGridInfoService;
import com.jb4dc.builder.po.EnvVariableResultPO;
import org.springframework.beans.factory.annotation.Autowired;

public class CurrentUserGridCodeCreater implements IEnvVariableCreator {
    @Autowired
    IGridInfoService gridInfoService;

    @Override
    public EnvVariableResultPO createVar(JB4DCSession jb4DCSession, EnvVariableEntity envVariableEntity) throws JBuild4DCGenerallyException {
        String organId=jb4DCSession.getOrganId();
        GridInfoEntity gridInfoEntity=gridInfoService.getByPrimaryKey(jb4DCSession,organId);
        if(gridInfoEntity==null){
            return new EnvVariableResultPO("请在网格管理中设置网格编码!");
        }
        if(StringUtility.isEmpty(gridInfoEntity.getGridCode())){
            return new EnvVariableResultPO("请在网格管理中设置网格编码!");
        }
        return new EnvVariableResultPO(gridInfoEntity.getGridCode());
    }
}
