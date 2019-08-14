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
        listEntity:null,
        sourceHTML:null,
        $rootElem:null,
        $parentControlElem:null,
        $singleControlElem:null
    },
    RendererDataChainParas:{
        listEntity:null,
        sourceHTML:null,
        $rootElem:null,
        $parentControlElem:null,
        $singleControlElem:null,
        topDataSet:null
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
                if(typeof(instance.Initialize)=="function"){
                    instance.Initialize();
                }
                instance.RendererChain({
                    listEntity:_rendererChainParas.listEntity,
                    sourceHTML:_rendererChainParas.sourceHTML,
                    $rootElem:_rendererChainParas.$rootElem,
                    $parentControlElem:_rendererChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem
                });
            } else {
                HTMLControl.RendererChain({
                    listEntity:_rendererChainParas.listEntity,
                    sourceHTML:_rendererChainParas.sourceHTML,
                    $rootElem:_rendererChainParas.$rootElem,
                    $parentControlElem:_rendererChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem
                });
            }
        }
    },
    RendererDataChain:function (_rendererDataChainParas) {
        var $singleControlElem=_rendererDataChainParas.$singleControlElem;
        //debugger;
        for (var i = 0; i < $singleControlElem.children().length; i++) {
            var $childSingleElem = $($singleControlElem.children()[i]);
            //console.log($childSingleElem.html());
            if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM)=="true"&&$childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
                //debugger;
                var clientResolveInstanceName=$childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                var instance=HTMLControl.GetInstance(clientResolveInstanceName);
                instance.RendererDataChain({
                    listEntity:_rendererDataChainParas.listEntity,
                    sourceHTML:_rendererDataChainParas.sourceHTML,
                    $rootElem:_rendererDataChainParas.$rootElem,
                    $parentControlElem:_rendererDataChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem,
                    topDataSetId:_rendererDataChainParas.topDataSetId
                });
            } else {
                HTMLControl.RendererDataChain({
                    listEntity:_rendererDataChainParas.listEntity,
                    sourceHTML:_rendererDataChainParas.sourceHTML,
                    $rootElem:_rendererDataChainParas.$rootElem,
                    $parentControlElem:_rendererDataChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem,
                    topDataSetId:_rendererDataChainParas.topDataSetId
                });
            }
        }
    }
}