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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/004colors/004colors.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/004colors/004colors.js":
/*!************************************!*\
  !*** ./src/004colors/004colors.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"jquery\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bpmn-js */ \"bpmn-js\");\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmn_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _pizza_collaboration_bpmn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pizza-collaboration.bpmn */ \"./src/004colors/pizza-collaboration.bpmn\");\n\r\n\r\n\r\n\r\n// viewer instance\r\nvar viewer = new bpmn_js__WEBPACK_IMPORTED_MODULE_1___default.a({\r\n    container: '#diagram'\r\n});\r\n\r\n\r\n/**\r\n * Open diagram in our viewer instance.\r\n *\r\n * @param {String} bpmnXML diagram to display\r\n */\r\nfunction showDiagram(diagramXML) {\r\n\r\n    viewer.importXML(diagramXML, function() {\r\n\r\n        var overlays = viewer.get('overlays'),\r\n            canvas = viewer.get('canvas'),\r\n            elementRegistry = viewer.get('elementRegistry'),\r\n            modeling = viewer.get('modeling');\r\n\r\n        // Option 1: Color via Overlay\r\n        var shape = elementRegistry.get('CalmCustomerTask');\r\n\r\n        var $overlayHtml = jquery__WEBPACK_IMPORTED_MODULE_0___default()('<div class=\"highlight-overlay\">')\r\n            .css({\r\n                width: shape.width,\r\n                height: shape.height\r\n            });\r\n\r\n        overlays.add('CalmCustomerTask', {\r\n            position: {\r\n                top: 10,\r\n                left: 10\r\n            },\r\n            html: $overlayHtml\r\n        });\r\n\r\n        // Option 2: Color via BPMN 2.0 Extension\r\n        var elementToColor = elementRegistry.get('SelectAPizzaTask');\r\n\r\n        modeling.setColor([ elementToColor ], {\r\n            stroke: 'yellow',\r\n            fill: 'rgba(0, 80, 0, 0.4)'\r\n        });\r\n\r\n        // Option 3: Color via Marker + CSS Styling\r\n        canvas.addMarker('OrderReceivedEvent', 'highlight');\r\n    });\r\n}\r\n\r\n\r\nshowDiagram(_pizza_collaboration_bpmn__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n\n//# sourceURL=webpack:///./src/004colors/004colors.js?");

/***/ }),

/***/ "./src/004colors/pizza-collaboration.bpmn":
/*!************************************************!*\
  !*** ./src/004colors/pizza-collaboration.bpmn ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n<semantic:definitions xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" xmlns:di=\\\"http://www.omg.org/spec/DD/20100524/DI\\\" xmlns:bpmndi=\\\"http://www.omg.org/spec/BPMN/20100524/DI\\\" xmlns:dc=\\\"http://www.omg.org/spec/DD/20100524/DC\\\" xmlns:semantic=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\\" id=\\\"_1275940932088\\\" targetNamespace=\\\"http://www.trisotech.com/definitions/_1275940932088\\\" exporter=\\\"Camunda Modeler\\\" exporterVersion=\\\"1.16.0\\\">\\n  <semantic:message id=\\\"_1275940932310\\\" />\\n  <semantic:message id=\\\"_1275940932433\\\" />\\n  <semantic:process id=\\\"_6-1\\\" isExecutable=\\\"false\\\">\\n    <semantic:laneSet id=\\\"ls_6-438\\\">\\n      <semantic:lane id=\\\"_6-650\\\" name=\\\"clerk\\\">\\n        <semantic:flowNodeRef>OrderReceivedEvent</semantic:flowNodeRef>\\n        <semantic:flowNodeRef>_6-652</semantic:flowNodeRef>\\n        <semantic:flowNodeRef>_6-674</semantic:flowNodeRef>\\n        <semantic:flowNodeRef>CalmCustomerTask</semantic:flowNodeRef>\\n      </semantic:lane>\\n      <semantic:lane id=\\\"_6-446\\\" name=\\\"pizza chef\\\">\\n        <semantic:flowNodeRef>_6-463</semantic:flowNodeRef>\\n      </semantic:lane>\\n      <semantic:lane id=\\\"_6-448\\\" name=\\\"delivery boy\\\">\\n        <semantic:flowNodeRef>_6-514</semantic:flowNodeRef>\\n        <semantic:flowNodeRef>_6-565</semantic:flowNodeRef>\\n        <semantic:flowNodeRef>_6-616</semantic:flowNodeRef>\\n      </semantic:lane>\\n    </semantic:laneSet>\\n    <semantic:startEvent id=\\\"OrderReceivedEvent\\\" name=\\\"Order received\\\">\\n      <semantic:outgoing>_6-630</semantic:outgoing>\\n      <semantic:messageEventDefinition messageRef=\\\"_1275940932310\\\" />\\n    </semantic:startEvent>\\n    <semantic:parallelGateway id=\\\"_6-652\\\" name=\\\"\\\">\\n      <semantic:incoming>_6-630</semantic:incoming>\\n      <semantic:outgoing>_6-691</semantic:outgoing>\\n      <semantic:outgoing>_6-693</semantic:outgoing>\\n    </semantic:parallelGateway>\\n    <semantic:intermediateCatchEvent id=\\\"_6-674\\\" name=\\\"„where is my pizza?“\\\">\\n      <semantic:incoming>_6-691</semantic:incoming>\\n      <semantic:incoming>_6-746</semantic:incoming>\\n      <semantic:outgoing>_6-748</semantic:outgoing>\\n      <semantic:messageEventDefinition messageRef=\\\"_1275940932433\\\" />\\n    </semantic:intermediateCatchEvent>\\n    <semantic:task id=\\\"CalmCustomerTask\\\" name=\\\"Calm customer\\\">\\n      <semantic:incoming>_6-748</semantic:incoming>\\n      <semantic:outgoing>_6-746</semantic:outgoing>\\n    </semantic:task>\\n    <semantic:task id=\\\"_6-463\\\" name=\\\"Bake the pizza\\\">\\n      <semantic:incoming>_6-693</semantic:incoming>\\n      <semantic:outgoing>_6-632</semantic:outgoing>\\n    </semantic:task>\\n    <semantic:task id=\\\"_6-514\\\" name=\\\"Deliver the pizza\\\">\\n      <semantic:incoming>_6-632</semantic:incoming>\\n      <semantic:outgoing>_6-634</semantic:outgoing>\\n    </semantic:task>\\n    <semantic:task id=\\\"_6-565\\\" name=\\\"Receive payment\\\">\\n      <semantic:incoming>_6-634</semantic:incoming>\\n      <semantic:outgoing>_6-636</semantic:outgoing>\\n    </semantic:task>\\n    <semantic:endEvent id=\\\"_6-616\\\" name=\\\"\\\">\\n      <semantic:incoming>_6-636</semantic:incoming>\\n      <semantic:terminateEventDefinition />\\n    </semantic:endEvent>\\n    <semantic:sequenceFlow id=\\\"_6-630\\\" name=\\\"\\\" sourceRef=\\\"OrderReceivedEvent\\\" targetRef=\\\"_6-652\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-632\\\" name=\\\"\\\" sourceRef=\\\"_6-463\\\" targetRef=\\\"_6-514\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-634\\\" name=\\\"\\\" sourceRef=\\\"_6-514\\\" targetRef=\\\"_6-565\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-636\\\" name=\\\"\\\" sourceRef=\\\"_6-565\\\" targetRef=\\\"_6-616\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-691\\\" name=\\\"\\\" sourceRef=\\\"_6-652\\\" targetRef=\\\"_6-674\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-693\\\" name=\\\"\\\" sourceRef=\\\"_6-652\\\" targetRef=\\\"_6-463\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-746\\\" name=\\\"\\\" sourceRef=\\\"CalmCustomerTask\\\" targetRef=\\\"_6-674\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-748\\\" name=\\\"\\\" sourceRef=\\\"_6-674\\\" targetRef=\\\"CalmCustomerTask\\\" />\\n  </semantic:process>\\n  <semantic:message id=\\\"_1275940932198\\\" />\\n  <semantic:process id=\\\"_6-2\\\" isExecutable=\\\"false\\\">\\n    <semantic:startEvent id=\\\"_6-61\\\" name=\\\"Hungry for pizza\\\">\\n      <semantic:outgoing>_6-125</semantic:outgoing>\\n    </semantic:startEvent>\\n    <semantic:task id=\\\"SelectAPizzaTask\\\" name=\\\"Select a pizza\\\">\\n      <semantic:incoming>_6-125</semantic:incoming>\\n      <semantic:outgoing>_6-178</semantic:outgoing>\\n    </semantic:task>\\n    <semantic:task id=\\\"_6-127\\\" name=\\\"Order a pizza\\\">\\n      <semantic:incoming>_6-178</semantic:incoming>\\n      <semantic:outgoing>_6-420</semantic:outgoing>\\n    </semantic:task>\\n    <semantic:eventBasedGateway id=\\\"_6-180\\\" name=\\\"\\\">\\n      <semantic:incoming>_6-420</semantic:incoming>\\n      <semantic:incoming>_6-430</semantic:incoming>\\n      <semantic:outgoing>_6-422</semantic:outgoing>\\n      <semantic:outgoing>_6-424</semantic:outgoing>\\n    </semantic:eventBasedGateway>\\n    <semantic:intermediateCatchEvent id=\\\"_6-202\\\" name=\\\"pizza received\\\">\\n      <semantic:incoming>_6-422</semantic:incoming>\\n      <semantic:outgoing>_6-428</semantic:outgoing>\\n      <semantic:messageEventDefinition messageRef=\\\"_1275940932198\\\" />\\n    </semantic:intermediateCatchEvent>\\n    <semantic:intermediateCatchEvent id=\\\"_6-219\\\" name=\\\"60 minutes\\\">\\n      <semantic:incoming>_6-424</semantic:incoming>\\n      <semantic:outgoing>_6-426</semantic:outgoing>\\n      <semantic:timerEventDefinition>\\n        <semantic:timeDate />\\n      </semantic:timerEventDefinition>\\n    </semantic:intermediateCatchEvent>\\n    <semantic:task id=\\\"_6-236\\\" name=\\\"Ask for the pizza\\\">\\n      <semantic:incoming>_6-426</semantic:incoming>\\n      <semantic:outgoing>_6-430</semantic:outgoing>\\n    </semantic:task>\\n    <semantic:task id=\\\"_6-304\\\" name=\\\"Pay the pizza\\\">\\n      <semantic:incoming>_6-428</semantic:incoming>\\n      <semantic:outgoing>_6-434</semantic:outgoing>\\n    </semantic:task>\\n    <semantic:task id=\\\"_6-355\\\" name=\\\"Eat the pizza\\\">\\n      <semantic:incoming>_6-434</semantic:incoming>\\n      <semantic:outgoing>_6-436</semantic:outgoing>\\n    </semantic:task>\\n    <semantic:endEvent id=\\\"_6-406\\\" name=\\\"Hunger satisfied\\\">\\n      <semantic:incoming>_6-436</semantic:incoming>\\n    </semantic:endEvent>\\n    <semantic:sequenceFlow id=\\\"_6-125\\\" name=\\\"\\\" sourceRef=\\\"_6-61\\\" targetRef=\\\"SelectAPizzaTask\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-178\\\" name=\\\"\\\" sourceRef=\\\"SelectAPizzaTask\\\" targetRef=\\\"_6-127\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-420\\\" name=\\\"\\\" sourceRef=\\\"_6-127\\\" targetRef=\\\"_6-180\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-422\\\" name=\\\"\\\" sourceRef=\\\"_6-180\\\" targetRef=\\\"_6-202\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-424\\\" name=\\\"\\\" sourceRef=\\\"_6-180\\\" targetRef=\\\"_6-219\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-426\\\" name=\\\"\\\" sourceRef=\\\"_6-219\\\" targetRef=\\\"_6-236\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-428\\\" name=\\\"\\\" sourceRef=\\\"_6-202\\\" targetRef=\\\"_6-304\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-430\\\" name=\\\"\\\" sourceRef=\\\"_6-236\\\" targetRef=\\\"_6-180\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-434\\\" name=\\\"\\\" sourceRef=\\\"_6-304\\\" targetRef=\\\"_6-355\\\" />\\n    <semantic:sequenceFlow id=\\\"_6-436\\\" name=\\\"\\\" sourceRef=\\\"_6-355\\\" targetRef=\\\"_6-406\\\" />\\n  </semantic:process>\\n  <semantic:collaboration id=\\\"C1275940932557\\\">\\n    <semantic:participant id=\\\"_6-53\\\" name=\\\"Pizza Customer\\\" processRef=\\\"_6-2\\\" />\\n    <semantic:participant id=\\\"_6-438\\\" name=\\\"Pizza vendor\\\" processRef=\\\"_6-1\\\" />\\n    <semantic:messageFlow id=\\\"_6-638\\\" name=\\\"pizza order\\\" sourceRef=\\\"_6-127\\\" targetRef=\\\"OrderReceivedEvent\\\" />\\n    <semantic:messageFlow id=\\\"_6-642\\\" name=\\\"\\\" sourceRef=\\\"_6-236\\\" targetRef=\\\"_6-674\\\" />\\n    <semantic:messageFlow id=\\\"_6-646\\\" name=\\\"receipt\\\" sourceRef=\\\"_6-565\\\" targetRef=\\\"_6-304\\\" />\\n    <semantic:messageFlow id=\\\"_6-648\\\" name=\\\"money\\\" sourceRef=\\\"_6-304\\\" targetRef=\\\"_6-565\\\" />\\n    <semantic:messageFlow id=\\\"_6-640\\\" name=\\\"pizza\\\" sourceRef=\\\"_6-514\\\" targetRef=\\\"_6-202\\\" />\\n    <semantic:messageFlow id=\\\"_6-750\\\" name=\\\"\\\" sourceRef=\\\"CalmCustomerTask\\\" targetRef=\\\"_6-236\\\" />\\n  </semantic:collaboration>\\n  <bpmndi:BPMNDiagram id=\\\"Trisotech.Visio-_6\\\" name=\\\"Untitled Diagram\\\" documentation=\\\"\\\" resolution=\\\"96.00000267028808\\\">\\n    <bpmndi:BPMNPlane bpmnElement=\\\"C1275940932557\\\">\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6-53\\\" bpmnElement=\\\"_6-53\\\" isHorizontal=\\\"true\\\">\\n        <dc:Bounds x=\\\"12\\\" y=\\\"12\\\" width=\\\"1044\\\" height=\\\"294\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6-438\\\" bpmnElement=\\\"_6-438\\\" isHorizontal=\\\"true\\\">\\n        <dc:Bounds x=\\\"12\\\" y=\\\"372\\\" width=\\\"905\\\" height=\\\"337\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-650\\\" bpmnElement=\\\"_6-650\\\" isHorizontal=\\\"true\\\">\\n        <dc:Bounds x=\\\"42\\\" y=\\\"372\\\" width=\\\"875\\\" height=\\\"114\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-446\\\" bpmnElement=\\\"_6-446\\\" isHorizontal=\\\"true\\\">\\n        <dc:Bounds x=\\\"42\\\" y=\\\"486\\\" width=\\\"875\\\" height=\\\"114\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-448\\\" bpmnElement=\\\"_6-448\\\" isHorizontal=\\\"true\\\">\\n        <dc:Bounds x=\\\"42\\\" y=\\\"600\\\" width=\\\"875\\\" height=\\\"109\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6_OrderReceivedEvent\\\" bpmnElement=\\\"OrderReceivedEvent\\\">\\n        <dc:Bounds x=\\\"79\\\" y=\\\"405\\\" width=\\\"30\\\" height=\\\"30\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-652\\\" bpmnElement=\\\"_6-652\\\">\\n        <dc:Bounds x=\\\"140\\\" y=\\\"399\\\" width=\\\"42\\\" height=\\\"42\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-674\\\" bpmnElement=\\\"_6-674\\\">\\n        <dc:Bounds x=\\\"218\\\" y=\\\"404\\\" width=\\\"32\\\" height=\\\"32\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6_CalmCustomerTask\\\" bpmnElement=\\\"CalmCustomerTask\\\">\\n        <dc:Bounds x=\\\"286\\\" y=\\\"386\\\" width=\\\"83\\\" height=\\\"68\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-463\\\" bpmnElement=\\\"_6-463\\\">\\n        <dc:Bounds x=\\\"252\\\" y=\\\"521\\\" width=\\\"83\\\" height=\\\"68\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-514\\\" bpmnElement=\\\"_6-514\\\">\\n        <dc:Bounds x=\\\"464\\\" y=\\\"629\\\" width=\\\"83\\\" height=\\\"68\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-565\\\" bpmnElement=\\\"_6-565\\\">\\n        <dc:Bounds x=\\\"603\\\" y=\\\"629\\\" width=\\\"83\\\" height=\\\"68\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-616\\\" bpmnElement=\\\"_6-616\\\">\\n        <dc:Bounds x=\\\"722\\\" y=\\\"647\\\" width=\\\"32\\\" height=\\\"32\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-61\\\" bpmnElement=\\\"_6-61\\\">\\n        <dc:Bounds x=\\\"66\\\" y=\\\"96\\\" width=\\\"30\\\" height=\\\"30\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-74\\\" bpmnElement=\\\"SelectAPizzaTask\\\">\\n        <dc:Bounds x=\\\"145\\\" y=\\\"77\\\" width=\\\"83\\\" height=\\\"68\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-127\\\" bpmnElement=\\\"_6-127\\\">\\n        <dc:Bounds x=\\\"265\\\" y=\\\"77\\\" width=\\\"83\\\" height=\\\"68\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-180\\\" bpmnElement=\\\"_6-180\\\">\\n        <dc:Bounds x=\\\"378\\\" y=\\\"90\\\" width=\\\"42\\\" height=\\\"42\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-202\\\" bpmnElement=\\\"_6-202\\\">\\n        <dc:Bounds x=\\\"647\\\" y=\\\"95\\\" width=\\\"32\\\" height=\\\"32\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-219\\\" bpmnElement=\\\"_6-219\\\">\\n        <dc:Bounds x=\\\"448\\\" y=\\\"184\\\" width=\\\"32\\\" height=\\\"32\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-236\\\" bpmnElement=\\\"_6-236\\\">\\n        <dc:Bounds x=\\\"517\\\" y=\\\"166\\\" width=\\\"83\\\" height=\\\"68\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-304\\\" bpmnElement=\\\"_6-304\\\">\\n        <dc:Bounds x=\\\"726\\\" y=\\\"77\\\" width=\\\"83\\\" height=\\\"68\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-355\\\" bpmnElement=\\\"_6-355\\\">\\n        <dc:Bounds x=\\\"834\\\" y=\\\"77\\\" width=\\\"83\\\" height=\\\"68\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Trisotech.Visio__6__6-406\\\" bpmnElement=\\\"_6-406\\\">\\n        <dc:Bounds x=\\\"956\\\" y=\\\"95\\\" width=\\\"32\\\" height=\\\"32\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-640\\\" bpmnElement=\\\"_6-640\\\">\\n        <di:waypoint x=\\\"506\\\" y=\\\"629\\\" />\\n        <di:waypoint x=\\\"506\\\" y=\\\"384\\\" />\\n        <di:waypoint x=\\\"663\\\" y=\\\"384\\\" />\\n        <di:waypoint x=\\\"663\\\" y=\\\"127\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-630\\\" bpmnElement=\\\"_6-630\\\">\\n        <di:waypoint x=\\\"109\\\" y=\\\"420\\\" />\\n        <di:waypoint x=\\\"140\\\" y=\\\"420\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-691\\\" bpmnElement=\\\"_6-691\\\">\\n        <di:waypoint x=\\\"182\\\" y=\\\"420\\\" />\\n        <di:waypoint x=\\\"200\\\" y=\\\"420\\\" />\\n        <di:waypoint x=\\\"218\\\" y=\\\"420\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-648\\\" bpmnElement=\\\"_6-648\\\">\\n        <di:waypoint x=\\\"754\\\" y=\\\"145\\\" />\\n        <di:waypoint x=\\\"754\\\" y=\\\"408\\\" />\\n        <di:waypoint x=\\\"630\\\" y=\\\"408\\\" />\\n        <di:waypoint x=\\\"631\\\" y=\\\"629\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-422\\\" bpmnElement=\\\"_6-422\\\">\\n        <di:waypoint x=\\\"420\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"438\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"647\\\" y=\\\"111\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-646\\\" bpmnElement=\\\"_6-646\\\" messageVisibleKind=\\\"non_initiating\\\">\\n        <di:waypoint x=\\\"658\\\" y=\\\"629\\\" />\\n        <di:waypoint x=\\\"658\\\" y=\\\"432\\\" />\\n        <di:waypoint x=\\\"782\\\" y=\\\"432\\\" />\\n        <di:waypoint x=\\\"782\\\" y=\\\"145\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-428\\\" bpmnElement=\\\"_6-428\\\">\\n        <di:waypoint x=\\\"679\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"726\\\" y=\\\"111\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-748\\\" bpmnElement=\\\"_6-748\\\">\\n        <di:waypoint x=\\\"250\\\" y=\\\"420\\\" />\\n        <di:waypoint x=\\\"268\\\" y=\\\"420\\\" />\\n        <di:waypoint x=\\\"286\\\" y=\\\"420\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-420\\\" bpmnElement=\\\"_6-420\\\">\\n        <di:waypoint x=\\\"348\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"366\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"378\\\" y=\\\"111\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-636\\\" bpmnElement=\\\"_6-636\\\">\\n        <di:waypoint x=\\\"686\\\" y=\\\"663\\\" />\\n        <di:waypoint x=\\\"704\\\" y=\\\"663\\\" />\\n        <di:waypoint x=\\\"722\\\" y=\\\"663\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-750\\\" bpmnElement=\\\"_6-750\\\">\\n        <di:waypoint x=\\\"328\\\" y=\\\"386\\\" />\\n        <di:waypoint x=\\\"328\\\" y=\\\"348\\\" />\\n        <di:waypoint x=\\\"572\\\" y=\\\"348\\\" />\\n        <di:waypoint x=\\\"572\\\" y=\\\"234\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-436\\\" bpmnElement=\\\"_6-436\\\">\\n        <di:waypoint x=\\\"918\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"936\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"956\\\" y=\\\"111\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-632\\\" bpmnElement=\\\"_6-632\\\">\\n        <di:waypoint x=\\\"335\\\" y=\\\"555\\\" />\\n        <di:waypoint x=\\\"353\\\" y=\\\"555\\\" />\\n        <di:waypoint x=\\\"353\\\" y=\\\"663\\\" />\\n        <di:waypoint x=\\\"464\\\" y=\\\"663\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-634\\\" bpmnElement=\\\"_6-634\\\">\\n        <di:waypoint x=\\\"548\\\" y=\\\"663\\\" />\\n        <di:waypoint x=\\\"603\\\" y=\\\"663\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-125\\\" bpmnElement=\\\"_6-125\\\">\\n        <di:waypoint x=\\\"96\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"114\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"145\\\" y=\\\"111\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-430\\\" bpmnElement=\\\"_6-430\\\">\\n        <di:waypoint x=\\\"600\\\" y=\\\"200\\\" />\\n        <di:waypoint x=\\\"618\\\" y=\\\"200\\\" />\\n        <di:waypoint x=\\\"618\\\" y=\\\"252\\\" />\\n        <di:waypoint x=\\\"576\\\" y=\\\"252\\\" />\\n        <di:waypoint x=\\\"549\\\" y=\\\"252\\\" />\\n        <di:waypoint x=\\\"360\\\" y=\\\"252\\\" />\\n        <di:waypoint x=\\\"360\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"378\\\" y=\\\"111\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-642\\\" bpmnElement=\\\"_6-642\\\">\\n        <di:waypoint x=\\\"545\\\" y=\\\"234\\\" />\\n        <di:waypoint x=\\\"545\\\" y=\\\"324\\\" />\\n        <di:waypoint x=\\\"234\\\" y=\\\"324\\\" />\\n        <di:waypoint x=\\\"234\\\" y=\\\"404\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-424\\\" bpmnElement=\\\"_6-424\\\">\\n        <di:waypoint x=\\\"399\\\" y=\\\"132\\\" />\\n        <di:waypoint x=\\\"399\\\" y=\\\"200\\\" />\\n        <di:waypoint x=\\\"448\\\" y=\\\"200\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-638\\\" bpmnElement=\\\"_6-638\\\">\\n        <di:waypoint x=\\\"306\\\" y=\\\"145\\\" />\\n        <di:waypoint x=\\\"306\\\" y=\\\"252\\\" />\\n        <di:waypoint x=\\\"94\\\" y=\\\"252\\\" />\\n        <di:waypoint x=\\\"94\\\" y=\\\"405\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-426\\\" bpmnElement=\\\"_6-426\\\">\\n        <di:waypoint x=\\\"480\\\" y=\\\"200\\\" />\\n        <di:waypoint x=\\\"498\\\" y=\\\"200\\\" />\\n        <di:waypoint x=\\\"517\\\" y=\\\"200\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-693\\\" bpmnElement=\\\"_6-693\\\">\\n        <di:waypoint x=\\\"161\\\" y=\\\"441\\\" />\\n        <di:waypoint x=\\\"161\\\" y=\\\"556\\\" />\\n        <di:waypoint x=\\\"252\\\" y=\\\"555\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-178\\\" bpmnElement=\\\"_6-178\\\">\\n        <di:waypoint x=\\\"228\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"265\\\" y=\\\"111\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-746\\\" bpmnElement=\\\"_6-746\\\">\\n        <di:waypoint x=\\\"370\\\" y=\\\"420\\\" />\\n        <di:waypoint x=\\\"386\\\" y=\\\"420\\\" />\\n        <di:waypoint x=\\\"386\\\" y=\\\"474\\\" />\\n        <di:waypoint x=\\\"191\\\" y=\\\"474\\\" />\\n        <di:waypoint x=\\\"191\\\" y=\\\"420\\\" />\\n        <di:waypoint x=\\\"218\\\" y=\\\"420\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"Trisotech.Visio__6__6-434\\\" bpmnElement=\\\"_6-434\\\">\\n        <di:waypoint x=\\\"810\\\" y=\\\"111\\\" />\\n        <di:waypoint x=\\\"834\\\" y=\\\"111\\\" />\\n        <bpmndi:BPMNLabel />\\n      </bpmndi:BPMNEdge>\\n    </bpmndi:BPMNPlane>\\n  </bpmndi:BPMNDiagram>\\n</semantic:definitions>\\n\");\n\n//# sourceURL=webpack:///./src/004colors/pizza-collaboration.bpmn?");

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