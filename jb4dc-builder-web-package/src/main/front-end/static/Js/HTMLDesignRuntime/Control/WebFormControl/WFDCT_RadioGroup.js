var WFDCT_RadioGroup={
    radioGroupName:"",
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var dataSource=decodeURIComponent($singleControlElem.attr("datasource"));
        //console.log(dataSource);
        dataSource=JsonUtility.StringToJson(dataSource);
        var defaultIsChecked=true;
        $singleControlElem.hide();

        var radioGroupDiv=$("<div class='radioGroupContainer' />");
        var defaultSelected=$singleControlElem.attr("defaultselected");
        this.radioGroupName="radioGroupName_"+$singleControlElem.attr("id");
        var rownum=$singleControlElem.attr("rownum");
        for (var i = 0; i < dataSource.length; i++) {
            var item=dataSource[i];
            var text=item.ITEXT;
            var value=item.IVALUE;
            //console.log(text);
            var newRow=false;
            if(rownum>1){
                newRow=(((i)%rownum)==0);
            }

            if(text!="--请选择--") {
                var itemRadio = $("<input type='radio' name='" + this.radioGroupName + "' />");
                itemRadio.val(value);
                if(value==defaultSelected){
                    itemRadio.prop("checked",true);
                }
                radioGroupDiv.append(itemRadio);
                radioGroupDiv.append("<span>" + text + "</span>");
                if(newRow){
                    radioGroupDiv.append("<br />");
                }
            }
            //$singleControlElem
        }
        $singleControlElem.after(radioGroupDiv);
    },
    RendererDataChain:function () {

    },
    GetValue:function ($elem,originalData, paras) {
        //console.log(this.radioGroupName);
        originalData.value=$("[name='"+this.radioGroupName+"']:checked").val();
        //console.log(originalData.value);
        return originalData;
    },
    SetValue:function ($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas) {
        //debugger;
        if(fieldPO){
            //console.log(fieldPO);
            $elem.val(fieldPO.value);
            $elem.attr("control_value",fieldPO.value);
            $("[name='"+this.radioGroupName+"'][value='"+fieldPO.value+"']").prop("checked",true);
        }
    },
    ToViewStatus:function($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas){
        $("[name='"+this.radioGroupName+"']").parent().remove();
        var oldAllAttrs=BaseUtility.GetElemAllAttr($elem);
        var $viewElem=$("<label />");
        $viewElem.attr(oldAllAttrs);
        $viewElem.removeClass();
        $viewElem.show();
        $viewElem.text($elem.val());
        $elem.replaceWith($viewElem);
    }
}