(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});
    CKEditorPluginUtility.Plugins[pluginName].GetTipMessage=function(){
        return "隐藏区域,该区域将自动在运行时隐藏";
    };
    CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate=function(tipMsg,addDefProp) {
        var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel(tipMsg);
        var template=`<div class="wysiwyg-wldct-hide-outer-wrap wldct-list-hide-outer-wrap">${tip}<div class="wysiwyg-wldct-hide-inner-wrap wldct-list-hide-inner-wrap">
                            <table>
                                <tr>
                                    <td style="width: 20%;"></td>
                                    <td style="width: 20%;"></td>
                                    <td style="width: 20%;"></td>
                                    <td style="width: 20%;"></td>
                                    <td style="width: 20%;"></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>`;
        //console.log(template);
        if(addDefProp){
            template=$(template);
            CKEditorPluginUtility.TemplateAddDefProp(template,"list_hide_wrap_"+StringUtility.Timestamp(),"false","WLDCT_HideContainer","enable");
            return template.outerHTML();
        }
        return template;
    }
    if(CKEditorPluginUtility.Plugins[pluginName].Setting) {
        CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
            init: function (editor) {
                //点击确认时候指定的操作
                function addToEditor(ckEditor, pluginSetting, props, contentWindow) {
                    //var controlDescText=CKEditorPluginUtility.GetControlDescText(pluginSetting,props);
                    var tip =CKEditorPluginUtility.Plugins[pluginName].GetTipMessage();
                    CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg(CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate(tip, false), pluginSetting, props, contentWindow);
                }

                //注册常规插件的操作
                CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting, addToEditor);
            }
        });
    }
})("WLDCT_HideContainer");
