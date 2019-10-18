var WFDCT_SimpleLabel={
    RendererChain:HTMLControl.RendererChain,
    RendererDataChain:HTMLControl.RendererDataChain,
    GetValue:HTMLControl.GetValue,
    SetValue:function ($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas) {
        //debugger;
        if(fieldPO){
            //console.log(fieldPO);
            $elem.text(fieldPO.value);
            $elem.attr("control_value",fieldPO.value);
        }
    }
}