var _ref_filePath=$("script").last().attr("src");
var WFDCT_CKEditor4={
    /*ResolveSelf:function (_rendererChainParas) {

    },*/
    RendererChain:function (_rendererChainParas) {
        //debugger;
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var areaHeight=$singleControlElem.height();
        //$singleControlElem.val("22222");
        //加载默认配置文件
        var filename=_ref_filePath.substr(_ref_filePath.lastIndexOf('/')+1);
        var editorConfigUrl = BaseUtility.AppendTimeStampUrl(_ref_filePath.replace(filename,$singleControlElem.attr("customconfig")));
        var ckeditorInstance=CKEDITOR.replace( $singleControlElem.attr("id"),{
            customConfig: editorConfigUrl
        });
        ckeditorInstance.config.height=areaHeight;
    },
    RendererDataChain:function () {

    },
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus
}