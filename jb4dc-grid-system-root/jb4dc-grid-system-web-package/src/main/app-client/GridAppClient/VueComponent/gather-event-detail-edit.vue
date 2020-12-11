<template>
  <div>
    <!--事件信息编辑-->
    <div class="modal fade" id="eventEditModal" tabindex="-1" role="dialog" aria-labelledby="eventEditModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header" style="padding: 0.5rem 1rem">
            <h5 class="modal-title" id="eventEditModalLabel">事件信息登记</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="height: 570px;overflow-x:hidden;overflow-y: auto;position: relative">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" id="event-info-tab" data-toggle="tab" href="#event-info-tab-wrap" role="tab"
                   aria-controls="profile" aria-selected="true">事件</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="event-def-tab" data-toggle="tab" href="#event-def-tab-wrap" role="tab"
                   aria-controls="home" aria-selected="false">默认</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="event-person-tab" data-toggle="tab" href="#event-person-tab-wrap" role="tab"
                   aria-controls="home" aria-selected="false">人员</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="event-photo-tab" data-toggle="tab" href="#event-photo-tab-wrap" role="tab"
                   aria-controls="home" aria-selected="false">照片</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane fade show active" id="event-info-tab-wrap" role="tabpanel" aria-labelledby="event-info-tab">
                <form style="margin-top: 10px">
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>事件编号</label>
                    <div class="col-9">
                      <input type="text" class="form-control form-control-sm input-color"
                             v-model="event.editEventData.eventCode">
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>诉求问题</label>
                    <div class="col-9">
                      <textarea rows="6" class="form-control form-control-sm input-color"
                                v-model="event.editEventData.eventAppealQuestion" placeholder="诉求问题(要求)"></textarea>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>事件来源</label>
                    <div class="col-9">
                      <select class="form-control form-control-sm" v-model="event.editEventData.eventSource">
                        <option  value="">请选择</option>
                        <option  v-for="(ddItem, index) in ddg_EventSource" :value="ddItem.dictValue">{{ddItem.dictText}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>事件类型1</label>
                    <div class="col-9">
                      <select class="form-control form-control-sm" v-model="event.editEventData.eventType1">
                        <option  value="">请选择</option>
                        <option  v-for="(ddItem, index) in ddg_EventType1" :value="ddItem.dictValue">{{ddItem.dictText}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">类型备注</label>
                    <div class="col-9">
                      <input type="text" class="form-control form-control-sm input-color"
                             v-model="event.editEventData.eventType1ExText">
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">事件类型2</label>
                    <div class="col-9">
                      <select class="form-control form-control-sm" v-model="event.editEventData.eventType2">
                        <option  value="">请选择</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>事件级别</label>
                    <div class="col-9">
                      <select class="form-control form-control-sm" v-model="event.editEventData.eventLevel">
                        <option  v-for="(ddItem, index) in ddg_EventLevel" :value="ddItem.dictValue">{{ddItem.dictText}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>严重程度</label>
                    <div class="col-9">
                      <div class="form-check form-check-inline" v-for="(ddItem, index) in ddg_EventSeverity">
                        <input class="form-check-input" type="radio" name="ddg_EventSeverity" :id="'ddg_EventSeverity'+index" :value="ddItem.dictValue" v-model="event.editEventData.eventSeverity">
                        <label class="form-check-label" :for="'ddg_EventSeverity'+index">{{ddItem.dictText}}</label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>诉求目的</label>
                    <div class="col-9">
                      <select class="form-control form-control-sm" v-model="event.editEventData.eventAppealPurpose">
                        <option  v-for="(ddItem, index) in ddg_EventAppealPurpose" :value="ddItem.dictValue">{{ddItem.dictText}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">诉求人数</label>
                    <div class="col-9">
                      <input type="number" class="form-control form-control-sm input-color"
                             v-model="event.editEventData.eventAppealPersonNum">
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">发生地点</label>
                    <div class="col-9">
                      <input type="number" class="form-control form-control-sm input-color"
                             v-model="event.editEventData.eventAddress">
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">涉及人数</label>
                    <div class="col-9">
                      <input type="number" class="form-control form-control-sm input-color"
                             v-model="event.editEventData.eventAboutPersonNum">
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>是否信访件</label>
                    <div class="col-9">
                      <div class="form-check form-check-inline" v-for="(ddItem, index) in ddg_GeneralNoYes">
                        <input class="form-check-input" type="radio" name="ddg_EventIsPetition" :id="'ddg_EventIsPetition'+index" :value="ddItem.dictValue" v-model="event.editEventData.eventIsPetition">
                        <label class="form-check-label" :for="'ddg_EventIsPetition'+index">{{ddItem.dictText}}</label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>出租屋事件</label>
                    <div class="col-9">
                      <div class="form-check form-check-inline" v-for="(ddItem, index) in ddg_GeneralNoYes">
                        <input class="form-check-input" type="radio" name="ddg_EventIsRentalHousing" :id="'ddg_EventIsRentalHousing'+index" :value="ddItem.dictValue" v-model="event.editEventData.eventIsRentalHousing">
                        <label class="form-check-label" :for="'ddg_EventIsRentalHousing'+index">{{ddItem.dictText}}</label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>群体性事件</label>
                    <div class="col-9">
                      <div class="form-check form-check-inline" v-for="(ddItem, index) in ddg_GeneralNoYes">
                        <input class="form-check-input" type="radio" name="ddg_EventIsGroup" :id="'ddg_EventIsGroup'+index" :value="ddItem.dictValue" v-model="event.editEventData.eventIsGroup">
                        <label class="form-check-label" :for="'ddg_EventIsGroup'+index">{{ddItem.dictText}}</label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row form-group-min">
                    <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>群体性事件</label>
                    <div class="col-9">
                      <div class="form-check form-check-inline" v-for="(ddItem, index) in ddg_GeneralNoYes">
                        <input class="form-check-input" type="radio" name="ddg_EventIsEmergency" :id="'ddg_EventIsEmergency'+index" :value="ddItem.dictValue" v-model="event.editEventData.eventIsEmergency">
                        <label class="form-check-label" :for="'ddg_EventIsEmergency'+index">{{ddItem.dictText}}</label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="tab-pane fade" id="event-def-tab-wrap" role="tabpanel" aria-labelledby="event-def-tab">

              </div>
              <div class="tab-pane fade" id="event-person-tab-wrap" role="tabpanel" aria-labelledby="event-person-tab">

              </div>
              <div class="tab-pane fade" id="event-photo-tab-wrap" role="tabpanel" aria-labelledby="event-photo-tab">

              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary">保存事件信息</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const appClientUtility = require('../Js/AppClientUtility.js');

export default {
  name: "gather-event-detail-edit",
  data:function (){
    return {
      acInterface: {
      },
      event:{
        editEventData:{
          eventId:"",
          eventCode:"",//事件编号
          eventAcceptDate:"",//受理时间
          eventAcceptUnitName:"",//受理单位
          eventAcceptUnitId:"",//受理人单位ID
          eventAcceptUserName:"",//受理人姓名
          eventAcceptUserId:"",//受理人ID
          eventAcceptTimes:"",//受理次数
          eventAcceptGridId:"",//发生区域
          eventAcceptMapLocation:"",//事件的地理坐标
          eventSource:"",//事件来源:群众来访,群众来信,群众来电,领导批办,上级交办,部门转来,排查发现,媒体曝光,网络发现,其他途径
          eventType1:"",//事件类型第1级:矛盾纠纷,问题隐患
          eventType2:"",//事件类型第2级:[矛盾纠纷]家庭邻里,劳动社保,房屋租赁,房地产业,物业管理,行政管理,涉法涉诉,规划建设,村民股份,经济关系,特殊问题,其他矛盾,党纪政纪||[问题隐患]社会治安,市监食监,交通运输,城市管理,安全生产,消防隐患,环保生态,建设水务,计划生育,人口房屋,教育校园,药品监管,民政事务,其他隐患
          eventLevel:"",//事件级别:一级,二级,三级,四级,五级
          eventSeverity:"",//严重程度:一般,中等,重大
          eventAddress:"",//发生地点
          eventAppealPurpose:"",//诉求目的:反映建议,申诉,求决,投诉,其他
          eventAppealPersonNum:"0",//诉求人数
          eventAppealQuestion:"",//诉求问题及要求
          eventAboutPersonNum:"0",//涉及人数
          eventIsPetition:"",//是否信访件
          eventIsRentalHousing:"",//是否出租屋事件
          eventIsGroup:"",//是否群体性事件
          eventFromCode:"",//转来文号
          eventFromDate:"",//转来日期
          eventIsEmergency:"",//是否紧急事件
          eventAboutMoney:"",//涉及金额
          eventIsSpDifficult:"",//是否特别疑难件
          eventWarringLevel:"",//预警级别
          eventProcessNodeName:"",//办理状况名称
          eventProcessNodeValue:"",//办理状况值
          eventRemark:"",//备注
          eventOrderNum:"",//排序号
          eventMainAppealerName:"",//主要诉求人-姓名
          eventMainAppealerSex:"",//主要诉求人-性别
          eventMainAppealerBirthday:"",//主要诉求人-出生日期
          eventMainAppealerIdCard:"",//主要诉求人-身份证号
          eventMainAppealerPhone:"",//主要诉求人-联系电话
          eventMainAppealerAddress:"",//主要诉求人-单位或地址
          eventFellowAppealerName:"",//共同诉求人-姓名
          eventFellowAppealerSex:"",//共同诉求人-性别
          eventFellowAppealerBirthday:"",//共同诉求人-出生日期
          eventFellowAppealerIdCard:"",//共同诉求人-身份证号
          eventFellowAppealerPhone:"",//共同诉求人-联系电话
          eventFellowAppealerAddress:"",//共同诉求人-单位或地址
          eventDefePerName:"",//被反映对象-个人-姓名
          eventDefePerSex:"",//被反映对象-个人-性别
          eventDefePerBirthday:"",//被反映对象-个人-出生日期
          eventDefePerIdCard:"",//被反映对象-个人-身份证
          eventDefePerPhone:"",//被反映对象-个人-联系电话
          eventDefePerAddress:"",//被反映对象-个人-单位或者地址
          eventDefeUnitName:"",//被反映对象-单位-名称
          eventDefeUnitBusinessType:"",//被反映对象-单位-经营性质
          eventDefeUnitCreateDate:"",//被反映对象-单位-成立时间
          eventDefeUnitOrganCode:"",//被反映对象-单位-组织机构代码
          eventDefeUnitBusinessNum:"",//被反映对象-单位-营业执照号
          eventDefeUnitAddress:"",//被反映对象-单位-地址
          eventDefeUnitPhone:"",//被反映对象-单位-联系电话
          eventCityId:"",//城市Id
          eventAreaId:"",//区Id
          eventStreetId:"",//街道Id:街道,乡镇
          eventCommunityId:"",//社区Id:社区,村
          eventGridId:"",//所属网格Id
          eventType1ExText:"",//事件类型第1级补充备注
          eventMainAppealerRemark:"",//主要诉求人-备注
          eventFellowAppealerRemark:"",//共同诉求人-备注
          eventDefePerRemark:"",//被反映对象-个人-备注
          eventDefeUnitRemark:""//被反映对象-单位-备注
        },
        emptyEventData:null
      },
      ddg_EventSource:[],
      ddg_EventType1:[],
      ddg_EventLevel:[],
      ddg_EventSeverity:[],
      ddg_EventAppealPurpose:[],
      ddg_GeneralNoYes:[]
    }
  },
  props: ["session"],
  mounted() {

  },
  methods:{
    buildDDGroupData:function (){
      this.ddg_EventSource=appClientUtility.GetAllDDMap()["33dee1b4-96ae-422e-847d-5ffabc012051"];
      this.ddg_EventType1=appClientUtility.GetAllDDMap()["5d8b5a48-1916-4002-9b85-c8b95c59d200"];
      this.ddg_EventLevel=appClientUtility.GetAllDDMap()["c97de954-0bb8-476c-af2c-751301ebe2ee"];
      this.ddg_EventSeverity=appClientUtility.GetAllDDMap()["8e8ebfd5-e9ee-4475-b812-38f22223259b"];
      this.ddg_EventAppealPurpose=appClientUtility.GetAllDDMap()["74c7b050-a141-4a44-b87f-f8527d671acb"];
      this.ddg_GeneralNoYes=appClientUtility.GetAllDDMap()["77e5497e-fade-4723-b75d-232943f488a1"];

    },
    newEvent:function () {
      //debugger;
      $("#eventEditModal").modal('show');
    },
    editEvent:function (oldEditBuild){
      $("#eventEditModal").modal('show');
    }
  }
}
</script>

<style scoped>

</style>