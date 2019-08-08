/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2019/5/6
**To change this template use File | Settings | File Templates.
*/
var ListRuntime={
    _Prop_Status:"Edit",
    _Prop_Config:{
        RendererToId:null,
        ListId:""
    },
    _$RendererToElem:null,
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$("#"+this._Prop_Config.RendererToId);
        this._LoadHTMLToEl();
    },
    _LoadHTMLToEl:function () {
        //debugger;
        /*$(this._Prop_Config.RendererTo).load(BaseUtility.GetRootPath()+"/Rest/Builder/ListRuntime/ListPreview?listId="+this._Prop_Config.ListId, function() {
            console.log("加载预览列表成功!!");
        });*/
        RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath()+"/Rest/Builder/ListRuntime/ListPreview?listId="+this._Prop_Config.ListId,this._Prop_Config.RendererTo, {}, function (result) {
            //alert( "Load was performed.");
            //debugger;
            console.log("加载预览窗体成功!!");
            console.log(result);
            //console.log(result.data.listHtmlRuntime);
            //var $rootElem=$(result.data.formHtmlRuntime);
            //if($rootElem.)
            this._$RendererToElem.append(result.data.listHtmlRuntime);
            VirtualBodyControl.RendererChain(result.data.listHtmlRuntime,this._$RendererToElem,this._$RendererToElem);
        },this);
    }
}