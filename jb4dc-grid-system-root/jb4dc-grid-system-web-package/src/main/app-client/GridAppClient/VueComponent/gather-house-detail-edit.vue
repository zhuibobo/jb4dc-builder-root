<template>
  <div>
    <!--房屋形象编辑-->
    <div class="modal fade" id="normalHouseEditModal" tabindex="-1" role="dialog" aria-labelledby="normalHouseEditModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header" style="padding: 1.5rem 1rem">
            <h5 class="modal-title" id="normalHouseEditModalLabel">房屋信息登记</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="height: 570px;overflow-x:hidden;overflow-y: auto;position: relative">
            <div class="accordion" id="accordionHouseEdit">
              <div class="card">
                <div class="card-header" style="padding: 0px">
                  <h2 class="mb-md-1" style="margin-bottom: 0px">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#houseEditBaseInfo"
                            aria-expanded="true" aria-controls="houseEditBaseInfo">
                      房屋信息信息
                    </button>
                  </h2>
                </div>
                <div id="houseEditBaseInfo" class="collapse show" data-parent="#accordionHouseEdit">
                  <div class="card-body" style="padding: 0.7rem">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" @click="saveHouseTo()">保存房屋信息</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "gather-house-detail-edit",
  data:function (){
    return {
      house:{
        editHouseData:{
          houseId:"",
          houseBuildId:"",//所在建筑物ID
          houseCode:"",//房屋编码
          houseNumName:"",//房号
          houseCodeFull:"",//完整编码
          houseFloorNum:"",//楼层
          houseUsedDesc:"",//使用情况
          houseDesignFor:"",//设计用途:商业,办公,住宅,厂房,仓库,其它
          houseDesignArea:"",//设计面积
          houseUseFor:"",//使用用途:商业,办公,住宅,厂房,仓库,其它
          houseUseArea:"",//使用面积
          houseStructure:"",//住宅房型
          houseIsRentalHousing:"",//是否出租屋:是,否
          houseRemark:"",//备注
          houseOrderNum:"",//排序号
          houseInputUnitName:"",//填报单位
          houseInputUnitId:"",//填报单位
          houseInputDate:"",//登记时间
          houseInputUserName:"",//登记人
          houseInputUserId:""//登记人ID
        },
        houseRelevanter:{
          reterId:"",
          reterHouseId:"",//房屋ID
          reterType:"",//相关人员类型:产权人,代理人
          reterName:"",//相关人员姓名
          reterPhone:"",//相关人员电话号码
          reterCertCategory:"",//相关人员证件类别
          reterCertCode:"",//证件号码
          reterAddress:"",//地址
          reterPercent:"",//产权比例
          reterRemark:"",//备注
          reterOrderNum:""//排序号
        }
      }
    }
  },
  mounted() {

  },
  methods:{
    saveHouseTo:function (){

    }
  }
}
</script>

<style scoped>

</style>