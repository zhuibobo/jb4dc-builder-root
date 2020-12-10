<template>
  <div class="gather-event-main-root">
    <div class="tool-bar">
      <div class="tool-bar-back" @click="gotoPage('GatherIndexMainPage.html')"></div>
      事件采集
    </div>
    <div>
      <div style="padding: 4px;height: 44px">
        <div style="float: right">
          <button type="button" class="btn btn-success" @click="addEvent()">新增事件</button>
        </div>
      </div>
      <div class="gather-event-list-wrap">
        <div class="gather-event-single-wrap" v-for="i in 10">
          <div class="text-wrap">
            <div class="text">关于明天天气会更好的问题关于明天天气会更好的问题关于明天天气会更好的问题关于明天天气会更好的问题</div>
            <div class="text" style="width: 30%">严重程度</div>
            <div class="text" style="width: 20%">重大</div>
            <div class="text" style="width: 24%">级别</div>
            <div class="text" style="width: 20%">一级</div>
            <div class="text" style="width: 24%;border-bottom: 0px">发生地点</div>
            <div class="text" style="width: 73%;border-bottom: 0px">探讨探讨搪突鼍獭瞋妥妥帖帖搪突鼍獭瞋</div>
          </div>
          <div class="button-wrap">
            <div class="edit"></div>
            <div class="del"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appClientSessionUtility from '../Js/AppClientSessionUtility.js';
import axios from 'axios';
const appClientUtility = require('../Js/AppClientUtility.js');

export default {
  name: "gather-event-main-root",
  data:function (){
    return {

    }
  },
  mounted() {
    appClientSessionUtility.BuildSession();
    this.session=appClientSessionUtility.GetSession();
  },
  methods:{
    gotoPage:function (url){
      url=appClientUtility.StringUtility.FormatGoToUrl(url,this.session);
      window.location.href=url;
    },
    addEvent:function (){

    }
  }
}
</script>

<style scoped lang="less">
@import "../Less/Variable.less";

.gather-event-main-root{
  background-color: @g-concrete-color-v01;

  position:absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;

  .gather-event-list-wrap{
    /*background-color: #0F74A8;*/
    position: absolute;
    top: 88px;
    bottom: 0px;
    left: 0px;
    right: 0px;

    .gather-event-single-wrap{
      border: @g-concrete-color-v08 1px solid;
      background-color: @g-concrete-color-v02;
      margin: 4px;
      border-radius: 4px;
      box-shadow: 2px 2px 1px #cdcdcd;

      .text-wrap{
        display: inline-block;
        width: 78%;
        overflow: hidden;

        .text{
          padding: 4px;
          display: inline-block;
          font-size: 13px;
          border-bottom: @g-concrete-color-v06 dotted 1px;
        }

        .text:last-child{
          border-bottom: @g-concrete-color-v06 dotted 0px;
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
          margin-left: 14px;
        }

        .edit:active{
          background-color: @g-active-v1;
        }

        .del {
          width: 32px;
          height: 32px;
          border-bottom: 0px dotted @g-concrete-color-v08;
          border-radius: 0px;
          background-image: url("../Images/icons8-del-30.png");
          background-repeat: no-repeat;
          margin-top: 14px;
          margin-left: 14px;
        }
      }
    }
  }
}

</style>