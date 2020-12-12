import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";
import VueConfirmDialog from '../VueComponent/vue-confirm-dialog/index'
import defaultIndexRoot from '../VueComponent/default-index-root.vue'
import appClientUtility from "../Js/AppClientUtility";

Vue.component('defaultIndexRoot',defaultIndexRoot);
Vue.use(Toasted)
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

const app=new Vue({
    el: '#mainApp',
    template: '<div><defaultIndexRoot></defaultIndexRoot><vue-confirm-dialog></vue-confirm-dialog></div>',
    data: function() {
        return {}
    },
    mounted() {
        appClientUtility.HidTopLoadBar();
    },
    methods: {}
})