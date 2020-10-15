"use strict";

/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */
CKEDITOR.editorConfig = function (config) {
  config.toolbarGroups = [{
    name: 'clipboard',
    groups: ['clipboard', 'undo']
  }, {
    name: 'editing',
    groups: ['find', 'selection', 'spellchecker']
  }, {
    name: 'links'
  }, {
    name: 'insert'
  }, {
    name: 'forms'
  }, {
    name: 'tools'
  }, {
    name: 'document',
    groups: ['mode', 'document', 'doctools']
  }, {
    name: 'others'
  }, '/', {
    name: 'basicstyles',
    groups: ['basicstyles', 'cleanup']
  }, {
    name: 'paragraph',
    groups: ['list', 'indent', 'blocks', 'align', 'bidi']
  }, {
    name: 'styles'
  }, {
    name: 'colors'
  }, {
    name: 'about'
  }];
  config.removeButtons = 'Underline,Subscript,Superscript';
  config.format_tags = 'p;h1;h2;h3;pre';
  config.removeDialogTabs = 'image:advanced;link:advanced';
  var objId = "";

  if (formRuntimeInst && formRuntimeInst.GetWebFormRTParas() && formRuntimeInst.GetWebFormRTParas().RecordId) {
    objId = formRuntimeInst.GetWebFormRTParas().RecordId;
  }

  config.filebrowserImageUploadUrl = BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/FileRuntime/UploadCKE4Image?UploadType=CkE4Image&ObjId=" + objId;
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2wvV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfQ0tFZGl0b3I0X0RlZl9Db25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJXRkRDVF9DS0VkaXRvcjRfRGVmX0NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vKipcclxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjAsIENLU291cmNlIC0gRnJlZGVyaWNvIEtuYWJiZW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBodHRwczovL2NrZWRpdG9yLmNvbS9sZWdhbC9ja2VkaXRvci1vc3MtbGljZW5zZVxyXG4gKi9cbkNLRURJVE9SLmVkaXRvckNvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgY29uZmlnLnRvb2xiYXJHcm91cHMgPSBbe1xuICAgIG5hbWU6ICdjbGlwYm9hcmQnLFxuICAgIGdyb3VwczogWydjbGlwYm9hcmQnLCAndW5kbyddXG4gIH0sIHtcbiAgICBuYW1lOiAnZWRpdGluZycsXG4gICAgZ3JvdXBzOiBbJ2ZpbmQnLCAnc2VsZWN0aW9uJywgJ3NwZWxsY2hlY2tlciddXG4gIH0sIHtcbiAgICBuYW1lOiAnbGlua3MnXG4gIH0sIHtcbiAgICBuYW1lOiAnaW5zZXJ0J1xuICB9LCB7XG4gICAgbmFtZTogJ2Zvcm1zJ1xuICB9LCB7XG4gICAgbmFtZTogJ3Rvb2xzJ1xuICB9LCB7XG4gICAgbmFtZTogJ2RvY3VtZW50JyxcbiAgICBncm91cHM6IFsnbW9kZScsICdkb2N1bWVudCcsICdkb2N0b29scyddXG4gIH0sIHtcbiAgICBuYW1lOiAnb3RoZXJzJ1xuICB9LCAnLycsIHtcbiAgICBuYW1lOiAnYmFzaWNzdHlsZXMnLFxuICAgIGdyb3VwczogWydiYXNpY3N0eWxlcycsICdjbGVhbnVwJ11cbiAgfSwge1xuICAgIG5hbWU6ICdwYXJhZ3JhcGgnLFxuICAgIGdyb3VwczogWydsaXN0JywgJ2luZGVudCcsICdibG9ja3MnLCAnYWxpZ24nLCAnYmlkaSddXG4gIH0sIHtcbiAgICBuYW1lOiAnc3R5bGVzJ1xuICB9LCB7XG4gICAgbmFtZTogJ2NvbG9ycydcbiAgfSwge1xuICAgIG5hbWU6ICdhYm91dCdcbiAgfV07XG4gIGNvbmZpZy5yZW1vdmVCdXR0b25zID0gJ1VuZGVybGluZSxTdWJzY3JpcHQsU3VwZXJzY3JpcHQnO1xuICBjb25maWcuZm9ybWF0X3RhZ3MgPSAncDtoMTtoMjtoMztwcmUnO1xuICBjb25maWcucmVtb3ZlRGlhbG9nVGFicyA9ICdpbWFnZTphZHZhbmNlZDtsaW5rOmFkdmFuY2VkJztcbiAgdmFyIG9iaklkID0gXCJcIjtcblxuICBpZiAoZm9ybVJ1bnRpbWVJbnN0ICYmIGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpICYmIGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpLlJlY29yZElkKSB7XG4gICAgb2JqSWQgPSBmb3JtUnVudGltZUluc3QuR2V0V2ViRm9ybVJUUGFyYXMoKS5SZWNvcmRJZDtcbiAgfVxuXG4gIGNvbmZpZy5maWxlYnJvd3NlckltYWdlVXBsb2FkVXJsID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0ZpbGVSdW50aW1lL1VwbG9hZENLRTRJbWFnZT9VcGxvYWRUeXBlPUNrRTRJbWFnZSZPYmpJZD1cIiArIG9iaklkO1xufTsiXX0=
