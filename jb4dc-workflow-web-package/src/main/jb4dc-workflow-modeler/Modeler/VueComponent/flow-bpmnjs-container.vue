<template>
    <div id="modeler-bpmn-outer" class="modeler-bpmn-outer">
        <div style="display: none" id="properties-window">
            <component :is="thisView"></component>
        </div>
        <div class="flow-bpmnjs-toolbar-outer">
            <div class="flow-bpmnjs-toolbar-inner">
                <div class="toolbar-item zoom-to" title="自适应缩放"></div>
                <div class="toolbar-item zoom-in" title="放大"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
                <div class="toolbar-item zoom-out" title="缩小"></div>
            </div>
        </div>
        <div class="flow-bpmnjs-container" id="flow-canvas"></div>
        <div class="flow-bpmnjs-selected-element-container">
            <div>选中元素相关属性</div>
        </div>
    </div>
</template>

<script>

    import { FlowBpmnJsExtendContainer } from './BpmnJsExtend/FlowBpmnJsExtendContainer.js';
    import userTaskProperties from "./Properties/user-task-properties.vue";
    import sequenceFlowProperties from "./Properties/sequence-flow-properties.vue";
    let flowBpmnJsExtendContainer;
    export default {
        name: "flow-bpmnjs-container",
        components: {
            userTaskProperties,
            sequenceFlowProperties
        },
        data:function () {
            return {
                thisView:"userTaskProperties"
            }
        },
        mounted:function(){
            //console.log(FlowBpmnJsExtendContainer);
            $("#modeler-bpmn-outer").height(PageStyleUtility.GetPageHeight()-38);
            flowBpmnJsExtendContainer=new FlowBpmnJsExtendContainer();
            flowBpmnJsExtendContainer.Initialize({
                RendererToElemId:"flow-canvas",
                FlowBpmnJsContainer:this
            })
        },
        methods:{
            logXML:function () {
                flowBpmnJsExtendContainer.LogXML();
            },
            showProperties:function (componentName,title,element) {
                //DialogUtility.AlertText("11");
                this.thisView=componentName;
                DialogUtility.ShowByElemId("properties-window",{height: 610, width: 980,title:title},null,{},this);
                /*if(this.thisView=="userTaskProperties"){

                }
                else{
                    this.thisView="userTaskProperties";
                }*/
            }
        }
    }
</script>

<style scoped>

</style>