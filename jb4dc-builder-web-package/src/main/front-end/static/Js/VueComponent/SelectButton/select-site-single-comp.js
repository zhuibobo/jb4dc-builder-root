/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2019/4/27
**To change this template use File | Settings | File Templates.
*/
Vue.component("select-site-single-comp", {
    data: function () {
        return {
            acInterface: {
                getDBLinkDataUrl:"/Rest/Builder/SiteInfo/GetFullSite",
                getSingleDBLinkDataUrl:"/Rest/Builder/DataStorage/DBLink/GetDetailData"
            },
            jsEditorInstance:null,
            siteTree: {
                treeObj: null,
                treeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: false,
                        nocheckInherit: false,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        key: {
                            name: "siteName"
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "siteId",
                            pIdKey: "siteOrderNum",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            var _self=this.getZTreeObj(treeId)._host;
                            //debugger;
                            _self.selectedSite(treeNode);
                            _self.handleClose();
                        }
                    }
                },
                treeData: null,
                clickNode:null
            },
            selectedSiteData:null
        }
    },
    mounted:function(){

    },
    methods:{
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectSiteModelDialogWrap);
        },
        beginSelectSite:function () {
            var elem=this.$refs.selectSiteModelDialogWrap;
            //debugger;
            this.getSiteDataInitTree();
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 470,
                height: 500,
                title: "选择站点"
            });
        },
        getSiteDataInitTree:function () {
            var _self = this;
            AjaxUtility.Post(this.acInterface.getDBLinkDataUrl, {}, function (result) {
                if (result.success) {
                    _self.siteTree.treeData = result.data;
                    for(var i=0;i<_self.siteTree.treeData.length;i++){
                        _self.siteTree.treeData[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/database_connect.png";
                    }
                    _self.$refs.siteZTreeUL.setAttribute("id","select-dbLink-single-comp-"+StringUtility.Guid());
                    _self.siteTree.treeObj = $.fn.zTree.init($(_self.$refs.siteZTreeUL), _self.siteTree.treeSetting, _self.siteTree.treeData);
                    _self.siteTree.treeObj.expandAll(true);
                    _self.siteTree.treeObj._host=_self;
                    fuzzySearchTreeObj(_self.siteTree.treeObj,_self.$refs.txt_site_search_text.$refs.input,null,true);
                    /*if(_self.oldselectedSiteId) {
                        for (var i = 0; i < result.data.length; i++) {
                            if(_self.oldselectedSiteId==result.data[i].dbLinkId){
                                _self.selectedSiteData=result.data[i];
                            }
                        }
                    }*/
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, this);
        },
        selectedSite:function (siteData) {
            this.selectedSiteData=siteData;
            this.$emit('on-selected-site', siteData)
        },
        getSelectedSiteName:function () {
            //debugger;
            if(this.selectedSiteData==null){
                return "请选择站点"
            }
            else {
                return this.selectedSiteData.siteName;
            }
        },
        setOldSelectedSite:function (dbLinkId) {
            //debugger;
            var _self=this;
            AjaxUtility.Post(this.acInterface.getSingleDBLinkDataUrl, {"recordId":dbLinkId}, function (result) {
                //debugger;
                if (result.success) {
                    _self.selectedSiteData=result.data;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, this);
        }
    },
    template: `<div>
                    <div class="select-view-dblink-wrap">
                        <div class="text">{{getSelectedSiteName()}}</div>
                        <div class="value"></div>
                        <div class="id"></div>
                        <div class="button" @click="beginSelectSite()"><Icon type="ios-funnel" />&nbsp;选择</div>
                    </div>
                    <div ref="selectSiteModelDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                        <div class="c1-select-model-source-wrap">
                            <i-input search class="input_border_bottom" ref="txt_site_search_text" placeholder="请输入站点名称">
                            </i-input>
                            <div class="inner-wrap div-custom-scroll">
                                <ul ref="siteZTreeUL" class="ztree"></ul>
                            </div>
                        </div>
                    </div>
                </div>`
});