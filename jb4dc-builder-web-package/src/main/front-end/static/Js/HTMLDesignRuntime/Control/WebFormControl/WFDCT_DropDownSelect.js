var WFDCT_DropDownSelect={
    InitStyle:HTMLControl.InitStyle,
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var defaultSelected=$singleControlElem.attr("defaultselected");
        //debugger;
        if(defaultSelected){
            $singleControlElem.val(defaultSelected);
        }
    },
    RendererDataChain:HTMLControl.RendererDataChain,
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus,
    TryBindUrlValue:HTMLControl.TryBindUrlValue
}