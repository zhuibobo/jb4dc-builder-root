var WLDCT_ListTableInnerButton= {
    RendererChain: HTMLControl.RendererChain,
    RendererDataChain:function (_rendererDataChainParas){
        var $singleControlElem=_rendererDataChainParas.$singleControlElem;
        //console.log(_rendererDataChainParas);
        $singleControlElem.bind("click",{rowData:_rendererDataChainParas.rowData},this.ClickEvent);
        $singleControlElem.html("");
    },
    ClickEvent:function (sender) {
        console.log(sender.data.rowData.ID);
    }
}