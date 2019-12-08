<template>
    <div id="modeler-bpmn-wraper" class="modeler-bpmn-wraper">
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
    import processProperties from "./Properties/process-properties.vue";
    let flowBpmnJsExtendContainer;
    export default {
        name: "flow-bpmnjs-container",
        components: {
            userTaskProperties,
            sequenceFlowProperties,
            processProperties
        },
        data:function () {
            return {
                thisView:"userTaskProperties"
            }
        },
        mounted:function(){
            //console.log(FlowBpmnJsExtendContainer);
            $("#modeler-bpmn-wraper").height(PageStyleUtility.GetPageHeight()-38);
            flowBpmnJsExtendContainer=new FlowBpmnJsExtendContainer();
            flowBpmnJsExtendContainer.Initialize({
                RendererToElemId:"flow-canvas",
                FlowBpmnJsContainer:this
            });
        },
        methods:{
            logXML:function () {
                flowBpmnJsExtendContainer.LogXML();
            },
            getXML:function(){
                return flowBpmnJsExtendContainer.GetXML();
            },
            setXML:function(xml){
                flowBpmnJsExtendContainer.SetXML(xml);
            },
            showProperties:function (componentName,title,element) {
                //DialogUtility.AlertText("11");
                var dialogElemId="properties-window";
                this.thisView=componentName;
                DialogUtility.ShowByElemId(
                    dialogElemId,
                    {
                        height: 610,
                        width: 980,
                        title:title,
                        buttons: {
                            "确认": function () {

                                DialogUtility.CloseByElemId(dialogElemId);
                            },
                            "取消": function () {
                                DialogUtility.CloseByElemId(dialogElemId);
                            }
                        }
                    },null,{},this
                );
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