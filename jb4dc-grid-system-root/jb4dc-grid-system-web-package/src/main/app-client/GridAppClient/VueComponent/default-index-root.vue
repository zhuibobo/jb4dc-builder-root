<template>
  <div>
    <div>
      <!-- Slider main container -->
      <div class="swiper-container">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">
            <img src="../Images/DefaultIndex/1.png" style="width: 100%;height: 200px">
          </div>
          <div class="swiper-slide">
            <img src="../Images/DefaultIndex/2.png" style="width: 100%;height: 200px">
          </div>
          <div class="swiper-slide">
            <img src="../Images/DefaultIndex/3.png" style="width: 100%;height: 200px">
          </div>
          <div class="swiper-slide">
            <img src="../Images/DefaultIndex/4.png" style="width: 100%;height: 200px">
          </div>
          <div class="swiper-slide">
            <img src="../Images/DefaultIndex/5.png" style="width: 100%;height: 200px">
          </div>
          <div class="swiper-slide">
            <img src="../Images/DefaultIndex/6.png" style="width: 100%;height: 200px">
          </div>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <div class="content-wrap">
      <div class="my-info-wrap">
        <div class="my-info-text">当前用户：{{serverSession.userName}}</div>
        <div class="my-info-text">所在网格：{{serverSession.organName}}</div>
        <div class="my-info-text">网格编号：{{gridInfo.gridCode}}</div>
      </div>
      <div class="new-info-wrap">
        <div class="new-info-category">通知公告
          <div class="more">更多...</div>
        </div>
        <div>
          <ul class="new-info-ul">
            <li>暂无公告</li>
          </ul>
        </div>
        <div class="new-info-category">工作指引
          <div class="more">更多...</div>
        </div>
        <div>
          <ul class="new-info-ul">
            <a @click="gotoPage('ViewDemoPage.html?view=1')"><li>网格员工作内容</li></a>
            <a @click="gotoPage('ViewDemoPage.html?view=2')"><li>大亚湾区网格员队伍管理办法</li></a>
          </ul>
        </div>
        <div class="new-info-category">工作文件
          <div class="more">更多...</div>
        </div>
        <div>
          <ul class="new-info-ul">
            <li>暂无文件</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appClientSessionUtility from '../Js/AppClientSessionUtility.js';
import axios from 'axios';
// import Swiper JS
import Swiper from 'swiper/bundle';
// import Swiper styles
import 'swiper/swiper-bundle.css';

//const appClientUtility = require('../Js/AppClientUtility.js');

import appClientUtility from '../Js/AppClientUtility.js';

export default {
  name: "default-index-root",
  data:function (){
    return {
      session:null,
      serverSession:{},
      gridInfo:{}
    };
  },
  mounted() {
    appClientSessionUtility.BuildSession();
    this.session=appClientSessionUtility.GetSession();

    var swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
    });

    appClientSessionUtility.GetSessionFromServerByTokenId(this.session.AppClientToken, (response)=>{
      if(response.data.success){
        this.serverSession=response.data.data;
        this.gridInfo=response.data.exKVData.gridInfoEntity;
        console.log(this.gridInfo);
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
    }
  }
}
</script>

<style scoped lang="less">
  @import "../Less/Variable.less";

  .content-wrap{
    position: absolute;
    top: 200px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: @g-concrete-color-v00;

    .my-info-wrap{
      border: 1px solid @g-concrete-color-v04;
      margin: 6px;
      border-radius: 6px;
      height: 100px;
      background-color: #ffffff;
      box-shadow: 2px 2px 1px #cdcdcd;

      .my-info-text{
        font-size: 13px;
        line-height: 33px;
        padding-left: 10px;
      }
    }

    .new-info-wrap{
      position: absolute;
      top: 114px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      overflow-y: auto;
      overflow-x: hidden;

      .new-info-category{
        padding-left: 26px;
        line-height: 24px;
        height: 24px;
        background-image: url("../Images/icons8-list-24.png");
        background-repeat: no-repeat;
        font-size: 14px;
        margin-bottom: 6px;

        .more{
          float: right;
          margin-right: 10px;
        }
      }

      .new-info-ul{
        border-bottom: 1px solid @g-concrete-color-v04;
        border-top: 1px solid @g-concrete-color-v04;
        background-color: #ffffff;
        min-height: 150px;
        margin-bottom: 10px;
        padding-left: 16px;

        li{
          font-size: 14px;
          line-height: 34px;
          height: 34px;
          list-style-type:none;
          background-image: url("../Images/icons8-front1-24.png");
          background-position: center right;
          background-repeat: no-repeat;
        }

        li:active{
          background-color: @g-active-v1;
        }
      }
    }
  }

  .swiper-container {
    width: 100%;
    height: 200px;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
</style>