import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Less/GridAppClient.less";
import Toasted from 'vue-toasted';

import gatherBHPEDataMainRoot from '../VueComponent/gather-bhpe-data-main-root.vue'
import gatherHouseInnerAboutList from '../VueComponent/gather-house-inner-about-list.vue'
import gatherNormalBuildDetailEdit from '../VueComponent/gather-normal-build-detail-edit.vue'
import gatherSPBuildDetailEdit from '../VueComponent/gather-sp-build-detail-edit.vue'
import VueConfirmDialog from '../VueComponent/vue-confirm-dialog/index'

Vue.use(Toasted)
Vue.component('gatherBHPEDataMainRoot', gatherBHPEDataMainRoot);
Vue.component('gatherHouseInnerAboutList', gatherHouseInnerAboutList);
Vue.component('gatherNormalBuildDetailEdit',gatherNormalBuildDetailEdit);
Vue.component('gatherSPBuildDetailEdit',gatherSPBuildDetailEdit);
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

const app=new Vue({
    el: '#mainApp',
    template: '<div><gatherBHPEDataMainRoot></gatherBHPEDataMainRoot><vue-confirm-dialog></vue-confirm-dialog></div>',
    data: function() {
        return {}
    },
    methods: {}
})