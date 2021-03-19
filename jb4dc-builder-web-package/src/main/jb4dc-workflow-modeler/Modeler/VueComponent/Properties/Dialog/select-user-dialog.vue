<template>
    <div ref="selectUserDialogWrap" style="display: none">
        <div style="width: 30%;float: left;height: 452px;border: #a9b7d1 1px solid;border-radius: 4px;margin-right: 10px;overflow: auto">
            <div class="inner-wrap">
                <div>
                    <ul id="select-user-dialog-organZTreeUL" ref="organZTreeUL" class="ztree"></ul>
                </div>
            </div>
        </div>
        <div style="width: 40%;float: left;height: 452px" class="iv-list-page-wrap select-dialog-single-select-table">
            <i-table :height="452" stripe border :columns="userColumnsConfig" :data="userTableData"
                     :highlight-row="true" @on-row-click="selectedUser">
            </i-table>
        </div>
        <div style="width: 27%;float: right;height: 452px;border: #e8eaec 1px solid;border-radius: 4px;">
            <div style="border-bottom: #e8eaec 1px solid;background-color: #f8f8f9;height: 36px;line-height: 36px;padding-left: 10px;border-radius: 4px 4px 0px 0px">选定用户</div>
            <div style="margin-left: 10px;margin-top: 8px">
                <tag type="border" color="success" :closable="true" v-for="item in selectedUserArray" :key="item.userId" :name="item.userId" @on-close="deleteSelectedUser">{{item.userName}}</tag>
            </div>
        </div>
    </div>
</template>

<script>
    import {RemoteUtility} from "../../../Remote/RemoteUtility";
    export default {
        name: "select-user-dialog",
        data() {
            return {
                tree: {
                    organTreeObj: null,
                    treeIdFieldName: "organId",
                    organTreeSelectedNode: null,
                    organTreeSetting: {
                        async: {
                            enable: true,
                            // Ajax 获取数据的 URL 地址
                            url: ""
                        },
                        // 必须使用data
                        data: {
                            key: {
                                name: "organName"
                            },
                            simpleData: {
                                enable: true,
                                idKey: "organId", // id编号命名
                                pIdKey: "organParentId",  // 父id编号命名
                                rootId: 0
                            }
                        },
                        // 回调函数
                        callback: {
                            onClick: function (event, treeId, treeNode) {
                                var _self = this.getZTreeObj(treeId)._host;
                                _self.organTreeNodeSelected(event, treeId, treeNode);
                            },
                            //成功的回调函数
                            onAsyncSuccess: function (event, treeId, treeNode, msg) {
                                appList.treeObj.expandAll(true);
                            }
                        }
                    },
                    selectedTableName: "无"
                },
                userTableData: [],
                userColumnsConfig: [
                    {
                        title: '用户名称',
                        key: 'userName',
                        align: "center"
                    }
                ],
                callBackFunc: null,
                selectedUserArray: []
            }
        },
        mounted() {
            var _self = this;
            DialogUtility.DialogElemObj(this.$refs.selectUserDialogWrap, {
                title: "",
                width: 850,
                height: 560,
                modal: true,
                buttons: {
                    "确认": function () {
                        if (_self.selectedUserArray.length == 0) {
                            DialogUtility.ToastMessage(_self, "请选择人员!");
                        } else {
                            if (typeof (_self.callBackFunc == "function")) {
                                var result = JsonUtility.CloneArraySimple(_self.selectedUserArray);
                                _self.callBackFunc(result);
                            }
                            DialogUtility.CloseDialogElem(_self.$refs.selectUserDialogWrap);
                        }
                    },
                    "清空": function () {
                        if (typeof (_self.callBackFunc == "function")) {
                            _self.callBackFunc([]);
                        }
                        DialogUtility.CloseDialogElem(_self.$refs.selectUserDialogWrap);
                    },
                    "取消": function () {
                        DialogUtility.CloseDialogElem(_self.$refs.selectUserDialogWrap);
                    }
                }
            });
            $(this.$refs.selectUserDialogWrap).dialog("close");
        },
        methods: {
            beginSelectUser(dialogTitle, oldData, callBackFunc) {
                this.selectedUserArray = [];
                $(this.$refs.selectUserDialogWrap).dialog("open");
                $(this.$refs.selectUserDialogWrap).dialog("option", "title", dialogTitle);
                this.callBackFunc = callBackFunc;
                console.log("11111");
                RemoteUtility.GetOrganPOList().then((organPOList) => {
                    console.log(organPOList);
                    this.tree.organTreeObj = $.fn.zTree.init($(this.$refs.organZTreeUL), this.tree.organTreeSetting, organPOList);
                    this.tree.organTreeObj.expandAll(true);
                    this.tree.organTreeObj._host = this;
                });
            },
            organTreeNodeSelected(event, treeId, treeNode) {
                this.tree.organTreeSelectedNode = treeNode;
                // 根节点不触发任何事件1333
                RemoteUtility.GetUserPOListByOrganId(treeNode.organId).then((userTableData) => {
                    //console.log(userTableData);
                    this.userTableData = userTableData;
                });
            },
            selectedUser(row) {
                //this.selectType="EnvVar";
                var userPath = TreeUtility.BuildNodePathName(this.tree.organTreeSelectedNode, "organName", row.userName, 1);
                var userId = row.userId;
                ArrayUtility.PushWhenNotExist(this.selectedUserArray, {
                    userId: userId,
                    userPath: userPath,
                    userName: row.userName
                }, function (item) {
                    return item.userId == userId
                });
            },
            deleteSelectedUser(event, name) {
                console.log(name);
                for (let i = 0; i < this.selectedUserArray.length; i++) {
                    if (this.selectedUserArray[i].userId == name) {
                        ArrayUtility.Delete(this.selectedUserArray, i);
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>