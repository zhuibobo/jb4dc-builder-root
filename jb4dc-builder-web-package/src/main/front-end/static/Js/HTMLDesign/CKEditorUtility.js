class CKEditorUtility {
    static _$CKEditorSelectElem=null;
    static SetSelectedElem(elemHtml){
        this._$CKEditorSelectElem=$(elemHtml);
    }
    static GetSelectedElem(){
        if(this._$CKEditorSelectElem) {
            if (this._$CKEditorSelectElem.length > 0) {
                return this._$CKEditorSelectElem;
            }
        }
        return null;
    }
    static GetSelectedCKEditorElem(){
        if(this.GetSelectedElem()) {
            var id = this.GetSelectedElem().attr("id");
            var element = this.GetCKEditorInst().document.getById(id);
            return element;
        }
        return null;
    }

    //用于与拖拽内容进行比较,从中恢复原始信息
    static _LastSelectedTempHTML=null;
    static SetLastSelectedTempHTML(html){
        this._LastSelectedTempHTML=html;
    }
    static GetLastSelectedTempHTML(){
        return this._LastSelectedTempHTML;
    }
    static TryGetIdFromLastSelectedTempHTML(newHTML){
        if(!this._LastSelectedTempHTML){
            return "";
        }
        else{
            var name=$(newHTML).attr("name");
            var lastHtmlName=$(this.GetLastSelectedTempHTML()).attr("name");
            if(name==lastHtmlName){
                return $(this.GetLastSelectedTempHTML()).attr("id");
            }
        }
        return "";
    }

    static _CKEditorInst=null;
    static GetCKEditorInst() {
        return this._CKEditorInst;
    }
    static SetCKEditorInst(inst){
        this._CKEditorInst=inst;
    }

    static GetCKEditorHTML(){
        this.ClearALLForDivElemButton();
        this.ClearALLPluginInnerPanel();
        return this.GetCKEditorInst().getData();
    }
    static SetCKEditorHTML(html){
        //处理class;
        this.GetCKEditorInst().setData(html);
        window.setTimeout(function () {
            CKEditorUtility.ALLElemBindDefaultEvent();
        },500);
    }

    static GetCKEditorHTMLInPluginPage(){
        return window.parent.CKEditorUtility.GetCKEditorHTML();
    }

    static InitializeCKEditor(textAreaElemId,pluginsConfig,loadCompletedFunc,ckeditorConfigFullPath,pluginBasePath,themeVo) {

        //console.log(pluginsConfig);

        var extraPlugins=new Array();
        for(var i=0;i<pluginsConfig.length;i++) {
            var singlePluginConfig = pluginsConfig[i];
            var singleName = singlePluginConfig.singleName;
            var toolbarLocation=singlePluginConfig.toolbarLocation;
            var text=singlePluginConfig.text;
            var serverResolve=singlePluginConfig.serverResolve;
            var clientResolve=singlePluginConfig.clientResolve;
            var clientResolveJs=singlePluginConfig.clientResolveJs;
            var dialogWidth=singlePluginConfig.dialogWidth;
            var dialogHeight=singlePluginConfig.dialogHeight;
            var isJBuild4DCData=singlePluginConfig.isJBuild4DCData;
            var controlCategory=singlePluginConfig.controlCategory;
            var serverDynamicBind=singlePluginConfig.serverDynamicBind;
            var showRemoveButton=singlePluginConfig.showRemoveButton;
            var showInEditorToolbar=singlePluginConfig.showInEditorToolbar;
            var enableChildControls=singlePluginConfig.enableChildControls;
            //console.log(enableChildControls);
            ////debugger;
            var pluginFileName = singleName + "Plugin.js";
            var pluginFolderName = pluginBasePath + singleName + "/";
            //注册扩展组件
            CKEDITOR.plugins.addExternal(singleName, pluginFolderName, pluginFileName);
            extraPlugins.push(singleName);

            //设置默认值
            CKEditorPluginUtility.AddPluginsServerConfig(singleName,toolbarLocation,text,clientResolve,serverResolve,clientResolveJs,dialogWidth,dialogHeight,isJBuild4DCData,controlCategory,serverDynamicBind,showRemoveButton,showInEditorToolbar,enableChildControls);
            /*CKEditorPluginUtility.PluginsServerConfig[singleName]={
                SingleName:singleName,
                ToolbarLocation:toolbarLocation,
                ToolbarLabel:text,
                ClientResolve:clientResolve,
                ServerResolve:serverResolve,
                ClientResolveJs:clientResolveJs,
                DialogWidth:dialogWidth,
                DialogHeight:dialogHeight,
                IsJBuild4DCData:isJBuild4DCData
            }*/
        }

        //console.log(themeVo);
        this.SetThemeVo(themeVo);

        //加载默认配置文件
        var editorConfigUrl = BaseUtility.AppendTimeStampUrl(ckeditorConfigFullPath);

        //把扩展组件加入工具条
        CKEDITOR.replace(textAreaElemId, {
            customConfig: editorConfigUrl,
            extraPlugins: extraPlugins.join(",")
        });

        CKEDITOR.instances.html_design.on("beforePaste", function (event) {
            //CKEditorUtility.ALLElemBindDefaultEvent();
            //console.log(event);
            //console.log("....");
        });

        //注册在编辑器中粘贴的处理事件
        CKEDITOR.instances.html_design.on("paste", function (event) {
            //alert(1);
            var sourceHTML = event.data.dataValue;
            console.log(sourceHTML);
            try {
                /*alert("暂时不支持!");
                var copyData = event.data.dataValue;

                var $copyData = $(copyData);
                $copyData.attr("id", "ct_copy_"+StringUtility.Timestamp());
                $copyData.find("input").each(function () {
                    $(this).attr("id", "ct_copy_"+StringUtility.Timestamp());
                });
                var newHtml = $copyData.outerHTML();
                if (typeof(newHtml) == "string") { //修复bug，在拷贝的是文本时，newhtml会被转换为jquery对象
                    event.data.dataValue = newHtml;
                }*/
                //alert(event.data.dataValue);
                //CKEditorUtility.ClearALLForDivElemButton();
                //debugger;
                var $sourceHTML = $(sourceHTML);
                $sourceHTML.find(".pluginInnerPanelWrap").remove();
                //$sourceHTML
                //alert($sourceHTML.find(".del-button").outerHTML());
                //如果其中包含一个用于显示控件呈现的div,取其进行替换
                //如果是拖动的元素,不使用方法自带的内容,使用selectionChange中设定的内容进行设置.
                if($sourceHTML.find("div").length==1){
                    var $innerElem=$($sourceHTML.find("div").eq(0));
                    //判断是否存在ID
                    var id=CKEditorUtility.TryGetIdFromLastSelectedTempHTML($innerElem);
                    console.log(id);
                    if(id){
                        var oldElem=CKEditorUtility.GetCKEditorInst().document.getById(id);
                        if(oldElem){
                            id="ct_copy_"+StringUtility.Timestamp();
                        }
                    }
                    else{
                        id="ct_copy_"+StringUtility.Timestamp();
                    }
                    //var oldElemId=$innerElem.attr("id");
                    //console.log(oldElemId);
                    //var oldElem=CKEditorUtility.GetCKEditorInst().document.getById(oldElemId);
                    //console.log(oldElem);
                    event.data.dataValue = $innerElem.attr("id", id).outerHTML();
                }
            }
            catch (e) {
                //还原html
                console.log("黏贴异常,还原HTML");
                event.data.dataValue = sourceHTML;
            }
        });

        CKEDITOR.instances.html_design.on("afterPaste", function (event) {
            //try {
                //CKEditorUtility.ALLElemBindDefaultEvent();
            /*}
            catch (e) {
                alert("粘贴操作失败!")
            }*/
        });

        CKEDITOR.instances.html_design.on('insertElement', function (event) {
            //console.log("insertElement");
            //console.log(event);
        });

        CKEDITOR.instances.html_design.on('insertHtml', function (event) {
            //console.log("insertHtml");
            //console.log(event);
        });

        CKEDITOR.instances.html_design.on('selectionChange', function (event) {
            //console.log("selectionChange2");
            //console.log(event);
            var elem = event.data.selection.getSelectedElement() ;
            //console.log(elem);
            //alert(selection.getType() );
            var lastCustSingleName="";
            for (var i = 0; i < event.data.path.elements.length; i++) {
                var elem=event.data.path.elements[i];
                var singleName=elem.getAttribute("singlename");
                //console.log(singleName);
                if (singleName){
                    lastCustSingleName=singleName;
                    //将元素设置为选中元素,该处主要用于切换到html的自动选中的辅助功能
                    CKEditorUtility.SetSelectedElem(elem.getOuterHtml());
                    CKEditorUtility.SetLastSelectedTempHTML(elem.getOuterHtml());
                    var innerHtml = elem.getHtml();
                    //debugger;
                    innerHtml=innerHtml.replace(/<br \/>/g,"").replace(/<br>/g,"");
                    if (innerHtml.indexOf("<") < 0) {
                        console.log(elem);
                        CKEditorUtility.GetCKEditorInst().getSelection().selectElement(elem);
                    }

                    //显示元素专有的toolPanel;
                    if (lastCustSingleName != "WFDCT_Template") {
                        CKEditorUtility.CreatePluginInnerPanel(elem);
                    }

                    break;
                }
            }
            if(lastCustSingleName) {
                //console.log(lastCustSingleName);
                //$(".cke_button").hide();
                //console.log(CKEditorPluginUtility.Plugins);

                CKEditorUtility.DisplayPluginControls(CKEditorPluginUtility.GetEnableChildControls(lastCustSingleName));
            }
            //$(".cke_button__wldct_listtablecontainer").hide();
            //$(".cke_button__wldct_listsimplesearchcontainer").hide();
        });

        //this._CKEditorInst = CKEDITOR.instances.html_design;
        this.SetCKEditorInst(CKEDITOR.instances.html_design);

        CKEDITOR.on('instanceReady', function (e) {
            if(typeof(loadCompletedFunc)=="function"){
                loadCompletedFunc();

                //console.log(CKEDITOR.instances.html_design.document);
                //debugger;
                //console.log(CKEDITOR.instances.html_design.document.$.head);

                /*var link=document.createElement('link');
                link.href='../../../static/Themes/Default/Css/FormDesignWysiwyg.css';
                link.rel='rel';

                CKEDITOR.instances.html_design.document.$.head.appendChild(link);
                var link1=document.createElement('link');
                link1.href='../../../static/Themes/Default/Css/Jbuild4dPlatform.css';
                link1.rel='rel';

                CKEDITOR.instances.html_design.document.$.head.appendChild(link1)*/;

                //alert("1");
                //CKEDITOR.instances.html_design.config.contentsCss = ['../../../Themes/Default/Css/FormDesignWysiwyg1.css','../../../Themes/Default/Css/Jbuild4dPlatform2.css'];
                /*JBuild4DC.FormDesign.SetCKEditorHTML("<div class=\"table-width-wraper-1024\" clientresolve=\"2\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" serialize=\"false\" serverresolve=\"1\" singlename=\"FDCT_Template\">" +
                    "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"wathet-blue-table\">" +
                    "<colgroup>" +
                    "<col style=\"width: 10%;\" />" +
                    "<col style=\"width: 23%;\" />" +
                    "<col style=\"width: 10%;\" />" +
                    "<col style=\"width: 23%;\" />" +
                    "<col style=\"width: 10%;\" />" +
                    "<col style=\"width: 24%;\" />" +
                    "</colgroup>" +
                    "<tbody>" +
                    "<tr>" +
                    "<td colspan=\"6\" height=\"60\">" +
                    "<h3 class=\"title\">请输入表单名称</h3>" +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>" +
                    "</div>");*/
            }
        });

    }

    static DisplayPluginControls(enableChildControls){
        //debugger;
        $(".cke_button").show();
        if(enableChildControls=="*"){
            return
        }
        //隐藏所有的自定义插件
        //console.log(enableChildControls);
        var plugins=CKEditorPluginUtility.GetPlugins();
        for (var key in plugins) {
            var plugin=plugins[key];
            var singleName=plugin.Setting.SingleName;
            /*if (StringUtility.ToLowerCase(enableChildControls).indexOf(StringUtility.ToLowerCase(singleName))>=0){
                $(".cke_button__"+StringUtility.ToLowerCase(singleName)).show();
            }
            else{*/
                $(".cke_button__"+StringUtility.ToLowerCase(singleName)).hide();
            //}
        }

        var enablePlugins=enableChildControls.split(";");
        for (var i = 0; i < enablePlugins.length; i++) {
            var singleName = enablePlugins[i];
            $(".cke_button__" + StringUtility.ToLowerCase(singleName)).show();
        }
    }

    static _ThemeVo=null;
    static GetThemeVo() {
        return this._ThemeVo;
    }
    static SetThemeVo(_themeVo){
        this._ThemeVo=_themeVo;
        this.ResetRootElemTheme(_themeVo);
    }

    static ResetRootElemTheme(_themeVo){

        //为编辑器中的is-container-root元素设置样式
        if(this.GetCKEditorInst()) {
            //debugger;
            //this.GetCKEditorInst().document.getBody().addClass('html-design-theme-default-root-elem-class');
            //this.GetCKEditorInst().editable().attachClass('html-design-theme-default-root-elem-class');

            var sourceHTML = this.GetCKEditorHTML();
            //debugger;
            if(sourceHTML!=null&&sourceHTML!="") {
                var rootElem = $(sourceHTML);
                //if(rootElem.attr("is_container_root")!="true") {
                //    rootElem=$(sourceHTML).find("[is_container_root]");
                //}
                if (rootElem.length>0) {
                    var classList = rootElem.attr('class').split(/\s+/);
                    var classary=[];
                    $.each(classList, function (index, item) {
                        if (item.indexOf('html-design-theme-')>=0) {
                            rootElem.removeClass(item);
                        }
                    });

                    rootElem.addClass(_themeVo.rootElemClass);
                    this.SetCKEditorHTML(rootElem.outerHTML());
                }
            }
        }
    }

    static ClearALLForDivElemButton(){
        var oldDelButtons=CKEditorUtility.GetCKEditorInst().document.find(".del-button");
        for(var i=0;i<oldDelButtons.count();i++){
            oldDelButtons.getItem(i).remove();
        }
    }
    static CreatePluginInnerPanel(elem){
        CKEditorUtility.ClearALLPluginInnerPanel();
        var pluginInnerPanel = new CKEDITOR.dom.element('div');
        pluginInnerPanel.addClass("pluginInnerPanelWrap");
        elem.append(pluginInnerPanel);

        var selectAllButton = new CKEDITOR.dom.element('div');
        selectAllButton.addClass("button");
        selectAllButton.addClass("select-img");
        selectAllButton.setAttribute( 'title', '选中' );
        pluginInnerPanel.append(selectAllButton);
        selectAllButton.on('click', function (ev) {
            alert("暂不支持!");
            //The DOM event object is passed by the 'data' property.
            var domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            domEvent.preventDefault();
            domEvent.stopPropagation();
        });

        var delButton = new CKEDITOR.dom.element('div');
        delButton.addClass("button");
        delButton.addClass("del-img");
        delButton.setAttribute( 'title', '删除' );
        pluginInnerPanel.append(delButton);
        delButton.on('click', function (ev) {
            elem.remove();
            //The DOM event object is passed by the 'data' property.
            var domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            domEvent.preventDefault();
            domEvent.stopPropagation();
        });

        var copyIdButton = new CKEDITOR.dom.element('div');
        copyIdButton.addClass("button");
        copyIdButton.addClass("copy-id-img");
        copyIdButton.setAttribute( 'title', '复制ID' );
        pluginInnerPanel.append(copyIdButton);
        copyIdButton.on('click', function (ev) {
            alert("暂不支持!");
            //The DOM event object is passed by the 'data' property.
            var domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            domEvent.preventDefault();
            domEvent.stopPropagation();
        });

        /*newDelButton.addClass("del-button");
        elem.append(newDelButton);
        newDelButton.on('click', function (ev) {
            elem.remove();
            //The DOM event object is passed by the 'data' property.
            var domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            domEvent.preventDefault();
            domEvent.stopPropagation();
        });*/
    }
    static ClearALLPluginInnerPanel(){
        var oldDelButtons=CKEditorUtility.GetCKEditorInst().document.find(".pluginInnerPanelWrap");
        for(var i=0;i<oldDelButtons.count();i++){
            oldDelButtons.getItem(i).remove();
        }
    }
    //点击的时候自动选中元素,主要用于实现位置拖拽
    static SingleElemBindDefaultEvent(elem){
        //如果不存在子元素,则默认设置为选中状态
        var singleName=elem.getAttribute("singlename");
        var innerHtml = elem.getHtml();
        //debugger;
        innerHtml=innerHtml.replace(/<br \/>/g,"");
        if (innerHtml.indexOf("<") < 0) {
            if (singleName) {
                elem.on('click', function (ev) {
                    //console.log(this);
                    //debugger;
                    console.log(this);
                    CKEditorUtility.GetCKEditorInst().getSelection().selectElement(this);
                    CKEditorUtility.SetSelectedElem(this.getOuterHtml());

                    //The DOM event object is passed by the 'data' property.
                    var domEvent = ev.data;
                    //Prevent the click to chave any effect in the element.
                    domEvent.preventDefault();
                    domEvent.stopPropagation();
                });
            }
        }
        //取消点击时产生移除按钮的配置与功能,迁移到,selectionChange的事件中生成面板
        /*if(elem.getAttribute("show_remove_button")=="true") {
            elem.on('click', function () {
                CKEditorUtility.GetCKEditorInst().getSelection().selectElement(this);
                CKEditorUtility.SetSelectedElem(this.getOuterHtml());
                //创建临时用于删除按钮的元素
                CKEditorUtility.ClearALLForDivElemButton();
                var newDelButton = new CKEDITOR.dom.element('div');
                newDelButton.addClass("del-button");
                elem.append(newDelButton);
                newDelButton.on('click', function (ev) {
                    elem.remove();
                    //The DOM event object is passed by the 'data' property.
                    var domEvent = ev.data;
                    //Prevent the click to chave any effect in the element.
                    domEvent.preventDefault();
                    domEvent.stopPropagation();
                });
            });
        }*/
    }
    static ALLElemBindDefaultEvent(){
        console.log("取消使用点击进行元素选择和删除的功能,迁移为selectionChange事件进行!")
        //console.log(CKEditorUtility.GetCKEditorInst());
        //var elements = CKEditorUtility.GetCKEditorInst().document.getBody().getElementsByTag( '*' );
        //for ( var i = 0; i < elements.count(); ++i ) {
        //    var elem = elements.getItem(i);
        //    this.SingleElemBindDefaultEvent(elem);
        //}
    }

}

