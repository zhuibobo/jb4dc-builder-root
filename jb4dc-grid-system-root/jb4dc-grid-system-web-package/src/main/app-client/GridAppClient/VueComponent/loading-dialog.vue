<template>
  <div class="loadDialogWrap" id="loadDialogWrap">
    <div class="text-center" style="margin-top: 200px">
      <div class="spinner-border" style="width: 5rem; height: 5rem;" role="status">
        <span class="sr-only">Loading....</span>
      </div>
      <div class="loadDialogWrap-close" @click="loadDialogWrapHide"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loading-dialog",
  data:function (){
    return {};
  },
  mounted() {

  },
  methods:{
    loadDialogWrapHide:function (){
      $("#loadDialogWrap").hide();
    }
  }
}
</script>

<style scoped>

</style>