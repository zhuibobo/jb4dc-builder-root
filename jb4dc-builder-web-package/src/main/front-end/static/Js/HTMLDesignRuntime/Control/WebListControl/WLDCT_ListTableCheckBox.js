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
        var value=_rendererDataChainParas.val;
        var $td=_rendererDataChainParas.$td;
        $td.css("textAlign","center");
        $td.html("<input isrow_checkbox=\"true\" type=\"checkbox\" class=\"list-checkbox-c\" value=\""+value+"\">");
    }
}