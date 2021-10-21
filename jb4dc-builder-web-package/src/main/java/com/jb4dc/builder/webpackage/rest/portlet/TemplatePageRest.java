package com.jb4dc.builder.webpackage.rest.portlet;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.po.ZTreeNodePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import com.jb4dc.portlet.dbentities.GroupEntity;
import com.jb4dc.portlet.dbentities.TemplatePageEntityWithBLOBs;
import com.jb4dc.portlet.dbentities.WidgetEntity;
import com.jb4dc.portlet.service.IGroupService;
import com.jb4dc.portlet.service.ITemplatePageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Portlet/TemplatePage")
public class TemplatePageRest extends GeneralRest<TemplatePageEntityWithBLOBs> {

    @Autowired
    ITemplatePageService templatePageService;

    @Autowired
    IGroupService groupService;

    @Override
    protected IBaseService<TemplatePageEntityWithBLOBs> getBaseService() {
        return templatePageService;
    }

    @RequestMapping(value = "/SavePageWidgetConfig", method = RequestMethod.POST)
    public JBuild4DCResponseVo savePageWidgetConfig(String recordId,String pageWidgetConfig) throws JBuild4DCGenerallyException {
        templatePageService.savePageWidgetConfig(JB4DCSessionUtility.getSession(),recordId,pageWidgetConfig);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/GetTreeData", method = {RequestMethod.POST,RequestMethod.GET})
    public JBuild4DCResponseVo<List<ZTreeNodePO>> getTreeData() {
        List<GroupEntity> groupEntityList=groupService.getByGroupTypeASC(JB4DCSessionUtility.getSession(),"PageGroup");
        List<TemplatePageEntityWithBLOBs> templatePageEntityWithBLOBsList=templatePageService.getByStatus(JB4DCSessionUtility.getSession(), EnableTypeEnum.enable.getDisplayName());
        List<ZTreeNodePO> zTreeNodePOList=groupService.convertGroupPageToTreeNode(JB4DCSessionUtility.getSession(),groupEntityList,templatePageEntityWithBLOBsList);
        return JBuild4DCResponseVo.getDataSuccess(zTreeNodePOList);
    }
}
