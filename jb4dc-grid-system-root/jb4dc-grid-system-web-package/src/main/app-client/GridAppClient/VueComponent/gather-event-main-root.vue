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
        <!--mescroll滚动区域的基本结构-->
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <div class="gather-event-single-wrap" v-for="item in dataList">
              <div class="text-wrap">
                <div class="text" style="width: 100%;">{{item.eventAppealQuestion}}</div>
                <div class="text" style="width: 30%">严重程度</div>
                <div class="text" style="width: 20%">{{item.eventSeverity}}</div>
                <div class="text" style="width: 24%">级别</div>
                <div class="text" style="width: 20%">{{item.eventLevel}}</div>
                <div class="text" style="width: 24%;border-bottom: 0px">发生地点</div>
                <div class="text" style="width: 73%;border-bottom: 0px">{{item.eventAddress}}</div>
              </div>
              <div class="button-wrap">
                <div class="edit" @click="editEvent(item)"></div>
                <div class="del" @click="deleteEvent(item)"></div>
              </div>
            </div>
        </mescroll-vue>
      </div>
    </div>
    <gatherEventDetailEdit :session="session" ref="gatherEventDetailEditObj" @saveEventCompleted="saveEventCompleted"></gatherEventDetailEdit>
    <loadingDialog></loadingDialog>
    <div id="list-empty-wrap" class="list-empty-wrap"></div>
  </div>
</template>

<script>
import appClientSessionUtility from '../Js/AppClientSessionUtility.js';
import axios from 'axios';
////const appClientUtility = require('../Js/AppClientUtility.js');
import appClientUtility from '../Js/AppClientUtility.js';

import MescrollVue from 'mescroll.js/mescroll.vue'

export default {
  name: "gather-event-main-root",
  components: {
    MescrollVue // 注册mescroll组件
  },
  data:function (){
    return {
      acInterface: {
        deleteEvent:"/GridSystem/Rest/Grid/Event/EventMain/DeleteEvent"
      },
      session:null,
      mescroll: null, // mescroll实例对象
      mescrollDown:{}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: { // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        /*toTop: {
          //回到顶部按钮
          src: "./static/mescroll/mescroll-totop.png", //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },*/
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "list-empty-wrap", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "/GridSystem/HTML/GridAppClient/Images/icons8-empty-list-100.png", //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      dataList: [] // 列表数据
    }
  },
  mounted() {
    appClientSessionUtility.BuildSession();
    this.session=appClientSessionUtility.GetSession();
  },
  methods:{
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit (mescroll) {
      this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback (page, mescroll) {
      // 联网请求
      axios.get('/GridSystem/Rest/Grid/Event/EventMain/GetMyEventIncludeDD', {
        params: {
          num: page.num, // 页码
          size: page.size, // 每页长度
          AppClientToken: this.session.AppClientToken,
          ts:Date.now()
        }
      }).then((response) => {
        if(page.num==1) {
          appClientUtility.AutoBindInitDD(response.data.exKVData.dictionaryEntities);
          appClientUtility.ConvertDDListToMap(response.data.exKVData.dictionaryEntities);
          appClientUtility.SetGridInfo(response.data.exKVData.gridInfoEntity);
          this.$refs.gatherEventDetailEditObj.buildDDGroupData();
        }

        // 请求的列表数据
        let arr = response.data.data;
        // 如果是第一页需手动置空列表
        if (page.num === 1) this.dataList = []
        // 把请求到的数据添加到列表
        this.dataList = this.dataList.concat(arr)
        // 数据渲染成功后,隐藏下拉刷新的状态
        this.$nextTick(() => {
          mescroll.endSuccess(arr.length)
        })
      }).catch((e) => {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescroll.endErr()
      })
    },
    gotoPage:function (url){
      url=appClientUtility.StringUtility.FormatGoToUrl(url,this.session);
      window.location.href=url;
    },
    addEvent:function (){
      this.$refs.gatherEventDetailEditObj.newEvent();
    },
    saveEventCompleted:function (eventData){
      $("#list-empty-wrap").hide();
      this.dataList.unshift(eventData);
    },
    editEvent:function (eventData){
      this.$refs.gatherEventDetailEditObj.editEvent(eventData.eventId);
    },
    deleteEvent:function (eventData){
      appClientUtility.DialogUtility.Confirm(this,"确认删除该事件吗?",(cof)=>{
        if(cof){
          appClientUtility.DialogUtility.ShowLoading();
          axios.delete(this.acInterface.deleteEvent, {
            params: {
              "eventId": eventData.eventId
            }
          }).then((result) => {
            appClientUtility.DialogUtility.AlertText(this,result.data.message);
            if (result.data.success) {
              appClientUtility.DialogUtility.HideLoading();
              for (let i = 0; i < this.dataList.length; i++) {
                if(this.dataList[i].eventId==eventData.eventId){
                  appClientUtility.ArrayUtility.Delete(this.dataList,i);
                }
              }
            }
          }).then((endResult) => {
            $("#loadDialogWrap").hide();
          });
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "../Less/Variable.less";

.gather-event-main-root{
  background-color: @g-concrete-color-v02;

  position:absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;

  .gather-event-list-wrap{
    /*background-color: #0F74A8;*/
    top: 84px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    position: absolute;

    .gather-event-single-wrap{
      border: @g-concrete-color-v08 1px solid;
      background-color: @g-concrete-color-v00;
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
          margin-top: 8px;
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
          margin-top: 8px;
          margin-left: 14px;
        }
      }
    }
  }
}

</style>