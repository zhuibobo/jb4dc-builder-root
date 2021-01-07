<template>
  <div>
    <div style="padding: 4px;height: 44px">
      <div style="float: right">
        <a href="javascript:;" class="file">
          <input type="file" accept="video/*" @change="changeFile">录像
        </a>
      </div>
    </div>
    <div class="photo-list-wrap" :style="getVideoListWrapStyle()">
      <div class="photo-single-outer-wrap" v-for="singleVideo in videos">
        <div class="delete-photo" @click="deleteSingleVideo(singleVideo)"></div>
        <div class="photo-single-inner-wrap" style="margin-top: 40px">
          <video style="width: 100%" controls="controls">
            <source :src="buildSingleVideoUrl(singleVideo)" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
////const appClientUtility = require('../Js/AppClientUtility.js');
import appClientUtility from '../Js/AppClientUtility.js';

export default {
  name: "video-list",
  props: ["objType", "session","videoListWrapHeight"],
  data:function (){
    return {
      acInterface: {
        getVideoFileListData: "/GridSystem/Rest/Builder/RunTime/FileRuntime/GetVideoFileListData",
        getDisplayVideoUrl: "/GridSystem/Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId",
        deleteFile: "/GridSystem/Rest/Builder/RunTime/FileRuntime/DeleteFileByFileId"
      },
      videos:[],
      recordId:"",
    }
  },
  mounted() {
  },
  methods:{
    getVideoListWrapStyle:function (){
      if(this.videoListWrapHeight){
        return {"height":this.videoListWrapHeight}
      }
      return {};
    },
    setRecordId:function (recordId){
      this.recordId=recordId;
    },
    loadVideoFromServer: function () {
      console.log(this.session);
      var recordId = this.recordId;
      //this.recordId=oldRecordId;
      //console.log(this.recordId);
      console.log(recordId);
      axios.get(this.acInterface.getVideoFileListData, {
        params: {
          objId: recordId,
          categoryType: "*",
          AppClientToken: this.session.AppClientToken,
          ts: Date.now()
        }
      }).then((response) => {
        console.log(response);
        if (response.data.success) {
          this.videos = response.data.data;
        }
      })
    },
    changeFile: function (event) {
      //console.log(event);
      //debugger;
      var recordId = this.recordId;
      if (appClientUtility.StringUtility.IsNullOrEmpty(recordId)) {
        appClientUtility.DialogUtility.AlertText(this, "无法确认关联记录ID!!");
      } else {
        var file = event.target.files[0]
        if (!/\.(mp4|avi)$/.test(event.target.value)) {
          appClientUtility.DialogUtility.AlertText(this,"视频类型必须是.mp4、.avi中的一种");
          return false
        }
        let data = event.target.result;

        let formData = new FormData();
        formData.append('imgStream',file);
        formData.append('objType', this.objType);
        formData.append('objId', recordId);
        formData.append('categoryType', '*');
        formData.append('fileName', 'test.mp4');
        formData.append('AppClientToken', this.session.AppClientToken);
        formData.append('ts', Date.now());
        console.log('正在上传视频。。。')
        axios.post('/GridSystem/Rest/Builder/RunTime/FileRuntime/UploadVideo', formData).then((response)=>{
          //endFunc(result);
          appClientUtility.DialogUtility.AlertText(this, response.data.message);
          if (response.data.success) {
            this.loadVideoFromServer();
          }
        }).catch((err)=>{

        }).then((endResult)=>{

        });
      }
    },
    clearPhotoList:function (){
      this.photos=[];
    },
    deleteSingleVideo:function (singlePhoto){
      appClientUtility.DialogUtility.Confirm(this, "确实删除该文件?", (confirm) => {
        if(confirm) {
          var fileId = singlePhoto.fileId;
          //获取建筑物相关照片
          axios.delete(this.acInterface.deleteFile, {
            params: {
              fileId: fileId,
              AppClientToken: this.session.AppClientToken,
              ts: Date.now()
            }
          }).then((response) => {
            //console.log(response);
            appClientUtility.DialogUtility.AlertText(this, response.data.message);
            if (response.data.success) {
              this.loadVideoFromServer();
            }
          })
        }
      });
    },
    buildSingleVideoUrl:function (singleVideo){
      return this.acInterface.getDisplayVideoUrl + "?fileId=" + singleVideo.fileId;
    }
  }
}
</script>

<style scoped>

</style>