<template>
    <div>
        <div id="list-button-wrap" class="wf-list-button-outer-wrap">
            <div class="list-button-inner-wrap">
                <button-group>
                    <i-button type="success" @click="showAddListenerDialog" icon="md-add"> </i-button>
                    <i-button type="primary" @click="move('up')" icon="md-arrow-up">  </i-button>
                    <i-button type="primary" @click="move('down')" icon="md-arrow-down">  </i-button>
                </button-group>
            </div>
            <div style="clear: both"></div>
        </div>
        <i-table border :columns="addedListenerConfig" :data="addedListenerData"
                 class="iv-list-table" :highlight-row="true" size="small" no-data-text="add listeners"></i-table>
        <div id="addListenerDialog" style="display: none">addListener</div>
    </div>
</template>

<script>
    export default {
        name: "listeners-properties",
        data(){
          return {
              addedListenerConfig:[
                  {
                      title: 'className',
                      key: 'className',
                      align: "center"
                  }, {
                      title: 'eventName',
                      key: 'eventName',
                      align: "center"
                  }
              ],
              addedListenerData:[

              ]
          }
        },
        methods:{
            showAddListenerDialog(){
                DialogUtility.ShowByElemId("addListenerDialog",{
                    title:"Add Listener",
                    width:600,
                    height:400
                },null,{},this);
            },
            move(type){

            }

        }
    }
</script>

<style scoped>

</style>