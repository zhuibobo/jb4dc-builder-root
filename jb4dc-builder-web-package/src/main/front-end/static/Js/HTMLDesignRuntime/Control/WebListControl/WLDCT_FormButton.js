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

    }
}