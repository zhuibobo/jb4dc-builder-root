var FormPageObjectInstanceProxy={
    CallPageReady:function () {
        if (FormPageObjectInstance){
            if(FormPageObjectInstance.pageReady){
                FormPageObjectInstance.pageReady();
            }
        }
    }
}