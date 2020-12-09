import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";
import gatherIndexRoot from '../VueComponent/gather-index-root.vue'

Vue.use(Toasted)
Vue.component('gatherIndexRoot', gatherIndexRoot);


const app=new Vue({
    el: '#mainApp',
    template: '<div><gatherIndexRoot></gatherIndexRoot></div>',
    data: function() {
        return {}
    },
    methods: {}
})