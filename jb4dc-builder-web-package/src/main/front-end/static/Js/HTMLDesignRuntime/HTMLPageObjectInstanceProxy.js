var HTMLPageObjectInstanceProxy={
    webFormRTParas:null,
    htmlPO:null,
    formRecordComplexPO:null,
    FormPageObjectInstance:null,
    BuilderListPageRuntimeInstance:null,
    Init:function (webFormRTParas,htmlPO){
        this.webFormRTParas=webFormRTParas;
        this.htmlPO=htmlPO;
        if(this.htmlPO.formRecordComplexPO) {
            this.formRecordComplexPO = this.htmlPO.formRecordComplexPO;
        }
    },
    CallPageReady:function () {
        //console.log(formPO);
        if (typeof(FormPageObjectInstance) !="undefined") {
            this.FormPageObjectInstance = FormPageObjectInstance;
        }
        if(this.FormPageObjectInstance){
            this.FormPageObjectInstance.data.webFormRTParas=this.webFormRTParas;
            this.FormPageObjectInstance.data.formPO=this.htmlPO;
            this.FormPageObjectInstance.data.formRecordComplexPO=this.formRecordComplexPO;
            if(this.FormPageObjectInstance.pageReady){
                this.FormPageObjectInstance.pageReady();
            }
            if(this.FormPageObjectInstance.bindRecordDataReady){
                this.FormPageObjectInstance.bindRecordDataReady();
            }
        }
        if (typeof (BuilderListPageRuntimeInstance)!="undefined") {
            this.BuilderListPageRuntimeInstance = BuilderListPageRuntimeInstance;
        }
        if(this.BuilderListPageRuntimeInstance){
            if(!this.BuilderListPageRuntimeInstance.data){
                this.BuilderListPageRuntimeInstance.data={};
            }
            this.BuilderListPageRuntimeInstance.data.listPO=this.htmlPO;
            if(this.BuilderListPageRuntimeInstance.pageReady){
                this.BuilderListPageRuntimeInstance.pageReady();
            }
            if(this.BuilderListPageRuntimeInstance.rendererChainCompleted){
                this.BuilderListPageRuntimeInstance.rendererChainCompleted();
            }
            if(this.BuilderListPageRuntimeInstance.rendererDataChainCompleted){
                this.BuilderListPageRuntimeInstance.rendererDataChainCompleted();
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