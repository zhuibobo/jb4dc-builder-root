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

      VirtualBodyControl.RendererChain({
        sourceHTML: result.data.listHtmlRuntime,
        $rootElem: this._$RendererToElem,
        $parentControlElem: this._$RendererToElem,
        $singleControlElem: this._$RendererToElem,
        allData: null
      });
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
  SELECTED_JBUILD4DC_CUSTOM: "[jbuild4dc_custom=true]",
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
  RendererChainParas: {
    sourceHTML: null,
    $rootElem: null,
    $parentControlElem: null,
    $singleControlElem: null,
    allData: null
  },
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;

    for (var i = 0; i < $singleControlElem.children().length; i++) {
      var $childSingleElem = $($singleControlElem.children()[i]);

      if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM) == "true" && $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
        var clientResolveInstanceName = $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
        var instance = HTMLControl.GetInstance(clientResolveInstanceName);
        instance.RendererChain({
          sourceHTML: _rendererChainParas.sourceHTML,
          $rootElem: _rendererChainParas.$rootElem,
          $parentControlElem: _rendererChainParas.$singleControlElem,
          $singleControlElem: $childSingleElem,
          allData: _rendererChainParas.allData
        });
      } else {
        HTMLControl.RendererChain({
          sourceHTML: _rendererChainParas.sourceHTML,
          $rootElem: _rendererChainParas.$rootElem,
          $parentControlElem: _rendererChainParas.$singleControlElem,
          $singleControlElem: $childSingleElem,
          allData: _rendererChainParas.allData
        });
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
  RendererChain: HTMLControl.RendererChain,
  ResolveSelf: function ResolveSelf(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var caption = $singleControlElem.attr("buttoncaption");
    var $button = $("<div class='wldct-list-button'>" + caption + "</div>");
    $button.bind("click", {}, function () {
      alert(caption);
    });
    return $button;
  }
};
"use strict";

var WLDCT_ListButtonContainer = {
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var $buttonDivElemList = $singleControlElem.find("div" + HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
    $singleControlElem.find("[is-op-button-wrap-table='true']").hide();
    var innerWrap = $singleControlElem.find(".wldct-list-button-inner-wrap");
    var innerInsideWrapDiv = $("<div class='wldct-list-button-inner-inside-wrap' />");

    for (var i = 0; i < $buttonDivElemList.length; i++) {
      var $buttonElem = $($buttonDivElemList[i]);
      var clientResolveName = $buttonElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
      var clientResolveObject = Object.create(eval(clientResolveName));
      var $resolvedElem = clientResolveObject.ResolveSelf({
        sourceHTML: _rendererChainParas.sourceHTML,
        $rootElem: _rendererChainParas.$rootElem,
        $parentControlElem: $singleControlElem,
        $singleControlElem: $buttonElem,
        allData: _rendererChainParas.allData
      });
      innerInsideWrapDiv.append($resolvedElem);
    }

    innerWrap.append(innerInsideWrapDiv);
    innerWrap.append("<div style=\"clear: both;\"></div>");
  }
};
"use strict";

var WLDCT_ListComplexSearchContainer = {
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    $singleControlElem.hide();
  }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1SdW50aW1lLmpzIiwiTGlzdFJ1bnRpbWUuanMiLCJSdW50aW1lR2VuZXJhbC5qcyIsIkNvbnRyb2wvSFRNTENvbnRyb2wuanMiLCJDb250cm9sL1ZpcnR1YWxCb2R5Q29udHJvbC5qcyIsIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfVGV4dEJveC5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfRm9ybUJ1dHRvbi5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdEJ1dHRvbkNvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdENvbXBsZXhTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RTaW1wbGVTZWFyY2hDb250YWluZXIuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX0xpc3RUYWJsZUNvbnRhaW5lci5qcyIsIkNvbnRyb2wvV2ViTGlzdENvbnRyb2wvV0xEQ1RfTGlzdFRhYmxlTGFiZWwuanMiLCJDb250cm9sL1dlYkxpc3RDb250cm9sL1dMRENUX1NlYXJjaF9UZXh0Qm94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkhUTUxEZXNpZ25SdW50aW1lRnVsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRm9ybVJ1bnRpbWUgPSB7XG4gIF9Qcm9wX1N0YXR1czogXCJFZGl0XCIsXG4gIF9Qcm9wX0NvbmZpZzoge1xuICAgIFJlbmRlcmVyVG9JZDogbnVsbCxcbiAgICBGb3JtSWQ6IFwiXCJcbiAgfSxcbiAgXyRSZW5kZXJlclRvRWxlbTogbnVsbCxcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9Qcm9wX0NvbmZpZywgX2NvbmZpZyk7XG4gICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtID0gJChcIiNcIiArIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG9JZCk7XG5cbiAgICB0aGlzLl9Mb2FkSFRNTFRvRWwoKTtcbiAgfSxcbiAgX0xvYWRIVE1MVG9FbDogZnVuY3Rpb24gX0xvYWRIVE1MVG9FbCgpIHtcbiAgICBSdW50aW1lR2VuZXJhbEluc3RhbmNlLkxvYWRIdG1sRGVzaWduQ29udGVudChCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvUmVzdC9CdWlsZGVyL0Zvcm1SdW50aW1lL0Zvcm1QcmV2aWV3P2Zvcm1JZD1cIiArIHRoaXMuX1Byb3BfQ29uZmlnLkZvcm1JZCwgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbywge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwi5Yqg6L296aKE6KeI56qX5L2T5oiQ5YqfISFcIik7XG4gICAgICBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YS5mb3JtSHRtbFJ1bnRpbWUpO1xuXG4gICAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0uYXBwZW5kKHJlc3VsdC5kYXRhLmZvcm1IdG1sUnVudGltZSk7XG5cbiAgICAgIFZpcnR1YWxCb2R5Q29udHJvbC5SZW5kZXJlckNoYWluKHJlc3VsdC5kYXRhLmZvcm1IdG1sUnVudGltZSwgdGhpcy5fJFJlbmRlcmVyVG9FbGVtLCB0aGlzLl8kUmVuZGVyZXJUb0VsZW0pO1xuICAgIH0sIHRoaXMpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTGlzdFJ1bnRpbWUgPSB7XG4gIF9Qcm9wX1N0YXR1czogXCJFZGl0XCIsXG4gIF9Qcm9wX0NvbmZpZzoge1xuICAgIFJlbmRlcmVyVG9JZDogbnVsbCxcbiAgICBMaXN0SWQ6IFwiXCJcbiAgfSxcbiAgXyRSZW5kZXJlclRvRWxlbTogbnVsbCxcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9Qcm9wX0NvbmZpZywgX2NvbmZpZyk7XG4gICAgdGhpcy5fJFJlbmRlcmVyVG9FbGVtID0gJChcIiNcIiArIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG9JZCk7XG5cbiAgICB0aGlzLl9Mb2FkSFRNTFRvRWwoKTtcbiAgfSxcbiAgX0xvYWRIVE1MVG9FbDogZnVuY3Rpb24gX0xvYWRIVE1MVG9FbCgpIHtcbiAgICBSdW50aW1lR2VuZXJhbEluc3RhbmNlLkxvYWRIdG1sRGVzaWduQ29udGVudChCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvUmVzdC9CdWlsZGVyL0xpc3RSdW50aW1lL0xpc3RQcmV2aWV3P2xpc3RJZD1cIiArIHRoaXMuX1Byb3BfQ29uZmlnLkxpc3RJZCwgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbywge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwi5Yqg6L296aKE6KeI56qX5L2T5oiQ5YqfISFcIik7XG4gICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICB0aGlzLl8kUmVuZGVyZXJUb0VsZW0uYXBwZW5kKHJlc3VsdC5kYXRhLmxpc3RIdG1sUnVudGltZSk7XG5cbiAgICAgIFZpcnR1YWxCb2R5Q29udHJvbC5SZW5kZXJlckNoYWluKHtcbiAgICAgICAgc291cmNlSFRNTDogcmVzdWx0LmRhdGEubGlzdEh0bWxSdW50aW1lLFxuICAgICAgICAkcm9vdEVsZW06IHRoaXMuXyRSZW5kZXJlclRvRWxlbSxcbiAgICAgICAgJHBhcmVudENvbnRyb2xFbGVtOiB0aGlzLl8kUmVuZGVyZXJUb0VsZW0sXG4gICAgICAgICRzaW5nbGVDb250cm9sRWxlbTogdGhpcy5fJFJlbmRlcmVyVG9FbGVtLFxuICAgICAgICBhbGxEYXRhOiBudWxsXG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFJ1bnRpbWVHZW5lcmFsSW5zdGFuY2UgPSB7XG4gIExvYWRIdG1sRGVzaWduQ29udGVudDogZnVuY3Rpb24gTG9hZEh0bWxEZXNpZ25Db250ZW50KHVybCwgYXBwZW5kVG9FbGVtSWQsIHBhcmFtcywgY2FsbGJhY2ssIHNlbmRlcikge1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICBkYXRhOiBwYXJhbXNcbiAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwoc2VuZGVyLCByZXN1bHQpO1xuICAgIH0pLmFsd2F5cyhjYWxsYmFjayAmJiBmdW5jdGlvbiAoanFYSFIsIHN0YXR1cykge30pO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSFRNTENvbnRyb2xBdHRycyA9IHtcbiAgSkJVSUxENERDX0NVU1RPTTogXCJqYnVpbGQ0ZGNfY3VzdG9tXCIsXG4gIFNFTEVDVEVEX0pCVUlMRDREQ19DVVNUT006IFwiW2pidWlsZDRkY19jdXN0b209dHJ1ZV1cIixcbiAgQ0xJRU5UX1JFU09MVkU6IFwiY2xpZW50X3Jlc29sdmVcIlxufTtcbnZhciBIVE1MQ29udHJvbCA9IHtcbiAgX0luc3RhbmNlTWFwOiB7fSxcbiAgR2V0SW5zdGFuY2U6IGZ1bmN0aW9uIEdldEluc3RhbmNlKG5hbWUpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fSW5zdGFuY2VNYXApIHtcbiAgICAgIGlmIChrZXkgPT0gbmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fSW5zdGFuY2VNYXBba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaW5zdGFuY2UgPSBldmFsKG5hbWUpO1xuICAgIHRoaXMuX0luc3RhbmNlTWFwW25hbWVdID0gaW5zdGFuY2U7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9LFxuICBSZW5kZXJlckNoYWluUGFyYXM6IHtcbiAgICBzb3VyY2VIVE1MOiBudWxsLFxuICAgICRyb290RWxlbTogbnVsbCxcbiAgICAkcGFyZW50Q29udHJvbEVsZW06IG51bGwsXG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtOiBudWxsLFxuICAgIGFsbERhdGE6IG51bGxcbiAgfSxcbiAgUmVuZGVyZXJDaGFpbjogZnVuY3Rpb24gUmVuZGVyZXJDaGFpbihfcmVuZGVyZXJDaGFpblBhcmFzKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9IF9yZW5kZXJlckNoYWluUGFyYXMuJHNpbmdsZUNvbnRyb2xFbGVtO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2luZ2xlQ29udHJvbEVsZW0uY2hpbGRyZW4oKS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICRjaGlsZFNpbmdsZUVsZW0gPSAkKCRzaW5nbGVDb250cm9sRWxlbS5jaGlsZHJlbigpW2ldKTtcblxuICAgICAgaWYgKCRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkpCVUlMRDREQ19DVVNUT00pID09IFwidHJ1ZVwiICYmICRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkNMSUVOVF9SRVNPTFZFKSkge1xuICAgICAgICB2YXIgY2xpZW50UmVzb2x2ZUluc3RhbmNlTmFtZSA9ICRjaGlsZFNpbmdsZUVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkNMSUVOVF9SRVNPTFZFKTtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gSFRNTENvbnRyb2wuR2V0SW5zdGFuY2UoY2xpZW50UmVzb2x2ZUluc3RhbmNlTmFtZSk7XG4gICAgICAgIGluc3RhbmNlLlJlbmRlcmVyQ2hhaW4oe1xuICAgICAgICAgIHNvdXJjZUhUTUw6IF9yZW5kZXJlckNoYWluUGFyYXMuc291cmNlSFRNTCxcbiAgICAgICAgICAkcm9vdEVsZW06IF9yZW5kZXJlckNoYWluUGFyYXMuJHJvb3RFbGVtLFxuICAgICAgICAgICRwYXJlbnRDb250cm9sRWxlbTogX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0sXG4gICAgICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiAkY2hpbGRTaW5nbGVFbGVtLFxuICAgICAgICAgIGFsbERhdGE6IF9yZW5kZXJlckNoYWluUGFyYXMuYWxsRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW4oe1xuICAgICAgICAgIHNvdXJjZUhUTUw6IF9yZW5kZXJlckNoYWluUGFyYXMuc291cmNlSFRNTCxcbiAgICAgICAgICAkcm9vdEVsZW06IF9yZW5kZXJlckNoYWluUGFyYXMuJHJvb3RFbGVtLFxuICAgICAgICAgICRwYXJlbnRDb250cm9sRWxlbTogX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW0sXG4gICAgICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtOiAkY2hpbGRTaW5nbGVFbGVtLFxuICAgICAgICAgIGFsbERhdGE6IF9yZW5kZXJlckNoYWluUGFyYXMuYWxsRGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBWaXJ0dWFsQm9keUNvbnRyb2wgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW5cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXRkRDVF9UZXh0Qm94ID0ge1xuICBSZW5kZXJlckNoYWluOiBmdW5jdGlvbiBSZW5kZXJlckNoYWluKHNvdXJjZUhUTUwsICRyb290RWxlbSwgJHNpbmdsZUNvbnRyb2xFbGVtLCBhbGxEYXRhKSB7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLnZhbChcIjIyMjIyXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfRm9ybUJ1dHRvbiA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpbixcbiAgUmVzb2x2ZVNlbGY6IGZ1bmN0aW9uIFJlc29sdmVTZWxmKF9yZW5kZXJlckNoYWluUGFyYXMpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gX3JlbmRlcmVyQ2hhaW5QYXJhcy4kc2luZ2xlQ29udHJvbEVsZW07XG4gICAgdmFyIGNhcHRpb24gPSAkc2luZ2xlQ29udHJvbEVsZW0uYXR0cihcImJ1dHRvbmNhcHRpb25cIik7XG4gICAgdmFyICRidXR0b24gPSAkKFwiPGRpdiBjbGFzcz0nd2xkY3QtbGlzdC1idXR0b24nPlwiICsgY2FwdGlvbiArIFwiPC9kaXY+XCIpO1xuICAgICRidXR0b24uYmluZChcImNsaWNrXCIsIHt9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBhbGVydChjYXB0aW9uKTtcbiAgICB9KTtcbiAgICByZXR1cm4gJGJ1dHRvbjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RCdXR0b25Db250YWluZXIgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICB2YXIgJGJ1dHRvbkRpdkVsZW1MaXN0ID0gJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJkaXZcIiArIEhUTUxDb250cm9sQXR0cnMuU0VMRUNURURfSkJVSUxENERDX0NVU1RPTSk7XG4gICAgJHNpbmdsZUNvbnRyb2xFbGVtLmZpbmQoXCJbaXMtb3AtYnV0dG9uLXdyYXAtdGFibGU9J3RydWUnXVwiKS5oaWRlKCk7XG4gICAgdmFyIGlubmVyV3JhcCA9ICRzaW5nbGVDb250cm9sRWxlbS5maW5kKFwiLndsZGN0LWxpc3QtYnV0dG9uLWlubmVyLXdyYXBcIik7XG4gICAgdmFyIGlubmVySW5zaWRlV3JhcERpdiA9ICQoXCI8ZGl2IGNsYXNzPSd3bGRjdC1saXN0LWJ1dHRvbi1pbm5lci1pbnNpZGUtd3JhcCcgLz5cIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRidXR0b25EaXZFbGVtTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICRidXR0b25FbGVtID0gJCgkYnV0dG9uRGl2RWxlbUxpc3RbaV0pO1xuICAgICAgdmFyIGNsaWVudFJlc29sdmVOYW1lID0gJGJ1dHRvbkVsZW0uYXR0cihIVE1MQ29udHJvbEF0dHJzLkNMSUVOVF9SRVNPTFZFKTtcbiAgICAgIHZhciBjbGllbnRSZXNvbHZlT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZShldmFsKGNsaWVudFJlc29sdmVOYW1lKSk7XG4gICAgICB2YXIgJHJlc29sdmVkRWxlbSA9IGNsaWVudFJlc29sdmVPYmplY3QuUmVzb2x2ZVNlbGYoe1xuICAgICAgICBzb3VyY2VIVE1MOiBfcmVuZGVyZXJDaGFpblBhcmFzLnNvdXJjZUhUTUwsXG4gICAgICAgICRyb290RWxlbTogX3JlbmRlcmVyQ2hhaW5QYXJhcy4kcm9vdEVsZW0sXG4gICAgICAgICRwYXJlbnRDb250cm9sRWxlbTogJHNpbmdsZUNvbnRyb2xFbGVtLFxuICAgICAgICAkc2luZ2xlQ29udHJvbEVsZW06ICRidXR0b25FbGVtLFxuICAgICAgICBhbGxEYXRhOiBfcmVuZGVyZXJDaGFpblBhcmFzLmFsbERhdGFcbiAgICAgIH0pO1xuICAgICAgaW5uZXJJbnNpZGVXcmFwRGl2LmFwcGVuZCgkcmVzb2x2ZWRFbGVtKTtcbiAgICB9XG5cbiAgICBpbm5lcldyYXAuYXBwZW5kKGlubmVySW5zaWRlV3JhcERpdik7XG4gICAgaW5uZXJXcmFwLmFwcGVuZChcIjxkaXYgc3R5bGU9XFxcImNsZWFyOiBib3RoO1xcXCI+PC9kaXY+XCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdENvbXBsZXhTZWFyY2hDb250YWluZXIgPSB7XG4gIFJlbmRlcmVyQ2hhaW46IGZ1bmN0aW9uIFJlbmRlcmVyQ2hhaW4oX3JlbmRlcmVyQ2hhaW5QYXJhcykge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSBfcmVuZGVyZXJDaGFpblBhcmFzLiRzaW5nbGVDb250cm9sRWxlbTtcbiAgICAkc2luZ2xlQ29udHJvbEVsZW0uaGlkZSgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfTGlzdFNpbXBsZVNlYXJjaENvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUNvbnRhaW5lciA9IHtcbiAgUmVuZGVyZXJDaGFpbjogSFRNTENvbnRyb2wuUmVuZGVyZXJDaGFpblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdMRENUX0xpc3RUYWJsZUxhYmVsID0ge1xuICBSZW5kZXJlckNoYWluOiBIVE1MQ29udHJvbC5SZW5kZXJlckNoYWluXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0xEQ1RfU2VhcmNoX1RleHRCb3ggPSB7XG4gIFJlbmRlcmVyQ2hhaW46IEhUTUxDb250cm9sLlJlbmRlcmVyQ2hhaW5cbn07Il19
