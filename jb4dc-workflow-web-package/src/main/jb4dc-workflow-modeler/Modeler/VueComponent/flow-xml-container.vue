<template>
    <div class="xml-design-wraper">
        <div class="left-wraper code_wraper">
            <div class="inner">
                <textarea id="TextAreaXMLEditor" style="height: 99%"></textarea>
            </div>
        </div>
        <div class="right-wraper">
            <tabs name="xml-code-tabs">
                <tab-pane tab="xml-code-tabs" label="CodeFragment">
                    <div>Config</div>
                </tab-pane>
                <tab-pane tab="xml-code-tabs" label="Element">
                    <div>Element</div>
                </tab-pane>
            </tabs>
        </div>
    </div>
</template>

<script>
    import { FlowXMLIntegrated } from './XML/FlowXMLIntegrated.js';
    let flowXMLIntegrated;
    export default {
        name: "flow-xml-container",
        mounted:function() {
            flowXMLIntegrated = new FlowXMLIntegrated();
            flowXMLIntegrated.InitializeXMLCodeDesign();
        },
        methods:{
            setXML:function (xml,selectedElem) {
                flowXMLIntegrated.SetEditorXML(xml,selectedElem);
            },
            getXML:function(){
                return flowXMLIntegrated.GetEditorXML();
            }
        }
    }
</script>

<style scoped>

</style>