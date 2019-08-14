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
        RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath()+"/Rest/Builder/RunTime/ListRuntime/ListPreview?listId="+this._Prop_Config.ListId,this._Prop_Config.RendererTo, {}, function (result) {
            //alert( "Load was performed.");
            //debugger;
            console.log("加载列表设置成功!!");
            console.log(result);

            //console.log(result.data.listHtmlRuntime);
            //var $rootElem=$(result.data.formHtmlRuntime);
            //if($rootElem.)
            this._$RendererToElem.append(result.data.listHtmlRuntime);

            //进行元素渲染
            VirtualBodyControl.RendererChain({
                listEntity:result.data,
                sourceHTML:result.data.listHtmlRuntime,
                $rootElem:this._$RendererToElem,
                $parentControlElem:this._$RendererToElem,
                $singleControlElem:this._$RendererToElem
            });

            //获取绑定的数据集合之后
            var topDataSetId=result.data.listDatasetId;
            VirtualBodyControl.RendererDataChain({
                listEntity:result.data,
                sourceHTML:result.data.listHtmlRuntime,
                $rootElem:this._$RendererToElem,
                $parentControlElem:this._$RendererToElem,
                $singleControlElem:this._$RendererToElem,
                topDataSetId:topDataSetId
            });
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
    }
}