import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";
import appClientUtility from "../Js/AppClientUtility";

import VueRouter from 'vue-router'
import searchIndexMainRoot from '../VueComponent/Search/search-index-main-root.vue'
import searchBuildMain from '../VueComponent/Search/search-build-main.vue'
import searchEnterpriseMain from '../VueComponent/Search/search-enterprise-main.vue'

Vue.use(Toasted)
Vue.use(VueRouter)
Vue.component('searchIndexMainRoot',searchIndexMainRoot);
Vue.component('searchBuildMain',searchBuildMain);
Vue.component('searchEnterpriseMain',searchEnterpriseMain);

const router = new VueRouter({
    routes: [
        // 动态路径参数 以冒号开头
        { path: '/search/build', component: searchBuildMain },
        { path: '/search/enterprise', component: searchEnterpriseMain }
    ]
})

const app=new Vue({
    el: '#mainApp',
    template: '<div><searchIndexMainRoot></searchIndexMainRoot></div>',
    data: function() {
        return {}
    },
    router,
    mounted() {
        appClientUtility.HidTopLoadBar();
    },
    methods: {}
})
