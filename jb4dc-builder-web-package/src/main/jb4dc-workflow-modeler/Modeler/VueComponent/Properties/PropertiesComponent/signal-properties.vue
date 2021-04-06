<template>
    <div>
        <div id="list-button-wrap" class="wf-list-button-outer-wrap">
            <div class="list-button-inner-wrap">
                <button-group>
                    <i-button type="success" @click="showAddDialog" icon="md-add">  </i-button>
                </button-group>
            </div>
            <div style="clear: both"></div>
        </div>
        <i-table border :columns="addedSignalConfig" :data="addedSignalData"
                 class="iv-list-table" size="small" no-data-text="add Signal" height="420">
            <template slot-scope="{ row, index }" slot="action">
                <div class="wf-list-font-icon-button-class" @click="deleteSignal(index,row)">
                    <Icon type="md-close" />
                </div>
            </template>
        </i-table>
        <div id="addSignalsDialog" style="display: none">
            <div>
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 18%" />
                        <col style="width: 82%" />
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>Id：</td>
                        <td>
                            <input type="text" v-model="innerDetailInfo.id" />
                            <div style="margin-top: 8px">
                                <tag type="border" color="success">Id使用Signal_前缀,英文</tag>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Name：</td>
                        <td>
                            <input type="text" v-model="innerDetailInfo.name" />
                            <div style="margin-top: 8px">
                                <tag type="border" color="success">使用英文,意义明确,内部唯一</tag>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Desc：</td>
                        <td>
                            <textarea rows="5" v-model="innerDetailInfo.jb4dcDesc"></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "signal-properties",
    props:["propSignalPropertiesData"],
    data(){
        return {
            innerDetailInfo:{
                id:"",
                name:"",
                jb4dcDesc:""
            },
            addedSignalConfig:[
                {
                    title: 'Id',
                    key: 'id',
                    align: "center",
                    width:180
                }, {
                    title: 'Name',
                    key: 'name',
                    align: "center",
                    width:250
                }, {
                    title: 'Desc',
                    key: 'jb4dcDesc',
                    align: "left"
                }, {
                    title: '操作',
                    slot: 'action',
                    width: 120,
                    align: "center"
                }
            ],
            addedSignalData:[

            ]
        }
    },
    mounted(){
        this.addedSignalData=this.propSignalPropertiesData;
        //console.log(this.addedListenerData);
    },
    methods:{
        showAddDialog(){
            var dialogElemId="addSignalsDialog";
            var _self=this;
            this.innerDetailInfo.id="Signal_"+StringUtility.Timestamp();
            this.innerDetailInfo.name="";
            this.innerDetailInfo.jb4dcDesc="";
            DialogUtility.ShowByElemId(dialogElemId,{
                title:"Add Signals",
                width:600,
                height:400,
                buttons: {
                    "确认": function () {
                        _self.addedSignalData.push({
                            id:_self.innerDetailInfo.id,
                            name:_self.innerDetailInfo.name,
                            jb4dcDesc:_self.innerDetailInfo.jb4dcDesc
                        });
                        //$("#"+dialogElemId).dialog("destroy");
                        DialogUtility.DestroyByElemId(dialogElemId);
                    },
                    "取消": function () {
                        DialogUtility.DestroyByElemId(dialogElemId);
                    }
                }
            },null,{},this);
        },
        move(type){

        },
        deleteSignal:function (index,row) {
            this.addedSignalData.splice(index, 1);
        }
    }
}
</script>

<style scoped>

</style>