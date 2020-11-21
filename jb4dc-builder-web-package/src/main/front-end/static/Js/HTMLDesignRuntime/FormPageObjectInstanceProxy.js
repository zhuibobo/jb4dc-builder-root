var FormPageObjectInstanceProxy={
    webFormRTParas:null,
    formPO:null,
    formRecordComplexPO:null,
    FormPageObjectInstance:null,
    Init:function (webFormRTParas,formPO){
        this.webFormRTParas=webFormRTParas;
        this.formPO=formPO;
        this.formRecordComplexPO=formPO.formRecordComplexPO;
    },
    CallPageReady:function () {
        //console.log(formPO);
        if (FormPageObjectInstance) {
            this.FormPageObjectInstance = FormPageObjectInstance;
        }
        if(this.FormPageObjectInstance){
            this.FormPageObjectInstance.data.webFormRTParas=this.webFormRTParas;
            this.FormPageObjectInstance.data.formPO=this.formPO;
            this.FormPageObjectInstance.data.formRecordComplexPO=this.formRecordComplexPO;
            if(this.FormPageObjectInstance.pageReady){
                this.FormPageObjectInstance.pageReady();
            }
            if(this.FormPageObjectInstance.bindRecordDataReady){
                this.FormPageObjectInstance.bindRecordDataReady();
            }
        }
    },
    CallValidateEveryFromControl:function (validateResult){
        //debugger;
        if(this.FormPageObjectInstance.validateEveryFromControl){
            try {
                var newResult=this.FormPageObjectInstance.validateEveryFromControl(validateResult);
                if(newResult){
                    validateResult=newResult;
                }
            }
            catch (e){
                DialogUtility.AlertText("自定义校验方法执行失败!");
            }
        }
        return validateResult
    }
}