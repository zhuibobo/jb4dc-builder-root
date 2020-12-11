import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Less/GridAppClient.less";
import Toasted from 'vue-toasted';

import gatherBHPEDataMainRoot from '../VueComponent/gather-bhpe-data-main-root.vue'
import gatherHouseInnerAboutList from '../VueComponent/gather-house-inner-about-list.vue'
import gatherNormalBuildDetailEdit from '../VueComponent/gather-normal-build-detail-edit.vue'
import gatherHouseDetailEdit from '../VueComponent/gather-house-detail-edit.vue'
import gatherSPBuildDetailEdit from '../VueComponent/gather-sp-build-detail-edit.vue'
import photoList from '../VueComponent/photo-list.vue'
import VueConfirmDialog from '../VueComponent/vue-confirm-dialog/index'
const appClientUtility = require('../Js/AppClientUtility.js');

Vue.use(Toasted)
Vue.component('gatherBHPEDataMainRoot', gatherBHPEDataMainRoot);
Vue.component('gatherHouseInnerAboutList', gatherHouseInnerAboutList);
Vue.component('gatherNormalBuildDetailEdit',gatherNormalBuildDetailEdit);
Vue.component('gatherSPBuildDetailEdit',gatherSPBuildDetailEdit);
Vue.component('gatherHouseDetailEdit',gatherHouseDetailEdit);
Vue.component('photoList',photoList);
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)


const app=new Vue({
    el: '#mainApp',
    template: '<div><gatherBHPEDataMainRoot></gatherBHPEDataMainRoot><vue-confirm-dialog></vue-confirm-dialog></div>',
    data: function() {
        return {}
    },
    mounted() {
        window["writeIdCardReaderToEmptyToView"] = (personData,imageBase64) => {
            appClientUtility.DialogUtility.AlertText(appClientUtility.JsonUtility.JsonToString(personData));
            //this.writeHouseRelevanterDataToView(personData,imageBase64)
        }
        if(typeof(appBridge)!="undefined"){
            appBridge.beginReadIdCardFromNFC("writeIdCardReaderToEmptyToView");
        }
    },
    methods: {}
})