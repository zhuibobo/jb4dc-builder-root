<template>
  <div>
    <!--一般建筑物编辑-->
    <div class="modal fade" id="spBuildEditModal" tabindex="-1" role="dialog" aria-labelledby="spBuildEditModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header" style="padding: 0.5rem 1rem">
            <h5 class="modal-title" id="spBuildEditModalLabel">特殊建筑物信息登记</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="height: 570px;overflow-x:hidden;overflow-y: auto;position: relative">
            <div class="accordion" id="accordionspBuildEdit">
              <!--基础信息-->
              <div class="card">
                <div class="card-header" style="padding: 0px">
                  <h2 class="mb-md-1" style="margin-bottom: 0px">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#spBuildEditBaseInfo"
                            aria-expanded="true" aria-controls="spBuildEditBaseInfo">
                      特殊建筑物信息
                    </button>
                  </h2>
                </div>
                <div id="spBuildEditBaseInfo" class="collapse show" data-parent="#accordionspBuildEdit">
                  <div class="card-body" style="padding: 0.7rem;height: 440px;overflow-y:auto;overflow-x: hidden">
                    <form>
                      <div class="form-group row form-group-min">
                        <label for="spBuildCode" class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>建筑物编码</label>
                        <div class="col-9">
                          <input type="text" class="form-control form-control-sm input-color" id="spBuildCode" placeholder="建筑物编码"
                                 v-model="build.editBuildData.buildCode" :readonly="enableEditCode? false : 'readonly'">
                        </div>
                        <label for="spBuildCode" class="col-12 col-form-label text-center col-form-label-sm form-label-min"><span style="color: red">请补充建筑物的4位独立编码,例如0001</span></label>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="spBuildAddress" class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>详细地址</label>
                        <div class="col-12">
                          <input type="text" class="form-control form-control-sm input-color" id="spBuildAddress" placeholder=""
                                 v-model="build.editBuildData.buildAddress">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="spBuildCoveredArea" class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>总面积M²</label>
                        <div class="col-9">
                          <input type="number" class="form-control form-control-sm input-color" id="spBuildCoveredArea" placeholder="总面积M²"
                                 v-model="build.editBuildData.buildCoveredArea">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="spBuildFloorGround" class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>总层数</label>
                        <div class="col-9">
                          <input type="number" class="form-control form-control-sm input-color" id="spBuildFloorGround" placeholder="总层数"
                                 v-model="build.editBuildData.buildFloorGround">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="spBuildSpOwnerName" class="col-3 col-form-label text-right col-form-label-sm form-label-min">建筑物业主</label>
                        <div class="col-9">
                          <input type="text" class="form-control form-control-sm input-color" id="spBuildSpOwnerName" placeholder="建筑物业主-姓名"
                                 v-model="build.editBuildData.buildSpOwnerName">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="spBuildSpOwnerPhone" class="col-3 col-form-label text-right col-form-label-sm form-label-min">联系电话</label>
                        <div class="col-9">
                          <input type="text" class="form-control form-control-sm input-color" id="spBuildSpOwnerPhone" placeholder="建筑物业主-联系电话"
                                 v-model="build.editBuildData.buildSpOwnerPhone">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="spBuildSpOwnerAddress" class="col-3 col-form-label text-right col-form-label-sm form-label-min">联系地址</label>
                        <div class="col-9">
                          <input type="text" class="form-control form-control-sm input-color" id="spBuildSpOwnerAddress" placeholder="建筑物业主-联系地址"
                                 v-model="build.editBuildData.buildSpOwnerAddress">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="spBuildSpType" class="col-3 col-form-label text-right col-form-label-sm form-label-min">建筑物类型</label>
                        <div class="col-9">
                          <select id="spBuildSpType" class="form-control form-control-sm" v-model="build.editBuildData.buildSpType">
                            <option  v-for="(ddItem, index) in ddg_BuildSpType" :value="ddItem.dictValue">{{ddItem.dictText}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="spBuildSpUseFor" class="col-3 col-form-label text-right col-form-label-sm form-label-min">使用用途</label>
                        <div class="col-9">
                          <select id="spBuildSpUseFor" class="form-control form-control-sm" v-model="build.editBuildData.buildSpUseFor">
                            <option  v-for="(ddItem, index) in ddg_BuildSpUseFor" :value="ddItem.dictValue">{{ddItem.dictText}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="spBuildSpStructure" class="col-3 col-form-label text-right col-form-label-sm form-label-min">结构</label>
                        <div class="col-9">
                          <input type="text" class="form-control form-control-sm input-color" id="spBuildSpStructure" placeholder=""
                                 v-model="build.editBuildData.buildSpStructure">
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <!--拍照上传-->
              <div class="card">
                <div class="card-header" style="padding: 0px">
                  <h2 class="mb-md-1" style="margin-bottom: 0px">
                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                            data-target="#spBuildEditFile" aria-expanded="false" aria-controls="spBuildEditFile">
                      照片
                    </button>
                  </h2>
                </div>
                <div id="spBuildEditFile" class="collapse" data-parent="#accordionspBuildEdit">
                  <div class="card-body" style="padding: 0.7rem">
                    <photoList ref="photoListObj" :session="session" :obj-type="'建筑物'"></photoList>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="deleteBuild()" v-if="enableDelete">删除</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" @click="saveNormalBuildTo()">保存特殊建筑物信息</button>
          </div>
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
  name: "gather-sp-build-detail-edit",
  data:function (){
    return {
      acInterface: {
        //person
        //getPersonByHouseId: "/GridSystem/Rest/Grid/Person/PersonMain/GetPersonByHouseId",
        saveBuildData: "/GridSystem/Rest/Grid/Build/BuildMain/SaveBuildData",
      },
      build:{
        editBuildData:{
          buildId:"",
          buildCategory:"",//建筑物分类:一般建筑物,特殊建筑物
          buildFileCode:"",//档案代码
          buildCityId:"",//城市Id
          buildAreaId:"",//区Id
          buildStreetId:"",//街道Id:街道,乡镇
          buildCommunityId:"",//社区Id:社区,村
          buildGridId:"",//所属网格Id
          buildMapLocation:"",//建筑物的地理坐标
          buildCode:"",//建筑物编码:441325 -______-____-____
          buildType:"楼房",//建筑物类型:楼房,平房,别墅
          buildStatus:"已竣工",//建筑状态:已竣工,在建,停建
          buildCoveredArea:"",//总建筑面积*（M²）
          buildFloorGround:1,//总楼层-地面
          buildFloorUnderground:0,//总楼层-地下
          buildAddress:"",//门牌地址
          buildAddressEx2:"",//门牌地址2
          buildOtherAddressEx1:"",//其他地址1
          buildOtherAddressEx2:"",//其他地址2
          buildAddressTitleCer:"",//产权证地址
          buildName:"",//建筑物名称
          buildFunctionCategory:"",//建筑物功能分类
          buildProperty:"",//建筑物性质:非自建,单位自建,集体自建,个人自建
          buildIsEntranceGuard:"",//门禁:是,否
          buildIsVideoMonitoring:"",//视频监控:是,否
          buildManagement:"",//物业管理单位
          buildContact:"",//联系人
          buildContactPhone:"",//联系电话
          buildStructure:"",//结构:框架结构,砖混结构,框筒结构,框剪结构,简易结构,钢结构,钢混结构,砖木结构,其它,不详
          buildDesignFor:"",//设计用途:综合,住宅,商住,商业,厂房,仓库,办公,公共设施,其它,不详。[与特殊建筑物共用]
          buildFloorDes:"",//楼房建筑类型:超高层楼宇（100米或34层以上）,高层楼宇（19-33层或100米以下）,中高层楼宇（12-18层）,小高层楼宇（7-11层）,多层建筑（6层以下）
          buildParkingNum:"",//车位数
          buildIsElevator:"",//电梯:是,否
          buildCheckIsGrid:"",//综管所核查情况-所属网格是否正确:是,否
          buildCheckIsCode:"",//综管所核查情况-编码类型是否正确:是,否
          buildCheckIsAddress:"",//综管所核查情况-地址填写是否正确:是,否
          buildCheckIsMap:"",//综管所核查情况-地图位置标注是否正确:是,否
          buildCheckIsGroupCode:"",//综管所核查情况-是否符合编码划分规则:是,否
          buildCheckIsFloorNum:"",//综管所核查情况-总楼层是否正确:是,否
          buildCheckIsUser:"",//综管所核查情况-核查人
          buildCheckIsDate:"",//综管所核查情况-核查日期
          buildInputUnitName:"",//填报单位
          buildInputUnitId:"",//填报单位
          buildInputDate:"",//登记时间
          buildInputUserName:"",//登记人
          buildInputUserId:"",//登记人ID
          buildRemark:"",//备注
          buildSpAddress:"",//特殊类建筑物-详细地址
          buildSpOwnerName:"",//特殊类建筑物-建筑物业主
          buildSpOwnerAddress:"",//特殊类建筑物-建筑物业主-联系地址
          buildSpOwnerPhone:"",//特殊类建筑物-建筑物业主-联系电话
          buildSpType:"",//特殊类建筑物-建筑物类型:铁皮房,工棚,窝棚,看守棚,集装箱、大型装箱,危房,其它
          buildSpUseFor:"",//特殊类建筑物-使用用途
          buildSpStructure:"",//特殊类建筑物-结构
          buildChildCount:"",//子节点数量
          buildIsVirtual:"",//是否虚拟
          buildOrderNum:"",//排序号
          buildParentId:"",//父节点ID
          buildParentIdList:"",//父节点列表
          buildRecordStatus:"启用"//状态
        },
        emptyBuildData: null
      },
      ddg_BuildSpType:[],
      ddg_BuildSpUseFor:[],
      enableDelete:false,
      enableEditCode:true
    }
  },
  props: ["session"],
  mounted() {
    this.build.emptyBuildData = appClientUtility.JsonUtility.CloneStringify(this.build.editBuildData);
  },
  methods:{
    buildDDGroupData:function (){
      this.ddg_BuildSpType=appClientUtility.GetAllDDMap()["230556b4-6d38-4ebe-b694-3e119932d628"];
      this.ddg_BuildSpUseFor=appClientUtility.GetAllDDMap()["c5b385ef-e2de-4e7a-b5d8-3cfa8fdfcd7a"];
    },
    newBuild:function () {
      //debugger;
      $("#spBuildEditModal").modal('show');
      this.build.editBuildData = appClientUtility.JsonUtility.CloneStringify(this.build.emptyBuildData);
      this.build.editBuildData.buildId = appClientUtility.StringUtility.NewH5AppRecordId();
      this.build.editBuildData.buildCode=appClientUtility.GetGridInfo().gridCode;
      this.build.editBuildData.buildCategory="特殊建筑物";
      this.build.editBuildData.buildCityId="4413";
      this.build.editBuildData.buildAreaId="441325";
      this.$refs.photoListObj.setRecordId(this.build.editBuildData.buildId);
      this.$refs.photoListObj.clearPhotoList();
      this.enableDelete=false;
      this.enableEditCode=true;
    },
    editBuild:function (oldEditBuild){
      this.build.editBuildData=oldEditBuild;
      this.$refs.photoListObj.setRecordId(this.build.editBuildData.buildId);
      this.$refs.photoListObj.loadPhotoFromServer(this.build.editBuildData.buildId);
      $("#spBuildEditModal").modal('show');
      this.enableDelete=true;
      this.enableEditCode=false;
    },
    deleteBuild:function (){
      appClientUtility.DialogUtility.Confirm(this,"确实删除该记录吗?",()=>{
        this.$emit('tryDeleteBuild',this.build.editBuildData);
      });
    },
    saveNormalBuildTo:function (){
      //debugger;
      var errorMessage = "";
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.build.editBuildData.buildCode)) {
        errorMessage += "[建筑物编码不能为空!]<br />";
      }
      if (this.build.editBuildData.buildCode.length!=18) {
        errorMessage += "[建筑物编码必须要为18位!]<br />";
      }
      if (isNaN(this.build.editBuildData.buildCoveredArea)) {
        errorMessage += "[总建筑面积必须是数字!]<br />";
      }
      if (isNaN(this.build.editBuildData.buildFloorGround)) {
        errorMessage += "[总层数必须是数字!]<br />";
      }
      if (isNaN(this.build.editBuildData.buildFloorUnderground)) {
        errorMessage += "[地下层数必须是数字!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.build.editBuildData.buildAddress)) {
        errorMessage += "[详细地址不能为空!]<br />";
      }

      if (errorMessage) {
        appClientUtility.DialogUtility.AlertText(this, errorMessage);
        return;
      }

      $("#loadDialogWrap").show();

      axios.post(this.acInterface.saveBuildData, this.build.editBuildData).then((result) => {
        //console.log(result);
        if(result.data.success){
          this.$emit('saveNormalBuildCompleted')
        }
        appClientUtility.DialogUtility.AlertText(this, result.data.message,()=>{
          if(result.data.success){
            //this.loadHouseEnterpriseFromServer(this.selectedHouse);
            $('#spBuildEditModal').modal('hide');
          }
        });
      }).catch((err) => {

      }).then((endResult) => {
        $("#loadDialogWrap").hide();
      });
    }
  }
}
</script>

<style scoped>

</style>