/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/011i18n/011i18n.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/011i18n/011i18n.js":
/*!********************************!*\
  !*** ./src/011i18n/011i18n.js ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"jquery\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bpmn-js */ \"bpmn-js\");\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmn_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _customTranslate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./customTranslate */ \"./src/011i18n/customTranslate.js\");\n/* harmony import */ var _newDiagram_bpmn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./newDiagram.bpmn */ \"./src/011i18n/newDiagram.bpmn\");\n\n\n\n\n\n\n\n\n\n// Our custom translation module\n// We need to use the array syntax that is used by bpmn-js internally\n// 'value' tells bmpn-js to use the function instead of trying to instanciate it\nvar customTranslateModule = {\n  translate: [ 'value', _customTranslate__WEBPACK_IMPORTED_MODULE_2__[\"default\"] ]\n};\n\n// Spin up an instance of the modeler that uses our custom translation module\nvar modeler = new bpmn_js__WEBPACK_IMPORTED_MODULE_1___default.a({\n  container: '#canvas',\n  additionalModules: [\n    customTranslateModule\n  ]\n});\n\n// Import our diagram\nmodeler.importXML(_newDiagram_bpmn__WEBPACK_IMPORTED_MODULE_3__[\"default\"], function(err) {\n  if (err) {\n    console.error(err);\n  } else {\n    console.log('Success!');\n  }\n});\n\n\n//# sourceURL=webpack:///./src/011i18n/011i18n.js?");

/***/ }),

/***/ "./src/011i18n/customTranslate.js":
/*!****************************************!*\
  !*** ./src/011i18n/customTranslate.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return customTranslate; });\n/* harmony import */ var _translations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./translations */ \"./src/011i18n/translations.js\");\n\r\n\r\n\r\nfunction customTranslate(template, replacements) {\r\n  replacements = replacements || {};\r\n\r\n  // Translate\r\n  template = _translations__WEBPACK_IMPORTED_MODULE_0__[\"default\"][template] || template;\r\n\r\n  // Replace\r\n  return template.replace(/{([^}]+)}/g, function(_, key) {\r\n    return replacements[key] || '{' + key + '}';\r\n  });\r\n}\n\n//# sourceURL=webpack:///./src/011i18n/customTranslate.js?");

/***/ }),

/***/ "./src/011i18n/newDiagram.bpmn":
/*!*************************************!*\
  !*** ./src/011i18n/newDiagram.bpmn ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n<bpmn2:definitions xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" xmlns:bpmn2=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\\" xmlns:bpmndi=\\\"http://www.omg.org/spec/BPMN/20100524/DI\\\" xmlns:dc=\\\"http://www.omg.org/spec/DD/20100524/DC\\\" xmlns:di=\\\"http://www.omg.org/spec/DD/20100524/DI\\\" xsi:schemaLocation=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\\\" id=\\\"sample-diagram\\\" targetNamespace=\\\"http://bpmn.io/schema/bpmn\\\">\\n  <bpmn2:process id=\\\"Process_1\\\" isExecutable=\\\"false\\\">\\n    <bpmn2:startEvent id=\\\"StartEvent_1\\\"/>\\n  </bpmn2:process>\\n  <bpmndi:BPMNDiagram id=\\\"BPMNDiagram_1\\\">\\n    <bpmndi:BPMNPlane id=\\\"BPMNPlane_1\\\" bpmnElement=\\\"Process_1\\\">\\n      <bpmndi:BPMNShape id=\\\"_BPMNShape_StartEvent_2\\\" bpmnElement=\\\"StartEvent_1\\\">\\n        <dc:Bounds height=\\\"36.0\\\" width=\\\"36.0\\\" x=\\\"412.0\\\" y=\\\"240.0\\\"/>\\n      </bpmndi:BPMNShape>\\n    </bpmndi:BPMNPlane>\\n  </bpmndi:BPMNDiagram>\\n</bpmn2:definitions>\");\n\n//# sourceURL=webpack:///./src/011i18n/newDiagram.bpmn?");

/***/ }),

/***/ "./src/011i18n/translations.js":
/*!*************************************!*\
  !*** ./src/011i18n/translations.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\r\n * This is a sample file that should be replaced with the actual translation.\r\n *\r\n * Checkout https://github.com/bpmn-io/bpmn-js-i18n for a list of available\r\n * translations and labels to translate.\r\n */\r\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\r\n\r\n  // Labels\r\n  'Activate the global connect tool': '启动全局连接工具',\r\n  'Append {type}': '追加 {type}',\r\n  'Add Lane above': '添加到通道之上',\r\n  'Divide into two Lanes': '分成两条通道',\r\n  'Divide into three Lanes': '分成三条通道',\r\n  'Add Lane below': '添加到通道之下',\r\n  'Append compensation activity': '追加补偿活动',\r\n  'Change type': '更改类型',\r\n  'Connect using Association': '文本关联',\r\n  'Connect using Sequence/MessageFlow or Association': '消息关联',\r\n  'Connect using DataInputAssociation': '数据关联',\r\n  'Remove': '移除',\r\n  'Activate the hand tool': '启动手动工具',\r\n  'Activate the lasso tool': '启动 Lasso 工具',\r\n  'Activate the create/remove space tool': '启动创建/删除空间工具',\r\n  'Create expanded SubProcess': '创建可折叠子流程',\r\n  'Create IntermediateThrowEvent/BoundaryEvent': '创建中间抛出/边界事件',\r\n  'Create Pool/Participant': '创建池/参与者',\r\n  'Parallel Multi Instance': '并行多实例',\r\n  'Sequential Multi Instance': '串行多实例',\r\n  'Loop': '循环',\r\n  'Ad-hoc': 'Ad-hoc子流程',\r\n  'Create {type}': '创建 {type}',\r\n  'Task': '任务',\r\n  'Send Task': '发送任务',\r\n  'Receive Task': '接受任务',\r\n  'User Task': '用户任务',\r\n  'Manual Task': '手动任务',\r\n  'Business Rule Task': '规则任务',\r\n  'Service Task': '服务任务',\r\n  'Script Task': '脚本任务',\r\n  'Call Activity': '引用流程',\r\n  'Sub Process (collapsed)': '可折叠子流程',\r\n  'Sub Process (expanded)': '可展开子流程',\r\n  'Start Event': '开始事件',\r\n  'Intermediate Throw Event': '中间抛出事件',\r\n  'End Event': '结束事件',\r\n  'Message Start Event': '消息启动事件',\r\n  'Timer Start Event': '定时启动事件',\r\n  'Conditional Start Event': '条件启动事件',\r\n  'Signal Start Event': '信号启动事件',\r\n  'Error Start Event': '错误启动事件',\r\n  'Escalation Start Event': '升级启动事件',\r\n  'Compensation Start Event': '补偿启动事件',\r\n  'Message Start Event (non-interrupting)': '消息启动事件 (非中断)',\r\n  'Timer Start Event (non-interrupting)': '定时启动事件 (非中断)',\r\n  'Conditional Start Event (non-interrupting)': '条件启动事件 (非中断)',\r\n  'Signal Start Event (non-interrupting)': '信号启动事件 (非中断)',\r\n  'Escalation Start Event (non-interrupting)': '升级启动事件 (非中断)',\r\n  'Message Intermediate Catch Event': '中间消息捕获事件',\r\n  'Message Intermediate Throw Event': '中间消息抛出事件',\r\n  'Timer Intermediate Catch Event': '中间定时捕获事件',\r\n  'Escalation Intermediate Throw Event': '中间升级抛出事件',\r\n  'Conditional Intermediate Catch Event': '中间条件捕获事件',\r\n  'Link Intermediate Catch Event': '中间链接捕获事件',\r\n  'Link Intermediate Throw Event': '中间链接抛出事件',\r\n  'Compensation Intermediate Throw Event': '中间补偿抛出事件',\r\n  'Signal Intermediate Catch Event': '中间信号捕获事件',\r\n  'Signal Intermediate Throw Event': '中间信号抛出事件',\r\n  'Message End Event': '结束消息事件',\r\n  'Escalation End Event': '结束升级事件',\r\n  'Error End Event': '结束错误事件',\r\n  'Cancel End Event': '结束取消事件',\r\n  'Compensation End Event': '结束补偿事件',\r\n  'Signal End Event': '结束信号事件',\r\n  'Terminate End Event': '终止边界事件',\r\n  'Message Boundary Event': '消息边界事件',\r\n  'Message Boundary Event (non-interrupting)': '消息边界事件 (非中断)',\r\n  'Timer Boundary Event': '定时边界事件',\r\n  'Timer Boundary Event (non-interrupting)': '定时边界事件 (非中断)',\r\n  'Escalation Boundary Event': '升级边界事件',\r\n  'Escalation Boundary Event (non-interrupting)': '升级边界事件 (非中断)',\r\n  'Conditional Boundary Event': '条件边界事件',\r\n  'Conditional Boundary Event (non-interrupting)': '条件边界事件 (非中断)',\r\n  'Error Boundary Event': '错误边界事件',\r\n  'Cancel Boundary Event': '取消边界事件',\r\n  'Signal Boundary Event': '信号边界事件',\r\n  'Signal Boundary Event (non-interrupting)': '信号边界事件 (非中断)',\r\n  'Compensation Boundary Event': '补偿边界事件',\r\n  'Exclusive Gateway': '独占网关',\r\n  'Parallel Gateway': '并行网关',\r\n  'Inclusive Gateway': '包容网关',\r\n  'Complex Gateway': '复杂网关',\r\n  'Event based Gateway': '事件网关',\r\n  'Transaction': '事务',\r\n  'Sub Process': '子流程',\r\n  'Event Sub Process': '事件子流程',\r\n  'Collapsed Pool': '折叠池',\r\n  'Expanded Pool': '展开池',\r\n\r\n  // Errors\r\n  'no parent for {element} in {parent}': '在 {element} 中没有父元素 {parent}',\r\n  'no shape type specified': '未指定形状类型',\r\n  'flow elements must be children of pools/participants': '元素必须是池/参与者的子级',\r\n  'out of bounds release': '越界释放',\r\n  'more than {count} child lanes': '超过 {count} 条通道',\r\n  'element required': '需要元素',\r\n  'diagram not part of bpmn:Definitions': '图表不是 bpmn:Definitions 的一部分',\r\n  'no diagram to display': '没有要显示的图表',\r\n  'no process or collaboration to display': '没有可显示的流程或协作',\r\n  'element {element} referenced by {referenced}#{property} not yet drawn': '元素 {element} 的引用 {referenced}#{property} 尚未绘制',\r\n  'already rendered {element}': '{element} 已呈现',\r\n  'failed to import {element}': '{element} 导入失败'\r\n});\n\n//# sourceURL=webpack:///./src/011i18n/translations.js?");

/***/ }),

/***/ "bpmn-js":
/*!*************************!*\
  !*** external "BpmnJS" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = BpmnJS;\n\n//# sourceURL=webpack:///external_%22BpmnJS%22?");

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = jQuery;\n\n//# sourceURL=webpack:///external_%22jQuery%22?");

/***/ })

/******/ });