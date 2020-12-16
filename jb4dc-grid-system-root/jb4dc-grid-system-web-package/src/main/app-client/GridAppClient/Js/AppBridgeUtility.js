import appClientUtility from "./AppClientUtility";

function searchCurrentPosition (vueObj,callBackFuncName) {
    if (typeof (appBridge) != "undefined") {
        appClientUtility.DialogUtility.ShowLoading();
        appBridge.searchCurrentPosition(callBackFuncName);
    } else {
        vueObj.$toasted.show('不存在appBridge对象!', {duration: 2000});
    }
}

export default {
    searchCurrentPosition
}