var WFDCT_BaiduMapContainer= {
    _prop:{
        elemId:"",
        clientInstanceName:"",
        $singleControlElem:null,
        mapObj:null,
        mapSelectedLngLat:"",
        mapEditObjs:[],
        mapViewObjs:[],
        oldEditData:null,
        operationType:""
    },
    LoadBaiDuJsCompleted:function() {
        var _this=this;
        this._prop.mapObj = new BMapGL.Map(this._prop.elemId);
        this._prop.mapObj.centerAndZoom(new BMapGL.Point(114.54200132645097, 22.754142795907825), 16);
        this._prop.mapObj.enableScrollWheelZoom(true);
        this._prop.mapObj.addEventListener('click', function(e) {
            _this._prop.mapSelectedLngLat=e.latlng;
        });

        if(!BaseUtility.IsViewOperation(this._prop.operationType)){
            this.InitDrawControl();
        }

        if(this._prop.oldEditData){
            var mapData=this._prop.oldEditData;
            for (var i = 0; i <mapData.length; i++) {
                if(mapData[i].type=="point"){
                    var point = new BMapGL.Point(mapData[i].path.lng,mapData[i].path.lat);
                    var marker = new BMapGL.Marker(point, {
                        enableDragging: true
                    });
                    this._prop.mapObj.addOverlay(marker);
                    this.addToMapEditObjs("point",marker);
                }
            }
        }
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
        this._prop.operationType=_rendererChainParas.formRuntimeInstance._Prop_Config.OperationType;
        $("#"+this._prop.elemId).addClass("map-control-wrap");
        //console.log(clientInstanceName);
        var loadFunc=this._prop.clientInstanceName+".LoadBaiDuJsCompleted";
        BaiduMapUtility.LoadJsCompleted(loadFunc);
    },
    RendererDataChain: function () {

    },
    GetValue: function ($elem, originalData, paras){
        var mapData = [];
        //debugger;
        if(this._prop.mapEditObjs&&this._prop.mapEditObjs.length>0) {

            for (var i = 0; i < this._prop.mapEditObjs.length; i++) {
                if(this._prop.mapEditObjs[i].type=="point") {
                    mapData.push({
                        "type": this._prop.mapEditObjs[i].type,
                        "path": this._prop.mapEditObjs[i].obj.getPosition()
                    });
                }
            }
            mapData = JsonUtility.JsonToString(mapData);
        }
        originalData.value=mapData;
        return originalData;
    },
    SetValue: function ($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas){
        if(fieldPO&&fieldPO.value){
            //console.log(fieldPO);
            //$elem.val(fieldPO.value);
            //$elem.attr("control_value",fieldPO.value);
            this._prop.oldEditData=JsonUtility.StringToJson(fieldPO.value);
        }
    },
    ToViewStatus:function($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas){
        //$(".map-operation-button-wrap").hide();
    },
    addToMapEditObjs:function(type,editObj){
        this._prop.mapEditObjs.push({"type":type, "obj": editObj});
    },
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
            _this.addToMapEditObjs("point",marker);
            //_this._prop.mapAction="appNewPoint";
        });
        $appendClearControl.click(function (){
            for (var i = 0; i < _this._prop.mapEditObjs.length; i++) {
                var editObj=_this._prop.mapEditObjs[i];
                _this._prop.mapObj.removeOverlay(editObj.obj);
            }
            _this._prop.mapEditObjs=[];
        });
    }
    //endregion
}