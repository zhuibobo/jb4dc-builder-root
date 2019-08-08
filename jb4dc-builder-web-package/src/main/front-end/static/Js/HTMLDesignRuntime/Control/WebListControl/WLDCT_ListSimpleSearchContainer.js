var WLDCT_ListSimpleSearchContainer={
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem = _rendererChainParas.$singleControlElem;
        var pageWidth = PageStyleUtility.GetPageWidth();

        var buttonWrapWidth=140;

        $singleControlElem.find("table:first").width(pageWidth-buttonWrapWidth);

        var $searchButtonsWrap=$("<div class='wldct-list-simple-search-button-inner-wrap' />");
        $searchButtonsWrap.width(buttonWrapWidth-40);

        var $simpleSearchButton="<button>查询</button>";
        var $complexSearchButton="<button>高级查询</button>";

        $searchButtonsWrap.append($simpleSearchButton);
        $searchButtonsWrap.append($complexSearchButton);

        $singleControlElem.append($searchButtonsWrap);

        HTMLControl.RendererChain(_rendererChainParas);
    }
}