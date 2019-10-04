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
    ElemIsInstance:function($elem){
        if(this.GetElemInstance($elem)){
            return true;
        }
        return false;
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
        return this.GetInstance(instanceName);
        //return this._InstanceMap[instanceName];
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

            var _cloneRendererDataChainParas = {};
            JsonUtility.SimpleCloneAttr(_cloneRendererDataChainParas, _rendererChainParas);
            _cloneRendererDataChainParas.$singleControlElem = $childSingleElem;
            //console.log($childSingleElem.html());
            if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM)=="true"&&$childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
                //debugger;
                var clientResolveName=$childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                var instance=HTMLControl.GetInstance(clientResolveName);
                if(typeof(instance.Initialize)=="function"){
                    instance.Initialize();
                }
                instance.RendererChain(_cloneRendererDataChainParas);
                /*instance.RendererChain({
                    listEntity:_rendererChainParas.listEntity,
                    sourceHTML:_rendererChainParas.sourceHTML,
                    $rootElem:_rendererChainParas.$rootElem,
                    $parentControlElem:_rendererChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem
                });*/
            } else {
                HTMLControl.RendererChain(_cloneRendererDataChainParas);
                /*HTMLControl.RendererChain({
                    listEntity:_rendererChainParas.listEntity,
                    sourceHTML:_rendererChainParas.sourceHTML,
                    $rootElem:_rendererChainParas.$rootElem,
                    $parentControlElem:_rendererChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem
                });*/
            }
        }
    },
    RendererDataChain:function (_rendererDataChainParas) {
        var $singleControlElem=_rendererDataChainParas.$singleControlElem;
        //debugger;
        for (var i = 0; i < $singleControlElem.children().length; i++) {
            var $childSingleElem = $($singleControlElem.children()[i]);

            var _cloneRendererDataChainParas = {};
            JsonUtility.SimpleCloneAttr(_cloneRendererDataChainParas, _rendererDataChainParas);
            _cloneRendererDataChainParas.$singleControlElem = $childSingleElem;
            //console.log($childSingleElem.html());
            if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM) == "true" && $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
                //debugger;
                var clientResolveInstanceName = $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                var instance = HTMLControl.GetInstance(clientResolveInstanceName);

                instance.RendererDataChain(_cloneRendererDataChainParas);
                /*instance.RendererDataChain({
                    listEntity:_rendererDataChainParas.listEntity,
                    sourceHTML:_rendererDataChainParas.sourceHTML,
                    $rootElem:_rendererDataChainParas.$rootElem,
                    $parentControlElem:_rendererDataChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem,
                    topDataSetId:_rendererDataChainParas.topDataSetId,
                    dataSet: _rendererDataChainParas.dataSet,
                    rowData: _rendererDataChainParas.rowData,
                    $cloneRow: _rendererDataChainParas.$cloneRow,
                    $td: _rendererDataChainParas.$td
                });*/
            } else {
                HTMLControl.RendererDataChain(_cloneRendererDataChainParas);
                /*HTMLControl.RendererDataChain({
                    listEntity:_rendererDataChainParas.listEntity,
                    sourceHTML:_rendererDataChainParas.sourceHTML,
                    $rootElem:_rendererDataChainParas.$rootElem,
                    $parentControlElem:_rendererDataChainParas.$singleControlElem,
                    $singleControlElem:$childSingleElem,
                    topDataSetId:_rendererDataChainParas.topDataSetId,
                    dataSet: _rendererDataChainParas.dataSet,
                    rowData: _rendererDataChainParas.rowData,
                    $cloneRow: _rendererDataChainParas.$cloneRow,
                    $td: _rendererDataChainParas.$td
                });*/
            }
        }
    },
    GetValue:function ($elem,originalData, paras) {
        originalData.value=$elem.val();
        return originalData;
    },
    SetValue:function ($elem,originalData, paras) {
        
    }
}