<template>
    <div id="modeler-bpmn-wraper" class="modeler-bpmn-wraper">
        <div style="display: none" id="properties-window">
            <component :is="thisView" ref="dialogPropertiesWindow" :elem-properties="currentEditProperties"></component>
        </div>
        <div class="flow-bpmnjs-toolbar-outer">
            <div class="flow-bpmnjs-toolbar-inner">
                <div class="toolbar-item zoom-to" title="自适应缩放" @click="zoomAuto"></div>
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
        data () {
            return {
                thisView:"userTaskProperties",
                currentEditProperties:null
            }
        },
        mounted(){
            //console.log(FlowBpmnJsExtendContainer);
            $("#modeler-bpmn-wraper").height(PageStyleUtility.GetPageHeight()-38);
            flowBpmnJsExtendContainer=new FlowBpmnJsExtendContainer();
            flowBpmnJsExtendContainer.Initialize({
                RendererToElemId:"flow-canvas",
                FlowBpmnJsContainer:this
            });
        },
        methods:{
            logXML () {
                flowBpmnJsExtendContainer.LogXML();
            },
            getXML(){
                return flowBpmnJsExtendContainer.GetXML();
            },
            setXML(xml){
                flowBpmnJsExtendContainer.SetXML(xml);
            },
            showProperties (componentName,title,element,elemToDialogProps) {
                console.log(element);
                //DialogUtility.AlertText("11");
                var dialogElemId="properties-window";
                this.thisView=componentName;
                var _self=this;
                DialogUtility.ShowByElemId(
                    dialogElemId,
                    {
                        height: 610,
                        width: 980,
                        title:title,
                        buttons: {
                            "确认": function () {
                                var dialogComponentProperties=_self.$refs.dialogPropertiesWindow.getValue();
                                //console.log(dialogComponentJson);
                                flowBpmnJsExtendContainer.DeSerializationDialogPropsToElem(dialogComponentProperties,element);
                                DialogUtility.CloseByElemId(dialogElemId);
                            },
                            "取消": function () {
                                DialogUtility.CloseByElemId(dialogElemId);
                            }
                        }
                    },null,{},this
                );
                this.currentEditProperties=elemToDialogProps;
                /*console.log(_self.$refs.dialogPropertiesWindow);
                window.setTimeout(function () {
                    console.log(_self.$refs.dialogPropertiesWindow);
                    //_self.$refs.dialogPropertiesWindow.setValue({x:"2"});
                },1000);*/

                /*if(this.thisView=="userTaskProperties"){

                }
                else{
                    this.thisView="userTaskProperties";
                }*/
            },
            zoomAuto(){
                flowBpmnJsExtendContainer.ZoomAuto();
            }
        }
    }
</script>

<style scoped>

</style>