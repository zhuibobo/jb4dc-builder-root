var ControlStatusUtility={
    DisableAtUpdateStatus:function (webFormRTParas,controlId){
        //debugger;
        if(webFormRTParas.OperationType==BaseUtility.GetUpdateOperationName()){
            $("#"+controlId).attr("disabled","disabled");
        }
    }
}