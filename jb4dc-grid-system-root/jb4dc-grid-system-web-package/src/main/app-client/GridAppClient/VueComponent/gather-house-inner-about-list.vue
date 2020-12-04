<template>
  <div>
    <!--List Modal -->
    <div class="modal fade" id="loadHouseInnerAboutWrapDialog" tabindex="-1" role="dialog"
         aria-labelledby="loadHouseInnerAboutWrapDialogLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loadHouseInnerAboutWrapDialogLabel">房内-户与企业</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="selected-house-title">
              <i class="fa fa-house-user fa-lg"></i>&nbsp; 房号:{{buildSelectedHouseTitle()}}
            </div>
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#personListWarp" role="tab"
                   aria-controls="home" aria-selected="true">人口信息</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#entListWarp" role="tab"
                   aria-controls="profile" aria-selected="false">企业法人</a>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="personListWarp" role="tabpanel" aria-labelledby="home-tab">
                <div style="padding: 4px;height: 44px">
                  <div style="float: right">
                    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#familyEditModal" @click="newFamily">
                      +户信息
                    </button>
                  </div>
                </div>
                <div style="min-height: 500px;max-height: 500px;overflow: auto">
                </div>
              </div>
              <div class="tab-pane fade" id="entListWarp" role="tabpanel" aria-labelledby="profile-tab">
                <div style="min-height: 400px;max-height: 400px">
                  <div style="padding: 4px;height: 44px">
                    <div style="float: right">
                      <button type="button" class="btn btn-success">+企业信息</button>
                    </div>
                  </div>
                  <div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--户数据登记-->
    <div class="modal fade" id="familyEditModal" tabindex="-1" role="dialog" aria-labelledby="familyEditModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header" style="padding: 0.5rem 1rem">
            <h5 class="modal-title" id="familyEditModalLabel">居住人口(户)信息登记</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="accordion" id="accordionFamilyEdit">
              <div class="card">
                <div class="card-header" style="padding: 0px">
                  <h2 class="mb-md-1" style="margin-bottom: 0px">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#familyEditBaseInfo"
                            aria-expanded="true" aria-controls="familyEditBaseInfo">
                      户基本信息<span style="color:#48C9B0 ">[{{buildSelectedHouseTitle()}}]</span>
                    </button>
                  </h2>
                </div>
                <div id="familyEditBaseInfo" class="collapse show" data-parent="#accordionFamilyEdit">
                  <div class="card-body" style="padding: 0.7rem">
                    <form>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_PER_COUNT" class="col-4 col-form-label col-form-label-sm"><span style="color: red">*</span>应登记数</label>
                        <div class="col-8">
                          <input type="text" class="form-control form-control-sm" id="FAMILY_PER_COUNT"
                                 placeholder="本户应登记总数" v-model="family.editFamilyData.editFamilyInfo.familyPerCount">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_PER_IN" class="col-4 col-form-label col-form-label-sm"><span style="color: red">*</span>在家人数</label>
                        <div class="col-8">
                          <input type="text" class="form-control form-control-sm" id="FAMILY_PER_IN" placeholder="在家人数" v-model="family.editFamilyData.editFamilyInfo.familyPerIn">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_PER_OUT" class="col-4 col-form-label col-form-label-sm"><span style="color: red">*</span>没在人数</label>
                        <div class="col-8">
                          <input type="text" class="form-control form-control-sm" id="FAMILY_PER_OUT"
                                 placeholder="没在家人数" v-model="family.editFamilyData.editFamilyInfo.familyPerOut">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_TYPE" class="col-4 col-form-label col-form-label-sm"><span style="color: red">*</span>户别</label>
                        <div class="col-8">
                          <select id="FAMILY_TYPE" class="form-control form-control-sm"
                                  bindDDGroupId="084971f4-5b63-48e3-87a6-3e39a2746c18" defaultSelectValue="家庭户"
                                  empty="false" v-model="family.editFamilyData.editFamilyInfo.familyType">
                          </select>
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_PHONE" class="col-4 col-form-label col-form-label-sm">联系电话</label>
                        <div class="col-8">
                          <input type="text" class="form-control form-control-sm" id="FAMILY_PHONE" placeholder="联系电话" v-model="family.editFamilyData.editFamilyInfo.familyPhone">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_HOUSE_TYPE" class="col-4 col-form-label col-form-label-sm"><span style="color: red">*</span>住所类型</label>
                        <div class="col-8">
                          <select id="FAMILY_HOUSE_TYPE" class="form-control form-control-sm"
                                  bindDDGroupId="4113080d-9437-4a5a-a33c-0107a93b4e51" defaultSelectValue="普通住宅"
                                  empty="false" v-model="family.editFamilyData.editFamilyInfo.familyHouseType">
                          </select>
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_HR_PROVINCE" class="col-4 col-form-label col-form-label-sm">户籍省</label>
                        <div class="col-8">
                          <input type="text" class="form-control form-control-sm" id="FAMILY_HR_PROVINCE"
                                 placeholder="户籍省（区、市）" v-model="family.editFamilyData.editFamilyInfo.familyHrProvince">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_HR_CITY" class="col-4 col-form-label col-form-label-sm">户籍市</label>
                        <div class="col-8">
                          <input type="text" class="form-control form-control-sm" id="FAMILY_HR_CITY"
                                 placeholder="户籍市（地、州、盟）" v-model="family.editFamilyData.editFamilyInfo.familyHrCity">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_HR_COUNTY" class="col-4 col-form-label col-form-label-sm">户籍县</label>
                        <div class="col-8">
                          <input type="text" class="form-control form-control-sm" id="FAMILY_HR_COUNTY"
                                 placeholder="户籍县（市、区、旗）" v-model="family.editFamilyData.editFamilyInfo.familyHrCounty">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_HOUSE_AREA" class="col-4 col-form-label col-form-label-sm">居住面积</label>
                        <div class="col-8">
                          <input type="text" class="form-control form-control-sm" id="FAMILY_HOUSE_AREA"
                                 placeholder="本户现住房建筑面积M²" v-model="family.editFamilyData.editFamilyInfo.familyHouseArea">
                        </div>
                      </div>
                      <div class="form-group row form-group-min">
                        <label for="FAMILY_HOUSE_ROOM_NUM" class="col-4 col-form-label col-form-label-sm">房间数</label>
                        <div class="col-8">
                          <input type="text" class="form-control form-control-sm" id="FAMILY_HOUSE_ROOM_NUM"
                                 placeholder="本户现住房房间数" v-model="family.editFamilyData.editFamilyInfo.familyHouseRoomNum">
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" style="padding: 0px">
                  <h2 class="mb-md-1" style="margin-bottom: 0px">
                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                            data-target="#familyEditPersonList" aria-expanded="false"
                            aria-controls="familyEditPersonList">
                      户内成员信息
                    </button>
                  </h2>
                </div>
                <div id="familyEditPersonList" class="collapse" data-parent="#accordionFamilyEdit">
                  <div class="card-body" style="padding: 0.7rem">
                    <div style="padding: 4px;height: 44px">
                      <div style="float: right">
                        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#personEditModal"
                                @click="addNewPerson">+人员
                        </button>
                      </div>
                    </div>
                    <div class="family-person-list-wrap">
                      <div class="family-person-single-wrap" v-for="familyPerson in family.editFamilyData.familyPersons">
                        <div class="person-info-wrap">
                          <div class="name">{{ familyPerson.personName }}</div>
                          <div class="relationship">{{convertDDValueToText("1c2d6768-eb96-4a68-ae52-f36b241b3776",familyPerson.personRelationship) }}</div>
                          <div class="id-card">{{ familyPerson.personIdCard }} [{{ convertDDValueToText("6ba97e93-a9f3-4974-80b0-3f3e05c6fb7b",familyPerson.personSex) }}]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del" @click="deletePerson(familyPerson)"></div>
                          <div class="edit" @click="editPerson(familyPerson)"></div>
                        </div>
                      </div>
                      <!--<div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>
                      <div class="family-person-single-wrap">
                        <div class="person-info-wrap">
                          <div class="name">欧阳小妮玛</div>
                          <div class="relationship">岳父母或公婆</div>
                          <div class="id-card">445120128541215145 [男]</div>
                        </div>
                        <div class="op-button-wrap">
                          <div class="del"></div>
                          <div class="edit"></div>
                        </div>
                      </div>-->
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" style="padding: 0px">
                  <h2 class="mb-md-1" style="margin-bottom: 0px">
                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                            data-target="#familyEditFile" aria-expanded="false" aria-controls="familyEditFile">
                      照片
                    </button>
                  </h2>
                </div>
                <div id="familyEditFile" class="collapse" data-parent="#accordionFamilyEdit">
                  <div class="card-body" style="padding: 0.7rem">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" @click="saveFamily">保存户信息</button>
          </div>
        </div>
      </div>
    </div>

    <!--人口信息编辑-->
    <div class="modal fade" id="personEditModal" tabindex="-1" role="dialog" aria-labelledby="personEditModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header" style="padding: 1.5rem 1rem">
            <h5 class="modal-title" id="personEditModalLabel">人口信息登记</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="person-head-image">
              <img src="../Images/person-empty-head.png" />
            </div>
            <form>
              <div class="form-group row form-group-min">
                <label for="PERSON_NAME" class="col-3 col-form-label col-form-label-sm form-label-min"><span style="color: red">*</span>姓名</label>
                <div class="col-5">
                  <input type="text" class="form-control form-control-sm" id="PERSON_NAME" placeholder="姓名"
                         v-model="person.editPersonData.personName">
                </div>
              </div>
              <div class="form-group row form-group-min">
                <label for="PERSON_SEX" class="col-3 col-form-label col-form-label-sm form-label-min"><span style="color: red">*</span>性别</label>
                <div class="col-5">
                  <select id="PERSON_SEX" class="form-control form-control-sm"
                          bindDDGroupId="6ba97e93-a9f3-4974-80b0-3f3e05c6fb7b" defaultSelectValue="" empty="true"
                          v-model="person.editPersonData.personSex">
                  </select>
                </div>
              </div>
              <div class="form-group row form-group-min">
                <label for="PERSON_RELATIONSHIP" class="col-3 col-form-label col-form-label-sm form-label-min"><span style="color: red">*</span>与户主关系</label>
                <div class="col-5">
                  <select id="PERSON_RELATIONSHIP" class="form-control form-control-sm"
                          bindDDGroupId="1c2d6768-eb96-4a68-ae52-f36b241b3776" defaultSelectValue="" empty="true"
                          v-model="person.editPersonData.personRelationship">
                  </select>
                </div>
              </div>
              <div class="form-group row form-group-min">
                <label for="PERSON_NATION" class="col-3 col-form-label col-form-label-sm form-label-min">民族</label>
                <div class="col-5">
                  <input type="text" class="form-control form-control-sm" id="PERSON_NATION" placeholder="民族"
                         v-model="person.editPersonData.personNation">
                </div>
              </div>
              <div class="form-group row form-group-min">
                <label for="PERSON_ID_CARD" class="col-3 col-form-label col-form-label-sm form-label-min"><span style="color: red">*</span>身份证</label>
                <div class="col-8">
                  <input type="text" class="form-control form-control-sm" id="PERSON_ID_CARD" placeholder="身份证"
                         v-model="person.editPersonData.personIdCard">
                </div>
              </div>
              <div class="form-group row form-group-min">
                <label for="PERSON_HR_LOCATION" class="col-3 col-form-label col-form-label-sm form-label-min"><span style="color: red">*</span>户口登记地</label>
                <div class="col-8">
                  <select id="PERSON_HR_LOCATION" class="form-control form-control-sm"
                          bindDDGroupId="2d868683-f6f7-44d0-9da3-fcd0f0ce8729" defaultSelectValue="1" empty="false"
                          v-model="person.editPersonData.personHrLocation">
                  </select>
                </div>
              </div>
              <div class="form-group row form-group-min">
                <label for="PERSON_HR_LEAVE" class="col-12 col-form-label col-form-label-sm form-label-min"><span style="color: red">*</span>离开户口登记地时间</label>
                <div class="col-12">
                  <select id="PERSON_HR_LEAVE" class="form-control form-control-sm"
                          bindDDGroupId="1495649f-6bf2-4d8e-8fcd-929422799eab" defaultSelectValue="1" empty="false"
                          v-model="person.editPersonData.personHrLeave">
                  </select>
                </div>
              </div>
              <div class="form-group row form-group-min">
                <label for="PERSON_HR_LEAVE_FOR" class="col-12 col-form-label col-form-label-sm form-label-min">离开户口登记地原因</label>
                <div class="col-12">
                  <select id="PERSON_HR_LEAVE_FOR" class="form-control form-control-sm"
                          bindDDGroupId="e0068969-3037-4d29-a393-e16fbeb3be4e" defaultSelectValue="" empty="true"
                          v-model="person.editPersonData.personHrLeaveFor">
                  </select>
                </div>
              </div>
              <div class="form-group row form-group-min">
                <label for="PERSON_EDUCATION" class="col-12 col-form-label col-form-label-sm form-label-min">受教育程度</label>
                <div class="col-12">
                  <select id="PERSON_EDUCATION" class="form-control form-control-sm"
                          bindDDGroupId="e5f1986b-6c85-4abd-87ec-bf451b9660d5" defaultSelectValue="" empty="true"
                          v-model="person.editPersonData.personEducation">
                  </select>
                </div>
              </div>
              <div class="form-group row form-group-min">
                <label for="PERSON_SP_TYPE" class="col-12 col-form-label col-form-label-sm form-label-min">特殊群体</label>
                <div class="col-12">
                  <select id="PERSON_SP_TYPE" class="form-control form-control-sm"
                          bindDDGroupId="ba7e8e21-375e-4241-aa5a-7376c3e3ba2c" defaultSelectValue="" empty="true"
                          v-model="person.editPersonData.personSpType">
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success">从NFC读取</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" @click="savePersonToFamily">确认人口信息</button>
          </div>
        </div>
      </div>
    </div>

    <div class="loadDialogWrap" id="loadDialogWrap" v-if="showLoading">
      <div class="text-center" style="margin-top: 200px">
        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
          <span class="sr-only">Loading...</span>
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
  name: "gatheer-house-inner-about-list",
  data: function () {
    return {
      acInterface: {
        //family
        savaFamilyData:"/GridSystem/Rest/Grid/Person/Family/SaveFamilyData"
      },
      showLoading: false,
      family: {
        editFamilyData: {
          editFamilyInfo: {
            familyId: "",
            familyHouseId: "",//房屋ID
            familyHouseCodeFull: "",//房屋编号
            familyPerCount: "",//户口-应登记总数
            familyPerIn: "",//户口-在家人数
            familyPerOut: "0",//户口-不在家人数
            familyType: "家庭户",//户别:家庭户,集体户
            familyPhone: "",//联系电话
            familyHrProvince: "",//户籍地址-省（直辖市、自治区）
            familyHrCity: "",//户籍地址-市（盟、州）
            familyHrCounty: "",//户籍地址-县（市、区、旗）
            familyHouseType: "普通住宅",//住宅类型:普通住宅,集体住所,工作地住所,其他住房,无住房
            familyHouseArea: "",//本户现住房建筑面积
            familyHouseRoomNum: "",//本户现住房间数
            familyInputUnitName: "",//填报单位
            familyInputUnitId: "",//填报单位
            familyInputDate: "",//登记时间
            familyInputUserName: "",//登记人
            familyInputUserId: "",//登记人ID
            familyCityId: "",//城市Id
            familyAreaId: "",//区Id
            familyStreetId: "",//街道Id:街道,乡镇
            familyCommunityId: "",//社区Id:社区,村
            familyGridId: "",//所属网格Id
            familyHeadHouseholdName: "",//户主姓名
            familyHeadHouseholdId: ""//户主ID
          },
          familyPersons: []
        },
        emptyEditFamilyData:{

        },
        status: "add"
      },
      person: {
        editPersonData: {
          personId: "",
          personFamilyId: "",//家庭ID
          personHeadHouseholdName: "",//户主姓名
          personHeadHouseholdId: "",//户主ID
          personHouseId: "",//房屋ID
          personHouseCodeFull: "",//房屋编号
          personName: "江南妮玛",//姓名
          personRelationship: " ",//与户主关系:户主;配偶;子女;父母;岳父母或公婆;祖父母;媳婿;孙子女;兄弟姐妹;其他
          personIdCard: "445102158216154145",//身份证号
          personSex: " ",//性别:男;女
          personNation: "",//民族
          personHrLocation: "1",//户口登记地:本村(居)委会;本街道其他村(居)委会;本区其他街道;非本区;香港特别行政区、澳门特别行政区、台湾地区;国外;户口待定
          personHrLeave: "1",//离开户口登记地时间:1 没有离开户口登记地;2 不满半年;3 半年以上,不满一年;4 一年以上,不满二年;5 二年以上,不满三年;6 三年以上,不满四年;7 四年以上,不满五年;8 五年以上,不满十年;9 十年以上
          personHrLeaveFor: " ",//离开户口登记地原因:0 工作就业;1 学习培训;2 随同离开/投亲靠友;3 拆迁/搬家;4 寄挂户口;5 婚姻嫁娶;6 照料孙子女;7 为子女就学;8 养老/康养;9 其他;
          personEducation: " ",//受教育程度:1 未上过学;2 学前教育;3 小学;4 初中;5 高中;6 大学专科;7 大学本科;8 硕士研究生;9 博士研究生
          personSpType: " ",//特殊群体
          personPhone: "",//联系电话
          personInputUnitName: "",//填报单位
          personInputUnitId: "",//填报单位
          personInputDate: "",
          personInputUserName: "",//登记人
          personInputUserId: "",//登记人ID
          personCityId: "",//城市Id
          personAreaId: "",//区Id
          personStreetId: "",//街道Id:街道,乡镇
          personCommunityId: "",//社区Id:社区,村
          personGridId: "",//所属网格Id
          personCategory: "",//人口类别:中国居民,外国人
          personForeEnName: "",//外国人-外文姓名
          personForeNationality: "",//外国人-国籍
          personForeCertificateType: "",//证件类型
          personForeCertificateNum: "",//证件号码
          personRemark: "",//备注1
          personOrderNum: "",//排序号
          personPhotoId:"",//照片ID
          personIdCardUuid:"",//身份证UUID
          personIdCardPublicForm:"",//身份证签发机关
          personIdCardEffDate:"",//身份证有效日期
          personIdCardAddress:"",//居住地址
          personBirthday:""//出生日期
        },
        emptyEditPersonData: null,
        status: "add",
        getDataFromNFC: false
      },
      enterprise: {
        editEnterpriseData: {
          entId: "",
          entGridId: "",//所属网格Id
          entHouseId: "",//房屋ID
          entHouseCode: "",//房屋编号
          entName: "",//企业（门店）名称
          entBusinessNum: "",//营业执照号
          entOrganCode: "",//组织机构代码
          entPlacePhone: "",//单位联系电话
          entPlaceArea: "",//单位营业面积（平方米）
          entPlaceAddress: "",//单位详细地址
          entIsAnnualInspection: "",//是否年检:是,否
          entLegalName: "",//法定代表人（经营者）姓名
          entLegalPhone: "",//法定代表人（经营者）联系电话
          entLegalAddress: "",//法人住址
          entLegalCertificateType: "",//法人证件类型
          entLegalCertificateNum: "",//法人证件号码
          entScopeOfBusiness: "",//经营范围
          entModeOfOperation: "",//经营方式
          entSetUpDate: "",//成立日期
          entCheckDate: "",//核准日期
          entInputUnitName: "",//填报单位
          entInputUnitId: "",//填报单位
          entInputDate: "",//登记时间
          entInputUserName: "",//登记人
          entInputUserId: "",//登记人ID
          entRemark: "",//备注
          entOrderNum: ""//排序号
        }
      }
    }
  },
  props:["selectedHouse"],
  mounted() {
    this.person.emptyEditPersonData = appClientUtility.JsonUtility.CloneStringify(this.person.editPersonData);
    this.family.emptyEditFamilyData = appClientUtility.JsonUtility.CloneStringify(this.family.editFamilyData);
    //设置默认值
    //$("bindDDGroupId").each()
  },
  methods: {
    buildSelectedHouseTitle:function (){
        if(this.selectedHouse){
          return this.selectedHouse.houseNumName
        }
        return "";
    },
    //Family
    newFamily: function () {
      this.family.editFamilyData.editFamilyInfo.familyId=appClientUtility.StringUtility.Guid();
    },
    saveFamily: function () {
      var errorMessage = "";
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.family.editFamilyData.editFamilyInfo.familyPerCount)) {
        errorMessage += "[应登记总数不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.family.editFamilyData.editFamilyInfo.familyPerIn)) {
        errorMessage += "[在家人数不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.family.editFamilyData.editFamilyInfo.familyPerOut)) {
        errorMessage += "[不在家人数不能为空!]<br />";
      }
      if (errorMessage) {
        this.$confirm({
          message: `${errorMessage}`,
          button: {
            yes: '确认'
          },
          callback: confirm => {
          }
        })
        return;
      }

      this.family.editFamilyData.editFamilyInfo.familyHouseId=this.selectedHouse.houseId;

      this.showLoading = true;
      axios.post(this.acInterface.savaFamilyData,this.family.editFamilyData).then((result)=>{
        console.log(result);
        if(result.data.success){

        }
        else{
          var errorMessage=result.data.message;
          this.$confirm({
            message: `${errorMessage}`,
            button: {
              yes: '确认'
            },
            callback: confirm => {
            }
          })
        }
      }).catch((err)=>{

      }).then((endResult)=>{
        this.showLoading=false;
      });
    },
    getPersonFromFamily: function (personId) {
      //debugger;
      for (let i = 0; i < this.family.editFamilyData.familyPersons.length; i++) {
        if (this.family.editFamilyData.familyPersons[i].personId == personId) {
          return this.family.editFamilyData.familyPersons[i]
        }
      }
      return null;
    },
    //Person
    convertDDValueToText: function (groupId, value) {
      var allDDMap=appClientUtility.GetAllDDMap();
      //console.log(allDDMap);
      if(allDDMap[groupId]) {
        for (let i = 0; i < allDDMap[groupId].length; i++) {
          if (allDDMap[groupId][i].dictValue == value) {
            return allDDMap[groupId][i].dictText;
          }
        }
      }
    },
    resetPersonData: function () {
      this.person.editPersonData = appClientUtility.JsonUtility.CloneStringify(this.person.emptyEditPersonData);
      this.person.editPersonData.personId = appClientUtility.StringUtility.Guid();
    },
    addNewPerson: function () {
      this.resetPersonData();
    },
    editPerson: function (familyPerson) {
      //debugger;
      var familyPerson=this.getPersonFromFamily(familyPerson.personId);
      console.log(familyPerson);
      this.person.editPersonData=appClientUtility.JsonUtility.CloneStringify(familyPerson);
      $('#personEditModal').modal('show');
    },
    savePersonToFamily: function () {
      var errorMessage = "";
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.person.editPersonData.personName)) {
        errorMessage += "[姓名不能为空!]<br />";
      }
      //debugger;
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.person.editPersonData.personRelationship)) {
        errorMessage += "[与户主关系不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.person.editPersonData.personSex)) {
        errorMessage += "[性别不能为空!]<br />";
      }
      if (appClientUtility.StringUtility.IsNullOrEmptyTrim(this.person.editPersonData.personIdCard)) {
        errorMessage += "[身份证不能为空!]<br />";
      }
      if (this.person.editPersonData.personIdCard.length != 18) {
        errorMessage += "[身份证必须为18位!]<br />";
      }

      if (errorMessage) {
        this.$confirm({
          message: `${errorMessage}`,
          button: {
            yes: '确认'
          },
          callback: confirm => {
          }
        })
        return;
      }

      var familyPerson = this.getPersonFromFamily(this.person.editPersonData.personId);
      if (!familyPerson) {
        this.family.editFamilyData.familyPersons.push(this.person.editPersonData);
      } else {
        appClientUtility.JsonUtility.SimpleCloneAttr(familyPerson, this.person.editPersonData);
      }
      $('#personEditModal').modal('hide');
    },
    deletePerson: function (familyPerson) {
      this.$confirm(
          {
            message: `你确认要删除记录吗?`,
            button: {
              no: 'No',
              yes: 'Yes'
            },
            /**
             * Callback Function
             * @param {Boolean} confirm
             */
            callback: confirm => {
              if (confirm) {
                // ... do something
              }
            }
          }
      )
    }
  }
}
</script>

<style scoped lang="less">
@import "../Less/Variable.less";

.person-head-image{
  width: 100px;
  height: 120px;
  border-radius: 8px;
  border: solid 1px @g-concrete-color-v09;
  position: absolute;
  right: 20px;
  top: 16px;

  img{
    margin-left: 5px;
    margin-top: 10px;
    width: 90px;
    height: 97px;
  }
}

.loadDialogWrap {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: @g-concrete-color-v06;
  opacity: 0.8;
  z-index: 4000;
}

.form-group-min {
  margin-bottom: 0.4rem;
}

.form-group-mid {
  margin-bottom: 0.6rem;
}

.form-label-min{
  font-size: 13px;
  padding-right: 4px;
  padding-left: 8px;
}

.family-person-list-wrap {
  height: 370px;
  overflow: auto;

  .family-person-single-wrap {
    border: @g-concrete-color-v04 1px solid;
    height: 60px;
    border-radius: 6px;
    background-color: @g-concrete-color-v02;
    margin-top: 4px;

    .person-info-wrap {
      float: left;
      height: 60px;
      width: 64%;
      font-size: 13px;

      .name {
        display: inline-block;
        width: 40%;
        border-bottom: @g-concrete-color-v04 1px dotted;
        padding: 4px;
      }

      .relationship {
        display: inline-block;
        width: 58%;
        border-bottom: @g-concrete-color-v04 1px dotted;
        padding: 4px;
        text-align: center;
      }

      .id-card {
        padding: 4px;
      }
    }

    .op-button-wrap {
      float: right;
      height: 50px;
      width: 35%;

      .del {
        float: left;
        width: 32px;
        height: 32px;
        border-bottom: 0px dotted @g-concrete-color-v08;
        border-radius: 0px;
        background-image: url("../Images/icons8-del-30.png");
        background-repeat: no-repeat;
        margin-top: 14px;
        margin-left: 14px;
      }

      .edit {
        float: left;
        width: 32px;
        height: 32px;
        border-bottom: 0px dotted @g-concrete-color-v08;
        border-radius: 0px;
        background-image: url("../Images/icons8-edit-30.png");
        background-repeat: no-repeat;
        margin-top: 14px;
        margin-left: 14px;
      }
    }
  }
}

.selected-house-title{
  height: 20px;
  line-height: 20px;
  margin-left: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  color: @g-turquoise-color-v05;
}
</style>