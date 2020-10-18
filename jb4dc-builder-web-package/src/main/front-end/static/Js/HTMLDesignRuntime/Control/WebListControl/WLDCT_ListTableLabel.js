var WLDCT_ListTableLabel= {
    _objectType:"Static",//Instance;
    _propMap:{},
    _prop:{
        $singleControlElem:null,
        instanceName:null,
        elemId:null,
        columnAlign:null
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
        var value=_rendererDataChainParas.val;
        var elemId=$singleControlElem.attr("id");
        var columnAlign=this._propMap[elemId].columnAlign;
        console.log(columnAlign);
        //console.log(this._propMap);
        var $td=_rendererDataChainParas.$td;
        if(columnAlign=="居中对齐") {
            $td.css("textAlign", "center");
        }
        else if(columnAlign=="左对齐"){
            $td.css("textAlign", "left");
        }
        $td.html(value);
    }
}