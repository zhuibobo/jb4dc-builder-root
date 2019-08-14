var DataSetRuntime={
    GetDataSetData:function (config, func,sender) {
        var sendData = JSON.stringify(config);
        AjaxUtility.PostRequestBody("/Rest/Builder/RunTime/ListRuntime/GetDataSetData",sendData,function (getDataSetResult) {
            //console.log(getDataSetResult);
            //进行数据渲染
            /*VirtualBodyControl.RendererDataChain({
                listEntity:result.data,
                sourceHTML:result.data.listHtmlRuntime,
                $rootElem:this._$RendererToElem,
                $parentControlElem:this._$RendererToElem,
                $singleControlElem:this._$RendererToElem,
                topDataSet:getDataSetResult.data
            });*/
            func.call(sender,getDataSetResult);
        },sender);
    }
}