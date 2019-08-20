var WLDCT_FormButton= {
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

        $button.bind("click",{buttonElem:$button},this.ClickEvent);
        return $button;
    },
    RendererDataChain:HTMLControl.RendererDataChain,
    ClickEvent:function (sender) {
        var $button=sender.data.buttonElem;
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
        var id=$button.attr("id");
        var innerbuttonjsonstring=$button.attr("innerbuttonjsonstring");
        var opentype=$button.attr("opentype");
        var operation=$button.attr("operation");
        var singlename=$button.attr("singlename");
        var windowcaption=$button.attr("windowcaption");
        var windowheight=$button.attr("windowheight");
        var windowwidth=$button.attr("windowwidth");
        var client_resolve=$button.attr("client_resolve");
        //debugger;
        DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormRuntime.html",{
            formId:formid
        }), {
            width: windowwidth,
            height: windowheight,
            title:windowcaption
        },1,true);
    }
}