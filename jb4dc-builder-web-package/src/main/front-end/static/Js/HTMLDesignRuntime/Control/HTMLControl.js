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
    GetInstance:function(name) {
        return this._GetInstance(name);
    },
    SaveControlNewInstanceToPool:function($elem,instance){
        alert("改方法已经废弃,改为服务端创建初始化脚本1!");
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
        //console.log(_rendererDataChainParas);
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

                var fieldPO;
                if(typeof(instance.SetValue)=="function") {
                    fieldPO = HTMLControl.TryGetFieldPOInRelationFormRecordComplexPo($childSingleElem,_rendererDataChainParas.relationFormRecordComplexPo);
                    instance.SetValue($childSingleElem,fieldPO,_rendererDataChainParas.relationFormRecordComplexPo,_rendererDataChainParas);
                }
                //console.log(_rendererDataChainParas.callToViewStatusFunc);
                if(_rendererDataChainParas.callToViewStatusFunc) {
                    if(typeof(instance.ToViewStatus)=="function") {
                        instance.ToViewStatus($childSingleElem,fieldPO,_rendererDataChainParas.relationFormRecordComplexPo,_rendererDataChainParas);
                    }
                }
            } else {
                HTMLControl.RendererDataChain(_cloneRendererDataChainParas);
            }
        }
    },

    GetValue:function ($elem,originalData, paras) {
        originalData.value=$elem.val();
        return originalData;
    },
    SetValue:function ($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas) {
        //debugger;
        if(fieldPO){
            //console.log(fieldPO);
            $elem.val(fieldPO.value);
            $elem.attr("control_value",fieldPO.value);
        }
    },
    ToViewStatus:function($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas){
        var oldAllAttrs=BaseUtility.GetElemAllAttr($elem);
        var $viewElem=$("<label />");
        $viewElem.attr(oldAllAttrs);

        $viewElem.removeClass();

        if($elem.prop("tagName")=="SELECT"){
            var text=$elem.find("option:selected").text();
            $viewElem.text(text);
        }
        else{
            $viewElem.text($elem.val());
        }
        $elem.replaceWith($viewElem);
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
    },
    GetSimpleControlValue:function (tableId, fieldName) {
        var elem = $("[tableid='" + tableId + "'][fieldname='" + fieldName + "']");
        if (elem.length == 0) {
            return null;
        }
        return elem.val();
    },
    TryBindElementAttrToInstanceProp:function ($elem,objProp) {
        //debugger;
        if($elem.attr("id")) {
            objProp.elemId = $elem.attr("id");
        }
        if($elem.attr("client_instance_name")) {
            objProp.instanceName = $elem.attr("client_instance_name");
        }
        for(var key in objProp){
            if($elem.attr(key)){
                objProp[key]=$elem.attr(key);
            }
        }
        objProp.$singleControlElem=$elem;
    }
}