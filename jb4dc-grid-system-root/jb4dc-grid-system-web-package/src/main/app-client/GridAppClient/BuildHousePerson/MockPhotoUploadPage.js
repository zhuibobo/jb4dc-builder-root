import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";
import videoList from '../VueComponent/video-list.vue'
import VueConfirmDialog from '../VueComponent/vue-confirm-dialog/index'
import appClientSessionUtility from "../Js/AppClientSessionUtility";
////const appClientUtility = require('../Js/AppClientUtility.js');
import appClientUtility from '../Js/AppClientUtility.js';
Vue.use(Toasted);
Vue.component('videoList',videoList);
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
//Vue.component('mockReadIdCardRoot', mockReadIdCardRoot);

const app=new Vue({
    el: '#mainApp',
    template: '<div><div class="tool-bar">\n' +
        '      <div class="tool-bar-back" @click="gotoPage(\'GatherIndexMainPage.html\')"></div>\n' +
        '      读取测试\n' +
        '    </div><videoList ref="videoListObj" :session="session" :obj-type="objType" :video-list-wrap-height="\'650px\'"></videoList><vue-confirm-dialog></vue-confirm-dialog></div>',
    data: function() {
        return {
            objType:"测试",
            session:null
        }
    },
    mounted() {
        appClientSessionUtility.BuildSession();
        //console.log(appClientSessionUtility.GetSession());
        this.session=appClientSessionUtility.GetSession();
        console.log(this.session);
        this.$refs.videoListObj.setRecordId("vide00000001Group");
        window.setTimeout(()=> {
            this.$refs.videoListObj.loadVideoFromServer();
        },1000);

        appClientUtility.HidTopLoadBar();
    },
    methods: {
        gotoPage:function (url){
            url=appClientUtility.StringUtility.FormatGoToUrl(url,this.session);
            window.location.href=url;
        }
    }
})