import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toasted from 'vue-toasted';
import "../Less/GridAppClient.less";

Vue.use(Toasted)

const app=new Vue({
    el: '#mainApp',
    template: '<div>查询.....</div>',
    data: function() {
        return {}
    },
    methods: {}
})