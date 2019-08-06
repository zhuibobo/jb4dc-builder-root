"use strict";

var FormRuntime = {
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererTo: null,
    FormId: ""
  },
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);

    this._LoadHTMLToEl();
  },
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    $(this._Prop_Config.RendererTo).load(BaseUtility.GetRootPath() + "/Rest/Builder/FormRuntime/FormPreview?formId=" + this._Prop_Config.FormId, function () {
      console.log("加载预览窗体成功!!");
    });
  }
};
"use strict";

var ListRuntime = {
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererTo: null,
    ListId: ""
  },
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);

    this._LoadHTMLToEl();
  },
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    $(this._Prop_Config.RendererTo).load(BaseUtility.GetRootPath() + "/Rest/Builder/ListRuntime/ListPreview?listId=" + this._Prop_Config.ListId, function () {
      console.log("加载预览列表成功!!");
    });
  }
};
"use strict";
"use strict";
"use strict";

var WFDCT_TextBox = {};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1SdW50aW1lLmpzIiwiTGlzdFJ1bnRpbWUuanMiLCJDb250cm9sL0hUTUxDb250cm9sLmpzIiwiQ29udHJvbC9WaXJ0dWFsQm9keUNvbnRyb2wuanMiLCJDb250cm9sL1dlYkZvcm1Db250cm9sL1dGRENUX1RleHRCb3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUNBQTtBQ0FBO0FBQ0E7QUFDQSIsImZpbGUiOiJIVE1MRGVzaWduUnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZvcm1SdW50aW1lID0ge1xuICBfUHJvcF9TdGF0dXM6IFwiRWRpdFwiLFxuICBfUHJvcF9Db25maWc6IHtcbiAgICBSZW5kZXJlclRvOiBudWxsLFxuICAgIEZvcm1JZDogXCJcIlxuICB9LFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgICQodGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbykubG9hZChCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvUmVzdC9CdWlsZGVyL0Zvcm1SdW50aW1lL0Zvcm1QcmV2aWV3P2Zvcm1JZD1cIiArIHRoaXMuX1Byb3BfQ29uZmlnLkZvcm1JZCwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coXCLliqDovb3pooTop4jnqpfkvZPmiJDlip8hIVwiKTtcbiAgICB9KTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIExpc3RSdW50aW1lID0ge1xuICBfUHJvcF9TdGF0dXM6IFwiRWRpdFwiLFxuICBfUHJvcF9Db25maWc6IHtcbiAgICBSZW5kZXJlclRvOiBudWxsLFxuICAgIExpc3RJZDogXCJcIlxuICB9LFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgICQodGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbykubG9hZChCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvUmVzdC9CdWlsZGVyL0xpc3RSdW50aW1lL0xpc3RQcmV2aWV3P2xpc3RJZD1cIiArIHRoaXMuX1Byb3BfQ29uZmlnLkxpc3RJZCwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coXCLliqDovb3pooTop4jliJfooajmiJDlip8hIVwiKTtcbiAgICB9KTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdGRENUX1RleHRCb3ggPSB7fTsiXX0=
