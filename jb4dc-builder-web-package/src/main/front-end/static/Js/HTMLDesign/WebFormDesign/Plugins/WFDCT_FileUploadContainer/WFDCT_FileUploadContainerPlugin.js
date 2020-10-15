/**
 * Created by zhuangrb on 2020/10/11
 */

(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});

    CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
        init: function(editor) {
            //点击确认时候指定的操作
            function addToEditor(ckEditor, pluginSetting, props, contentWindow){
                //var controlDescText=CKEditorPluginUtility.GetControlDescText(pluginSetting,props);
                var controlDescText="类型:【"+pluginSetting.ToolbarLabel+"】<br />上传类型:【"+props.normalProps.fileExType+"】<br />类别名称:【"+props.normalProps.categoryType+"】";
                //debugger;
                CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg("<div class='wysiwyg-container-text'>"+controlDescText+"</div>", pluginSetting, props, contentWindow);
            }
            //注册常规插件的操作
            CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting,addToEditor);
        }
    });
})("WFDCT_FileUploadContainer");

