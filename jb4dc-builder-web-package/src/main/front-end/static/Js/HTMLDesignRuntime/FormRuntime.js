let FormRuntime={
    _Prop_Status:"Edit",
    _Prop_Config:{
        RendererToId:null,
        FormId:"",
        RecordId:"",
        ButtonId:"",
        IsPreview:false
    },
    _$RendererToElem:null,
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$("#"+this._Prop_Config.RendererToId);
        this._LoadHTMLToEl();
    },
    //用于控制BuilderListPageRuntimeInstance.RendererChainComplete的调用时间
    _RendererChainIsCompleted:true,
    _RendererDataChainIsCompleted:true,
    _LoadHTMLToEl:function () {
        //debugger;
        /*$(this._Prop_Config.RendererTo).loadHtmlDesignContent(BaseUtility.GetRootPath()+"/Rest/Builder/FormRuntime/FormPreview?formId="+this._Prop_Config.FormId, function() {
            //alert( "Load was performed." );
            console.log("加载预览窗体成功!!");
        });*/
        RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/FormRuntime/LoadHTML",this._Prop_Config.RendererTo, {
            formId:this._Prop_Config.FormId,
            recordId:this._Prop_Config.RecordId,
            buttonId:this._Prop_Config.ButtonId
        }, function (result) {
            //alert( "Load was performed.");
            console.log("加载预览窗体成功!!");
            //console.log(result);
            //console.log(result.data.formHtmlRuntime);
            //var $rootElem=$(result.data.formHtmlRuntime);
            //if($rootElem.)
            console.log(result);
            this._$RendererToElem.append(result.data.formHtmlRuntime);
            //VirtualBodyControl.RendererChain(result.data.formHtmlRuntime,this._$RendererToElem,this._$RendererToElem);

            //进行元素渲染
            VirtualBodyControl.RendererChain({
                listEntity:result.data,
                sourceHTML:result.data.formHtmlRuntime,
                $rootElem:this._$RendererToElem,
                $parentControlElem:this._$RendererToElem,
                $singleControlElem:this._$RendererToElem,
                listRuntimeInstance:this
            });
        },this);
    }
}