<template>
    <div>jb4dc-general-properties1.vue</div>
</template>

<script>

    import {RemoteUtility} from '../../Remote/RemoteUtility';

    export default {
        name: "jb4dc-general-properties",
        mounted() {
            RemoteUtility.GetModuleById("").then(function (result) {
                console.log(result);
            })
        }
    }
</script>

<style scoped>

</style>