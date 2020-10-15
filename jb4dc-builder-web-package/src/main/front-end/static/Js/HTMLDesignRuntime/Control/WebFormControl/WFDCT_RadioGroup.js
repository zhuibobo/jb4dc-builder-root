var WFDCT_RadioGroup={
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var dataSource=decodeURIComponent($singleControlElem.attr("datasource"));
        //console.log(dataSource);
        dataSource=JsonUtility.StringToJson(dataSource);
        var defaultIsChecked=true;
        $singleControlElem.hide();

        var radioGroupDiv=$("<div class='radioGroupContainer' />");
        var defaultSelected=$singleControlElem.attr("defaultselected");
        for (var i = 0; i < dataSource.length; i++) {
            var item=dataSource[i];
            var text=item.ITEXT;
            var value=item.IVALUE;
            //console.log(text);
            if(text!="--请选择--") {
                var itemRadio = $("<input type='radio' name='" + $singleControlElem.attr("id") + "' />");
                itemRadio.val(value);
                if(value==defaultSelected){
                    itemRadio.attr("checked","checked");
                }
                radioGroupDiv.append(itemRadio);
                radioGroupDiv.append("<span>" + text + "</span>");
            }
            //$singleControlElem
        }
        $singleControlElem.after(radioGroupDiv);
    },
    RendererDataChain:function () {

    },
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus
}