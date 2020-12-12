import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";
import mockReadIdCardRoot from '../VueComponent/mock-read-id-card-root.vue'
import appClientUtility from "../Js/AppClientUtility";

Vue.use(Toasted)
Vue.component('mockReadIdCardRoot', mockReadIdCardRoot);


const app=new Vue({
    el: '#mainApp',
    template: '<div><mockReadIdCardRoot></mockReadIdCardRoot></div>',
    data: function() {
        return {}
    },
    mounted() {
        appClientUtility.HidTopLoadBar();
    },
    methods: {}
})