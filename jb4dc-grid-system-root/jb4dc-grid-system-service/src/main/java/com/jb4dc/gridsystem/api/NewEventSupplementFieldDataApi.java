package com.jb4dc.gridsystem.api;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.gridsystem.dbentities.event.EventInfoEntity;
import com.jb4dc.gridsystem.service.event.IEventInfoService;
import org.springframework.beans.factory.annotation.Autowired;

public class NewEventSupplementFieldDataApi implements IApiForButton {
    @Autowired
    IEventInfoService eventInfoService;

    @Override
    public ApiRunResult runApi(ApiRunPara apiRunPara) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        EventInfoEntity eventInfoEntity=eventInfoService.getByPrimaryKey(jb4DCSession,apiRunPara.getRecordId());

        if (eventInfoEntity.getEventCode().replace("-","").replace("-","").length()!=23){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"事件编码长度必须为23位!");
        }
        eventInfoService.testCodeSingle(eventInfoEntity);

        if(StringUtility.isEmpty(eventInfoEntity.getEventProcessNodeValue())) {
            eventInfoEntity.setEventProcessNodeName("登记");
            eventInfoEntity.setEventProcessNodeValue("create");
            eventInfoEntity.setEventAcceptUnitId(jb4DCSession.getOrganId());
            eventInfoEntity.setEventAcceptUserId(jb4DCSession.getUserId());
        }
        eventInfoService.updateByKeySelective(jb4DCSession,eventInfoEntity);
        return ApiRunResult.successResult();
    }
}
