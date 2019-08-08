let HTMLControlAttrs= {
    JBUILD4DC_CUSTOM: "jbuild4dc_custom",
    SELECTED_JBUILD4DC_CUSTOM:"[jbuild4dc_custom=true]",
    CLIENT_RESOLVE:"client_resolve"
}
let HTMLControl={
    _InstanceMap:{},
    GetInstance:function(name){
        for(var key in this._InstanceMap){
            if(key==name){
                return this._InstanceMap[key];
            }
        }
        var instance=eval(name);
        this._InstanceMap[name]=instance;
        return instance;
    },
    RendererChainParas:{
        sourceHTML:null,
        $rootElem:null,
        $parentControlElem:null,
        $singleControlElem:null,
        allData:null
    },
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        //debugger;
        for (var i = 0; i < $singleControlElem.children().length; i++) {
            var $childSingleElem = $($singleControlElem.children()[i]);
            //console.log($childSingleElem.html());
            if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM)=="true"&&$childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
                //debugger;
                var clientResolveInstanceName=$childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                var instance=HTMLControl.GetInstance(clientResolveInstanceName);
                instance.RendererChain({
                    sourceHTML:_rendererChainParas.sourceHTML,
                    $rootElem:_rendererChainParas.$rootElem,
                    $parentControlElem:_rendererChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem,
                    allData:_rendererChainParas.allData
                });
            } else {
                HTMLControl.RendererChain({
                    sourceHTML:_rendererChainParas.sourceHTML,
                    $rootElem:_rendererChainParas.$rootElem,
                    $parentControlElem:_rendererChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem,
                    allData:_rendererChainParas.allData
                });
            }
        }
    }
}