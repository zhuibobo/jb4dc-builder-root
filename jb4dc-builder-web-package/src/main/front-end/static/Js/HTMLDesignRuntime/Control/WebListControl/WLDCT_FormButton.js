var WLDCT_FormButton= {
    RendererChain: HTMLControl.RendererChain,
    ResolveSelf:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var caption=$singleControlElem.attr("buttoncaption");
        var $button=$("<button class='wldct-list-button'>"+caption+"</button>");
        $button.bind("click",{},function () {
            alert(caption);
        });
        return $button;
    },
    RendererDataChain:HTMLControl.RendererDataChain
}