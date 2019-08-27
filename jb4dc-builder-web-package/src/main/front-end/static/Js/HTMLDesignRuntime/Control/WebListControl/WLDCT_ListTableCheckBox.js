var WLDCT_ListTableCheckBox={
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
        var value = _rendererDataChainParas.val;
        var $td = _rendererDataChainParas.$td;
        $td.css("textAlign", "center");
        var $checkbox = $("<input isrow_checkbox=\"true\" type=\"checkbox\" class=\"list-checkbox-c\" value=\"" + value + "\" row_checkbox_record_id=\"" + value + "\">");
        $checkbox.bind("click", {"selfInstance": this, "$elem": $checkbox}, this.ClickEvent);
        $td.html("");
        $td.append($checkbox);
    },
    ClickEvent:function (sender) {
        /*var $elem=sender.data.$elem;
        var $WLDCT_ListTableContainer = $elem.parents("[singlename='WLDCT_ListTableContainer']");
        var listTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainer);*/
        var $elem=sender.data.$elem;
        var listTableContainerInstance=WLDCT_ListTableContainer.__InnerElemGetInstance($elem);
        if($elem.prop("checked")){
            listTableContainerInstance.SaveCheckedRowData($elem.val());
        }
        else{
            listTableContainerInstance.DeleteCheckedRowData($elem.val());
        }
        //alert("1");
    }
}