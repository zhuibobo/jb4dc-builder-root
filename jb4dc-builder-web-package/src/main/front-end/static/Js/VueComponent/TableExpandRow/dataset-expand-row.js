Vue.component("dataset-expand-row", {
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
                <div>应用于：</div>
            </i-col>
            <i-col span="11">
                <div v-for="item in row.userForDescList" class="font-color-peter-river-v04">{{ item }}</div>
            </i-col>
            <i-col span="1">
                <div>备注：</div>
            </i-col>
            <i-col span="11">
                <div>{{ row.dsDesc }}</div>
            </i-col>
        </row>
        <row style="margin-top: 8px">
            <i-col span="1">
                 <span>sql：</span>
            </i-col>
            <i-col span="23">
                <span>【{{ row.dsSqlSelectText }}】</span>
            </i-col>
        </row>
    </div>`
});