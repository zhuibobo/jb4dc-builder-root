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
        ListId:"",
        IsPreview:false
    },
    _ListPO:null,
    _$RendererToElem:null,
    _JSRuntimeInst:null,
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$("#"+this._Prop_Config.RendererToId);
        this._LoadHTMLToEl();
    },
    //用于控制RendererChainComplete的调用时间
    _RendererChainIsCompleted:true,
    _RendererDataChainIsCompleted:true,
    _LoadHTMLToEl:function () {
        //debugger;
        /*$(this._Prop_Config.RendererTo).load(BaseUtility.GetRootPath()+"/Rest/Builder/ListRuntime/ListPreview?listId="+this._Prop_Config.ListId, function() {
            console.log("加载预览列表成功!!");
        });*/
        //window._ListInstancePool={};
        RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath()+"/Rest/Builder/RunTime/ListRuntime/LoadHTML?listId="+this._Prop_Config.ListId,this._Prop_Config.RendererTo, {}, function (result) {
            //alert( "Load was performed.");
            //debugger;
            //console.log("加载列表设置成功!!");
            console.log(result);

            //console.log(result.data.listHtmlRuntime);
            //var $rootElem=$(result.data.formHtmlRuntime);
            //if($rootElem.)
            //str = str.replace(/word/g,"Excel")
            var _self=this;
            _self._ListPO=result.data;
            this._$RendererToElem.append(result.data.listHtmlRuntime);
            //this._$RendererToElem.append(result.data.listJsRuntime);
            this._JSRuntimeInst = Object.create(HTMLJSRuntime);
            this._JSRuntimeInst.Initialization({},this._$RendererToElem,this._ListPO.listJsContent);
            //console.log(result.data.listJsRuntime);

            //进行元素渲染
            VirtualBodyControl.RendererChain({
                po:result.data,
                sourceHTML:result.data.listHtmlRuntime,
                $rootElem:this._$RendererToElem,
                $parentControlElem:this._$RendererToElem,
                $singleControlElem:this._$RendererToElem,
                listRuntimeInstance:this
            });

            var RendererChainCompleteObj=window.setInterval(function () {
                if(_self._RendererChainIsCompleted){
                    window.clearInterval(RendererChainCompleteObj);
                }
            },500);

            //获取绑定的数据集合之后
            var topDataSetId=result.data.listDatasetId;
            VirtualBodyControl.RendererDataChain({
                po:result.data,
                sourceHTML:result.data.listHtmlRuntime,
                $rootElem:this._$RendererToElem,
                $parentControlElem:this._$RendererToElem,
                $singleControlElem:this._$RendererToElem,
                topDataSetId:topDataSetId,
                listRuntimeInstance:this
            });

            var RendererDataChainCompleteObj=window.setInterval(function () {
                if(_self._RendererDataChainIsCompleted){
                    window.clearInterval(RendererDataChainCompleteObj);
                    _self.CallRendererChainCompletedFunc();
                }
            },700);
            /*var sendData = JSON.stringify({
                dataSetId:topDataSetId,
                pageSize:result.data.listDatasetPageSize,
                pageNum:1,
                queryValue:"",
                exValue1:"",
                exValue2:"",
                exValue3:""
            });
            AjaxUtility.PostRequestBody("/Rest/Builder/RunTime/ListRuntime/GetDataSetData",sendData,function (getDataSetResult) {
                console.log(getDataSetResult);
                //进行数据渲染
                VirtualBodyControl.RendererDataChain({
                    listEntity:result.data,
                    sourceHTML:result.data.listHtmlRuntime,
                    $rootElem:this._$RendererToElem,
                    $parentControlElem:this._$RendererToElem,
                    $singleControlElem:this._$RendererToElem,
                    topDataSet:getDataSetResult.data
                });
            },this);*/

        },this);
    },
    CallRendererChainCompletedFunc:function() {
        if (typeof (this._Prop_Config.RendererChainCompletedFunc) == "function") {
            this._Prop_Config.RendererChainCompletedFunc.call(this);
        }
        HTMLPageObjectInstanceProxy.Init(this._Prop_Config,this._ListPO);
        window.setTimeout(function () {
            console.log("延迟调用");
            HTMLPageObjectInstanceProxy.CallPageReady()
        },500);
    },
    CheckPrimaryKeyInDataSet:function(dataSet,primaryKey){
        if(dataSet.list&&dataSet.list.length>0){
            var rowData=dataSet.list[0];
            for(var key in rowData){
                if(StringUtility.toUpperCase(key)==StringUtility.toUpperCase(primaryKey)){
                    return true;
                }
            }
        }
        return false;
    },
    GetPrimaryKey:function(){
        var primaryKey=this._ListPO.listDatasetPrimaryKey;
        return primaryKey;
    },
    IsPreview:function () {
        return this._Prop_Config.IsPreview;
    }
}
