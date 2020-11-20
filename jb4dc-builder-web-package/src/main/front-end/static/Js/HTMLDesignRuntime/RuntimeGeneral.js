var RuntimeGeneralInstance= {
    _Ajax:function(url,params,callback,sender){
        jQuery.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: params
        }).done(function (result) {
            //console.log(result);

            //console.log(responseText);
            //$(appendToElemId).html(responseText)
            // Save response for use in complete callback
            //response = arguments;

            //self.html( selector ?

            // If a selector was specified, locate the right elements in a dummy div
            // Exclude scripts to avoid IE 'Permission Denied' errors
            //jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

            // Otherwise use the full result
            //responseText );

            // If the request succeeds, this function gets "data", "status", "jqXHR"
            // but they are ignored because response was set above.
            // If it fails, this function gets "jqXHR", "status", "error"
            if(!result.success){
                var message=result.message;
                if(StringUtility.IsNullOrEmpty(message)){
                    message=result.traceMsg;
                }
                DialogUtility.AlertText(message,sender);
            }
            callback.call(sender, result);
        }).always(callback && function (jqXHR, status) {
            /*self.each( function() {
                callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
            } );*/
        });
    },
    LoadHtmlDesignContent: function (url, appendToElemId, params, callback, sender) {
        this._Ajax(url,params,callback,sender);
    },
    LoadInnerFormButton:function (listFormButtonId,params,callback,sender) {
        var url=BaseUtility.BuildAction("/Rest/Builder/RunTime/ListButtonRuntime/GetButtonPO", {
            buttonId: listFormButtonId
        });
        this._Ajax(url,params,callback,sender);
    },
    SubmitFormDataComplexPOListToServer:function (formDataComplexPO,recordId,innerFormButtonId,listButtonId,operationType,callback,sender) {
        var url = BaseUtility.BuildAction("/Rest/Builder/RunTime/InnerFormButtonRuntime/ReceiveHandler", {});
        var params = {
            "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPO)),
            "innerFormButtonId": innerFormButtonId,
            "listButtonId": listButtonId,
            "recordId": recordId,
            "operationTypeName":operationType
        };
        this._Ajax(url, params, callback, sender);
        console.log(formDataComplexPO);
    },
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
    },
    GetUrlParas:function () {
        //debugger
        if(this["menuRightUrlParaJson"]){
            return this["menuRightUrlParaJson"];
        }
        else{
            var paraStr=BaseUtility.GetUrlParaValue("menuRightUrlPara");
            if(StringUtility.IsNullOrEmpty(paraStr)){
                return "";
            }
            if(paraStr.charAt(0)=="{"||paraStr.charAt(0)=="["){
                try {
                    var json=JsonUtility.StringToJson(paraStr);
                    return json;
                }
                catch (e) {

                }
            }
            this["menuRightUrlParaJson"]=paraStr;
            return paraStr;
        }
    },
    TryGetUrlParaValueByFieldName:function (actionName,fieldName) {
        var paraJson=this.GetUrlParas();
        if(paraJson&&typeof(paraJson)!="string"){
            for (var i = 0; i < paraJson.length; i++) {
                var singlePara=paraJson[i];
                if(singlePara.ActionType==actionName&&singlePara.FieldName==fieldName){
                    return singlePara.Value;
                }
            }
        }
        return "";
    },
    TryGetUrlParaChangeMainDataSetId:function () {
        //debugger;
        var paraJson=this.GetUrlParas();
        if(paraJson&&typeof(paraJson)!="string"){
            for (var i = 0; i < paraJson.length; i++) {
                var singlePara=paraJson[i];
                if(singlePara.ActionType=="ChangeMainDataSet"){
                    return singlePara.DataSetId;
                }
            }
        }
        return "";
    },
    TryGetUrlParaViewOnly:function () {
        var paraJson=this.GetUrlParas();
        if(paraJson&&typeof(paraJson)!="string"){
            for (var i = 0; i < paraJson.length; i++) {
                var singlePara=paraJson[i];
                if(singlePara.ActionType=="ViewOnly"){
                    return true;
                }
            }
        }
        return false;
    },
    TryGetMenuOuterId:function () {
        return BaseUtility.GetUrlParaValue("menuOuterId");
    }
}