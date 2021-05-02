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

        if(BaseUtility.IsViewOperation(_rendererChainParas.formRuntimeInstance.GetOperationType())) {

        }
        else {
            var filename = _ref_filePath.substr(_ref_filePath.lastIndexOf('/') + 1);

            var editorConfigUrl = BaseUtility.AppendTimeStampUrl(_ref_filePath.replace(filename, "Control/WebFormControl/"+$singleControlElem.attr("customconfig")));
            console.log(editorConfigUrl);
            //editorConfigUrl=1;
            this.ckeditorInstance = CKEDITOR.replace($singleControlElem.attr("id"), {
                customConfig: editorConfigUrl,
                formRuntimeInstance:_rendererChainParas.formRuntimeInstance
            });
            this.ckeditorInstance.config.height = areaHeight;
            //console.log(this.ckeditorInstance.config.plugins);
        }
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
            //console.log(fieldPO);1
            $elem.val(fieldPO.value);
            $elem.attr("control_value",fieldPO.value);
        }
    },
    ToViewStatus:function($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas){
        //var htmlData=this.ckeditorInstance.getData();
        //console.log(htmlData);
        //debugger;
        var $viewElem=$("<div></div>");
        var oldAllAttrs=BaseUtility.GetElemAllAttr($elem);
        $viewElem.attr(oldAllAttrs);
        $viewElem.removeClass();
        $viewElem.html(fieldPO.value);
        $viewElem.css("overflow","auto");
        $viewElem.height($viewElem.height()+100);
        $elem.replaceWith($viewElem);
    }
}