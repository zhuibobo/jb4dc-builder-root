import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";

import defaultIndexRoot from '../VueComponent/default-index-root.vue'

Vue.component('defaultIndexRoot',defaultIndexRoot);
Vue.use(Toasted)

const app=new Vue({
    el: '#mainApp',
    template: '<div><defaultIndexRoot></defaultIndexRoot></div>',
    data: function() {
        return {}
    },
    methods: {}
})