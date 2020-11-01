var WFDCT_BaiduMapContainer= {
    LoadJsCompleted:function(){
        var mp = new BMapGL.Map('baidu_map_028697996');
        mp.centerAndZoom(new BMapGL.Point(121.491, 31.233), 11);
    },
    RendererChain: function (_rendererChainParas) {
        var script = document.createElement("script");
        script.src = "https://api.map.baidu.com/api?v=1.0&type=webgl&ak=oob0EnccDlObAs8jo4jfaOPZgGCj43SU&callback=WFDCT_BaiduMapContainer.LoadJsCompleted";
        document.body.appendChild(script);

        var $singleControlElem=_rendererChainParas.$singleControlElem;
        this.InitDrawControl($singleControlElem);
    },
    RendererDataChain: function () {

    },
    GetValue: HTMLControl.GetValue,
    SetValue: HTMLControl.SetValue,
    ToViewStatus: HTMLControl.ToViewStatus,
    //region 区域绘制功能
    InitDrawControl:function ($singleControlElem) {
        var $drawControlWrap=$("<div class='baidu-map-draw-control-wrap'></div>");
        var $appendPolygonControl1=$("<div class='control polygon-control'>路径</div>");
        var $appendPolygonControl2=$("<div class='control polygon-control'>路径</div>");
        $drawControlWrap.append($appendPolygonControl1);
        $drawControlWrap.append($appendPolygonControl2);
        $singleControlElem.parent().append($drawControlWrap);
    }
    //endregion
}