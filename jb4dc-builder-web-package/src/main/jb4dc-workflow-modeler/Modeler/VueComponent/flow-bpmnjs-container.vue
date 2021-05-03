<template>
    <div id="modeler-bpmn-wraper" class="modeler-bpmn-wraper">
        <div style="display: none" id="properties-window">
            <component :is="elemPropertiesDialogView" ref="dialogPropertiesWindow" :prop-elem-properties="currentEditProperties"></component>
        </div>
        <div class="flow-bpmnjs-toolbar-outer">
            <div class="flow-bpmnjs-toolbar-inner">
                <div class="toolbar-item zoom-auto" title="自适应缩放" @click="zoomAuto"></div>
                <div class="toolbar-item zoom-p100" title="100%" @click="zoomP100"></div>
                <div class="toolbar-item zoom-p50" title="50%" @click="zoomP50"></div>
                <div class="toolbar-item zoom-align" title="左对齐" @click="align('left')"></div>
                <div class="toolbar-item zoom-center" title="居中对齐" @click="align('center')"></div>
                <div class="toolbar-item zoom-right" title="右对齐" @click="align('right')"></div>
                <div class="toolbar-item zoom-top" title="顶部对齐" @click="align('top')"></div>
                <div class="toolbar-item zoom-middle" title="上下居中对齐" @click="align('middle')"></div>
                <div class="toolbar-item zoom-bottom" title="底部对齐" @click="align('bottom')"></div>
                <div class="toolbar-item zoom-horizontal" title="水平分布" @click="distribute('horizontal')"></div>
                <div class="toolbar-item zoom-vertical" title="垂直分布" @click="distribute('vertical')"></div>
            </div>
        </div>
        <div class="flow-bpmnjs-container" id="flow-canvas"></div>
        <div class="flow-bpmnjs-selected-element-container">
            <div class="fbse-inner-container" v-html="elemHTMLDisplay" id="fbseInnerContainer">
                <!--<div class="fbse-inner-title">【bpmn:Process】</div>
                <div class="fbse-inner-single-attr">[id]</div>
                <div class="fbse-inner-single-value">[id]</div>
                <div class="fbse-inner-single-attr">[name]</div>
                <div class="fbse-inner-single-value">[name]</div>
                <div class="fbse-inner-single-attr">[candidateStarterGroups]</div>
                <div class="fbse-inner-single-value">[candidateStarterGroups candidateStarterGroups]</div>
                <div class="fbse-inner-single-attr">[candidateStarterUsers]</div>
                <div class="fbse-inner-single-value">[candidateStarterUsers candidateStarterGroups]</div>
                <div class="fbse-inner-single-attr">[jb4dcCode]</div>
                <div class="fbse-inner-single-value">[jb4dcCode]</div>
                <div class="fbse-inner-single-attr">[jb4dcProcessTitle]</div>
                <div class="fbse-inner-single-value">[&#60;&#60;&#62;&#62;&#60;&#60;&#62;&#62;&#60;&#60;&#62;&#60;&#62;&#60;&#62;&#60;&#62;&#34;&#34;&#39;&#39;&#39;&#39;&#39;${TDEV_TEST_2.F_AUTHOR}${TDEV_TEST_2.F_AUTHOR}${TDEV_TEST_2.F_AUTHOR}${TDEV_TEST_2.F_AUTHOR}]</div>
                <div class="fbse-inner-single-attr">[executionListener]</div>
                <div class="fbse-inner-single-value">[jb4dcCode]</div>-->
            </div>
        </div>
    </div>
</template>

<script>

    import { FlowBpmnJsIntegrated } from './BpmnJsExtend/FlowBpmnJsIntegrated.js';
    import userTaskProperties from "./Properties/user-task-properties.vue";
    import serviceTaskProperties from "./Properties/service-task-properties.vue";
    import boundaryEventProperties from "./Properties/boundary-event-properties.vue";
    import intermediateThrowEventProperties from "./Properties/intermediate-throw-event-properties.vue";
    import intermediateCatchEventProperties from "./Properties/intermediate-catch-event-properties.vue";
    import startEventForDefinitionProperties from "./Properties/start-event-for-definition-properties.vue";
    import startEventForEmptyProperties from "./Properties/start-event-for-empty-properties.vue";
    import endEventForDefinitionProperties from "./Properties/end-event-for-definition-properties.vue";
    import sequenceFlowProperties from "./Properties/sequence-flow-properties.vue";
    import processProperties from "./Properties/process-properties.vue";
    import emptyProperties from "./Properties/empty-properties.vue";
    import {BpmnJsUtility} from "./BpmnJsExtend/BpmnJsUtility";
    let flowBpmnJsIntegrated;
    export default {
        name: "flow-bpmnjs-container",
        components: {
            emptyProperties,
            userTaskProperties,
            sequenceFlowProperties,
            processProperties,
            serviceTaskProperties,
            boundaryEventProperties,
            intermediateThrowEventProperties,
            intermediateCatchEventProperties,
            startEventForDefinitionProperties,
            startEventForEmptyProperties,
            endEventForDefinitionProperties
        },
        data () {
            return {
                elemPropertiesDialogView:"emptyProperties",
                currentEditProperties:null,
                elemHTMLDisplay:"",
                flowModelIntegratedPO:null
            }
        },
        mounted(){
            //alert(1);
            //console.log(FlowBpmnJsExtendContainer);
            $("#modeler-bpmn-wraper").height(PageStyleUtility.GetPageHeight()-38);
            /*flowBpmnJsIntegrated=new FlowBpmnJsIntegrated();
            flowBpmnJsIntegrated.Initialize({
                RendererToElemId:"flow-canvas",
                FlowBpmnJsContainer:this,
                ChangeSelectedElemCB:this.changeSelectedElem
            });*/
            //window.flowBpmnJsIntegrated=flowBpmnJsIntegrated;
        },
        methods:{
            initCanvas(flowModelIntegratedPO) {
                flowBpmnJsIntegrated = FlowBpmnJsIntegrated.CreateInstance({
                    RendererToElemId: "flow-canvas",
                    FlowBpmnJsContainer: this,
                    ChangeSelectedElemCB: this.changeSelectedElem,
                    Op: BaseUtility.GetUrlOPParaValue(),
                    TemplateName: BaseUtility.GetUrlParaValue("templateName")
                }, flowModelIntegratedPO.modelContent,flowModelIntegratedPO.modelerTemplateContent);
                console.log("--ZoomAuto--");
                //flowBpmnJsIntegrated.ZoomAuto();
            },
            logXML () {
                flowBpmnJsIntegrated.LogXML();
            },
            getXML(func){
                return flowBpmnJsIntegrated.GetXML(func);
            },
            setXML(xml){
                flowBpmnJsIntegrated.SetXML(xml);
            },
            getStartKey(){
                var processElement=BpmnJsUtility.GetProcessElement(flowBpmnJsIntegrated.GetModeler());
                return BpmnJsUtility.BPMN_Attr_GetId(processElement);
            },
            getProcessName(){
                var processElement=BpmnJsUtility.GetProcessElement(flowBpmnJsIntegrated.GetModeler());
                return BpmnJsUtility.BPMN_Attr_GetName(processElement);
            },
            getSelectedElement(){
                return flowBpmnJsIntegrated.GetSelectedElement();
            },
            changeSelectedElem(selectedElem){
                //console.log(selectedElem);1
                //console.log(elemToDialogProps);
                this.elemHTMLDisplay=flowBpmnJsIntegrated.ConvertElemToHTMLDisplay(selectedElem);
                var ps = new PerfectScrollbar('#fbseInnerContainer');
            },
            showProperties (componentName,title,element,elemToDialogProps) {
                //console.log(elemToDialogProps);
                //console.log(elemToDialogProps);
                //DialogUtility.AlertText("11");
                //debugger;
                var dialogElemId="properties-window";
                this.elemPropertiesDialogView=componentName;
                var _self=this;
                DialogUtility.ShowByElemId(
                    dialogElemId,
                    {
                        height: 610,
                        width: 1020,
                        title:title,
                        buttons: {
                            "确认": function () {
                                var dialogComponentProperties=_self.$refs.dialogPropertiesWindow.getValue();
                                console.log(dialogComponentProperties);
                                flowBpmnJsIntegrated.DeSerializationDialogPropsToElem(dialogComponentProperties,element);
                                DialogUtility.CloseByElemId(dialogElemId);
                                _self.elemPropertiesDialogView=emptyProperties;
                            },
                            "取消": function () {
                                DialogUtility.CloseByElemId(dialogElemId);
                            }
                        }
                    },function () {
                        //debugger;
                        //console.log("dest112");
                        _self.elemPropertiesDialogView=emptyProperties;
                        //_self.$destroy(_self.elemPropertiesDialogView);
                    },{},this
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
                flowBpmnJsIntegrated.ZoomAuto();
            },
            zoomP100(){
                flowBpmnJsIntegrated.ZoomP100();
            },
            zoomP50(){
                flowBpmnJsIntegrated.ZoomP50();
            },
            align(type){
                flowBpmnJsIntegrated.Align(type);
            },
            distribute(type){
                flowBpmnJsIntegrated.Distribute(type);
            }
        }
    }
</script>

<style scoped>

</style>