let FormJSRuntime={
    _Prop_Config:{
    },
    _$RendererToElem:null,
    _FormPO:null,
    _ReplaceContextPath:function(source){
        var contextPath=BaseUtility.GetRootPath();
        return source.replaceAll("${contextPath}",contextPath);
    },
    _ReplaceTimeStamp:function(source){
        var timestamp=new Date().getTime();
        return source.replaceAll("${timeStamp}",timestamp);
    },
    ReplaceJSParas:function(source){
        var resultJs=this._ReplaceContextPath(source);
        resultJs=this._ReplaceTimeStamp(resultJs);
        return resultJs;
    },
    Initialization:function (_config,$rendererToElem,formPO) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$rendererToElem;
        this._FormPO=formPO;
        this._LoadJSToEl()
    },
    _LoadJSToEl:function () {
        console.log("引入脚本:")
        console.log(this._FormPO.formJsContent);
        this._$RendererToElem.append(this.ReplaceJSParas(this._FormPO.formJsContent));
        if(!FormPageObjectInstance){
            throw "引入顺序错误!";
        }
        FormPageObjectInstance.formEntity=this._FormPO;
        console.log(FormPageObjectInstance.formEntity);
        //alert(1);
    }
}