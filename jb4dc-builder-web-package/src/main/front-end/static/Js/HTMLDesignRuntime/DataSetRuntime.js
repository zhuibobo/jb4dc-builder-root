var DataSetRuntime={
    GetDataSetData:function (config, func,sender) {
        var sendData = JSON.stringify(config);
        AjaxUtility.PostRequestBody("/Rest/Builder/RunTime/DataSetRuntime/GetDataSetData",sendData,function (getDataSetResult) {
            //console.log(getDataSetResult);
            //进行数据渲染1
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