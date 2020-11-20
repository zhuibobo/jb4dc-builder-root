var Organ3DDL={
    _prop:{
        mySessionData:null,
        myGridData:null,
        myCommunityData:null,
        myStreetData:null,
        allOrganMinProp:null,
        operationName:"",
        ddlStreetControl:null,
        oldDDLStreetControlValue:"",
        ddlCommunityControl:null,
        oldDDLCommunityControlValue:"",
        ddlGridControl:null,
        oldDDLGridControlValue:"",
        changeEnable:true
    },
    GetOrganData:function (endFunc) {
        AjaxUtility.Get("/Rest/Grid/SSOProxy/OrganAndUser/GetALLOrganMinPropData", {}, function (result) {
            if (result.success) {

                this._prop.mySessionData = result.data.MySessionData;
                var myOrganId = result.data.MySessionData.organId;
                this._prop.allOrganMinProp = result.data.ALLOrganMinProp;
                var myOrganData = ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
                    return item.organId == myOrganId;
                });
                //debugger;
                if (myOrganData.organTypeValue == "GridUnit") {
                    this._prop.myGridData=myOrganData;
                    var parentOrganId=myOrganData.organParentId;
                    this._prop.myCommunityData=ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
                        return item.organId == parentOrganId;
                    });
                    parentOrganId=this._prop.myCommunityData.organParentId;
                    this._prop.myStreetData=ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
                        return item.organId == parentOrganId;
                    });
                } else if (myOrganData.organTypeValue == "Community") {
                    this._prop.myCommunityData=myOrganData;
                    var parentOrganId=this._prop.myCommunityData.organParentId;
                    this._prop.myStreetData=ArrayUtility.WhereSingle(this._prop.allOrganMinProp, function (item) {
                        return item.organId == parentOrganId;
                    });
                } else if (myOrganData.organTypeValue == "Street") {
                    this._prop.myStreetData=myOrganData;
                }
                endFunc.call(this, result.data);
            }
        }, this);
    },
    Init3DDL:function (ddlStreetControlId,ddlCommunityControlId,ddlGridControlId,operationName,changeEnable) {
        //console.log(operationName);
        this._prop.operationName = operationName;
        this._prop.ddlStreetControl=$("#" + ddlStreetControlId);
        this._prop.oldDDLStreetControlValue =this._prop.ddlStreetControl.attr("control_value");
        this._prop.ddlCommunityControl=$("#" + ddlCommunityControlId);
        this._prop.oldDDLCommunityControlValue = this._prop.ddlCommunityControl.attr("control_value");
        this._prop.ddlGridControl=$("#" + ddlGridControlId);
        this._prop.oldDDLGridControlValue = this._prop.ddlGridControl.attr("control_value");
        this._prop.changeEnable=changeEnable;
        this.GetOrganData(function (result) {
            this.Bind3DDL();
        });
        if(!this._prop.changeEnable){
            this._prop.ddlStreetControl.attr("disabled","disabled");
            this._prop.ddlCommunityControl.attr("disabled","disabled");
            this._prop.ddlGridControl.attr("disabled","disabled");
        }
    },
    Bind3DDL:function (){
        //debugger;
        //绑定街道
        var streetDataList=ArrayUtility.Where(this._prop.allOrganMinProp,function (item){
            return item.organTypeValue=="Street";
        })
        this.BindSingleDDL(this._prop.ddlStreetControl,streetDataList)
        //设置街道数据
        var selectedStreetValue =this.TryAutoSetStreet();
        //绑定村社区
        var communityDataList=ArrayUtility.Where(this._prop.allOrganMinProp,function (item){
            return item.organParentId==selectedStreetValue;
        })
        this.BindSingleDDL(this._prop.ddlCommunityControl,communityDataList)
        //设置村社区数据
        var selectedCommunityValue =this.TryAutoSetCommunity();
        //绑定网格
        var gridDataList=ArrayUtility.Where(this._prop.allOrganMinProp,function (item){
            return item.organParentId==selectedCommunityValue;
        })
        this.BindSingleDDL(this._prop.ddlGridControl,gridDataList)
        //设置网格数据
        this.TryAutoSetGrid();
    },
    TryAutoSetStreet:function () {
        var selectedValue = this._prop.oldDDLStreetControlValue;
        if (!selectedValue&&this._prop.myStreetData) {
            selectedValue = this._prop.myStreetData.organId;
        }
        if(selectedValue) {
            this._prop.ddlStreetControl.val(selectedValue);
            return selectedValue;
        }
        return this._prop.ddlStreetControl.val();
    },
    TryAutoSetCommunity:function () {
        var selectedValue = this._prop.oldDDLCommunityControlValue;
        if (!selectedValue && this._prop.myCommunityData) {
            selectedValue = this._prop.myCommunityData.organId;
        }
        if(selectedValue) {
            this._prop.ddlCommunityControl.val(selectedValue);
            return selectedValue;
        }
        return this._prop.ddlCommunityControl.val();
    },
    TryAutoSetGrid:function (){
        var selectedValue = this._prop.oldDDLGridControlValue;
        if (!selectedValue && this._prop.myGridData) {
            selectedValue = this._prop.myGridData.organId;
        }
        if(selectedValue) {
            this._prop.ddlGridControl.val(selectedValue);
            return selectedValue;
        }
        return this._prop.ddlGridControl.val();
    },
    BindSingleDDL:function (ddlControl,organDataList){
        for (var i = 0; i < organDataList.length; i++) {
            var organData = organDataList[i];
            var sel="<option value='"+organData.organId+"'>"+organData.organName+"</option>";
            ddlControl.append(sel);
        }
    }
}