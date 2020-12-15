<template>
  <div style="height: 100%">
    <div id="baidu_map_grid_event_edit" style="width:100%;height:100%"></div>
    <div class="map-operation-button-wrap">
      <div class="map-operation-button map-operation-button-add" @click="getCurrentPosition"></div>
      <div class="map-operation-button map-operation-button-clear"></div>
    </div>
  </div>
</template>

<script>
import appClientUtility from '../Js/AppClientUtility.js';

export default {
  name: "baidu-map-location",
  data:function (){
      return {
        map:{
          mapObj:null
        }
      };
  },
  mounted() {
    window["initBaiduMapForEvent"] = (personData,imageBase64) => {
      this.initBaiduMapForEvent(personData,imageBase64)
    }
    BaiduMapUtility.LoadJsCompleted("initBaiduMapForEvent");
  },
  methods:{
    initBaiduMapForEvent:function (){
      this.map.mapObj = new BMapGL.Map('baidu_map_grid_event_edit');
      this.map.mapObj.centerAndZoom(new BMapGL.Point(114.54200132645097, 22.754142795907825), 16);
      this.map.mapObj.enableScrollWheelZoom(true);
      this.map.mapObj.addEventListener('click', function(e) {
        //gridManager.map.selectedLngLat=e.latlng;
        console.log(e.latlng);
        /*alert('点击的经纬度：' + e.latlng.lng + ', ' + e.latlng.lat);*/
      });
    },
    getCurrentPosition:function (){
      var mapObj=this.map.mapObj;
      var _this=this;
      var geolocation = new BMapGL.Geolocation();
      geolocation.enableSDKLocation();
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          appClientUtility.DialogUtility.AlertText(_this,'您的位置：'+r.point.lng+','+r.point.lat);
          var mk = new BMapGL.Marker(r.point);
          mapObj.addOverlay(mk);
          mapObj.panTo(r.point);
          //alert('您的位置：'+r.point.lng+','+r.point.lat);
        }
        else {
          appClientUtility.DialogUtility.AlertText(_this,'failed'+this.getStatus());
          //alert('failed'+this.getStatus());
        }
      });
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
    height: 220px;
    width: 58px;
    padding: 4px;
    background-color: @g-concrete-color-v05;
    z-index: 100;

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

    .map-operation-button-add{
      /*background-image: url("../../../Png32X32/0122.png");*/
    }

    .map-operation-button-clear{
      /*background-image: url("../../../Png32X32/0277.png");*/
    }

    .map-operation-button:first-child{
      margin-top: 0px;
    }
  }
</style>