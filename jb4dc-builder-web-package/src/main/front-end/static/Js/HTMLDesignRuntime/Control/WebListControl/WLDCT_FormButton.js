var WLDCT_FormButton= {
    _ListTableContainerInstance:null,
    RendererChain: HTMLControl.RendererChain,
    ResolveSelf:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        //console.log($singleControlElem);
        var caption=$singleControlElem.attr("buttoncaption");
        var $button=$("<button class='wldct-list-button'>"+caption+"</button>");

        var attributes = $singleControlElem.prop("attributes");

        $.each(attributes, function() {
            $button.attr(this.name, this.value);
        });

        $button.bind("click",{"buttonElem":$button,"selfInstance":this},this.ClickEvent);
        //debugger;
        //console.log($WLDCT_ListButtonContainer.html());

        return $button;
    },
    RendererDataChain:function (_rendererDataChainParas) {
        var $singleControlElem=_rendererDataChainParas.$singleControlElem;
        var $WLDCT_ListButtonContainer = $singleControlElem.parents("[singlename='WLDCT_ListButtonContainer']");
        var $WLDCT_ListTableContainerElem = $WLDCT_ListButtonContainer.nextAll("[client_resolve='WLDCT_ListTableContainer']");
        this._ListTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainerElem);
    },
    ClickEvent:function (sender) {
        var $button=sender.data.buttonElem;
        var _self=sender.data.selfInstance;
        console.log($button);
        var bindauthority=$button.attr("bindauthority");
        var buttoncaption=$button.attr("buttoncaption");
        var buttontype=$button.attr("buttontype");
        var custclientclickbeforemethod=$button.attr("custclientclickbeforemethod");
        var custclientclickbeforemethodpara=$button.attr("custclientclickbeforemethodpara");
        var custclientrendereraftermethodpara=$button.attr("custclientrendereraftermethodpara");
        var custclientrendereraftermethodparapara=$button.attr("custclientrendereraftermethodparapara");
        var custclientrenderermethod=$button.attr("custclientrenderermethod");
        var custclientrenderermethodpara=$button.attr("custclientrenderermethodpara");
        var custserverresolvemethod=$button.attr("custserverresolvemethod");
        var custserverresolvemethodpara=$button.attr("custserverresolvemethodpara");
        var formcode=$button.attr("formcode");
        var formid=$button.attr("formid");
        var formmoduleid=$button.attr("formmoduleid");
        var formmodulename=$button.attr("formmodulename");
        var formname=$button.attr("formname");
        var elemid=$button.attr("id");
        var buttonid=$button.attr("buttonid");
        var innerbuttonjsonstring=$button.attr("innerbuttonjsonstring");
        var opentype=$button.attr("opentype");
        var operation=$button.attr("operation");
        var singlename=$button.attr("singlename");
        var windowcaption=$button.attr("windowcaption");
        var windowheight=$button.attr("windowheight");
        var windowwidth=$button.attr("windowwidth");
        var client_resolve=$button.attr("client_resolve");

        var recordId="";
        //var checkedRecordObjs="";
        if(operation=="update"||operation=="view") {
            var checkedRecordObjs = _self._ListTableContainerInstance.GetCheckedRecord();
            if(checkedRecordObjs.length==0){
                DialogUtility.AlertText("请选择需要进行操作的记录!");
                return;
            }
            else if(checkedRecordObjs.length>1){
                DialogUtility.AlertText("一次只能操作一条记录!");
                return;
            }
            else{
                recordId=checkedRecordObjs[0].Id;
            }
        }

        //debugger;
        DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormRuntime.html",{
            FormId:formid,
            ButtonId:buttonid,
            ElemId:elemid,
            RecordId:recordId,
            OperationType:operation
        }), {
            width: windowwidth,
            height: windowheight,
            title:windowcaption
        },1,true);
    }
}