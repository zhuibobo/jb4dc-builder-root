import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Less/GridAppClient.less";
import Toasted from 'vue-toasted';

import photoList from '../VueComponent/photo-list.vue'
import gatherEventMainRoot from '../VueComponent/gather-event-main-root.vue'
import VueConfirmDialog from '../VueComponent/vue-confirm-dialog/index'

Vue.use(Toasted)
Vue.component('gatherEventMainRoot',gatherEventMainRoot);
Vue.component('photoList',photoList);
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)


const app=new Vue({
    el: '#mainApp',
    template: '<div><gatherEventMainRoot></gatherEventMainRoot><vue-confirm-dialog></vue-confirm-dialog></div>',
    data: function() {
        return {}
    },
    methods: {}
})