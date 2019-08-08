package com.jb4dc.builder.webpackage.rest.builder.list;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.service.weblist.IListResourceService;
import com.jb4dc.builder.webpackage.rest.builder.dataset.DataSetMainRestTest;
import com.jb4dc.builder.webpackage.rest.builder.module.ModuleRestTest;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/7
 * To change this template use File | Settings | File Templates.
 */
public class ListRestTest extends ModuleRestTest {

    @Autowired
    IListResourceService listResourceService;

    String devMockListId="DevMockListIdTest";
    String builderListId="BuilderListIdTest";

    @Test
    public void addDevTestList() throws Exception {
        createList(devMockListId,devMockModuleId,"开发样例列表1",DataSetMainRestTest.devMockDataSetId);
        createList(builderListId,builderModuleId,"开发样例列表1",DataSetMainRestTest.builderDataSetId);
    }

    private void createList(String listId,String moduleId,String text,String dateSetId) throws com.jb4dc.core.base.exception.JBuild4DCGenerallyException {
        listResourceService.deleteByKeyNotValidate(JB4DCSessionUtility.getInitSystemSession(),listId, JBuild4DCYaml.getWarningOperationCode());
        ListResourceEntity listEntity=new ListResourceEntity();
        listEntity.setListId(listId);
        listEntity.setListCode(listId);
        listEntity.setListName(text);
        listEntity.setListSingleName(listId);
        listEntity.setListType("WebList");
        listEntity.setListIsSystem(TrueFalseEnum.False.getDisplayName());
        listEntity.setListModuleId(moduleId);
        listEntity.setListStatus(EnableTypeEnum.enable.getDisplayName());
        listEntity.setListDatasetId(dateSetId);
        listEntity.setListDatasetName("单元测试数据集");
        listEntity.setListDatasetPageSize(5);
        listEntity.setListIsResolve(TrueFalseEnum.True.getDisplayName());
        listEntity.setListEveryTimeResolve(TrueFalseEnum.False.getDisplayName());
        listEntity.setListHtmlSource("");
        listEntity.setListHtmlResolve("");
        listEntity.setListJsContent("");
        listEntity.setListCssContent("");
        listEntity.setListConfigContent("");
        listEntity.setListEnableSSear("");
        listEntity.setListEnableCSear("");
        listEntity.setListTheme("ThemeDefault");
        listEntity.setListCustServerRenderer("");
        listEntity.setListCustRefJs("");
        listEntity.setListCustClientRenderer("");
        listEntity.setListCustDesc("");

        listResourceService.saveSimple(JB4DCSessionUtility.getInitSystemSession(),listId,listEntity);
    }
}
