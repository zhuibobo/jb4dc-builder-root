<template>
  <div>
    <div style="padding: 4px;height: 44px">
      <div style="float: right">
        <a href="javascript:;" class="file">
          <input type="file" accept="image/*;capture=camera" @change="changeFile">拍照
        </a>
      </div>
    </div>
    <div class="photo-list-wrap">
      <div class="photo-single-outer-wrap" v-for="singlePhoto in photos">
        <div class="delete-photo" @click="deleteSinglePhoto(singlePhoto)"></div>
        <div class="photo-single-inner-wrap">
          <img :src="buildSinglePhotoUrl(singlePhoto)" style="width: 100%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const appClientUtility = require('../Js/AppClientUtility.js');

export default {
  name: "photo-list",
  props: ["objType", "session"],
  data:function (){
    return {
      acInterface: {
        //file
        getImageFileListData: "/GridSystem/Rest/Builder/RunTime/FileRuntime/GetImageFileListData",
        getDisplayImageUrl: "/GridSystem/Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId",
        deleteFile: "/GridSystem/Rest/Builder/RunTime/FileRuntime/DeleteFileByFileId"
      },
      photos:[],
      recordId:"",
    }
  },
  mounted() {

  },
  methods:{
    setRecordId:function (recordId){
      this.recordId=recordId;
    },
    changeFile: function (event) {
      //console.log(event);
      var recordId = this.recordId;
      if (appClientUtility.StringUtility.IsNullOrEmpty(recordId)) {
        appClientUtility.DialogUtility.AlertText(this, "无法确认关联记录ID!");
      } else {
        var reader = new FileReader();
        reader.onload = (e) => {
          //console.log(e);
          //console.log(this.result);
          appClientUtility.FileUtility.CompressImage(this.session, e.target.result, recordId, this.objType, "img.jpg", "*", (result) => {
            appClientUtility.DialogUtility.AlertText(this, result.data.message);
            this.loadPhotoFromServer();
          });
          //compress(this.result);
        };
        if (event.target.files[0]) {
          reader.readAsDataURL(event.target.files[0]);
        }
      }
    },
    loadPhotoFromServer: function () {
      var recordId = this.recordId;
      //this.recordId=oldRecordId;
      //console.log(this.recordId);
      console.log(recordId);
      axios.get(this.acInterface.getImageFileListData, {
        params: {
          objId: recordId,
          categoryType: "*",
          AppClientToken: this.session.AppClientToken,
          ts: Date.now()
        }
      }).then((response) => {
        console.log(response);
        if (response.data.success) {
          this.photos = response.data.data;
        }
      })
    },
    clearPhotoList:function (){
      this.photos=[];
    },
    deleteSinglePhoto:function (singlePhoto){
      appClientUtility.DialogUtility.Confirm(this, "确实删除该文件?", () => {
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
            this.loadPhotoFromServer();
          }
        })
      });
    },
    buildSinglePhotoUrl:function (singlePhoto){
      return this.acInterface.getDisplayImageUrl + "?fileId=" + singlePhoto.fileId;
    }
  }
}
</script>

<style scoped>

</style>