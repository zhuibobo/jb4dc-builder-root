var WFDCT_RadioGroup={
    radioGroupName:"",
    radioGroupWrapId:"",
    level2BindControlId:"",
    InitStyle:HTMLControl.InitStyle,
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var dataSource=decodeURIComponent($singleControlElem.attr("datasource"));
        //console.log(dataSource);
        dataSource=JsonUtility.StringToJson(dataSource);
        var defaultIsChecked=true;
        $singleControlElem.hide();


        var defaultSelected=$singleControlElem.attr("defaultselected");
        this.radioGroupName="radioGroupName_"+$singleControlElem.attr("id");
        this.radioGroupWrapId="radioGroupWrap_"+$singleControlElem.attr("id");
        this.level2BindControlId=$singleControlElem.attr("level2bindcontrolid");
        $("#"+this.radioGroupWrapId).remove();
        var radioGroupDiv=$("<div class='radioGroupContainer' id='"+this.radioGroupWrapId+"' style='margin: 4px 0px;' />");
        var rownum=$singleControlElem.attr("rownum");
        //debugger;
        var _this=this;
        for (var i = 0; i < dataSource.length; i++) {
            var item=dataSource[i];
            var text=item.ITEXT;
            var value=item.IVALUE;
            //console.log(item);
            var newRow=false;
            if(i!=0&&rownum>1){
                newRow=(((i)%rownum)==0);
            }
            else if(rownum==1){
                newRow=true;
            }

            if(text!="--请选择--") {
                var itemRadioId=this.radioGroupName+"_"+i;
                var itemRadio = $("<input type='radio' name='" + this.radioGroupName + "' id='"+itemRadioId+"' />");
                itemRadio.val(value);
                if(value==defaultSelected){
                    itemRadio.prop("checked",true);
                }
                radioGroupDiv.append(itemRadio);
                radioGroupDiv.append("<label for='"+itemRadioId+"' style='margin-right: 8px'>" + text + "</label>");
                if(newRow){
                    radioGroupDiv.append("<br />");
                }

                if(this.Is2LevelDD()) {
                    itemRadio.change(function () {
                        var value = $(this).val();
                        _this.TryBind2LevelDD($singleControlElem,value);
                        //var level2BindControlId = _this.level2BindControlId;
                        //console.log(value);
                        //var $l2Elem=$("#"+level2BindControlId);
                        //console.log($l2Elem);
                    });
                }
            }
            //$singleControlElem
        }
        $singleControlElem.after(radioGroupDiv);

        if(defaultSelected){

        }
    },
    RendererDataChain:function () {

    },
    GetValue:function ($elem,originalData, paras) {
        //console.log(this.radioGroupName);
        originalData.value=$("[name='"+this.radioGroupName+"']:checked").val();
        //debugger;
        if(originalData.value==undefined){
            originalData.value="";
        }
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

            if(fieldPO.value){
                this.TryBind2LevelDD($elem,fieldPO.value);
            }
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
    },
    Is2LevelDD:function (){
        return StringUtility.IsNotNullOrEmpty(this.level2BindControlId);
    },
    TryBind2LevelDD:function ($singleControlElem,value){
        var level2BindControlId=$singleControlElem.attr("level2bindcontrolid");
        if(level2BindControlId){
            var dataSourceAllLevel=decodeURIComponent($singleControlElem.attr("datasourcealllevel"));
            dataSourceAllLevel=JsonUtility.StringToJson(dataSourceAllLevel)
            //console.log(dataSourceAllLevel);
            var childDDArray=ArrayUtility.Where(dataSourceAllLevel,function (item){
               return item.PARENTVALUE==value
            });
            //console.log(childDDArray);
            var $l2Elem=$("#"+level2BindControlId);
            var childDDArrayJson=JsonUtility.JsonToString(childDDArray);
            $l2Elem.attr("datasource",childDDArrayJson);
            var elemInstance=HTMLControl.GetControlInstanceByElem($l2Elem);
            //debugger;
            elemInstance.RendererChain({
                $singleControlElem:$l2Elem
            });
            //console.log(elemInstance);
        }
    }
}