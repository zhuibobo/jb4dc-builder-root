var WLDCT_ListSimpleSearchContainer={
    _$SimpleSearchButton:null,
    _$ShowComplexSearchButton:null,
    _$SingleControlElem:null,
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem = _rendererChainParas.$singleControlElem;
        this._$SingleControlElem=$singleControlElem;

        var pageWidth = PageStyleUtility.GetPageWidth();

        var buttonWrapWidth=200;

        $singleControlElem.find("table:first").width(pageWidth-buttonWrapWidth);

        HTMLControl.SaveControlNewInstanceToPool($singleControlElem,this);

        var $searchButtonsWrap=$("<div class='wldct-list-simple-search-button-inner-wrap' />");
        $searchButtonsWrap.width(buttonWrapWidth-40);

        this._$SimpleSearchButton=$("<button>查询</button>");
        this._$ShowComplexSearchButton=$("<button>高级查询</button>");

        $searchButtonsWrap.append(this._$SimpleSearchButton);
        $searchButtonsWrap.append(this._$ShowComplexSearchButton);

        $singleControlElem.append($searchButtonsWrap);

        HTMLControl.RendererChain(_rendererChainParas);
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