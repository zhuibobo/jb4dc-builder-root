<template>
    <div id="modeler-bpmn-outer" style="height: 800px">
        <div class="canvas" id="flow-canvas" style="width: 100%;height: 100%"></div>

    </div>
</template>

<script>

    import { FlowBpmnJsExtendContainer } from './BpmnJsExtend/FlowBpmnJsExtendContainer.js';
    let flowBpmnJsExtendContainer;
    export default {
        name: "flow-bpmnjs-container",
        data:function () {
            return {
                thisView: 'compA'
            }
        },
        mounted:function(){
            //console.log(FlowBpmnJsExtendContainer);
            flowBpmnJsExtendContainer=new FlowBpmnJsExtendContainer();
            flowBpmnJsExtendContainer.Initialize({
                RendererToElemId:"flow-canvas",

            })
        },
        methods:{
            logXML:function () {
                flowBpmnJsExtendContainer.LogXML();
            },
            showProperties:function (componentName,propertiesData) {
                DialogUtility.AlertText("11");
            }
        }
    }
</script>

<style scoped>

</style>