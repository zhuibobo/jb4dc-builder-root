let FormRuntime={
    OperationAdd:"add",
    OperationUpdate:"update",
    OperationView:"view",
    OperationDel:"del",
    _Prop_Status:"Edit",
    _Prop_Config:{
        RendererToId:null,
        FormId:"",
        RecordId:"",
        ButtonId:"",
        IsPreview:false,
        OperationType:""
    },
    _$RendererToElem:null,
    _FormPO:null,
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$("#"+this._Prop_Config.RendererToId);
        this._LoadHTMLToEl();
    },
    //用于控制BuilderListPageRuntimeInstance.RendererChainComplete的调用时间
    _RendererChainIsCompleted:true,
    _RendererDataChainIsCompleted:true,
    _LoadHTMLToEl:function () {
        //debugger;
        /*$(this._Prop_Config.RendererTo).loadHtmlDesignContent(BaseUtility.GetRootPath()+"/Rest/Builder/FormRuntime/FormPreview?formId="+this._Prop_Config.FormId, function() {
            //alert( "Load was performed." );
            console.log("加载预览窗体成功!!");
        });*/
        var url = BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/FormRuntime/LoadHTML";
        if (this._Prop_Config.IsPreview) {
            url = BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/FormRuntime/LoadHTMLForPreView";
        }

        RuntimeGeneralInstance.LoadHtmlDesignContent(url, this._Prop_Config.RendererTo, {
            formId: this._Prop_Config.FormId,
            recordId: this._Prop_Config.RecordId,
            buttonId: this._Prop_Config.ButtonId
        }, function (result) {
            //alert( "Load was performed.");
            console.log("加载预览窗体成功!!");
            //console.log(result);
            //console.log(result.data.formHtmlRuntime);
            //var $rootElem=$(result.data.formHtmlRuntime);
            //if($rootElem.)
            console.log(result);
            this._FormPO=result.data;
            this._$RendererToElem.append(result.data.formHtmlRuntime);

            //VirtualBodyControl.RendererChain(result.data.formHtmlRuntime,this._$RendererToElem,this._$RendererToElem);

            //进行元素渲染
            VirtualBodyControl.RendererChain({
                listEntity: result.data,
                sourceHTML: result.data.formHtmlRuntime,
                $rootElem: this._$RendererToElem,
                $parentControlElem: this._$RendererToElem,
                $singleControlElem: this._$RendererToElem,
                formRuntimeInstance: this
            });
        }, this);
    },
    IsPreview: function () {
        return this._Prop_Config.IsPreview
    },
    GetOriginalFormDataRelation:function() {
        return JsonUtility.StringToJson(this._FormPO.formDataRelation);
    },
    GetOperationType:function(){
        return this._Prop_Config.OperationType;
    },
    IsAddOperation:function(){
        return this.GetOperationType()==this.OperationAdd;
    },
    IsUpdateOperation:function(){
        return this.GetOperationType()==this.OperationUpdate;
    },
    IsViewOperation:function(){
        return this.GetOperationType()==this.OperationView;
    },
    SerializationFormData:function () {
        var formRecordComplexPo = {
            id: this._Prop_Config.RecordId,
            formId: this._Prop_Config.FormId,
            buttonId: this._Prop_Config.ButtonId,
            formRecordDataRelationPOList: null,
            exData: null
        };

        var originalFormDataRelation = this.GetOriginalFormDataRelation();
        console.log(originalFormDataRelation);

        for (var i = 0; i < originalFormDataRelation.length; i++) {
            var singleRelation = originalFormDataRelation[i];
            var relationSingleName = singleRelation.singleName;
            var tableName = singleRelation.tableName;
            var isMain = (singleRelation.parentId == "-1");
            singleRelation.isMain = isMain;
            if (isMain) {
                singleRelation.relationType = "1To1";
            }
            var relationType = singleRelation.relationType;

            if (relationType == "1To1") {
                //获取不在动态DynamicContainer中的并且绑定到了当前表的控件
                var controls = $("[tablename='" + tableName + "'][serialize='true']").not($("[control_category='DynamicContainer']").find("[jbuild4dc_custom='true']"));
                var oneRowRecord = [];
                for (var j = 0; j < controls.length; j++) {
                    var $controlElem = $(controls[j]);
                    var controlInstance = HTMLControl.GetControlInstanceByElem($controlElem);
                    console.log($controlElem.attr("singlename") + "||" + controlInstance);
                    /*var originalData = {
                        relationId: singleRelation.id,
                        relationSingleName: singleName,
                        relationType: relationType,
                        singleName: $controlElem.attr("singlename"),
                        tableName: $controlElem.attr("tablename"),
                        tableCaption: $controlElem.attr("tablecaption"),
                        tableId: $controlElem.attr("tableid"),
                        fieldTableId: $controlElem.attr("tableid"),
                        fieldName: $controlElem.attr("fieldname"),
                        fieldDataType: $controlElem.attr("fielddatatype"),
                        fieldDataLength: $controlElem.attr("fieldlength"),
                        serialize: $controlElem.attr("serialize"),
                        id: $controlElem.attr("id"),
                        defaulttype: $controlElem.attr("defaulttype"),
                        defaultvalue: $controlElem.attr("defaultvalue"),
                        value: "",
                        success: true,
                        msg: ""
                    };*/
                    var props=HTMLControl.GetControlProp($controlElem);
                    var originalData=HTMLControl.BuildSerializationOriginalData(props,singleRelation.id,relationSingleName,relationType);
                    if (BaseUtility.IsFunction(controlInstance.GetValue)) {
                        var controlResultValue = controlInstance.GetValue($controlElem, originalData, {});
                        if (controlResultValue.success) {
                            oneRowRecord.push(controlResultValue);
                        } else {

                        }
                    } else {
                        DialogUtility.AlertText("控件:" + $controlElem.attr("singlename") + "未包含GetValue的方法!");
                    }
                }
                //allRowRecord.push(oneRowRecord);

                singleRelation.oneDataRecord = oneRowRecord;
            } else {

            }

            //singleRelation.dataRecordList=allRowRecord;
        }
        formRecordComplexPo.formRecordDataRelationPOList = originalFormDataRelation;
        //console.log(formRecordComplexPo);
        //console.log(JsonUtility.JsonToString(formRecordComplexPo))
        return formRecordComplexPo;
    },
    DeSerializationFormData:function (formRecordComplexPo) {

        //绑定数据并进行二次渲染绑定数据。
        VirtualBodyControl.RendererDataChain({
            listEntity: result.data,
            sourceHTML: result.data.formHtmlRuntime,
            $rootElem: this._$RendererToElem,
            $parentControlElem: this._$RendererToElem,
            $singleControlElem: this._$RendererToElem,
            formRuntimeInstance: this
        });
    }
}