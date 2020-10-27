package com.jb4dc.builder.webpackage.rest.builder.form;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntityWithBLOBs;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.po.ZTreeNodePOConvert;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.feb.dist.webserver.rest.base.GeneralRest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Builder/Form")
public class FormRest extends GeneralRest<FormResourceEntityWithBLOBs> {

    @Autowired
    IFormResourceService formResourceService;

    @Autowired
    IModuleService moduleService;

    @Autowired
    ITableFieldService tableFieldService;

    @Override
    protected IBaseService<FormResourceEntityWithBLOBs> getBaseService() {
        return formResourceService;
    }

    @Override
    public String getModuleName() {
        return "模块设计-Web表单设计";
    }

    @RequestMapping(value = "/GetWebFormForZTreeNodeList", method = RequestMethod.POST)
    public JBuild4DCResponseVo getWebFormForZTreeNodeList(){
        try {
            JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
            responseVo.setSuccess(true);
            responseVo.setMessage("获取数据成功！");

            JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();

            List<ModuleEntity> moduleEntityList=moduleService.getALL(jb4DCSession);
            List<FormResourceEntityWithBLOBs> formResourceEntityList=formResourceService.getALL(jb4DCSession);

            responseVo.setData(ZTreeNodePOConvert.parseWebFormToZTreeNodeList(moduleEntityList,formResourceEntityList));

            return responseVo;
        }
        catch (Exception ex){
            return JBuild4DCResponseVo.error(ex.getMessage());
        }
    }

    @RequestMapping(value = "GetFormMainTableFields",method = RequestMethod.POST)
    public JBuild4DCResponseVo getFormMainTableFields(String formId) throws JBuild4DCGenerallyException, IOException {
        FormResourceEntity formResourceEntity=formResourceService.getByPrimaryKey(JB4DCSessionUtility.getSession(),formId);
        List<TableFieldPO> tableFieldPOList =tableFieldService.getTableFieldsByTableName(formResourceEntity.getFormMainTableId(),formResourceEntity.getFormMainTableName(),formResourceEntity.getFormMainTableCaption());
        return JBuild4DCResponseVo.getDataSuccess(tableFieldPOList);
    }

    @RequestMapping(value = "CopyForm",method = RequestMethod.POST)
    public JBuild4DCResponseVo copyForm(String formId) throws JBuild4DCGenerallyException, IOException {
        formResourceService.copyForm(JB4DCSessionUtility.getSession(),formId);
        return JBuild4DCResponseVo.opSuccess();
    }
}
