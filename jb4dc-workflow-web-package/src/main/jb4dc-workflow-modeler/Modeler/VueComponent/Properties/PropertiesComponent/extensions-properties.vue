<template>
    <div>
        <div id="list-button-wrap" class="wf-list-button-outer-wrap">
            <div class="list-button-inner-wrap">
                <button-group>
                    <i-button type="success" @click="showAddListenerDialog" icon="md-add">  </i-button>
                    <i-button type="primary" @click="move('up')" icon="md-arrow-up" disabled>  </i-button>
                    <i-button type="primary" @click="move('down')" icon="md-arrow-down" disabled>  </i-button>
                </button-group>
            </div>
            <div style="clear: both"></div>
        </div>
        <i-table border :columns="addedExtensionConfig" :data="addedExtensionData"
                 class="iv-list-table" size="small" no-data-text="add extension" height="420">
            <template slot-scope="{ row, index }" slot="action">
                <div class="wf-list-font-icon-button-class" @click="deleteExtension(index,row)">
                    <Icon type="md-close" />
                </div>
            </template>
        </i-table>
        <div id="addExtensionsDialog" style="display: none">
            <div>
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 18%" />
                        <col style="width: 82%" />
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>Name：</td>
                        <td>
                            <input type="text" v-model="innerDetailInfo.name" />
                        </td>
                    </tr>
                    <tr>
                        <td>Value：</td>
                        <td>
                            <input type="text" v-model="innerDetailInfo.value" />
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
        name: "extensions-properties",
        props:["propExtensionsPropertiesData"],
        data(){
            return {
                innerDetailInfo:{
                    name:"",
                    value:""
                },
                addedExtensionConfig:[
                    {
                        title: 'Name',
                        key: 'name',
                        align: "center"
                    }, {
                        title: 'Value',
                        key: 'value',
                        align: "center"
                    }, {
                        title: '操作',
                        slot: 'action',
                        width: 120,
                        align: "center"
                    }
                ],
                addedExtensionData:[

                ]
            }
        },
        mounted(){
            this.addedExtensionData=this.propExtensionsPropertiesData;
            //console.log(this.addedListenerData);
        },
        methods:{
            showAddListenerDialog(){
                var dialogElemId="addExtensionsDialog";
                var _self=this;
                this.innerDetailInfo.name="";
                this.innerDetailInfo.value="";
                DialogUtility.ShowByElemId(dialogElemId,{
                    title:"Add Extensions",
                    width:600,
                    height:210,
                    buttons: {
                        "确认": function () {
                            _self.addedExtensionData.push({
                                name:_self.innerDetailInfo.name,
                                value:_self.innerDetailInfo.value
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
            deleteExtension:function (index,row) {
                this.addedExtensionData.splice(index, 1);
            }
        }
    }
</script>

<style scoped>

</style>