<template>
    <div>
        <div id="list-button-wrap" class="wf-list-button-outer-wrap">
            <div class="list-button-inner-wrap">
                <button-group>
                    <i-button type="success" @click="showAddListenerDialog" icon="md-add"> </i-button>
                    <i-button type="primary" @click="move('up')" icon="md-arrow-up" disabled>  </i-button>
                    <i-button type="primary" @click="move('down')" icon="md-arrow-down" disabled>  </i-button>
                </button-group>
            </div>
            <div style="clear: both"></div>
        </div>
        <i-table border :columns="addedListenerConfig" :data="addedListenerData"
                 class="iv-list-table" size="small" no-data-text="add listeners" height="420">
            <template slot-scope="{ row, index }" slot="action">
                <div class="wf-list-font-icon-button-class" @click="deleteListener(index,row)">
                    <Icon type="md-close" />
                </div>
            </template>
        </i-table>
        <div :id="addListenerDialogId" style="display: none">
            <div>
                <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 18%" />
                        <col style="width: 82%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>Event Type：</td>
                            <td>
                                <Select v-model="innerDetailInfo.eventType" style="width:300px">
                                    <Option value="start">start</Option>
                                    <Option value="end">end</Option>
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <td>Listener Type：</td>
                            <td>
                                <Select v-model="innerDetailInfo.listenerType" style="width:300px">
                                    <Option value="class">Java Class</Option>
                                    <Option value="expression">Expression</Option>
                                    <Option value="delegateExpression">Delegate Expression</Option>
                                    <!--<Option value="script">Script</Option>-->
                                </Select>
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
        name: "listeners-properties",
        props:["propListenerData"],
        data(){
          return {
              innerDetailInfo:{
                  eventType:"start",
                  listenerType:"class",
                  value:""
              },
              addedListenerConfig:[
                  {
                      title: 'EventName',
                      key: 'eventName',
                      align: "center",
                      width: 120,
                  },
                  {
                      title: 'ListenerType',
                      key: 'listenerType',
                      align: "center",
                      width: 120,
                  },
                  {
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
              addedListenerData:[

              ],
              addListenerDialogId:"addListenerDialog"
          }
        },
        mounted(){
            //console.log("2");
            this.addedListenerData=this.propListenerData;
            this.addListenerDialogId="addListenerDialogId_"+StringUtility.GuidSplit("");
            //console.log(this.addedListenerData);
        },
        methods:{
            showAddListenerDialog(){
                var _self=this;
                var dialogElemId=this.addListenerDialogId;
                this.innerDetailInfo.javaClass="";
                DialogUtility.ShowByElemId(dialogElemId,{
                    title:"Add Listener",
                    width:600,
                    height:270,
                    buttons: {
                        "确认": function () {
                            _self.addedListenerData.push({
                                eventName:_self.innerDetailInfo.eventType,
                                listenerType:_self.innerDetailInfo.listenerType,
                                value:_self.innerDetailInfo.value
                            });
                            DialogUtility.DestroyByElemId(dialogElemId);
                        },
                        "取消": function () {
                            DialogUtility.DestroyByElemId(dialogElemId);
                        }
                    }
                },null,{},this);
            },
            deleteListener(index,row){
                this.addedListenerData.splice(index, 1);
            },
            move(type){

            },
            getHostResultProperties(){
                return this.addedListenerData;
            }
        }
    }
</script>

<style scoped>

</style>