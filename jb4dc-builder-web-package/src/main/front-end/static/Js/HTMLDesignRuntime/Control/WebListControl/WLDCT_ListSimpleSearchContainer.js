var WLDCT_ListSimpleSearchContainer={
    _objectType:"Instance",//Static;
    _prop:{
        $singleControlElem:null,
        instanceName:null,
        elemId:null,
        status:null
    },
    _$SimpleSearchButton:null,
    _$ShowComplexSearchButton:null,
    _$SingleControlElem:null,
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem = _rendererChainParas.$singleControlElem;
        this._$SingleControlElem=$singleControlElem;

        var pageWidth = PageStyleUtility.GetPageWidth();

        var buttonWrapWidth=200;

        $singleControlElem.find("table:first").width(pageWidth-buttonWrapWidth);

       // HTMLControl.SaveControlNewInstanceToPool($singleControlElem,this);

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
        String tableName;1
        String fieldName;*/
        var allControls=this._$SingleControlElem.find(HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
        var hidControls=this._$SingleControlElem.parent().find("[singlename='WLDCT_HideContainer']").find("[columnname][columnoperator]");
        //console.log(hidControls);
        $.merge(allControls,hidControls);
        for(var i=0;i<allControls.length;i++){
            var $elem=$(allControls[i]);
            var instance=HTMLControl.GetControlInstanceByElem($elem);
            var valObj=instance.GetValue($elem,{});
            var value=valObj.value;
            if(value) {
                value=StringUtility.Trim(value);
                if(value) {
                    result.push({
                        operator: $elem.attr("columnoperator"),
                        value: value,
                        tableName: $elem.attr("columntablename"),
                        fieldName: $elem.attr("columnname")
                    })
                }
            }
            //console.log(valObj);
        }

        return result;
    },
    GetStatus:function () {
        var status = this._$SingleControlElem.attr("status");
        if(status=="") {
            status = "enable";
        }
        return status
    },
    Hide:function () {
        this._$SingleControlElem.hide();
    },
    HideComplexButton:function () {
        this._$ShowComplexSearchButton.remove();
        this._$SimpleSearchButton.parent().width("80px");
        var pageWidth = PageStyleUtility.GetPageWidth();
        this._$SingleControlElem.find("table:first").width(pageWidth-120);
    }
}