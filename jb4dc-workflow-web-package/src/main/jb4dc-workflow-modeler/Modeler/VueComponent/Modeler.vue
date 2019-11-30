<template>
    <div>
        <spin size="large" fix v-if="isLoading"></spin>
        <div style="position: absolute;right: 10px;top: 6px;z-index: 100">
            <button-group size="small">
                <i-button icon="md-cloud-done" type="primary" @click="save()">保存并部署</i-button>
                <i-button icon="md-checkmark" type="primary" @click="validateDesign()">校验窗体</i-button>
                <i-button icon="md-search" type="primary" @click="savePreview()">历史版本</i-button>
                <i-button icon="md-search" type="primary" @click="savePreview()">关闭</i-button>
            </button-group>
        </div>
        <tabs>
            <tab-pane name="Info" label="Info">

            </tab-pane>
            <tab-pane name="Bpmn" label="Bpmn">
                <div id="modeler-bpmn-outer">
                    <div class="canvas" id="flow-canvas" style="width: 100%;height: 100%"></div>
                </div>
            </tab-pane>
            <tab-pane name="XML" label="XML">

            </tab-pane>
        </tabs>
    </div>
</template>

<script>
    export default {
        name: 'modeler-root',
        data:function () {
            return {
                isLoading:true
            }
        }
    }
</script>
