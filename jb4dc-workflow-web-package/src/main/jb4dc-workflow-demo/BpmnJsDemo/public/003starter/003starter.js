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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/003starter/003starter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/003starter/003starter.js":
/*!**************************************!*\
  !*** ./src/003starter/003starter.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jQuery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jQuery */ \"jQuery\");\n/* harmony import */ var jQuery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jQuery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bpmn-js */ \"bpmn-js\");\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmn_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _bpmn03_44_bpmn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bpmn03-44.bpmn */ \"./src/003starter/bpmn03-44.bpmn\");\n\r\n\r\n\r\n\r\n//var diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';\r\n\r\n// modeler instance\r\nvar bpmnModeler = new bpmn_js__WEBPACK_IMPORTED_MODULE_1___default.a({\r\n    container: '#canvas',\r\n    keyboard: {\r\n        bindTo: window\r\n    }\r\n});\r\n\r\n/**\r\n * Save diagram contents and print them to the console.\r\n */\r\nfunction exportDiagram() {\r\n\r\n    bpmnModeler.saveXML({ format: true }, function(err, xml) {\r\n\r\n        if (err) {\r\n            return console.error('could not save BPMN 2.0 diagram', err);\r\n        }\r\n\r\n        alert('Diagram exported. Check the developer tools!');\r\n\r\n        console.log('DIAGRAM', xml);\r\n    });\r\n}\r\n\r\n/**\r\n * Open diagram in our modeler instance.\r\n *\r\n * @param {String} bpmnXML diagram to display\r\n */\r\nfunction openDiagram(pizzaDiagram) {\r\n\r\n    // import diagram\r\n    bpmnModeler.importXML(pizzaDiagram, function(err) {\r\n\r\n        if (err) {\r\n            return console.error('could not import BPMN 2.0 diagram', err);\r\n        }\r\n\r\n        // access modeler components\r\n        var canvas = bpmnModeler.get('canvas');\r\n        var overlays = bpmnModeler.get('overlays');\r\n\r\n\r\n        // zoom to fit full viewport\r\n        canvas.zoom('fit-viewport');\r\n\r\n        // attach an overlay to a node\r\n        overlays.add('SCAN_OK', 'note', {\r\n            position: {\r\n                bottom: 0,\r\n                right: 0\r\n            },\r\n            html: '<div class=\"diagram-note\">Mixed up the labels?</div>'\r\n        });\r\n\r\n        // add marker\r\n        canvas.addMarker('SCAN_OK', 'needs-discussion');\r\n    });\r\n}\r\n\r\n\r\nopenDiagram(_bpmn03_44_bpmn__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\r\n\r\n// wire save button\r\njQuery__WEBPACK_IMPORTED_MODULE_0___default()('#save-button').click(exportDiagram);\n\n//# sourceURL=webpack:///./src/003starter/003starter.js?");

/***/ }),

/***/ "./src/003starter/bpmn03-44.bpmn":
/*!***************************************!*\
  !*** ./src/003starter/bpmn03-44.bpmn ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\r\\n<definitions xmlns=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\\" xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" xmlns:xsd=\\\"http://www.w3.org/2001/XMLSchema\\\" xmlns:activiti=\\\"http://activiti.org/bpmn\\\" xmlns:bpmndi=\\\"http://www.omg.org/spec/BPMN/20100524/DI\\\" xmlns:omgdc=\\\"http://www.omg.org/spec/DD/20100524/DC\\\" xmlns:omgdi=\\\"http://www.omg.org/spec/DD/20100524/DI\\\" typeLanguage=\\\"http://www.w3.org/2001/XMLSchema\\\" expressionLanguage=\\\"http://www.w3.org/1999/XPath\\\" targetNamespace=\\\"http://www.activiti.org/test\\\">\\r\\n  <collaboration id=\\\"Collaboration\\\">\\r\\n    <participant id=\\\"pool1\\\" name=\\\"请假流程\\\" processRef=\\\"bpmn03-44\\\"></participant>\\r\\n  </collaboration>\\r\\n  <process id=\\\"bpmn03-44\\\" name=\\\"bpmn03-44\\\" isExecutable=\\\"true\\\">\\r\\n    <laneSet id=\\\"laneSet_bpmn03-44\\\">\\r\\n      <lane id=\\\"lane1\\\" name=\\\"员工\\\">\\r\\n        <flowNodeRef>startevent1</flowNodeRef>\\r\\n        <flowNodeRef>usertask2</flowNodeRef>\\r\\n        <flowNodeRef>usertask4</flowNodeRef>\\r\\n        <flowNodeRef>endevent1</flowNodeRef>\\r\\n      </lane>\\r\\n      <lane id=\\\"lane2\\\" name=\\\"领导\\\">\\r\\n        <flowNodeRef>usertask1</flowNodeRef>\\r\\n        <flowNodeRef>exclusivegateway1</flowNodeRef>\\r\\n      </lane>\\r\\n      <lane id=\\\"lane3\\\" name=\\\"人事\\\">\\r\\n        <flowNodeRef>usertask3</flowNodeRef>\\r\\n        <flowNodeRef>exclusivegateway2</flowNodeRef>\\r\\n      </lane>\\r\\n    </laneSet>\\r\\n    <startEvent id=\\\"startevent1\\\" name=\\\"Start\\\" activiti:initiator=\\\"startUserId\\\"></startEvent>\\r\\n    <sequenceFlow id=\\\"flow1\\\" sourceRef=\\\"startevent1\\\" targetRef=\\\"usertask1\\\"></sequenceFlow>\\r\\n    <userTask id=\\\"usertask1\\\" name=\\\"部门领导审批\\\" activiti:candidateGroups=\\\"leader\\\"></userTask>\\r\\n    <exclusiveGateway id=\\\"exclusivegateway1\\\" name=\\\"Exclusive Gateway\\\"></exclusiveGateway>\\r\\n    <sequenceFlow id=\\\"flow2\\\" sourceRef=\\\"usertask1\\\" targetRef=\\\"exclusivegateway1\\\"></sequenceFlow>\\r\\n    <sequenceFlow id=\\\"leader_refuse\\\" name=\\\"不同意\\\" sourceRef=\\\"exclusivegateway1\\\" targetRef=\\\"usertask2\\\">\\r\\n      <conditionExpression xsi:type=\\\"tFormalExpression\\\"><![CDATA[${leader_comm==\\\"refuse\\\"}]]></conditionExpression>\\r\\n    </sequenceFlow>\\r\\n    <userTask id=\\\"usertask2\\\" name=\\\"调整\\\" activiti:candidateGroups=\\\"self\\\"></userTask>\\r\\n    <sequenceFlow id=\\\"leader_pass\\\" name=\\\"同意\\\" sourceRef=\\\"exclusivegateway1\\\" targetRef=\\\"usertask3\\\">\\r\\n      <conditionExpression xsi:type=\\\"tFormalExpression\\\"><![CDATA[${leader_comm==\\\"pass\\\"}]]></conditionExpression>\\r\\n    </sequenceFlow>\\r\\n    <userTask id=\\\"usertask3\\\" name=\\\"人事审批\\\" activiti:candidateGroups=\\\"hr\\\"></userTask>\\r\\n    <exclusiveGateway id=\\\"exclusivegateway2\\\" name=\\\"Exclusive Gateway\\\"></exclusiveGateway>\\r\\n    <sequenceFlow id=\\\"flow5\\\" sourceRef=\\\"usertask3\\\" targetRef=\\\"exclusivegateway2\\\"></sequenceFlow>\\r\\n    <sequenceFlow id=\\\"hr_refuse\\\" name=\\\"不同意\\\" sourceRef=\\\"exclusivegateway2\\\" targetRef=\\\"usertask2\\\">\\r\\n      <conditionExpression xsi:type=\\\"tFormalExpression\\\"><![CDATA[${hr_comm==\\\"refuse\\\"}]]></conditionExpression>\\r\\n    </sequenceFlow>\\r\\n    <userTask id=\\\"usertask4\\\" name=\\\"销假\\\" activiti:candidateGroups=\\\"self\\\"></userTask>\\r\\n    <sequenceFlow id=\\\"hr_ok\\\" name=\\\"同意\\\" sourceRef=\\\"exclusivegateway2\\\" targetRef=\\\"usertask4\\\">\\r\\n      <conditionExpression xsi:type=\\\"tFormalExpression\\\"><![CDATA[${hr_comm==\\\"pass\\\"}]]></conditionExpression>\\r\\n    </sequenceFlow>\\r\\n    <endEvent id=\\\"endevent1\\\" name=\\\"End\\\"></endEvent>\\r\\n    <sequenceFlow id=\\\"flow9\\\" sourceRef=\\\"usertask4\\\" targetRef=\\\"endevent1\\\"></sequenceFlow>\\r\\n    <sequenceFlow id=\\\"flow10\\\" name=\\\"取消申请\\\" sourceRef=\\\"usertask2\\\" targetRef=\\\"endevent1\\\">\\r\\n      <conditionExpression xsi:type=\\\"tFormalExpression\\\"><![CDATA[${self_comm==\\\"cancel\\\"}]]></conditionExpression>\\r\\n    </sequenceFlow>\\r\\n    <sequenceFlow id=\\\"flow11\\\" sourceRef=\\\"usertask2\\\" targetRef=\\\"usertask1\\\">\\r\\n      <conditionExpression xsi:type=\\\"tFormalExpression\\\"><![CDATA[${self_comm==\\\"keepon\\\"}]]></conditionExpression>\\r\\n    </sequenceFlow>\\r\\n  </process>\\r\\n  <bpmndi:BPMNDiagram id=\\\"BPMNDiagram_Collaboration\\\">\\r\\n    <bpmndi:BPMNPlane bpmnElement=\\\"Collaboration\\\" id=\\\"BPMNPlane_Collaboration\\\">\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"pool1\\\" id=\\\"BPMNShape_pool1\\\">\\r\\n        <omgdc:Bounds height=\\\"450.0\\\" width=\\\"630.0\\\" x=\\\"220.0\\\" y=\\\"20.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"lane1\\\" id=\\\"BPMNShape_lane1\\\">\\r\\n        <omgdc:Bounds height=\\\"150.0\\\" width=\\\"610.0\\\" x=\\\"240.0\\\" y=\\\"20.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"lane2\\\" id=\\\"BPMNShape_lane2\\\">\\r\\n        <omgdc:Bounds height=\\\"150.0\\\" width=\\\"610.0\\\" x=\\\"240.0\\\" y=\\\"170.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"lane3\\\" id=\\\"BPMNShape_lane3\\\">\\r\\n        <omgdc:Bounds height=\\\"150.0\\\" width=\\\"610.0\\\" x=\\\"240.0\\\" y=\\\"320.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"startevent1\\\" id=\\\"BPMNShape_startevent1\\\">\\r\\n        <omgdc:Bounds height=\\\"35.0\\\" width=\\\"35.0\\\" x=\\\"300.0\\\" y=\\\"80.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"usertask1\\\" id=\\\"BPMNShape_usertask1\\\">\\r\\n        <omgdc:Bounds height=\\\"55.0\\\" width=\\\"105.0\\\" x=\\\"290.0\\\" y=\\\"230.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"exclusivegateway1\\\" id=\\\"BPMNShape_exclusivegateway1\\\">\\r\\n        <omgdc:Bounds height=\\\"40.0\\\" width=\\\"40.0\\\" x=\\\"440.0\\\" y=\\\"237.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"usertask2\\\" id=\\\"BPMNShape_usertask2\\\">\\r\\n        <omgdc:Bounds height=\\\"55.0\\\" width=\\\"105.0\\\" x=\\\"420.0\\\" y=\\\"70.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"usertask3\\\" id=\\\"BPMNShape_usertask3\\\">\\r\\n        <omgdc:Bounds height=\\\"55.0\\\" width=\\\"105.0\\\" x=\\\"410.0\\\" y=\\\"390.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"exclusivegateway2\\\" id=\\\"BPMNShape_exclusivegateway2\\\">\\r\\n        <omgdc:Bounds height=\\\"40.0\\\" width=\\\"40.0\\\" x=\\\"630.0\\\" y=\\\"390.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"usertask4\\\" id=\\\"BPMNShape_usertask4\\\">\\r\\n        <omgdc:Bounds height=\\\"55.0\\\" width=\\\"105.0\\\" x=\\\"600.0\\\" y=\\\"70.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNShape bpmnElement=\\\"endevent1\\\" id=\\\"BPMNShape_endevent1\\\">\\r\\n        <omgdc:Bounds height=\\\"35.0\\\" width=\\\"35.0\\\" x=\\\"790.0\\\" y=\\\"80.0\\\"></omgdc:Bounds>\\r\\n      </bpmndi:BPMNShape>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"flow1\\\" id=\\\"BPMNEdge_flow1\\\">\\r\\n        <omgdi:waypoint x=\\\"317.0\\\" y=\\\"115.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"342.0\\\" y=\\\"230.0\\\"></omgdi:waypoint>\\r\\n      </bpmndi:BPMNEdge>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"flow2\\\" id=\\\"BPMNEdge_flow2\\\">\\r\\n        <omgdi:waypoint x=\\\"395.0\\\" y=\\\"257.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"440.0\\\" y=\\\"257.0\\\"></omgdi:waypoint>\\r\\n      </bpmndi:BPMNEdge>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"leader_refuse\\\" id=\\\"BPMNEdge_leader_refuse\\\">\\r\\n        <omgdi:waypoint x=\\\"460.0\\\" y=\\\"237.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"472.0\\\" y=\\\"125.0\\\"></omgdi:waypoint>\\r\\n        <bpmndi:BPMNLabel>\\r\\n          <omgdc:Bounds height=\\\"14.0\\\" width=\\\"36.0\\\" x=\\\"450.0\\\" y=\\\"170.0\\\"></omgdc:Bounds>\\r\\n        </bpmndi:BPMNLabel>\\r\\n      </bpmndi:BPMNEdge>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"leader_pass\\\" id=\\\"BPMNEdge_leader_pass\\\">\\r\\n        <omgdi:waypoint x=\\\"460.0\\\" y=\\\"277.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"462.0\\\" y=\\\"390.0\\\"></omgdi:waypoint>\\r\\n        <bpmndi:BPMNLabel>\\r\\n          <omgdc:Bounds height=\\\"14.0\\\" width=\\\"24.0\\\" x=\\\"455.0\\\" y=\\\"330.0\\\"></omgdc:Bounds>\\r\\n        </bpmndi:BPMNLabel>\\r\\n      </bpmndi:BPMNEdge>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"flow5\\\" id=\\\"BPMNEdge_flow5\\\">\\r\\n        <omgdi:waypoint x=\\\"515.0\\\" y=\\\"417.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"630.0\\\" y=\\\"410.0\\\"></omgdi:waypoint>\\r\\n      </bpmndi:BPMNEdge>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"hr_refuse\\\" id=\\\"BPMNEdge_hr_refuse\\\">\\r\\n        <omgdi:waypoint x=\\\"650.0\\\" y=\\\"390.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"472.0\\\" y=\\\"125.0\\\"></omgdi:waypoint>\\r\\n        <bpmndi:BPMNLabel>\\r\\n          <omgdc:Bounds height=\\\"14.0\\\" width=\\\"36.0\\\" x=\\\"540.0\\\" y=\\\"218.0\\\"></omgdc:Bounds>\\r\\n        </bpmndi:BPMNLabel>\\r\\n      </bpmndi:BPMNEdge>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"hr_ok\\\" id=\\\"BPMNEdge_hr_ok\\\">\\r\\n        <omgdi:waypoint x=\\\"650.0\\\" y=\\\"390.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"652.0\\\" y=\\\"125.0\\\"></omgdi:waypoint>\\r\\n        <bpmndi:BPMNLabel>\\r\\n          <omgdc:Bounds height=\\\"14.0\\\" width=\\\"24.0\\\" x=\\\"640.0\\\" y=\\\"231.0\\\"></omgdc:Bounds>\\r\\n        </bpmndi:BPMNLabel>\\r\\n      </bpmndi:BPMNEdge>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"flow9\\\" id=\\\"BPMNEdge_flow9\\\">\\r\\n        <omgdi:waypoint x=\\\"705.0\\\" y=\\\"97.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"790.0\\\" y=\\\"97.0\\\"></omgdi:waypoint>\\r\\n      </bpmndi:BPMNEdge>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"flow10\\\" id=\\\"BPMNEdge_flow10\\\">\\r\\n        <omgdi:waypoint x=\\\"472.0\\\" y=\\\"70.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"478.0\\\" y=\\\"48.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"802.0\\\" y=\\\"49.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"807.0\\\" y=\\\"80.0\\\"></omgdi:waypoint>\\r\\n        <bpmndi:BPMNLabel>\\r\\n          <omgdc:Bounds height=\\\"14.0\\\" width=\\\"48.0\\\" x=\\\"517.0\\\" y=\\\"9.0\\\"></omgdc:Bounds>\\r\\n        </bpmndi:BPMNLabel>\\r\\n      </bpmndi:BPMNEdge>\\r\\n      <bpmndi:BPMNEdge bpmnElement=\\\"flow11\\\" id=\\\"BPMNEdge_flow11\\\">\\r\\n        <omgdi:waypoint x=\\\"472.0\\\" y=\\\"125.0\\\"></omgdi:waypoint>\\r\\n        <omgdi:waypoint x=\\\"342.0\\\" y=\\\"230.0\\\"></omgdi:waypoint>\\r\\n      </bpmndi:BPMNEdge>\\r\\n    </bpmndi:BPMNPlane>\\r\\n  </bpmndi:BPMNDiagram>\\r\\n</definitions>\");\n\n//# sourceURL=webpack:///./src/003starter/bpmn03-44.bpmn?");

/***/ }),

/***/ "bpmn-js":
/*!*************************!*\
  !*** external "BpmnJS" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = BpmnJS;\n\n//# sourceURL=webpack:///external_%22BpmnJS%22?");

/***/ }),

/***/ "jQuery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = jQuery;\n\n//# sourceURL=webpack:///external_%22jQuery%22?");

/***/ })

/******/ });