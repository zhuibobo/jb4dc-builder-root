<template>
  <div>
    <div class="tool-bar">网格数据采集[{{serverSession.userName}}]</div>
    <div class="page-content-wrap" style="padding-top: 10px">
      <!--row1-->
      <div class="module-item-wrap" style="width: 50%">
        <div class="module-item module-bhpe" @click="gotoPage('GatherBuildHousePersonMainPage.html')">
            楼房人企
        </div>
      </div><div class="module-item-wrap" style="width: 50%">
        <div class="module-item module-event" @click="gotoPage('GatherEventMainPage.html')">
            网格事件
        </div>
      </div>
      <!--row2-->
      <div class="module-item-wrap" style="width: 50%" v-if="isDevUser">
        <div class="module-item module-test" @click="gotoPage('MockReadIdCardPage.html')">
          测试NFC(非诚勿扰)
        </div>
      </div><div class="module-item-wrap" style="width: 50%" v-if="isDevUser">
        <div class="module-item module-test" @click="gotoPage('MockPhotoUploadPage.html')">
          测试拍照(非诚勿扰)
        </div>
      </div>
      <!--row3-->
      <div class="module-item-wrap" style="width: 50%" @click="gotoPage206Dev()" v-if="isDevUser">
        <div class="module-item module-test">
          206模拟登录
        </div>
      </div><div class="module-item-wrap" style="width: 50%" v-if="isDevUser">
        <div class="module-item module-test">
          {{serverName}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appClientSessionUtility from '../Js/AppClientSessionUtility.js';
import axios from 'axios';
////const appClientUtility = require('../Js/AppClientUtility.js');
import appClientUtility from '../Js/AppClientUtility.js';

export default {
  name: "gather-index-root",
  data:function (){
    return {
      session:null,
      serverSession: {},
      isDevUser:false,
      serverName:"生产环境"
    }
  },
  mounted() {
    appClientSessionUtility.BuildSession();
    //console.log(appClientSessionUtility.GetSession());
    this.session=appClientSessionUtility.GetSession();
    this.isDevUser=appClientUtility.DevStatus.IsDevUser(this.session);
    this.serverName=appClientUtility.DevStatus.GetServerName();

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
      url = appClientUtility.StringUtility.FormatGoToUrl(url,this.session);
      window.location.href=url;
    },
    gotoPage206Dev:function (){
      window.location.href="http://192.168.3.206:9106/GridSystem/HTML/Grid/Dev/GotoPage.html?ts="+Date.now();
    },
    isDev:function (){
      this.$toasted.show('别点我,开发中...',{duration:2000});
    }
  }
}
</script>

<style scoped lang="less">
  @import "../Less/Variable.less";

  .page-content-wrap{
    position: absolute;
    top: 41px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    /*background-color: @g-concrete-color-v02;*/

    .module-item-wrap{
      display:inline-block;
      /*background-color: rgb(249, 231, 159,0.8);*/
      margin: 0px;
      border: 0px;

      .module-item{
        /*height: 10px;*/
        margin: 10px 5px 10px 10px;
        background-color: rgba(252, 243, 207,0.2);
        border: solid 1px @g-peter-river-color-v05;
        text-align: center;
        border-radius: 8px;
        padding-top: 90px;
        padding-bottom: 10px;
        box-shadow: 5px 5px 2px #cdcdcd;
        font-weight: bold;
        background-repeat: no-repeat;
        background-position-x: center;
        background-position-y:10px;
      }

      .module-item:active{
        /*height: 10px;*/
        background-color: @g-active-v1;
      }

      .module-bhpe{
        background-image: url("../Images/icons8-index-bhpe-80.png");
      }

      .module-event{
        background-image: url("../Images/icons8-index-event-80.png");
      }

      .module-test{
        background-image: url("../Images/icons8-index-sex-80.png");
      }
    }
  }
</style>