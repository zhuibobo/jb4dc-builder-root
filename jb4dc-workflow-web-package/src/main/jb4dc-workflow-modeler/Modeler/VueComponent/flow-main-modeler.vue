<template>
    <div class="flow-design-modeler-wraper">
        <spin size="large" fix v-if="isLoading"></spin>
        <div style="position: absolute;right: 10px;top: 6px;z-index: 100">
            <button-group size="small">
                <i-button icon="md-cloud-done" type="primary" @click="save()">保存</i-button>
                <i-button icon="md-cloud-done" type="primary">保存并部署</i-button>
                <i-button icon="md-checkmark" type="primary">校验窗体</i-button>
                <i-button icon="md-search" type="primary">历史版本</i-button>
                <i-button icon="md-search" type="primary" @click="consoleLogBpmnJsXml">console-log</i-button>
                <i-button icon="md-search" type="primary">关闭</i-button>
            </button-group>
        </div>
        <tabs name="flow-design-modeler-tabs"  @on-click="tabChange" v-model="selectedTabName">
            <tab-pane tab="flow-design-modeler-tabs" name="Bpmn" label="Bpmn">
                <flow-bpmnjs-container ref="flowBpmnjsContainer"></flow-bpmnjs-container>
            </tab-pane>
            <tab-pane tab="flow-design-modeler-tabs" name="XML" label="XML">
                <flow-xml-container ref="flowXmlContainer"></flow-xml-container>
            </tab-pane>
            <tab-pane tab="flow-design-modeler-tabs" name="Info" label="Document&Description">
                <flow-base-container ref="flowBaseContainer"></flow-base-container>
            </tab-pane>
        </tabs>

    </div>
</template>

<script>
    import flowBaseContainer from "./flow-base-container.vue";
    import flowBpmnjsContainer from "./flow-bpmnjs-container.vue";
    import jb4dcGeneralProperties from "./Properties/PropertiesComponent/jb4dc-general-properties.vue";
    import flowXmlContainer from "./flow-xml-container.vue";
    import {RemoteUtility} from '../Remote/RemoteUtility';

    export default {
        name: 'flow-design-modeler',
        components: {
            flowBaseContainer,
            flowBpmnjsContainer,
            flowXmlContainer,
            jb4dcGeneralProperties
        },
        data:function () {
            return {
                isLoading:false,
                oldSelectedTabName:"",
                selectedTabName:"Bpmn"
            }
        },
        mounted:function(){
            this.initPageUI();
        },
        methods:{
            consoleLogBpmnJsXml:function () {
                this.$refs["flowBpmnjsContainer"].logXML();
            },
            tabChange:function () {

            },
            initPageUI:function(){
                this.isLoading=true;
                this.oldSelectedTabName=this.selectedTabName;
                RemoteUtility.TryLoadModuleContext("");
                window.setTimeout(() => {
                    this.isLoading=false;
                },1000);

            },
            isXMLToOther:function(name){
                if(this.oldSelectedTabName=="XML"){
                    //if(name=="Design"){
                    return true;
                    //}
                }
                return false;
            },
            isBpmnDesignToOther:function(name){
                if(this.oldSelectedTabName=="Bpmn"){
                    //if(name=="HTML"){
                    return true;
                    //}
                }
                return false;
            },
            tabChange:function (name) {
                if(this.isBpmnDesignToOther(name)){
                    var xml=this.$refs["flowBpmnjsContainer"].getXML();
                    //console.log(xml);
                    var selectedElem=this.$refs["flowBpmnjsContainer"].getSelectedElement();
                    this.$refs["flowXmlContainer"].setXML(xml,selectedElem);
                    //var html=CKEditorUtility.GetCKEditorHTML();
                    //JBuild4DC.FormDesign.SetHTMLEditorHTML("<div id='aaa'><div><div><div>ssssssssss</div></div></div></div>");
                    //HTMLEditorUtility.SetHTMLEditorHTML(html);
                }
                else if(this.isXMLToOther(name)){
                    var xml=this.$refs["flowXmlContainer"].getXML();
                    this.$refs["flowBpmnjsContainer"].setXML(xml);
                    //alert(html);
                    //CKEditorUtility.SetCKEditorHTML(html);
                }
                this.oldSelectedTabName=name;
            }
        }
    }
</script>
