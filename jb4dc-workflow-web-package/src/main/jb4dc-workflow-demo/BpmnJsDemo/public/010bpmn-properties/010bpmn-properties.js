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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/010bpmn-properties/010bpmnProperties.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/010bpmn-properties/010bpmnProperties.js":
/*!*****************************************************!*\
  !*** ./src/010bpmn-properties/010bpmnProperties.js ***!
  \*****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"jquery\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bpmn-js */ \"bpmn-js\");\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmn_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _newDiagram_bpmn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./newDiagram.bpmn */ \"./src/010bpmn-properties/newDiagram.bpmn\");\n\r\n\r\n\r\n\r\n\r\n\r\nvar bpmnModeler = new bpmn_js__WEBPACK_IMPORTED_MODULE_1___default.a({\r\n    container: '#canvas',\r\n});\r\n\r\nbpmnModeler.importXML(_newDiagram_bpmn__WEBPACK_IMPORTED_MODULE_2__[\"default\"], function(err) {\r\n    if (err) {\r\n        console.error(err);\r\n    } else {\r\n        var elementRegistry = bpmnModeler.get('elementRegistry');\r\n\r\n        var StartEvent_1 = elementRegistry.get('StartEvent_1');\r\n        console.log(StartEvent_1);\r\n\r\n        var sequenceFlowElement = elementRegistry.get('SequenceFlow_1');\r\n        var sequenceFlow = sequenceFlowElement.businessObject;\r\n\r\n        console.log(sequenceFlowElement);\r\n        console.log(sequenceFlow);\r\n\r\n        var moddle = bpmnModeler.get('moddle');\r\n        var newCondition = moddle.create('bpmn:FormalExpression', {\r\n            body: '${ value > 100 }'\r\n        });\r\n        sequenceFlow.conditionExpression = newCondition;\r\n        sequenceFlow.name=\"你好啊!\"\r\n\r\n        var modeling = bpmnModeler.get('modeling');\r\n\r\n        modeling.updateProperties(sequenceFlowElement, {\r\n            conditionExpression: newCondition\r\n        });\r\n    }\r\n});\n\n//# sourceURL=webpack:///./src/010bpmn-properties/010bpmnProperties.js?");

/***/ }),

/***/ "./src/010bpmn-properties/newDiagram.bpmn":
/*!************************************************!*\
  !*** ./src/010bpmn-properties/newDiagram.bpmn ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n<bpmn:definitions xmlns:bpmn=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\\" xmlns:bpmndi=\\\"http://www.omg.org/spec/BPMN/20100524/DI\\\" xmlns:di=\\\"http://www.omg.org/spec/DD/20100524/DI\\\" xmlns:dc=\\\"http://www.omg.org/spec/DD/20100524/DC\\\" xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" xmlns:vendor=\\\"http://vendor\\\" id=\\\"Definitions_1\\\" targetNamespace=\\\"http://bpmn.io/schema/bpmn\\\">\\n  <bpmn:process id=\\\"Process_1\\\" isExecutable=\\\"false\\\">\\n    <bpmn:startEvent id=\\\"StartEvent_1\\\">\\n      <bpmn:outgoing>SequenceFlow_1</bpmn:outgoing>\\n    </bpmn:startEvent>\\n    <bpmn:task id=\\\"Task_1\\\">\\n      <bpmn:incoming>SequenceFlow_1</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_2</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1\\\" sourceRef=\\\"StartEvent_1\\\" targetRef=\\\"Task_1\\\" name=\\\"FOO &gt; BAR?\\\">\\n      <bpmn:conditionExpression xsi:type=\\\"bpmn:tFormalExpression\\\"><![CDATA[${foo > bar1}]]></bpmn:conditionExpression>\\n    </bpmn:sequenceFlow>\\n    <bpmn:endEvent id=\\\"EndEvent_1\\\">\\n      <bpmn:incoming>SequenceFlow_2</bpmn:incoming>\\n    </bpmn:endEvent>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_2\\\" sourceRef=\\\"Task_1\\\" targetRef=\\\"EndEvent_1\\\" />\\n  </bpmn:process>\\n  <bpmndi:BPMNDiagram id=\\\"BPMNDiagram_1\\\">\\n    <bpmndi:BPMNPlane id=\\\"BPMNPlane_1\\\" bpmnElement=\\\"Process_1\\\">\\n      <bpmndi:BPMNShape id=\\\"_BPMNShape_StartEvent_2\\\" bpmnElement=\\\"StartEvent_1\\\">\\n        <dc:Bounds x=\\\"173\\\" y=\\\"102\\\" width=\\\"36\\\" height=\\\"36\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1_di\\\" bpmnElement=\\\"Task_1\\\">\\n        <dc:Bounds x=\\\"319\\\" y=\\\"80\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1_di\\\" bpmnElement=\\\"SequenceFlow_1\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"209\\\" y=\\\"120\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"319\\\" y=\\\"120\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"219\\\" y=\\\"110\\\" width=\\\"90\\\" height=\\\"20\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"EndEvent_1_di\\\" bpmnElement=\\\"EndEvent_1\\\">\\n        <dc:Bounds x=\\\"531\\\" y=\\\"102\\\" width=\\\"36\\\" height=\\\"36\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"504\\\" y=\\\"138\\\" width=\\\"90\\\" height=\\\"20\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_2_di\\\" bpmnElement=\\\"SequenceFlow_2\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"419\\\" y=\\\"120\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"531\\\" y=\\\"120\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"430\\\" y=\\\"110\\\" width=\\\"90\\\" height=\\\"20\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n    </bpmndi:BPMNPlane>\\n  </bpmndi:BPMNDiagram>\\n</bpmn:definitions>\\n\");\n\n//# sourceURL=webpack:///./src/010bpmn-properties/newDiagram.bpmn?");

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