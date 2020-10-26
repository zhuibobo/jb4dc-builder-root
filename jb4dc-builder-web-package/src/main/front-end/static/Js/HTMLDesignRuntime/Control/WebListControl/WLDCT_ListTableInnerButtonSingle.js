var WLDCT_ListTableInnerButtonSingle= {
    RendererChain: function (_rendererChainParas){
        //console.log(_rendererChainParas);
    },
    _ListRuntimeInstance:null,
    RendererDataChain:function (_rendererDataChainParas){
        var $singleControlElem=_rendererDataChainParas.$singleControlElem;
        this._ListRuntimeInstance=_rendererDataChainParas.listRuntimeInstance;

        $singleControlElem.bind("click",{"selfInstance":this,"$elem":$singleControlElem,rowData:_rendererDataChainParas.rowData},this.ClickEvent);
        $singleControlElem.html("");
        $singleControlElem.attr("title",$singleControlElem.attr("caption"));


    },
    ClickEvent:function (sender) {
        //console.log(sender.data.rowData.ID);
        //debugger;
        var $elem = sender.data.$elem;
        //console.log($elem);
        var targetbuttonid = $elem.attr("targetbuttonid");

        var $listTableContainer=$elem.parentsUntil("[singlename='WLDCT_ListTableContainer']").last().parent();
        var listTableContainerInstance = HTMLControl.GetControlInstanceByElem($listTableContainer);
        //取消所有的选择.
        listTableContainerInstance.ClearAllCheckBox();
        //选中当前cb,
        var primaryKey=sender.data.selfInstance._ListRuntimeInstance.GetPrimaryKey();
        listTableContainerInstance.SetCheckBoxToCheckedStatus(sender.data.rowData[primaryKey]);
        //触发按钮
        console.log(targetbuttonid);
        $("button#" + targetbuttonid).trigger("click");
        console.log(listTableContainerInstance);
    }
}