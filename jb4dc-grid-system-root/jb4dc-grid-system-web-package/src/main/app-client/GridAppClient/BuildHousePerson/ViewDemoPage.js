import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";
import viewDemoInfoDetail from '../VueComponent/view-demo-info-detail.vue'
import appClientUtility from "../Js/AppClientUtility";

Vue.use(Toasted)
Vue.component('viewDemoInfoDetail', viewDemoInfoDetail);
const app=new Vue({
    el: '#mainApp',
    template: '<div><viewDemoInfoDetail></viewDemoInfoDetail></div>',
    data: function() {
        return {}
    },
    mounted() {
        appClientUtility.HidTopLoadBar();
    },
    methods: {}
})