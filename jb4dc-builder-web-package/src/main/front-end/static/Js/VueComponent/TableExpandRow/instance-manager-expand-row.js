Vue.component("instance-manager-expand-row", {
    props:['row'],
    data: function () {
        return {
        }
    },
    mounted:function(){

    },
    methods:{
    },
    template: `<div>
        <row>
            <i-col span="1">
                <div>模型名称：</div>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelName }}</div>
            </i-col>
            <i-col span="1">
                <div>模型ID：</div>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelId }}</div>
            </i-col>
        </row>
        <row style="margin-top: 8px">
            <i-col span="1">
                <div>部署人：</div>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelCreator }}</div>
            </i-col>
            <i-col span="1">
                <div>部署时间：</div>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelCreateTime }}</div>
            </i-col>
        </row>
        <row style="margin-top: 8px">
            <i-col span="1">
                 <span>部署模型ID：</span>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelReId }}</div>
            </i-col>
            <i-col span="1">
                 <span>实例ID：</span>
            </i-col>
            <i-col span="11">
                <div>{{ row.instId }}</div>
            </i-col>
        </row>
    </div>`
});