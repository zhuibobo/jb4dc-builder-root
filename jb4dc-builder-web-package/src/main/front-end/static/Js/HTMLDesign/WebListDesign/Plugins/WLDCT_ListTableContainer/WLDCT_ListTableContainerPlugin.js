(function(pluginName){

    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});
    /**
     * @return {string}
     */
    CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate=function(tipMsg) {
        var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel(tipMsg);
        return `<div class="wysiwyg-wldct-list-table-outer-wrap wldct-list-table-outer-wrap">${tip}<div class="wysiwyg-wldct-list-table-inner-wrap wldct-list-table-inner-wrap wldct-list-table-row-button-wrap">
                     <table is-op-button-wrap-table="true" class="list-table">
                         <thead>
                             <tr>
                                 <th></th>
                                 <th></th>
                                 <th></th>
                                 <th></th>
                                 <th></th>
                                 <th></th>
                                 <th></th>
                                 <th></th>
                                 <th>操作按钮</th>
                             </tr>
                         </thead>
                         <tbody>
                             <tr>
                                 <td></td>
                                 <td></td>
                                 <td></td>
                                 <td></td>
                                 <td></td>
                                 <td></td>
                                 <td></td>
                                 <td></td>
                                 <td style="width: 120px">
                                    <table class="wysiwyg-table-inner-button-wrap">
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </table> 
                                </td>
                             </tr>
                         </tbody>
                     </table>
                 </div>
              </div>`
    };
    if(CKEditorPluginUtility.Plugins[pluginName].Setting) {
        CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
            init: function (editor) {
                //点击确认时候指定的操作
                function addToEditor(ckEditor, pluginSetting, props, contentWindow) {
                    //var controlDescText=CKEditorPluginUtility.GetControlDescText(pluginSetting,props);
                    //var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel("表格显示区域[双击编辑该部件],在下边div中编辑查询内容");
                    var tip = "表格显示区域[双击编辑该部件],在下边div中编辑查询内容";
                    CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg(CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate(tip), pluginSetting, props, contentWindow);
                }

                //注册常规插件的操作
                CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting, addToEditor);
            }
        });
    }
})("WLDCT_ListTableContainer");
