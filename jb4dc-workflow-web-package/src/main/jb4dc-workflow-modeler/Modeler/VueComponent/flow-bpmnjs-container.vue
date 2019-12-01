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

            }
        },
        mounted:function(){
            //console.log(FlowBpmnJsExtendContainer);
            flowBpmnJsExtendContainer=new FlowBpmnJsExtendContainer();
            flowBpmnJsExtendContainer.Initialize({
                RendererToElemId:"flow-canvas"
            })
        },
        methods:{
            logXML:function () {
                flowBpmnJsExtendContainer.LogXML();
            }
        }
    }
</script>

<style scoped>

</style>