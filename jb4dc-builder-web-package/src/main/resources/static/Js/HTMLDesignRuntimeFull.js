"use strict";

var FormRuntime = {
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererToId: null,
    FormId: ""
  },
  _$RendererToElem: null,
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);

    this._LoadHTMLToEl();
  },
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath() + "/Rest/Builder/FormRuntime/FormPreview?formId=" + this._Prop_Config.FormId, this._Prop_Config.RendererTo, {}, function (result) {
      console.log("加载预览窗体成功!!");
      console.log(result.data.formHtmlRuntime);

      this._$RendererToElem.append(result.data.formHtmlRuntime);

      VirtualBodyControl.RendererChain(result.data.formHtmlRuntime, this._$RendererToElem, this._$RendererToElem);
    }, this);
  }
};
"use strict";

var ListRuntime = {
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererToId: null,
    ListId: ""
  },
  _$RendererToElem: null,
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);

    this._LoadHTMLToEl();
  },
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath() + "/Rest/Builder/ListRuntime/ListPreview?listId=" + this._Prop_Config.ListId, this._Prop_Config.RendererTo, {}, function (result) {
      console.log("加载预览窗体成功!!");
      console.log(result);

      this._$RendererToElem.append(result.data.listHtmlRuntime);

      VirtualBodyControl.RendererChain(result.data.listHtmlRuntime, this._$RendererToElem, this._$RendererToElem);
    }, this);
  }
};
"use strict";

var RuntimeGeneralInstance = {
  LoadHtmlDesignContent: function LoadHtmlDesignContent(url, appendToElemId, params, callback, sender) {
    jQuery.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: params
    }).done(function (result) {
      callback.call(sender, result);
    }).always(callback && function (jqXHR, status) {});
  }
};
"use strict";

var HTMLControlAttrs = {
  JBUILD4DC_CUSTOM: "jbuild4dc_custom",
  CLIENT_RESOLVE: "client_resolve"
};
var HTMLControl = {
  _InstanceMap: {},
  GetInstance: function GetInstance(name) {
    for (var key in this._InstanceMap) {
      if (key == name) {
        return this._InstanceMap[key];
      }
    }

    var instance = eval(name);
    this._InstanceMap[name] = instance;
    return instance;
  },
  RendererChain: function RendererChain(sourceHTML, $rootElem, $singleControlElem, allData) {
    for (var i = 0; i < $singleControlElem.children().length; i++) {
      var $childSingleElem = $($singleControlElem.children()[i]);

      if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM) == "true" && $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
        var clientResolveInstanceName = $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
        var instance = HTMLControl.GetInstance(clientResolveInstanceName);
        instance.RendererChain(sourceHTML, $rootElem, $childSingleElem, allData);
      } else {
        HTMLControl.RendererChain(sourceHTML, $rootElem, $childSingleElem, allData);
      }
    }
  }
};
"use strict";

var VirtualBodyControl = {
  RendererChain: HTMLControl.RendererChain
};
"use strict";

var WFDCT_TextBox = {
  RendererChain: function RendererChain(sourceHTML, $rootElem, $singleControlElem, allData) {
    $singleControlElem.val("22222");
  }
};
"use strict";

var WLDCT_FormButton = {
  RendererChain: HTMLControl.RendererChain
};
"use strict";

var WLDCT_ListButtonContainer = {
  RendererChain: HTMLControl.RendererChain
};
"use strict";

var WLDCT_ListComplexSearchContainer = {
  RendererChain: HTMLControl.RendererChain
};
"use strict";

var WLDCT_ListSimpleSearchContainer = {
  RendererChain: HTMLControl.RendererChain
};
"use strict";

var WLDCT_ListTableContainer = {
  RendererChain: HTMLControl.RendererChain
};
"use strict";

var WLDCT_ListTableLabel = {
  RendererChain: HTMLControl.RendererChain
};
"use strict";

var WLDCT_Search_TextBox = {
  RendererChain: HTMLControl.RendererChain
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1SdW50aW1lLmpzIiwiTGlzdFJ1bnRpbWUuanMiLCJSdW50aW1lR2VuZXJhbC5qcyIsIkNvbnRyb2wvSFRNTENvbnRyb2wuanMiLCJDb250cm9sL1ZpcnR1YWxCb2R5Q29udHJvbC5qcyIsIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfVGV4dEJveC5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfRm9ybUJ1dHRvbi5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdENvbXBsZXhTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RTaW1wbGVTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUNvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdFRhYmxlTGFiZWwuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX1NlYXJjaF9UZXh0Qm94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiSFRNTERlc2lnblJ1bnRpbWVGdWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGb3JtUnVudGltZSA9IHtcbiAgX1Byb3BfU3RhdHVzOiBcIkVkaXRcIixcbiAgX1Byb3BfQ29uZmlnOiB7XG4gICAgUmVuZGVyZXJUb0lkOiBudWxsLFxuICAgIEZvcm1JZDogXCJcIlxuICB9LFxuICBfJFJlbmRlcmVyVG9FbGVtOiBudWxsLFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcbiAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0gPSAkKFwiI1wiICsgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUb0lkKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UuTG9hZEh0bWxEZXNpZ25Db250ZW50KEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9SZXN0L0J1aWxkZXIvRm9ybVJ1bnRpbWUvRm9ybVByZXZpZXc/Zm9ybUlkPVwiICsgdGhpcy5fUHJvcF9Db25maWcuRm9ybUlkLCB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2coXCLliqDovb3pooTop4jnqpfkvZPmiJDlip8hIVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdC5kYXRhLmZvcm1IdG1sUnVudGltZSk7XG5cbiAgICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbS5hcHBlbmQocmVzdWx0LmRhdGEuZm9ybUh0bWxSdW50aW1lKTtcblxuICAgICAgVmlydHVhbEJvZHlDb250cm9sLlJlbmRlcmVyQ2hhaW4ocmVzdWx0LmRhdGEuZm9ybUh0bWxSdW50aW1lLCB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sIHRoaXMuXyRSZW5kZXJlclRvRWxlbSk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMaXN0UnVudGltZSA9IHtcbiAgX1Byb3BfU3RhdHVzOiBcIkVkaXRcIixcbiAgX1Byb3BfQ29uZmlnOiB7XG4gICAgUmVuZGVyZXJUb0lkOiBudWxsLFxuICAgIExpc3RJZDogXCJcIlxuICB9LFxuICBfJFJlbmRlcmVyVG9FbGVtOiBudWxsLFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcbiAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0gPSAkKFwiI1wiICsgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUb0lkKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UuTG9hZEh0bWxEZXNpZ25Db250ZW50KEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9SZXN0L0J1aWxkZXIvTGlzdFJ1bnRpbWUvTGlzdFByZXZpZXc/bGlzdElkPVwiICsgdGhpcy5fUHJvcF9Db25maWcuTGlzdElkLCB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2coXCLliqDovb3pooTop4jnqpfkvZPmiJDlip8hIVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbS5hcHBlbmQocmVzdWx0LmRhdGEubGlzdEh0bWxSdW50aW1lKTtcblxuICAgICAgVmlydHVhbEJvZHlDb250cm9sLlJlbmRlcmVyQ2hhaW4ocmVzdWx0LmRhdGEubGlzdEh0bWxSdW50aW1lLCB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sIHRoaXMuXyRSZW5kZXJlclRvRWxlbSk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBSdW50aW1lR2VuZXJhbEluc3RhbmNlID0ge1xuICBMb2FkSHRtbERlc2lnbkNvbnRlbnQ6IGZ1bmN0aW9uIExvYWRIdG1sRGVzaWduQ29udGVudCh1cmwsIGFwcGVuZFRvRWxlbUlkLCBwYXJhbXMsIGNhbGxiYWNrLCBzZW5kZXIpIHtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgZGF0YTogcGFyYW1zXG4gICAgfSkuZG9uZShmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHNlbmRlciwgcmVzdWx0KTtcbiAgICB9KS5hbHdheXMoY2FsbGJhY2sgJiYgZnVuY3Rpb24gKGpxWEhSLCBzdGF0dXMpIHt9KTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEhUTUxDb250cm9sQXR0cnMgPSB7XG4gIEpCVUlMRDREQ19DVVNUT006IFwiamJ1aWxkNGRjX2N1c3RvbVwiLFxuICBDTElFTlRfUkVTT0xWRTogXCJjbGllbnRfcmVzb2x2ZVwiXG59O1xudmFyIEhUTUxDb250cm9sID0ge1xuICBfSW5zdGFuY2VNYXA6IHt9LFxuICBHZXRJbnN0YW5jZTogZnVuY3Rpb24gR2V0SW5zdGFuY2UobmFtZSkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9JbnN0YW5jZU1hcCkge1xuICAgICAgaWYgKGtleSA9PSBuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9JbnN0YW5jZU1hcFtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBpbnN0YW5jZSA9IGV2YWwobmFtZSk7XG4gICAgdGhpcy5fSW5zdGFuY2VNYXBbbmFtZV0gPSBpbnN0YW5jZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0sXG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oc291cmNlSFRNTCwgJHJvb3RFbGVtLCAkc2luZ2xlQ29udHJvbEVsZW0sIGFsbERhdGEpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzaW5nbGVDb250cm9sRWxlbS5jaGlsZHJlbigpLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGNoaWxkU2luZ2xlRWxlbSA9ICQoJHNpbmdsZUNvbnRyb2xFbGVtLmNoaWxkcmVuKClbaV0pO1xuXG4gICAgICBpZiAoJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuSkJVSUxENERDX0NVU1RPTSkgPT0gXCJ0cnVlXCIgJiYgJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpKSB7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlSW5zdGFuY2VOYW1lID0gJGNoaWxkU2luZ2xlRWxlbS5hdHRyKEhUTUxDb250cm9sQXR0cnMuQ0xJRU5UX1JFU09MVkUpO1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBIVE1MQ29udHJvbC5HZXRJbnN0YW5jZShjbGllbnRSZXNvbHZlSW5zdGFuY2VOYW1lKTtcbiAgICAgICAgaW5zdGFuY2UuUmVuZGVyZXJDaGFpbihzb3VyY2VIVE1MLCAkcm9vdEVsZW0sICRjaGlsZFNpbmdsZUVsZW0sIGFsbERhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbihzb3VyY2VIVE1MLCAkcm9vdEVsZW0sICRjaGlsZFNpbmdsZUVsZW0sIGFsbERhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFZpcnR1YWxCb2R5Q29udHJvbCA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdGRENUX1RleHRCb3ggPSB7XG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oc291cmNlSFRNTCwgJHJvb3RFbGVtLCAkc2luZ2xlQ29udHJvbEVsZW0sIGFsbERhdGEpIHtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0udmFsKFwiMjIyMjJcIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXTERDVF9Gb3JtQnV0dG9uID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RDb21wbGV4U2VhcmNoQ29udGFpbmVyID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFNpbXBsZVNlYXJjaENvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUxhYmVsID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfU2VhcmNoX1RleHRCb3ggPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW5cbn07Il19
