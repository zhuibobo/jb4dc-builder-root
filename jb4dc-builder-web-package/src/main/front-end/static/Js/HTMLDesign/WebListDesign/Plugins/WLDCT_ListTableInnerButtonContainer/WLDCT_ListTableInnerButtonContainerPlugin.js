(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});
    CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate=function(tipMsg,addDefProp) {
        var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel(tipMsg);
        var template=`<div class="wysiwyg-wldct-list-table-inner-button-outer-wrap">${tip}
                        <div class="wysiwyg-wldct-list-table-inner-button-inner-wrap">
                            <table is-inner-op-button-wrap-table="true">
                                <colgroup>
                                    <col style="width: 33%" />
                                    <col style="width: 33%" />
                                    <col style="width: 33%" />
                                </colgroup>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>`;
        if(addDefProp){
            template=$(template);
            CKEditorPluginUtility.TemplateAddDefProp(template,"list_inner_table_button_wrap_"+StringUtility.Timestamp(),"false","WLDCT_ListTableInnerButtonContainer","enable");
            return template.outerHTML();
        }
        return template;
    };
    if(CKEditorPluginUtility.Plugins[pluginName].Setting) {
        CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
            init: function (editor) {
                //点击确认时候指定的操作
                function addToEditor(ckEditor, pluginSetting, props, contentWindow) {
                    //var controlDescText=CKEditorPluginUtility.GetControlDescText(pluginSetting,props);
                    //var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel("操作按钮区域");
                    var tip = "操作按钮区域";
                    CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg(CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate(tip, false), pluginSetting, props, contentWindow);
                    /*CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg("<div class=\"wysiwyg-wldct-list-table-inner-button-outer-wrap\">"+tip+
                        "<div class=\"wysiwyg-wldct-list-table-inner-button-inner-wrap\">" +
                        "    <table is-inner-op-button-wrap-table=\"true\">" +
                        "        <colgroup>" +
                        "            <col style=\"width: 33%\" />" +
                        "            <col style=\"width: 33%\" />" +
                        "            <col style=\"width: 33%\" />" +
                        "        </colgroup>" +
                        "        <tr>" +
                        "            <td></td>" +
                        "            <td></td>" +
                        "            <td></td>" +
                        "        </tr>" +
                        "    </table>" +
                        "</div>"+
                        "</div>", pluginSetting, props, contentWindow);*/
                }

                //注册常规插件的操作
                CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting, addToEditor);
            }
        });
    }
})("WLDCT_ListTableInnerButtonContainer");
