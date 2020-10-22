package com.jb4dc.builder.webpackage.rest.builder.form;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.builder.dbentities.webform.FormResourceEntityWithBLOBs;
import com.jb4dc.builder.webpackage.rest.builder.module.ModuleRestTest;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/9
 * To change this template use File | Settings | File Templates.
 */
public class FormRestTest  extends ModuleRestTest {
    @Autowired
    IFormResourceService formResourceService;

    String devMockFormId="DevMockFormIdTest0001";
    String builderFormId="BuilderFormIdTest0001";

    @Test
    public void addDevTestList() throws Exception {
        createForm(builderFormId,builderModuleId,"构建库-开发测试窗体");
    }

    private void createForm(String formId,String moduleId,String formName) throws com.jb4dc.core.base.exception.JBuild4DCGenerallyException {
        FormResourceEntityWithBLOBs formResourceEntity=new FormResourceEntityWithBLOBs();
        formResourceEntity.setFormId(formId);
        formResourceEntity.setFormCode(formId);
        formResourceEntity.setFormName(formName);
        formResourceEntity.setFormSingleName(formId);
        formResourceEntity.setFormType("业务表单");
        formResourceEntity.setFormIsSystem(TrueFalseEnum.False.getDisplayName());
        formResourceEntity.setFormModuleId(moduleId);
        formResourceEntity.setFormStatus(EnableTypeEnum.enable.getDisplayName());
        formResourceEntity.setFormMainTableName("TDEV_TEST_3");
        formResourceEntity.setFormMainTableCaption("开发测试表3");
        formResourceEntity.setFormDataRelation("[{\"id\":\"24cc2e46-304f-6a9f-8663-670356b89b8e\",\"parentId\":\"-1\",\"singleName\":\"\",\"pkFieldName\":\"\",\"desc\":\"\",\"selfKeyFieldName\":\"\",\"outerKeyFieldName\":\"\",\"relationType\":\"1ToN\",\"isSave\":\"true\",\"condition\":\"\",\"tableId\":\"TDEV_TEST_3\",\"tableName\":\"TDEV_TEST_3\",\"tableCaption\":\"开发测试表3\",\"tableCode\":\"T_10099\"}]");
        formResourceEntity.setFormIsTemplate(TrueFalseEnum.False.getDisplayName());
        formResourceEntity.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
        formResourceEntity.setFormEveryTimeResolve(TrueFalseEnum.False.getDisplayName());
        formResourceEntity.setFormHtmlSource("");
        formResourceEntity.setFormHtmlResolve("");
        formResourceEntity.setFormJsContent("");
        formResourceEntity.setFormCssContent("");
        formResourceEntity.setFormConfigContent("");
        formResourceEntity.setFormSource("Web设计器");
        formResourceEntity.setFormContentUrl("");
        formResourceEntity.setFormTheme("ThemeDefault");
        formResourceEntity.setFormCustServerRenderer("");
        formResourceEntity.setFormCustRefJs("");
        formResourceEntity.setFormCustClientRenderer("");
        formResourceEntity.setFormCustDesc("");
        formResourceService.saveSimple(JB4DCSessionUtility.getInitSystemSession(),formId,formResourceEntity);
    }
}
