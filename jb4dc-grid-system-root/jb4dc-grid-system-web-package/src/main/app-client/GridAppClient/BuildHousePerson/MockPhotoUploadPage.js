import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";
import photoList from '../VueComponent/photo-list.vue'
import VueConfirmDialog from '../VueComponent/vue-confirm-dialog/index'
import appClientSessionUtility from "../Js/AppClientSessionUtility";
const appClientUtility = require('../Js/AppClientUtility.js');
Vue.use(Toasted);
Vue.component('photoList',photoList);
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
//Vue.component('mockReadIdCardRoot', mockReadIdCardRoot);

const app=new Vue({
    el: '#mainApp',
    template: '<div><div class="tool-bar">\n' +
        '      <div class="tool-bar-back" @click="gotoPage(\'GatherIndexMainPage.html\')"></div>\n' +
        '      读取测试\n' +
        '    </div><photoList ref="photoListObj" :session="session" :obj-type="objType"></photoList><vue-confirm-dialog></vue-confirm-dialog></div>',
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
        this.$refs.photoListObj.setRecordId("112233445566778899");
        window.setTimeout(()=> {
            this.$refs.photoListObj.loadPhotoFromServer();
        },1000);
    },
    methods: {
        gotoPage:function (url){
            url=appClientUtility.StringUtility.FormatGoToUrl(url,this.session);
            window.location.href=url;
        }
    }
})