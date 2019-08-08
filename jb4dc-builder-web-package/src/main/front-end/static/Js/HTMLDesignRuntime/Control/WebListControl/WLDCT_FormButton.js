var WLDCT_FormButton= {
    RendererChain: HTMLControl.RendererChain,
    ResolveSelf:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var caption=$singleControlElem.attr("buttoncaption");
        var $button=$("<div class='wldct-list-button'>"+caption+"</div>");
        $button.bind("click",{},function () {
            alert(caption);
        });
        return $button;
    }
}