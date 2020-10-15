var WFDCT_FileUploadContainer={
    acInterface:{
        getFileListData:"/Rest/Builder/RunTime/FileRuntime/GetFileListData",
        uploadFile:"/Rest/Builder/RunTime/FileRuntime/UploadFile",
        downloadFile:"/Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId",
        deleteFile:"/Rest/Builder/RunTime/FileRuntime/DeleteFileByFileId"
    },
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
        clickFileNameAction:null
    },
    RendererChain:function (_rendererChainParas) {
        //1
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        this.BindElementAttrToInstanceProp($singleControlElem);
        $singleControlElem.html("");

        this.BuildUploadContainer();
        this.BuildFileList();
    },
    RendererDataChain:function () {

    },
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus,

    BindElementAttrToInstanceProp:function($singleControlElem){
        HTMLControl.TryBindElementAttrToInstanceProp($singleControlElem,this._prop);
        if(!this._prop.getBindRecordIdJsMethod){
            this._prop.getBindRecordIdJsMethod=this._prop.instanceName+".GetThisRecordId()";
        }
        if(!this._prop.getBindRecordTypeJsMethod){
            this._prop.getBindRecordTypeJsMethod=this._prop.instanceName+".GetThisRecordType()";
        }
        if(this._prop.opButtons.indexOf("upload")>=0){
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
        }
        console.log(this._prop.previewEnable);
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
        return "构建表单记录";
    },
    GetUploadEndPointRequest:function () {
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
    },
    /*上传相关*/
    CreateDefaultTemplate(templateId){
        $(window.document.body).append(`<script type="text/template" id="`+templateId+`">
        <div class="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="Drop files here" style="min-height: 78px;">
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
            var $uploadWarp = $("<div id='uploadWarp'></div>");
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
                /*thumbnails: {
                    placeholders: {
                        waitingPath: '/source/placeholders/waiting-generic.png',
                        notAvailablePath: '/source/placeholders/not_available-generic.png'
                    }
                },*/
                /*validation: {
                    allowedExtensions: ['jpeg', 'jpg', 'gif', 'png']
                }*/
            });
        }
    },
    /*列表相关设置*/
    BuildFileList:function () {
        var $singleControlElem = this._prop.$singleControlElem;
        var upload_file_list_warp_id="upload_file_list_warp_"+this._prop.elemId;
        $("#"+upload_file_list_warp_id).remove();
        var $divWarp=$("<div class='upload_file_list_warp' id='"+upload_file_list_warp_id+"'><table class='file_list_table'><thead><tr><th style='width: 80px'>编号</th><th>文件名称</th><th style='width: 140px'>上传时间</th><th style='width: 140px'>上传人</th><th style='width: 140px'>文件大小</th><th style='width: 140px'>操作</th></tr></thead><tbody></tbody></table></div>");
        var $tbody=$divWarp.find("tbody");
        var objId=eval(this._prop.getBindRecordIdJsMethod);
        var category=this._prop.categoryType;
        AjaxUtility.Post(this.acInterface.getFileListData,{
            objId:objId,
            categoryType:category
        },function (result) {
            if(result.success){
                for(var i=0;i<result.data.length;i++){
                    var fileInfo=result.data[i];
                    $tbody.append(this.BuildFileInfoTableRow(result,fileInfo));
                }
            }
            console.log(result);
        },this);
        $($singleControlElem.append($divWarp));
    },
    BuildFileInfoTableRow:function (responseJSON,fileInfo) {
        var fileCode=fileInfo.fileCode;
        var fileName=StringUtility.EncodeHtml(fileInfo.fileName);
        var fileCreateTime=DateUtility.DataFormatByTimeStamp(fileInfo.fileCreateTime,"yyyy-MM-dd");
        var fileSize=HardDiskUtility.ByteConvert(fileInfo.fileSize);
        var fileCreatorName=StringUtility.EncodeHtml(fileInfo.fileCreatorName);
        var $trObj=$(`<tr><td style="text-align: center">${fileCode}</td><td>${fileName}</td><td style="text-align: center">${fileCreateTime}</td><td style="text-align: center">${fileCreatorName}</td><td style="text-align: center">${fileSize}</td><td style="text-align: center"></td></tr>`);
        this.BuildFileInfoTableRowInnerButtons(responseJSON,fileInfo,$trObj);
        return $trObj;
    },
    BuildFileInfoTableRowInnerButtons:function (responseJSON,fileInfo,$tr) {
        if(!this._prop.downloadEnable&&!this._prop.deleteEnable&&this._prop.previewEnable&&this._prop.moveOrderEnable){

        }
        var $trLastTd=$tr.find("td:last");
        var _this=this;
        if(this._prop.deleteEnable){
            var $deleteElem=$("<div class='file-list-inner-button delete-button-elem' title='点击删除'></div>");
            $deleteElem.click(function () {
                DialogUtility.Confirm(window,"确认删除附件【"+fileInfo.fileName+"】吗?",function () {
                    //var url=BaseUtility.GetRootPath()+;
                    AjaxUtility.Post(_this.acInterface.deleteFile,{fileId:fileInfo.fileId},function (result) {
                        if(result.success){
                            $deleteElem.parent().parent().remove();
                        }
                    },_this);
                });
            });
            $trLastTd.append($deleteElem);
        }
        if(this._prop.moveOrderEnable||true){
            var $moveUpElem=$("<div class='file-list-inner-button move-up-button-elem' title='点击下移'></div>");
            $moveUpElem.click(function () {
                DialogUtility.AlertText("暂不支持!");
            })
            var $moveDownElem=$("<div class='file-list-inner-button move-down-button-elem' title='点击上移'></div>");
            $moveDownElem.click(function () {
                DialogUtility.AlertText("暂不支持!");
            })
            $trLastTd.append($moveUpElem);
            $trLastTd.append($moveDownElem);
        }
        if(this._prop.downloadEnable){

            var $downloadElem=$("<div class='file-list-inner-button download-button-elem' title='点击下载'></div>");
            $downloadElem.click(function () {
                var url=BaseUtility.GetRootPath()+_this.acInterface.downloadFile+"?fileId="+fileInfo.fileId;
                window.open(url);
            });
            $trLastTd.append($downloadElem);
        }
        if(this._prop.previewEnable||true){
            var $previewElem=$("<div class='file-list-inner-button preview-button-elem' title='点击预览'></div>");
            $previewElem.click(function () {
                DialogUtility.AlertText("暂不支持!");
            })
            $trLastTd.append($previewElem);
        }

    },
    TestFilePreviewEnable:function (fileInfo) {
        return true;
    }
}