/*绑定一般信息的Vue组件*/
Vue.component("fd-control-datasource", {
    data: function () {
        return {
            normalDataSource: {
                defaultIsNull:"true",
                sqlDataSource:"",
                dictionaryIdDataSource:"",
                restDataSource:"",
                staticDataSource:""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
    },
    mounted: function () {

    },
    methods: {
        getValue:function () {
            this.normalDataSource.sqlDataSource=encodeURIComponent(this.normalDataSource.sqlDataSource);
            return this.normalDataSource;
        },
        setValue:function (newValue) {
            this.normalDataSource=newValue;
            this.normalDataSource.sqlDataSource=decodeURIComponent(newValue.sqlDataSource);
            this.$refs.sqlGeneralDesignComp.setValue(this.normalDataSource.sqlDataSource);
        }
    },
    template: `<table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                    <colgroup>
                        <col style="width: 100px" />
                        <col style="width: 280px" />
                        <col style="width: 100px" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                默认空：
                            </td>
                            <td>
                                <radio-group type="button" style="margin: auto" v-model="normalDataSource.defaultIsNull">
                                    <radio label="true">是</radio>
                                    <radio label="false">否</radio>
                                </radio-group>
                            </td>
                            <td colspan="2">
                                获取数据源优先级别->Rest接口->本地接口->sql->静态值
                            </td>
                        </tr>
                        <tr>
                            <td>
                                静态值：
                            </td>
                            <td colspan="3">

                            </td>
                        </tr>
                        <tr>
                            <td>
                                数据字典：
                            </td>
                            <td colspan="3">

                            </td>
                        </tr>
                        <tr>
                            <td rowspan="2">
                                SQL数据源：
                            </td>
                            <td colspan="3">
                                <span style="color: red">[ITEXT与IVALUE请使用大写]</span>示例:【SELECT '1' ITEXT,'2' IVALUE】
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="background-color: #FFFFFF">
                                <sql-general-design-comp ref="sqlGeneralDesignComp" :sql-designer-height="74"  v-model="normalDataSource.sqlDataSource"></sql-general-design-comp>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                REST数据源：
                            </td>
                            <td colspan="3">

                            </td>
                        </tr>
                    </tbody>
                </table>`
});
