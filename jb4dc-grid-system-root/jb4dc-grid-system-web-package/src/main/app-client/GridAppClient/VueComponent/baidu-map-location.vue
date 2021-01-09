<template>
  <div style="height: 100%">
    <div id="baidu_map_grid_event_edit" style="width:100%;height:100%"></div>
    <div class="map-operation-button-wrap">
      <div class="map-operation-button map-operation-button-location" @click="getCurrentPosition"></div>
      <div class="map-operation-button map-operation-button-add" @click="addNewMarker"></div>
      <div class="map-operation-button map-operation-button-del" @click="removeMarker"></div>
    </div>
  </div>
</template>

<script>
import appClientUtility from '../Js/AppClientUtility.js';
import appBridgeUtility from '../Js/AppBridgeUtility.js';

export default {
  name: "baidu-map-location",
  props: ["searchCurrentPositionAutoMarker", "session"],
  data:function (){
      return {
        map:{
          mapObj:null,
          selectedLngLat:null,
          mapEditObjs:[]
        },
        oldDataArray:null,
        searchCurrentPositionTime:0
      };
  },
  mounted() {
    window["initBaiduMapForEvent"] = (personData,imageBase64) => {
      this.initBaiduMapForEvent(personData,imageBase64)
    }
    //alert(1);
    window["confirmBaiduMapCurrentPosition"] = (lat,lng) => {
      this.confirmCurrentPosition(lat,lng)
    }
  },
  methods:{
    initBaiduMapForEvent:function (){
      this.map.mapObj = new BMapGL.Map('baidu_map_grid_event_edit');
      this.map.mapObj.centerAndZoom(new BMapGL.Point(114.54200132645097, 22.754142795907825), 18);
      this.map.mapObj.enableScrollWheelZoom(true);
      this.map.mapObj.addEventListener('click', (e)=> {
        this.map.selectedLngLat=e.latlng;
        console.log(e.latlng);
        /*alert('点击的经纬度：' + e.latlng.lng + ', ' + e.latlng.lat);*/
      });

      if(this.oldDataArray&&this.oldDataArray.length>0){
        //var oldDataArray = appClientUtility.JsonUtility.StringToJson(oldData);
        for (let i = 0; i < this.oldDataArray.length; i++) {
          var singleData = this.oldDataArray[i];
          if (singleData.type == "point") {
            var lng = singleData.path.lng;
            var lat = singleData.path.lat;
            var point = new BMapGL.Point(lng, lat);
            var mk = new BMapGL.Marker(point, {
              icon: this.getMarkIcon()
            });
            this.map.mapObj.addOverlay(mk);
            this.addToMapEditObjs("point", mk);
            window.setTimeout(()=>{
              this.map.mapObj.panTo(point);
            },400);
          }
        }
      }
      else {
        this.removeMarker();
      }
    },
    getCurrentPosition:function (){
      var mapObj=this.map.mapObj;
      var _this=this;

      appBridgeUtility.searchCurrentPosition(this,"confirmBaiduMapCurrentPosition");
      this.searchCurrentPositionTime=0;
    },
    confirmCurrentPosition:function (lat,lng){
      if(this.searchCurrentPositionTime>0){
        return;
      }
      this.searchCurrentPositionTime=1;
      appClientUtility.DialogUtility.HideLoading();
      this.map.selectedLngLat={lng:parseFloat(lng),lat:parseFloat(lat)};

      var mapObj = this.map.mapObj;
      var point = new BMapGL.Point(lng, lat);
      mapObj.panTo(point);

      if(this.searchCurrentPositionAutoMarker){
        appClientUtility.DialogUtility.Confirm(this,"清空旧的标记,并在当前位置添加标记?",(confirm)=>{
          if(confirm){
            this.removeMarker();
            this.addNewMarker();
          }
        })
      }
      //appClientUtility.DialogUtility.AlertText(this,lat+"],,["+lng);
      appBridgeUtility.stopCurrentPosition();
    },
    addToMapEditObjs:function(type,editObj){
      this.map.mapEditObjs.push({"type":type, "obj": editObj});
    },
    getMarkIcon:function (){
      var myIcon = new BMapGL.Icon("/GridSystem/HTML/GridAppClient/Images/icons8-mark2-96.png", new BMapGL.Size(48, 48));
      //var myIcon = new BMapGL.Icon("https://static.wixstatic.com/media/5c33f5_32921b32f34c4928ba07d8cbc9a1d4d7~mv2.gif", new BMapGL.Size(32, 32));
      return myIcon;
    },
    addNewMarker:function (){
      if(this.map.selectedLngLat==null){
        appClientUtility.DialogUtility.AlertText(this,"请先点击要添加标签的位置!");
        return;
      }
      var mapObj=this.map.mapObj;
      var point = new BMapGL.Point(this.map.selectedLngLat.lng,this.map.selectedLngLat.lat);
      var mk = new BMapGL.Marker(point,{
        icon: this.getMarkIcon()
      });
      mapObj.addOverlay(mk);
      this.addToMapEditObjs("point",mk);
    },
    removeMarker:function (){
      for (var i = 0; i < this.map.mapEditObjs.length; i++) {
        var editObj=this.map.mapEditObjs[i];
        this.map.mapObj.removeOverlay(editObj.obj);
      }
      this.map.mapEditObjs=[];
    },
    getValue:function (){
      var mapData = [];
      if(this.map.mapEditObjs&&this.map.mapEditObjs.length>0) {
        for (var i = 0; i < this.map.mapEditObjs.length; i++) {
          if(this.map.mapEditObjs[i].type=="point") {
            mapData.push({
              "type": this.map.mapEditObjs[i].type,
              "path": this.map.mapEditObjs[i].obj.getPosition()
            });
          }
        }

      }
      mapData = JsonUtility.JsonToString(mapData);
      return mapData;
    },
    setValue:function (oldData){
      if(oldData) {
        var mapObj = this.map.mapObj;
        var oldDataArray = appClientUtility.JsonUtility.StringToJson(oldData);
        this.oldDataArray=oldDataArray;
      }

      BaiduMapUtility.LoadJsCompleted("initBaiduMapForEvent");
    }
  }
}
</script>

<style scoped lang="less">
  @import "../Less/Variable.less";
  .map-operation-button-wrap {
    position: absolute;
    top: 63px;
    right: 20px;
    height: 169px;
    width: 58px;
    padding: 4px;
    background-color: @g-concrete-color-v04;
    z-index: 100;
    opacity: 0.9;

    .map-operation-button{
      width: 50px;
      height: 50px;
      color: @g-pomegranate-color-v06;
      border: #0F74A8 solid 1px;
      border-radius: 4px;
      background-color: @g-concrete-color-v01;
      margin-top: 4px;
      cursor: pointer;
      background-position: 9px 9px;
      background-repeat: no-repeat;
    }

    .map-operation-button:hover{
      background-color: @g-concrete-color-v03;
    }

    .map-operation-button-add {
      background-image: url("../Images/icons8-map-add-point-32.png");
    }

    .map-operation-button-location{
      background-image: url("../Images/icons8-map-location-32.png");
    }

    .map-operation-button-del{
      background-image: url("../Images/icons8-del-32.png");
    }

    .map-operation-button:first-child{
      margin-top: 0px;
    }
  }
</style>