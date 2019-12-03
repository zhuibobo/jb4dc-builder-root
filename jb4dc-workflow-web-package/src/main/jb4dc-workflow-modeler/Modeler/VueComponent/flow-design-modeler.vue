<template>
    <div class="flow-design-modeler-outer">
        <spin size="large" fix v-if="isLoading"></spin>
        <div style="position: absolute;right: 10px;top: 6px;z-index: 100">
            <button-group size="small">
                <i-button icon="md-cloud-done" type="primary" @click="save()">保存</i-button>
                <i-button icon="md-cloud-done" type="primary">保存并部署</i-button>
                <i-button icon="md-checkmark" type="primary">校验窗体</i-button>
                <i-button icon="md-search" type="primary">历史版本</i-button>
                <i-button icon="md-search" type="primary" @click="consoleLogBpmnJsXml">console-log</i-button>
                <i-button icon="md-search" type="primary">关闭</i-button>
            </button-group>
        </div>
        <tabs name="flow-design-modeler-tabs">
            <tab-pane tab="flow-design-modeler-tabs" label="Model">

            </tab-pane>
            <tab-pane tab="flow-design-modeler-tabs" label="Bpmn">
                <flow-bpmnjs-container ref="flowBpmnjsContainer"></flow-bpmnjs-container>
            </tab-pane>
            <tab-pane tab="flow-design-modeler-tabs" label="XML">

            </tab-pane>
        </tabs>

    </div>
</template>

<script>
    import flowBpmnjsContainer from "./flow-bpmnjs-container.vue";

    export default {
        name: 'flow-design-modeler',
        components: {
            flowBpmnjsContainer,

        },
        data:function () {
            return {
                isLoading:false
            }
        },
        methods:{
            consoleLogBpmnJsXml:function () {
                this.$refs["flowBpmnjsContainer"].logXML();
            }
        }
    }
</script>
