var WFDCT_SimpleLabel={
    RendererChain:HTMLControl.RendererChain,
    RendererDataChain:HTMLControl.RendererDataChain,
    GetValue:HTMLControl.GetValue,
    SetValue:function ($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas) {
        //debugger;
        if(fieldPO) {
            //console.log(fieldPO);
            var defformat = $elem.attr("defformat");
            if(defformat=="yyyy-MM-dd"){
                var ctValue=fieldPO.value;
                if(ctValue) {
                    var ctDate = DateUtility.ConvertFromString(ctValue);
                    //console.log(fieldPO);
                    ctValue = DateUtility.Format(ctDate, defformat);
                }
                $elem.text(ctValue);
                $elem.attr("control_value", ctValue);
                $elem.attr("control_source_value", fieldPO.value);
            }
            else{
                $elem.text(fieldPO.value);
                $elem.attr("control_value", fieldPO.value);
                $elem.attr("control_source_value", fieldPO.value);
            }
        }
    }
}