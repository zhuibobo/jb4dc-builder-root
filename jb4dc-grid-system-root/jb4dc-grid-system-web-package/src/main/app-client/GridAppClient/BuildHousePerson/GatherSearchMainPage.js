import Vue from 'vue';
import gatherSearchDataMainRoot from '../VueComponent/gather-search-data-main-root.vue'

Vue.component('gatherSearchDataMainRoot', gatherSearchDataMainRoot);

const app=new Vue({
    el: '#mainApp',
    template: '<gatherSearchDataMainRoot></gatherSearchDataMainRoot>',
    data: function() {
        return {}
    },
    methods: {}
})