/*
import "./Less/ModelerApp.less"
import BpmnModeler from 'bpmn-js/lib/Modeler';
import diagramXML from './Resources/newDiagram.bpmn';

$("#modeler-bpmn-outer").height(PageStyleUtility.GetWindowHeight()-85);

var modeler = new BpmnModeler({
    "container": $('#flow-canvas')[0]
});

modeler.importXML(diagramXML, function (err) {
    console.log(err);
});
*/
import "./Less/ModelerApp.less";
import Vue from "Vue";

import ModelerApp from "./VueComponent/flow-modeler-container.vue";


new Vue({
    el: '#appForm',
    render: h => h(ModelerApp),
});

/*let IsTopFramePage=true;

var appForm = new Vue({
    el:"#appForm",
    data: {
        isLoading:false,
        acInterface:{
            getTablesDataUrl:"/Rest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList"
        },
        currUserEntity:null,
        recordId:BaseUtility.GetUrlParaValue("recordId"),
        /!*Js Bean*!/
        formResourceEntity:{
        },
        status: BaseUtility.GetUrlParaValue("op"),
        oldSelectedTabName:"",
        selectedTabName:"",
        designThemes:[],
        pluginVoList:null
    },
    mounted:function () {

    },
    methods: {

    }
});*/
