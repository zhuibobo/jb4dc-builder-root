var WFDCT_FileImageList={
    _objectType:"Instance",//Static;
    _propMap:{},
    _prop: {
        $singleControlElem:null,
        instanceName:null,
        elemId:null,
        opButtons: null,
        beforeSelectJSMethod: null,
        afterUploadedJsMethod: null,
        fileExType: null,
        authType: null,
        rendererContainerJsMethod: null,
        rendererSingleRowJsMethod: null,
        categoryType: null,
        getBindRecordIdJsMethod: null,
        getBindRecordTypeJsMethod: null,
        useTemplate: null,
        uploadEnable:false,
        downloadEnable:false,
        deleteEnable:false,
        previewEnable:false,
        moveOrderEnable:false,
        clickFileNameAction:null,
        objType:""
    },
    acInterface:{
        getFileListData:"/Rest/Builder/RunTime/FileRuntime/GetImageFileListData",
        downLoadFileByFileId:"/Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId"
    },
    RendererChain:function (_rendererChainParas) {
        //1
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        this.BindElementAttrToInstanceProp($singleControlElem);
        $singleControlElem.html("");

        //this.BuildUploadContainer();
        this.BuildFileList();
    },
    RendererDataChain:function () {

    },
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    /*ToViewStatus:function($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas){
        $("#"+this._prop.uploadWarpId).hide();
        //debugger;
        $("#"+this._prop.elemId).find(".delete-button-elem").hide();
        $("#"+this._prop.elemId).find(".move-up-button-elem").hide();
        $("#"+this._prop.elemId).find(".move-down-button-elem").hide();
    },*/

    BindElementAttrToInstanceProp:function($singleControlElem){
        //HTMLControl.TryBindElementAttrToInstanceProp($singleControlElem,this._prop);
        //console.log(this._prop);
        if(!this._prop.getBindRecordIdJsMethod){
            this._prop.getBindRecordIdJsMethod=this._prop.instanceName+".GetThisRecordId()";
        }
        if(!this._prop.getBindRecordTypeJsMethod){
            this._prop.getBindRecordTypeJsMethod=this._prop.instanceName+".GetThisRecordType()";
        }
        /*if(this._prop.opButtons.indexOf("upload")>=0){
            this._prop.uploadEnable=true;
        }
        if(this._prop.opButtons.indexOf("download")>=0){
            this._prop.downloadEnable=true;
        }
        if(this._prop.opButtons.indexOf("delete")>=0){
            this._prop.deleteEnable=true;
        }
        if(this._prop.opButtons.indexOf("online-preview")>=0){
            this._prop.previewEnable=true;
        }
        if(this._prop.opButtons.indexOf("move-order")>=0){
            this._prop.moveOrderEnable=true;
        }*/
        //console.log(this._prop);
    },
    GetThisRecordId:function(){
        var objId="";
        if(formRuntimeInst&&formRuntimeInst.GetWebFormRTParas()&&formRuntimeInst.GetWebFormRTParas().RecordId) {
            objId=formRuntimeInst.GetWebFormRTParas().RecordId;
        }
        else{
            DialogUtility.AlertText("查找不到绑定的记录ID");
        }
        //return "d5414077-0f3f-dc29-f760-073ac6e84d09";
        return objId;
    },
    GetThisRecordType:function(){
        return this._prop.objType;
    },
    /*GetUploadEndPointRequest:function () {
        var endPoint=BaseUtility.GetRootPath()+this.acInterface.uploadFile;
        //debugger;
        var paras={
            objType:eval(this._prop.getBindRecordTypeJsMethod),
            objId:eval(this._prop.getBindRecordIdJsMethod),
            categoryType:this._prop.categoryType
        }
        return {
            endpoint: endPoint,
            params:paras
        }
    },*/
    /*上传相关*/
    /*CreateDefaultTemplate(templateId){
        $(window.document.body).append(`<script type="text/template" id="`+templateId+`">
        <div class="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="拖放文件到这里进行上传。" style="min-height: 78px;">
            <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
                <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
            </div>
            <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
                <span class="qq-upload-drop-area-text-selector"></span>
            </div>
            <div class="qq-upload-button-selector qq-upload-button" style="float: right">
                <div>选择文件</div>
            </div>
            <span class="qq-drop-processing-selector qq-drop-processing">
                <span>Processing dropped files...</span>
                <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
            </span>
            <ul class="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals" style="display: none">
                <li>
                    <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
                    <div class="qq-progress-bar-container-selector qq-progress-bar-container">
                        <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>
                    </div>
                    <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
                    <div class="qq-thumbnail-wrapper">
                        <img class="qq-thumbnail-selector" qq-max-size="120" qq-server-scale>
                    </div>
                    <button type="button" class="qq-upload-cancel-selector qq-upload-cancel">X</button>
                    <button type="button" class="qq-upload-retry-selector qq-upload-retry">
                        <span class="qq-btn qq-retry-icon" aria-label="Retry"></span>
                        Retry
                    </button>

                    <div class="qq-file-info">
                        <div class="qq-file-name">
                            <span class="qq-upload-file-selector qq-upload-file"></span>
                            <span class="qq-edit-filename-icon-selector qq-btn qq-edit-filename-icon" aria-label="Edit filename"></span>
                        </div>
                        <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
                        <span class="qq-upload-size-selector qq-upload-size"></span>
                        <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">
                            <span class="qq-btn qq-delete-icon" aria-label="Delete"></span>
                        </button>
                        <button type="button" class="qq-btn qq-upload-pause-selector qq-upload-pause">
                            <span class="qq-btn qq-pause-icon" aria-label="Pause"></span>
                        </button>
                        <button type="button" class="qq-btn qq-upload-continue-selector qq-upload-continue">
                            <span class="qq-btn qq-continue-icon" aria-label="Continue"></span>
                        </button>
                    </div>
                </li>
            </ul>

            <dialog class="qq-alert-dialog-selector">
                <div class="qq-dialog-message-selector"></div>
                <div class="qq-dialog-buttons">
                    <button type="button" class="qq-cancel-button-selector">Close</button>
                </div>
            </dialog>

            <dialog class="qq-confirm-dialog-selector">
                <div class="qq-dialog-message-selector"></div>
                <div class="qq-dialog-buttons">
                    <button type="button" class="qq-cancel-button-selector">No</button>
                    <button type="button" class="qq-ok-button-selector">Yes</button>
                </div>
            </dialog>

            <dialog class="qq-prompt-dialog-selector">
                <div class="qq-dialog-message-selector"></div>
                <input type="text">
                <div class="qq-dialog-buttons">
                    <button type="button" class="qq-cancel-button-selector">Cancel</button>
                    <button type="button" class="qq-ok-button-selector">Ok</button>
                </div>
            </dialog>
        </div>
    </script>`)
    },
    BuildUploadContainer:function(){
        if(this._prop.uploadEnable) {
            var $singleControlElem = this._prop.$singleControlElem;
            var uploadWarpId='uploadWarp_'+this._prop.elemId;
            this._prop.uploadWarpId=uploadWarpId;
            var $uploadWarp = $("<div id='"+uploadWarpId+"'></div>");
            $singleControlElem.append($uploadWarp);
            var templateId = "qq-template_" + this._prop.elemId;
            if (this._prop.useTemplate == "defaultTemplate") {
                this.CreateDefaultTemplate(templateId);
            }

            var _this = this;
            var galleryUploader = new qq.FineUploader({
                element: $uploadWarp[0],
                template: templateId,
                multiple: false,
                request: this.GetUploadEndPointRequest(),
                callbacks: {
                    onComplete: function (id, name, responseJSON, xhr) {
                        if (responseJSON.success) {
                            _this.BuildFileList();
                        } else {
                            DialogUtility.AlertText(responseJSON.message);
                        }
                    }
                }
                /!*thumbnails: {
                    placeholders: {
                        waitingPath: '/source/placeholders/waiting-generic.png',
                        notAvailablePath: '/source/placeholders/not_available-generic.png'
                    }
                },*!/
                /!*validation: {
                    allowedExtensions: ['jpeg', 'jpg', 'gif', 'png']
                }*!/
            });
        }
    },*/
    /*列表相关设置*/
    BuildFileList:function () {
        var $singleControlElem = this._prop.$singleControlElem;
        var file_image_list_wrap_id="file_image_list_wrap"+this._prop.elemId;
        $("#"+file_image_list_wrap_id).remove();
        var $divWarp=$("<div class='file-image-list-wrap' id='"+file_image_list_wrap_id+"'></div>");
        var objId=eval(this._prop.getBindRecordIdJsMethod);
        var category=this._prop.categoryType;
        AjaxUtility.Post(this.acInterface.getFileListData,{
            objId:objId,
            categoryType:category
        },function (result) {
            if(result.success){
                for(var i=0;i<result.data.length;i++){
                    var fileInfo=result.data[i];
                    var imgElem=this.BuildFileDislay(result,fileInfo);
                    $divWarp.append(imgElem);
                }
            }
            console.log(result);
        },this);
        $($singleControlElem.append($divWarp));
    },
    BuildFileDislay:function (responseJSON,fileInfo) {
        var fileId=fileInfo.fileId;
        var imgElem="<div class='img-wrap'><img src='"+BaseUtility.BuildAction(this.acInterface.downLoadFileByFileId,{fileId:fileId})+"' /></div>";
        return imgElem;
    }
}