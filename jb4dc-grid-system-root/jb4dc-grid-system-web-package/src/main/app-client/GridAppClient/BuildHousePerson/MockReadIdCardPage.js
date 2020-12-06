import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';

import mockReadIdCardRoot from '../VueComponent/mock-read-id-card-root.vue'

Vue.use(Toasted)
Vue.component('mockReadIdCardRoot', mockReadIdCardRoot);


const app=new Vue({
    el: '#mainApp',
    template: '<div><mockReadIdCardRoot></mockReadIdCardRoot></div>',
    data: function() {
        return {}
    },
    methods: {}
})