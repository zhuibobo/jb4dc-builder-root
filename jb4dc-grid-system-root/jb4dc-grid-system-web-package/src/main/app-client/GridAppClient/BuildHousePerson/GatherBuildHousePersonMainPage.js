import Vue from 'vue';
import gatherBHPEDataMainRoot from '../VueComponent/gather-bhpe-data-main-root.vue'

Vue.component('gatherBHPEDataMainRoot', gatherBHPEDataMainRoot);

const app=new Vue({
    el: '#mainApp',
    template: '<gatherBHPEDataMainRoot></gatherBHPEDataMainRoot>',
    data: function() {
        return {}
    },
    methods: {}
})