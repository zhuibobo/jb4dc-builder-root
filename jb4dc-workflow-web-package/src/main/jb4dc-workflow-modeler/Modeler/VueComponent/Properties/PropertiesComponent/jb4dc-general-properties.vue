<template>

        <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
                <col style="width: 18%" />
                <col style="width: 32%" />
                <col style="width: 18%" />
                <col style="width: 32%" />
            </colgroup>
            <tbody>
            <tr>
                <td>ID：</td>
                <td>
                    <input type="text" v-model="baseInfo.id" />
                </td>
                <td>IsExecutable：</td>
                <td style="text-align: left">
                    <radio-group type="button" style="margin: auto" v-model="baseInfo.serialize">
                        <radio label="true">是</radio>
                        <radio label="false">否</radio>
                    </radio-group>
                </td>
            </tr>
            <tr>
                <td>Name：</td>
                <td>
                    <input type="text" v-model="baseInfo.name" />
                </td>
                <td>Version Tag：</td>
                <td>
                    <input type="text" v-model="baseInfo.className" />
                </td>
            </tr>
            <tr>
                <td>Task Priority：</td>
                <td>

                </td>
                <td>Job Priority：</td>
                <td>

                </td>
            </tr>
            <tr>
                <td>Candidate Starter Groups：</td>
                <td>

                </td>
                <td>Candidate Starter Users：</td>
                <td>

                </td>
            </tr>
            <tr>
                <td>History Time To Live：</td>
                <td>

                </td>
                <td></td>
                <td>

                </td>
            </tr>
            <tr>
                <td>Element Documentation：</td>
                <td colspan="3">
                    <textarea rows="12" v-model="baseInfo.style"></textarea>
                </td>
            </tr>
            </tbody>
        </table>

</template>

<script>

    import {RemoteUtility} from '../../../Remote/RemoteUtility';

    export default {
        name: "jb4dc-general-properties",
        data(){
            return {
                baseInfo:{

                }
            }
        },
        mounted() {
            /*RemoteUtility.GetModuleById("").then(function (result) {
                console.log(result);
            })*/
            RemoteUtility.GetFormResourcePOList().then(function (formResourcePOList) {
                console.log(formResourcePOList);
            });
        }
    }
</script>

<style scoped>

</style>