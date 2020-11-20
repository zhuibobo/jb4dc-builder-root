var DataValidateUtility={
    testBuildCodeError:function ($elem){
        var code=$elem.val();
        if(code.length!=18){
            return {
                $elem:$elem,
                errors:["建筑物编码长度必须为18位!"],
                labName:"编码错误"
            };
        }
        return null;
    }
}