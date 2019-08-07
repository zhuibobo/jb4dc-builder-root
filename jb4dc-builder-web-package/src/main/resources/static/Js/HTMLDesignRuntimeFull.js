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
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);

    this._LoadHTMLToEl();
  },
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath() + "/Rest/Builder/ListRuntime/ListPreview?listId=" + this._Prop_Config.ListId, this._Prop_Config.RendererTo, {}, function (result) {
      console.log("加载预览窗体成功!!");
      console.log(result);
      console.log(result.data.formHtmlRuntime);

      this._$RendererToElem.append(result.data.formHtmlRuntime);

      VirtualBodyControl.RendererChain(result.data.formHtmlRuntime, this._$RendererToElem, this._$RendererToElem);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1SdW50aW1lLmpzIiwiTGlzdFJ1bnRpbWUuanMiLCJSdW50aW1lR2VuZXJhbC5qcyIsIkNvbnRyb2wvSFRNTENvbnRyb2wuanMiLCJDb250cm9sL1ZpcnR1YWxCb2R5Q29udHJvbC5qcyIsIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfVGV4dEJveC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiSFRNTERlc2lnblJ1bnRpbWVGdWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGb3JtUnVudGltZSA9IHtcbiAgX1Byb3BfU3RhdHVzOiBcIkVkaXRcIixcbiAgX1Byb3BfQ29uZmlnOiB7XG4gICAgUmVuZGVyZXJUb0lkOiBudWxsLFxuICAgIEZvcm1JZDogXCJcIlxuICB9LFxuICBfJFJlbmRlcmVyVG9FbGVtOiBudWxsLFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcbiAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0gPSAkKFwiI1wiICsgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUb0lkKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UuTG9hZEh0bWxEZXNpZ25Db250ZW50KEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9SZXN0L0J1aWxkZXIvRm9ybVJ1bnRpbWUvRm9ybVByZXZpZXc/Zm9ybUlkPVwiICsgdGhpcy5fUHJvcF9Db25maWcuRm9ybUlkLCB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2coXCLliqDovb3pooTop4jnqpfkvZPmiJDlip8hIVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdC5kYXRhLmZvcm1IdG1sUnVudGltZSk7XG5cbiAgICAgIHRoaXMuXyRSZW5kZXJlclRvRWxlbS5hcHBlbmQocmVzdWx0LmRhdGEuZm9ybUh0bWxSdW50aW1lKTtcblxuICAgICAgVmlydHVhbEJvZHlDb250cm9sLlJlbmRlcmVyQ2hhaW4ocmVzdWx0LmRhdGEuZm9ybUh0bWxSdW50aW1lLCB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sIHRoaXMuXyRSZW5kZXJlclRvRWxlbSk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMaXN0UnVudGltZSA9IHtcbiAgX1Byb3BfU3RhdHVzOiBcIkVkaXRcIixcbiAgX1Byb3BfQ29uZmlnOiB7XG4gICAgUmVuZGVyZXJUb0lkOiBudWxsLFxuICAgIExpc3RJZDogXCJcIlxuICB9LFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcbiAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0gPSAkKFwiI1wiICsgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUb0lkKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UuTG9hZEh0bWxEZXNpZ25Db250ZW50KEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9SZXN0L0J1aWxkZXIvTGlzdFJ1bnRpbWUvTGlzdFByZXZpZXc/bGlzdElkPVwiICsgdGhpcy5fUHJvcF9Db25maWcuTGlzdElkLCB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2coXCLliqDovb3pooTop4jnqpfkvZPmiJDlip8hIVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YS5mb3JtSHRtbFJ1bnRpbWUpO1xuXG4gICAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0uYXBwZW5kKHJlc3VsdC5kYXRhLmZvcm1IdG1sUnVudGltZSk7XG5cbiAgICAgIFZpcnR1YWxCb2R5Q29udHJvbC5SZW5kZXJlckNoYWluKHJlc3VsdC5kYXRhLmZvcm1IdG1sUnVudGltZSwgdGhpcy5fJFJlbmRlcmVyVG9FbGVtLCB0aGlzLl8kUmVuZGVyZXJUb0VsZW0pO1xuICAgIH0sIHRoaXMpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUnVudGltZUdlbmVyYWxJbnN0YW5jZSA9IHtcbiAgTG9hZEh0bWxEZXNpZ25Db250ZW50OiBmdW5jdGlvbiBMb2FkSHRtbERlc2lnbkNvbnRlbnQodXJsLCBhcHBlbmRUb0VsZW1JZCwgcGFyYW1zLCBjYWxsYmFjaywgc2VuZGVyKSB7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgIGRhdGE6IHBhcmFtc1xuICAgIH0pLmRvbmUoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY2FsbGJhY2suY2FsbChzZW5kZXIsIHJlc3VsdCk7XG4gICAgfSkuYWx3YXlzKGNhbGxiYWNrICYmIGZ1bmN0aW9uIChqcVhIUiwgc3RhdHVzKSB7fSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBIVE1MQ29udHJvbEF0dHJzID0ge1xuICBKQlVJTEQ0RENfQ1VTVE9NOiBcImpidWlsZDRkY19jdXN0b21cIixcbiAgQ0xJRU5UX1JFU09MVkU6IFwiY2xpZW50X3Jlc29sdmVcIlxufTtcbnZhciBIVE1MQ29udHJvbCA9IHtcbiAgX0luc3RhbmNlTWFwOiB7fSxcbiAgR2V0SW5zdGFuY2U6IGZ1bmN0aW9uIEdldEluc3RhbmNlKG5hbWUpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fSW5zdGFuY2VNYXApIHtcbiAgICAgIGlmIChrZXkgPT0gbmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fSW5zdGFuY2VNYXBba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaW5zdGFuY2UgPSBldmFsKG5hbWUpO1xuICAgIHRoaXMuX0luc3RhbmNlTWFwW25hbWVdID0gaW5zdGFuY2U7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9LFxuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKHNvdXJjZUhUTUwsICRyb290RWxlbSwgJHNpbmdsZUNvbnRyb2xFbGVtLCBhbGxEYXRhKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2luZ2xlQ29udHJvbEVsZW0uY2hpbGRyZW4oKS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICRjaGlsZFNpbmdsZUVsZW0gPSAkKCRzaW5nbGVDb250cm9sRWxlbS5jaGlsZHJlbigpW2ldKTtcblxuICAgICAgaWYgKCRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkpCVUlMRDREQ19DVVNUT00pID09IFwidHJ1ZVwiICYmICRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkNMSUVOVF9SRVNPTFZFKSkge1xuICAgICAgICB2YXIgY2xpZW50UmVzb2x2ZUluc3RhbmNlTmFtZSA9ICRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkNMSUVOVF9SRVNPTFZFKTtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0SW5zdGFuY2UoY2xpZW50UmVzb2x2ZUluc3RhbmNlTmFtZSk7XG4gICAgICAgIGluc3RhbmNlLlJlbmRlcmVyQ2hhaW4oc291cmNlSFRNTCwgJHJvb3RFbGVtLCAkY2hpbGRTaW5nbGVFbGVtLCBhbGxEYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4oc291cmNlSFRNTCwgJHJvb3RFbGVtLCAkY2hpbGRTaW5nbGVFbGVtLCBhbGxEYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBWaXJ0dWFsQm9keUNvbnRyb2wgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW5cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXRkRDVF9UZXh0Qm94ID0ge1xuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKHNvdXJjZUhUTUwsICRyb290RWxlbSwgJHNpbmdsZUNvbnRyb2xFbGVtLCBhbGxEYXRhKSB7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLnZhbChcIjIyMjIyXCIpO1xuICB9XG59OyJdfQ==
