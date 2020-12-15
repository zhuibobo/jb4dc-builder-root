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
                <a class="nav-link nav-link-min active" id="event-info-tab" data-toggle="tab" href="#event-info-tab-wrap" role="tab"
                   aria-controls="profile" aria-selected="true">事件</a>
              </li>
              <li class="nav-item">
                <a class="nav-link nav-link-min" id="event-person-tab" data-toggle="tab" href="#event-person-tab-wrap" role="tab"
                   aria-controls="home" aria-selected="false">人员</a>
              </li>
              <li class="nav-item">
                <a class="nav-link nav-link-min" id="event-photo-tab" data-toggle="tab" href="#event-photo-tab-wrap" role="tab"
                   aria-controls="home" aria-selected="false">照片</a>
              </li>
              <li class="nav-item">
                <a class="nav-link nav-link-min" id="event-map-tab" data-toggle="tab" href="#event-map-tab-wrap" role="tab"
                   aria-controls="home" aria-selected="false">位置</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane fade show active" id="event-info-tab-wrap" role="tabpanel" aria-labelledby="event-info-tab">
                <div class="event-form-height">
                  <form style="margin-top: 10px">
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>事件编号</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventCode">
                      </div>
                      <label class="col-12 col-form-label text-center col-form-label-sm form-label-min"><span style="color: red">请填写3位序号</span></label>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>诉求问题</label>
                      <div class="col-9">
                        <textarea rows="6" class="form-control form-control-sm input-color"
                                  v-model="event.editEventData.eventAppealQuestion" placeholder="诉求问题(要求)"></textarea>
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">受理次数</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventAcceptTimes">
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
                        <select class="form-control form-control-sm" v-model="event.editEventData.eventType1" @change="eventType1Change">
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
                          <option  v-for="(ddItem, index) in ddg_EventType2" :value="ddItem.dictValue">{{ddItem.dictText}}</option>
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
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>发生地点</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
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
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min"><span style="color: red">*</span>紧急事件</label>
                      <div class="col-9">
                        <div class="form-check form-check-inline" v-for="(ddItem, index) in ddg_GeneralNoYes">
                          <input class="form-check-input" type="radio" name="ddg_EventIsEmergency" :id="'ddg_EventIsEmergency'+index" :value="ddItem.dictValue" v-model="event.editEventData.eventIsEmergency">
                          <label class="form-check-label" :for="'ddg_EventIsEmergency'+index">{{ddItem.dictText}}</label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="tab-pane fade" id="event-person-tab-wrap" role="tabpanel" aria-labelledby="event-person-tab">
                <div class="event-form-height">
                  <form style="margin-top: 10px">
                    <div class="form-group row form-group-min event-form-group-caption">
                      <label class="col-12 col-form-label col-form-label-sm form-label-min">主要诉求人</label>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">姓名</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventMainAppealerName">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">性别</label>
                      <div class="col-9">
                        <div class="form-check form-check-inline" v-for="(ddItem, index) in ddg_GeneralSex">
                          <input class="form-check-input" type="radio" name="ddg_EventMainAppealerSex" :id="'ddg_EventMainAppealerSex'+index" :value="ddItem.dictValue" v-model="event.editEventData.eventMainAppealerSex">
                          <label class="form-check-label" :for="'ddg_EventMainAppealerSex'+index">{{ddItem.dictText}}</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">出生日期</label>
                      <div class="col-9">
                        <date-picker v-model="event.editEventData.eventMainAppealerBirthday" valueType="format" :editable="false"></date-picker>
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">身份证号</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventMainAppealerIdCard">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">联系电话</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventMainAppealerPhone">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">单位或地址</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventMainAppealerAddress">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">备注</label>
                      <div class="col-9">
                        <textarea rows="4" class="form-control form-control-sm input-color"
                                  v-model="event.editEventData.eventMainAppealerRemark"></textarea>
                      </div>
                    </div>
                    <div class="form-group row form-group-min" style="display: flex;justify-content:flex-end;padding-right: 10px;margin-bottom: 20px">
                      <button type="button" class="btn btn-success btn-sm" @click="readEventMainAppealerInfoByIdCard">读取主要诉求人身份证</button>
                    </div>
                    <div class="form-group row form-group-min event-form-group-caption">
                      <label class="col-12 col-form-label col-form-label-sm form-label-min">共同诉求人</label>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">姓名</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventFellowAppealerName">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">性别</label>
                      <div class="col-9">
                        <div class="form-check form-check-inline" v-for="(ddItem, index) in ddg_GeneralSex">
                          <input class="form-check-input" type="radio" name="ddg_EventFellowAppealerSex" :id="'ddg_EventFellowAppealerSex'+index" :value="ddItem.dictValue" v-model="event.editEventData.eventFellowAppealerSex">
                          <label class="form-check-label" :for="'ddg_EventFellowAppealerSex'+index">{{ddItem.dictText}}</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">出生日期</label>
                      <div class="col-9">
                        <date-picker v-model="event.editEventData.eventFellowAppealerBirthday" valueType="format" :editable="false"></date-picker>
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">身份证号</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventFellowAppealerIdCard">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">联系电话</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventFellowAppealerPhone">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">单位或地址</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventFellowAppealerAddress">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">备注</label>
                      <div class="col-9">
                        <textarea rows="4" class="form-control form-control-sm input-color"
                                  v-model="event.editEventData.eventFellowAppealerRemark"></textarea>
                      </div>
                    </div>
                    <div class="form-group row form-group-min" style="display: flex;justify-content:flex-end;padding-right: 10px;margin-bottom: 20px">
                      <button type="button" class="btn btn-success btn-sm" @click="readEventFellowAppealerInfoByIdCard">读取共同诉求人身份证</button>
                    </div>
                    <div class="form-group row form-group-min event-form-group-caption">
                      <label class="col-12 col-form-label col-form-label-sm form-label-min">被反映人</label>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">姓名</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefePerName">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">性别</label>
                      <div class="col-9">
                        <div class="form-check form-check-inline" v-for="(ddItem, index) in ddg_GeneralSex">
                          <input class="form-check-input" type="radio" name="ddg_EventDefePerSex" :id="'ddg_EventDefePerSex'+index" :value="ddItem.dictValue" v-model="event.editEventData.eventDefePerSex">
                          <label class="form-check-label" :for="'ddg_EventDefePerSex'+index">{{ddItem.dictText}}</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">出生日期</label>
                      <div class="col-9">
                        <date-picker v-model="event.editEventData.eventDefePerBirthday" valueType="format" :editable="false"></date-picker>
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">身份证号</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefePerIdCard">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">联系电话</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefePerPhone">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">单位或地址</label>
                      <div class="col-9">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefePerAddress">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-3 col-form-label text-right col-form-label-sm form-label-min">备注</label>
                      <div class="col-9">
                        <textarea rows="4" class="form-control form-control-sm input-color"
                                  v-model="event.editEventData.eventDefePerRemark"></textarea>
                      </div>
                    </div>
                    <div class="form-group row form-group-min" style="display: flex;justify-content:flex-end;padding-right: 10px;margin-bottom: 20px">
                      <button type="button" class="btn btn-success btn-sm" @click="readEventDefePersonInfoByIdCard">读取被反映人身份证</button>
                    </div>
                    <div class="form-group row form-group-min event-form-group-caption">
                      <label class="col-12 col-form-label col-form-label-sm form-label-min">被反映单位</label>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-4 col-form-label text-right col-form-label-sm form-label-min">单位名称</label>
                      <div class="col-8">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefeUnitName">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-4 col-form-label text-right col-form-label-sm form-label-min">经营性质</label>
                      <div class="col-8">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefeUnitBusinessType">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-4 col-form-label text-right col-form-label-sm form-label-min">成立时间</label>
                      <div class="col-8">
                        <date-picker v-model="event.editEventData.eventDefeUnitCreateDate" valueType="format" :editable="false"></date-picker>
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-4 col-form-label text-right col-form-label-sm form-label-min">组织机构代码</label>
                      <div class="col-8">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefeUnitOrganCode">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-4 col-form-label text-right col-form-label-sm form-label-min">营业执照号</label>
                      <div class="col-8">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefeUnitBusinessNum">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-4 col-form-label text-right col-form-label-sm form-label-min">地址</label>
                      <div class="col-8">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefeUnitAddress">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-4 col-form-label text-right col-form-label-sm form-label-min">联系电话</label>
                      <div class="col-8">
                        <input type="text" class="form-control form-control-sm input-color"
                               v-model="event.editEventData.eventDefeUnitPhone">
                      </div>
                    </div>
                    <div class="form-group row form-group-min">
                      <label class="col-4 col-form-label text-right col-form-label-sm form-label-min">备注</label>
                      <div class="col-8">
                        <textarea rows="4" class="form-control form-control-sm input-color"
                                  v-model="event.editEventData.eventDefeUnitRemark"></textarea>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="tab-pane fade" id="event-photo-tab-wrap" role="tabpanel" aria-labelledby="event-photo-tab">
                <photoList ref="photoListObj" :session="session" :obj-type="'事件'" :photo-list-wrap-height="'450px'"></photoList>
              </div>
              <div class="tab-pane fade" id="event-map-tab-wrap" role="tabpanel" aria-labelledby="event-map-tab">
                <div class="event-form-height" style="padding:0px">
                  <baiduMapLocation></baiduMapLocation>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" @click="saveEditEvent()">保存事件信息</button>
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
  name: "gather-event-detail-edit",
  data:function (){
    return {
      acInterface: {
        saveEvent:"/GridSystem/Rest/Grid/Event/EventMain/SaveEvent",
        getEventData:"/GridSystem/Rest/Grid/Event/EventMain/GetEventData"
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
          eventAppealPersonNum:null,//诉求人数
          eventAppealQuestion:"",//诉求问题及要求
          eventAboutPersonNum:null,//涉及人数
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
      ddg_GeneralNoYes:[],
      ddg_EventType2:[],
      ddg_GeneralSex:[]
    }
  },
  props: ["session"],
  mounted() {
    this.event.emptyEventData = appClientUtility.JsonUtility.CloneStringify(this.event.editEventData);

    window["writeEventMainAppealerDataToView"] = (personData,imageBase64) => {
      this.writeEventMainAppealerDataToView(personData,imageBase64)
    };
    window["writeEventFellowAppealerDataToView"] = (personData,imageBase64) => {
      this.writeEventFellowAppealerDataToView(personData,imageBase64)
    };
    window["writeEventDefePersonDataToView"] = (personData,imageBase64) => {
      this.writeEventDefePersonDataToView(personData,imageBase64)
    }
  },
  methods:{
    buildDDGroupData:function (){
      this.ddg_EventSource=appClientUtility.GetAllDDMap()["33dee1b4-96ae-422e-847d-5ffabc012051"];
      this.ddg_EventType1=appClientUtility.GetAllDDMap()["5d8b5a48-1916-4002-9b85-c8b95c59d200"];
      this.ddg_EventLevel=appClientUtility.GetAllDDMap()["c97de954-0bb8-476c-af2c-751301ebe2ee"];
      this.ddg_EventSeverity=appClientUtility.GetAllDDMap()["8e8ebfd5-e9ee-4475-b812-38f22223259b"];
      this.ddg_EventAppealPurpose=appClientUtility.GetAllDDMap()["74c7b050-a141-4a44-b87f-f8527d671acb"];
      this.ddg_GeneralNoYes=appClientUtility.GetAllDDMap()["77e5497e-fade-4723-b75d-232943f488a1"];
      this.ddg_GeneralSex=appClientUtility.GetAllDDMap()["4419d996-1d4b-455e-bff7-63b0967bf360"];
    },
    eventType1Change:function (){
      if(this.event.editEventData.eventType1=="矛盾纠纷"){
        this.ddg_EventType2=appClientUtility.GetAllDDMap()["409a1bbf-9c53-4ec9-8d77-8f5df6b2e8fa"];
      }
      else if(this.event.editEventData.eventType1=="问题隐患"){
        this.ddg_EventType2=appClientUtility.GetAllDDMap()["7e36a208-2927-4ad0-892b-0403c6e1b3d8"];
      }
      else{
        this.ddg_EventType2=[];
      }
      this.event.editEventData.eventType2="";
    },
    newEvent:function () {
      //debugger;
      this.event.editEventData = appClientUtility.JsonUtility.CloneStringify(this.event.emptyEventData);
      this.event.editEventData.eventId = appClientUtility.StringUtility.NewH5AppRecordId();
      this.event.editEventData.eventCityId = "4413";
      this.event.editEventData.eventAreaId = "441325";
      this.event.editEventData.eventAcceptGridId = this.session.OrganId;

      var year=appClientUtility.DateUtility.GetCurrentData().getFullYear();
      var month=appClientUtility.DateUtility.GetCurrentData().getMonth()+1;
      this.event.editEventData.eventCode = appClientUtility.GetGridInfo().gridCode+year+month;
      this.$refs.photoListObj.setRecordId(this.event.editEventData.eventId);
      this.$refs.photoListObj.clearPhotoList();
      $("#eventEditModal").modal('show');
    },
    editEvent:function (eventId){
      appClientUtility.DialogUtility.ShowLoading();
      axios.get(this.acInterface.getEventData, {
        params: {
          eventId: eventId,
          AppClientToken: this.session.AppClientToken,
          ts:Date.now()
        }
      }).then((response) => {

        this.event.editEventData=response.data.data;
        this.$refs.photoListObj.setRecordId(this.event.editEventData.eventId);
        this.$refs.photoListObj.loadPhotoFromServer(this.event.editEventData.eventId);
        $("#eventEditModal").modal('show');

      }).catch((e) => {

      }).then((endRes)=>{
        appClientUtility.DialogUtility.HideLoading();
      });
    },
    saveEditEvent:function (){
      //region 校验
      var errorMessage = "";
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventCode)) {
        errorMessage += "[事件编号不能为空!]<br />";
      }
      else if(this.event.editEventData.eventCode.length!=23){
        errorMessage += "[事件编号必须为23位!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventAppealQuestion)) {
        errorMessage += "[诉求问题不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventSource)) {
        errorMessage += "[事件来源不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventType1)) {
        errorMessage += "[事件类型1不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventLevel)) {
        errorMessage += "[事件级别不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventSeverity)) {
        errorMessage += "[严重程度不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventAppealPurpose)) {
        errorMessage += "[诉求目的不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventAddress)) {
        errorMessage += "[发生地点不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventIsPetition)) {
        errorMessage += "[是否信访件不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventIsRentalHousing)) {
        errorMessage += "[是否出租屋事件不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventIsGroup)) {
        errorMessage += "[是否群体性事件不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.event.editEventData.eventIsEmergency)) {
        errorMessage += "[是否紧急事件不能为空!]<br />";
      }

      if (errorMessage) {
        appClientUtility.DialogUtility.AlertText(this, errorMessage);
        return;
      }
      //endregion
      appClientUtility.DialogUtility.ShowLoading();
      axios.post(this.acInterface.saveEvent, this.event.editEventData).then((result) => {
        appClientUtility.DialogUtility.AlertText(this,result.data.message,()=>{
          if(result.data.success){
            $('#eventEditModal').modal('hide');
            this.$emit('saveEventCompleted',this.event.editEventData);
          }
        });
      }).catch((err) => {

      }).then((endResult) => {
        appClientUtility.DialogUtility.HideLoading();
      });
    },
    readEventMainAppealerInfoByIdCard:function (){
      //this.showLoading = true;
      if(typeof(appBridge)!="undefined"){
        appClientUtility.DialogUtility.ShowLoading();
        appBridge.beginReadIdCardFromNFC("writeEventMainAppealerDataToView");
      }
      else{
        this.$toasted.show('不存在appBridge对象!',{duration:2000});
      }
    },
    writeEventMainAppealerDataToView: function (personData, imageBase64) {
      personData = appClientUtility.JsonUtility.StringToJson(personData);
      this.event.editEventData.eventMainAppealerName = personData.personName;
      this.event.editEventData.eventMainAppealerIdCard = personData.personIdCard;
      this.event.editEventData.eventMainAppealerSex = personData.personSex;
      this.event.editEventData.eventMainAppealerAddress = personData.personIdCardAddress;
      if (personData.personBirthday) {
        var birthdayStr = personData.personBirthday.replace("年", "-").replace("月", "-").replace("日", "");
        this.event.editEventData.eventMainAppealerBirthday = birthdayStr;
      }
      appClientUtility.DialogUtility.HideLoading();
    },
    readEventFellowAppealerInfoByIdCard:function (){
      if(typeof(appBridge)!="undefined"){
        appClientUtility.DialogUtility.ShowLoading();
        appBridge.beginReadIdCardFromNFC("writeEventFellowAppealerDataToView");
      }
      else{
        this.$toasted.show('不存在appBridge对象!',{duration:2000});
      }
    },
    writeEventFellowAppealerDataToView:function (personData, imageBase64){
      personData = appClientUtility.JsonUtility.StringToJson(personData);
      this.event.editEventData.eventFellowAppealerName = personData.personName;
      this.event.editEventData.eventFellowAppealerIdCard = personData.personIdCard;
      this.event.editEventData.eventFellowAppealerSex = personData.personSex;
      this.event.editEventData.eventFellowAppealerAddress = personData.personIdCardAddress;
      if (personData.personBirthday) {
        var birthdayStr = personData.personBirthday.replace("年", "-").replace("月", "-").replace("日", "");
        this.event.editEventData.eventFellowAppealerBirthday = birthdayStr;
      }
      appClientUtility.DialogUtility.HideLoading();
    },
    readEventDefePersonInfoByIdCard:function (){
      if(typeof(appBridge)!="undefined"){
        appClientUtility.DialogUtility.ShowLoading();
        appBridge.beginReadIdCardFromNFC("writeEventDefePersonDataToView");
      }
      else{
        this.$toasted.show('不存在appBridge对象!',{duration:2000});
      }
    },
    writeEventDefePersonDataToView:function (personData, imageBase64){
      personData = appClientUtility.JsonUtility.StringToJson(personData);
      this.event.editEventData.eventDefePerName = personData.personName;
      this.event.editEventData.eventDefePerIdCard = personData.personIdCard;
      this.event.editEventData.eventDefePerSex = personData.personSex;
      this.event.editEventData.eventDefePerAddress = personData.personIdCardAddress;
      if (personData.personBirthday) {
        var birthdayStr = personData.personBirthday.replace("年", "-").replace("月", "-").replace("日", "");
        this.event.editEventData.eventDefePerBirthday = birthdayStr;
      }
      appClientUtility.DialogUtility.HideLoading();
    }
  }
}
</script>

<style scoped lang="less">
  @import "../Less/Variable.less";

  .event-form-group-caption{
    border-bottom: #EAEDED 1px solid;
    background-image: url("../Images/icons8-list-24.png");
    background-repeat: no-repeat;
    padding-left: 20px;
    background-position:left center;
  }

  .event-form-height{
    height: 487px;
    overflow-y: auto;
    overflow-x: hidden;
    padding:10px
  }
</style>