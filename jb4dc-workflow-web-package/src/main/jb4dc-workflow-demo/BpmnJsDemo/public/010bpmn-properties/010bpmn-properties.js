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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"jquery\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bpmn-js */ \"bpmn-js\");\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmn_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _qr_code_bpmn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./qr-code.bpmn */ \"./src/010bpmn-properties/qr-code.bpmn\");\n\r\n\r\n\r\n\r\n\r\n\r\nvar bpmnModeler = new bpmn_js__WEBPACK_IMPORTED_MODULE_1___default.a({\r\n    container: '#canvas',\r\n});\r\n\r\nbpmnModeler.importXML(_qr_code_bpmn__WEBPACK_IMPORTED_MODULE_2__[\"default\"], function(err) {\r\n    if (err) {\r\n        console.error(err);\r\n    } else {\r\n        var elementRegistry = bpmnJS.get('elementRegistry');\r\n        var sequenceFlowElement = elementRegistry.get('SequenceFlow_1');\r\n        var sequenceFlow = sequenceFlowElement.businessObject;\r\n    }\r\n});\n\n//# sourceURL=webpack:///./src/010bpmn-properties/010bpmnProperties.js?");

/***/ }),

/***/ "./src/010bpmn-properties/qr-code.bpmn":
/*!*********************************************!*\
  !*** ./src/010bpmn-properties/qr-code.bpmn ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n<definitions xmlns=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\\"\\n             xmlns:bpmndi=\\\"http://www.omg.org/spec/BPMN/20100524/DI\\\"\\n             xmlns:omgdc=\\\"http://www.omg.org/spec/DD/20100524/DC\\\"\\n             xmlns:omgdi=\\\"http://www.omg.org/spec/DD/20100524/DI\\\"\\n             xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\"\\n             expressionLanguage=\\\"http://www.w3.org/1999/XPath\\\"\\n             typeLanguage=\\\"http://www.w3.org/2001/XMLSchema\\\"\\n             targetNamespace=\\\"\\\"\\n             xsi:schemaLocation=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd\\\">\\n<collaboration id=\\\"sid-c0e745ff-361e-4afb-8c8d-2a1fc32b1424\\\">\\n    <participant id=\\\"sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F\\\" name=\\\"Customer\\\" processRef=\\\"sid-C3803939-0872-457F-8336-EAE484DC4A04\\\">\\n    </participant>\\n</collaboration>\\n<process id=\\\"sid-C3803939-0872-457F-8336-EAE484DC4A04\\\" isClosed=\\\"false\\\" isExecutable=\\\"false\\\" name=\\\"Customer\\\" processType=\\\"None\\\">\\n    <extensionElements/>\\n    <laneSet id=\\\"sid-b167d0d7-e761-4636-9200-76b7f0e8e83a\\\">\\n        <lane id=\\\"sid-57E4FE0D-18E4-478D-BC5D-B15164E93254\\\">\\n            <flowNodeRef>START_PROCESS</flowNodeRef>\\n            <flowNodeRef>SCAN_QR_CODE</flowNodeRef>\\n            <flowNodeRef>SCAN_OK</flowNodeRef>\\n            <flowNodeRef>sid-E49425CF-8287-4798-B622-D2A7D78EF00B</flowNodeRef>\\n            <flowNodeRef>END_PROCESS</flowNodeRef>\\n            <flowNodeRef>sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9</flowNodeRef>\\n        </lane>\\n    </laneSet>\\n    <startEvent id=\\\"START_PROCESS\\\" name=\\\"Notices&#10;QR code\\\">\\n        <outgoing>sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD</outgoing>\\n    </startEvent>\\n    <task completionQuantity=\\\"1\\\" id=\\\"SCAN_QR_CODE\\\" isForCompensation=\\\"false\\\" name=\\\"Scan QR code\\\" startQuantity=\\\"1\\\">\\n        <incoming>sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D</incoming>\\n        <outgoing>sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A</outgoing>\\n    </task>\\n    <exclusiveGateway gatewayDirection=\\\"Diverging\\\" id=\\\"SCAN_OK\\\" name=\\\"Scan successful?&#10;\\\">\\n        <incoming>sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A</incoming>\\n        <outgoing>sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB</outgoing>\\n        <outgoing>sid-337A23B9-A923-4CCE-B613-3E247B773CCE</outgoing>\\n    </exclusiveGateway>\\n    <task completionQuantity=\\\"1\\\" id=\\\"sid-E49425CF-8287-4798-B622-D2A7D78EF00B\\\" isForCompensation=\\\"false\\\" name=\\\"Open product information in mobile  app\\\" startQuantity=\\\"1\\\">\\n        <incoming>sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB</incoming>\\n        <outgoing>sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C</outgoing>\\n    </task>\\n    <endEvent id=\\\"END_PROCESS\\\" name=\\\"Is informed\\\">\\n        <incoming>sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C</incoming>\\n    </endEvent>\\n    <exclusiveGateway gatewayDirection=\\\"Converging\\\" id=\\\"sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9\\\">\\n        <incoming>sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD</incoming>\\n        <incoming>sid-337A23B9-A923-4CCE-B613-3E247B773CCE</incoming>\\n        <outgoing>sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D</outgoing>\\n    </exclusiveGateway>\\n    <sequenceFlow id=\\\"sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD\\\" sourceRef=\\\"START_PROCESS\\\" targetRef=\\\"sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9\\\"/>\\n    <sequenceFlow id=\\\"sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A\\\" sourceRef=\\\"SCAN_QR_CODE\\\" targetRef=\\\"SCAN_OK\\\"/>\\n    <sequenceFlow id=\\\"sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C\\\" sourceRef=\\\"sid-E49425CF-8287-4798-B622-D2A7D78EF00B\\\" targetRef=\\\"END_PROCESS\\\"/>\\n    <sequenceFlow id=\\\"sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB\\\" name=\\\"No\\\" sourceRef=\\\"SCAN_OK\\\" targetRef=\\\"sid-E49425CF-8287-4798-B622-D2A7D78EF00B\\\"/>\\n    <sequenceFlow id=\\\"sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D\\\" sourceRef=\\\"sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9\\\" targetRef=\\\"SCAN_QR_CODE\\\"/>\\n    <sequenceFlow id=\\\"sid-337A23B9-A923-4CCE-B613-3E247B773CCE\\\" name=\\\"Yes\\\" sourceRef=\\\"SCAN_OK\\\" targetRef=\\\"sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9\\\"/>\\n</process>\\n<bpmndi:BPMNDiagram id=\\\"sid-74620812-92c4-44e5-949c-aa47393d3830\\\">\\n    <bpmndi:BPMNPlane bpmnElement=\\\"sid-c0e745ff-361e-4afb-8c8d-2a1fc32b1424\\\" id=\\\"sid-cdcae759-2af7-4a6d-bd02-53f3352a731d\\\">\\n        <bpmndi:BPMNShape bpmnElement=\\\"sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F\\\" id=\\\"sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F_gui\\\" isHorizontal=\\\"true\\\">\\n            <omgdc:Bounds height=\\\"250.0\\\" width=\\\"933.0\\\" x=\\\"42.5\\\" y=\\\"75.0\\\"/>\\n            <bpmndi:BPMNLabel labelStyle=\\\"sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b\\\">\\n                <omgdc:Bounds height=\\\"59.142852783203125\\\" width=\\\"12.000000000000014\\\" x=\\\"47.49999999999999\\\" y=\\\"170.42857360839844\\\"/>\\n            </bpmndi:BPMNLabel>\\n        </bpmndi:BPMNShape>\\n        <bpmndi:BPMNShape bpmnElement=\\\"sid-57E4FE0D-18E4-478D-BC5D-B15164E93254\\\" id=\\\"sid-57E4FE0D-18E4-478D-BC5D-B15164E93254_gui\\\" isHorizontal=\\\"true\\\">\\n            <omgdc:Bounds height=\\\"250.0\\\" width=\\\"903.0\\\" x=\\\"72.5\\\" y=\\\"75.0\\\"/>\\n        </bpmndi:BPMNShape>\\n        <bpmndi:BPMNShape bpmnElement=\\\"START_PROCESS\\\" id=\\\"START_PROCESS_gui\\\">\\n            <omgdc:Bounds height=\\\"30.0\\\" width=\\\"30.0\\\" x=\\\"150.0\\\" y=\\\"165.0\\\"/>\\n            <bpmndi:BPMNLabel labelStyle=\\\"sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581\\\">\\n                <omgdc:Bounds height=\\\"22.0\\\" width=\\\"46.35714340209961\\\" x=\\\"141.8214282989502\\\" y=\\\"197.0\\\"/>\\n            </bpmndi:BPMNLabel>\\n        </bpmndi:BPMNShape>\\n        <bpmndi:BPMNShape bpmnElement=\\\"SCAN_QR_CODE\\\" id=\\\"SCAN_QR_CODE_gui\\\">\\n            <omgdc:Bounds height=\\\"80.0\\\" width=\\\"100.0\\\" x=\\\"352.5\\\" y=\\\"140.0\\\"/>\\n            <bpmndi:BPMNLabel labelStyle=\\\"sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b\\\">\\n                <omgdc:Bounds height=\\\"12.0\\\" width=\\\"84.0\\\" x=\\\"360.5\\\" y=\\\"172.0\\\"/>\\n            </bpmndi:BPMNLabel>\\n        </bpmndi:BPMNShape>\\n        <bpmndi:BPMNShape bpmnElement=\\\"SCAN_OK\\\" id=\\\"SCAN_OK_gui\\\" isMarkerVisible=\\\"true\\\">\\n            <omgdc:Bounds height=\\\"40.0\\\" width=\\\"40.0\\\" x=\\\"550.0\\\" y=\\\"160.0\\\"/>\\n            <bpmndi:BPMNLabel labelStyle=\\\"sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581\\\">\\n                <omgdc:Bounds height=\\\"12.0\\\" width=\\\"102.0\\\" x=\\\"521.0\\\" y=\\\"127.0\\\"/>\\n            </bpmndi:BPMNLabel>\\n        </bpmndi:BPMNShape>\\n        <bpmndi:BPMNShape bpmnElement=\\\"sid-E49425CF-8287-4798-B622-D2A7D78EF00B\\\" id=\\\"sid-E49425CF-8287-4798-B622-D2A7D78EF00B_gui\\\">\\n            <omgdc:Bounds height=\\\"80.0\\\" width=\\\"100.0\\\" x=\\\"687.5\\\" y=\\\"140.0\\\"/>\\n            <bpmndi:BPMNLabel labelStyle=\\\"sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b\\\">\\n                <omgdc:Bounds height=\\\"36.0\\\" width=\\\"83.14285278320312\\\" x=\\\"695.9285736083984\\\" y=\\\"162.0\\\"/>\\n            </bpmndi:BPMNLabel>\\n        </bpmndi:BPMNShape>\\n        <bpmndi:BPMNShape bpmnElement=\\\"END_PROCESS\\\" id=\\\"END_PROCESS_gui\\\">\\n            <omgdc:Bounds height=\\\"28.0\\\" width=\\\"28.0\\\" x=\\\"865.0\\\" y=\\\"166.0\\\"/>\\n            <bpmndi:BPMNLabel labelStyle=\\\"sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581\\\">\\n                <omgdc:Bounds height=\\\"11.0\\\" width=\\\"62.857147216796875\\\" x=\\\"847.5714263916016\\\" y=\\\"196.0\\\"/>\\n            </bpmndi:BPMNLabel>\\n        </bpmndi:BPMNShape>\\n        <bpmndi:BPMNShape bpmnElement=\\\"sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9\\\" id=\\\"sid-5134932A-1863-4FFA-BB3C-A4B4078B11A9_gui\\\" isMarkerVisible=\\\"true\\\">\\n            <omgdc:Bounds height=\\\"40.0\\\" width=\\\"40.0\\\" x=\\\"240.0\\\" y=\\\"160.0\\\"/>\\n        </bpmndi:BPMNShape>\\n        <bpmndi:BPMNEdge bpmnElement=\\\"sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A\\\" id=\\\"sid-EE8A7BA0-5D66-4F8B-80E3-CC2751B3856A_gui\\\">\\n            <omgdi:waypoint x=\\\"452.5\\\" y=\\\"180\\\"/>\\n            <omgdi:waypoint x=\\\"550.0\\\" y=\\\"180\\\"/>\\n        </bpmndi:BPMNEdge>\\n        <bpmndi:BPMNEdge bpmnElement=\\\"sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB\\\" id=\\\"sid-8B820AF5-DC5C-4618-B854-E08B71FB55CB_gui\\\">\\n            <omgdi:waypoint x=\\\"590.0\\\" y=\\\"180\\\"/>\\n            <omgdi:waypoint x=\\\"687.5\\\" y=\\\"180\\\"/>\\n            <bpmndi:BPMNLabel labelStyle=\\\"sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581\\\">\\n                <omgdc:Bounds height=\\\"12.048704338048935\\\" width=\\\"16.32155963195521\\\" x=\\\"597.8850936986571\\\" y=\\\"155\\\"/>\\n            </bpmndi:BPMNLabel>\\n        </bpmndi:BPMNEdge>\\n        <bpmndi:BPMNEdge bpmnElement=\\\"sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD\\\" id=\\\"sid-7B791A11-2F2E-4D80-AFB3-91A02CF2B4FD_gui\\\">\\n            <omgdi:waypoint x=\\\"180.0\\\" y=\\\"180\\\"/>\\n            <omgdi:waypoint x=\\\"240.0\\\" y=\\\"180\\\"/>\\n        </bpmndi:BPMNEdge>\\n        <bpmndi:BPMNEdge bpmnElement=\\\"sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D\\\" id=\\\"sid-4DC479E5-5C20-4948-BCFC-9EC5E2F66D8D_gui\\\">\\n            <omgdi:waypoint x=\\\"280.0\\\" y=\\\"180\\\"/>\\n            <omgdi:waypoint x=\\\"352.5\\\" y=\\\"180\\\"/>\\n        </bpmndi:BPMNEdge>\\n        <bpmndi:BPMNEdge bpmnElement=\\\"sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C\\\" id=\\\"sid-57EB1F24-BD94-479A-BF1F-57F1EAA19C6C_gui\\\">\\n            <omgdi:waypoint x=\\\"787.5\\\" y=\\\"180.0\\\"/>\\n            <omgdi:waypoint x=\\\"865.0\\\" y=\\\"180.0\\\"/>\\n        </bpmndi:BPMNEdge>\\n        <bpmndi:BPMNEdge bpmnElement=\\\"sid-337A23B9-A923-4CCE-B613-3E247B773CCE\\\" id=\\\"sid-337A23B9-A923-4CCE-B613-3E247B773CCE_gui\\\">\\n            <omgdi:waypoint x=\\\"570.5\\\" y=\\\"200.0\\\"/>\\n            <omgdi:waypoint x=\\\"570.5\\\" y=\\\"269.0\\\"/>\\n            <omgdi:waypoint x=\\\"260.5\\\" y=\\\"269.0\\\"/>\\n            <omgdi:waypoint x=\\\"260.5\\\" y=\\\"200.0\\\"/>\\n            <bpmndi:BPMNLabel labelStyle=\\\"sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581\\\">\\n                <omgdc:Bounds height=\\\"21.4285888671875\\\" width=\\\"12.0\\\" x=\\\"550\\\" y=\\\"205\\\"/>\\n            </bpmndi:BPMNLabel>\\n        </bpmndi:BPMNEdge>\\n    </bpmndi:BPMNPlane>\\n    <bpmndi:BPMNLabelStyle id=\\\"sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581\\\">\\n        <omgdc:Font isBold=\\\"false\\\" isItalic=\\\"false\\\" isStrikeThrough=\\\"false\\\" isUnderline=\\\"false\\\" name=\\\"Arial\\\" size=\\\"11.0\\\"/>\\n    </bpmndi:BPMNLabelStyle>\\n    <bpmndi:BPMNLabelStyle id=\\\"sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b\\\">\\n        <omgdc:Font isBold=\\\"false\\\" isItalic=\\\"false\\\" isStrikeThrough=\\\"false\\\" isUnderline=\\\"false\\\" name=\\\"Arial\\\" size=\\\"12.0\\\"/>\\n    </bpmndi:BPMNLabelStyle>\\n</bpmndi:BPMNDiagram>\\n</definitions>\\n\\n\");\n\n//# sourceURL=webpack:///./src/010bpmn-properties/qr-code.bpmn?");

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