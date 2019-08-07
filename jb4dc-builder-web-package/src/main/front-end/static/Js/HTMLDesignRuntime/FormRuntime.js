let FormRuntime={
    _Prop_Status:"Edit",
    _Prop_Config:{
        RendererToId:null,
        FormId:""
    },
    _$RendererToElem:null,
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$("#"+this._Prop_Config.RendererToId);
        this._LoadHTMLToEl();
    },
    _LoadHTMLToEl:function () {
        //debugger;
        /*$(this._Prop_Config.RendererTo).loadHtmlDesignContent(BaseUtility.GetRootPath()+"/Rest/Builder/FormRuntime/FormPreview?formId="+this._Prop_Config.FormId, function() {
            //alert( "Load was performed." );
            console.log("加载预览窗体成功!!");
        });*/
        RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath() + "/Rest/Builder/FormRuntime/FormPreview?formId=" + this._Prop_Config.FormId,this._Prop_Config.RendererTo, {}, function (result) {
            //alert( "Load was performed.");
            console.log("加载预览窗体成功!!");
            //console.log(result);
            console.log(result.data.formHtmlRuntime);
            //var $rootElem=$(result.data.formHtmlRuntime);
            //if($rootElem.)
            this._$RendererToElem.append(result.data.formHtmlRuntime);
            VirtualBodyControl.RendererChain(result.data.formHtmlRuntime,this._$RendererToElem,this._$RendererToElem);
        },this);
    }
}