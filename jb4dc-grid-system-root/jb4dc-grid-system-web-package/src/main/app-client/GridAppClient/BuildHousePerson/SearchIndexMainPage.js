import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";
import appClientUtility from "../Js/AppClientUtility";

import searchIndexMainRoot from '../VueComponent/search-index-main-root.vue'
Vue.use(Toasted)
Vue.component('searchIndexMainRoot',searchIndexMainRoot);

const app=new Vue({
    el: '#mainApp',
    template: '<div><searchIndexMainRoot></searchIndexMainRoot></div>',
    data: function() {
        return {}
    },
    mounted() {
        appClientUtility.HidTopLoadBar();
    },
    methods: {}
})