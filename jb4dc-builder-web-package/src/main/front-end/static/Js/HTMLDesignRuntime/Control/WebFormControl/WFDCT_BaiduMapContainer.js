var WFDCT_BaiduMapContainer= {
    _prop:{
        elemId:"",
        clientInstanceName:"",
        $singleControlElem:null,
        mapObj:null,
        mapSelectedLngLat:"",
        mapObjs:null
    },
    LoadBaiDuJsCompleted:function() {
        var _this=this;
        this._prop.mapObj = new BMapGL.Map(this._prop.elemId);
        this._prop.mapObj.centerAndZoom(new BMapGL.Point(114.54200132645097, 22.754142795907825), 16);
        this._prop.mapObj.enableScrollWheelZoom(true);
        this._prop.mapObj.addEventListener('click', function(e) {
            _this._prop.mapSelectedLngLat=e.latlng;
        });
        this.InitDrawControl();
    },
    InitializeAtInstance:function(initializeParas,clientInstanceName,elemId){
        //debugger;

    },
    RendererChain: function (_rendererChainParas) {
        /*var script = document.createElement("script");11
        script.src = "https://api.map.baidu.com/api?v=1.0&type=webgl&ak=oob0EnccDlObAs8jo4jfaOPZgGCj43SU&callback=WFDCT_BaiduMapContainer.LoadJsCompleted";
        document.body.appendChild(script);*/
        console.log(_rendererChainParas);
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        //this.InitDrawControl($singleControlElem);

        this._prop.elemId=$singleControlElem.attr("id");
        this._prop.clientInstanceName=$singleControlElem.attr("client_instance_name");
        this._prop.$singleControlElem=$singleControlElem;
        $("#"+this._prop.elemId).addClass("map-control-wrap");
        //console.log(clientInstanceName);
        var loadFunc=this._prop.clientInstanceName+".LoadBaiDuJsCompleted";
        BaiduMapUtility.LoadJsCompleted(loadFunc);
    },
    RendererDataChain: function () {

    },
    GetValue: HTMLControl.GetValue,
    SetValue: HTMLControl.SetValue,
    ToViewStatus: HTMLControl.ToViewStatus,
    //region 区域绘制功能
    InitDrawControl:function () {
        var $singleControlElem=this._prop.$singleControlElem;
        $singleControlElem.parent().addClass("map-control-wrap")
        var $drawControlWrap=$("<div class='map-operation-button-wrap'></div>");
        var $appendAddPointControl=$("<div class='map-operation-button map-operation-button-add-point' title='添加定位点'></div>");
        var $appendClearControl=$("<div class='map-operation-button map-operation-button-clear' title='清空设置'></div>");
        $drawControlWrap.append($appendAddPointControl);
        $drawControlWrap.append($appendClearControl);
        $singleControlElem.parent().append($drawControlWrap);

        var _this=this;
        $appendAddPointControl.click(function (){
            if(!_this._prop.mapSelectedLngLat){
                DialogUtility.AlertText("请先点击地图，确认坐标。");
            }

            var point = new BMapGL.Point(_this._prop.mapSelectedLngLat.lng,_this._prop.mapSelectedLngLat.lat);
            var marker = new BMapGL.Marker(point, {
                enableDragging: true
            });
            _this._prop.mapObj.addOverlay(marker);
            //_this._prop.mapAction="appNewPoint";
        });
    }
    //endregion
}