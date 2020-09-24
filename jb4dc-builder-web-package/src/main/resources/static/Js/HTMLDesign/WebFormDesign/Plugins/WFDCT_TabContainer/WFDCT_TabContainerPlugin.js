(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});
    CKEditorPluginUtility.Plugins[pluginName].GetTipMessage=function(){
        return "Tabs选显卡,该区域将自动在运行时隐藏";
    };
    CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate=function(tipMsg,addDefProp) {
        var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel(tipMsg);
        var template=`<div class="wysiwyg-wfdct-tabs-outer-wrap wfdct-tabs-outer-wrap-runtime">${tip}
                        <div class="wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime" tab_id="tab_content_1_1">
                            基础信息
                        </div>
                        <div class="wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime" id="tab_content_1_1">
                        
                        </div>
                        <div class="wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime" tab_id="tab_content_1_2">
                            扩展信息
                        </div>
                        <div class="wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime" id="tab_content_1_2">
                        </div>
                        <div class="wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime" tab_id="tab_content_1_3">
                            相关附件
                        </div>
                        <div class="wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime" id="tab_content_1_3">
                        </div>
                    </div>`;

        if(addDefProp){
            template=$(template);
            CKEditorPluginUtility.TemplateAddDefProp(template,"list_hide_wrap_"+StringUtility.Timestamp(),"false","WFDCT_HideContainer","enable");
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
})("WFDCT_TabContainer");
