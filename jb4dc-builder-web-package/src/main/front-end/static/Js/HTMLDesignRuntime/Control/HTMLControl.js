let HTMLControlAttrs= {
    JBUILD4DC_CUSTOM: "jbuild4dc_custom",
    SELECTED_JBUILD4DC_CUSTOM:"[jbuild4dc_custom=true]",
    CLIENT_RESOLVE:"client_resolve"
}
let HTMLControl={
    _InstanceMap:{},
    _GetInstance:function(name){
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
        alert("改方法已经废弃,改为服务端创建初始化脚本!");
        return null;
        var instanceName=$elem.attr("client_resolve")+"_"+StringUtility.GuidSplit("");
        //HTMLControl.SaveControlInstancePool(instanceName,instance);
        $elem.attr("client_instance_name",instanceName);
        this._InstanceMap[instanceName]=instance;
        return instanceName;
    },
    _SaveControlNewInstanceToPool:function(instanceName,instance){
        this._InstanceMap[instanceName]=instance;
        return instanceName;
    },
    GetControlInstanceByElem:function($elem){
        //console.log($elem);
        //console.log($elem.attr("client_instance_name"));
        /*var instanceName="";
        if($elem.attr("client_instance_name")&&$elem.attr("client_instance_name").length>0){
            instanceName=$elem.attr("client_instance_name");
        }
        else {
            instanceName=$elem.attr("client_resolve");
        }
        return this._GetInstance(instanceName);*/
        //return this._InstanceMap[instanceName];
        return this._GetInstance(this.GetControlInstanceNameByElem($elem));
    },
    GetControlInstanceNameByElem:function($elem){
        var instanceName="";
        if($elem.attr("client_instance_name")&&$elem.attr("client_instance_name").length>0){
            instanceName=$elem.attr("client_instance_name");
        }
        else {
            instanceName=$elem.attr("client_resolve");
        }
        return instanceName;
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
                //var clientResolveName=$childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                var instance=HTMLControl.GetControlInstanceByElem($childSingleElem);
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
                //var clientResolveInstanceName = $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                var instance=HTMLControl.GetControlInstanceByElem($childSingleElem);

                instance.RendererDataChain(_cloneRendererDataChainParas);

                if(typeof(instance.SetValue)=="function") {
                    instance.SetValue($childSingleElem,_rendererDataChainParas.relationFormRecordComplexPo,_rendererDataChainParas);
                }
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
    SetValue:function ($elem,relationFormRecordComplexPo,_rendererDataChainParas) {
        //debugger;
        var fieldPO = HTMLControl.TryGetFieldPOInRelationFormRecordComplexPo($elem,relationFormRecordComplexPo);
        if(fieldPO){
            console.log(fieldPO);
            $elem.val(fieldPO.value);
            $elem.attr("control_value",fieldPO.value);
        }
    },
    TryGetFieldPOInRelationFormRecordComplexPo:function($elem,relationFormRecordComplexPo) {
        var relationId = HTMLControl.GetControlBindRelationId($elem);
        var bindTableName = HTMLControl.GetControlBindTableName($elem);
        var bindFieldName = HTMLControl.GetControlBindFieldName($elem);
        if (relationId && bindFieldName) {
            var fieldPO = FormRelationPOUtility.FindFieldPOInRelationFormRecordComplexPoOneDataRecord(relationFormRecordComplexPo, relationId, bindTableName, bindFieldName);
            return fieldPO;
        } else {
            return null
        }
    },
    FindALLControls:function ($parent) {
        if ($parent) {
            return $parent.find("[jbuild4dc_custom='true']");
        }
        return $("[jbuild4dc_custom='true']");
    },
    GetControlBindTableName:function($controlElem){
        return $controlElem.attr("tablename");
    },
    GetControlBindFieldName:function($controlElem){
        return $controlElem.attr("fieldname");
    },
    GetControlBindRelationId:function($controlElem){
        return $controlElem.attr("relationid");
    },
    GetControlProp:function ($controlElem) {
        var props= {
            singleName: "",
            tableName: "",
            tableCaption: "",
            tableId: "",
            fieldTableId: "",
            fieldName: "",
            fieldDataType: "",
            fieldDataLength: "",
            defaultType: "",
            defaultValue: "",
            id: "",
            serialize: "",
            value:""
        };
        //debugger;
        for(var key in props){
            var propValue=$controlElem.attr(StringUtility.ToLowerCase(key));
            if(!StringUtility.IsNullOrEmpty(propValue)) {
                props[key] = propValue;
            }
        }
        props.fieldDataLength=$controlElem.attr("fieldlength");
        return props;
    },
    BuildSerializationOriginalData:function(props,relationId,relationSingleName,relationType){
        //var props=this.GetControlProp($controlElem);
        var originalData = {
            relationId: relationId,
            relationSingleName: relationSingleName,
            relationType: relationType,
            singleName: props.singleName,
            tableName:  props.tableName,
            tableCaption: props.tableCaption,
            tableId: props.tableId,
            fieldTableId: props.fieldTableId,
            fieldName: props.fieldName,
            fieldDataType: props.fieldDataType,
            fieldDataLength: props.fieldDataLength,
            serialize: props.serialize,
            id: props.id,
            defaultType: props.defaultType,
            defaultValue: props.defaultValue,
            value: "",
            success: true,
            msg: ""
        };
        return originalData;
    },
    GetSerializationOneDataRecordFieldValue:function (oneDataRecord,tableName,fieldName) {
        for (var i = 0; i < oneDataRecord.length; i++) {
            if (oneDataRecord[i].tableName == tableName && oneDataRecord[i].fieldName == fieldName) {
                return oneDataRecord[i].value;
            }
        }
        return "";
    },
    TryGetFieldTransferPO:function ($controlElem,relationId,relationSingleName,relationType) {
        var props=HTMLControl.GetControlProp($controlElem);
        var originalData=HTMLControl.BuildSerializationOriginalData(props,relationId,relationSingleName,relationType);
        var controlInstance = HTMLControl.GetControlInstanceByElem($controlElem);

        if (BaseUtility.IsFunction(controlInstance.GetValue)) {
            var fieldTransferPO = controlInstance.GetValue($controlElem, originalData, {});
            if (fieldTransferPO.success) {
                return fieldTransferPO;
            } else {
                return null;
            }
        } else {
            DialogUtility.AlertText("控件:" + $controlElem.attr("singlename") + "未包含GetValue的方法!");
        }
    }
}