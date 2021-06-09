package com.jb4dc.workflow.client.rest.client;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.po.formdata.FormRecordComplexPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.client.remote.UserRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import com.jb4dc.sso.dbentities.user.UserEntity;
import com.jb4dc.workflow.po.bpmn.process.BpmnTask;
import com.jb4dc.workflow.po.receive.RuntimeReceiverUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/Client/ReceiverRuntime")
public class ReceiverRuntimeRest {

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    @Autowired
    UserRuntimeRemote userRuntimeRemote;

    @RequestMapping(value = "/GetAsyncReceivers")
    public List<RuntimeReceiverUser> getAsyncReceivers(String id, String typeName, String name) throws IOException, JBuild4DCGenerallyException {
        List<RuntimeReceiverUser> result=new ArrayList<>();
        if(typeName.equals("Organs")){
            List<UserEntity> userEntityList=userRuntimeRemote.getUserByOrganIdRT(id).getData();
            List<RuntimeReceiverUser> userRuntimeReceiverUserList=RuntimeReceiverUser.parseUserEntityListToReceiverList(userEntityList,"");
            result.addAll(userRuntimeReceiverUserList);

            List<OrganEntity> organEntityList=organRuntimeRemote.getEnableChildOrganRT(id).getData();
            List<RuntimeReceiverUser> organRuntimeReceiverUserList=RuntimeReceiverUser.parseOrganEntityListToReceiverList(organEntityList,"");
            result.addAll(organRuntimeReceiverUserList);
        }
        return result;
        /*formRecordComplexPOString= URLDecoder.decode(formRecordComplexPOString,"utf-8");
        FormRecordComplexPO formRecordComplexPO = JsonUtility.toObjectIgnoreProp(formRecordComplexPOString,FormRecordComplexPO.class);
        Map exVars=new HashMap();
        if(isStartInstanceStatus) {
            return workFlowInstanceRuntimeService.resolveNextPossibleTaskWithStartNode(JB4DCSessionUtility.getSession(), actionCode, flowInstanceRuntimePOCacheKey, formRecordComplexPO, exVars);
        }
        return null;*/
        //return null;
    }
}
