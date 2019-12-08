import axios from 'axios';
import qs from'qs';

class RemoteUtility{
    static GetModuleById(moduleId){
        const promise = new Promise((resolve, reject)=>{
            var url=this.BuildUrl("/Rest/Workflow/Modeler/Properties/GetModuleContext");
            axios.post(url, qs.stringify({
                "recordId":"DevMockModuleId",
                "op":"view"
            })).then(function (result) {
                console.log(JsonUtility.JsonToString(result.data));
                resolve(result.data);
            });
        });
        return promise;
    }
    static BuildUrl(url) {
        url = this.GetRootPath() + url;
        if (url.indexOf("timestamp") > "0") {
            return url;
        }
        var getTimestamp = new Date().getTime();
        if (url.indexOf("?") > -1) {
            url = url + "&timestamp=" + getTimestamp
        } else {
            url = url + "?timestamp=" + getTimestamp
        }
        return url;
    }
    static GetRootPath(){
        var fullHref = window.document.location.href;
        var pathName = window.document.location.pathname;
        var lac = fullHref.indexOf(pathName);
        var localhostPath = fullHref.substring(0, lac);
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPath + projectName);
    }
}

class RemoteUtilityMock extends RemoteUtility {
    static GetModuleById(moduleId){
        const promise = new Promise((resolve, reject)=>{
            var mockData={"success":true,"message":"","traceMsg":"","errorCode":null,"data":{"moduleId":"DevMockModuleId","moduleValue":"DevMockModuleId","moduleText":"开发样例分组1","moduleOrderNum":2,"moduleCreateTime":"2019-09-11 20:59:00","moduleDesc":null,"moduleStatus":"启用","moduleParentId":"0","moduleIsSystem":"否","moduleDelEnable":"启用","modulePidList":"-1*0*DevMockModuleId","moduleChildCount":0,"moduleOrganId":"GoingMerry","moduleOrganName":"黄金梅丽号"},"exKVData":{"recordId":"DevMockModuleId","op":"view","dictionaryJson":{}}};
            resolve(mockData);
        });
        return promise;
    }
}

export { RemoteUtility as RemoteUtility };