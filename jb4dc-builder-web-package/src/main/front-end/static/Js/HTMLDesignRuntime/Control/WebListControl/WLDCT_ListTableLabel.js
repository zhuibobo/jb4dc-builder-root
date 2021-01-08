
var WLDCT_ListTableLabel= {
    _objectType:"Static",//Instance;
    _propMap:{},
    _prop:{
        $singleControlElem:null,
        instanceName:null,
        elemId:null,
        columnAlign:null,
        defFormat:null,
        targetButtonId:null,
        dictionaryGroupDataSourceId:null
    },
    RendererChain: HTMLControl.RendererChain,
    RendererDataChain:function (_rendererDataChainParas) {
        /*{
            $templateTable:$templateTable,
            $templateTableRow:$templateTableRow,
            dataSet:dataSet,
            rowData:rowData,
            $cloneRow:$cloneRow,
            $td:$td,
            val:val
        }*/
        var $singleControlElem=_rendererDataChainParas.$singleControlElem;
        //console.log(_rendererDataChainParas.listRuntimeInstance);
        //this._ListRuntimeInstance=_rendererDataChainParas.listRuntimeInstance;
        var value=_rendererDataChainParas.val;
        var elemId=$singleControlElem.attr("id");
        var _prop=this._propMap[elemId];
        _prop._ListRuntimeInstance=_rendererDataChainParas.listRuntimeInstance;
        //_prop.rowData=_rendererDataChainParas.rowData
        //var defFormat = this._propMap[elemId].defFormat;
        //var targetButtonId=this._propMap[targetButtonId].defFormat;
        //console.log(columnAlign);
        //console.log(this._propMap);
        var $td=_rendererDataChainParas.$td;
        if(_prop.columnAlign=="居中对齐") {
            $td.css("textAlign", "center");
        }
        else if(_prop.columnAlign=="左对齐"){
            $td.css("textAlign", "left");
        }

        if(_prop.defFormat=="yyyy-MM-dd"){
            if(value) {
                var ctDate = DateUtility.ConvertFromString(value);
                //console.log(fieldPO);
                value = DateUtility.Format(ctDate, _prop.defFormat);
            }
        }
        else if(_prop.defFormat=="convertOrganIdToOrganName"){
            if(StringUtility.IsNotNullOrEmpty(value)){
                var organData=_rendererDataChainParas.listRuntimeInstance._ListPO.exData.minOrganData[value];
                if(organData!=null&&organData!=undefined){
                    var organName=organData.organName;
                    value=organName;
                }
            }
        }
        else if(_prop.defFormat=="convertDDValueToDDText"){
            if(StringUtility.IsNotNullOrEmpty(value)&&_prop.dictionaryGroupDataSourceId){
                var key=_prop.dictionaryGroupDataSourceId+"_"+value;
                value=_rendererDataChainParas.listRuntimeInstance._ListPO.exData.minDictionaryData[key].TEXT;
                //console.log("绑定字典ID"+_prop.dictionaryGroupDataSourceId);
            }
        }
        if(_prop.targetButtonId) {
            $td.addClass("list-td-click-enable");
            $td.bind("click", {"prop": _prop,rowData:_rendererDataChainParas.rowData}, this.ClickEvent);
        }
        $td.html(value);
    },
    ClickEvent:function (sender) {

        var _prop =sender.data.prop;
        var rowData = sender.data.rowData;
        var targetbuttonid = _prop.targetButtonId;

        var $listTableContainer=$(this).parentsUntil("[singlename='WLDCT_ListTableContainer']").last().parent();
        var listTableContainerInstance = HTMLControl.GetControlInstanceByElem($listTableContainer);
        //取消所有的选择.
        listTableContainerInstance.ClearAllCheckBox();
        //选中当前cb,
        var primaryKey=_prop._ListRuntimeInstance.GetPrimaryKey();
        listTableContainerInstance.SetCheckBoxToCheckedStatus(rowData[primaryKey]);
        //触发按钮
        console.log(targetbuttonid);
        $("button#" + targetbuttonid).trigger("click");
        console.log(listTableContainerInstance);
    }
}