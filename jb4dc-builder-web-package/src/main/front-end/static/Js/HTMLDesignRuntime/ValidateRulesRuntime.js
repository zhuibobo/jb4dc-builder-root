let ValidateRulesRuntime={
    "NoEmpty":"NoEmpty",
    getValidateTipElem:function(){
        return  "<span name='validate-tip' style='color: red'>*</span> ";
    },
    getValidateRules:function ($elem) {
        //debugger;
        if($elem.attr("validaterules")){
            var validateRules= decodeURIComponent($elem.attr("validaterules"));
            return JsonUtility.StringToJson(validateRules);
        }
        return null;
    },
    ValidateSubmitEnable:function() {
        var controls = $("[tablename][serialize='true']").not($("[control_category='DynamicContainer']").find("[jbuild4dc_custom='true']"));
        var validateResult = {
            success: true,
            errors: []
        }
        for (let i = 0; i < controls.length; i++) {
            var $controlElem = $(controls[i]);
            var validateRules = ValidateRulesRuntime.getValidateRules($controlElem);
            //var hasError = false;
            if (validateRules && validateRules.rules.length > 0) {
                var singleControlErrors = {
                    labName:this.tryGetValidateErrorName($controlElem),
                    errors:[],
                    $elem:null
                }
                var fieldTransferPO = HTMLControl.TryGetFieldTransferPO($controlElem, "ValidateSubmitEnable", "ValidateSubmitEnable", "ValidateSubmitEnable");
                var controlValue = fieldTransferPO.value;
                for (let j = 0; j < validateRules.rules.length; j++) {
                    var singleRule = validateRules.rules[j];
                    if (singleRule.validateType == ValidateRulesRuntime.NoEmpty) {
                        if(StringUtility.Trim(controlValue)==""||StringUtility.IsNullOrEmpty(controlValue)){
                            //hasError=true;
                            singleControlErrors.errors.push("不能为空!");
                        }
                    }
                    if(singleControlErrors.errors.length>0){
                        singleControlErrors.$elem=$controlElem;
                        validateResult.success=false;
                        validateResult.errors.push(singleControlErrors);
                    }
                }
            }
        }
        return validateResult;
    },
    tryGetValidateErrorName:function($control) {
        var name = "";
        var $prevTd = $control.parent().prev();
        if ($prevTd && $prevTd.length > 0) {
            name = $prevTd.text().replace("*", "").replace("：", "");
        }
        return name;
    },
    AlertValidateErrors:function(validateResult){
        console.log(validateResult);
        if(!validateResult.success){
            let message="";
            for (let i = 0; i < validateResult.errors.length; i++) {
                let singleControlError=validateResult.errors[i];
                message +=singleControlError.labName+"   【"+singleControlError.errors.join(",")+"】<br />";
            }
            DialogUtility.Alert(window,DialogUtility.DialogId05,{
                autoResize:true,
                height: 'auto',
                width: 300,
                title: "系统提示"
            },message);

            for (let i = 0; i < validateResult.errors.length; i++) {
                let singleControlError=validateResult.errors[i];
                singleControlError.$elem.addClass("html-design-input-control-error-status");
            }
            window.setTimeout(function () {
                $(".html-design-input-control-error-status").removeClass("html-design-input-control-error-status");
            },4000)
        }
        return validateResult.success;
    }
}