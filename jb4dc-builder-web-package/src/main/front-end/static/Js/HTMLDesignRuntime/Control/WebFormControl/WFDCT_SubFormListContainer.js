var WFDCT_SubFormListContainer={
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        $singleControlElem.html("重新渲染子元素!");
    },
    RendererDataChain:HTMLControl.RendererDataChain
}