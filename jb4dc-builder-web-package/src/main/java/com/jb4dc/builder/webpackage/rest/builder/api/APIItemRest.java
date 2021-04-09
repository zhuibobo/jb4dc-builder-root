package com.jb4dc.builder.webpackage.rest.builder.api;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.api.ApiGroupEntity;
import com.jb4dc.builder.dbentities.api.ApiItemEntity;
import com.jb4dc.builder.po.ZTreeNodePOConvert;
import com.jb4dc.builder.service.api.IApiGroupService;
import com.jb4dc.builder.client.service.api.IApiItemService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/16
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/ApiItem")
public class APIItemRest  extends GeneralRest<ApiItemEntity> {
    @Autowired
    IApiItemService apiItemService;

    @Autowired
    IApiGroupService apiGroupService;

    @Override
    public String getModuleName() {
        return "API";
    }

    @Override
    protected IBaseService<ApiItemEntity> getBaseService() {
        return apiItemService;
    }

    @RequestMapping(value = "/GetAPISForZTreeNodeList", method = RequestMethod.POST)
    public JBuild4DCResponseVo getAPISForZTreeNodeList(String groupType){
        try {
            JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
            responseVo.setSuccess(true);
            responseVo.setMessage("获取数据成功！");

            JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();

            //List<ApiGroupEntity> apiGroupEntityList=apiGroupService.getALL(jb4DCSession);
            List<ApiGroupEntity> apiGroupEntityList=apiGroupService.getByGroupTypeASC(groupType,jb4DCSession);
            List<ApiItemEntity> apiItemEntityList=apiItemService.getByGroupTypeALL(groupType,jb4DCSession);

            responseVo.setData(ZTreeNodePOConvert.parseApiToZTreeNodeList(apiGroupEntityList,apiItemEntityList));

            return responseVo;
        }
        catch (Exception ex){
            return JBuild4DCResponseVo.error(ex.getMessage());
        }
    }
}
