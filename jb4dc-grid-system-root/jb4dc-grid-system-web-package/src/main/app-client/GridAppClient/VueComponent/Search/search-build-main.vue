<template>
  <div class="full-page">
    <div class="tool-bar">
      <div class="tool-bar-back" @click="back()"></div>
      建筑物搜索
    </div>
    search-build-main1
  </div>
</template>

<script>
import appClientSessionUtility from '../../Js/AppClientSessionUtility.js';
import axios from 'axios';
import appClientUtility from '../../Js/AppClientUtility.js';

export default {
  name: "search-build-main",
  data:function (){
    return {
      session:null
    }
  },
  mounted() {
    this.session=appClientSessionUtility.GetSession();
    console.log(this.session);
  },
  methods:{
    back:function (){
      this.$router.back(-1);
    }
  }
}
</script>

<style scoped>
  .full-page{
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: #F9E79F;
  }
</style>