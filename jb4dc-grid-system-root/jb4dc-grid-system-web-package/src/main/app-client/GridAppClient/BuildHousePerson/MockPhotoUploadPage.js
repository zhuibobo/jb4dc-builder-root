import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";
import photoList from '../VueComponent/photo-list.vue'
import VueConfirmDialog from '../VueComponent/vue-confirm-dialog/index'
import appClientSessionUtility from "../Js/AppClientSessionUtility";

Vue.use(Toasted);
Vue.component('photoList',photoList);
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
//Vue.component('mockReadIdCardRoot', mockReadIdCardRoot);

const app=new Vue({
    el: '#mainApp',
    template: '<div><photoList ref="photoListObj" :session="session" :obj-type="objType"></photoList></div>',
    data: function() {
        return {
            objType:"",
            session:null
        }
    },
    mounted() {
        appClientSessionUtility.BuildSession();
        //console.log(appClientSessionUtility.GetSession());
        this.session=appClientSessionUtility.GetSession();
    },
    methods: {}
})