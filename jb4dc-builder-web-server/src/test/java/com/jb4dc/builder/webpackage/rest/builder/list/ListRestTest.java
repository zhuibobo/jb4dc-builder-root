package com.jb4dc.builder.webpackage.rest.builder.list;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dbentities.module.ModuleEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.service.weblist.IListResourceService;
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

    String listId="DevMockListIdTest";

    @Test
    public void addDevTestList() throws Exception {
        listResourceService.deleteByKeyNotValidate(JB4DCSessionUtility.getInitSystemSession(),listId, JBuild4DCYaml.getWarningOperationCode());
        ListResourceEntity listEntity=new ListResourceEntity();
        listEntity.setListId(listId);
        listEntity.setListCode(listId);
        listEntity.setListName("开发样例列表1");
        listEntity.setListSingleName(listId);
        /*listEntity.setListType();
        listEntity.setListIsSystem();
        listEntity.setListOrderNum();
        listEntity.setListDesc();
        listEntity.setListModuleId();
        listEntity.setListStatus();
        listEntity.setListOrganId();
        listEntity.setListOrganName();
        listEntity.setListDatasetId();
        listEntity.setListDatasetName();
        listEntity.setListDatasetPageSize();
        listEntity.setListIsResolve();
        listEntity.setListEveryTimeResolve();
        listEntity.setListHtmlSource();
        listEntity.setListHtmlResolve();
        listEntity.setListJsContent();
        listEntity.setListCssContent();
        listEntity.setListConfigContent();
        listEntity.setListEnableSSear();
        listEntity.setListEnableCSear();
        listEntity.setListTheme();
        listEntity.setListCustServerRenderer();
        listEntity.setListCustRefJs();
        listEntity.setListCustClientRenderer();
        listEntity.setListCustDesc();

        listResourceService.saveSimple(JB4DCSessionUtility.getInitSystemSession(),listId,ListResourceEntity);*/
    }
}
