var WFDCT_RadioGroup={
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var dataSource=decodeURIComponent($singleControlElem.attr("datasource"));
        console.log(dataSource);
        dataSource=JsonUtility.JsonToString(dataSource);
        var defaultIsChecked=true;
        for (var i = 0; i < dataSource.length; i++) {
            var item=dataSource[i];
            var text=item.ITEXT;
            var value=item.IVALUE;

        }
    },
    RendererDataChain:function () {

    },
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus
}