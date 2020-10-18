var WLDCT_ListButtonContainer= {
    _objectType:"Instance",//Static;
    _prop:{
        $singleControlElem:null,
        instanceName:null,
        elemId:null,
        status:null
    },
    RendererChain: function (_rendererChainParas) {
        //$singleControlElem.hide();
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var $buttonDivElemList=$singleControlElem.find("div"+HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
        $singleControlElem.find("[is-op-button-wrap-table='true']").hide();
        var innerWrap= $singleControlElem.find(".wldct-list-button-inner-wrap");
        var innerInsideWrapDiv=$("<div class='wldct-list-button-inner-inside-wrap' />");
        for(var i=0;i<$buttonDivElemList.length;i++){
            var $buttonElem=$($buttonDivElemList[i]);
            var clientResolveName=$buttonElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
            //debugger;
            var clientResolveObject=Object.create(eval(clientResolveName));
            var $resolvedElem=clientResolveObject.ResolveSelf({
                sourceHTML:_rendererChainParas.sourceHTML,
                $rootElem:_rendererChainParas.$rootElem,
                $parentControlElem:$singleControlElem,
                $singleControlElem:$buttonElem,
                allData:_rendererChainParas.allData
            });
            innerInsideWrapDiv.append($resolvedElem);
        }
        innerWrap.append(innerInsideWrapDiv);
        innerWrap.append("<div style=\"clear: both;\"></div>");
        console.log(this._prop.status);

        if(this._prop.status=="disable"){
            $singleControlElem.hide();
        }
    },
    RendererDataChain:HTMLControl.RendererDataChain
}