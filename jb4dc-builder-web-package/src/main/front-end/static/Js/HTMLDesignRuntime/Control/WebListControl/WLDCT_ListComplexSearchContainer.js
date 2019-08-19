var WLDCT_ListComplexSearchContainer= {
    _$SingleControlElem:null,
    _$ComplexSearchButton:null,
    _$CloseButton:null,
    RendererChain: function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        this._$SingleControlElem=$singleControlElem;

        HTMLControl.SaveControlNewInstanceToPool($singleControlElem,this);

        $singleControlElem.hide();
        $singleControlElem.find(".wldct-list-complex-search-inner-wrap").height("305px");
        $singleControlElem.find(".wldct-list-complex-search-inner-wrap").css("overflow","auto");
        $singleControlElem.find(".wldct-list-complex-search-inner-wrap").addClass("div-custom-scroll");
        var $searchButtonsWrap=$("<div class='wldct-list-complex-search-button-inner-wrap'><div class='button-inner-wrap'></div></div>");

        this._$ComplexSearchButton=$("<button>查询</button>");
        this._$CloseButton=$("<button>关闭</button>");

        $searchButtonsWrap.find(".button-inner-wrap").append(this._$ComplexSearchButton);
        $searchButtonsWrap.find(".button-inner-wrap").append(this._$CloseButton);

        $singleControlElem.append($searchButtonsWrap);

    },
    RendererDataChain:HTMLControl.RendererDataChain,
    BuilderSearchCondition:function () {
        var result=[];
        /*String operator;
        String value;
        String tableName;
        String fieldName;*/
        var allControls=this._$SingleControlElem.find(HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
        for(var i=0;i<allControls.length;i++){
            var $elem=$(allControls[i]);
            var instance=HTMLControl.GetControlInstanceByElem($elem);
            var valObj=instance.GetValue($elem,{});
            var value=valObj.value;
            if(value) {
                result.push({
                    operator: $elem.attr("columnoperator"),
                    value: value,
                    tableName: $elem.attr("columntablename"),
                    fieldName: $elem.attr("columnname")
                })
            }
            //console.log(valObj);
        }

        return result;
    }
}