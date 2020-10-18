var WFDCT_TextBox={
    InitStyle:HTMLControl.InitStyle,
    RendererChain:function (_rendererChainParas) {
        //debugger;
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        $singleControlElem.attr("autocomplete","off");
        //$singleControlElem.val("22222");
    },
    RendererDataChain:function () {

    },
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus
}