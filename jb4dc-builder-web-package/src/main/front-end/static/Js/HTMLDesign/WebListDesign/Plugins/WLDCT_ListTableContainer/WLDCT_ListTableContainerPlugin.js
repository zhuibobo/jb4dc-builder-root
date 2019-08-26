(function(pluginName){

    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});
    /**
     * @return {string}
     */
    CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate=function(tipMsg,addDefProp) {
        var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel(tipMsg);
        var template=`<div class="wysiwyg-wldct-list-table-outer-wrap wldct-list-table-outer-wrap">${tip}<div class="wysiwyg-wldct-list-table-inner-wrap wldct-list-table-inner-wrap">
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
                                 <th>操作</th>
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
                                </td>
                             </tr>
                         </tbody>
                     </table>
                 </div>
              </div>`
        if(addDefProp){
            template=$(template);
            template.attr("classname","");
            template.attr("control_category","ContainerControl");
            template.attr("custdisabled","nodisabled");
            template.attr("custreadonly","noreadonly");
            template.attr("desc","");
            template.attr("id","list_table_wrap_788954467");
            template.attr("is_jbuild4dc_data","false");
            template.attr("jbuild4dc_custom","true");
            template.attr("name","list_table_wrap_788954467");
            template.attr("placeholder","");
            template.attr("serialize","false");
            template.attr("show_remove_button","false");
            template.attr("singlename","WLDCT_ListTableContainer");
            template.attr("style","");
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
                    //var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel("表格显示区域[双击编辑该部件],在下边div中编辑查询内容");
                    var tip = "表格显示区域[双击编辑该部件],在下边div中编辑查询内容";
                    CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg(CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate(tip,false), pluginSetting, props, contentWindow);
                }

                //注册常规插件的操作
                CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting, addToEditor);
            }
        });
    }
})("WLDCT_ListTableContainer");
