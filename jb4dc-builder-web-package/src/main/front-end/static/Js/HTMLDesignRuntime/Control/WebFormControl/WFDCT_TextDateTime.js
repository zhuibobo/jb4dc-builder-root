var WFDCT_TextDateTime= {
    RendererChain: function (_rendererChainParas) {
        //debugger;
        //var $singleControlElem=_rendererChainParas.$singleControlElem;
        //$singleControlElem.val("22222");
    },
    RendererDataChain: HTMLControl.RendererDataChain,
    GetValue: HTMLControl.GetValue,
    SetValue: function ($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
        //debugger;
        //alert($elem.attr("datetimeformat"));
        if (fieldPO) {
            var ctValue=fieldPO.value;
            var ctDate=DateUtility.ConvertFromString(ctValue);
            //console.log(fieldPO);
            ctValue=DateUtility.Format(ctDate,$elem.attr("datetimeformat"));
            $elem.val(ctValue);
            $elem.attr("control_value", ctValue);
            $elem.attr("control_time_value", fieldPO.value);
        }
    }
}