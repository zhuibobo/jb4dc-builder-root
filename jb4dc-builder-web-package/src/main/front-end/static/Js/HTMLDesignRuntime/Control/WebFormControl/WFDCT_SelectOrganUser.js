var WFDCT_SelectOrganUser={
    acInterface:{
        //Organ
        getOrganTreeData:"/Rest/Builder/RunTime/OrganRuntime/GetFullEnableOrgan",
        //OrganUserList
        reloadListData:"/Rest/Builder/RunTime/UserRuntime/GetUserByOrganId"
    },
    treeConfig:{
        treeIdFieldName:"organId",
        treeObj:null,
        treeSelectedNode:null,
        treeSetting:{
            async : {
                enable : true,
                // Ajax 获取数据的 URL 地址
                url :""
            },
            // 必须使用data
            data:{
                key:{
                    name:"organName"
                },
                simpleData : {
                    enable : true,
                    idKey : "organId", // id编号命名
                    pIdKey : "organParentId"  // 父id编号命名
                }
            },
            // 回调函数
            callback : {
                onClick : function(event, treeId, treeNode) {
                    var _self=this.getZTreeObj(treeId)._host;
                    _self.SelectedOrganNode(event,treeId,treeNode);
                },
                //成功的回调函数
                onAsyncSuccess : function(event, treeId, treeNode, msg){
                    //appList.treeObj.expandAll(true);
                }
            }
        },
    },
    userConfig:{
        userWarpElemObj:null
    },
    selectedUser:{
      data:[]
    },
    _prop:{
        buttonId:null,
        buttonText:null,
        multipleSplit:null,
        resultNameBindToControlField:null,
        resultValueBindToControlField:null,
        resultNameBindToControlId:null,
        resultValueBindToControlId:null,
        selectCondition:null,
        windowCaption:null,
        selectNumber:null,
        settingType:null,
        defaultSelectedOrganId:null,
        containerId:null
    },
    RendererChain:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;

        var $button=$singleControlElem;
        var buttonText = $button.attr("buttontext");
        $button.text(buttonText);
        $button.css({"padding":"2px 6px"});
        $button.bind("click",
            {
                "buttonElem":$button,
                "selfInstance":this
            }, this.ClickEvent);
    },
    RendererDataChain:function () {

    },
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus,
    BuildContentHTML:function (buttonId,selectedOrganId) {
        var containerId = "dialogContainer_" + buttonId;
        var userContainerId=containerId+"_userWarp";
        var treeULId="treeULId_"+buttonId;
        //debugger;
        if ($("#" + containerId).length == 0) {
            var htmlTemplate=
                `<div id='${containerId}' class="select_organ_user_warp">
                    <div class="left_tree_warp"><ul ref="zTreeUL" class="ztree" id="${treeULId}"></ul></div>
                    <div class="right_selected_warp" id="${userContainerId}"></div>
                    <div class="buttons_outer_warp"><div class="buttons_inner_warp"><button class="button button-primary" name="btnEnsure">确认</button><button class="button" name="btnClose">关闭</button></div></div>
                </div>`;
            var $containerDiv = $(htmlTemplate);

            $containerDiv.hide();
            $(document.body).append($containerDiv);

            var _this=this;
            $containerDiv.find("[name='btnEnsure']").click(function () {
                _this.EnsureClickEvent();
            });
            $containerDiv.find("[name='btnClose']").click(function () {
                _this.CloseClickEvent();
            });

            this.userConfig.userWarpElemObj=$containerDiv.find("#"+userContainerId);
            AjaxUtility.Post(this.acInterface.getOrganTreeData, {}, function (result) {
                if (result.success) {
                    console.log(result);
                    /*this.$refs.zTreeUL.setAttribute("id","select-department-user-dialog-"+StringUtility.Guid());*/
                    /*for(var i=0;i<100;i++){
                        result.data.push({});
                    }*/
                    this.treeConfig.treeObj=$.fn.zTree.init($("#"+treeULId), this.treeConfig.treeSetting,result.data);
                    this.treeConfig.treeObj.expandAll(true);
                    this.treeConfig.treeObj._host=this;
                    if(!StringUtility.IsNullOrEmpty(selectedOrganId)) {
                        var node = this.treeConfig.treeObj.getNodeByParam("organId", selectedOrganId, null);
                        this.treeConfig.treeObj.selectNode(node);
                        this.BuildUserTable(selectedOrganId);
                    }
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, this);
        }
        return containerId;
    },
    ClearUserTable:function(){
        this.userConfig.userWarpElemObj.html("");
    },
    BuildUserTable:function(organId){
        AjaxUtility.Post(this.acInterface.reloadListData, {organId:organId}, function (result) {
            if (result.success) {
                console.log(result);
                var _this=this;
                this.ClearUserTable();
                var $userTable=$(`<table class="userTable"><tr><th style="width: 40px">选择</th><th style="width: 80px">姓名</th><th style="width: 100px">手机号码</th><th>备注</th></tr></table>`);
                for(var i=0;i<result.data.length;i++) {
                    var userData=result.data[i];
                    var userId=userData.userId;
                    var userName=StringUtility.EncodeHtml(userData.userName);
                    var userPhoneNumber=StringUtility.EncodeHtml(userData.userPhoneNumber?userData.userPhoneNumber:"");
                    var userDesc=StringUtility.EncodeHtml(userData.userDesc?userData.userDesc:"");
                    var checkBoxId="cbx_user_"+userId;
                    var selectNumber=_this._prop.selectNumber;
                    var userIsSelected=_this.TestUserIsSelected(userData);
                    var $tr=$(`<tr><td style="text-align: center"><input type="checkbox" id="${checkBoxId}" /></td><td style="text-align: center">${userName}</td><td style="text-align: center">${userPhoneNumber}</td><td>${userDesc}</td></tr>`);
                    $tr.bind("click",
                        {
                            "selfInstance":this,
                            "userData":userData,
                            "userId":userId,
                            "userName":userName,
                            "checkBoxId":checkBoxId,
                            "selectNumber":selectNumber
                        }, this.UserClickEvent);

                    $tr.find("#" + checkBoxId).bind("click",
                        {
                            "selfInstance":this,
                            "userData":userData,
                            "userId":userId,
                            "userName":userName,
                            "checkBoxId":checkBoxId,
                            "selectNumber":selectNumber
                        }, this.UserClickEvent);

                    if(userIsSelected){
                        $tr.find("#" + checkBoxId).prop("checked", true);
                    }
                    /*$tr.find("#" + checkBoxId).click(function (e) {
                        if(selectNumber=="single"){
                            var id=$(this).attr("id");
                            _this.UnCheckAllUserExclude(id);
                        }
                        if($(this).prop("checked")){

                        }
                        else{

                        }
                        e.stopPropagation();
                    });*/

                    $userTable.find("tbody").append($tr);
                }
                this.userConfig.userWarpElemObj.append($userTable);
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
            }
        }, this);
    },
    SelectedOrganNode:function(event,treeId,treeNode){
        console.log(treeNode);
        this.BuildUserTable(treeNode.organId);
    },
    UnCheckAllUserExclude:function(checkBoxId){
        this.userConfig.userWarpElemObj.find("input[type='checkbox'][id!='"+checkBoxId+"']").prop("checked",false);
        //this.clearSelectedUser();
    },
    ClearSelectedUser:function(){
        this.selectedUser.data=[];
    },
    AddUserToSelectedData:function(selectNumber,userData){
        if(selectNumber=="single"){
            this.ClearSelectedUser();
            this.selectedUser.data.push(userData);
        }
        else if(selectNumber=="multiple"){
            this.selectedUser.data.push(userData);
        }
    },
    DeleteUserToSelectedData:function(selectNumber,userData) {
        for (var i = 0; i < this.selectedUser.data.length; i++) {
            if(this.selectedUser.data[i].userId==userData.userId) {
                ArrayUtility.Delete(this.selectedUser.data,i);
            }
        }
        //ArrayUtility.Delete()
    },
    TestUserIsSelected:function(userData){
        if (this.selectedUser.data.length>0){
            for (var i = 0; i < this.selectedUser.data.length; i++) {
                if(this.selectedUser.data[i].userId==userData.userId) {
                    return true;
                }
            }
        }
        return false
    },
    UserClickEvent:function(sender) {
        var _this=sender.data.selfInstance;
        var userData = sender.data.userData;
        var userId = sender.data.userId;
        var userName = sender.data.userName;
        var checkBoxId = sender.data.checkBoxId;
        var selectNumber = sender.data.selectNumber;
        if(selectNumber=="single"){
            _this.UnCheckAllUserExclude(checkBoxId);
        }
        if (!$("#" + checkBoxId).prop("checked")) {
            $("#" + checkBoxId).prop("checked", true);
            _this.AddUserToSelectedData(selectNumber,userData);
        } else {
            $("#" + checkBoxId).prop("checked", false);
            _this.DeleteUserToSelectedData(selectNumber, userData);
        }
        //console.log(sender);
        sender.stopPropagation();
        //alert(checkBoxId+$("#"+checkBoxId).prop("checked"));
    },
    ClickEvent:function (sender) {
        var $button = sender.data.buttonElem;
        var _self = sender.data.selfInstance;

        _self._prop.buttonId = $button.attr("id");
        HTMLControl.TryBindElementAttrToInstanceProp($button,_self._prop);
        /*_self.selectProp.buttonText = $button.attr("buttontext");
        _self.selectProp.multipleSplit = $button.attr("multiplesplit");
        _self.selectProp.resultNameBindToControlField = $button.attr("resultnamebindtocontrolfield");
        _self.selectProp.resultValueBindToControlField = $button.attr("resultvaluebindtocontrolfield");
        _self.selectProp.resultNameBindToControlId = $button.attr("resultnamebindtocontrolid");
        _self.selectProp.resultValueBindToControlId = $button.attr("resultvaluebindtocontrolid");
        _self.selectProp.selectCondition = $button.attr("selectcondition");
        _self.selectProp.windowCaption = $button.attr("selectdialogtitle");
        //multiple single
        _self.selectProp.selectNumber =$button.attr("selectnumber");
        _self.selectProp.settingType = $button.attr("settingtype");
        _self.selectProp.defaultSelectedOrganId = $button.attr("defaultselectedorganid");*/
        var windowWidth = 800;
        var windowHeight = 500;

        _self._prop.containerId = _self.BuildContentHTML(_self._prop.buttonId,_self._prop.defaultSelectedOrganId);

        DialogUtility.DialogElem(_self._prop.containerId, {
            width: windowWidth,
            height: windowHeight,
            title: _self._prop.windowCaption,
            modal: true
        }, 1, true);
    },
    BuildSelectedName:function(){
        var names=[];
        for (var i = 0; i < this.selectedUser.data.length; i++) {
            names.push(this.selectedUser.data[i].userName);
        }
        return names.join(this._prop.multipleSplit);
    },
    BuildSelectedValue:function(){
        var values=[];
        for (var i = 0; i < this.selectedUser.data.length; i++) {
            values.push(this.selectedUser.data[i].userId);
        }
        return values.join(this._prop.multipleSplit);
    },
    EnsureClickEvent:function () {
        var prop=this._prop;
        if(prop.settingType=="bingToControl"){
            if(prop.resultNameBindToControlId){
                $("#"+prop.resultNameBindToControlId).val(this.BuildSelectedName());
            }
            if(prop.resultValueBindToControlId){
                $("#"+prop.resultValueBindToControlId).val(this.BuildSelectedValue());
            }
            if(prop.resultNameBindToControlField){

            }
            if(prop.resultValueBindToControlField){

            }
        }
        this.CloseClickEvent();
    },
    CloseClickEvent:function () {
        DialogUtility.CloseByElemId(this._prop.containerId)
    }
}