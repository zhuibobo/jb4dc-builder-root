<template>
    <div id="modeler-bpmn-outer" :height="height" style="height: 800px">
        <div class="canvas" id="flow-canvas" style="width: 100%;height: 100%"></div>
    </div>
</template>

<script>

    import BpmnModeler from 'bpmn-js/lib/Modeler';
    import diagramXML from '../Resources/newDiagram.bpmn';
    $("#modeler-bpmn-outer").height(PageStyleUtility.GetWindowHeight()-85);

    export default {
        name: "flow-bpmnjs-container",
        data:function () {
            return {
                height:PageStyleUtility.GetWindowHeight()-85
            }
        },
        mounted:function(){
            var modeler = new BpmnModeler({
                "container": $('#flow-canvas')[0]
            });
            console.log(diagramXML);
            modeler.importXML(diagramXML, function (err) {
                console.log(err);
            });
        }
    }
</script>

<style scoped>

</style>