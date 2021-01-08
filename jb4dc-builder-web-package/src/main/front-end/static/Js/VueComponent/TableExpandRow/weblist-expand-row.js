Vue.component("weblist-expand-row", {
    props:['row'],
    data: function () {
        return {
        }
    },
    mounted:function(){

    },
    methods:{
        editDataSet:function (dataSet){
            var url = BaseUtility.BuildView("/HTML/Builder/DataSet/DataSetEdit.html", {
                "op": "update",
                "groupId": dataSet.dsGroupId,
                "recordId":dataSet.dsId
            });
            DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "数据集设计"}, 0);
        }
    },
    template: `<div>
        <div v-for="dataSet in row.dataSetPOList">
            <row>
                <i-col span="1">
                    <div>数据集：</div>
                </i-col>
                <i-col span="23">
                    <div class="font-color-concrete-v10">{{ dataSet.dsCode }}【{{ dataSet.dsCaption }}】{{ dataSet.dsDesc }} <a @click="editDataSet(dataSet)">编辑</a></div>
                </i-col>
            </row>
            <row style="margin-top: 8px">
                <i-col span="1">
                     <span>数据集sql：</span>
                </i-col>
                <i-col span="23">
                    <div class="font-color-concrete-v10">{{ dataSet.dsSqlSelectText }}</div>
                </i-col>
            </row>
            <row style="margin-top: 8px">
                <i-col span="1">
                     <span>数据集用于：</span>
                </i-col>
                <i-col span="23">
                    <div  v-for="userForDesc in dataSet.userForDescList" class="font-color-concrete-v10">{{userForDesc}}</div>
                </i-col>
            </row>
        </div>
    </div>`
});