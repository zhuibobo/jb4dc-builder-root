<template>
    <div id="modeler-bpmn-wraper" class="modeler-bpmn-wraper">
        <div style="display: none" id="properties-window">
            <component :is="elemPropertiesDialogView" ref="dialogPropertiesWindow" :prop-elem-properties="currentEditProperties"></component>
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
    import sequenceFlowProperties from "./Properties/sequence-flow-properties.vue";
    import processProperties from "./Properties/process-properties.vue";
    import emptyProperties from "./Properties/empty-properties.vue";
    let flowBpmnJsIntegrated;
    export default {
        name: "flow-bpmnjs-container",
        components: {
            emptyProperties,
            userTaskProperties,
            sequenceFlowProperties,
            processProperties,
        },
        data () {
            return {
                elemPropertiesDialogView:"emptyProperties",
                currentEditProperties:null,
                elemHTMLDisplay:""
            }
        },
        mounted(){
            //console.log(FlowBpmnJsExtendContainer);
            $("#modeler-bpmn-wraper").height(PageStyleUtility.GetPageHeight()-38);
            flowBpmnJsIntegrated=FlowBpmnJsIntegrated.CreateInstance({
                RendererToElemId:"flow-canvas",
                FlowBpmnJsContainer:this,
                ChangeSelectedElemCB:this.changeSelectedElem
            });
            /*flowBpmnJsIntegrated=new FlowBpmnJsIntegrated();
            flowBpmnJsIntegrated.Initialize({
                RendererToElemId:"flow-canvas",
                FlowBpmnJsContainer:this,
                ChangeSelectedElemCB:this.changeSelectedElem
            });*/
            //window.flowBpmnJsIntegrated=flowBpmnJsIntegrated;
        },
        methods:{
            logXML () {
                flowBpmnJsExtendContainer.LogXML();
            },
            getXML(){
                return flowBpmnJsIntegrated.GetXML();
            },
            setXML(xml){
                flowBpmnJsIntegrated.SetXML(xml);
            },
            getSelectedElement(){
                return flowBpmnJsIntegrated.GetSelectedElement();
            },
            changeSelectedElem(selectedElem){
                //console.log(selectedElem);
                //console.log(elemToDialogProps);
                this.elemHTMLDisplay=flowBpmnJsIntegrated.ConvertElemToHTMLDisplay(selectedElem);
                var ps = new PerfectScrollbar('#fbseInnerContainer');
            },
            showProperties (componentName,title,element,elemToDialogProps) {
                //console.log(elemToDialogProps);
                //console.log(elemToDialogProps);
                //DialogUtility.AlertText("11");
                var dialogElemId="properties-window";
                this.elemPropertiesDialogView=componentName;
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
            }
        }
    }
</script>

<style scoped>

</style>