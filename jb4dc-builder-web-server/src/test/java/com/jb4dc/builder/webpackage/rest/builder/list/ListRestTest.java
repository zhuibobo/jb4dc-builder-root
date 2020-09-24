package com.jb4dc.builder.webpackage.rest.builder.list;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntityWithBLOBs;
import com.jb4dc.builder.client.service.weblist.IListResourceService;
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

    String devMockListId="DevMockListIdTest0001";
    String builderListId="BuilderListIdTest0001";

    @Test
    public void addDevTestList() throws Exception {
        createList2(devMockListId,devMockModuleId,"开发样例列表1",DataSetMainRestTest.devMockDataSetId);
        createList1(builderListId,builderModuleId,"构建库-开发样例列表1",DataSetMainRestTest.builderDataSetId);
    }

    private void createList1(String listId,String moduleId,String text,String dateSetId) throws com.jb4dc.core.base.exception.JBuild4DCGenerallyException {
        listResourceService.deleteByKeyNotValidate(JB4DCSessionUtility.getInitSystemSession(),listId, JBuild4DCYaml.getWarningOperationCode());
        ListResourceEntityWithBLOBs listEntity=new ListResourceEntityWithBLOBs();
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
        listEntity.setListHtmlSource("<div class=\"html-design-theme-default-root-elem-class\" control_category=\"ContainerControl\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListTemplate\">\n" +
                "  <div class=\"wysiwyg-wldct-list-simple-search-outer-wrap wldct-list-simple-search-outer-wrap\" classname=\"\" clientresolve=\"\" control_category=\"ContainerControl\" desc=\"\" id=\"list_s_search_wrap_067546018\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"list_s_search_wrap_067546018\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListSimpleSearchContainer\">\n" +
                "    <div class=\"wysiwyg-auto-remove-tip\" runtime_auto_remove=\"true\">简单查询区域[双击编辑该部件],在下边div中编辑查询内容\n" +
                "    </div>\n" +
                "    <div class=\"wysiwyg-wldct-list-simple-search-inner-wrap wldct-list-simple-search-inner-wrap\">\n" +
                "      <table>\n" +
                "        <colgroup>\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "        </colgroup>\n" +
                "        <tbody>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">名称:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"用户名称\" columndatatypename=\"字符串\" columnname=\"F_USER_NAME\" columnoperator=\"like\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_937577293\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937577293\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[用户名称](like)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">标题:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"标题\" columndatatypename=\"字符串\" columnname=\"F_TITLE\" columnoperator=\"like\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_937590988\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937590988\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[标题](like)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">时间(从):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"发布时间\" columndatatypename=\"日期时间\" columnname=\"F_PUBLIC_TIME\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_937596948\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937596948\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[发布时间](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">(到):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"发布时间\" columndatatypename=\"日期时间\" columnname=\"F_PUBLIC_TIME\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_937609289\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937609289\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[发布时间](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_031092815\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031092815\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_031106357\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031106357\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody>\n" +
                "      </table>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "  <div class=\"wysiwyg-wldct-list-complex-search-outer-wrap wldct-list-complex-search-outer-wrap\" classname=\"\" clientresolve=\"\" control_category=\"ContainerControl\" desc=\"\" id=\"list_c_search_wrap_067490478\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"list_c_search_wrap_067490478\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListComplexSearchContainer\">\n" +
                "    <div class=\"wysiwyg-auto-remove-tip\" runtime_auto_remove=\"true\">弹出查询区域[双击编辑该部件],在下边div中编辑查询内容\n" +
                "    </div>\n" +
                "    <div class=\"wysiwyg-wldct-list-complex-search-inner-wrap wldct-list-complex-search-inner-wrap\">\n" +
                "      <table>\n" +
                "        <colgroup>\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "        </colgroup>\n" +
                "        <tbody>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">名称:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"用户名称\" columndatatypename=\"字符串\" columnname=\"F_USER_NAME\" columnoperator=\"like\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_112563673\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937577293\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[用户名称](like)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">标题:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"标题\" columndatatypename=\"字符串\" columnname=\"F_TITLE\" columnoperator=\"like\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_114133308\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937590988\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[标题](like)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">时间(从):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"发布时间\" columndatatypename=\"日期时间\" columnname=\"F_PUBLIC_TIME\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_114135281\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937596948\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[发布时间](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">(到):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"发布时间\" columndatatypename=\"日期时间\" columnname=\"F_PUBLIC_TIME\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_114137024\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937609289\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[发布时间](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">名称:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"用户名称\" columndatatypename=\"字符串\" columnname=\"F_USER_NAME\" columnoperator=\"like\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_114160962\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937577293\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[用户名称](like)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">标题:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"标题\" columndatatypename=\"字符串\" columnname=\"F_TITLE\" columnoperator=\"like\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_114162921\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937590988\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[标题](like)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">时间(从):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">(到):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_114153378\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031092815\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_114156508\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031106357\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_114200181\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031092815\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_114202268\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031106357\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119119314\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031092815\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119125215\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031106357\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119120072\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031092815\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119125907\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031106357\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119121173\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031092815\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119126512\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031106357\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119121952\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031092815\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119127146\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031106357\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119123478\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031092815\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_4\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"ct_copy_119127743\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031106357\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody>\n" +
                "      </table>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "  <div class=\"wysiwyg-wldct-list-button-outer-wrap wldct-list-button-outer-wrap\" classname=\"\" clientresolve=\"\" control_category=\"ContainerControl\" desc=\"\" id=\"list_button_wrap_067574167\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"list_button_wrap_067574167\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListButtonContainer\">\n" +
                "    <div class=\"wysiwyg-auto-remove-tip\" runtime_auto_remove=\"true\">操作按钮区域[双击编辑该部件],在下边div中编辑操作按钮\n" +
                "    </div>\n" +
                "    <div class=\"wysiwyg-wldct-list-button-inner-wrap wldct-list-button-inner-wrap\">\n" +
                "      <table is-op-button-wrap-table=\"true\">\n" +
                "        <colgroup>\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "        </colgroup>\n" +
                "        <tbody>\n" +
                "          <tr>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div bindauthority=\"notAuth\" buttoncaption=\"新增\" buttontype=\"ListFormButton\" class=\"wysiwyg-input-text\" classname=\"\" control_category=\"InputControl\" custclientclickbeforemethod=\"\" custclientclickbeforemethodpara=\"\" custclientrendereraftermethodpara=\"\" custclientrendereraftermethodparapara=\"\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custprop1=\"\" custprop2=\"\" custprop3=\"\" custprop4=\"\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" custsinglename=\"\" custurlappendpara=\"\" custurlappendparaformat=\"\" desc=\"\" formcode=\"100003\" formid=\"BuilderFormIdTest0001\" formmoduleid=\"BuilderModuleId001\" formmodulename=\"构建库-开发测试分组\" formname=\"构建库-开发测试窗体\" id=\"form_button_321027724\" innerbuttonjsonstring=\"[]\" is_jbuild4dc_data=\"true\" isshow=\"true\" jbuild4dc_custom=\"true\" name=\"form_button_321027724\" opentype=\"Dialog\" operation=\"add\" placeholder=\"\" serialize=\"false\" show_remove_button=\"true\" singlename=\"WLDCT_FormButton\" style=\"\" windowcaption=\"JBUILD4D\" windowheight=\"0\" windowwidth=\"0\">新增[窗体按钮]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div bindauthority=\"notAuth\" buttoncaption=\"修改\" buttontype=\"ListFormButton\" class=\"wysiwyg-input-text\" classname=\"\" control_category=\"InputControl\" custclientclickbeforemethod=\"\" custclientclickbeforemethodpara=\"\" custclientrendereraftermethodpara=\"\" custclientrendereraftermethodparapara=\"\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custprop1=\"\" custprop2=\"\" custprop3=\"\" custprop4=\"\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" custsinglename=\"\" custurlappendpara=\"\" custurlappendparaformat=\"\" desc=\"\" formcode=\"100003\" formid=\"BuilderFormIdTest0001\" formmoduleid=\"BuilderModuleId001\" formmodulename=\"构建库-开发测试分组\" formname=\"构建库-开发测试窗体\" id=\"form_button_321039610\" innerbuttonjsonstring=\"[]\" is_jbuild4dc_data=\"true\" isshow=\"true\" jbuild4dc_custom=\"true\" name=\"form_button_321039610\" opentype=\"Dialog\" operation=\"update\" placeholder=\"\" serialize=\"false\" show_remove_button=\"true\" singlename=\"WLDCT_FormButton\" style=\"\" windowcaption=\"JBUILD4D\" windowheight=\"640\" windowwidth=\"800\">修改[窗体按钮]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div bindauthority=\"notAuth\" buttoncaption=\"查看\" buttontype=\"ListFormButton\" class=\"wysiwyg-input-text\" classname=\"\" control_category=\"InputControl\" custclientclickbeforemethod=\"\" custclientclickbeforemethodpara=\"\" custclientrendereraftermethodpara=\"\" custclientrendereraftermethodparapara=\"\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custprop1=\"\" custprop2=\"\" custprop3=\"\" custprop4=\"\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" custsinglename=\"\" custurlappendpara=\"\" custurlappendparaformat=\"\" desc=\"\" formcode=\"100003\" formid=\"BuilderFormIdTest0001\" formmoduleid=\"BuilderModuleId001\" formmodulename=\"构建库-开发测试分组\" formname=\"构建库-开发测试窗体\" id=\"form_button_321068030\" innerbuttonjsonstring=\"[]\" is_jbuild4dc_data=\"true\" isshow=\"true\" jbuild4dc_custom=\"true\" name=\"form_button_321068030\" opentype=\"Dialog\" operation=\"view\" placeholder=\"\" serialize=\"false\" show_remove_button=\"true\" singlename=\"WLDCT_FormButton\" style=\"\" windowcaption=\"JBUILD4D\" windowheight=\"640\" windowwidth=\"800\">查看[窗体按钮]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody>\n" +
                "      </table>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "  <div class=\"wysiwyg-wldct-list-table-outer-wrap wldct-list-table-outer-wrap\" classname=\"\" clientresolve=\"\" control_category=\"ContainerControl\" desc=\"\" id=\"list_table_wrap_067614263\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"list_table_wrap_067614263\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListTableContainer\">\n" +
                "    <div class=\"wysiwyg-auto-remove-tip\" runtime_auto_remove=\"true\">表格显示区域[双击编辑该部件],在下边div中编辑查询内容\n" +
                "    </div>\n" +
                "    <div class=\"wysiwyg-wldct-list-table-inner-wrap wldct-list-table-inner-wrap\">\n" +
                "      <table is-op-button-wrap-table=\"true\" class=\"list-table\">\n" +
                "        <thead>\n" +
                "          <tr>\n" +
                "            <th colspan=\"2\" rowspan=\"1\">组织&amp;用户\n" +
                "            </th>\n" +
                "            <th colspan=\"2\" rowspan=\"1\" style=\"background-color: rgb(0, 204, 255);\">标题&amp;发布时间\n" +
                "            </th>\n" +
                "            <th>排序号\n" +
                "            </th>\n" +
                "            <th colspan=\"2\" rowspan=\"1\">作者&amp;地址\n" +
                "            </th>\n" +
                "            <th colspan=\"1\" rowspan=\"2\">性别\n" +
                "            </th>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <th>组织名称\n" +
                "            </th>\n" +
                "            <th>用户名称\n" +
                "            </th>\n" +
                "            <th>标题\n" +
                "            </th>\n" +
                "            <th>发布时间\n" +
                "            </th>\n" +
                "            <th>排序号\n" +
                "            </th>\n" +
                "            <th>作者\n" +
                "            </th>\n" +
                "            <th>地址\n" +
                "            </th>\n" +
                "          </tr>\n" +
                "        </thead>\n" +
                "        <tbody>\n" +
                "          <tr>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"组织名称\" columndatatypename=\"字符串\" columnname=\"F_ORGAN_NAME\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403647665\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403647665\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">组织名称[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"用户名称\" columndatatypename=\"字符串\" columnname=\"F_USER_NAME\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403660305\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403660305\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">用户名称[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"标题\" columndatatypename=\"字符串\" columnname=\"F_TITLE\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403667332\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403667332\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">标题[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"发布时间\" columndatatypename=\"日期时间\" columnname=\"F_PUBLIC_TIME\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403674108\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403674108\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">发布时间[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403682914\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403682914\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">排序号[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"作者\" columndatatypename=\"字符串\" columnname=\"F_AUTHOR\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403687709\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403687709\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">作者[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"地址\" columndatatypename=\"字符串\" columnname=\"ADDRESS\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403716362\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403716362\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">地址[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"性别\" columndatatypename=\"字符串\" columnname=\"SEX\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403722147\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403722147\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">性别[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody>\n" +
                "      </table>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>\n");
        listEntity.setListHtmlResolve("");
        listEntity.setListJsContent("<script>\n" +
                "var BuilderListPageRuntimeInstance={\n" +
                "    PageReady:function(){\n" +
                "        //页面加载html完成,未进行客户端控件的渲染\n" +
                "        console.log(\"页面加载html完成\");\n" +
                "    },\n" +
                "    RendererChainCompleted:function(){\n" +
                "        //客户端控件渲染完成.\n" +
                "        console.log(\"客户端控件渲染完成\");\n" +
                "    },\n" +
                "    RendererDataChainCompleted:function(){\n" +
                "        //客户端控件渲染并绑定完数据.\n" +
                "        console.log(\"客户端控件渲染并绑定完数据\");\n" +
                "    }\n" +
                "}\n" +
                "</script>");
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

    private void createList2(String listId,String moduleId,String text,String dateSetId) throws com.jb4dc.core.base.exception.JBuild4DCGenerallyException {
        listResourceService.deleteByKeyNotValidate(JB4DCSessionUtility.getInitSystemSession(),listId, JBuild4DCYaml.getWarningOperationCode());
        ListResourceEntityWithBLOBs listEntity=new ListResourceEntityWithBLOBs();
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
        listEntity.setListHtmlSource("<div class=\"html-design-theme-default-root-elem-class\" control_category=\"ContainerControl\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListTemplate\">\n" +
                "  <div class=\"wysiwyg-wldct-list-simple-search-outer-wrap wldct-list-simple-search-outer-wrap\" classname=\"\" clientresolve=\"\" control_category=\"ContainerControl\" desc=\"\" id=\"list_s_search_wrap_067546018\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"list_s_search_wrap_067546018\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListSimpleSearchContainer\">\n" +
                "    <div class=\"wysiwyg-auto-remove-tip\" runtime_auto_remove=\"true\">简单查询区域[双击编辑该部件],在下边div中编辑查询内容\n" +
                "    </div>\n" +
                "    <div class=\"wysiwyg-wldct-list-simple-search-inner-wrap wldct-list-simple-search-inner-wrap\">\n" +
                "      <table>\n" +
                "        <colgroup>\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "        </colgroup>\n" +
                "        <tbody>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">名称:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"用户名称\" columndatatypename=\"字符串\" columnname=\"F_USER_NAME\" columnoperator=\"like\" columntablename=\"TDEV_TEST_2\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_937577293\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937577293\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[用户名称](like)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">标题:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"标题\" columndatatypename=\"字符串\" columnname=\"F_TITLE\" columnoperator=\"like\" columntablename=\"TDEV_TEST_2\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_937590988\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937590988\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[标题](like)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">时间(从):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"发布时间\" columndatatypename=\"日期时间\" columnname=\"F_PUBLIC_TIME\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_2\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_937596948\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937596948\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[发布时间](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">(到):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"发布时间\" columndatatypename=\"日期时间\" columnname=\"F_PUBLIC_TIME\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_2\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_937609289\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_937609289\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[发布时间](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"gt_eq\" columntablename=\"TDEV_TEST_2\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_031092815\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031092815\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](gt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columnoperator=\"lt_eq\" columntablename=\"TDEV_TEST_2\" columntitle=\"\" control_category=\"InputControl\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_031106357\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_031106357\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_Search_TextBox\" style=\"\">[查询-单行输入框] 绑定:[排序号](lt_eq)\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody>\n" +
                "      </table>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "  <div class=\"wysiwyg-wldct-list-complex-search-outer-wrap wldct-list-complex-search-outer-wrap\" classname=\"\" clientresolve=\"\" control_category=\"ContainerControl\" desc=\"\" id=\"list_c_search_wrap_067490478\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"list_c_search_wrap_067490478\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListComplexSearchContainer\">\n" +
                "    <div class=\"wysiwyg-auto-remove-tip\" runtime_auto_remove=\"true\">弹出查询区域[双击编辑该部件],在下边div中编辑查询内容\n" +
                "    </div>\n" +
                "    <div class=\"wysiwyg-wldct-list-complex-search-inner-wrap wldct-list-complex-search-inner-wrap\">\n" +
                "      <table>\n" +
                "        <colgroup>\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "          <col style=\"width: 8%;\" />\n" +
                "          <col style=\"width: 17%;\" />\n" +
                "        </colgroup>\n" +
                "        <tbody>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">名称:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">标题:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">时间(从):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">(到):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">名称:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">标题:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">时间(从):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">(到):\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <td class=\"label\">排序从:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">排序到:\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td class=\"label\">\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody>\n" +
                "      </table>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "  <div class=\"wysiwyg-wldct-list-button-outer-wrap wldct-list-button-outer-wrap\" classname=\"\" clientresolve=\"\" control_category=\"ContainerControl\" desc=\"\" id=\"list_button_wrap_067574167\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"list_button_wrap_067574167\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListButtonContainer\">\n" +
                "    <div class=\"wysiwyg-auto-remove-tip\" runtime_auto_remove=\"true\">操作按钮区域[双击编辑该部件],在下边div中编辑操作按钮\n" +
                "    </div>\n" +
                "    <div class=\"wysiwyg-wldct-list-button-inner-wrap wldct-list-button-inner-wrap\">\n" +
                "      <table is-op-button-wrap-table=\"true\">\n" +
                "        <colgroup>\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "          <col style=\"width: 10%;\" />\n" +
                "        </colgroup>\n" +
                "        <tbody>\n" +
                "          <tr>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div bindauthority=\"notAuth\" buttoncaption=\"新增\" buttontype=\"ListFormButton\" class=\"wysiwyg-input-text\" classname=\"\" control_category=\"InputControl\" custclientclickbeforemethod=\"\" custclientclickbeforemethodpara=\"\" custclientrendereraftermethodpara=\"\" custclientrendereraftermethodparapara=\"\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custprop1=\"\" custprop2=\"\" custprop3=\"\" custprop4=\"\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" custsinglename=\"\" custurlappendpara=\"\" custurlappendparaformat=\"\" desc=\"\" formcode=\"100003\" formid=\"BuilderFormIdTest0001\" formmoduleid=\"BuilderModuleId001\" formmodulename=\"构建库-开发测试分组\" formname=\"构建库-开发测试窗体\" id=\"form_button_321027724\" innerbuttonjsonstring=\"[]\" is_jbuild4dc_data=\"true\" isshow=\"true\" jbuild4dc_custom=\"true\" name=\"form_button_321027724\" opentype=\"Dialog\" operation=\"add\" placeholder=\"\" serialize=\"false\" show_remove_button=\"true\" singlename=\"WLDCT_FormButton\" style=\"\" windowcaption=\"JBUILD4D\" windowheight=\"0\" windowwidth=\"0\">新增[窗体按钮]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div bindauthority=\"notAuth\" buttoncaption=\"修改\" buttontype=\"ListFormButton\" class=\"wysiwyg-input-text\" classname=\"\" control_category=\"InputControl\" custclientclickbeforemethod=\"\" custclientclickbeforemethodpara=\"\" custclientrendereraftermethodpara=\"\" custclientrendereraftermethodparapara=\"\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custprop1=\"\" custprop2=\"\" custprop3=\"\" custprop4=\"\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" custsinglename=\"\" custurlappendpara=\"\" custurlappendparaformat=\"\" desc=\"\" formcode=\"100003\" formid=\"BuilderFormIdTest0001\" formmoduleid=\"BuilderModuleId001\" formmodulename=\"构建库-开发测试分组\" formname=\"构建库-开发测试窗体\" id=\"form_button_321039610\" innerbuttonjsonstring=\"[]\" is_jbuild4dc_data=\"true\" isshow=\"true\" jbuild4dc_custom=\"true\" name=\"form_button_321039610\" opentype=\"Dialog\" operation=\"update\" placeholder=\"\" serialize=\"false\" show_remove_button=\"true\" singlename=\"WLDCT_FormButton\" style=\"\" windowcaption=\"JBUILD4D\" windowheight=\"640\" windowwidth=\"800\">修改[窗体按钮]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div bindauthority=\"notAuth\" buttoncaption=\"查看\" buttontype=\"ListFormButton\" class=\"wysiwyg-input-text\" classname=\"\" control_category=\"InputControl\" custclientclickbeforemethod=\"\" custclientclickbeforemethodpara=\"\" custclientrendereraftermethodpara=\"\" custclientrendereraftermethodparapara=\"\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custprop1=\"\" custprop2=\"\" custprop3=\"\" custprop4=\"\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" custsinglename=\"\" custurlappendpara=\"\" custurlappendparaformat=\"\" desc=\"\" formcode=\"100003\" formid=\"BuilderFormIdTest0001\" formmoduleid=\"BuilderModuleId001\" formmodulename=\"构建库-开发测试分组\" formname=\"构建库-开发测试窗体\" id=\"form_button_321068030\" innerbuttonjsonstring=\"[]\" is_jbuild4dc_data=\"true\" isshow=\"true\" jbuild4dc_custom=\"true\" name=\"form_button_321068030\" opentype=\"Dialog\" operation=\"view\" placeholder=\"\" serialize=\"false\" show_remove_button=\"true\" singlename=\"WLDCT_FormButton\" style=\"\" windowcaption=\"JBUILD4D\" windowheight=\"640\" windowwidth=\"800\">查看[窗体按钮]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody>\n" +
                "      </table>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "  <div class=\"wysiwyg-wldct-list-table-outer-wrap wldct-list-table-outer-wrap\" classname=\"\" clientresolve=\"\" control_category=\"ContainerControl\" desc=\"\" id=\"list_table_wrap_067614263\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"list_table_wrap_067614263\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WLDCT_ListTableContainer\">\n" +
                "    <div class=\"wysiwyg-auto-remove-tip\" runtime_auto_remove=\"true\">表格显示区域[双击编辑该部件],在下边div中编辑查询内容\n" +
                "    </div>\n" +
                "    <div class=\"wysiwyg-wldct-list-table-inner-wrap wldct-list-table-inner-wrap\">\n" +
                "      <table class=\"list-table\" is-op-button-wrap-table=\"true\">\n" +
                "        <thead>\n" +
                "          <tr>\n" +
                "            <th colspan=\"2\" rowspan=\"1\">组织&amp;用户\n" +
                "            </th>\n" +
                "            <th colspan=\"2\" rowspan=\"1\" style=\"background-color: rgb(0, 204, 255);\">标题&amp;发布时间\n" +
                "            </th>\n" +
                "            <th>排序号\n" +
                "            </th>\n" +
                "            <th colspan=\"2\" rowspan=\"1\">作者&amp;地址\n" +
                "            </th>\n" +
                "            <th colspan=\"1\" rowspan=\"2\">性别\n" +
                "            </th>\n" +
                "          </tr>\n" +
                "          <tr>\n" +
                "            <th>组织名称\n" +
                "            </th>\n" +
                "            <th>用户名称\n" +
                "            </th>\n" +
                "            <th>标题\n" +
                "            </th>\n" +
                "            <th>发布时间\n" +
                "            </th>\n" +
                "            <th>排序号\n" +
                "            </th>\n" +
                "            <th>作者\n" +
                "            </th>\n" +
                "            <th>地址\n" +
                "            </th>\n" +
                "          </tr>\n" +
                "        </thead>\n" +
                "        <tbody>\n" +
                "          <tr>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"组织名称\" columndatatypename=\"字符串\" columnname=\"F_ORGAN_NAME\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403647665\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403647665\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">组织名称[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"用户名称\" columndatatypename=\"字符串\" columnname=\"F_USER_NAME\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403660305\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403660305\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">用户名称[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"标题\" columndatatypename=\"字符串\" columnname=\"F_TITLE\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403667332\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403667332\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">标题[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"发布时间\" columndatatypename=\"日期时间\" columnname=\"F_PUBLIC_TIME\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403674108\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403674108\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">发布时间[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"排序号\" columndatatypename=\"整数\" columnname=\"F_ORDER_NUM\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403682914\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403682914\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">排序号[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"作者\" columndatatypename=\"字符串\" columnname=\"F_AUTHOR\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403687709\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403687709\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">作者[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"地址\" columndatatypename=\"字符串\" columnname=\"ADDRESS\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403716362\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403716362\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">地址[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "            <td>\n" +
                "              <div class=\"wysiwyg-input-text\" classname=\"\" columnalign=\"居中对齐\" columncaption=\"性别\" columndatatypename=\"字符串\" columnname=\"SEX\" columntablename=\"\" control_category=\"InputControl\" custclientrenderermethod=\"\" custclientrenderermethodpara=\"\" custdisabled=\"nodisabled\" custreadonly=\"noreadonly\" custserverresolvemethod=\"\" custserverresolvemethodpara=\"\" defaulttext=\"\" defaulttype=\"\" defaultvalue=\"\" desc=\"\" id=\"txt_search_403722147\" is_jbuild4dc_data=\"true\" jbuild4dc_custom=\"true\" name=\"txt_search_403722147\" placeholder=\"\" serialize=\"true\" show_remove_button=\"true\" singlename=\"WLDCT_ListTableLabel\" style=\"\" targetbuttonid=\"\">性别[默认值:]\n" +
                "              </div>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody>\n" +
                "      </table>\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>\n");
        listEntity.setListHtmlResolve("");
        listEntity.setListJsContent("<script>\n" +
                "var BuilderListPageRuntimeInstance={\n" +
                "    PageReady:function(){\n" +
                "        //页面加载html完成,未进行客户端控件的渲染\n" +
                "        console.log(\"页面加载html完成\");\n" +
                "    },\n" +
                "    RendererChainCompleted:function(){\n" +
                "        //客户端控件渲染完成.\n" +
                "        console.log(\"客户端控件渲染完成\");\n" +
                "    },\n" +
                "    RendererDataChainCompleted:function(){\n" +
                "        //客户端控件渲染并绑定完数据.\n" +
                "        console.log(\"客户端控件渲染并绑定完数据\");\n" +
                "    }\n" +
                "}\n" +
                "</script>");
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
