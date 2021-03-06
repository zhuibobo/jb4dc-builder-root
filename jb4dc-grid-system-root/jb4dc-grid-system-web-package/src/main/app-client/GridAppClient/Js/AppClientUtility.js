import axios from 'axios';

function GetUrlParaValue(name) {
    return decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

const AllDDMap={};

let GridInfo={};

function SetGridInfo(_gridInfo){
    GridInfo=_gridInfo;
}

function GetGridInfo(){
    return GridInfo;
}

function ConvertDDListToMap(allDD){
    for (let i = 0; i < allDD.length; i++) {
        var groupId=allDD[i].dictGroupId;
        //console.log(allDD[i]);
        if(groupId==allDD[i].dictParentId) {
            if (!AllDDMap[groupId]) {
                AllDDMap[groupId] = [];
            }
            AllDDMap[groupId].push(allDD[i]);
        }
        else{
            var key=groupId+"_"+allDD[i].dictParentId;
            if (!AllDDMap[key]) {
                AllDDMap[key] = [];
            }
            AllDDMap[key].push(allDD[i]);
        }
    }
}

function GetAllDDMap(){
    return AllDDMap;
}

function AutoBindInitDD(allDD){
    $("[bindDDGroupId]").each(function (){
        var control=$(this);
        var bindDDGroupId=control.attr("bindDDGroupId");
        //var defaultSelectValue=control.attr("defaultSelectValue");
        var empty=control.attr("empty");
        var ddArray=ArrayUtility.Where(allDD,function (item){
            //console.log(item);
            return item.dictGroupId==bindDDGroupId;
        })
        if(control.prop("tagName")=="SELECT"){
            if(empty=="true"){
                control.append("<option value=''>-请选择-</option>")
            }
            if(ddArray.length>0){
                for (var i = 0; i < ddArray.length; i++) {
                    var ddItem=ddArray[i];
                    control.append("<option value='"+ddItem.dictValue+"'>"+ddItem.dictText+"</option>");
                }
                //if(defaultSelectValue){
                //    control.val(defaultSelectValue);
                //}
            }
        }
    })
}

function HidTopLoadBar(){
    window.setTimeout(function (){
        topbar.hide();
    },500);
}

var DevStatus= {
    IsDevUser: function (session) {
        if(session.UserId=="604ff9bc-d9ab-4686-a6af-3e8f2574e4b6"){
            return true;
        }
        return false;
    },
    GetServerName:function (){
        //debugger;
        if(window.location.href.indexOf("192.168.3.206")>=0){
            return "206开发环境";
        }
        return "生产环境"
    }
}

var ArrayUtility = {
    Delete:function (ary, index) {
        ary.splice(index, 1);
    },
    SwapItems:function (ary,index1, index2) {
        //debugger;
        ary[index1] = ary.splice(index2, 1, ary[index1])[0];
        return ary;
    },
    MoveUp:function(arr, $index) {
        if($index == 0) {
            return;
        }
        this.SwapItems(arr, $index, $index - 1);
    },
    MoveDown:function(arr, $index) {
        if($index == arr.length -1) {
            return;
        }
        this.SwapItems(arr, $index, $index + 1);
    },
    Unique:function(arr){
        var n = []; //一个新的临时数组
        //遍历当前数组
        for(var i = 0; i < arr.length; i++){
            //如果当前数组的第i已经保存进了临时数组，那么跳过，
            //否则把当前项push到临时数组里面
            if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
        }
        return n;
    },
    Exist:function (arr,condition) {
        for(var i=0;i<arr.length;i++){
            if(condition(arr[i])){
                return true;
            }
        }
        return false;
    },
    PushWhenNotExist:function (arr,item,condition) {
        if(!this.Exist(arr,condition)){
            arr.push(item);
        }
        return arr;
    },
    Where:function (arr, condition) {
        var result=[];
        for (var i = 0; i < arr.length; i++) {
            if(condition(arr[i])){
                result.push(arr[i]);
            }
        }
        return result;
    },
    WhereSingle:function (arr,condition) {
        var temp = this.Where(arr, condition);
        if(temp.length==0){
            return null;
        }
        return temp[0];
    },
    Push:function (source, append) {
        //debugger;
        if(Array.isArray(append) ){
            for (let i = 0; i < append.length; i++) {
                source.push(append[i]);
            }
        }
        else
        {
            source.push(append);
        }
    },
    True:function (source,condition) {
        for (var i = 0; i < source.length; i++) {
            if(condition(source[i])){
                return true;
            }
        }
        return false;
    },
    IsArray:function (source) {
        if (!Array.isArray) {
            return Array.isArray(source);
        }
        else{
            return Object.prototype.toString.call(source) === '[object Array]';
        }
    },
    ReplaceItem:function (source, newItem, condition) {
        for(var i=0;i<source.length;i++){
            if(condition(source[i])){
                source.splice(i, 1,newItem);
            }
        }
    },
    ExistReplaceItem:function (source, newItem, condition) {
        if(!source){
            return false;
        }
        var result=false;
        for(var i=0;i<source.length;i++){
            if(condition(source[i])){
                source.splice(i, 1,newItem);
                result=true;
            }
        }
        return result;
    }
}

var JsonUtility = {
    ParseArrayJsonToTreeJson:function (config, sourceArray, rootId){
        var _config = {
            KeyField: "",
            RelationField: "",
            ChildFieldName: ""
        };

        function FindJsonById(keyField, id) {
            for (var i = 0; i < sourceArray.length; i++) {
                if (sourceArray[i][keyField] == id) {
                    return sourceArray[i];
                }
            }
            alert("ParseArrayJsonToTreeJson.FindJsonById:在sourceArray中找不到指定Id的记录");
        }

        function FindChildJson(relationField, pid) {
            var result = [];
            for (var i = 0; i < sourceArray.length; i++) {
                if (sourceArray[i][relationField] == pid) {
                    result.push(sourceArray[i]);
                }
            }
            return result;
        }

        function FindChildNodeAndParse(pid, result) {
            var childjsons = FindChildJson(config.RelationField, pid);
            if (childjsons.length > 0) {
                if (result[config.ChildFieldName] == undefined) {
                    result[config.ChildFieldName] = [];
                }
                for (var i = 0; i < childjsons.length; i++) {
                    var toObj = {};
                    toObj = JsonUtility.SimpleCloneAttr(toObj, childjsons[i]);
                    result[config.ChildFieldName].push(toObj);
                    var id = toObj[config.KeyField];
                    FindChildNodeAndParse(id, toObj);
                }
            }
        }

        var result = {};
        var rootJson = FindJsonById(config.KeyField, rootId);
        result = this.SimpleCloneAttr(result, rootJson);
        FindChildNodeAndParse(rootId, result);
        return result;
    },
    ResolveSimpleArrayJsonToTreeJson: function (config, sourceJson, rootNodeId) {
        alert("JsonUtility.ResolveSimpleArrayJsonToTreeJson 已停用");
    },
    SimpleCloneAttr: function (toObj, fromObj) {
        for (var attr in fromObj) {
            toObj[attr] = fromObj[attr];
        }
        return toObj;
    },
    CloneArraySimple:function(array){
        var result=[];
        for (var i = 0; i < array.length; i++) {
            result.push(this.CloneSimple(array[i]));
        }
        return result;
    },
    CloneSimple:function (source) {
        var newJson = jQuery.extend(true,{}, source);
        return newJson;
    },
    CloneStringify:function(source){
        var newJson=this.JsonToString(source);
        return this.StringToJson(newJson);
    },
    CloneObjectProp:function(source,propCallBack) {
        var result={};
        var cloneSource=this.CloneStringify(source);
        for(var key in cloneSource){
            var sourcePropValue=cloneSource[key];
            var newPropValue;
            if(typeof (propCallBack)=="function"){
                newPropValue = propCallBack(key,sourcePropValue);
                if(!newPropValue){
                    newPropValue=sourcePropValue;
                }
            }
            result[key]=newPropValue;
        }
        return result;
    },
    JsonToString:function (obj) {
        return JSON.stringify(obj);
    },
    JsonToStringFormat:function (obj) {
        return JSON.stringify(obj, null, 2);
    },
    StringToJson: function (str) {
        return eval("(" + str + ")");
    }
}

var StringUtility = {
    FormatGoToUrl:function (url,session) {
        if (url.indexOf("?") > 0) {
            url += "&UserId=" + session.UserId + "&UserName=" + encodeURIComponent(session.UserName) + "&OrganId=" + session.OrganId + "&OrganName=" + encodeURIComponent(session.OrganName) + "&AppClientToken=" + session.AppClientToken + "&ts=" + Date.now()
        } else {
            url += "?UserId=" + session.UserId + "&UserName=" + encodeURIComponent(session.UserName) + "&OrganId=" + session.OrganId + "&OrganName=" + encodeURIComponent(session.OrganName) + "&AppClientToken=" + session.AppClientToken + "&ts=" + Date.now()
        }
        return url;
    },
    NewH5AppRecordId:function (){
        return "H5APP-"+this.Guid();
    },
    GuidSplit: function (split) {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            guid += Math.floor(Math.random() * 16.0).toString(16);
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += split;
        }
        return guid;
    },
    Guid: function () {
        return this.GuidSplit("-");
    },
    Timestamp: function () {
        var timestamp = new Date().getTime();
        return timestamp.toString().substr(4, 10);
    },
    Trim: function (str) {
        return str.replace(/(^[　\s]*)|([　\s]*$)/g, "");
    },
    RemoveLastChar: function (str) {
        return str.substring(0, str.length - 1)
    },
    IsNullOrEmptyTrim:function (obj){
        if(obj){
            obj=this.Trim(obj.toString());
        }
        return this.IsNullOrEmpty(obj);
    },
    IsNullOrEmpty: function (obj) {
        return obj == undefined || obj === "" || obj == null || obj == "undefined" || obj == "null"
    },
    IsNotNullOrEmpty:function(obj){
        return !(this.IsNullOrEmpty(obj));
    },
    GetFunctionName: function (func) {
        if (typeof func == "function" || typeof func == "object")
            var fName = ("" + func).match(
                /function\s*([\w\$]*)\s*\(/
            );
        if (fName !== null) return fName[1];
    },
    ToLowerCase: function (str) {
        return str.toLowerCase();
    },
    toUpperCase: function (str) {
        return str.toUpperCase();
    },
    EndWith:function (str,endStr) {
        var d=str.length-endStr.length;
        //alert(str.lastIndexOf(endStr)==d);
        return (d>=0&&str.lastIndexOf(endStr)==d);
    },
    /*GetURLHost:function (url) {
        var origin = /\/\/[\w-.]+(:\d+)?/i.exec(url)[0];
        return origin;
    },*/
    IsSameDomain:function (url1, url2) {
        var origin1 = /\/\/[\w-.]+(:\d+)?/i.exec(url1)[0];

        var open=/\/\/[\w-.]+(:\d+)?/i.exec(url2);
        if(open==null){
            return true;
        }
        else {
            var origin2 = open[0];
            if (origin1 == origin2) {
                return true;
            }
            return false;
        }
    },
    FirstCharLetter:function (str) {
        var str1 = str.replace(str[0],str[0].toLowerCase());
        return str1;
    },
    FirstCharUpper:function (str) {
        var str1 =  str.replace(str[0],str[0].toUpperCase());
        return str1;
    },
    RemoveScript:function (str) {
        return str.replace(/<script.*?>.*?<\/script>/ig, '');
    },
    EncodeHtml:function (str) {
        var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
        //str = (str != undefined) ? str : this.toString();
        return (typeof str != "string") ? str :
            str.replace(REGX_HTML_ENCODE,
                function($0){
                    var c = $0.charCodeAt(0), r = ["&#"];
                    c = (c == 0x20) ? 0xA0 : c;
                    r.push(c); r.push(";");
                    return r.join("");
                });
    },
    DecodeHtml:function (str) {
        var REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;
        var HTML_DECODE = {
            "&lt;" : "<",
            "&gt;" : ">",
            "&amp;" : "&",
            "&nbsp;": " ",
            "&quot;": "\"",
            "©": ""
            // Add more
        };

        return (typeof str != "string") ? str :
            str.replace(REGX_HTML_DECODE,
                function($0, $1){
                    var c = HTML_DECODE[$0];
                    if(c == undefined){
                        // Maybe is Entity Number
                        if(!isNaN($1)){
                            c = String.fromCharCode(($1 == 160) ? 32:$1);
                        }else{
                            c = $0;
                        }
                    }
                    return c;
                });
    },
    GetFileExName:function (fileName) {
        var ext = fileName.substring(fileName.lastIndexOf("."), fileName.length);
        return ext;
    },
    ReplaceSPCharL1:function (source) {
        var reg=/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\、|\^|\$|\!|\~|\`|\|/g;
        var temp = source.replace(reg,"");
        return temp;
    },
    ReplaceSPCharL2:function (source) {
        var reg=/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|,|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;
        var temp = source.replace(reg,"");
        return temp;
    }
}

var DateUtility={
    ConvertFromString:function(dateString){
        var date = new Date(dateString);
        return date;
    },
    Format:function (myDate,formatString) {
        var o = {
            "M+" : myDate.getMonth()+1, //month
            "d+" : myDate.getDate(),    //day
            "h+" : myDate.getHours(),   //hour
            "m+" : myDate.getMinutes(), //minute
            "s+" : myDate.getSeconds(), //second
            "q+" : Math.floor((myDate.getMonth()+3)/3),  //quarter
            "S" : myDate.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(formatString)) formatString=formatString.replace(RegExp.$1,
            (myDate.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(formatString))
            formatString = formatString.replace(RegExp.$1,
                RegExp.$1.length==1 ? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));
        return formatString;
    },
    FormatCurrentData:function (formatString) {
        var myDate = new Date();
        return this.Format(myDate,formatString);
    },
    GetCurrentData:function () {
        return new Date();
    },
    GetCurrentTimeStamp:function(){
        return new Date().getTime();
    },
    DataFormatByTimeStamp:function (timeStamp,formatString) {
        var date = new Date(timeStamp);
        return this.Format(date,formatString);
    }
}

var FileUtility={
    CompressImage:function (session,sourceBase64,objId,objType,fileName,categoryType,endFunc){
        var img = new Image(),
            maxH = 1080;

        img.onload = function () {
            var cvs = document.createElement('canvas'),
                ctx = cvs.getContext('2d');
            if(img.height > maxH) {
                img.width *= maxH / img.height;
                img.height = maxH;
            }
            cvs.width = img.width;
            cvs.height = img.height;
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataUrl = cvs.toDataURL('image/jpeg', 0.8);
            console.log(dataUrl);
            var sendBase64=dataUrl.split("base64,")[1];
            const params = new URLSearchParams();
            params.append('base64Image', sendBase64);
            params.append('objType', objType);
            params.append('objId', objId);
            params.append('categoryType', categoryType);
            params.append('fileName', fileName);
            params.append('AppClientToken', session.AppClientToken);
            params.append('ts', Date.now());

            axios.post("/GridSystem/Rest/Builder/RunTime/FileRuntime/UploadBase64Image", params).then((result)=>{
                endFunc(result);
            }).catch((err)=>{

            }).then((endResult)=>{

            });
            console.log(dataUrl);
            // 上传略
        }

        img.src = sourceBase64;
    }
}

var DialogUtility={
    AlertText:function (vueObject,message,yesFunc){
        vueObject.$confirm({
            message: message,
            button: {
                yes: '确认'
            },
            callback: confirm => {
                if(typeof (yesFunc)=="function"){
                    yesFunc();
                }
            }
        });
    },
    Confirm:function (vueObject,message,yesFunc){
        vueObject.$confirm({
            message: message,
            button: {
                no: '取消',
                yes: '确认'
            },
            callback: confirm => {
                if(typeof (yesFunc)=="function"){
                    yesFunc(confirm);
                }
            }
        });
    },
    ShowLoading:function (){
        $("#loadDialogWrap").show();
    },
    HideLoading:function (){
        $("#loadDialogWrap").hide();
    }
}

export default {
    GetUrlParaValue,
    ConvertDDListToMap,
    AutoBindInitDD,
    GetAllDDMap,
    SetGridInfo,
    GetGridInfo,
    HidTopLoadBar,
    ArrayUtility,
    JsonUtility,
    StringUtility,
    DateUtility,
    FileUtility,
    DialogUtility,
    DevStatus
}