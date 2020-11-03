<template>
    <div>
        <div style="float: left;width: 100%" class="wf-list-button-outer-wrap">
            <div style="float: right;margin-right: 10px;" class="list-button-inner-wrap">
                <i-menu mode="horizontal" active-name="1-1" class="list-button-inner-menu" @on-select="addReceiveType">
                    <submenu name="1-1">
                        <template slot="title">添加接收人类型</template>
                        <menu-group title="设置接收人">
                            <menu-item name="addUser">添加用户</menu-item>
                            <menu-item name="addOrgan">添加组织</menu-item>
                            <menu-item name="addRole">添加角色</menu-item>
                            <menu-item name="addFlowAboutUser">流程相关人员</menu-item>
                            <menu-item name="addExcludeUser">排除指定用户</menu-item>
                            <menu-item name="addAPI">API</menu-item>
                        </menu-group>
                    </submenu>
                </i-menu>
            </div>
            <div style="float: right;height: 30px;line-height: 30px;margin-right: 10px">如果设置了候选人,则优先使用候选人设置</div>
        </div>
        <div style="float: left;width: 100%;margin-top: 4px">
            <i-table border :columns="receiveTableConfig" :data="receiveTableData"
                     class="iv-list-table" size="small" no-data-text="add listeners" height="400">
                <template slot-scope="{ row, index }" slot="action">
                    <div class="wf-list-font-icon-button-class" @click="deleteReceive(index,row)">
                        <Icon type="md-close" />
                    </div>
                </template>
            </i-table>
        </div>
    </div>
</template>

<script>
    import {PODefinition} from "../../BpmnJsExtend/PODefinition";

    export default {
        name: "jb4dc-receive-properties",
        props:["propElemProperties"],
        data:function () {
            return {
                receiveTableConfig:[
                    {
                        title: '类型',
                        key: 'actionType',
                        align: "center",
                        width: 180
                    },
                    {
                        title: '描述',
                        key: 'actionType',
                        align: "left"
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 120,
                        align: "center"
                    }
                ],
                receiveTableData:[]
            }
        },
        created(){
        },
        mounted() {
        },
        beforeDestroy(){

        },
        methods: {
            addReceiveType(name) {
                if(name=="addUser"){

                }
                else if(name=="addOrgan"){

                }
                else if(name=="addRole"){

                }
                else if(name=="addFlowAboutUser"){

                }
                else if(name=="addExcludeUser"){

                }
                else if(name=="addAPI"){

                }
            },
            deleteReceive(index,row){

            }
        }
    }
</script>

<style scoped>

</style>