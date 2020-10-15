var _ref_filePath=$("script").last().attr("src");
var WFDCT_CKEditor4={
    ckeditorInstance:null,
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
        this.ckeditorInstance=CKEDITOR.replace( $singleControlElem.attr("id"),{
            customConfig: editorConfigUrl
        });
        this.ckeditorInstance.config.height=areaHeight;
    },
    RendererDataChain:function () {

    },
    GetValue:function ($elem,originalData, paras) {
        originalData.value=this.ckeditorInstance.getData();
        //console.log(originalData.value);
        return originalData;
    },
    SetValue:function ($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas) {
        //debugger;
        if(fieldPO){
            //console.log(fieldPO);
            $elem.val(fieldPO.value);
            $elem.attr("control_value",fieldPO.value);
        }
    },
    ToViewStatus:HTMLControl.ToViewStatus
}