var VirtualBodyControl={
    RendererChain:HTMLControl.RendererChain,
    RendererDataChain:HTMLControl.RendererDataChain,
    InitStyle:function(_rendererChainParas){
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var formRuntimeInstance=_rendererChainParas.formRuntimeInstance;
        //console.log(formRuntimeInstance);
        //HTMLControl.TryAppendValidateStyle($singleControlElem);11
        this.TryAutoSetHeight(formRuntimeInstance);
    },
    TryAutoSetHeight:function (formRuntimeInstance){
        if($(".auto-full-page-height-wrap").length>0) {
            var pageHeight = formRuntimeInstance._Prop_Config.WebFormRTParas.WindowHeight
            if (pageHeight) {
                pageHeight = pageHeight - 130;
                if (this.HasRootTabContainer()) {
                    pageHeight = pageHeight - 70;
                }
                $(".auto-full-page-height-wrap").height(pageHeight);
                var ps = new PerfectScrollbar(".auto-full-page-height-wrap");
                //$(".auto-full-page-height-wrap").css("over-flow","auto");1
            }
        }
    },
    HasRootTabContainer:function (){
        return $("#htmlDesignRuntimeWrap").children("[singlename='WFDCT_TabContainer']").length>0;
    }
}