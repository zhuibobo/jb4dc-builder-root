<template>
  <div class="gather-bhpe-data-main-root">
    <div class="tool-bar">
      <div class="tool-bar-back" @click="gotoPage('GatherIndexMainPage.html')"></div>
      楼房人企采集[{{serverSession.userName}}]
    </div>
    <div class="build-root-wrap">
      <div class="title">建筑物</div>
      <div style="padding: 4px;height: 44px">
        <div style="float: right">
          <button type="button" class="btn btn-success" @click="addNormalBuild()">+建筑物</button>
          <button type="button" class="btn btn-danger" @click="addSpBuild()">+特殊</button>
        </div>
      </div>
      <div style="padding: 4px">
        <input type="text" class="form-control" placeholder="输入编号或门牌地址" v-model="build.searchText" aria-describedby="basic-addon1" @keyup="filterBuildArray">
      </div>
      <div class="all-build-wrap">
        <div class="single-build" :class="{'single-build-selected':singleBuildData.buildId == selected,'single-build-sp':singleBuildData.buildCategory=='特殊建筑物'}" v-for="singleBuildData in build.filterBuilds" @click="loadHouseListFromServer(singleBuildData)">
          <div class="text-wrap">
            <div class="code">{{singleBuildData.buildCode.substring(8)}}</div>
            <div class="text">{{singleBuildData.buildAddress}}</div>
          </div>
          <div class="button-wrap">
            <div class="edit" @click="editBuild(singleBuildData)"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="house-root-wrap">
      <div class="title">房屋</div>
      <div style="padding: 4px;height: 44px">
        <div style="float: right">
          <button type="button" class="btn btn-success" @click="addHouse()">+房屋</button>
        </div>
      </div>
      <div style="padding: 4px">
        <input type="text" class="form-control" placeholder="输入编码或房号" v-model="house.searchText" aria-label="Username" aria-describedby="basic-addon1" @keyup="filterHouseArray">
      </div>
      <div class="all-house-wrap">
        <div class="single-house" v-for="singleHouseData in house.filterHouses">
          <div class="text-wrap">
            <div class="code">{{singleHouseData.houseCode}}</div>
            <div class="text">{{singleHouseData.houseNumName}}</div>
          </div>
          <div class="button-wrap">
            <div class="edit" @click="editHouse(singleHouseData)"></div>
            <div class="list" @click="beginEditHouseInner(singleHouseData)" data-toggle="modal" data-target="#loadHouseInnerAboutWrapDialog"></div>
          </div>
        </div>
      </div>
    </div>
    <gatherNormalBuildDetailEdit :session="session" ref="gatherNormalBuildDetailEditObj" @saveNormalBuildCompleted="saveNormalBuildCompleted" @tryDeleteBuild="tryDeleteBuild"></gatherNormalBuildDetailEdit>
    <gatherSPBuildDetailEdit :session="session" ref="gatherSPBuildDetailEditObj" @saveNormalBuildCompleted="saveNormalBuildCompleted" @tryDeleteBuild="tryDeleteBuild"></gatherSPBuildDetailEdit>
    <gatherHouseDetailEdit :session="session" :selected-build="build.selectedBuild" ref="gatherHouseDetailEditObj" @saveHouseCompleted="saveHouseCompleted" @tryDeleteHouse="tryDeleteHouse"></gatherHouseDetailEdit>
    <gatherHouseInnerAboutList :selected-house="house.selectedHouse" :selected-build="build.selectedBuild" :session="session" ref="gatherHouseInnerAboutListObj"></gatherHouseInnerAboutList>
    <!--<div class="loadDialogWrap" id="loadDialogWrap">
      <div class="text-center" style="margin-top: 200px">
        <div class="spinner-border" style="width: 5rem; height: 5rem;" role="status">
          <span class="sr-only">Loading....</span>
        </div>
        <div class="loadDialogWrap-close" @click="loadDialogWrapHide"></div>
      </div>
    </div>-->
    <loadingDialog></loadingDialog>
  </div>
</template>

<script>
import appClientSessionUtility from '../Js/AppClientSessionUtility.js';
import axios from 'axios';
////const appClientUtility = require('../Js/AppClientUtility.js');
import appClientUtility from '../Js/AppClientUtility.js';


export default {
  name: "gather-bhpe-data-main-root",
  data:function () {
    return {
      session: null,
      serverSession: {},
      selected:undefined,
      acInterface: {
        //Build
        getMyBuild: "/GridSystem/Rest/Grid/Build/BuildMain/GetMyBuildIncludeDD",
        deleteBuild: "/GridSystem/Rest/Grid/Build/BuildMain/Delete",
        //House
        getHouseByBuildId: "/GridSystem/Rest/Grid/Build/HouseInfo/GetHouseByBuildId",
        deleteHouse: "/GridSystem/Rest/Grid/Build/HouseInfo/Delete"
      },
      build:{
        searchText:"",
        allBuilds:[],
        filterBuilds:[],
        selectedBuild:null
      },
      house:{
        searchText:"",
        allHouse:[],
        filterHouses:[],
        selectedHouse:null
      }
    }
  },
  mounted() {
    appClientSessionUtility.BuildSession();
    console.log(appClientSessionUtility.GetSession());
    this.session=appClientSessionUtility.GetSession();
    this.loadBuildListFromServer(true);

    appClientSessionUtility.GetSessionFromServerByTokenId(this.session.AppClientToken, (response)=>{
      if(response.data.success){

        this.serverSession=response.data.data;
        this.gridInfo=response.data.exKVData.gridInfoEntity;
        /*console.log(this.gridInfo);*/
      }
      else {
        appClientUtility.DialogUtility.AlertText(this,response.data.message);
      }
    });
  },
  methods:{
    gotoPage:function (url){
      url=appClientUtility.StringUtility.FormatGoToUrl(url,this.session);
      window.location.href=url;
    },
    /*loadDialogWrapHide:function (){
      $("#loadDialogWrap").hide();
    },*/
    //region 建筑物
    saveNormalBuildCompleted:function (){
      this.loadBuildListFromServer(false);
    },
    saveHouseCompleted:function (){
      this.loadHouseListFromServer(this.build.selectedBuild);
    },
    loadBuildListFromServer:function (rebindDD) {
      axios.get(this.acInterface.getMyBuild, {
        params: {
          includeGrid: "false",
          AppClientToken: this.session.AppClientToken,
          ts:Date.now()
        }
      }).then((response) => {
        console.log(response);
        if (response.data.success) {
          this.build.allBuilds = response.data.data;
          this.build.filterBuilds=this.build.allBuilds.filter((item)=>{return true});

          if(rebindDD) {
            appClientUtility.AutoBindInitDD(response.data.exKVData.dictionaryEntities);
            appClientUtility.ConvertDDListToMap(response.data.exKVData.dictionaryEntities);
            appClientUtility.SetGridInfo(response.data.exKVData.gridInfoEntity);
            this.$refs.gatherNormalBuildDetailEditObj.buildDDGroupData();
            this.$refs.gatherSPBuildDetailEditObj.buildDDGroupData();
            this.$refs.gatherHouseDetailEditObj.buildDDGroupData();
          }
        }
      }).catch(function (error) {
        console.log(error);
      })
    },
    filterBuildArray:function (){
        /*if(this.searchText==""){
          return this.build.allBuilds;
        }
        else{
          return this.build.allBuilds.filter((item)=> {
            return item.buildCode.indexOf(this.build.searchText)>0
          })
        }*/
      console.log(this.build.searchText);
      if(this.build.searchText==""){
        this.build.filterBuilds=this.build.allBuilds.filter((item)=>{return true});
      }
      else {
        this.build.filterBuilds = this.build.allBuilds.filter((item) => {
          return item.buildCode.substring(8).indexOf(this.build.searchText) > 0||item.buildAddress.indexOf(this.build.searchText) > 0;
        })
      }
    },
    searchBuild:function (){
      //this.build.allBuilds = response.data.data;
    },
    addNormalBuild:function (){
      this.$refs.gatherNormalBuildDetailEditObj.newBuild();
    },
    addSpBuild:function (){
      //this.$toasted.show('开发中.',{duration:2000});
      this.$refs.gatherSPBuildDetailEditObj.newBuild();
    },
    editBuild:function (buildData){
      if(buildData.buildCategory=='特殊建筑物'){
        this.$refs.gatherSPBuildDetailEditObj.editBuild(buildData);
      }
      else {
        this.$refs.gatherNormalBuildDetailEditObj.editBuild(buildData);
      }
      //this.$toasted.show('开发中.',{duration:2000});
    },
    tryDeleteBuild:function (buildData){
      console.log(buildData.buildId);
      $("#loadDialogWrap").show();
      axios.delete(this.acInterface.deleteBuild, {
        params: {
          "recordId": buildData.buildId
        }
      }).then((result) => {
        appClientUtility.DialogUtility.AlertText(this,result.data.message);
        if (result.data.success) {
          this.loadBuildListFromServer(false);
          $("#normalBuildEditModal").modal('hide');
          $("#spBuildEditModal").modal('hide');
        }
      }).then((endResult) => {
        $("#loadDialogWrap").hide();
      });
    },
    tryDeleteHouse:function (houseData){
      $("#loadDialogWrap").show();
      axios.delete(this.acInterface.deleteHouse, {
        params: {
          "recordId": houseData.houseId
        }
      }).then((result) => {
        appClientUtility.DialogUtility.AlertText(this,result.data.message);
        if (result.data.success) {
          this.loadHouseListFromServer(this.build.selectedBuild);
          $("#normalHouseEditModal").modal('hide');
        }
      }).then((endResult) => {
        $("#loadDialogWrap").hide();
      });
    },
    //endregion
    //region 房屋
    addHouse:function (){
      if(this.build.selectedBuild) {
        this.$refs.gatherHouseDetailEditObj.newHouse();
      }
      else{
        this.$toasted.show('请先选择建筑物!',{duration:2000});
      }
    },
    loadHouseListFromServer:function (singleBuildData) {
      //console.log(event);
      $("#loadDialogWrap").show();
      var buildId=singleBuildData.buildId;
      this.build.selectedBuild=singleBuildData;
      this.house.allHouse = [];
      this.house.searchText="";
      this.selected=buildId;
      //$(event.target).addClass("single-build-selected");
      axios.get(this.acInterface.getHouseByBuildId, {
        params: {
          buildId: buildId,
          AppClientToken: this.session.AppClientToken,
          ts:Date.now()
        }
      }).then((response) => {
        console.log(response);
        if (response.data.success) {
          this.house.allHouse = response.data.data;
          this.house.filterHouses=this.house.allHouse.filter((item)=>{return true});
        }
      }).catch(function (error) {
        console.log(error);
      }).then(()=>{
        $("#loadDialogWrap").hide();
      })
    },
    filterHouseArray:function (){
      if(this.house.searchText==""){
        this.house.filterHouses=this.house.allHouse.filter((item)=>{return true});
      }
      else {
        this.house.filterHouses = this.house.allHouse.filter((item) => {
          return item.houseCode.indexOf(this.house.searchText) > 0||item.houseNumName.indexOf(this.house.searchText) > 0;
        })
      }
    },
    editHouse:function (singleHouseData){
      //this.$toasted.show('开发中.',{duration:2000});
      this.$refs.gatherHouseDetailEditObj.editHouse(singleHouseData);
    },
    beginEditHouseInner:function (singleHouseData){
      this.house.selectedHouse=singleHouseData;
      this.$refs.gatherHouseInnerAboutListObj.loadHouseInnerDataFromServer(singleHouseData);
      console.log(this.house.selectedHouse);
    }
    //endregion
    //人口1
    //企业法人
  }
}
</script>

<style scoped lang="less">
  @import "../Less/Variable.less";

  .gather-bhpe-data-main-root{
    background-color: @g-concrete-color-v00;

    position:absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;

    .page-title{
      text-align: center;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
    }
    .build-root-wrap{
      position:absolute;
      border-radius: 4px;
      border: @g-concrete-color-v04 1px solid;
      width: 48%;
      left: 4px;
      top: 44px;
      bottom: 4px;

      .title{
        border-bottom: @g-concrete-color-v06 1px dotted;
        height: 30px;
        text-align: center;
        line-height: 30px;
      }

      .all-build-wrap{
        position:absolute;
        width: 100%;
        left: 0px;
        top: 120px;
        bottom: 0px;
        overflow: auto;

        .single-build{
          border: @g-concrete-color-v08 1px solid;
          background-color: @g-concrete-color-v02;
          margin: 4px;
          border-radius: 4px;
          box-shadow: 2px 2px 1px #cdcdcd;

          .text-wrap{
            display: inline-block;
            width: 78%;
            overflow: hidden;

            .code{
              padding: 4px;
            }
            .text{
              padding: 4px;
            }
          }

          .button-wrap{
            float: right;
            width: 19%;
            overflow: hidden;
            height: 100%;

            .edit{
              width: 32px;
              height: 32px;
              border-bottom: 1px dotted @g-concrete-color-v08;
              border-radius: 4px;
              background-image: url("../Images/icons8-edit-30.png");
              background-repeat: no-repeat;
              margin-top: 14px;
            }

            .edit:active{
              background-color: @g-active-v1;
            }
          }
        }

        .single-build-sp{
          border: @g-pomegranate-color-v05 1px solid;
          background-color:@g-pomegranate-color-v01 ;
        }

        .single-build-selected{
          border: @g-sunflower-color-v07 1px solid;
          background-color:@g-sunflower-color-v01 ;
        }
      }
    }
    .house-root-wrap{
      position:absolute;
      border-radius: 4px;
      border: @g-concrete-color-v04 1px solid;
      width: 48%;
      right: 4px;
      top: 44px;
      bottom: 4px;

      .title{
        border-bottom: @g-concrete-color-v06 1px dotted;
        height: 30px;
        text-align: center;
        line-height: 30px;
      }

      .all-house-wrap{
        position:absolute;
        width: 100%;
        left: 0px;
        top: 120px;
        bottom: 0px;
        overflow: auto;

        .single-house{
          border: @g-concrete-color-v08 1px solid;
          margin: 4px;
          border-radius: 4px;
          min-height: 100px;
          box-shadow: 2px 2px 1px #cdcdcd;

          .text-wrap{
            display: inline-block;
            width: 78%;
            overflow: hidden;

            .code{
              padding: 4px;
            }
            .text{
              padding: 4px;
            }
          }

          .button-wrap{
            float: right;
            width: 19%;
            overflow: hidden;
            height: 100%;

            .edit{
              width: 32px;
              height: 32px;
              border-bottom: 1px dotted @g-concrete-color-v08;
              border-radius: 4px;
              background-image: url("../Images/icons8-edit-30.png");
              background-repeat: no-repeat;
              margin-top: 14px;
            }
            .edit:active{
              background-color: @g-active-v1;
            }

            .list{
              width: 32px;
              height: 32px;
              border-bottom: 1px dotted @g-concrete-color-v08;
              border-radius: 4px;
              background-image: url("../Images/icons8-list-30.png");
              background-repeat: no-repeat;
              margin-top: 14px;
            }
            .list:active{
              background-color: @g-active-v1;
            }
          }
        }

        .single-house:active{
          background-color: @g-active-v1;
        }
      }
    }
  }

</style>