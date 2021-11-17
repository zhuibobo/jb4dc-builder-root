package com.jb4dc.builder.webpackage.rest.portlet;


import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.po.ZTreeNodePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.portlet.client.remote.WidgetRuntimeRemote;
import com.jb4dc.portlet.dbentities.GroupEntity;
import com.jb4dc.portlet.dbentities.WidgetEntity;
import com.jb4dc.portlet.service.IGroupService;
import com.jb4dc.portlet.service.IWidgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Portlet/Widget")
public class WidgetRest extends GeneralRest<WidgetEntity> implements WidgetRuntimeRemote {

    @Autowired
    IWidgetService widgetService;

    @Autowired
    IGroupService groupService;

    @Override
    protected IBaseService<WidgetEntity> getBaseService() {
        return widgetService;
    }

    @RequestMapping(value = "/GetTreeData", method = { RequestMethod.GET, RequestMethod.POST })
    public JBuild4DCResponseVo<List<ZTreeNodePO>> getTreeData() {
        List<GroupEntity> groupEntityList=groupService.getByGroupTypeASC(JB4DCSessionUtility.getSession(),"WidgetGroup");
        List<WidgetEntity> widgetEntityList=widgetService.getByStatus(JB4DCSessionUtility.getSession(), EnableTypeEnum.enable.getDisplayName());
        List<ZTreeNodePO> zTreeNodePOList=groupService.convertGroupWidgetToTreeNode(JB4DCSessionUtility.getSession(),groupEntityList,widgetEntityList);
        return JBuild4DCResponseVo.getDataSuccess(zTreeNodePOList);
    }

    @Override
    public JBuild4DCResponseVo<List<WidgetEntity>> getALLWidget() throws JBuild4DCGenerallyException {
        return JBuild4DCResponseVo.getDataSuccess(widgetService.getALLWithBLOBs(JB4DCSessionUtility.getSession()));
    }
}
