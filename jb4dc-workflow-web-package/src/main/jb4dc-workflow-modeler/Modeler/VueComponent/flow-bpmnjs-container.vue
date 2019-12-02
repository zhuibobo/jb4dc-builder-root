<template>
    <div id="modeler-bpmn-outer" style="height: 800px">
        <div style="display: none">
            <component :is="thisView"></component>
        </div>
        <div class="canvas" id="flow-canvas" style="width: 100%;height: 100%"></div>
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
            showProperties:function (componentName,element) {
                //DialogUtility.AlertText("11");
                this.thisView=componentName;

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