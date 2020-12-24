/*绑定一般信息的Vue组件*/
Vue.component("fd-control-multilevel", {
    props: ["value"],
    data: function () {
        return {
            multilevelProps: {
                level2BindControlId:""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        baseInfo: function (newVal) {
            // 必须是input
            this.$emit('input', newVal)
        },
        value: function (newVal) {
            this.multilevelProps = newVal;
        }
    },
    mounted: function () {
        //debugger;
        this.multilevelProps = this.value;
    },
    methods: {},
    template: `<table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 140px" />
                        <col style="width: 200px" />
                        <col style="width: 90px" />
                        <col style="width: 120px" />
                        <col style="width: 90px" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>二级字典绑定到ID：</td>
                            <td colspan="5">
                                 <input type="text" v-model="multilevelProps.level2BindControlId" />
                            </td>
                        </tr>
                    </tbody>
                </table>`
});
