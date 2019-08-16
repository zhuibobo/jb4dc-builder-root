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
    SaveControlNewInstanceToPool:function($elem,instance){
        var instanceName=$elem.attr("client_resolve")+"_"+StringUtility.GuidSplit("");
        //HTMLControl.SaveControlInstancePool(instanceName,instance);
        $elem.attr("client_instance_name",instanceName);
        this._InstanceMap[instanceName]=instance;
    },
    GetControlInstance:function(name){
        return this._InstanceMap[name];
    },
    GetControlInstanceByElem:function($elem){
        //console.log($elem);
        //console.log($elem.attr("client_instance_name"));
        var instanceName="";
        if($elem.attr("client_instance_name")&&$elem.attr("client_instance_name").length>0){
            instanceName=$elem.attr("client_instance_name");
        }
        else {
            instanceName=$elem.attr("client_resolve");
        }
        //console.log(instanceName);
        //console.log(this._InstanceMap);
        return this._InstanceMap[instanceName];
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
                var clientResolveName=$childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                var instance=HTMLControl.GetInstance(clientResolveName);
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
    },
    GetValue:function ($elem, paras) {
        var result = {};
        result.result = true;
        result.message = "";
        result.value = $elem.val();
        result.text = $elem.val();
        return result;
    }
}