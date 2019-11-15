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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/008modeler/008modeler.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/008modeler/008modeler.js":
/*!**************************************!*\
  !*** ./src/008modeler/008modeler.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ \"jquery\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bpmn-js */ \"bpmn-js\");\n/* harmony import */ var bpmn_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmn_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _newDiagram_bpmn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./newDiagram.bpmn */ \"./src/008modeler/newDiagram.bpmn\");\n\r\n\r\n\r\n\r\n\r\n\r\nvar container = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#js-drop-zone');\r\n\r\nvar modeler = new bpmn_js__WEBPACK_IMPORTED_MODULE_1___default.a({\r\n    container: '#js-canvas'\r\n});\r\n\r\nfunction createNewDiagram() {\r\n    openDiagram(_newDiagram_bpmn__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\r\n}\r\n\r\nfunction openDiagram(xml) {\r\n\r\n    modeler.importXML(xml, function(err) {\r\n\r\n        if (err) {\r\n            container\r\n                .removeClass('with-diagram')\r\n                .addClass('with-error');\r\n\r\n            container.find('.error pre').text(err.message);\r\n\r\n            console.error(err);\r\n        } else {\r\n            container\r\n                .removeClass('with-error')\r\n                .addClass('with-diagram');\r\n        }\r\n\r\n\r\n    });\r\n}\r\n\r\nfunction saveSVG(done) {\r\n    modeler.saveSVG(done);\r\n}\r\n\r\nfunction saveDiagram(done) {\r\n\r\n    modeler.saveXML({ format: true }, function(err, xml) {\r\n        done(err, xml);\r\n    });\r\n}\r\n\r\nfunction registerFileDrop(container, callback) {\r\n\r\n    function handleFileSelect(e) {\r\n        e.stopPropagation();\r\n        e.preventDefault();\r\n\r\n        var files = e.dataTransfer.files;\r\n\r\n        var file = files[0];\r\n\r\n        var reader = new FileReader();\r\n\r\n        reader.onload = function(e) {\r\n\r\n            var xml = e.target.result;\r\n\r\n            callback(xml);\r\n        };\r\n\r\n        reader.readAsText(file);\r\n    }\r\n\r\n    function handleDragOver(e) {\r\n        e.stopPropagation();\r\n        e.preventDefault();\r\n\r\n        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.\r\n    }\r\n\r\n    container.get(0).addEventListener('dragover', handleDragOver, false);\r\n    container.get(0).addEventListener('drop', handleFileSelect, false);\r\n}\r\n\r\n\r\n// file drag / drop ///////////////////////\r\n\r\n// check file api availability\r\nif (!window.FileList || !window.FileReader) {\r\n    window.alert(\r\n        'Looks like you use an older browser that does not support drag and drop. ' +\r\n        'Try using Chrome, Firefox or the Internet Explorer > 10.');\r\n} else {\r\n    registerFileDrop(container, openDiagram);\r\n}\r\n\r\n// bootstrap diagram functions\r\n\r\njquery__WEBPACK_IMPORTED_MODULE_0___default()(function() {\r\n\r\n    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#js-create-diagram').click(function(e) {\r\n        e.stopPropagation();\r\n        e.preventDefault();\r\n\r\n        createNewDiagram();\r\n    });\r\n\r\n    var downloadLink = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#js-download-diagram');\r\n    var downloadSvgLink = jquery__WEBPACK_IMPORTED_MODULE_0___default()('#js-download-svg');\r\n\r\n    jquery__WEBPACK_IMPORTED_MODULE_0___default()('.buttons a').click(function(e) {\r\n        if (!jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).is('.active')) {\r\n            e.preventDefault();\r\n            e.stopPropagation();\r\n        }\r\n    });\r\n\r\n    function setEncoded(link, name, data) {\r\n        var encodedData = encodeURIComponent(data);\r\n\r\n        if (data) {\r\n            link.addClass('active').attr({\r\n                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,\r\n                'download': name\r\n            });\r\n        } else {\r\n            link.removeClass('active');\r\n        }\r\n    }\r\n\r\n    var exportArtifacts = debounce(function() {\r\n\r\n        saveSVG(function(err, svg) {\r\n            setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);\r\n        });\r\n\r\n        saveDiagram(function(err, xml) {\r\n            setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);\r\n        });\r\n    }, 500);\r\n\r\n    modeler.on('commandStack.changed', exportArtifacts);\r\n});\r\n\r\n\r\n\r\n// helpers //////////////////////\r\n\r\nfunction debounce(fn, timeout) {\r\n\r\n    var timer;\r\n\r\n    return function() {\r\n        if (timer) {\r\n            clearTimeout(timer);\r\n        }\r\n\r\n        timer = setTimeout(fn, timeout);\r\n    };\r\n}\n\n//# sourceURL=webpack:///./src/008modeler/008modeler.js?");

/***/ }),

/***/ "./src/008modeler/newDiagram.bpmn":
/*!****************************************!*\
  !*** ./src/008modeler/newDiagram.bpmn ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n<bpmn2:definitions xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" xmlns:bpmn2=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\\" xmlns:bpmndi=\\\"http://www.omg.org/spec/BPMN/20100524/DI\\\" xmlns:dc=\\\"http://www.omg.org/spec/DD/20100524/DC\\\" xmlns:di=\\\"http://www.omg.org/spec/DD/20100524/DI\\\" xsi:schemaLocation=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\\\" id=\\\"sample-diagram\\\" targetNamespace=\\\"http://bpmn.io/schema/bpmn\\\">\\n  <bpmn2:process id=\\\"Process_1\\\" isExecutable=\\\"false\\\">\\n    <bpmn2:startEvent id=\\\"StartEvent_1\\\"/>\\n  </bpmn2:process>\\n  <bpmndi:BPMNDiagram id=\\\"BPMNDiagram_1\\\">\\n    <bpmndi:BPMNPlane id=\\\"BPMNPlane_1\\\" bpmnElement=\\\"Process_1\\\">\\n      <bpmndi:BPMNShape id=\\\"_BPMNShape_StartEvent_2\\\" bpmnElement=\\\"StartEvent_1\\\">\\n        <dc:Bounds height=\\\"36.0\\\" width=\\\"36.0\\\" x=\\\"412.0\\\" y=\\\"240.0\\\"/>\\n      </bpmndi:BPMNShape>\\n    </bpmndi:BPMNPlane>\\n  </bpmndi:BPMNDiagram>\\n</bpmn2:definitions>\");\n\n//# sourceURL=webpack:///./src/008modeler/newDiagram.bpmn?");

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