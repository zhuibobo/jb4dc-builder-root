"use strict";

CKEDITOR.editorConfig = function (config) {
  config.plugins = 'iframedialog,dialogui,dialog,dialogadvtab,basicstyles,' + 'blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,' + 'templates,menu,contextmenu,div,resize,toolbar,elementspath,enterkey,entities,popup,' + 'find,fakeobjects,floatingspace,listblock,richcombo,font,format,' + 'horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,' + 'justify,menubutton,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,' + 'pastefromword,removeformat,save,selectall,showblocks,showborders,sourcearea,' + 'specialchar,scayt,stylescombo,tab,table,tabletools,undo,wsc';
  config.skin = 'moono-lisa';
  config.toolbarGroups = [{
    name: 'document',
    groups: ['mode', 'document', 'doctools']
  }, {
    name: 'clipboard',
    groups: ['clipboard', 'undo']
  }, {
    name: 'editing',
    groups: ['find', 'selection', 'spellchecker', 'editing']
  }, {
    name: 'forms',
    groups: ['forms']
  }, {
    name: 'basicstyles',
    groups: ['basicstyles', 'cleanup']
  }, {
    name: 'paragraph',
    groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
  }, {
    name: 'links',
    groups: ['links']
  }, {
    name: 'insert',
    groups: ['insert']
  }, {
    name: 'styles',
    groups: ['styles']
  }, {
    name: 'colors',
    groups: ['colors']
  }, {
    name: 'tools',
    groups: ['tools']
  }, {
    name: 'others',
    groups: ['others']
  }, {
    name: 'LC_Template',
    groups: []
  }, {
    name: 'LC_Container',
    groups: []
  }, '/', {
    name: 'LC_Simple_G1',
    groups: []
  }, {
    name: 'LC_Simple_G2',
    groups: []
  }, {
    name: 'LC_Simple_G3',
    groups: []
  }];
  config.height = jQuery(".form-design-wraper").height() - 112;
  config.fillEmptyBlocks = false;
  config.enterMode = CKEDITOR.ENTER_BR;
  config.shiftEnterMode = CKEDITOR.ENTER_BR;
  config.allowedContent = true;
  config.stylesSet = false;
  var themeVo = CKEditorUtility.GetThemeVo();
  var inputCssArray = [];

  for (var i = 0; i < themeVo.refs.length; i++) {
    var ref = themeVo.refs[i];

    if (ref.type == "css") {
      inputCssArray.push(ref.path.replace("${BasePath}", BaseUtility.GetRootPath()));
    }
  }

  inputCssArray.push(BaseUtility.GetRootPath() + "/Themes/Default/Css/HTMLDesignWysiwygMain.css");
  config.contentsCss = inputCssArray;
  config.removeButtons = 'Maximize,Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,' + 'Replace,Find,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Bold,Italic,' + 'Underline,Strike,Subscript,Superscript,RemoveFormat,NumberedList,BulletedList,Indent,Outdent,Blockquote,CreateDiv,' + 'JustifyBlock,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Flash,HorizontalRule,Smiley,SpecialChar,' + 'PageBreak,Iframe,FontSize,Font,Format,Styles,BGColor,About,ShowBlocks';
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJDS0VkaXRvckNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5DS0VESVRPUi5lZGl0b3JDb25maWcgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gIGNvbmZpZy5wbHVnaW5zID0gJ2lmcmFtZWRpYWxvZyxkaWFsb2d1aSxkaWFsb2csZGlhbG9nYWR2dGFiLGJhc2ljc3R5bGVzLCcgKyAnYmxvY2txdW90ZSxjbGlwYm9hcmQsYnV0dG9uLHBhbmVsYnV0dG9uLHBhbmVsLGZsb2F0cGFuZWwsY29sb3JidXR0b24sY29sb3JkaWFsb2csJyArICd0ZW1wbGF0ZXMsbWVudSxjb250ZXh0bWVudSxkaXYscmVzaXplLHRvb2xiYXIsZWxlbWVudHNwYXRoLGVudGVya2V5LGVudGl0aWVzLHBvcHVwLCcgKyAnZmluZCxmYWtlb2JqZWN0cyxmbG9hdGluZ3NwYWNlLGxpc3RibG9jayxyaWNoY29tYm8sZm9udCxmb3JtYXQsJyArICdob3Jpem9udGFscnVsZSxodG1sd3JpdGVyLGlmcmFtZSx3eXNpd3lnYXJlYSxpbWFnZSxpbmRlbnQsaW5kZW50YmxvY2ssaW5kZW50bGlzdCxzbWlsZXksJyArICdqdXN0aWZ5LG1lbnVidXR0b24sbGluayxsaXN0LGxpc3RzdHlsZSxtYWdpY2xpbmUsbWF4aW1pemUsbmV3cGFnZSxwYWdlYnJlYWsscGFzdGV0ZXh0LCcgKyAncGFzdGVmcm9td29yZCxyZW1vdmVmb3JtYXQsc2F2ZSxzZWxlY3RhbGwsc2hvd2Jsb2NrcyxzaG93Ym9yZGVycyxzb3VyY2VhcmVhLCcgKyAnc3BlY2lhbGNoYXIsc2NheXQsc3R5bGVzY29tYm8sdGFiLHRhYmxlLHRhYmxldG9vbHMsdW5kbyx3c2MnO1xuICBjb25maWcuc2tpbiA9ICdtb29uby1saXNhJztcbiAgY29uZmlnLnRvb2xiYXJHcm91cHMgPSBbe1xuICAgIG5hbWU6ICdkb2N1bWVudCcsXG4gICAgZ3JvdXBzOiBbJ21vZGUnLCAnZG9jdW1lbnQnLCAnZG9jdG9vbHMnXVxuICB9LCB7XG4gICAgbmFtZTogJ2NsaXBib2FyZCcsXG4gICAgZ3JvdXBzOiBbJ2NsaXBib2FyZCcsICd1bmRvJ11cbiAgfSwge1xuICAgIG5hbWU6ICdlZGl0aW5nJyxcbiAgICBncm91cHM6IFsnZmluZCcsICdzZWxlY3Rpb24nLCAnc3BlbGxjaGVja2VyJywgJ2VkaXRpbmcnXVxuICB9LCB7XG4gICAgbmFtZTogJ2Zvcm1zJyxcbiAgICBncm91cHM6IFsnZm9ybXMnXVxuICB9LCB7XG4gICAgbmFtZTogJ2Jhc2ljc3R5bGVzJyxcbiAgICBncm91cHM6IFsnYmFzaWNzdHlsZXMnLCAnY2xlYW51cCddXG4gIH0sIHtcbiAgICBuYW1lOiAncGFyYWdyYXBoJyxcbiAgICBncm91cHM6IFsnbGlzdCcsICdpbmRlbnQnLCAnYmxvY2tzJywgJ2FsaWduJywgJ2JpZGknLCAncGFyYWdyYXBoJ11cbiAgfSwge1xuICAgIG5hbWU6ICdsaW5rcycsXG4gICAgZ3JvdXBzOiBbJ2xpbmtzJ11cbiAgfSwge1xuICAgIG5hbWU6ICdpbnNlcnQnLFxuICAgIGdyb3VwczogWydpbnNlcnQnXVxuICB9LCB7XG4gICAgbmFtZTogJ3N0eWxlcycsXG4gICAgZ3JvdXBzOiBbJ3N0eWxlcyddXG4gIH0sIHtcbiAgICBuYW1lOiAnY29sb3JzJyxcbiAgICBncm91cHM6IFsnY29sb3JzJ11cbiAgfSwge1xuICAgIG5hbWU6ICd0b29scycsXG4gICAgZ3JvdXBzOiBbJ3Rvb2xzJ11cbiAgfSwge1xuICAgIG5hbWU6ICdvdGhlcnMnLFxuICAgIGdyb3VwczogWydvdGhlcnMnXVxuICB9LCB7XG4gICAgbmFtZTogJ0xDX1RlbXBsYXRlJyxcbiAgICBncm91cHM6IFtdXG4gIH0sIHtcbiAgICBuYW1lOiAnTENfQ29udGFpbmVyJyxcbiAgICBncm91cHM6IFtdXG4gIH0sICcvJywge1xuICAgIG5hbWU6ICdMQ19TaW1wbGVfRzEnLFxuICAgIGdyb3VwczogW11cbiAgfSwge1xuICAgIG5hbWU6ICdMQ19TaW1wbGVfRzInLFxuICAgIGdyb3VwczogW11cbiAgfSwge1xuICAgIG5hbWU6ICdMQ19TaW1wbGVfRzMnLFxuICAgIGdyb3VwczogW11cbiAgfV07XG4gIGNvbmZpZy5oZWlnaHQgPSBqUXVlcnkoXCIuZm9ybS1kZXNpZ24td3JhcGVyXCIpLmhlaWdodCgpIC0gMTEyO1xuICBjb25maWcuZmlsbEVtcHR5QmxvY2tzID0gZmFsc2U7XG4gIGNvbmZpZy5lbnRlck1vZGUgPSBDS0VESVRPUi5FTlRFUl9CUjtcbiAgY29uZmlnLnNoaWZ0RW50ZXJNb2RlID0gQ0tFRElUT1IuRU5URVJfQlI7XG4gIGNvbmZpZy5hbGxvd2VkQ29udGVudCA9IHRydWU7XG4gIGNvbmZpZy5zdHlsZXNTZXQgPSBmYWxzZTtcbiAgdmFyIHRoZW1lVm8gPSBDS0VkaXRvclV0aWxpdHkuR2V0VGhlbWVWbygpO1xuICB2YXIgaW5wdXRDc3NBcnJheSA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhlbWVWby5yZWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHJlZiA9IHRoZW1lVm8ucmVmc1tpXTtcblxuICAgIGlmIChyZWYudHlwZSA9PSBcImNzc1wiKSB7XG4gICAgICBpbnB1dENzc0FycmF5LnB1c2gocmVmLnBhdGgucmVwbGFjZShcIiR7QmFzZVBhdGh9XCIsIEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkpKTtcbiAgICB9XG4gIH1cblxuICBpbnB1dENzc0FycmF5LnB1c2goQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9EZWZhdWx0L0Nzcy9IVE1MRGVzaWduV3lzaXd5Z01haW4uY3NzXCIpO1xuICBjb25maWcuY29udGVudHNDc3MgPSBpbnB1dENzc0FycmF5O1xuICBjb25maWcucmVtb3ZlQnV0dG9ucyA9ICdNYXhpbWl6ZSxTb3VyY2UsU2F2ZSxOZXdQYWdlLFByZXZpZXcsUHJpbnQsVGVtcGxhdGVzLEN1dCxDb3B5LFBhc3RlLFBhc3RlVGV4dCxQYXN0ZUZyb21Xb3JkLFVuZG8sUmVkbywnICsgJ1JlcGxhY2UsRmluZCxTZWxlY3RBbGwsU2NheXQsRm9ybSxDaGVja2JveCxSYWRpbyxUZXh0RmllbGQsVGV4dGFyZWEsU2VsZWN0LEJ1dHRvbixJbWFnZUJ1dHRvbixIaWRkZW5GaWVsZCxCb2xkLEl0YWxpYywnICsgJ1VuZGVybGluZSxTdHJpa2UsU3Vic2NyaXB0LFN1cGVyc2NyaXB0LFJlbW92ZUZvcm1hdCxOdW1iZXJlZExpc3QsQnVsbGV0ZWRMaXN0LEluZGVudCxPdXRkZW50LEJsb2NrcXVvdGUsQ3JlYXRlRGl2LCcgKyAnSnVzdGlmeUJsb2NrLEJpZGlMdHIsQmlkaVJ0bCxMYW5ndWFnZSxMaW5rLFVubGluayxBbmNob3IsRmxhc2gsSG9yaXpvbnRhbFJ1bGUsU21pbGV5LFNwZWNpYWxDaGFyLCcgKyAnUGFnZUJyZWFrLElmcmFtZSxGb250U2l6ZSxGb250LEZvcm1hdCxTdHlsZXMsQkdDb2xvcixBYm91dCxTaG93QmxvY2tzJztcbn07Il19
