function GetUrlParaValue(name) {
    return decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}
function AutoBindInitDD(allDD){
    $("[bindDDGroupId]").each(function (){
        var control=$(this);
        var bindDDGroupId=control.attr("bindDDGroupId");
        var defaultSelectValue=control.attr("defaultSelectValue");
        var empty=control.attr("empty");
        var ddArray=ArrayUtility.Where(allDD,function (item){
            return item.dictGroupId==bindDDGroupId;
        })
        console.log(bindDDGroupId);
        if(control.prop("tagName")=="SELECT"){
            if(empty=="true"){
                control.append("<option value=' '>--请选择--</option>")
            }
            if(ddArray.length>0){
                for (var i = 0; i < ddArray.length; i++) {
                    var ddItem=ddArray[i];
                    control.append("<option value='"+ddItem.dictValue+"'>"+ddItem.dictText+"</option>");
                }
                if(defaultSelectValue){
                    control.val(defaultSelectValue);
                }
            }
        }
    })
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

module.exports = {
    GetUrlParaValue,
    AutoBindInitDD,
    ArrayUtility
}