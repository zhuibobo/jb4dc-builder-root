var WLDCT_ListTableInnerButton= {
    RendererChain: HTMLControl.RendererChain,
    RendererDataChain:function (_rendererDataChainParas){
        var $singleControlElem=_rendererDataChainParas.$singleControlElem;
        //console.log(_rendererDataChainParas);
        $singleControlElem.bind("click",{"selfInstance":this,"$elem":$singleControlElem,rowData:_rendererDataChainParas.rowData},this.ClickEvent);
        $singleControlElem.html("");
        $singleControlElem.attr("title",$singleControlElem.attr("caption"));
    },
    ClickEvent:function (sender) {
        console.log(sender.data.rowData.ID);
        var $elem = sender.data.$elem;
        console.log($elem);
        var targetbuttonid = $elem.attr("targetbuttonid");
        var listTableContainerInstance = WLDCT_ListTableContainer.__InnerElemGetInstance($elem);
        //取消所有的选择.
        listTableContainerInstance.ClearAllCheckBox();
        //选中当前cb,
        listTableContainerInstance.SetCheckBoxToCheckedStatus(sender.data.rowData.ID);
        //触发按钮
        console.log(targetbuttonid);
        $("button#" + targetbuttonid).trigger("click");
        console.log(listTableContainerInstance);
    }
}