"use strict";

Vue.component("dataset-simple-select-comp", {
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        getDataSetData: "/Rest/Builder/DataSet/DataSetMain/GetDataSetsForZTreeNodeList"
      },
      dataSetTree: {
        treeObj: null,
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              if (treeNode.nodeTypeName == "DataSet") {
                _self.selectedNode(treeNode);
              }
            }
          }
        },
        treeData: null,
        selectedTableName: "无"
      }
    };
  },
  mounted: function mounted() {
    this.bindDataSetTree();
  },
  methods: {
    bindDataSetTree: function bindDataSetTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getDataSetData, {}, function (result) {
        if (result.success) {
          if (result.data != null && result.data.length > 0) {
            for (var i = 0; i < result.data.length; i++) {
              if (result.data[i].nodeTypeName == "DataSetGroup") {
                result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/package.png";
              } else {
                result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/application_view_columns.png";
              }
            }
          }

          _self.dataSetTree.treeData = result.data;
          _self.dataSetTree.treeObj = $.fn.zTree.init($("#dataSetZTreeUL"), _self.dataSetTree.treeSetting, _self.dataSetTree.treeData);

          _self.dataSetTree.treeObj.expandAll(true);

          fuzzySearchTreeObj(_self.dataSetTree.treeObj, _self.$refs.txt_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    selectedNode: function selectedNode(treeNode) {
      this.$emit('on-selected-dataset', treeNode);
    }
  },
  template: '<div class="js-code-fragment-wrap">\
                    <i-input search class="input_border_bottom" ref="txt_search_text" placeholder="请输入表名或者标题"></i-input>\
                    <ul id="dataSetZTreeUL" class="ztree"></ul>\
                </div>'
});
"use strict";

Vue.component("js-design-code-fragment", {
  data: function data() {
    return {
      jsEditorInstance: null
    };
  },
  mounted: function mounted() {},
  methods: {
    setJSEditorInstance: function setJSEditorInstance(obj) {
      this.jsEditorInstance = obj;
    },
    getJsEditorInst: function getJsEditorInst() {
      return this.jsEditorInstance;
    },
    insertJs: function insertJs(js) {
      var doc = this.getJsEditorInst().getDoc();
      var cursor = doc.getCursor();
      doc.replaceRange(js, cursor);
    },
    formatJS: function formatJS() {
      CodeMirror.commands["selectAll"](this.getJsEditorInst());
      var range = {
        from: this.getJsEditorInst().getCursor(true),
        to: this.getJsEditorInst().getCursor(false)
      };
      ;
      this.getJsEditorInst().autoFormatRange(range.from, range.to);
    },
    alertDesc: function alertDesc() {},
    refScript: function refScript() {
      var js = "<script type=\"text/javascript\" src=\"${contextPath}/Js/IssuesUtility.js?ts=${timeStamp}\"></script>";
      this.insertJs(js);
    },
    callServiceMethod: function callServiceMethod() {}
  },
  template: '<div class="js-code-fragment-wrap">\
            <div class="js-code-fragment-item" @click="formatJS">格式化</div>\
            <div class="js-code-fragment-item">说明1</div>\
            <div class="js-code-fragment-item" @click="refScript">引入脚本</div>\
            <div class="js-code-fragment-item">获取URL参数</div>\
            <div class="js-code-fragment-item">调用服务方法</div>\
            <div class="js-code-fragment-item">加载数据字典</div>\
        </div>'
});
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Vue.component("site-template-relation-comp", {
  props: ["relation"],
  data: function data() {
    return {
      acInterface: {
        editView: "/HTML/Builder/Site/Template/TemplateDesign.html"
      },
      diagramObj: null
    };
  },
  mounted: function mounted() {
    $(this.$refs.relationContentOuterWrap).css("height", PageStyleUtility.GetPageHeight() - 75);
    this.init();
  },
  methods: {
    addEmptyTemplateEvent: function addEmptyTemplateEvent(e, obj) {
      var adornment = obj.part;
      var diagram = e.diagram;
      diagram.startTransaction("Add State");
      var fromNode = adornment.adornedPart;
      var fromData = fromNode.data;
      var toData = {
        text: "new"
      };
      var p = fromNode.location.copy();
      p.x += 200;
      toData.loc = go.Point.stringify(p);
      var model = diagram.model;
      model.addNodeData(toData);
      var linkdata = {
        from: model.getKeyForNodeData(fromData),
        to: model.getKeyForNodeData(toData),
        text: "transition"
      };
      model.addLinkData(linkdata);
      var newnode = diagram.findNodeForData(toData);
      diagram.select(newnode);
      diagram.commitTransaction("Add State");
      diagram.scrollToRect(newnode.actualBounds);
    },
    beginEditTemplateEvent: function beginEditTemplateEvent(e, obj) {
      var url = BaseUtility.BuildView(this.acInterface.editView, {
        "op": "edit",
        "templateId": obj.part.data.id
      });
      DialogUtility.OpenNewTabWindow(url);
    },
    removeTemplateEvent: function removeTemplateEvent(e, obj) {
      this.diagramObj.startTransaction();
      var adornment = obj.part;
      var diagram = e.diagram;
      var fromNode = adornment.adornedPart;
      this.diagramObj.remove(fromNode);
      this.diagramObj.commitTransaction("deleted node");
    },
    getDiagramInstance: function getDiagramInstance($) {
      return $(go.Diagram, "divSiteTemplateRelationWrap", {
        "animationManager.initialAnimationStyle": go.AnimationManager.None,
        "InitialAnimationStarting": function InitialAnimationStarting(e) {
          var animation = e.subject.defaultAnimation;
          animation.easing = go.Animation.EaseOutExpo;
          animation.duration = 900;
          animation.add(e.diagram, 'scale', 0.1, 1);
          animation.add(e.diagram, 'opacity', 0, 1);
        },
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        "clickCreatingTool.archetypeNodeData": {
          text: "new node"
        },
        "undoManager.isEnabled": true,
        positionComputation: function positionComputation(diagram, pt) {
          return new go.Point(Math.floor(pt.x), Math.floor(pt.y));
        }
      });
    },
    getDiagramNodeTemplate: function getDiagramNodeTemplate($) {
      var roundedRectangleParams = {
        parameter1: 2,
        spot1: go.Spot.TopLeft,
        spot2: go.Spot.BottomRight
      };
      return $(go.Node, "Auto", {
        locationSpot: go.Spot.Top,
        isShadowed: true,
        shadowBlur: 1,
        shadowOffset: new go.Point(0, 1),
        shadowColor: "rgba(0, 0, 0, .14)"
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Shape, "RoundedRectangle", roundedRectangleParams, _defineProperty({
        name: "SHAPE",
        fill: "#ffffff",
        strokeWidth: 1,
        stroke: null,
        portId: "",
        fromLinkable: false,
        fromLinkableSelfNode: true,
        fromLinkableDuplicates: true,
        toLinkable: false,
        toLinkableSelfNode: true,
        toLinkableDuplicates: true,
        cursor: "pointer"
      }, "stroke", "hsl(30, 100%, 50%)")), $(go.Panel, "Vertical", {
        defaultAlignment: go.Spot.TopLeft
      }, $(go.TextBlock, {
        font: "bold small-caps 11pt helvetica, bold arial, sans-serif",
        margin: 7,
        stroke: "rgba(0, 0, 0, .87)",
        editable: false
      }, new go.Binding("text").makeTwoWay()), $(go.TextBlock, {
        font: "small-caps 12px helvetica, arial, sans-serif",
        margin: 7,
        alignment: go.Spot.Center,
        stroke: "rgba(0, 0, 0, .87)",
        editable: false
      }, new go.Binding("text", "id").makeTwoWay())));
    },
    getDiagramActiveNodeTemplate: function getDiagramActiveNodeTemplate($) {
      var _self = this;

      var roundedRectangleParams = {
        parameter1: 2,
        spot1: go.Spot.TopLeft,
        spot2: go.Spot.BottomRight
      };
      return $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, "RoundedRectangle", roundedRectangleParams, {
        fill: null,
        stroke: "#7986cb",
        strokeWidth: 2
      }), $(go.Placeholder)), $(go.Panel, "Horizontal", {
        alignment: go.Spot.TopRight,
        alignmentFocus: go.Spot.TopLeft
      }, $("Button", {
        click: _self.addEmptyTemplateEvent,
        toolTip: _self.makeDiagramTooltip($, "Add Exclusive")
      }, $(go.Shape, "PlusLine", {
        width: 12,
        height: 12,
        stroke: "hsl(30, 100%, 50%)"
      })), $("Button", {
        click: _self.beginEditTemplateEvent
      }, $(go.Shape, "Gear", {
        width: 12,
        height: 12,
        fill: "hsl(30, 100%, 50%)",
        stroke: "hsl(30, 100%, 50%)"
      })), $("Button", {
        click: _self.removeTemplateEvent
      }, $(go.Shape, "XLine", {
        width: 12,
        height: 12,
        stroke: "hsl(30, 100%, 50%)"
      }))), $(go.Panel, "Auto", {
        alignment: go.Spot.BottomCenter,
        alignmentFocus: go.Spot.Top
      }, $(go.Shape, "RoundedRectangle", roundedRectangleParams, {
        fill: null,
        stroke: "#2bffb3",
        strokeWidth: 1
      }), $(go.TextBlock, {
        font: "small-caps 12px helvetica, arial, sans-serif",
        margin: 7,
        alignment: go.Spot.BottomCenter,
        alignmentFocus: go.Spot.Top,
        stroke: "rgba(0, 0, 0, .87)",
        editable: false
      }, new go.Binding("text", "desc"))));
    },
    getDiagramStartNodeTemplate: function getDiagramStartNodeTemplate($) {
      return $(go.Node, "Spot", {
        desiredSize: new go.Size(75, 75)
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Shape, "Circle", {
        fill: "#52ce60",
        stroke: null,
        portId: "",
        fromLinkable: false,
        fromLinkableSelfNode: true,
        fromLinkableDuplicates: true,
        toLinkable: false,
        toLinkableSelfNode: true,
        toLinkableDuplicates: true,
        cursor: "pointer"
      }), $(go.TextBlock, "Start", {
        font: "bold 16pt helvetica, bold arial, sans-serif",
        stroke: "whitesmoke"
      }));
    },
    getDiagramEndNodeTemplate: function getDiagramEndNodeTemplate($) {
      return $(go.Node, "Spot", {
        desiredSize: new go.Size(75, 75)
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Shape, "Circle", {
        fill: "maroon",
        stroke: null,
        portId: "",
        fromLinkable: false,
        fromLinkableSelfNode: true,
        fromLinkableDuplicates: true,
        toLinkable: false,
        toLinkableSelfNode: true,
        toLinkableDuplicates: true,
        cursor: "pointer"
      }), $(go.Shape, "Circle", {
        fill: null,
        desiredSize: new go.Size(65, 65),
        strokeWidth: 2,
        stroke: "whitesmoke"
      }), $(go.TextBlock, "End", {
        font: "bold 16pt helvetica, bold arial, sans-serif",
        stroke: "whitesmoke"
      }));
    },
    getDiagramLinkTemplate: function getDiagramLinkTemplate($) {
      return $(go.Link, {
        curve: go.Link.Bezier,
        adjusting: go.Link.Stretch,
        reshapable: true,
        relinkableFrom: true,
        relinkableTo: true,
        toShortLength: 3
      }, new go.Binding("points").makeTwoWay(), new go.Binding("curviness"), $(go.Shape, {
        strokeWidth: 1.5
      }, new go.Binding('stroke', 'progress', function (progress) {
        return progress ? "#52ce60" : 'black';
      }), new go.Binding('strokeWidth', 'progress', function (progress) {
        return progress ? 2.5 : 1.5;
      })), $(go.Shape, {
        toArrow: "standard",
        stroke: null
      }, new go.Binding('fill', 'progress', function (progress) {
        return progress ? "#52ce60" : 'black';
      })), $(go.Panel, "Auto", $(go.Shape, {
        fill: $(go.Brush, "Radial", {
          0: "rgb(245, 245, 245)",
          0.7: "rgb(245, 245, 245)",
          1: "rgba(245, 245, 245, 0)"
        }),
        stroke: null
      }), $(go.TextBlock, "transition", {
        textAlign: "center",
        font: "9pt helvetica, arial, sans-serif",
        margin: 4,
        editable: true
      }, new go.Binding("text").makeTwoWay())));
    },
    makeDiagramTooltip: function makeDiagramTooltip($, tooltip) {
      return $("ToolTip", $(go.TextBlock, tooltip));
    },
    init: function init() {
      var _self = this;

      if (window.goSamples) goSamples();
      var $ = go.GraphObject.make;
      this.diagramObj = this.getDiagramInstance($);
      this.diagramObj.nodeTemplate = this.getDiagramNodeTemplate($);
      this.diagramObj.nodeTemplate.selectionAdornmentTemplate = this.getDiagramActiveNodeTemplate($);
      this.diagramObj.nodeTemplateMap.add("Start", this.getDiagramStartNodeTemplate($));
      this.diagramObj.nodeTemplateMap.add("End", this.getDiagramEndNodeTemplate($));
      this.diagramObj.linkTemplate = this.getDiagramLinkTemplate($);
      this.diagramObj.model = go.Model.fromJson({
        "class": "go.GraphLinksModel",
        "nodeKeyProperty": "id",
        "nodeDataArray": [{
          "id": -3,
          "loc": "185 -158",
          "category": "Start",
          "desc": "那是"
        }, {
          "id": -1,
          "loc": "-73 -150",
          "category": "Start",
          "desc": "那是"
        }, {
          "id": 0,
          "loc": "-24 116",
          "text": "最终幻想",
          "text2": "最终幻想2",
          "desc": "那是"
        }, {
          "id": 1,
          "loc": "273 94",
          "text": "雪中悍刀行",
          "desc": "那是"
        }, {
          "id": "2000A",
          "loc": "352 270",
          "text": "西藏天路叨叨叨",
          "desc": "那是"
        }, {
          "id": 3,
          "loc": "595 -3",
          "text": "大亚湾叨叨叨",
          "desc": "那是"
        }, {
          "id": 4,
          "loc": "894 -190",
          "text": "View Cart",
          "desc": "那是"
        }, {
          "id": 5,
          "loc": "820 202",
          "text": "Update Cart",
          "desc": "那是"
        }, {
          "id": 6,
          "loc": "1052 90",
          "text": "Checkout",
          "desc": "那是"
        }, {
          "id": -2,
          "loc": "1124 263",
          "category": "End",
          "desc": "那是"
        }],
        "linkDataArray": [{
          "from": -1,
          "to": 0,
          "text": "Visit online store"
        }, {
          "from": 0,
          "to": 1,
          "progress": "true",
          "text": "Browse"
        }, {
          "from": 0,
          "to": "2000A",
          "progress": "true",
          "text": "Use search bar"
        }, {
          "from": 1,
          "to": "2000A",
          "progress": "true",
          "text": "Use search bar"
        }, {
          "from": "2000A",
          "to": 3,
          "progress": "true",
          "text": "Click item"
        }, {
          "from": "2000A",
          "to": "2000A",
          "text": "Another search",
          "curviness": 20
        }, {
          "from": 1,
          "to": 3,
          "progress": "true",
          "text": "Click item"
        }, {
          "from": 3,
          "to": 0,
          "text": "Not interested",
          "curviness": -100
        }, {
          "from": 3,
          "to": 4,
          "progress": "true",
          "text": "Add to cart"
        }, {
          "from": 4,
          "to": 0,
          "text": "More shopping",
          "curviness": -150
        }, {
          "from": 4,
          "to": 5,
          "text": "Update needed",
          "curviness": -50
        }, {
          "from": 5,
          "to": 4,
          "text": "Update made"
        }, {
          "from": 4,
          "to": 6,
          "progress": "true",
          "text": "Proceed"
        }, {
          "from": 6,
          "to": 5,
          "text": "Update needed"
        }, {
          "from": 6,
          "to": -2,
          "progress": "true",
          "text": "Purchase made"
        }]
      });
      this.diagramObj.addDiagramListener("ObjectSingleClicked", function (e) {
        var part = e.subject.part;
        console.log(part);
      });
      this.diagramObj.addDiagramListener("SelectionMoved", function (e) {
        var subject = e.subject;
        console.log(subject);
        console.log(JsonUtility.JsonToString(e.diagram.model.nodeDataArray));
        var selectedNode = e.diagram.selection.first();
        console.log("selectedNode", selectedNode);
        console.log("selectedNodeKey", selectedNode.key);
        console.log("selectedNode", selectedNode.location.toString());
        console.log("selectedNode", selectedNode.location.x);
        console.log("selectedNode", selectedNode.location.y);
        console.log("locationObject", selectedNode.locationObject);
      });
    }
  },
  template: "<div ref=\"relationContentOuterWrap\" class=\"site-template-relation-content-outer-wrap\">\n                    <div class=\"site-template-relation-content-wrap\" id=\"divSiteTemplateRelationWrap\">\n                        \u6A21\u7248\u5173\u7CFB\n                    </div>\n                </div>"
});
"use strict";

Vue.component("sql-general-design-comp", {
  props: ["sqlDesignerHeight", "value", "showField"],
  data: function data() {
    return {
      sqlText: "",
      selectedItemValue: "说明",
      selfTableFields: [],
      parentTableFields: []
    };
  },
  watch: {
    sqlText: function sqlText(newVal) {
      this.$emit('input', newVal);
    },
    value: function value(newVal) {
      this.sqlText = newVal;
    }
  },
  mounted: function mounted() {
    this.sqlCodeMirror = CodeMirror.fromTextArea($("#TextAreaSQLEditor")[0], {
      mode: "text/x-sql",
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      theme: "monokai"
    });
    console.log(this.sqlDesignerHeight);
    this.sqlCodeMirror.setSize("100%", this.sqlDesignerHeight);

    var _self = this;

    this.sqlCodeMirror.on("change", function (cMirror) {
      console.log(cMirror.getValue());
      _self.sqlText = cMirror.getValue();
    });
  },
  methods: {
    getValue: function getValue() {
      this.sqlCodeMirror.getValue();
    },
    setValue: function setValue(value) {
      this.sqlCodeMirror.setValue(value);
    },
    setAboutTableFields: function setAboutTableFields(selfTableFields, parentTableFields) {
      this.selfTableFields = selfTableFields;
      this.parentTableFields = parentTableFields;
    },
    insertEnvToEditor: function insertEnvToEditor(code) {
      this.insertCodeAtCursor(code);
    },
    insertFieldToEditor: function insertFieldToEditor(sourceType, event) {
      var sourceFields = null;

      if (sourceType == "selfTableFields") {
        sourceFields = this.selfTableFields;
      } else {
        sourceFields = this.parentTableFields;
      }

      for (var i = 0; i < sourceFields.length; i++) {
        if (sourceFields[i].fieldName == event) {
          this.insertCodeAtCursor(sourceFields[i].tableName + "." + sourceFields[i].fieldName);
        }
      }
    },
    insertCodeAtCursor: function insertCodeAtCursor(code) {
      var doc = this.sqlCodeMirror.getDoc();
      var cursor = doc.getCursor();
      doc.replaceRange(code, cursor);
    }
  },
  template: '<div>\
                <textarea id="TextAreaSQLEditor"></textarea>\
                <div style="text-align: right;margin-top: 8px">\
                    <ButtonGroup size="small">\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户所在组织ID}\')">组织Id</Button>\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户所在组织名称}\')">组织名称</Button>\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户ID}\')">用户Id</Button>\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户名称}\')">用户名称</Button>\
                        <Button @click="insertEnvToEditor(\'#{DateTime.年年年年-月月-日日}\')">yyyy-MM-dd</Button>\
                        <Button>说明</Button>\
                    </ButtonGroup>\
                </div>\
                <div style="margin-top: 8px" v-if="showField">\
                    <div style="float: left;margin: 4px 10px">本表字段</div>\
                    <div style="float: left">\
                        <i-select placeholder="默认使用Id字段" size="small" style="width:175px" @on-change="insertFieldToEditor(\'selfTableFields\',$event)">\
                            <i-option v-for="item in selfTableFields" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>\
                        </i-select>\
                    </div>\
                    <div style="float: left;margin: 4px 10px">父表字段</div>\
                    <div style="float: left">\
                        <i-select placeholder="默认使用Id字段" size="small" style="width:177px" @on-change="insertFieldToEditor(\'parentTableFields\',$event)">\
                            <i-option v-for="item in parentTableFields" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>\
                        </i-select>\
                    </div>\
                </div>\
              </div>'
});
"use strict";

Vue.component("table-relation-content-comp", {
  props: ["relation"],
  data: function data() {
    return {
      acInterface: {
        getTablesFieldsByTableIds: "/Rest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds",
        saveDiagram: "/Rest/Builder/DataStorage/TableRelation/TableRelation/SaveDiagram",
        getSingleDiagramData: "/Rest/Builder/DataStorage/TableRelation/TableRelation/GetDetailData",
        tableView: "/HTML/Builder/DataStorage/DataBase/TableEdit.html"
      },
      tableRelationDiagram: null,
      displayDesc: true,
      formatJson: null,
      recordId: this.relation.relationId
    };
  },
  mounted: function mounted() {
    $(this.$refs.relationContentOuterWrap).css("height", PageStyleUtility.GetPageHeight() - 75);

    if (PageStyleUtility.GetPageWidth() < 1000) {
      this.displayDesc = false;
      $(".table-relation-op-buttons-outer-wrap").css("width", "100%");
    }

    this.initDiagram();
    this.loadRelationDetailData();
  },
  methods: {
    init: function init() {
      if (window.goSamples) goSamples();
      var $ = go.GraphObject.make;
      var myDiagram = $(go.Diagram, "tableRelationDiagramDiv", {
        allowDelete: false,
        allowCopy: false,
        layout: $(go.ForceDirectedLayout),
        "undoManager.isEnabled": true
      });
      var bluegrad = $(go.Brush, "Linear", {
        0: "rgb(150, 150, 250)",
        0.5: "rgb(86, 86, 186)",
        1: "rgb(86, 86, 186)"
      });
      var greengrad = $(go.Brush, "Linear", {
        0: "rgb(158, 209, 159)",
        1: "rgb(67, 101, 56)"
      });
      var redgrad = $(go.Brush, "Linear", {
        0: "rgb(206, 106, 100)",
        1: "rgb(180, 56, 50)"
      });
      var yellowgrad = $(go.Brush, "Linear", {
        0: "rgb(254, 221, 50)",
        1: "rgb(254, 182, 50)"
      });
      var lightgrad = $(go.Brush, "Linear", {
        1: "#E6E6FA",
        0: "#FFFAF0"
      });
      var itemTempl = $(go.Panel, "Horizontal", $(go.Shape, {
        desiredSize: new go.Size(10, 10)
      }, new go.Binding("figure", "figure"), new go.Binding("fill", "color")), $(go.TextBlock, {
        stroke: "#333333",
        font: "bold 14px sans-serif"
      }, new go.Binding("text", "name")));
      myDiagram.nodeTemplate = $(go.Node, "Auto", {
        selectionAdorned: true,
        resizable: true,
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        isShadowed: true,
        shadowColor: "#C5C1AA"
      }, new go.Binding("location", "location").makeTwoWay(), new go.Binding("desiredSize", "visible", function (v) {
        return new go.Size(NaN, NaN);
      }).ofObject("LIST"), $(go.Shape, "Rectangle", {
        fill: lightgrad,
        stroke: "#756875",
        strokeWidth: 3
      }), $(go.Panel, "Table", {
        margin: 8,
        stretch: go.GraphObject.Fill
      }, $(go.RowColumnDefinition, {
        row: 0,
        sizing: go.RowColumnDefinition.None
      }), $(go.TextBlock, {
        row: 0,
        alignment: go.Spot.Center,
        margin: new go.Margin(0, 14, 0, 2),
        font: "bold 16px sans-serif"
      }, new go.Binding("text", "key")), $("PanelExpanderButton", "LIST", {
        row: 0,
        alignment: go.Spot.TopRight
      }), $(go.Panel, "Vertical", {
        name: "LIST",
        row: 1,
        padding: 3,
        alignment: go.Spot.TopLeft,
        defaultAlignment: go.Spot.Left,
        stretch: go.GraphObject.Horizontal,
        itemTemplate: itemTempl
      }, new go.Binding("itemArray", "items"))));
      myDiagram.linkTemplate = $(go.Link, {
        selectionAdorned: true,
        layerName: "Foreground",
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver
      }, $(go.Shape, {
        stroke: "#303B45",
        strokeWidth: 2.5
      }), $(go.TextBlock, {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: 0,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright
      }, new go.Binding("text", "text")), $(go.TextBlock, {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: -1,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright
      }, new go.Binding("text", "toText")));
      var nodeDataArray = [{
        key: "Products",
        items: [{
          name: "ProductID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "ProductName",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "SupplierID",
          iskey: false,
          figure: "Decision",
          color: "purple"
        }, {
          name: "CategoryID",
          iskey: false,
          figure: "Decision",
          color: "purple"
        }]
      }, {
        key: "Suppliers",
        items: [{
          name: "SupplierID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "CompanyName",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "ContactName",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "Address",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }]
      }, {
        key: "Categories",
        items: [{
          name: "CategoryID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "CategoryName",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "Description",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "Picture",
          iskey: false,
          figure: "TriangleUp",
          color: redgrad
        }]
      }, {
        key: "Order Details",
        items: [{
          name: "OrderID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "ProductID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "UnitPrice",
          iskey: false,
          figure: "MagneticData",
          color: greengrad
        }, {
          name: "Quantity",
          iskey: false,
          figure: "MagneticData",
          color: greengrad
        }, {
          name: "Discount",
          iskey: false,
          figure: "MagneticData",
          color: greengrad
        }]
      }];
      var linkDataArray = [{
        from: "Products",
        to: "Suppliers",
        text: "0..N",
        toText: "1"
      }, {
        from: "Products",
        to: "Categories",
        text: "0..N",
        toText: "1"
      }, {
        from: "Order Details",
        to: "Products",
        text: "0..N",
        toText: "1"
      }];
      myDiagram.model = $(go.GraphLinksModel, {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: nodeDataArray,
        linkDataArray: linkDataArray
      });
    },
    showSelectTableDialog: function showSelectTableDialog() {
      this.$refs.selectSingleTableDialog.beginSelectTable();
    },
    showSelectFieldConnectDialog: function showSelectFieldConnectDialog() {
      var fromTableId = "";
      var toTableId = "";
      var i = 0;
      this.tableRelationDiagram.selection.each(function (part) {
        if (part instanceof go.Node) {
          if (i == 0) {
            fromTableId = part.data.tableId;
            i++;
          } else {
            toTableId = part.data.tableId;
          }
        }
      });

      if (!toTableId) {
        toTableId = fromTableId;
      }

      if (fromTableId != "" && toTableId != "") {
        this.$refs.tableRelationConnectTwoTableDialog.beginSelectConnect(fromTableId, toTableId);
      } else {
        DialogUtility.AlertText("请先选中2个节点");
      }
    },
    addTableToDiagram: function addTableToDiagram(tableData) {
      var tableId = tableData.id;
      var tableIds = [tableId];

      var _self = this;

      if (!this.tableIsExistInDiagram(tableId)) {
        AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {
          "tableIds": tableIds
        }, function (result) {
          if (result.success) {
            var allFields = result.data;
            var singleTable = result.exKVData.Tables[0];
            var allFieldsStyle = [];

            for (var i = 0; i < allFields.length; i++) {
              allFields[i].displayText = allFields[i].fieldName + "[" + allFields[i].fieldCaption + "]";
              allFieldsStyle.push(_self.rendererFieldStyle(allFields[i]));
            }

            var modelNodeData = {
              tableId: tableId,
              loc: "0 0",
              fields: allFieldsStyle,
              tableData: singleTable,
              tableName: singleTable.tableName,
              tableCaption: singleTable.tableCaption,
              tableDisplayText: singleTable.tableName + "[" + singleTable.tableCaption + "]",
              key: singleTable.tableId
            };

            _self.tableRelationDiagram.model.startTransaction("flash");

            _self.tableRelationDiagram.model.addNodeData(modelNodeData);

            _self.tableRelationDiagram.model.commitTransaction("flash");
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
          }
        }, this);
      } else {
        DialogUtility.AlertText("该画布中已经存在表:" + tableData.text);
      }
    },
    deleteSelection: function deleteSelection() {
      if (this.tableRelationDiagram.commandHandler.canDeleteSelection()) {
        this.tableRelationDiagram.commandHandler.deleteSelection();
        return;
      }
    },
    connectSelectionNode: function connectSelectionNode(connectData) {
      this.tableRelationDiagram.model.startTransaction("flash");
      var lineData = {
        lineId: StringUtility.Guid(),
        from: connectData.from.tableId,
        to: connectData.to.tableId,
        fromText: connectData.from.text,
        toText: connectData.to.text
      };
      this.tableRelationDiagram.model.addLinkData(lineData);
      this.tableRelationDiagram.model.commitTransaction("flash");
    },
    saveModelToServer: function saveModelToServer() {
      if (this.recordId) {
        var sendData = {
          recordId: this.recordId,
          relationContent: JsonUtility.JsonToString(this.getDataJson()),
          relationDiagramJson: this.getDiagramJson()
        };
        AjaxUtility.Post(this.acInterface.saveDiagram, sendData, function (result) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }, this);
      }
    },
    initDiagram: function initDiagram() {
      var _self = this;

      if (window.goSamples) goSamples();
      var $ = go.GraphObject.make;
      this.tableRelationDiagram = $(go.Diagram, "tableRelationDiagramDiv", {
        allowDelete: true,
        allowCopy: false,
        layout: $(go.ForceDirectedLayout, {
          isOngoing: false
        }),
        "undoManager.isEnabled": true
      });
      var tableRelationDiagram = this.tableRelationDiagram;
      var lightgrad = $(go.Brush, "Linear", {
        1: "#E6E6FA",
        0: "#FFFAF0"
      });
      var itemTempl = $(go.Panel, "Horizontal", $(go.Shape, {
        desiredSize: new go.Size(10, 10)
      }, new go.Binding("figure", "figure"), new go.Binding("fill", "color")), $(go.TextBlock, {
        stroke: "#333333",
        font: "bold 14px sans-serif"
      }, new go.Binding("text", "displayText")));
      tableRelationDiagram.nodeTemplate = $(go.Node, "Auto", {
        selectionAdorned: true,
        resizable: true,
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        isShadowed: true,
        shadowColor: "#C5C1AA",
        doubleClick: function doubleClick(e, node) {
          var url = BaseUtility.BuildView(_self.acInterface.tableView, {
            "op": "view",
            "recordId": node.data.tableId
          });
          DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {
            title: "表设计"
          }, 0);
        }
      }, new go.Binding("location", "loc", go.Point.parse), new go.Binding("desiredSize", "visible", function (v) {
        return new go.Size(NaN, NaN);
      }).ofObject("LIST"), $(go.Shape, "RoundedRectangle", {
        fill: lightgrad,
        stroke: "#756875",
        strokeWidth: 1
      }), $(go.Panel, "Table", {
        margin: 8,
        stretch: go.GraphObject.Fill
      }, $(go.RowColumnDefinition, {
        row: 0,
        sizing: go.RowColumnDefinition.None
      }), $(go.TextBlock, {
        row: 0,
        alignment: go.Spot.Center,
        margin: new go.Margin(0, 14, 0, 2),
        font: "bold 16px sans-serif"
      }, new go.Binding("text", "tableDisplayText")), $("PanelExpanderButton", "LIST", {
        row: 0,
        alignment: go.Spot.TopRight
      }), $(go.Panel, "Vertical", {
        name: "LIST",
        row: 1,
        padding: 3,
        alignment: go.Spot.TopLeft,
        defaultAlignment: go.Spot.Left,
        stretch: go.GraphObject.Horizontal,
        itemTemplate: itemTempl
      }, new go.Binding("itemArray", "fields"))));
      tableRelationDiagram.linkTemplate = $(go.Link, {
        selectionAdorned: true,
        layerName: "Foreground",
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver
      }, $(go.Shape, {
        stroke: "#303B45",
        strokeWidth: 1.5
      }), $(go.TextBlock, {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: 0,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright
      }, new go.Binding("text", "fromText")), $(go.TextBlock, {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: -1,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright
      }, new go.Binding("text", "toText")));
    },
    loadRelationDetailData: function loadRelationDetailData() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getSingleDiagramData, {
        recordId: this.recordId,
        op: "Edit"
      }, function (result) {
        if (result.success) {
          if (result.data.relationContent) {
            var dataJson = JsonUtility.StringToJson(result.data.relationContent);
            console.log(dataJson);

            _self.setDataJson(dataJson);

            _self.convertToFullJson(dataJson, _self.drawObjInDiagram);
          }
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    drawObjInDiagram: function drawObjInDiagram(fullJson) {
      var $ = go.GraphObject.make;
      var bluegrad = $(go.Brush, "Linear", {
        0: "rgb(150, 150, 250)",
        0.5: "rgb(86, 86, 186)",
        1: "rgb(86, 86, 186)"
      });
      var greengrad = $(go.Brush, "Linear", {
        0: "rgb(158, 209, 159)",
        1: "rgb(67, 101, 56)"
      });
      var redgrad = $(go.Brush, "Linear", {
        0: "rgb(206, 106, 100)",
        1: "rgb(180, 56, 50)"
      });
      var yellowgrad = $(go.Brush, "Linear", {
        0: "rgb(254, 221, 50)",
        1: "rgb(254, 182, 50)"
      });
      var linkDataArray = fullJson.lineList;
      this.tableRelationDiagram.model = $(go.GraphLinksModel, {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: fullJson.tableList
      });

      var _self = this;

      window.setTimeout(function () {
        _self.tableRelationDiagram.model.startTransaction("flash");

        for (var i = 0; i < fullJson.lineList.length; i++) {
          var lineData = fullJson.lineList[i];

          _self.tableRelationDiagram.model.addLinkData(lineData);
        }

        _self.tableRelationDiagram.model.commitTransaction("flash");
      }, 500);
    },
    convertToFullJson: function convertToFullJson(simpleJson, func) {
      var fullJson = JsonUtility.CloneSimple(simpleJson);
      var tableIds = new Array();

      for (var i = 0; i < simpleJson.tableList.length; i++) {
        tableIds.push(simpleJson.tableList[i].tableId);
      }

      var _self = this;

      AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {
        "tableIds": tableIds
      }, function (result) {
        if (result.success) {
          var allFields = result.data;
          var allTables = result.exKVData.Tables;

          for (var i = 0; i < fullJson.tableList.length; i++) {
            var singleTableData = _self.getSingleTableData(allTables, fullJson.tableList[i].tableId);

            fullJson.tableList[i].tableData = singleTableData;
            fullJson.tableList[i].tableName = singleTableData.tableName;
            fullJson.tableList[i].tableCaption = singleTableData.tableCaption;
            fullJson.tableList[i].tableDisplayText = singleTableData.displayText;

            var singleTableFieldsData = _self.getSingleTableFieldsData(allFields, fullJson.tableList[i].tableId);

            fullJson.tableList[i].fields = singleTableFieldsData;
            fullJson.tableList[i].key = fullJson.tableList[i].tableId;
          }

          _self.drawObjInDiagram(fullJson);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    getSingleTableData: function getSingleTableData(allTables, tableId) {
      for (var i = 0; i < allTables.length; i++) {
        if (allTables[i].tableId == tableId) {
          allTables[i].displayText = allTables[i].tableName + "[" + allTables[i].tableCaption + "]";
          return allTables[i];
        }
      }

      return null;
    },
    getSingleTableFieldsData: function getSingleTableFieldsData(allFields, tableId) {
      var result = [];

      for (var i = 0; i < allFields.length; i++) {
        if (allFields[i].fieldTableId == tableId) {
          allFields[i].displayText = allFields[i].fieldName + "[" + allFields[i].fieldCaption + "]";
          result.push(this.rendererFieldStyle(allFields[i]));
        }
      }

      return result;
    },
    rendererFieldStyle: function rendererFieldStyle(field) {
      if (field.fieldIsPk == "是") {
        field.color = this.getKeyFieldBrush();
        field.figure = "Decision";
      } else {
        field.color = this.getNorFieldBrush();
        field.figure = "Cube1";
      }

      return field;
    },
    getKeyFieldBrush: function getKeyFieldBrush() {
      return go.GraphObject.make(go.Brush, "Linear", {
        0: "rgb(254, 221, 50)",
        1: "rgb(254, 182, 50)"
      });
    },
    getNorFieldBrush: function getNorFieldBrush() {
      return go.GraphObject.make(go.Brush, "Linear", {
        0: "rgb(150, 150, 250)",
        0.5: "rgb(86, 86, 186)",
        1: "rgb(86, 86, 186)"
      });
    },
    getDataJson: function getDataJson() {
      var dataJson = {
        tableList: [],
        lineList: []
      };
      this.tableRelationDiagram.nodes.each(function (part) {
        if (part instanceof go.Node) {
          dataJson.tableList.push({
            tableId: part.data.tableId,
            loc: part.location.x + " " + part.location.y
          });
        } else if (part instanceof go.Link) {
          alert("line");
        }
      });
      this.tableRelationDiagram.links.each(function (part) {
        if (part instanceof go.Link) {
          dataJson.lineList.push({
            lineId: part.data.lineId,
            from: part.data.from,
            to: part.data.to,
            fromText: part.data.fromText,
            toText: part.data.toText
          });
        }
      });
      return dataJson;
    },
    setDataJson: function setDataJson(json) {
      this.formatJson = json;
    },
    getDiagramJson: function getDiagramJson() {
      return this.tableRelationDiagram.model.toJson();
    },
    alertDataJson: function alertDataJson() {
      var dataJson = this.getDataJson();
      DialogUtility.AlertJsonCode(dataJson);
    },
    alertDiagramJson: function alertDiagramJson() {
      var diagramJson = this.getDiagramJson();
      DialogUtility.AlertJsonCode(diagramJson);
    },
    tableIsExistInDiagram: function tableIsExistInDiagram(tableId) {
      var result = false;
      this.tableRelationDiagram.nodes.each(function (part) {
        if (part instanceof go.Node) {
          if (part.data.tableId == tableId) {
            result = true;
          }
        }
      });
      return result;
    },
    downLoadModelPNG: function downLoadModelPNG() {
      function myCallback(blob) {
        var url = window.URL.createObjectURL(blob);
        var filename = "myBlobFile1.png";
        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = filename;

        if (window.navigator.msSaveBlob !== undefined) {
          window.navigator.msSaveBlob(blob, filename);
          return;
        }

        document.body.appendChild(a);
        requestAnimationFrame(function () {
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
      }

      var blob = this.tableRelationDiagram.makeImageData({
        background: "white",
        returnType: "blob",
        scale: 1,
        callback: myCallback
      });
    }
  },
  template: "<div ref=\"relationContentOuterWrap\" class=\"table-relation-content-outer-wrap\">\n                    <div class=\"table-relation-content-header-wrap\">\n                        <div class=\"table-relation-desc-outer-wrap\" v-if=\"displayDesc\">\n                            <div class=\"table-relation-desc\">\n                                \u5907\u6CE8\uFF1A{{relation.relationDesc}}\n                            </div>\n                        </div>\n                        <div class=\"table-relation-op-buttons-outer-wrap\">\n                            <div class=\"table-relation-op-buttons-inner-wrap\">\n                                <button-group shape=\"circle\">\n                                    <i-button @click=\"showSelectTableDialog\" type=\"success\" icon=\"md-add\"></i-button>\n                                    <i-button @click=\"showSelectFieldConnectDialog\" type=\"primary\" icon=\"logo-steam\">\u8FDE\u63A5</i-button>\n                                    <i-button disabled type=\"primary\" icon=\"md-return-left\">\u5F15\u5165</i-button>\n                                    <i-button disabled type=\"primary\" icon=\"md-qr-scanner\">\u5168\u5C4F</i-button>\n                                    <i-button disabled type=\"primary\" icon=\"md-git-compare\">\u5386\u53F2</i-button>\n                                    <i-button @click=\"alertDataJson\" type=\"primary\" icon=\"md-code\">\u6570\u636EJson</i-button>\n                                    <i-button @click=\"alertDiagramJson\" type=\"primary\" icon=\"md-code-working\">\u56FE\u5F62Json</i-button>\n                                    <i-button @click=\"downLoadModelPNG\" type=\"primary\" icon=\"md-cloud-download\">\u4E0B\u8F7D</i-button>\n                                    <i-button @click=\"saveModelToServer\" type=\"primary\" icon=\"logo-instagram\">\u4FDD\u5B58</i-button>\n                                    <i-button @click=\"deleteSelection\" type=\"primary\" icon=\"md-close\"></i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"table-relation-content-wrap\" id=\"tableRelationDiagramDiv\"></div>\n                    <select-single-table-dialog ref=\"selectSingleTableDialog\" @on-selected-table=\"addTableToDiagram\"></select-single-table-dialog>\n                    <table-relation-connect-two-table-dialog ref=\"tableRelationConnectTwoTableDialog\" @on-completed-connect=\"connectSelectionNode\"></table-relation-connect-two-table-dialog>\n                </div>"
});
"use strict";

Vue.component("select-default-value-dialog", {
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        getGroupTreeData: "/Rest/Builder/EnvVariableGroup/GetTreeData",
        reloadListData: "/Rest/Builder/EnvVariable/GetListData"
      },
      selectType: "Const",
      selectValue: "",
      selectText: "",
      constValue: "",
      listHeight: 470,
      tree: {
        treeIdFieldName: "envGroupId",
        treeObj: null,
        treeSelectedNode: null,
        treeSetting: {
          async: {
            enable: true,
            url: ""
          },
          data: {
            key: {
              name: "envGroupText"
            },
            simpleData: {
              enable: true,
              idKey: "envGroupId",
              pIdKey: "envGroupParentId",
              rootId: 0
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              var _self = this.getZTreeObj(treeId)._host;

              _self.treeNodeSelected(event, treeId, treeNode);
            },
            onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {
              appList.treeObj.expandAll(true);
            }
          }
        }
      },
      tableData: [],
      columnsConfig: [{
        title: '变量名称',
        key: 'envVarText',
        align: "center"
      }, {
        title: '变量值',
        key: 'envVarValue',
        align: "center"
      }, {
        title: '操作',
        key: 'envVarId',
        width: 120,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            "class": "list-row-button-wrap"
          }, [ListPageUtility.IViewTableInnerButton.SelectedButton(h, params, "envVarId", _self)]);
        }
      }],
      searchCondition: {
        envVarGroupId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      pageTotal: 0,
      pageSize: 100,
      pageNum: 1
    };
  },
  mounted: function mounted() {
    this.loadData();
  },
  methods: {
    beginSelect: function beginSelect(oldData) {
      console.log(oldData);
      var elem = this.$refs.selectDefaultValueDialogWrap;
      var height = 450;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        height: 680,
        width: 980,
        title: "设置默认值"
      });
      $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.document).find(".ui-dialog").css("zIndex", 10101);

      if (oldData == null) {
        this.selectValue = "";
        this.selectText = "";
        this.constValue = "";
      }

      ;
    },
    loadData: function loadData() {
      AjaxUtility.Post(this.acInterface.getGroupTreeData, {}, function (result) {
        console.log(result);

        if (result.success) {
          if (result.data != null && result.data.length > 0) {
            for (var i = 0; i < result.data.length; i++) {}
          }

          this.tree.treeObj = $.fn.zTree.init($("#zTreeUL"), this.tree.treeSetting, result.data);
          this.tree.treeObj.expandAll(true);
          this.tree.treeObj._host = this;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        }
      }, this);
    },
    getSelectInstanceName: function getSelectInstanceName() {
      return BaseUtility.GetUrlParaValue("instanceName");
    },
    selectComplete: function selectComplete() {
      var result = {};

      if (this.selectType == "Const") {
        if (this.constValue == "") {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请设置常量默认值！", null);
          return;
        }

        result.Type = "Const";
        result.Value = this.constValue;
        result.Text = this.constValue;
      } else {
        result.Type = "EnvVar";
        result.Value = this.selectValue;
        result.Text = this.selectText;
      }

      this.$emit('on-selected-default-value', result);
      this.handleClose();
    },
    clearComplete: function clearComplete() {
      this.$emit('on-selected-default-value', null);
      this.handleClose();
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectDefaultValueDialogWrap);
    },
    selectionChange: function selectionChange() {},
    clearSearchCondition: function clearSearchCondition() {
      for (var key in this.searchCondition) {
        this.searchCondition[key].value = "";
      }
    },
    treeNodeSelected: function treeNodeSelected(event, treeId, treeNode) {
      this.pageNum = 1;
      this.clearSearchCondition();
      this.searchCondition.envVarGroupId.value = treeNode[this.tree.treeIdFieldName];
      this.reloadData();
    },
    reloadData: function reloadData() {
      ListPageUtility.IViewTableBindDataBySearch({
        url: this.acInterface.reloadListData,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition,
        pageAppObj: this,
        tableList: this,
        idField: "envVarId",
        autoSelectedOldRows: true,
        successFunc: null,
        loadDict: false,
        custParas: {}
      });
    },
    selected: function selected(id, params) {
      console.log(params);
      this.selectValue = params.row.envVarValue;
      this.selectText = params.row.envVarText;
    }
  },
  template: "<div  ref=\"selectDefaultValueDialogWrap\" class=\"general-edit-page-wrap\" style=\"display: none;margin-top: 0px\">\n                    <tabs :value=\"selectType\" v-model=\"selectType\">\n                        <tab-pane label=\"\u5E38\u91CF\" name=\"Const\" >\n                            <i-form :label-width=\"80\" style=\"width: 80%;margin: 50px auto auto;\">\n                                <form-item label=\"\u5E38\u91CF\uFF1A\">\n                                    <i-input v-model=\"constValue\"></i-input>\n                                </form-item>\n                            </i-form>\n                        </tab-pane>\n                        <tab-pane label=\"\u73AF\u5883\u53D8\u91CF\" name=\"EnvVar\">\n                            <div style=\"height: 45px;border-bottom: dotted 1px #8a8a8a;margin-bottom: 10px;\">\n                                <div style=\"float: right;padding: 8px;border-radius: 8px;color:orangered;border: solid 1px #adbed8;\">\u5DF2\u7ECF\u9009\u62E9\uFF1A{{selectText}}</div>\n                            </div>\n                            <div>\n                                <div style=\"width: 30%;float: left;height: 514px\">\n                                    <div class=\"inner-wrap\">\n                                        <div>\n                                            <ul id=\"zTreeUL\" class=\"ztree\"></ul>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div style=\"width: 68%;float: left;height: 514px\" class=\"iv-list-page-wrap\">\n                                    <i-table :height=\"listHeight\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                                             class=\"iv-list-table\" :highlight-row=\"true\"\n                                             @on-selection-change=\"selectionChange\"></i-table>\n                                </div>\n                            </div>\n                        </tab-pane>\n                    </tabs>\n                    <div class=\"button-outer-wrap\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"selectComplete()\"> \u786E \u8BA4 </i-button>\n                                <i-button type=\"primary\" @click=\"clearComplete()\"> \u6E05 \u7A7A </i-button>\n                                <i-button @click=\"handleClose()\">\u5173 \u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
});
var DefaultValueUtility = {
  formatText: function formatText(type, text) {
    if (type == "Const") {
      return "静态值:【" + text + "】";
    } else if (type == "EnvVar") {
      return "环境变量:【" + text + "】";
    } else if (type == "") {
      return "【无】";
    }

    return "未知类型" + text;
  }
};
"use strict";

Vue.component("select-single-table-dialog", {
  data: function data() {
    return {
      acInterface: {
        getTableDataUrl: "/Rest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList"
      },
      jsEditorInstance: null,
      tableTree: {
        treeObj: null,
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            radioType: "all"
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              var _self = this.getZTreeObj(treeId)._host;

              if (treeNode.nodeTypeName == "Table") {
                _self.selectedTable(event, treeId, treeNode);
              } else {
                _self.selectedTable(event, treeId, null);
              }
            }
          }
        },
        treeData: null,
        clickNode: null
      },
      selectedTableData: null
    };
  },
  mounted: function mounted() {},
  methods: {
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectTableModelDialogWrap);
    },
    beginSelectTable: function beginSelectTable() {
      var elem = this.$refs.selectTableModelDialogWrap;
      this.getTableDataInitTree();
      var height = 450;

      if (PageStyleUtility.GetPageHeight() > 550) {
        height = 600;
      }

      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 570,
        height: height,
        title: "选择表"
      });
    },
    getTableDataInitTree: function getTableDataInitTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getTableDataUrl, {}, function (result) {
        if (result.success) {
          _self.tableTree.treeData = result.data;

          _self.$refs.tableZTreeUL.setAttribute("id", "select-table-single-comp-" + StringUtility.Guid());

          _self.tableTree.treeObj = $.fn.zTree.init($(_self.$refs.tableZTreeUL), _self.tableTree.treeSetting, _self.tableTree.treeData);

          _self.tableTree.treeObj.expandAll(true);

          _self.tableTree.treeObj._host = _self;
          fuzzySearchTreeObj(_self.tableTree.treeObj, _self.$refs.txt_table_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    selectedTable: function selectedTable(event, treeId, tableData) {
      this.selectedTableData = tableData;
    },
    completed: function completed() {
      if (this.selectedTableData) {
        this.$emit('on-selected-table', this.selectedTableData);
        this.handleClose();
      } else {
        DialogUtility.AlertText("请选择表!");
      }
    }
  },
  template: "<div ref=\"selectTableModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div class=\"c1-select-model-source-wrap c1-select-model-source-has-buttons-wrap\">\n                        <i-input search class=\"input_border_bottom\" ref=\"txt_table_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u8868\u540D\u6216\u8005\u6807\u9898\">\n                        </i-input>\n                        <div class=\"inner-wrap div-custom-scroll\">\n                            <ul ref=\"tableZTreeUL\" class=\"ztree\"></ul>\n                        </div>\n                    </div>\n                    <div class=\"button-outer-wrap\" style=\"bottom: 12px;right: 12px\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"completed()\" icon=\"md-checkmark\">\u786E\u8BA4</i-button>\n                                <i-button @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n               </div>"
});
"use strict";

Vue.component("select-single-webform-dialog", {
  data: function data() {
    return {
      acInterface: {
        getTableDataUrl: "/Rest/Builder/Form/GetWebFormForZTreeNodeList"
      },
      jsEditorInstance: null,
      tree: {
        treeObj: null,
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            radioType: "all"
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              var _self = this.getZTreeObj(treeId)._host;

              if (treeNode.nodeTypeName == "WebForm") {
                _self.selectedForm(event, treeId, treeNode);
              }
            }
          }
        },
        treeData: null
      },
      selectedFormData: null,
      oldSelectedFormId: ""
    };
  },
  mounted: function mounted() {},
  methods: {
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectModelDialogWrap);
    },
    beginSelectForm: function beginSelectForm(formId) {
      var elem = this.$refs.selectModelDialogWrap;
      this.getFormDataInitTree();
      this.oldSelectedFormId = formId;
      var height = 500;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 570,
        height: height,
        title: "选择窗体"
      });
    },
    getFormDataInitTree: function getFormDataInitTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getTableDataUrl, {}, function (result) {
        if (result.success) {
          _self.tree.treeData = result.data;

          for (var i = 0; i < _self.tree.treeData.length; i++) {
            if (_self.tree.treeData[i].nodeTypeName == "WebForm") {
              _self.tree.treeData[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/table.png";
            } else if (_self.tree.treeData[i].nodeTypeName == "Module") {
              _self.tree.treeData[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/folder-table.png";
            }
          }

          _self.$refs.formZTreeUL.setAttribute("id", "select-form-single-comp-" + StringUtility.Guid());

          _self.tree.treeObj = $.fn.zTree.init($(_self.$refs.formZTreeUL), _self.tree.treeSetting, _self.tree.treeData);

          _self.tree.treeObj.expandAll(true);

          _self.tree.treeObj._host = _self;
          fuzzySearchTreeObj(_self.tree.treeObj, _self.$refs.txt_form_search_text.$refs.input, null, true);

          if (_self.oldSelectedFormId != null && _self.oldSelectedFormId != "") {
            var selectedNode = _self.tree.treeObj.getNodeByParam("id", _self.oldSelectedFormId);

            _self.tree.treeObj.selectNode(selectedNode);
          }
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    selectedForm: function selectedForm(event, treeId, formData) {
      this.selectedFormData = formData;
    },
    completed: function completed() {
      if (this.selectedFormData) {
        var result = {
          formModuleId: this.selectedFormData.attr4,
          formModuleName: this.selectedFormData.attr3,
          formId: this.selectedFormData.id,
          formName: this.selectedFormData.attr1,
          formCode: this.selectedFormData.attr2
        };
        this.$emit('on-selected-form', result);
        this.handleClose();
      } else {
        DialogUtility.AlertText("请选择窗体!");
      }
    }
  },
  template: "<div ref=\"selectModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none;\">\n                    <div class=\"c1-select-model-source-wrap c1-select-model-source-has-buttons-wrap\">\n                        <i-input search class=\"input_border_bottom\" ref=\"txt_form_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u8868\u5355\u540D\u79F0\">\n                        </i-input>\n                        <div class=\"inner-wrap div-custom-scroll\">\n                            <ul ref=\"formZTreeUL\" class=\"ztree\"></ul>\n                        </div>\n                    </div>\n                    <div class=\"button-outer-wrap\" style=\"bottom: 12px;right: 12px\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"completed()\" icon=\"md-checkmark\">\u786E\u8BA4</i-button>\n                                <i-button @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n               </div>"
});
"use strict";

Vue.component("select-validate-rule-dialog", {
  data: function data() {
    var _self = this;

    return {
      selectValidateType: "NoEmpty",
      ruleParas: {
        msg: "字段",
        numLength: 4,
        decimalLength: 0,
        jsMethodName: "",
        regularText: "",
        regularMsg: ""
      },
      addedValidateRule: [],
      validateColumnsConfig: [{
        title: '类型',
        key: 'validateType',
        width: 150,
        align: "center"
      }, {
        title: '参数',
        key: 'validateParas',
        align: "center"
      }, {
        title: '删除',
        key: 'validateId',
        width: 120,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            "class": "list-row-button-wrap"
          }, [h('div', {
            "class": "list-row-button del",
            on: {
              click: function click() {
                _self.delValidate(params.row["validateId"]);
              }
            }
          })]);
        }
      }]
    };
  },
  mounted: function mounted() {},
  methods: {
    beginSelect: function beginSelect(oldData) {
      var elem = this.$refs.selectValidateRuleDialogWrap;
      var height = 450;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        height: 680,
        width: 980,
        title: "设置验证规则"
      });
      $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.document).find(".ui-dialog").css("zIndex", 10101);
      this.ruleParas.msg = "auto";
      this.ruleParas.numLength = 4;
      this.ruleParas.decimalLength = 0;
      this.ruleParas.jsMethodName = "";
      this.ruleParas.regularText = "";
      this.ruleParas.regularMsg = "";
      this.addedValidateRule = [];
      this.bindOldSelectedValue(oldData);
    },
    bindOldSelectedValue: function bindOldSelectedValue(oldData) {
      var oldSelectedValue = oldData;

      if (oldSelectedValue.rules.length > 0) {
        this.addedValidateRule = oldSelectedValue.rules;
        this.ruleParas.msg = oldSelectedValue.msg;
      }
    },
    getSelectInstanceName: function getSelectInstanceName() {
      return BaseUtility.GetUrlParaValue("instanceName");
    },
    selectComplete: function selectComplete() {
      var result = this.addedValidateRule;

      if (this.addedValidateRule.length > 0) {
        var result = {
          msg: this.ruleParas.msg,
          rules: this.addedValidateRule
        };
        this.$emit('on-selected-validate-rule', JsonUtility.CloneSimple(result));
        this.handleClose();
      } else {
        this.clearComplete();
      }
    },
    clearComplete: function clearComplete() {
      this.$emit('on-clear-validate-rule');
      this.handleClose();
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectValidateRuleDialogWrap);
    },
    addValidateRule: function addValidateRule() {
      var validateParas = "";

      if (this.selectValidateType == "Number") {
        validateParas = JsonUtility.JsonToString({
          numLength: this.ruleParas.numLength,
          decimalLength: this.ruleParas.decimalLength
        });
      } else if (this.selectValidateType == "Regular") {
        validateParas = JsonUtility.JsonToString({
          regularText: this.ruleParas.regularText,
          regularMsg: this.ruleParas.regularMsg
        });
      } else if (this.selectValidateType == "JsMethod") {
        validateParas = JsonUtility.JsonToString({
          jsMethodName: this.ruleParas.jsMethodName
        });
      }

      var newValidateRule = {
        "validateId": StringUtility.Timestamp(),
        "validateType": this.selectValidateType,
        "validateParas": validateParas
      };
      this.addedValidateRule.push(newValidateRule);
    },
    delValidate: function delValidate(validateId) {
      for (var i = 0; i < this.addedValidateRule.length; i++) {
        if (this.addedValidateRule[i].validateId == validateId) {
          this.addedValidateRule.splice(i, 1);
        }
      }
    }
  },
  template: "<div ref=\"selectValidateRuleDialogWrap\" v-cloak class=\"general-edit-page-wrap\" style=\"display: none\">\n                    <card style=\"margin-top: 10px\" >\n                        <p slot=\"title\">\u8BBE\u7F6E\u9A8C\u8BC1\u89C4\u5219</p>\n                        <div>\n                            <radio-group type=\"button\" style=\"margin: auto\" v-model=\"selectValidateType\">\n                                <radio label=\"NoEmpty\">\u4E0D\u4E3A\u7A7A</radio>\n                                <radio label=\"Number\">\u6570\u5B57</radio>\n                                <radio label=\"Mobile\">\u624B\u673A</radio>\n                                <radio label=\"Date\">\u65E5\u671F</radio>\n                                <radio label=\"Time\">\u65F6\u95F4</radio>\n                                <radio label=\"DateTime\">\u65E5\u671F\u65F6\u95F4</radio>\n                                <radio label=\"EMail\">\u90AE\u4EF6</radio>\n                                <radio label=\"IDCard\">\u8EAB\u4EFD\u8BC1</radio>\n                                <radio label=\"URL\">URL</radio>\n                                <radio label=\"ENCode\">\u82F1\u6587</radio>\n                                <radio label=\"SimpleCode\">\u7279\u6B8A\u5B57\u7B26</radio>\n                                <radio label=\"Regular\">\u6B63\u5219\u8868\u8FBE\u5F0F</radio>\n                                <radio label=\"JsMethod\">JS\u65B9\u6CD5</radio>\n                            </radio-group>\n                            <i-button type=\"success\" shape=\"circle\" icon=\"md-add\" style=\"margin-left: 15px;cursor: pointer\" @click=\"addValidateRule\"></i-button>\n                        </div>\n                        <div>\n                            <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px\">\u53C2\u6570\u8BBE\u7F6E</divider>\n                            <!--\u6570\u5B57\u7C7B\u578B\u53C2\u6570\u8BBE\u7F6E-->\n                            <div v-if=\"selectValidateType=='Number'\">\n                                <i-form :label-width=\"80\">\n                                    <form-item label=\"\u957F\u5EA6\uFF1A\">\n                                        <row>\n                                            <i-col span=\"10\">\n                                                <form-item>\n                                                    <input-number :max=\"10\" :min=\"1\" v-model=\"ruleParas.numLength\" size=\"small\" style=\"width: 80%\"></input-number>\n                                                </form-item>\n                                            </i-col>\n                                            <i-col span=\"4\" style=\"text-align: center\">\u5C0F\u6570\u4F4D\u6570\uFF1A</i-col>\n                                            <i-col span=\"10\">\n                                                <form-item>\n                                                    <input-number :max=\"10\" :min=\"0\" v-model=\"ruleParas.decimalLength\" size=\"small\" style=\"width: 80%\"></input-number>\n                                                </form-item>\n                                            </i-col>\n                                        </row>\n                                    </form-item>\n                                </i-form>\n                            </div>\n                            <!--\u6B63\u5219\u8868\u8FBE\u5F0F\u7C7B\u578B\u53C2\u6570\u8BBE\u7F6E-->\n                            <div v-if=\"selectValidateType=='Regular'\">\n                                <i-form :label-width=\"80\">\n                                    <form-item label=\"\u8868\u8FBE\u5F0F\uFF1A\">\n                                        <row>\n                                            <i-col span=\"10\">\n                                                <form-item>\n                                                    <i-input size=\"small\" placeholder=\"Enter something...\" v-model=\"ruleParas.regularText\" style=\"width: 80%\"></i-input>\n                                                </form-item>\n                                            </i-col>\n                                            <i-col span=\"4\" style=\"text-align: center\">\u63D0\u793A\u4FE1\u606F\uFF1A</i-col>\n                                            <i-col span=\"10\">\n                                                <form-item>\n                                                    <i-input size=\"small\" placeholder=\"Enter something...\" v-model=\"ruleParas.regularMsg\" style=\"width: 80%\"></i-input>\n                                                </form-item>\n                                            </i-col>\n                                        </row>\n                                    </form-item>\n                                </i-form>\n                            </div>\n                            <!--JS\u65B9\u6CD5\u7C7B\u578B\u53C2\u6570\u8BBE\u7F6E-->\n                            <div v-if=\"selectValidateType=='JsMethod'\">\n                                <i-form :label-width=\"80\">\n                                    <form-item label=\"\u65B9\u6CD5\u540D\uFF1A\">\n                                        <i-input size=\"small\" placeholder=\"Enter something...\" v-model=\"ruleParas.jsMethodName\" style=\"width: 90%\"></i-input>\n                                    </form-item>\n                                </i-form>\n                            </div>\n                        </div>\n                    </card>\n                    <card style=\"margin-top: 10px\">\n                        <p slot=\"title\">\u5DF2\u6DFB\u52A0\u89C4\u5219</p>\n                        <div>\n                            <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px;margin-top: 0px;margin-bottom: 6px\">\u63D0\u793A\u4FE1\u606F</divider>\n                            <i-form :label-width=\"0\">\n                                <form-item label=\"\">\n                                    <i-input  placeholder=\"\u8BF7\u8F93\u5165\u63D0\u793A\u4FE1\u606F...\"  v-model=\"ruleParas.msg\"></i-input>\n                                </form-item>\n                            </i-form>\n                        </div>\n                        <div style=\"margin-bottom: 10px;overflow: auto\" class=\"iv-list-page-wrap\">\n                            <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px;margin-top: 0px;margin-bottom: 6px\">\u9A8C\u8BC1\u89C4\u5219</divider>\n                            <i-table border :columns=\"validateColumnsConfig\" :data=\"addedValidateRule\"\n                                     class=\"iv-list-table\" size=\"small\" no-data-text=\"\u8BF7\u6DFB\u52A0\u9A8C\u8BC1\u89C4\u5219\" :height=\"130\"></i-table>\n                        </div>\n                    </card>\n                    <div class=\"button-outer-wrap\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"selectComplete()\"> \u786E \u8BA4 </i-button>\n                                <i-button type=\"primary\" @click=\"clearComplete()\"> \u6E05 \u7A7A </i-button>\n                                <i-button @click=\"handleClose()\">\u5173 \u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("table-relation-connect-two-table-dialog", {
  data: function data() {
    return {
      acInterface: {
        getTablesFieldsByTableIds: "/Rest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds"
      },
      fromTableField: {
        fieldData: [],
        columnsConfig: [{
          title: '字段名称',
          key: 'fieldName',
          align: "center"
        }, {
          title: '标题',
          key: 'fieldCaption',
          align: "center"
        }]
      },
      toTableField: {
        fieldData: [],
        columnsConfig: [{
          title: '字段名称',
          key: 'fieldName',
          align: "center"
        }, {
          title: '标题',
          key: 'fieldCaption',
          align: "center"
        }]
      },
      dialogHeight: 0,
      resultData: {
        from: {
          tableId: "",
          text: ""
        },
        to: {
          tableId: "",
          text: ""
        }
      }
    };
  },
  mounted: function mounted() {},
  methods: {
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.connectTableFieldModelDialogWrap);
    },
    completed: function completed() {
      if (this.resultData.from.text != "" && this.resultData.to.text != "") {
        this.$emit('on-completed-connect', this.resultData);
        this.handleClose();
      } else {
        DialogUtility.AlertText("请设置关联字段");
      }
    },
    getFieldsAndBind: function getFieldsAndBind(fromTableId, toTableId) {
      var tableIds = [fromTableId, toTableId];

      var _self = this;

      AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {
        "tableIds": tableIds
      }, function (result) {
        if (result.success) {
          var allFields = result.data;
          var allTables = result.exKVData.Tables;

          var fromTableFields = _self.getSingleTableFieldsData(allFields, fromTableId);

          var toTableFields = _self.getSingleTableFieldsData(allFields, toTableId);

          _self.fromTableField.fieldData = fromTableFields;
          _self.toTableField.fieldData = toTableFields;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    beginSelectConnect: function beginSelectConnect(fromTableId, toTableId) {
      var elem = this.$refs.connectTableFieldModelDialogWrap;
      this.resultData.from.tableId = fromTableId;
      this.resultData.to.tableId = toTableId;
      this.resultData.from.text = "";
      this.resultData.to.text = "";
      this.getFieldsAndBind(fromTableId, toTableId);
      var height = 450;

      if (PageStyleUtility.GetPageHeight() > 550) {
        height = 600;
      }

      this.dialogHeight = height;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 870,
        height: height,
        title: "设置关联"
      });
    },
    getSingleTableFieldsData: function getSingleTableFieldsData(allFields, tableId) {
      var result = [];

      for (var i = 0; i < allFields.length; i++) {
        if (allFields[i].fieldTableId == tableId) {
          result.push(allFields[i]);
        }
      }

      return result;
    },
    selectedFromField: function selectedFromField(row, index) {
      this.resultData.from.text = row.fieldName + "[1]";
    },
    selectedToField: function selectedToField(row, index) {
      this.resultData.to.text = row.fieldName + "[0..N]";
    }
  },
  template: "<div ref=\"connectTableFieldModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div class=\"c1-select-model-source-wrap c1-select-model-source-has-buttons-wrap\" style=\"padding: 10px\">\n                        <div style=\"float: left;width: 49%;height: 100%;\">\n                            <i-input v-model=\"resultData.from.text\" suffix=\"md-done-all\" placeholder=\"\u5F00\u59CB\u5173\u8054\u5B57\u6BB5\" style=\"margin-bottom: 10px\">\n                            </i-input>\n                            <i-table @on-row-click=\"selectedFromField\" size=\"small\" :height=\"dialogHeight-180\" stripe border :columns=\"fromTableField.columnsConfig\" :data=\"fromTableField.fieldData\"\n                                         class=\"iv-list-table\" :highlight-row=\"true\"></i-table>\n                        </div>\n                        <div style=\"float:right;width: 49%;height: 100%;\">\n                            <i-input v-model=\"resultData.to.text\" suffix=\"md-done-all\" placeholder=\"\u7ED3\u675F\u5173\u8054\u5B57\u6BB5\" style=\"margin-bottom: 10px\">\n                            </i-input>\n                            <i-table @on-row-click=\"selectedToField\" size=\"small\" :height=\"dialogHeight-180\" stripe border :columns=\"toTableField.columnsConfig\" :data=\"toTableField.fieldData\"\n                                         class=\"iv-list-table\" :highlight-row=\"true\"></i-table>\n                        </div>\n                    </div>\n                    <div class=\"button-outer-wrap\" style=\"bottom: 12px;right: 12px\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"completed()\" icon=\"md-checkmark\">\u786E\u8BA4</i-button>\n                                <i-button @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n               </div>"
});
"use strict";

Vue.component("db-table-relation-comp", {
  data: function data() {
    return {
      acInterface: {
        getTablesDataUrl: "/Rest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
        getTableFieldsUrl: "/Rest/Builder/DataStorage/DataBase/Table/GetTableFieldsByTableId"
      },
      relationTableTree: {
        treeObj: null,
        tableTreeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              var _self = window._dbtablerelationcomp;

              _self.selectedRelationTableNode(treeNode);
            }
          }
        },
        tableTreeRootData: {
          id: "-1",
          text: "数据关联",
          parentId: "",
          nodeTypeName: "根节点",
          icon: "../../../Themes/Png16X16/coins_add.png",
          _nodeExType: "root",
          tableId: "-1"
        },
        currentSelectedNode: null
      },
      relationTableEditorView: {
        isShowTableEditDetail: false,
        isSubEditTr: false,
        isMainEditTr: false,
        selPKData: [],
        selSelfKeyData: [],
        selForeignKeyData: []
      },
      emptyEditorData: {
        id: "",
        parentId: "",
        singleName: "",
        pkFieldName: "",
        desc: "",
        selfKeyFieldName: "",
        outerKeyFieldName: "",
        relationType: "1ToN",
        isSave: "true",
        condition: "",
        tableId: "",
        tableName: "",
        tableCaption: ""
      },
      currentEditorData: {
        id: "",
        parentId: "",
        singleName: "",
        pkFieldName: "",
        desc: "",
        selfKeyFieldName: "",
        outerKeyFieldName: "",
        relationType: "1ToN",
        isSave: "true",
        condition: "",
        tableId: "",
        tableName: "",
        tableCaption: ""
      },
      selectTableTree: {
        oldSelectedDBLinkId: "JBuild4dLocationDBLink",
        disabledDBLink: false,
        dbLinkEntities: [],
        tableTreeObj: null,
        tableTreeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: true,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              if (treeNode.nodeTypeName == "Table") {
                var _self = window._dbtablerelationcomp;
                $("#divSelectTable").dialog("close");

                _self.addTableToRelationTableTree(treeNode);
              }
            }
          }
        },
        tableTreeData: null,
        allTableTreeData: null,
        selectedTableName: "无"
      },
      tempDataStore: {},
      resultData: [],
      treeNodeSetting: {
        MainTableNodeImg: "../../../Themes/Png16X16/page_key.png",
        SubTableNodeImg: "../../../Themes/Png16X16/page_refresh.png"
      }
    };
  },
  mounted: function mounted() {
    this.getTablesAndBindOldSelected();
    this.relationTableTree.treeObj = $.fn.zTree.init($("#dataRelationZTreeUL"), this.relationTableTree.tableTreeSetting, this.relationTableTree.tableTreeRootData);
    this.relationTableTree.treeObj.expandAll(true);
    this.relationTableTree.currentSelectedNode = this.relationTableTree.treeObj.getNodeByParam("id", "-1");
    window._dbtablerelationcomp = this;
  },
  watch: {
    currentEditorData: {
      handler: function handler(val, oldVal) {
        for (var i = 0; i < this.resultData.length; i++) {
          if (this.resultData[i].id == val.id) {
            this.resultItemCopyEditEnableValue(this.resultData[i], val);
          }
        }
      },
      deep: true
    }
  },
  methods: {
    resultItemCopyEditEnableValue: function resultItemCopyEditEnableValue(toObj, fromObj) {
      toObj.singleName = fromObj.singleName;
      toObj.pkFieldName = fromObj.pkFieldName;
      toObj.desc = fromObj.desc;
      toObj.selfKeyFieldName = fromObj.selfKeyFieldName;
      toObj.outerKeyFieldName = fromObj.outerKeyFieldName;
      toObj.relationType = fromObj.relationType;
      toObj.isSave = fromObj.isSave;
      toObj.condition = fromObj.condition;
    },
    getTableFieldsByTableId: function getTableFieldsByTableId(tableId) {
      if (tableId == "-1") {
        return null;
      }

      if (this.tempDataStore["tableField_" + tableId]) {
        return this.tempDataStore["tableField_" + tableId];
      } else {
        var _self = this;

        AjaxUtility.PostSync(this.acInterface.getTableFieldsUrl, {
          tableId: tableId
        }, function (result) {
          if (result.success) {
            _self.tempDataStore["tableField_" + tableId] = result.data;
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
          }
        }, this);
      }

      if (this.tempDataStore["tableField_" + tableId]) {
        return this.tempDataStore["tableField_" + tableId];
      } else {
        return null;
      }
    },
    getEmptyResultItem: function getEmptyResultItem() {
      return JsonUtility.CloneSimple(this.emptyEditorData);
    },
    getExistResultItem: function getExistResultItem(id) {
      for (var i = 0; i < this.resultData.length; i++) {
        if (this.resultData[i].id == id) {
          return this.resultData[i];
        }
      }

      return null;
    },
    getTablesAndBindOldSelected: function getTablesAndBindOldSelected() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getTablesDataUrl, {}, function (result) {
        if (result.success) {
          _self.selectTableTree.dbLinkEntities = result.exKVData.dbLinkEntityList;
          _self.selectTableTree.allTableTreeData = result.data;

          _self.bindSelectTableTree(true);

          fuzzySearchTreeObj(_self.selectTableTree.tableTreeObj, _self.$refs.txt_table_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    bindSelectTableTree: function bindSelectTableTree(isGetCookieOldSelected) {
      var oldSelectedDBLinkId = CookieUtility.GetCookie("DBTRCDBLINKID");

      if (oldSelectedDBLinkId && isGetCookieOldSelected) {
        this.selectTableTree.oldSelectedDBLinkId = oldSelectedDBLinkId;
      } else {
        oldSelectedDBLinkId = this.selectTableTree.oldSelectedDBLinkId;
      }

      var bindToTreeData = [];

      for (var i = 0; i < this.selectTableTree.allTableTreeData.length; i++) {
        if (oldSelectedDBLinkId == this.selectTableTree.allTableTreeData[i].outerId) {
          bindToTreeData.push(this.selectTableTree.allTableTreeData[i]);
        }
      }

      this.selectTableTree.tableTreeData = bindToTreeData;
      this.selectTableTree.tableTreeObj = $.fn.zTree.init($("#selectTableZTreeUL"), this.selectTableTree.tableTreeSetting, this.selectTableTree.tableTreeData);
      this.selectTableTree.tableTreeObj.expandAll(true);
    },
    changeDBLink: function changeDBLink(dbLinkId) {
      CookieUtility.SetCookie1Month("DBTRCDBLINKID", dbLinkId);
      this.bindSelectTableTree(true);
    },
    getMainTableDBLinkId: function getMainTableDBLinkId() {
      for (var i = 0; i < this.selectTableTree.allTableTreeData.length; i++) {
        if (this.selectTableTree.allTableTreeData[i].id == this.getMainTableId()) {
          return this.selectTableTree.allTableTreeData[i].outerId;
        }
      }

      return "";
    },
    deleteSelectedRelationTreeNode: function deleteSelectedRelationTreeNode() {
      if (this.relationTableTree.currentSelectedNode) {
        if (!this.isSelectedRootRelationTableNode()) {
          if (!this.relationTableTree.currentSelectedNode.isParent) {
            for (var i = 0; i < this.resultData.length; i++) {
              if (this.resultData[i].id == this.relationTableTree.currentSelectedNode.id) {
                this.resultData.splice(i, 1);
                break;
              }
            }

            this.resultItemCopyEditEnableValue(this.currentEditorData, this.emptyEditorData);
            this.currentEditorData.id = "";
            this.currentEditorData.parentId = "";
            this.$refs.sqlGeneralDesignComp.setValue("");
            this.relationTableEditorView.selPKData = [];
            this.relationTableEditorView.selSelfKeyData = [];
            this.relationTableEditorView.selForeignKeyData = [];
            this.relationTableEditorView.isShowTableEditDetail = false;
            this.relationTableTree.treeObj.removeNode(this.relationTableTree.currentSelectedNode, false);
            this.relationTableTree.currentSelectedNode = null;
          } else {
            DialogUtility.AlertText("不能删除父节点!");
          }
        } else {
          DialogUtility.AlertText("不能删除根节点!");
        }
      } else {
        DialogUtility.AlertText("请选择要删除的节点!");
      }
    },
    beginSelectTableToRelationTable: function beginSelectTableToRelationTable() {
      if (this.relationTableTree.currentSelectedNode) {
        $("#divSelectTable").dialog({
          modal: true,
          height: 600,
          width: 700
        });
        var mainTableDBLinkId = this.getMainTableDBLinkId();

        if (mainTableDBLinkId) {
          this.selectTableTree.oldSelectedDBLinkId = mainTableDBLinkId;
          this.bindSelectTableTree(false);
          this.selectTableTree.disabledDBLink = true;
        } else {
          this.selectTableTree.disabledDBLink = false;
        }
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "选择一个父节点!", null);
      }
    },
    appendMainTableNodeProp: function appendMainTableNodeProp(node) {
      node._nodeExType = "MainNode";
      node.icon = this.treeNodeSetting.MainTableNodeImg;
    },
    appendSubTableNodeProp: function appendSubTableNodeProp(node) {
      node._nodeExType = "SubNode";
      node.icon = this.treeNodeSetting.SubTableNodeImg;
    },
    buildRelationTableNode: function buildRelationTableNode(sourceNode, treeNodeId) {
      if (this.relationTableTree.currentSelectedNode._nodeExType == "root") {
        this.appendMainTableNodeProp(sourceNode);
      } else {
        this.appendSubTableNodeProp(sourceNode);
      }

      sourceNode.tableId = sourceNode.id;

      if (treeNodeId) {
        sourceNode.id = treeNodeId;
      } else {
        sourceNode.id = StringUtility.Guid();
      }

      return sourceNode;
    },
    getMainRelationTableNode: function getMainRelationTableNode() {
      var node = this.relationTableTree.treeObj.getNodeByParam("_nodeExType", "MainNode");

      if (node) {
        return node;
      }

      return null;
    },
    getMainTableId: function getMainTableId() {
      return this.getMainRelationTableNode() ? this.getMainRelationTableNode().tableId : "";
    },
    getMainTableName: function getMainTableName() {
      return this.getMainRelationTableNode() ? this.getMainRelationTableNode().value : "";
    },
    getMainTableCaption: function getMainTableCaption() {
      return this.getMainRelationTableNode() ? this.getMainRelationTableNode().attr1 : "";
    },
    isSelectedRootRelationTableNode: function isSelectedRootRelationTableNode() {
      return this.relationTableTree.currentSelectedNode.id == "-1";
    },
    isSelectedMainRelationTableNode: function isSelectedMainRelationTableNode() {
      return this.relationTableTree.currentSelectedNode._nodeExType == "MainNode";
    },
    addTableToRelationTableTree: function addTableToRelationTableTree(newNode) {
      debugger;
      newNode = this.buildRelationTableNode(newNode);
      var tempNode = this.getMainRelationTableNode();

      if (tempNode != null) {
        if (this.isSelectedRootRelationTableNode()) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "只允许存在一个主记录!", null);
          return;
        }
      }

      this.relationTableTree.treeObj.addNodes(this.relationTableTree.currentSelectedNode, -1, newNode, false);
      var newResultItem = this.getEmptyResultItem();
      newResultItem.id = newNode.id;
      newResultItem.parentId = this.relationTableTree.currentSelectedNode.id;
      newResultItem.tableId = newNode.tableId;
      newResultItem.tableName = newNode.value;
      newResultItem.tableCaption = newNode.attr1;
      newResultItem.tableCode = newNode.code;
      this.resultData.push(newResultItem);
    },
    selectedRelationTableNode: function selectedRelationTableNode(node) {
      this.relationTableTree.currentSelectedNode = node;
      this.relationTableEditorView.isShowTableEditDetail = !this.isSelectedRootRelationTableNode();
      this.relationTableEditorView.isMainEditTr = this.isSelectedMainRelationTableNode();
      this.relationTableEditorView.isSubEditTr = !this.isSelectedMainRelationTableNode();

      if (this.isSelectedRootRelationTableNode()) {
        return;
      }

      this.relationTableEditorView.selPKData = this.getTableFieldsByTableId(node.tableId) != null ? this.getTableFieldsByTableId(node.tableId) : [];
      this.relationTableEditorView.selSelfKeyData = this.getTableFieldsByTableId(node.tableId) != null ? this.getTableFieldsByTableId(node.tableId) : [];
      var parentNode = node.getParentNode();
      this.relationTableEditorView.selForeignKeyData = this.getTableFieldsByTableId(parentNode.tableId) != null ? this.getTableFieldsByTableId(parentNode.tableId) : [];
      this.currentEditorData.id = this.relationTableTree.currentSelectedNode.id;
      this.currentEditorData.parentId = parentNode.id;
      var existResultItem = this.getExistResultItem(node.id);

      if (existResultItem != null) {
        this.resultItemCopyEditEnableValue(this.currentEditorData, existResultItem);

        var _self = this;

        window.setTimeout(function () {
          _self.$refs.sqlGeneralDesignComp.setValue(_self.currentEditorData.condition);

          _self.$refs.sqlGeneralDesignComp.setAboutTableFields(_self.relationTableEditorView.selSelfKeyData, _self.relationTableEditorView.selForeignKeyData);
        }, 300);
      } else {
        alert("通过getExistResultItem获取不到数据!");
      }
    },
    getResultData: function getResultData() {
      return this.resultData;
    },
    serializeRelation: function serializeRelation(isFormat) {
      alert("serializeRelation已经停用");
      return;

      if (isFormat) {
        return JsonUtility.JsonToStringFormat(this.resultData);
      }

      return JsonUtility.JsonToString(this.resultData);
    },
    deserializeRelation: function deserializeRelation(jsonString) {
      alert("deserializeRelation已经停用");
      return;
    },
    getValue: function getValue() {
      var result = {
        mainTableId: this.getMainTableId(),
        mainTableName: this.getMainTableName(),
        mainTableCaption: this.getMainTableCaption(),
        relationData: this.resultData
      };
      return result;
    },
    setValue: function setValue(jsonString) {
      var tempData = JsonUtility.StringToJson(jsonString);
      this.resultData = tempData;
      var treeNodeData = new Array();

      for (var i = 0; i < tempData.length; i++) {
        var treeNode = {
          "value": tempData[i].tableName,
          "attr1": tempData[i].tableCaption,
          "text": "【" + tempData[i].tableCode + "】" + tempData[i].tableCaption + "【" + tempData[i].tableName + "】",
          "id": tempData[i].id,
          "parentId": tempData[i].parentId,
          "tableId": tempData[i].tableId,
          "tableName": tempData[i].tableName,
          "tableCaption": tempData[i].tableCaption,
          "tableCode": tempData[i].tableCode
        };

        if (tempData[i].parentId == "-1") {
          this.appendMainTableNodeProp(treeNode);
        } else {
          this.appendSubTableNodeProp(treeNode);
        }

        treeNodeData.push(treeNode);
      }

      treeNodeData.push(this.relationTableTree.tableTreeRootData);
      this.relationTableTree.treeObj = $.fn.zTree.init($("#dataRelationZTreeUL"), this.relationTableTree.tableTreeSetting, treeNodeData);
      this.relationTableTree.treeObj.expandAll(true);
    },
    alertSerializeRelation: function alertSerializeRelation() {
      DialogUtility.AlertJsonCode(this.resultData);
    },
    inputDeserializeRelation: function inputDeserializeRelation() {
      DialogUtility.Prompt(window, {
        width: 900,
        height: 600
      }, DialogUtility.DialogPromptId, "请贴入数据关联Json设置字符串", function (jsonString) {
        try {
          window._dbtablerelationcomp.setValue(jsonString);
        } catch (e) {
          alert("反序列化失败:" + e);
        }
      });
    }
  },
  template: "<div class=\"db-table-relation-comp\">\n                <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px;margin-top: 0px;margin-bottom: 10px\">\u6570\u636E\u5173\u7CFB\u5173\u8054\u8BBE\u7F6E</divider>\n                <div style=\"float: left;width: 350px;height: 330px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 10px 10px 10px;\">\n                    <button-group shape=\"circle\" style=\"margin: auto\">\n                        <i-button type=\"success\" @click=\"beginSelectTableToRelationTable\">&nbsp;\u6DFB\u52A0&nbsp;</i-button>\n                        <i-button @click=\"deleteSelectedRelationTreeNode\">&nbsp;\u5220\u9664&nbsp;</i-button>\n                        <i-button @click=\"alertSerializeRelation\">\u5E8F\u5217\u5316</i-button>\n                        <i-button @click=\"inputDeserializeRelation\">\u53CD\u5E8F\u5217\u5316</i-button>\n                        <i-button>\u8BF4\u660E</i-button>\n                    </button-group>\n                    <ul id=\"dataRelationZTreeUL\" class=\"ztree\" style=\"overflow-x: hidden\"></ul>\n                </div>\n                <div style=\"float: right;width: 630px;height: 330px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 10px 10px 10px;\">\n                    <table class=\"light-gray-table\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" v-if=\"relationTableEditorView.isShowTableEditDetail\">\n                        <colgroup>\n                            <col style=\"width: 17%\" />\n                            <col style=\"width: 33%\" />\n                            <col style=\"width: 15%\" />\n                            <col style=\"width: 35%\" />\n                        </colgroup>\n                        <tbody>\n                            <tr>\n                                <td class=\"label\">SingleName\uFF1A</td>\n                                <td>\n                                    <i-input v-model=\"currentEditorData.singleName\" size=\"small\" placeholder=\"\u672C\u5173\u8054\u4E2D\u7684\u552F\u4E00\u540D\u79F0,\u53EF\u4EE5\u4E3A\u7A7A\" />\n                                </td>\n                                <td class=\"label\">PKKey\uFF1A</td>\n                                <td>\n                                    <i-select placeholder=\"\u9ED8\u8BA4\u4F7F\u7528Id\u5B57\u6BB5\" v-model=\"currentEditorData.pkFieldName\" size=\"small\" style=\"width:199px\">\n                                        <i-option v-for=\"item in relationTableEditorView.selPKData\" :value=\"item.fieldName\" :key=\"item.fieldName\">{{item.fieldCaption}}</i-option>\n                                    </i-select>\n                                </td>\n                            </tr>\n                            <tr v-if=\"relationTableEditorView.isSubEditTr\">\n                                <td class=\"label\">\u6570\u636E\u5173\u7CFB\uFF1A</td>\n                                <td>\n                                    <radio-group v-model=\"currentEditorData.relationType\" type=\"button\" size=\"small\">\n                                        <radio label=\"1To1\">1:1</radio>\n                                        <radio label=\"1ToN\">1:N</radio>\n                                    </radio-group>\n                                </td>\n                                <td class=\"label\">\u662F\u5426\u4FDD\u5B58\uFF1A</td>\n                                <td>\n                                    <radio-group v-model=\"currentEditorData.isSave\" type=\"button\" size=\"small\">\n                                        <radio label=\"true\">\u662F</radio>\n                                        <radio label=\"false\">\u5426</radio>\n                                    </radio-group>\n                                </td>\n                            </tr>\n                            <tr v-if=\"relationTableEditorView.isSubEditTr\">\n                                <td class=\"label\">\u672C\u8EAB\u5173\u8054\u5B57\u6BB5\uFF1A</td>\n                                <td>\n                                     <i-select placeholder=\"\u9ED8\u8BA4\u4F7F\u7528Id\u5B57\u6BB5\" v-model=\"currentEditorData.selfKeyFieldName\" size=\"small\" style=\"width:199px\">\n                                        <i-option v-for=\"item in relationTableEditorView.selSelfKeyData\" :value=\"item.fieldName\" :key=\"item.fieldName\">{{item.fieldCaption}}</i-option>\n                                    </i-select>\n                                </td>\n                                <td class=\"label\">\u5916\u8054\u5B57\u6BB5\uFF1A</td>\n                                <td>\n                                     <i-select placeholder=\"\u9ED8\u8BA4\u4F7F\u7528Id\u5B57\u6BB5\" v-model=\"currentEditorData.outerKeyFieldName\" size=\"small\" style=\"width:199px\">\n                                        <i-option v-for=\"item in relationTableEditorView.selForeignKeyData\" :value=\"item.fieldName\" :key=\"item.fieldName\">{{item.fieldCaption}}</i-option>\n                                    </i-select>\n                                </td>\n                            </tr>\n                            <tr>\n                                <td class=\"label\">Desc\uFF1A</td>\n                                <td colspan=\"3\">\n                                    <i-input v-model=\"currentEditorData.desc\" size=\"small\" placeholder=\"\u8BF4\u660E\" />\n                                </td>\n                            </tr>\n                            <tr>\n                                <td class=\"label\">\u52A0\u8F7D\u6761\u4EF6\uFF1A</td>\n                                <td colspan=\"3\">\n                                    <sql-general-design-comp ref=\"sqlGeneralDesignComp\" :sqlDesignerHeight=\"74\" v-model=\"currentEditorData.condition\" :showField=\"true\"></sql-general-design-comp>\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n                <div id=\"divSelectTable\" title=\"\u8BF7\u9009\u62E9\u8868\" style=\"display: none\">\n                    <i-input search class=\"input_border_bottom\" ref=\"txt_table_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u8868\u540D\u6216\u8005\u6807\u9898\">\n                        <i-select v-model=\"selectTableTree.oldSelectedDBLinkId\" slot=\"prepend\" style=\"width: 280px\" @on-change=\"changeDBLink\" :disabled=\"selectTableTree.disabledDBLink\">\n                            <i-option :value=\"item.dbId\" v-for=\"item in selectTableTree.dbLinkEntities\" :key=\"item.dbId\">{{item.dbLinkName}}</i-option>\n                        </i-select>\n                    </i-input>\n                    <ul id=\"selectTableZTreeUL\" class=\"ztree div-custom-scroll\" style=\"height: 500px;overflow-y:scroll;overflow-x:hidden\"></ul>\n                </div>\n              </div>"
});
"use strict";

Vue.component("design-html-elem-list", {
  data: function data() {
    return {};
  },
  mounted: function mounted() {},
  methods: {},
  template: '<div class="design-html-elem-list-wrap">\
            <div class="design-html-elem-list-item">格式化</div>\
            <div class="design-html-elem-list-item">说明</div>\
        </div>'
});
"use strict";

Vue.component("fd-control-base-info", {
  props: ["value"],
  data: function data() {
    return {
      baseInfo: {
        id: "",
        serialize: "",
        name: "",
        className: "",
        placeholder: "",
        custReadonly: "",
        custDisabled: "",
        style: "",
        desc: "",
        status: "",
        groupName: ""
      }
    };
  },
  watch: {
    baseInfo: function baseInfo(newVal) {
      this.$emit('input', newVal);
    },
    value: function value(newVal) {
      this.baseInfo = newVal;
    }
  },
  mounted: function mounted() {
    this.baseInfo = this.value;

    if (!this.baseInfo.status) {
      this.baseInfo.status = "enable";
    }
  },
  methods: {},
  template: "<table class=\"html-design-plugin-dialog-table-wraper\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 240px\" />\n                        <col style=\"width: 90px\" />\n                        <col style=\"width: 120px\" />\n                        <col style=\"width: 90px\" />\n                        <col />\n                    </colgroup>\n                    <tbody>\n                        <tr>\n                            <td>ID\uFF1A</td>\n                            <td>\n                                <input type=\"text\" v-model=\"baseInfo.id\" />\n                            </td>\n                            <td>Serialize\uFF1A</td>\n                            <td style=\"text-align: center\">\n                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.serialize\">\n                                    <radio label=\"true\">\u662F</radio>\n                                    <radio label=\"false\">\u5426</radio>\n                                </radio-group>\n                            </td>\n                            <td>\u542F\u7528\uFF1A</td>\n                            <td style=\"text-align: center\">\n                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.status\">\n                                    <radio label=\"enable\">\u662F</radio>\n                                    <radio label=\"disable\">\u5426</radio>\n                                </radio-group>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>Name\uFF1A</td>\n                            <td>\n                                <input type=\"text\" v-model=\"baseInfo.name\" />\n                            </td>\n                            <td>ClassName\uFF1A</td>\n                            <td colspan=\"3\">\n                                <input type=\"text\" v-model=\"baseInfo.className\" />\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>Placeholder</td>\n                            <td>\n                                <input type=\"text\" v-model=\"baseInfo.placeholder\" />\n                            </td>\n                            <td>Readonly\uFF1A</td>\n                            <td style=\"text-align: center\">\n                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.custReadonly\">\n                                    <radio label=\"readonly\">\u662F</radio>\n                                    <radio label=\"noreadonly\">\u5426</radio>\n                                </radio-group>\n                            </td>\n                            <td>Disabled\uFF1A</td>\n                            <td style=\"text-align: center\">\n                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.custDisabled\">\n                                    <radio label=\"disabled\">\u662F</radio>\n                                    <radio label=\"nodisabled\">\u5426</radio>\n                                </radio-group>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>Group</td>\n                            <td>\n                                <input type=\"text\" v-model=\"baseInfo.groupName\" />\n                            </td>\n                            <td></td>\n                            <td style=\"text-align: center\">\n                            </td>\n                            <td></td>\n                            <td style=\"text-align: center\">\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\u6837\u5F0F\uFF1A</td>\n                            <td colspan=\"5\">\n                                <textarea rows=\"7\" v-model=\"baseInfo.style\"></textarea>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\u5907\u6CE8\uFF1A</td>\n                            <td colspan=\"5\">\n                                <textarea rows=\"5\" v-model=\"baseInfo.desc\"></textarea>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>"
});
"use strict";

Vue.component("fd-control-bind-to", {
  props: ["bindToFieldProp", "defaultValueProp", "validateRulesProp"],
  data: function data() {
    return {
      bindToField: {
        relationId: "",
        tableId: "",
        tableName: "",
        tableCaption: "",
        fieldName: "",
        fieldCaption: "",
        fieldDataType: "",
        fieldLength: ""
      },
      validateRules: {
        msg: "",
        rules: []
      },
      defaultValue: {
        defaultType: "",
        defaultValue: "",
        defaultText: ""
      },
      tempData: {
        defaultDisplayText: ""
      }
    };
  },
  watch: {
    bindToProp: function bindToProp(newValue) {
      console.log(newValue);
    },
    bindToFieldProp: function bindToFieldProp(newValue) {
      this.bindToField = newValue;
    },
    defaultValueProp: function defaultValueProp(newValue) {
      this.defaultValue = newValue;

      if (!StringUtility.IsNullOrEmpty(this.defaultValue.defaultType)) {
        this.tempData.defaultDisplayText = DefaultValueUtility.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
      }
    },
    validateRulesProp: function validateRulesProp(newValue) {
      this.validateRules = newValue;
    }
  },
  mounted: function mounted() {
    this.bindToField = this.bindToFieldProp;
  },
  methods: {
    setCompleted: function setCompleted() {
      this.$emit('on-set-completed', this.bindToField, this.defaultValue, this.validateRules);
    },
    selectBindFieldView: function selectBindFieldView() {
      window._SelectBindObj = this;
      window.parent.appForm.selectBindToSingleFieldDialogBegin(window, this.getSelectFieldResultValue());
    },
    setSelectFieldResultValue: function setSelectFieldResultValue(result) {
      this.bindToField = {};

      if (result != null) {
        this.bindToField.fieldName = result.fieldName;
        this.bindToField.tableId = result.tableId;
        this.bindToField.tableName = result.tableName;
        this.bindToField.tableCaption = result.tableCaption;
        this.bindToField.fieldCaption = result.fieldCaption;
        this.bindToField.fieldDataType = result.fieldDataType;
        this.bindToField.fieldLength = result.fieldLength;
        this.bindToField.relationId = result.relationId;
      } else {
        this.bindToField.fieldName = "";
        this.bindToField.tableId = "";
        this.bindToField.tableName = "";
        this.bindToField.tableCaption = "";
        this.bindToField.fieldCaption = "";
        this.bindToField.fieldDataType = "";
        this.bindToField.fieldLength = "";
        this.bindToField.relationId = "";
      }

      this.setCompleted();
    },
    getSelectFieldResultValue: function getSelectFieldResultValue() {
      return JsonUtility.CloneSimple(this.bindToField);
    },
    selectDefaultValueView: function selectDefaultValueView() {
      window._SelectBindObj = this;
      window.parent.appForm.selectDefaultValueDialogBegin(window, null);
    },
    setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(result) {
      if (result != null) {
        this.defaultValue.defaultType = result.Type;
        this.defaultValue.defaultValue = result.Value;
        this.defaultValue.defaultText = result.Text;
        this.tempData.defaultDisplayText = DefaultValueUtility.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
      } else {
        this.defaultValue.defaultType = "";
        this.defaultValue.defaultValue = "";
        this.defaultValue.defaultText = "";
        this.tempData.defaultDisplayText = "";
      }

      this.setCompleted();
    },
    selectValidateRuleView: function selectValidateRuleView() {
      window._SelectBindObj = this;
      window.parent.appForm.selectValidateRuleDialogBegin(window, this.getSelectValidateRuleResultValue());
    },
    setSelectValidateRuleResultValue: function setSelectValidateRuleResultValue(result) {
      if (result != null) {
        this.validateRules = result;
        this.setCompleted();
      } else {
        this.validateRules.msg = "";
        this.validateRules.rules = [];
      }
    },
    getSelectValidateRuleResultValue: function getSelectValidateRuleResultValue() {
      return this.validateRules;
    }
  },
  template: "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 280px\" />\n                        <col style=\"width: 100px\" />\n                        <col />\n                    </colgroup>\n                    <tbody>\n                        <tr>\n                            <td colspan=\"4\">\n                                \u7ED1\u5B9A\u5230\u8868<button class=\"btn-select fright\" v-on:click=\"selectBindFieldView\">...</button>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\u8868\u7F16\u53F7\uFF1A</td>\n                            <td>{{bindToField.tableId}}</td>\n                            <td>\u6570\u636E\u6E90\uFF1A</td>\n                            <td>\n                                \n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\u8868\u540D\uFF1A</td>\n                            <td>{{bindToField.tableName}}</td>\n                            <td>\u8868\u6807\u9898\uFF1A</td>\n                            <td>{{bindToField.tableCaption}}</td>\n                        </tr>\n                        <tr>\n                            <td>\u5B57\u6BB5\u540D\uFF1A</td>\n                            <td>{{bindToField.fieldName}}</td>\n                            <td>\u5B57\u6BB5\u6807\u9898\uFF1A</td>\n                            <td>{{bindToField.fieldCaption}}</td>\n                        </tr>\n                        <tr>\n                            <td>\u7C7B\u578B\uFF1A</td>\n                            <td>{{bindToField.fieldDataType}}</td>\n                            <td>\u957F\u5EA6\uFF1A</td>\n                            <td>{{bindToField.fieldLength}}</td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"4\">\u9ED8\u8BA4\u503C<button class=\"btn-select fright\" v-on:click=\"selectDefaultValueView\">...</button></td>\n                        </tr>\n                        <tr style=\"height: 35px\">\n                            <td colspan=\"4\" style=\"background-color: #ffffff;\">\n                            {{tempData.defaultDisplayText}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"4\">\n                                \u6821\u9A8C\u89C4\u5219<button class=\"btn-select fright\" v-on:click=\"selectValidateRuleView\">...</button>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"4\" style=\"background-color: #ffffff\">\n                                <table class=\"html-design-plugin-dialog-table-wraper\">\n                                    <colgroup>\n                                        <col style=\"width: 100px\" />\n                                        <col />\n                                    </colgroup>\n                                    <tbody>\n                                        <tr>\n                                            <td style=\"text-align: center;\">\u63D0\u793A\u6D88\u606F\uFF1A</td>\n                                            <td>{{validateRules.msg}}</td>\n                                        </tr>\n                                        <tr>\n                                            <td style=\"text-align: center;\">\u9A8C\u8BC1\u7C7B\u578B</td>\n                                            <td style=\"background: #e8eaec;text-align: center;\">\u53C2\u6570</td>\n                                        </tr>\n                                        <tr v-for=\"ruleItem in validateRules.rules\">\n                                            <td style=\"background: #ffffff;text-align: center;color: #ad9361\">{{ruleItem.validateType}}</td>\n                                            <td style=\"background: #ffffff;text-align: center;\"><p v-if=\"ruleItem.validateParas === ''\">\u65E0\u53C2\u6570</p><p v-else>{{ruleItem.validateParas}}</p></td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>"
});
"use strict";

Vue.component("fd-control-datasource", {
  data: function data() {
    return {
      acInterface: {
        getDDGroupTreeData: "/Rest/SystemSetting/Dict/DictionaryGroup/GetTreeData"
      },
      ddGroupTreeObj: null,
      ddGroupTreeSetting: {
        async: {
          enable: true,
          url: ""
        },
        data: {
          key: {
            name: "dictGroupText"
          },
          simpleData: {
            enable: true,
            idKey: "dictGroupId",
            pIdKey: "dictGroupParentId",
            rootId: 0
          }
        },
        callback: {
          onClick: function onClick(event, treeId, treeNode) {
            var _self = this.getZTreeObj(treeId)._host;

            _self.selectedDictionaryGroup(treeNode.dictGroupId, treeNode.dictGroupText);
          },
          onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {
            appList.treeObj.expandAll(true);
          }
        }
      },
      normalDataSource: {
        defaultIsNull: "true",
        sqlDataSource: "",
        dictionaryGroupDataSourceId: "",
        dictionaryGroupDataSourceText: "",
        restDataSource: "",
        interfaceDataSource: "",
        staticDataSource: "",
        defaultSelected: "",
        layoutDirection: "vertical",
        rowNum: "0",
        displayValueInText: "false"
      },
      showSelectDictionary: false,
      showEditStatic: false,
      showProp: true
    };
  },
  watch: {},
  mounted: function mounted() {
    this.initDDGroupTree();
  },
  methods: {
    getValue: function getValue() {
      this.normalDataSource.sqlDataSource = encodeURIComponent(this.normalDataSource.sqlDataSource);
      return this.normalDataSource;
    },
    setValue: function setValue(oldValue) {
      this.normalDataSource = oldValue;
      this.normalDataSource.sqlDataSource = decodeURIComponent(oldValue.sqlDataSource);
      this.$refs.sqlGeneralDesignComp.setValue(this.normalDataSource.sqlDataSource);
    },
    beginSelectDictionaryGroup: function beginSelectDictionaryGroup() {
      this.showSelectDictionary = true;
      this.showProp = false;
    },
    selectedDictionaryGroup: function selectedDictionaryGroup(dictionaryGroupDataSourceId, dictionaryGroupDataSourceText) {
      this.normalDataSource.dictionaryGroupDataSourceId = dictionaryGroupDataSourceId;
      this.normalDataSource.dictionaryGroupDataSourceText = dictionaryGroupDataSourceText;
      this.showSelectDictionary = false;
      this.showProp = true;
    },
    initDDGroupTree: function initDDGroupTree() {
      AjaxUtility.Post(this.acInterface.getDDGroupTreeData, {}, function (result) {
        if (result.success) {
          if (result.data != null && result.data.length > 0) {
            for (var i = 0; i < result.data.length; i++) {}
          }

          this.ddGroupTreeObj = $.fn.zTree.init($("#zTreeUL"), this.ddGroupTreeSetting, result.data);
          this.ddGroupTreeObj.expandAll(true);
          this.ddGroupTreeObj._host = this;
        }
      }, this);
    }
  },
  template: "<div>\n                    <div v-show=\"showProp\">\n                        <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                            <colgroup>\n                                <col style=\"width: 100px\" />\n                                <col style=\"width: 280px\" />\n                                <col style=\"width: 100px\" />\n                                <col />\n                            </colgroup>\n                            <tbody>\n                                <tr>\n                                    <td>\n                                        \u9ED8\u8BA4\u7A7A\uFF1A\n                                    </td>\n                                    <td>\n                                        <radio-group type=\"button\" style=\"margin: auto\" v-model=\"normalDataSource.defaultIsNull\">\n                                            <radio label=\"true\">\u662F</radio>\n                                            <radio label=\"false\">\u5426</radio>\n                                        </radio-group>\n                                    </td>\n                                    <td colspan=\"2\">\n                                        \u83B7\u53D6\u6570\u636E\u6E90\u4F18\u5148\u7EA7\u522B->\u672C\u5730\u63A5\u53E3->Rest\u63A5\u53E3->\u6570\u636E\u5B57\u5178->sql->\u9759\u6001\u503C\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td>\n                                        REST\u6570\u636E\u6E90\uFF1A\n                                    </td>\n                                    <td colspan=\"3\">\n                                        <input type=\"text\" v-model=\"normalDataSource.restDataSource\" />\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td>\n                                        \u672C\u5730\u63A5\u53E3\uFF1A\n                                    </td>\n                                    <td colspan=\"3\">\n                                        <input type=\"text\" v-model=\"normalDataSource.interfaceDataSource\" />\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td>\n                                        \u6570\u636E\u5B57\u5178\uFF1A\n                                    </td>\n                                    <td colspan=\"3\">\n                                        <div class=\"fleft\">\u7ED1\u5B9A\u6570\u636E\u5B57\u5178:\u3010<span style=\"color: red\">{{normalDataSource.dictionaryGroupDataSourceText}}</span>\u3011</div><button class=\"btn-select fright\" v-on:click=\"beginSelectDictionaryGroup\">...</button>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td rowspan=\"2\">\n                                        SQL\u6570\u636E\u6E90\uFF1A\n                                    </td>\n                                    <td colspan=\"3\">\n                                        <span style=\"color: red\">[ITEXT\u4E0EIVALUE\u8BF7\u4F7F\u7528\u5927\u5199]</span>\u793A\u4F8B:\u3010SELECT '1' ITEXT,'2' IVALUE\u3011\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td colspan=\"3\" style=\"background-color: #FFFFFF\">\n                                        <sql-general-design-comp ref=\"sqlGeneralDesignComp\" :sql-designer-height=\"74\"  v-model=\"normalDataSource.sqlDataSource\"></sql-general-design-comp>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td>\n                                        \u9759\u6001\u503C\uFF1A\n                                    </td>\n                                    <td colspan=\"3\">\n                                        <button class=\"btn-select fright\">...</button>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td>\n                                        \u9ED8\u8BA4\u9009\u4E2D\uFF1A\n                                    </td>\n                                    <td>\n                                        <input type=\"text\" v-model=\"normalDataSource.defaultSelected\" />\n                                    </td>\n                                    <td>\n                                        \u663E\u793AValue\uFF1A\n                                    </td>\n                                    <td>\n                                        <radio-group type=\"button\" style=\"margin: auto\" v-model=\"normalDataSource.displayValueInText\">\n                                            <radio label=\"true\">\u662F</radio>\n                                            <radio label=\"false\">\u5426</radio>\n                                        </radio-group>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td>\n                                        \u65B9\u5411\uFF1A\n                                    </td>\n                                    <td>\n                                        <radio-group type=\"button\" style=\"margin: auto\" v-model=\"normalDataSource.layoutDirection\">\n                                            <radio label=\"vertical\">\u5782\u76F4</radio>\n                                            <radio label=\"horizontal\">\u6C34\u5E73</radio>\n                                        </radio-group>\n                                    </td>\n                                    <td>\n                                        \u5355\u5217\u4E2A\u6570\uFF1A\n                                    </td>\n                                    <td>\n                                        <input type=\"text\" v-model=\"normalDataSource.rowNum\" />\n                                    </td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </div>\n                    <div name=\"selectDictionary\" v-show=\"showSelectDictionary\">\n                        <ul id=\"zTreeUL\" class=\"ztree\"></ul>\n                    </div>\n                    <div name=\"selectDictionary\" v-show=\"showEditStatic\">\u7F16\u8F91\u9759\u6001\u503C</div>\n                </div>"
});
"use strict";

Vue.component("fd-control-field-and-api", {
  props: ["formId"],
  data: function data() {
    var _self = this;

    return {
      tableData: [],
      api: {
        acInterface: {
          getAPIData: "/Rest/Builder/ApiItem/GetAPISForZTreeNodeList"
        },
        apiTreeObj: null,
        apiTreeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              _self.api.apiSelectData = treeNode;
            }
          }
        },
        apiData: null,
        apiSelectData: null,
        editTableObject: null,
        editTableConfig: {
          Status: "Edit",
          AddAfterRowEvent: null,
          DataField: "fieldName",
          Templates: [{
            Title: "API名称",
            BindName: "value",
            Renderer: "EditTable_Label",
            TitleCellClassName: "TitleCell",
            Formater: function Formater(value) {
              return _self.getAPIText(value);
            }
          }, {
            Title: "调用顺序",
            BindName: "runTime",
            Renderer: "EditTable_Select",
            ClientDataSource: [{
              "Text": "之前",
              "Value": "之前"
            }, {
              "Text": "之后",
              "Value": "之后"
            }],
            Width: 100
          }],
          RowIdCreater: function RowIdCreater() {},
          TableClass: "edit-table",
          RendererTo: "apiContainer",
          TableId: "apiContainerTable",
          TableAttrs: {
            cellpadding: "1",
            cellspacing: "1",
            border: "1"
          }
        }
      },
      field: {
        acInterface: {
          getDataSetMainTableFields: "/Rest/Builder/DataSet/DatasetRelatedTable/GetDataSetMainTableFields"
        },
        editTableObject: null,
        editTableConfig: {
          Status: "Edit",
          AddAfterRowEvent: null,
          DataField: "fieldName",
          Templates: [{
            Title: "表名标题",
            BindName: "tableName",
            Renderer: "EditTable_Label"
          }, {
            Title: "字段标题",
            BindName: "fieldName",
            Renderer: "EditTable_Select"
          }, {
            Title: "默认值",
            BindName: "defaultValue",
            Renderer: "EditTable_SelectDefaultValue",
            Hidden: false
          }],
          RowIdCreater: function RowIdCreater() {},
          TableClass: "edit-table",
          RendererTo: "fieldContainer",
          TableId: "fieldContainerTable",
          TableAttrs: {
            cellpadding: "1",
            cellspacing: "1",
            border: "1"
          }
        }
      },
      oldFormId: ""
    };
  },
  mounted: function mounted() {},
  methods: {
    ready: function ready(dataSetId, tableId) {
      this.dataSetId = dataSetId;
      this.tableId = tableId;
      this.bindTableFields(null);
      this.bindAPITreeAndInitEditTable(null);
    },
    getJson: function getJson() {
      var result = {};
      this.api.editTableObject.CompletedEditingRow();
      result.apis = this.api.editTableObject.GetSerializeJson();
      this.field.editTableObject.CompletedEditingRow();
      result.fields = this.field.editTableObject.GetSerializeJson();
      return result;
    },
    setData: function setData(apiOldData, filedOldData) {
      if (apiOldData) {
        this.api.editTableObject.LoadJsonData(apiOldData);
      }

      if (filedOldData) {
        this.field.editTableObject.LoadJsonData(filedOldData);
      }
    },
    handleClose: function handleClose(dialogElem) {
      DialogUtility.CloseDialogElem(this.$refs[dialogElem]);
    },
    bindTableFields: function bindTableFields(oldData) {
      AjaxUtility.Post(this.field.acInterface.getDataSetMainTableFields, {
        dataSetId: this.dataSetId
      }, function (result) {
        console.log(result);
        var fieldsData = [];

        for (var i = 0; i < result.data.length; i++) {
          fieldsData.push({
            Value: result.data[i].fieldName,
            Text: result.data[i].fieldCaption
          });
        }

        this.field.editTableConfig.Templates[0].DefaultValue = {
          Type: "Const",
          Value: result.data[0].tableName
        };
        this.field.editTableConfig.Templates[1].ClientDataSource = fieldsData;

        if (!this.field.editTableObject) {
          this.field.editTableObject = Object.create(EditTable);
          this.field.editTableObject.Initialization(this.field.editTableConfig);
        }

        this.oldFormId = this.formId;

        if (oldData) {
          this.field.editTableObject.LoadJsonData(oldData);
        }
      }, this);

      if (this.field.editTableObject) {
        this.field.editTableObject.RemoveAllRow();
      }

      if (oldData && this.field.editTableObject) {
        this.field.editTableObject.LoadJsonData(oldData);
      }
    },
    addField: function addField() {
      this.field.editTableObject.AddEditingRowByTemplate();
    },
    removeField: function removeField() {
      this.field.editTableObject.RemoveRow();
    },
    addInnerFormCloseButton: function addInnerFormCloseButton() {
      var closeButtonData = {
        caption: "关闭",
        id: "inner_close_button_" + StringUtility.Timestamp(),
        buttonType: "关闭按钮"
      };
      this.tableData.push(closeButtonData);
    },
    bindAPITreeAndInitEditTable: function bindAPITreeAndInitEditTable(oldData) {
      if (!this.api.apiData) {
        AjaxUtility.Post(this.api.acInterface.getAPIData, {}, function (result) {
          if (result.success) {
            this.api.apiData = result.data;

            if (result.data != null && result.data.length > 0) {
              for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].nodeTypeName == "Group") {
                  result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/package.png";
                } else {
                  result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/application_view_columns.png";
                }
              }
            }

            this.api.apiTreeObj = $.fn.zTree.init($("#apiZTreeUL"), this.api.apiTreeSetting, result.data);
            this.api.apiTreeObj.expandAll(true);
            fuzzySearchTreeObj(this.api.apiTreeObj, this.$refs.txt_search_api_text.$refs.input, null, true);
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
          }

          this.api.editTableObject = Object.create(EditTable);
          this.api.editTableObject.Initialization(this.api.editTableConfig);
          this.api.editTableObject.RemoveAllRow();

          if (oldData) {
            this.api.editTableObject.LoadJsonData(oldData);
          }
        }, this);
      }
    },
    getApiConfigAndBindToTable: function getApiConfigAndBindToTable() {
      return;

      var _self = this;

      AjaxUtility.Post(this.api.acInterface.getButtonApiConfig, {}, function (result) {
        var apiSelectData = [];

        for (var i = 0; i < result.data.length; i++) {
          var group = {
            Group: result.data[i].name
          };
          var options = [];

          for (var j = 0; j < result.data[i].buttonAPIVoList.length; j++) {
            options.push({
              Value: result.data[i].buttonAPIVoList[j].id,
              Text: result.data[i].buttonAPIVoList[j].name
            });
          }

          group["Options"] = options;
          apiSelectData.push(group);
        }

        _self.api.editTableConfig.Templates[0].ClientDataSource = apiSelectData;
        _self.api.editTableObject = Object.create(EditTable);

        _self.api.editTableObject.Initialization(_self.api.editTableConfig);
      }, this);
    },
    addAPI: function addAPI() {
      if (this.api.apiSelectData.nodeTypeName == "API") {
        this.api.editTableObject.AddEditingRowByTemplate([], {
          value: this.api.apiSelectData.value,
          runTime: "之后"
        });
      } else {
        DialogUtility.AlertText("请选择需要添加的API!");
      }
    },
    removeAPI: function removeAPI() {
      this.api.editTableObject.RemoveRow();
    },
    clearAPI: function clearAPI() {
      this.api.editTableObject.RemoveAllRow();
    },
    getAPIText: function getAPIText(value) {
      for (var i = 0; i < this.api.apiData.length; i++) {
        if (this.api.apiData[i].nodeTypeName == "API") {
          if (this.api.apiData[i].value == value) {
            return this.api.apiData[i].text;
          }
        }
      }

      return "";
    }
  },
  template: "<div class=\"iv-list-page-wrap\">\n                    <div>\n                          <div style=\"float: left;width: 94%\">\n                            <div id=\"fieldContainer\" class=\"edit-table-wrap\" style=\"height: 180px;overflow: auto;width: 98%;margin: auto\"></div>\n                          </div>\n                          <div style=\"float: right;width: 5%\">\n                            <button-group vertical>\n                                <i-button size=\"small\" type=\"success\" icon=\"md-add\" @click=\"addField\"></i-button>\n                                <i-button size=\"small\" type=\"primary\" icon=\"md-close\" @click=\"removeField\"></i-button>\n                            </button-group>\n                          </div>\n                    </div>\n                    <div>\n                          <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                            <colgroup>\n                                <col style=\"width: 320px\" />\n                                <col style=\"width: 60px\" />\n                                <col />\n                            </colgroup>\n                            <tbody>\n                                <tr>\n                                    <td style=\"background: #ffffff\">\n                                        <i-input search class=\"input_border_bottom\" ref=\"txt_search_api_text\" placeholder=\"\u8BF7\u8F93\u5165API\u540D\u79F0\"></i-input>\n                                        <ul id=\"apiZTreeUL\" class=\"ztree\" style=\"height: 260px;overflow: auto\"></ul>\n                                    </td>\n                                    <td style=\"text-align: center;background-color: #f8f8f8\">\n                                        <button-group vertical>\n                                            <i-button size=\"small\" type=\"success\" icon=\"md-add\" @click=\"addAPI\"></i-button>\n                                            <i-button size=\"small\" type=\"primary\" icon=\"md-close\" @click=\"removeAPI\"></i-button>\n                                            <i-button size=\"small\" type=\"primary\" icon=\"ios-trash\" @click=\"clearAPI\"></i-button>\n                                        </button-group>\n                                    </td>\n                                    <td style=\"background: #ffffff;\" valign=\"top\">\n                                        <div id=\"apiContainer\" class=\"edit-table-wrap\" style=\"height: 260px;overflow: auto;width: 98%;margin: auto\"></div>\n                                    </td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("fd-control-select-bind-to-single-field-dialog", {
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        getTablesDataUrl: "/Rest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
        getTableFieldsDataUrl: "/Rest/Builder/DataStorage/DataBase/Table/GetTableFieldsByTableId",
        getTablesFieldsByTableIds: "/Rest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds"
      },
      selectedData: {
        relationId: "",
        tableId: "",
        tableName: "",
        tableCaption: "",
        fieldName: "",
        fieldCaption: "",
        fieldDataType: "",
        fieldLength: ""
      },
      tableTree: {
        tableTreeObj: null,
        tableTreeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "displayText"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              _self.selectedData.tableId = treeNode.tableId;
              _self.selectedData.tableName = treeNode.tableName;
              _self.selectedData.tableCaption = treeNode.tableCaption;
              _self.selectedData.fieldName = "";
              _self.selectedData.fieldCaption = "";
              _self.selectedData.fieldDataType = "";
              _self.selectedData.fieldLength = "";
              _self.fieldTable.fieldData = [];

              _self.filterAllFieldsToTable(_self.selectedData.tableId);
            },
            onDblClick: function onDblClick(event, treeId, treeNode) {},
            onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {}
          }
        },
        tableTreeData: null,
        selectedTableName: "无"
      },
      fieldTable: {
        fieldData: [],
        tableHeight: 470,
        columnsConfig: [{
          title: ' ',
          width: 60,
          key: 'isSelectedToBind',
          render: function render(h, params) {
            if (params.row.isSelectedToBind == "1") {
              return h('div', {
                "class": "list-row-button-wrap"
              }, [h('div', {
                "class": "list-row-button selected"
              })]);
            } else {
              return h('div', {
                "class": ""
              }, "");
            }
          }
        }, {
          title: '名称',
          key: 'fieldName',
          align: "center"
        }, {
          title: '标题',
          key: 'fieldCaption',
          align: "center"
        }]
      },
      oldRelationDataString: "",
      relationData: null,
      allFields: null,
      oldBindFieldData: null
    };
  },
  mounted: function mounted() {},
  methods: {
    beginSelect: function beginSelect(relationData, oldBindFieldData) {
      console.log("关联表数据：");
      console.log(relationData);
      console.log("已经绑定了的数据：");
      console.log(oldBindFieldData);

      if (relationData == null || relationData == "" || relationData.length == 0) {
        DialogUtility.AlertText("请先设置表单的数据关联！");
        $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
        $(window.document).find(".ui-dialog").css("zIndex", 10101);
        return;
      }

      var elem = this.$refs.fdControlSelectBindToSingleFieldDialogWrap;
      var height = 450;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        height: 680,
        width: 980,
        title: "选择绑定字段"
      });
      $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.document).find(".ui-dialog").css("zIndex", 10101);
      this.oldBindFieldData = oldBindFieldData;
      this.selectedData = JsonUtility.CloneSimple(oldBindFieldData);

      if (JsonUtility.JsonToString(relationData) != this.oldRelationDataString) {
        for (var i = 0; i < relationData.length; i++) {
          relationData[i].displayText = relationData[i].tableName + "[" + relationData[i].tableCaption + "](" + relationData[i].relationType + ")";

          if (relationData[i].parentId == "-1") {
            relationData[i].displayText = relationData[i].tableName + "[" + relationData[i].tableCaption + "]";
          }

          relationData[i].icon = "../../../Themes/Png16X16/table.png";
        }

        this.tableTree.tableTreeObj = $.fn.zTree.init($("#tableZTreeUL"), this.tableTree.tableTreeSetting, relationData);
        this.tableTree.tableTreeObj.expandAll(true);
        this.oldRelationDataString = JsonUtility.JsonToString(relationData);
        this.relationData = relationData;
        this.getAllTablesFields(relationData);
      } else {
        this.resetFieldToSelectedStatus(this.allFields);
      }

      if (oldBindFieldData && oldBindFieldData.tableId && oldBindFieldData.tableId != "") {
        var selectedNode = this.tableTree.tableTreeObj.getNodeByParam("tableId", oldBindFieldData.tableId);
        this.tableTree.tableTreeObj.selectNode(selectedNode, false, true);
      }
    },
    resetFieldToSelectedStatus: function resetFieldToSelectedStatus(_allFields) {
      for (var i = 0; i < this.fieldTable.fieldData.length; i++) {
        this.fieldTable.fieldData[i].isSelectedToBind = "0";
      }

      if (_allFields) {
        for (var i = 0; i < _allFields.length; i++) {
          _allFields[i].isSelectedToBind = "0";

          if (_allFields[i].fieldTableId == this.oldBindFieldData.tableId) {
            if (_allFields[i].fieldName == this.oldBindFieldData.fieldName) {
              _allFields[i].isSelectedToBind = "1";
            }
          }
        }

        this.allFields = _allFields;
      }

      this.filterAllFieldsToTable(this.oldBindFieldData.tableId);
    },
    getAllTablesFields: function getAllTablesFields(relationData) {
      var tableIds = [];

      for (var i = 0; i < relationData.length; i++) {
        tableIds.push(relationData[i].tableId);
      }

      var _self = this;

      AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {
        "tableIds": tableIds
      }, function (result) {
        if (result.success) {
          var allFields = result.data;
          var singleTable = result.exKVData.Tables[0];
          console.log("重新获取数据");
          console.log(allFields);

          _self.resetFieldToSelectedStatus(allFields);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    filterAllFieldsToTable: function filterAllFieldsToTable(tableId) {
      if (tableId) {
        var fields = [];

        for (var i = 0; i < this.allFields.length; i++) {
          if (this.allFields[i].fieldTableId == tableId) {
            fields.push(this.allFields[i]);
          }
        }

        this.fieldTable.fieldData = fields;
        console.log(this.fieldTable.fieldData);
      }
    },
    selectedField: function selectedField(selection, index) {
      this.selectedData.fieldName = selection.fieldName;
      this.selectedData.fieldCaption = selection.fieldCaption;
      this.selectedData.fieldDataType = selection.fieldDataType;
      this.selectedData.fieldLength = selection.fieldDataLength;
      var selectedNode = this.tableTree.tableTreeObj.getNodeByParam("tableId", selection.fieldTableId);
      this.selectedData.tableId = selectedNode.tableId;
      this.selectedData.tableName = selectedNode.tableName;
      this.selectedData.tableCaption = selectedNode.tableCaption;
      this.selectedData.relationId = selectedNode.id;
    },
    selectComplete: function selectComplete() {
      var result = this.selectedData;

      if (!StringUtility.IsNullOrEmpty(result.tableId) && !StringUtility.IsNullOrEmpty(result.fieldName)) {
        this.$emit('on-selected-bind-to-single-field', result);
        this.handleClose();
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择需要绑定的字段!", null);
      }
    },
    clearComplete: function clearComplete() {
      window.OpenerWindowObj[this.getSelectInstanceName()].setSelectFieldResultValue(null);
      this.handleClose();
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.fdControlSelectBindToSingleFieldDialogWrap);
    }
  },
  template: "<div ref=\"fdControlSelectBindToSingleFieldDialogWrap\" class=\"general-edit-page-wrap design-dialog-wraper-single-dialog\" style=\"display: none\">\n                    <div class=\"select-table-wraper\">\n                        <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px\">\u9009\u62E9\u8868</divider>\n                        <!--<input type=\"text\" id=\"txtSearchTableTree\" style=\"width: 100%;height: 32px;margin-top: 2px\" />-->\n                        <ul id=\"tableZTreeUL\" class=\"ztree\"></ul>\n                    </div>\n                    <div class=\"select-field-wraper iv-list-page-wrap\">\n                        <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px\">\u9009\u62E9\u5B57\u6BB5</divider>\n                        <i-table border :columns=\"fieldTable.columnsConfig\" :data=\"fieldTable.fieldData\"\n                                 class=\"iv-list-table\" :highlight-row=\"true\"\n                                 @on-row-click=\"selectedField\" :height=\"fieldTable.tableHeight\" size=\"small\" no-data-text=\"\u8BF7\u9009\u62E9\u8868\"></i-table>\n                    </div>\n                    <div class=\"button-outer-wrap\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"selectComplete()\"> \u786E \u8BA4 </i-button>\n                                <i-button type=\"primary\" @click=\"clearComplete()\"> \u6E05 \u7A7A </i-button>\n                                <i-button @click=\"handleClose()\">\u5173 \u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("inner-form-button-list-comp", {
  props: ["formId"],
  data: function data() {
    var _self = this;

    return {
      columnsConfig: [{
        title: '标题',
        key: 'caption',
        align: "center"
      }, {
        title: '类型',
        key: 'buttonType',
        align: "center"
      }, {
        title: '操作',
        key: 'id',
        width: 200,
        align: "center",
        render: function render(h, params) {
          var buttons = [];

          if (params.row.buttonType != "关闭按钮") {
            buttons.push(ListPageUtility.IViewTableInnerButton.EditButton(h, params, "id", _self));
          }

          buttons.push(ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, "id", _self));
          buttons.push(ListPageUtility.IViewTableInnerButton.MoveUpButton(h, params, "id", _self));
          buttons.push(ListPageUtility.IViewTableInnerButton.MoveDownButton(h, params, "id", _self));
          return h('div', {
            "class": "list-row-button-wrap"
          }, buttons);
        }
      }],
      tableData: [],
      innerSaveButtonEditData: {
        caption: "",
        saveAndClose: "true",
        apis: [],
        fields: [],
        id: "",
        buttonType: "保存按钮",
        custServerResolveMethod: "",
        custServerResolveMethodPara: "",
        custClientRendererMethod: "",
        custClientRendererMethodPara: "",
        custClientRendererAfterMethod: "",
        custClientRendererAfterMethodPara: "",
        custClientClickBeforeMethod: "",
        custClientClickBeforeMethodPara: ""
      },
      api: {
        acInterface: {
          getAPIData: "/Rest/Builder/ApiItem/GetAPISForZTreeNodeList"
        },
        apiTreeObj: null,
        apiTreeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              _self.api.apiSelectData = treeNode;
            }
          }
        },
        apiData: null,
        apiSelectData: null,
        editTableObject: null,
        editTableConfig: {
          Status: "Edit",
          AddAfterRowEvent: null,
          DataField: "fieldName",
          Templates: [{
            Title: "API名称",
            BindName: "value",
            Renderer: "EditTable_Label",
            TitleCellClassName: "TitleCell",
            Formater: function Formater(value) {
              return _self.getAPIText(value);
            }
          }, {
            Title: "调用顺序",
            BindName: "runTime",
            Renderer: "EditTable_Select",
            ClientDataSource: [{
              "Text": "之前",
              "Value": "之前"
            }, {
              "Text": "之后",
              "Value": "之后"
            }],
            Width: 100
          }],
          RowIdCreater: function RowIdCreater() {},
          TableClass: "edit-table",
          RendererTo: "apiContainer",
          TableId: "apiContainerTable",
          TableAttrs: {
            cellpadding: "1",
            cellspacing: "1",
            border: "1"
          }
        }
      },
      field: {
        acInterface: {
          getFormMainTableFields: "/Rest/Builder/Form/GetFormMainTableFields"
        },
        editTableObject: null,
        editTableConfig: {
          Status: "Edit",
          AddAfterRowEvent: null,
          DataField: "fieldName",
          Templates: [{
            Title: "表名标题",
            BindName: "tableName",
            Renderer: "EditTable_Label"
          }, {
            Title: "字段标题",
            BindName: "fieldName",
            Renderer: "EditTable_Select"
          }, {
            Title: "默认值",
            BindName: "defaultValue",
            Renderer: "EditTable_SelectDefaultValue",
            Hidden: false
          }, {
            Title: "表ID",
            BindName: "tableId",
            Renderer: "EditTable_Label"
          }],
          RowIdCreater: function RowIdCreater() {},
          TableClass: "edit-table",
          RendererTo: "fieldContainer",
          TableId: "fieldContainerTable",
          TableAttrs: {
            cellpadding: "1",
            cellspacing: "1",
            border: "1"
          }
        }
      },
      oldFormId: "",
      innerJsClientButtonEditData: {
        caption: "",
        execAndClose: "true",
        id: "",
        buttonType: "脚本按钮",
        actionType: "reloadData",
        callJsMethod: "",
        custServerResolveMethod: "",
        custServerResolveMethodPara: "",
        custClientRendererMethod: "",
        custClientRendererMethodPara: "",
        custClientRendererAfterMethod: "",
        custClientRendererAfterMethodPara: "",
        custClientClickBeforeMethod: "",
        custClientClickBeforeMethodPara: ""
      }
    };
  },
  mounted: function mounted() {},
  methods: {
    ready: function ready(tableDataJson) {
      if (tableDataJson != null && tableDataJson != "") {
        this.tableData = JsonUtility.StringToJson(tableDataJson);
      }

      this.bindAPITreeAndInitEditTable(null);
    },
    getJson: function getJson() {
      return JsonUtility.JsonToString(this.tableData);
    },
    edit: function edit(id, params) {
      if (params.row["buttonType"] == "保存按钮") {
        this.editInnerFormSaveButton(params);
      } else if (params.row["buttonType"] == "脚本按钮") {
        this.editInnerFormJsClientButton(params);
      }
    },
    del: function del(id, params) {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id == id) {
          ArrayUtility.Delete(this.tableData, i);
        }
      }
    },
    moveUp: function moveUp(id, params) {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id == id) {
          ArrayUtility.MoveUp(this.tableData, i);
          return;
        }
      }
    },
    moveDown: function moveDown(id, params) {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id == id) {
          ArrayUtility.MoveDown(this.tableData, i);
          return;
        }
      }
    },
    addInnerFormSaveButton: function addInnerFormSaveButton() {
      if (this.formId != null && this.formId != "") {
        this.editSaveButtonStatuc = "add";
        this.resetInnerSaveButtonData();
        var elem = this.$refs.innerFormSaveButtonWrap;
        DialogUtility.DialogElemObj(elem, {
          modal: true,
          height: 520,
          width: 720,
          title: "窗体内保存按钮"
        });
        $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
        $(window.document).find(".ui-dialog").css("zIndex", 10101);
        this.innerSaveButtonEditData.id = "inner_form_save_button_" + StringUtility.Timestamp();
        this.bindTableFields(null);
        this.clearAPI();
      } else {
        DialogUtility.AlertText("请先设置绑定的窗体!");
      }
    },
    handleClose: function handleClose(dialogElem) {
      DialogUtility.CloseDialogElem(this.$refs[dialogElem]);
    },
    editInnerFormSaveButton: function editInnerFormSaveButton(params) {
      this.addInnerFormSaveButton();
      this.innerSaveButtonEditData = JsonUtility.CloneStringify(params.row);
      this.editSaveButtonStatuc = "edit";
      this.bindAPITreeAndInitEditTable(this.innerSaveButtonEditData.apis);
      this.bindTableFields(this.innerSaveButtonEditData.fields);
    },
    resetInnerSaveButtonData: function resetInnerSaveButtonData() {
      this.innerSaveButtonEditData = {
        caption: "",
        saveAndClose: "true",
        apis: [],
        fields: [],
        id: "",
        buttonType: "保存按钮",
        custServerResolveMethod: "",
        custServerResolveMethodPara: "",
        custClientRendererMethod: "",
        custClientRendererMethodPara: "",
        custClientRendererAfterMethod: "",
        custClientRendererAfterMethodPara: "",
        custClientClickBeforeMethod: "",
        custClientClickBeforeMethodPara: ""
      };
    },
    saveInnerSaveButtonToList: function saveInnerSaveButtonToList() {
      var singleInnerFormButtonData = JsonUtility.CloneSimple(this.innerSaveButtonEditData);
      this.api.editTableObject.CompletedEditingRow();
      singleInnerFormButtonData.apis = this.api.editTableObject.GetSerializeJson();
      this.field.editTableObject.CompletedEditingRow();
      singleInnerFormButtonData.fields = this.field.editTableObject.GetSerializeJson();

      if (this.editSaveButtonStatuc == "add") {
        this.tableData.push(singleInnerFormButtonData);
      } else {
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id == singleInnerFormButtonData.id) {
            Vue.set(this.tableData, i, singleInnerFormButtonData);
          }
        }
      }

      this.handleClose("innerFormSaveButtonWrap");
    },
    bindTableFields: function bindTableFields(oldData) {
      if (this.oldFormId != this.formId) {
        AjaxUtility.Post(this.field.acInterface.getFormMainTableFields, {
          formId: this.formId
        }, function (result) {
          console.log(result);
          var fieldsData = [];

          for (var i = 0; i < result.data.length; i++) {
            fieldsData.push({
              Value: result.data[i].fieldName,
              Text: result.data[i].fieldCaption
            });
          }

          this.field.editTableConfig.Templates[0].DefaultValue = {
            Type: "Const",
            Value: result.data[0].tableName
          };
          this.field.editTableConfig.Templates[3].DefaultValue = {
            Type: "Const",
            Value: result.data[0].tableId
          };
          this.field.editTableConfig.Templates[1].ClientDataSource = fieldsData;

          if (!this.field.editTableObject) {
            this.field.editTableObject = Object.create(EditTable);
            this.field.editTableObject.Initialization(this.field.editTableConfig);
          }

          this.oldFormId = this.formId;

          if (oldData) {
            this.field.editTableObject.LoadJsonData(oldData);
          }
        }, this);
      }

      if (this.field.editTableObject) {
        this.field.editTableObject.RemoveAllRow();
      }

      if (oldData && this.field.editTableObject) {
        this.field.editTableObject.LoadJsonData(oldData);
      }
    },
    addField: function addField() {
      this.field.editTableObject.AddEditingRowByTemplate();
    },
    removeField: function removeField() {
      this.field.editTableObject.RemoveRow();
    },
    bindAPITreeAndInitEditTable: function bindAPITreeAndInitEditTable(oldData) {
      if (!this.api.apiData) {
        AjaxUtility.Post(this.api.acInterface.getAPIData, {}, function (result) {
          if (result.success) {
            this.api.apiData = result.data;

            if (result.data != null && result.data.length > 0) {
              for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].nodeTypeName == "Group") {
                  result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/package.png";
                } else {
                  result.data[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/application_view_columns.png";
                }
              }
            }

            this.api.apiTreeObj = $.fn.zTree.init($("#apiZTreeUL"), this.api.apiTreeSetting, result.data);
            this.api.apiTreeObj.expandAll(true);
            fuzzySearchTreeObj(this.api.apiTreeObj, this.$refs.txt_search_api_text.$refs.input, null, true);
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
          }
        }, this);
        this.api.editTableObject = Object.create(EditTable);
        this.api.editTableObject.Initialization(this.api.editTableConfig);
      }

      this.api.editTableObject.RemoveAllRow();

      if (oldData) {
        this.api.editTableObject.LoadJsonData(oldData);
      }
    },
    getApiConfigAndBindToTable: function getApiConfigAndBindToTable() {
      return;

      var _self = this;

      AjaxUtility.Post(this.api.acInterface.getButtonApiConfig, {}, function (result) {
        var apiSelectData = [];

        for (var i = 0; i < result.data.length; i++) {
          var group = {
            Group: result.data[i].name
          };
          var options = [];

          for (var j = 0; j < result.data[i].buttonAPIVoList.length; j++) {
            options.push({
              Value: result.data[i].buttonAPIVoList[j].id,
              Text: result.data[i].buttonAPIVoList[j].name
            });
          }

          group["Options"] = options;
          apiSelectData.push(group);
        }

        _self.api.editTableConfig.Templates[0].ClientDataSource = apiSelectData;
        _self.api.editTableObject = Object.create(EditTable);

        _self.api.editTableObject.Initialization(_self.api.editTableConfig);
      }, this);
    },
    addAPI: function addAPI() {
      if (this.api.apiSelectData.nodeTypeName == "API") {
        this.api.editTableObject.AddEditingRowByTemplate([], {
          value: this.api.apiSelectData.value,
          runTime: "之后"
        });
      } else {
        DialogUtility.AlertText("请选择需要添加的API!");
      }
    },
    removeAPI: function removeAPI() {
      this.api.editTableObject.RemoveRow();
    },
    clearAPI: function clearAPI() {
      this.api.editTableObject.RemoveAllRow();
    },
    getAPIText: function getAPIText(value) {
      for (var i = 0; i < this.api.apiData.length; i++) {
        if (this.api.apiData[i].nodeTypeName == "API") {
          if (this.api.apiData[i].value == value) {
            return this.api.apiData[i].text;
          }
        }
      }

      return "";
    },
    addInnerFormCloseButton: function addInnerFormCloseButton() {
      var closeButtonData = {
        caption: "关闭",
        id: "inner_close_button_" + StringUtility.Timestamp(),
        buttonType: "关闭按钮"
      };
      this.tableData.push(closeButtonData);
    },
    addInnerFormJsClientButton: function addInnerFormJsClientButton() {
      this.editJsClientButtonStatuc = "add";
      this.resetInnerJsClientButtonData();
      var elem = this.$refs.innerFormJsClientButtonWrap;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        height: 520,
        width: 720,
        title: "窗体内脚本按钮"
      });
      $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.document).find(".ui-dialog").css("zIndex", 10101);
      this.innerJsClientButtonEditData.id = "inner_form_js_client_button_" + StringUtility.Timestamp();
    },
    editInnerFormJsClientButton: function editInnerFormJsClientButton(params) {
      this.addInnerFormJsClientButton();
      this.innerJsClientButtonEditData = JsonUtility.CloneStringify(params.row);
      this.editJsClientButtonStatuc = "edit";
    },
    resetInnerJsClientButtonData: function resetInnerJsClientButtonData() {
      this.innerJsClientButtonEditData = {
        caption: "",
        execAndClose: "true",
        id: "",
        buttonType: "脚本按钮",
        actionType: "reloadData",
        callJsMethod: "",
        custServerResolveMethod: "",
        custServerResolveMethodPara: "",
        custClientRendererMethod: "",
        custClientRendererMethodPara: "",
        custClientRendererAfterMethod: "",
        custClientRendererAfterMethodPara: "",
        custClientClickBeforeMethod: "",
        custClientClickBeforeMethodPara: ""
      };
    },
    saveInnerJsClientButtonToList: function saveInnerJsClientButtonToList() {
      var singleInnerFormButtonData = JsonUtility.CloneSimple(this.innerJsClientButtonEditData);

      if (this.editJsClientButtonStatuc == "add") {
        this.tableData.push(singleInnerFormButtonData);
      } else {
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id == singleInnerFormButtonData.id) {
            Vue.set(this.tableData, i, singleInnerFormButtonData);
          }
        }
      }

      this.handleClose("innerFormJsClientButtonWrap");
    }
  },
  template: "<div style=\"height: 210px\" class=\"iv-list-page-wrap\">\n                    <div ref=\"innerFormSaveButtonWrap\" class=\"html-design-plugin-dialog-wraper general-edit-page-wrap\" style=\"display: none;margin-top: 0px\">\n                        <tabs size=\"small\" name=\"inner-form-save-button-edit-tabs\">\n                            <tab-pane tab=\"inner-form-save-button-edit-tabs\" label=\"\u7ED1\u5B9A\u4FE1\u606F\">\n                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                                    <colgroup>\n                                        <col style=\"width: 60px\" />\n                                        <col style=\"width: 220px\" />\n                                        <col style=\"width: 100px\" />\n                                        <col />\n                                    </colgroup>\n                                    <tbody>\n                                        <tr>\n                                            <td>\u6807\u9898\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.caption\" />\n                                            </td>\n                                            <td>\u4FDD\u5B58\u5E76\u5173\u95ED\uFF1A</td>\n                                            <td>\n                                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"innerSaveButtonEditData.saveAndClose\">\n                                                    <radio label=\"true\">\u662F</radio>\n                                                    <radio label=\"false\">\u5426</radio>\n                                                </radio-group>\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5B57\u6BB5\uFF1A</td>\n                                            <td colspan=\"3\">\n                                                <div style=\"height: 140px\">\n                                                    <div style=\"float: left;width: 94%\">\n                                                        <div id=\"fieldContainer\" class=\"edit-table-wrap\" style=\"height: 310px;overflow: auto;width: 98%;margin: auto\"></div>\n                                                    </div>\n                                                    <div style=\"float: right;width: 5%\">\n                                                        <button-group vertical>\n                                                            <i-button size=\"small\" type=\"success\" icon=\"md-add\" @click=\"addField\"></i-button>\n                                                            <i-button size=\"small\" type=\"primary\" icon=\"md-close\" @click=\"removeField\"></i-button>\n                                                        </button-group>\n                                                    </div>\n                                                </div>\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </tab-pane>\n                            <tab-pane tab=\"inner-form-save-button-edit-tabs\" label=\"API\u8BBE\u7F6E\">\n                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                                    <colgroup>\n                                        <col style=\"width: 320px\" />\n                                        <col style=\"width: 60px\" />\n                                        <col />\n                                    </colgroup>\n                                    <tbody>\n                                        <tr>\n                                            <td style=\"background: #ffffff\">\n                                                <i-input search class=\"input_border_bottom\" ref=\"txt_search_api_text\" placeholder=\"\u8BF7\u8F93\u5165API\u540D\u79F0\"></i-input>\n                                                <ul id=\"apiZTreeUL\" class=\"ztree\" style=\"height: 320px;overflow: auto\"></ul>\n                                            </td>\n                                            <td style=\"text-align: center;background-color: #f8f8f8\">\n                                                <button-group vertical>\n                                                    <i-button size=\"small\" type=\"success\" icon=\"md-add\" @click=\"addAPI\"></i-button>\n                                                    <i-button size=\"small\" type=\"primary\" icon=\"md-close\" @click=\"removeAPI\"></i-button>\n                                                    <i-button size=\"small\" type=\"primary\" icon=\"ios-trash\" @click=\"clearAPI\"></i-button>\n                                                </button-group>\n                                            </td>\n                                            <td style=\"background: #ffffff;\" valign=\"top\">\n                                                <div id=\"apiContainer\" class=\"edit-table-wrap\" style=\"height: 340px;overflow: auto;width: 98%;margin: auto\"></div>\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </tab-pane>\n                            <tab-pane tab=\"inner-form-save-button-edit-tabs\" label=\"\u5F00\u53D1\u6269\u5C55\">\n                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                                    <colgroup>\n                                        <col style=\"width: 150px\" />\n                                        <col />\n                                    </colgroup>\n                                    <tbody>\n                                        <tr>\n                                            <td>ID\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.id\" size=\"small\" placeholder=\"\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u670D\u52A1\u7AEF\u89E3\u6790\u7C7B\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custServerResolveMethod\" size=\"small\" placeholder=\"\u6309\u94AE\u8FDB\u884C\u670D\u52A1\u7AEF\u89E3\u6790\u65F6,\u7C7B\u5168\u79F0,\u5C06\u8C03\u7528\u8BE5\u7C7B,\u9700\u8981\u5B9E\u73B0\u63A5\u53E3IFormButtonCustResolve\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custServerResolveMethodPara\" size=\"small\" placeholder=\"\u670D\u52A1\u7AEF\u89E3\u6790\u7C7B\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5BA2\u6237\u7AEF\u6E32\u67D3\u65B9\u6CD5\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientRendererMethod\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u65B9\u6CD5,\u6309\u94AE\u5C06\u7ECF\u7531\u8BE5\u65B9\u6CD5\u6E32\u67D3,\u6700\u7EC8\u5F62\u6210\u9875\u9762\u5143\u7D20,\u9700\u8981\u8FD4\u56DE\u6700\u7EC8\u5143\u7D20\u7684HTML\u5BF9\u8C61\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientRendererMethodPara\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u65B9\u6CD5\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5BA2\u6237\u7AEF\u6E32\u67D3\u540E\u65B9\u6CD5\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientRendererAfterMethod\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u540E\u8C03\u7528\u65B9\u6CD5,\u7ECF\u8FC7\u9ED8\u8BA4\u7684\u6E32\u67D3,\u65E0\u8FD4\u56DE\u503C\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientRendererAfterMethodPara\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u540E\u65B9\u6CD5\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5BA2\u6237\u7AEF\u70B9\u51FB\u524D\u65B9\u6CD5\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientClickBeforeMethod\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u70B9\u51FB\u8BE5\u6309\u94AE\u65F6\u7684\u524D\u7F6E\u65B9\u6CD5,\u5982\u679C\u8FD4\u56DEfalse\u5C06\u963B\u6B62\u9ED8\u8BA4\u8C03\u7528\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientClickBeforeMethodPara\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u70B9\u51FB\u524D\u65B9\u6CD5\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </tab-pane>\n                        </tabs>\n                        <div class=\"button-outer-wrap\" style=\"padding-top:4px\">\n                            <div class=\"button-inner-wrap\" style=\"margin-right: 4px\">\n                                <button-group>\n                                    <i-button type=\"primary\" @click=\"saveInnerSaveButtonToList()\"> \u4FDD \u5B58</i-button>\n                                    <i-button @click=\"handleClose('innerFormSaveButtonWrap')\">\u5173 \u95ED</i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                    <div ref=\"innerFormJsClientButtonWrap\" class=\"html-design-plugin-dialog-wraper general-edit-page-wrap\" style=\"display: none;margin-top: 0px\">\n                        <tabs size=\"small\" name=\"inner-form-js-client-button-edit-tabs\">\n                            <tab-pane tab=\"inner-form-js-client-button-edit-tabs\" label=\"\u7ED1\u5B9A\u4FE1\u606F\">\n                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                                    <colgroup>\n                                        <col style=\"width: 80px\" />\n                                        <col style=\"width: 220px\" />\n                                        <col style=\"width: 100px\" />\n                                        <col />\n                                    </colgroup>\n                                    <tbody>\n                                        <tr>\n                                            <td>\u6807\u9898\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.caption\" />\n                                            </td>\n                                            <td>\u4FDD\u5B58\u5E76\u5173\u95ED\uFF1A</td>\n                                            <td>\n                                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"innerJsClientButtonEditData.execAndClose\">\n                                                    <radio label=\"true\">\u662F</radio>\n                                                    <radio label=\"false\">\u5426</radio>\n                                                </radio-group>\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u52A8\u4F5C\uFF1A</td>\n                                            <td colspan=\"3\">\n                                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"innerJsClientButtonEditData.actionType\">\n                                                    <radio label=\"reloadData\">\u91CD\u65B0\u52A0\u8F7D</radio>\n                                                    <radio label=\"callJsMethod\">\u8C03\u7528JS\u65B9\u6CD5</radio>\n                                                </radio-group>\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u6267\u884C\u65B9\u6CD5\uFF1A</td>\n                                            <td colspan=\"3\">\n                                                <i-input v-model=\"innerJsClientButtonEditData.callJsMethod\" placeholder=\"\u8C03\u7528JS\u65B9\u6CD5\" />\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </tab-pane>\n                            <tab-pane tab=\"inner-form-js-client-button-edit-tabs\" label=\"\u5F00\u53D1\u6269\u5C55\">\n                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                                    <colgroup>\n                                        <col style=\"width: 150px\" />\n                                        <col />\n                                    </colgroup>\n                                    <tbody>\n                                        <tr>\n                                            <td>ID\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.id\" size=\"small\" placeholder=\"\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u670D\u52A1\u7AEF\u89E3\u6790\u7C7B\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.custServerResolveMethod\" size=\"small\" placeholder=\"\u6309\u94AE\u8FDB\u884C\u670D\u52A1\u7AEF\u89E3\u6790\u65F6,\u7C7B\u5168\u79F0,\u5C06\u8C03\u7528\u8BE5\u7C7B,\u9700\u8981\u5B9E\u73B0\u63A5\u53E3IFormButtonCustResolve\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.custServerResolveMethodPara\" size=\"small\" placeholder=\"\u670D\u52A1\u7AEF\u89E3\u6790\u7C7B\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5BA2\u6237\u7AEF\u6E32\u67D3\u65B9\u6CD5\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.custClientRendererMethod\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u65B9\u6CD5,\u6309\u94AE\u5C06\u7ECF\u7531\u8BE5\u65B9\u6CD5\u6E32\u67D3,\u6700\u7EC8\u5F62\u6210\u9875\u9762\u5143\u7D20,\u9700\u8981\u8FD4\u56DE\u6700\u7EC8\u5143\u7D20\u7684HTML\u5BF9\u8C61\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.custClientRendererMethodPara\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u65B9\u6CD5\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5BA2\u6237\u7AEF\u6E32\u67D3\u540E\u65B9\u6CD5\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.custClientRendererAfterMethod\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u540E\u8C03\u7528\u65B9\u6CD5,\u7ECF\u8FC7\u9ED8\u8BA4\u7684\u6E32\u67D3,\u65E0\u8FD4\u56DE\u503C\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.custClientRendererAfterMethodPara\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u540E\u65B9\u6CD5\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5BA2\u6237\u7AEF\u70B9\u51FB\u524D\u65B9\u6CD5\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.custClientClickBeforeMethod\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u70B9\u51FB\u8BE5\u6309\u94AE\u65F6\u7684\u524D\u7F6E\u65B9\u6CD5,\u5982\u679C\u8FD4\u56DEfalse\u5C06\u963B\u6B62\u9ED8\u8BA4\u8C03\u7528\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerJsClientButtonEditData.custClientClickBeforeMethodPara\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u70B9\u51FB\u524D\u65B9\u6CD5\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </tab-pane>\n                        </tabs>\n                        <div class=\"button-outer-wrap\" style=\"padding-top:4px\">\n                            <div class=\"button-inner-wrap\" style=\"margin-right: 4px\">\n                                <button-group>\n                                    <i-button type=\"primary\" @click=\"saveInnerJsClientButtonToList()\"> \u4FDD \u5B58</i-button>\n                                    <i-button @click=\"handleClose('innerFormJsClientButtonWrap')\">\u5173 \u95ED</i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                    <div style=\"height: 210px;width: 100%\">\n                        <div style=\"float: left;width: 82%\">\n                            <i-table :height=\"210\" width=\"100%\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                                                     class=\"iv-list-table\" :highlight-row=\"true\"\n                                                     size=\"small\"></i-table>\n                        </div>\n                        <div style=\"float: left;width: 15%;margin-left: 8px\">\n                            <button-group vertical>\n                                <i-button type=\"success\" @click=\"addInnerFormSaveButton()\" icon=\"md-add\">\u4FDD\u5B58\u6309\u94AE</i-button>\n                                <i-button type=\"primary\" @click=\"addInnerFormCloseButton()\" icon=\"md-add\">\u5173\u95ED\u6309\u94AE</i-button>\n                                <i-button type=\"primary\" @click=\"addInnerFormJsClientButton()\" icon=\"md-add\">\u811A\u672C\u6309\u94AE</i-button>\n                                <i-button size=\"small\" icon=\"md-add\" disabled>\u610F\u89C1\u6309\u94AE</i-button>\n                                <i-button size=\"small\" icon=\"md-add\" disabled>\u6D41\u7A0B\u6309\u94AE</i-button>\n                                <i-button size=\"small\" disabled icon=\"md-add\">\u62F7\u8D1DJson</i-button>\n                                <i-button size=\"small\" disabled icon=\"md-add\">\u9ECF\u8D34Json</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("list-search-control-bind-to-comp", {
  props: ["bindToSearchFieldProp", "dataSetId"],
  data: function data() {
    var _self = this;

    return {
      bindToSearchField: {
        columnTitle: "",
        columnTableName: "",
        columnName: "",
        columnCaption: "",
        columnDataTypeName: "",
        columnOperator: "匹配"
      },
      defaultValue: {
        defaultType: "",
        defaultValue: "",
        defaultText: ""
      },
      tree: {
        treeObj: null,
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              _self.selectColumn(treeNode);
            },
            onDblClick: function onDblClick(event, treeId, treeNode) {},
            onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {}
          }
        },
        treeData: null
      },
      tempData: {
        defaultDisplayText: ""
      }
    };
  },
  watch: {
    bindToSearchFieldProp: function bindToSearchFieldProp(newValue) {
      console.log(newValue);
    },
    defaultValueProp: function defaultValueProp(newValue) {
      this.defaultValue = newValue;

      if (!StringUtility.IsNullOrEmpty(this.defaultValue.defaultType)) {
        this.tempData.defaultDisplayText = DefaultValueUtility.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
      }
    }
  },
  mounted: function mounted() {
    this.bindToField = this.bindToFieldProp;
  },
  methods: {
    init: function init(dataSetPO) {
      console.log(dataSetPO);
      var treeNodeArray = [];
      var rootNode = {
        pid: "-1",
        text: dataSetPO.dsName,
        id: dataSetPO.dsId,
        nodeType: "DataSet"
      };
      treeNodeArray.push(rootNode);

      for (var i = 0; i < dataSetPO.relatedTableVoList.length; i++) {
        treeNodeArray.push({
          pid: dataSetPO.dsId,
          text: dataSetPO.relatedTableVoList[i].rtTableCaption,
          id: dataSetPO.relatedTableVoList[i].rtTableId,
          nodeType: "Table"
        });

        for (var j = 0; j < dataSetPO.relatedTableVoList[i].tableFieldPOList.length; j++) {
          var singleNode = dataSetPO.relatedTableVoList[i].tableFieldPOList[j];
          singleNode.pid = dataSetPO.relatedTableVoList[i].rtTableId;
          singleNode.text = singleNode.fieldCaption + "[" + singleNode.fieldName + "]";
          singleNode.nodeType = "TableField";
          singleNode.id = singleNode.fieldId;
          singleNode.icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/page.png";
          treeNodeArray.push(singleNode);
        }
      }

      this.tree.treeObj = $.fn.zTree.init($(this.$refs.zTreeUL), this.tree.treeSetting, treeNodeArray);
      this.tree.treeObj.expandAll(true);
      fuzzySearchTreeObj(this.tree.treeObj, this.$refs.txt_search_text.$refs.input, null, true);
    },
    selectColumn: function selectColumn(fieldPO) {
      if (fieldPO.nodeType == "TableField") {
        this.bindToSearchField.columnTableName = fieldPO.tableName;
        this.bindToSearchField.columnName = fieldPO.fieldName;
        this.bindToSearchField.columnCaption = fieldPO.fieldCaption;
        this.bindToSearchField.columnDataTypeName = fieldPO.fieldDataType;
      }
    },
    getData: function getData() {
      console.log(this.bindToSearchField);
      return {
        bindToSearchField: this.bindToSearchField,
        defaultValue: this.defaultValue
      };
    },
    setData: function setData(bindToSearchField, defaultValue) {
      console.log(bindToSearchField);
      this.bindToSearchField = bindToSearchField;
      this.defaultValue = defaultValue;
      this.tempData.defaultDisplayText = DefaultValueUtility.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
    },
    selectDefaultValueView: function selectDefaultValueView() {
      window._SelectBindObj = this;
      window.parent.listDesign.selectDefaultValueDialogBegin(window, null);
    },
    setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(result) {
      if (result != null) {
        this.defaultValue.defaultType = result.Type;
        this.defaultValue.defaultValue = result.Value;
        this.defaultValue.defaultText = result.Text;
        this.tempData.defaultDisplayText = DefaultValueUtility.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
      } else {
        this.defaultValue.defaultType = "";
        this.defaultValue.defaultValue = "";
        this.defaultValue.defaultText = "";
        this.tempData.defaultDisplayText = "";
      }
    }
  },
  template: "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 280px\" />\n                        <col />\n                    </colgroup>\n                    <tbody>\n                        <tr>\n                            <td>\n                                \u6807\u9898\uFF1A\n                            </td>\n                            <td>\n                                <input type=\"text\" v-model=\"bindToSearchField.columnTitle\" />\n                            </td>\n                            <td rowspan=\"9\" valign=\"top\">\n                                <i-input search class=\"input_border_bottom\" ref=\"txt_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u5217\u540D\u6216\u8005\u6807\u9898\"></i-input>                                <ul ref=\"zTreeUL\" class=\"ztree div-custom-scroll\" style=\"height: 430px;overflow-x:hidden;overflow-y: scroll\"></ul>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u6240\u5C5E\u8868\uFF1A\n                            </td>\n                            <td>\n                                {{bindToSearchField.columnTableName}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u7ED1\u5B9A\u5B57\u6BB5\uFF1A\n                            </td>\n                            <td>\n                                {{bindToSearchField.columnCaption}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u5B57\u6BB5\u540D\u79F0\uFF1A\n                            </td>\n                            <td>\n                                {{bindToSearchField.columnName}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u5B57\u6BB5\u7C7B\u578B\uFF1A\n                            </td>\n                            <td>\n                                {{bindToSearchField.columnDataTypeName}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u8FD0\u7B97\u7B26\uFF1A\n                            </td>\n                            <td>\n                                <i-select v-model=\"bindToSearchField.columnOperator\" style=\"width:260px\">\n                                    <i-option value=\"eq\">\u7B49\u4E8E</i-option>\n                                    <i-option value=\"like\">\u5339\u914D</i-option>\n                                    <i-option value=\"not_eq\">\u4E0D\u7B49\u4E8E</i-option>\n                                    <i-option value=\"gt\">\u5927\u4E8E</i-option>\n                                    <i-option value=\"gt_eq\">\u5927\u4E8E\u7B49\u4E8E</i-option>\n                                    <i-option value=\"lt\">\u5C0F\u4E8E</i-option>\n                                    <i-option value=\"lt_eq\">\u5C0F\u4E8E\u7B49\u4E8E</i-option>\n                                    <i-option value=\"left_like\">\u5DE6\u5339\u914D</i-option>\n                                    <i-option value=\"right_like\">\u53F3\u5339\u914D</i-option>\n                                    <i-option value=\"include\">\u5305\u542B[\u6682\u65F6\u4E0D\u652F\u6301]</i-option>\n                                </i-select>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"2\">\u9ED8\u8BA4\u503C<button class=\"btn-select fright\" v-on:click=\"selectDefaultValueView\">...</button></td>\n                        </tr>\n                        <tr style=\"height: 35px\">\n                            <td colspan=\"2\" style=\"background-color: #ffffff;\">\n                                {{tempData.defaultDisplayText}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u5907\u6CE8\uFF1A\n                            </td>\n                            <td>\n                                <textarea rows=\"8\"></textarea>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>"
});
"use strict";

Vue.component("list-table-label-bind-to-comp", {
  props: ["bindPropProp", "dataSetId"],
  data: function data() {
    var _self = this;

    return {
      bindProp: {
        columnTableName: "",
        columnName: "",
        columnCaption: "",
        columnDataTypeName: "",
        targetButtonId: "",
        columnAlign: "居中对齐"
      },
      defaultValue: {
        defaultType: "",
        defaultValue: "",
        defaultText: ""
      },
      tree: {
        treeObj: null,
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              _self.selectColumn(treeNode);
            },
            onDblClick: function onDblClick(event, treeId, treeNode) {},
            onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {}
          }
        },
        treeData: null
      },
      tempData: {
        defaultDisplayText: ""
      },
      buttons: []
    };
  },
  watch: {
    bindPropProp: function bindPropProp(newValue) {
      console.log(newValue);
    },
    defaultValueProp: function defaultValueProp(newValue) {
      this.defaultValue = newValue;

      if (!StringUtility.IsNullOrEmpty(this.defaultValue.defaultType)) {
        this.tempData.defaultDisplayText = DefaultValueUtility.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
      }
    }
  },
  mounted: function mounted() {
    this.bindToField = this.bindToFieldProp;
  },
  methods: {
    init: function init(dataSetVo, buttons) {
      console.log(dataSetVo);
      var treeNodeArray = [];
      var treeNodeData = dataSetVo.columnVoList;

      for (var i = 0; i < treeNodeData.length; i++) {
        var singleNode = treeNodeData[i];
        singleNode.pid = dataSetVo.dsId;
        singleNode.text = singleNode.columnCaption + "[" + singleNode.columnName + "]";
        singleNode.nodeType = "DataSetColumn";
        singleNode.id = singleNode.columnId;
        singleNode.icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/page.png";
        treeNodeArray.push(singleNode);
      }

      var rootNode = {
        pid: "-1",
        text: dataSetVo.dsName,
        id: dataSetVo.dsId,
        nodeType: "DataSet"
      };
      treeNodeArray.push(rootNode);
      this.tree.treeObj = $.fn.zTree.init($(this.$refs.zTreeUL), this.tree.treeSetting, treeNodeArray);
      this.tree.treeObj.expandAll(true);
      this.buttons = buttons;
    },
    selectColumn: function selectColumn(columnVo) {
      this.bindProp.columnTableName = columnVo.columnTableName;
      this.bindProp.columnName = columnVo.columnName;
      this.bindProp.columnCaption = columnVo.columnCaption;
      this.bindProp.columnDataTypeName = columnVo.columnDataTypeName;
    },
    getData: function getData() {
      console.log(this.bindProp);

      if (!this.bindProp.targetButtonId) {
        this.bindProp.targetButtonId = "";
      }

      return {
        bindProp: this.bindProp,
        defaultValue: this.defaultValue
      };
    },
    setData: function setData(bindProp, defaultValue) {
      console.log(bindProp);
      this.bindProp = bindProp;
      this.defaultValue = defaultValue;
      this.tempData.defaultDisplayText = DefaultValueUtility.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
    },
    selectDefaultValueView: function selectDefaultValueView() {
      window._SelectBindObj = this;
      window.parent.listDesign.selectDefaultValueDialogBegin(window, null);
    },
    setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(result) {
      if (result != null) {
        this.defaultValue.defaultType = result.Type;
        this.defaultValue.defaultValue = result.Value;
        this.defaultValue.defaultText = result.Text;
        this.tempData.defaultDisplayText = DefaultValueUtility.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
      } else {
        this.defaultValue.defaultType = "";
        this.defaultValue.defaultValue = "";
        this.defaultValue.defaultText = "";
        this.tempData.defaultDisplayText = "";
      }
    }
  },
  template: "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 280px\" />\n                        <col />\n                    </colgroup>\n                    <tbody>\n                        <tr>\n                            <td>\n                                \u5BF9\u9F50\u65B9\u5F0F\uFF1A\n                            </td>\n                            <td>\n                                <i-select v-model=\"bindProp.columnAlign\" style=\"width:260px\">\n                                    <i-option value=\"\u5DE6\u5BF9\u9F50\">\u5DE6\u5BF9\u9F50</i-option>\n                                    <i-option value=\"\u5C45\u4E2D\u5BF9\u9F50\">\u5C45\u4E2D\u5BF9\u9F50</i-option>\n                                    <i-option value=\"\u53F3\u5BF9\u9F50\">\u53F3\u5BF9\u9F50</i-option>\n                                </i-select>\n                            </td>\n                            <td rowspan=\"9\" valign=\"top\">\n                                <ul ref=\"zTreeUL\" id=\"list-table-label-bind-to-comp-tree\" class=\"ztree\" style=\"height: 470px;overflow: auto\"></ul>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u6240\u5C5E\u8868\uFF1A\n                            </td>\n                            <td>\n                                {{bindProp.columnTableName}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u7ED1\u5B9A\u5B57\u6BB5\uFF1A\n                            </td>\n                            <td>\n                                {{bindProp.columnCaption}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u5B57\u6BB5\u540D\u79F0\uFF1A\n                            </td>\n                            <td>\n                                {{bindProp.columnName}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u5B57\u6BB5\u7C7B\u578B\uFF1A \n                            </td>\n                            <td>\n                                {{bindProp.columnDataTypeName}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u89E6\u53D1\u6309\u94AE\uFF1A\n                            </td>\n                            <td>\n                                <i-select v-model=\"bindProp.targetButtonId\" style=\"width:260px\" :clearable=\"true\">\n                                    <i-option :value=\"item.buttonId\" v-for=\"item in buttons\">{{item.buttonCaption}}</i-option>\n                                </i-select>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"2\">\u9ED8\u8BA4\u503C<button class=\"btn-select fright\" v-on:click=\"selectDefaultValueView\">...</button></td>\n                        </tr>\n                        <tr style=\"height: 35px\">\n                            <td colspan=\"2\" style=\"background-color: #ffffff;\">\n                                {{tempData.defaultDisplayText}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u5907\u6CE8\uFF1A\n                            </td>\n                            <td>\n                                <textarea rows=\"8\"></textarea>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>"
});
"use strict";

Vue.component("module-list-webform-comp", {
  props: ['listHeight', 'moduleData', 'activeTabName'],
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        editView: "/HTML/Builder/Form/FormDesign.html",
        previewWebFormUrl: "/HTML/Builder/Form/FormPreview.html",
        reloadData: "/Rest/Builder/Form/GetListData",
        "delete": "/Rest/Builder/Form/Delete",
        move: "/Rest/Builder/Form/Move",
        copyForm: "/Rest/Builder/Form/CopyForm"
      },
      idFieldName: "formId",
      searchCondition: {
        formModuleId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      columnsConfig: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '编号',
        key: 'formCode',
        align: "center",
        width: 80
      }, {
        title: '表单名称',
        key: 'formName',
        align: "left"
      }, {
        title: '唯一名',
        key: 'formSingleName',
        align: "center"
      }, {
        title: '备注',
        key: 'formDesc',
        align: "center"
      }, {
        title: '编辑时间',
        key: 'formUpdateTime',
        width: 100,
        align: "center",
        render: function render(h, params) {
          return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.formUpdateTime);
        }
      }, {
        title: '操作',
        key: 'formId',
        width: 120,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            "class": "list-row-button-wrap"
          }, [ListPageUtility.IViewTableInnerButton.EditButton(h, params, _self.idFieldName, _self), ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, _self.idFieldName, _self)]);
        }
      }],
      tableData: [],
      tableDataOriginal: [],
      selectionRows: null,
      pageTotal: 0,
      pageSize: 500,
      pageNum: 1,
      searchText: ""
    };
  },
  mounted: function mounted() {
    window._modulelistwebformcomp = this;
  },
  watch: {
    moduleData: function moduleData(newVal) {
      this.reloadData();
    },
    activeTabName: function activeTabName(newVal) {
      this.reloadData();
    },
    searchText: function searchText(newVal) {
      if (newVal) {
        var filterTableData = [];

        for (var i = 0; i < this.tableData.length; i++) {
          var row = this.tableData[i];

          if (row.formCode.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          } else if (row.formName.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          }
        }

        this.tableData = filterTableData;
      } else {
        this.tableData = this.tableDataOriginal;
      }
    }
  },
  methods: {
    getModuleName: function getModuleName() {
      return this.moduleData == null ? "请选中模块" : this.moduleData.moduleText;
    },
    selectionChange: function selectionChange(selection) {
      this.selectionRows = selection;
    },
    reloadData: function reloadData() {
      if (this.moduleData != null && this.activeTabName == "list-webform") {
        this.searchCondition.formModuleId.value = this.moduleData.moduleId;
        ListPageUtility.IViewTableBindDataBySearch({
          url: this.acInterface.reloadData,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchCondition: this.searchCondition,
          pageAppObj: this,
          tableList: this,
          idField: this.idFieldName,
          autoSelectedOldRows: true,
          successFunc: function successFunc(result, pageAppObj) {
            pageAppObj.tableDataOriginal = result.data.list;
          },
          loadDict: false,
          custParas: {}
        });
      }
    },
    add: function add() {
      if (this.moduleData != null) {
        var url = BaseUtility.BuildView(this.acInterface.editView, {
          "op": "add",
          "moduleId": this.moduleData.moduleId
        });
        DialogUtility.OpenNewTabWindow(url);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
      }
    },
    edit: function edit(recordId) {
      var url = BaseUtility.BuildView(this.acInterface.editView, {
        "op": "update",
        "recordId": recordId
      });
      DialogUtility.OpenNewTabWindow(url);
    },
    del: function del(recordId) {
      ListPageUtility.IViewTableDeleteRow(this.acInterface["delete"], recordId, this);
    },
    statusEnable: function statusEnable(statusName) {
      ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
    },
    move: function move(type) {
      ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
    },
    previewWebForm: function previewWebForm() {
      ListPageUtility.IViewTableMareSureSelectedOne(this.selectionRows, this).then(function (selectionRows) {
        var recordId = selectionRows[0][this.idFieldName];
        var previewUrl = BaseUtility.BuildView(this.acInterface.previewWebFormUrl, {
          FormId: recordId,
          OperationType: "add",
          RecordId: StringUtility.Guid()
        });
        DialogUtility.OpenNewTabWindow(previewUrl);
      });
    },
    copy: function copy() {
      ListPageUtility.IViewTableMareSureSelectedOne(this.selectionRows, this).then(function (selectionRows) {
        var recordId = selectionRows[0][this.idFieldName];
        AjaxUtility.Post(this.acInterface.copyForm, {
          formId: recordId
        }, function (result) {
          if (result.success) {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
              this.reloadData();
            }, this);
          }
        }, this);
      });
    }
  },
  template: "<div class=\"module-list-wrap\">\n                    <div id=\"list-button-wrap\" class=\"list-button-outer-wrap\">\n                        <div class=\"module-list-name\"><Icon type=\"ios-arrow-dropright-circle\" />&nbsp;\u6A21\u5757\u3010{{getModuleName()}}\u3011</div>\n                        <div class=\"list-button-inner-wrap\">\n                            <ButtonGroup>\n                                <i-button  type=\"success\" @click=\"add()\" icon=\"md-add\">\u65B0\u589E</i-button>\n                                <i-button type=\"primary\" @click=\"copy()\" icon=\"md-albums\">\u590D\u5236</i-button>\n                                <i-button type=\"primary\" @click=\"previewWebForm()\"  icon=\"md-pricetag\">\u9884\u89C8</i-button>\n                                <i-button type=\"primary\" disabled icon=\"md-add\">\u5F15\u5165URL </i-button>\n                                <i-button type=\"primary\" disabled icon=\"md-bookmarks\">\u5386\u53F2\u7248\u672C</i-button>\n                                <i-button type=\"primary\" @click=\"move('up')\" icon=\"md-arrow-up\">\u4E0A\u79FB</i-button>\n                                <i-button type=\"primary\" @click=\"move('down')\" icon=\"md-arrow-down\">\u4E0B\u79FB</i-button>\n                            </ButtonGroup>\n                        </div>\n                         <div style=\"float: right;width: 200px;margin-right: 10px;\">\n                            <i-input search class=\"input_border_bottom\" v-model=\"searchText\">\n                            </i-input>\n                        </div>                        <div style=\"clear: both\"></div>\n                    </div>\n                    <i-table :height=\"listHeight\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                             class=\"iv-list-table\" :highlight-row=\"true\"\n                             @on-selection-change=\"selectionChange\"></i-table>\n                </div>"
});
"use strict";

Vue.component("module-list-weblist-comp", {
  props: ['listHeight', 'moduleData', 'activeTabName'],
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        editView: "/HTML/Builder/List/ListDesign.html",
        reloadData: "/Rest/Builder/List/GetListData",
        "delete": "/Rest/Builder/List/Delete",
        move: "/Rest/Builder/List/Move"
      },
      idFieldName: "listId",
      searchCondition: {
        listModuleId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      columnsConfig: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '编号',
        key: 'listCode',
        align: "center",
        width: 80
      }, {
        title: '列表名称',
        key: 'listName',
        align: "left"
      }, {
        title: '唯一名',
        key: 'listSingleName',
        align: "center"
      }, {
        title: '备注',
        key: 'listDesc',
        align: "center"
      }, {
        title: '编辑时间',
        key: 'listUpdateTime',
        width: 100,
        align: "center",
        render: function render(h, params) {
          return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.listUpdateTime);
        }
      }, {
        title: '操作',
        key: 'listId',
        width: 120,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            "class": "list-row-button-wrap"
          }, [ListPageUtility.IViewTableInnerButton.EditButton(h, params, _self.idFieldName, _self), ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, _self.idFieldName, _self)]);
        }
      }],
      tableData: [],
      tableDataOriginal: [],
      selectionRows: null,
      pageTotal: 0,
      pageSize: 500,
      pageNum: 1,
      searchText: ""
    };
  },
  mounted: function mounted() {
    window._modulelistweblistcomp = this;
  },
  watch: {
    moduleData: function moduleData(newVal) {
      this.reloadData();
    },
    activeTabName: function activeTabName(newVal) {
      this.reloadData();
    },
    searchText: function searchText(newVal) {
      if (newVal) {
        var filterTableData = [];

        for (var i = 0; i < this.tableData.length; i++) {
          var row = this.tableData[i];

          if (row.formCode.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          } else if (row.formName.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          }
        }

        this.tableData = filterTableData;
      } else {
        this.tableData = this.tableDataOriginal;
      }
    }
  },
  methods: {
    getModuleName: function getModuleName() {
      return this.moduleData == null ? "请选中模块" : this.moduleData.moduleText;
    },
    selectionChange: function selectionChange(selection) {
      this.selectionRows = selection;
    },
    reloadData: function reloadData() {
      if (this.moduleData != null && this.activeTabName == "list-weblist") {
        this.searchCondition.listModuleId.value = this.moduleData.moduleId;
        ListPageUtility.IViewTableBindDataBySearch({
          url: this.acInterface.reloadData,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchCondition: this.searchCondition,
          pageAppObj: this,
          tableList: this,
          idField: this.idFieldName,
          autoSelectedOldRows: true,
          successFunc: function successFunc(result, pageAppObj) {
            pageAppObj.tableDataOriginal = result.data.list;
          },
          loadDict: false,
          custParas: {}
        });
      }
    },
    add: function add() {
      if (this.moduleData != null) {
        var url = BaseUtility.BuildView(this.acInterface.editView, {
          "op": "add",
          "moduleId": this.moduleData.moduleId
        });
        DialogUtility.OpenNewTabWindow(url);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
      }
    },
    edit: function edit(recordId) {
      var url = BaseUtility.BuildView(this.acInterface.editView, {
        "op": "update",
        "recordId": recordId
      });
      DialogUtility.OpenNewTabWindow(url);
    },
    del: function del(recordId) {
      ListPageUtility.IViewTableDeleteRow(this.acInterface["delete"], recordId, this);
    },
    statusEnable: function statusEnable(statusName) {
      ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
    },
    move: function move(type) {
      ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
    }
  },
  template: '<div class="module-list-wrap">\
                    <div id="list-button-wrap" class="list-button-outer-wrap">\
                        <div class="module-list-name"><Icon type="ios-arrow-dropright-circle" />&nbsp;模块【{{getModuleName()}}】</div>\
                        <div class="list-button-inner-wrap">\
                            <ButtonGroup>\
                                <i-button  type="success" @click="add()" icon="md-add">新增</i-button>\
                                <i-button type="error" icon="md-albums">复制</i-button>\
                                <i-button type="error" icon="md-pricetag">预览</i-button>\
                                <i-button type="error" icon="md-bookmarks">历史版本</i-button>\
                                <i-button type="error" icon="md-brush">复制ID</i-button>\
                                <i-button type="primary" @click="move(\'up\')" icon="md-arrow-up">上移</i-button>\
                                <i-button type="primary" @click="move(\'down\')" icon="md-arrow-down">下移</i-button>\
                            </ButtonGroup>\
                        </div>\
                         <div style="float: right;width: 200px;margin-right: 10px;">\
                            <i-input search class="input_border_bottom" v-model="searchText">\
                            </i-input>\
                        </div>\
                        <div style="clear: both"></div>\
                    </div>\
                    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"\
                             class="iv-list-table" :highlight-row="true"\
                             @on-selection-change="selectionChange"></i-table>\
                </div>'
});
"use strict";

Vue.component("module-list-workflow-comp", {
  props: ['listHeight', 'moduleData', 'activeTabName'],
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        editView: "/HTML/WorkFlow/Modeler/Index.html",
        reloadData: "/Rest/Builder/FlowIntegrated/GetListData",
        "delete": "/Rest/Builder/FlowIntegrated/Delete",
        move: "/Rest/Builder/FlowIntegrated/Move"
      },
      idFieldName: "integratedId",
      searchCondition: {
        integratedModuleId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      columnsConfig: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '编号',
        key: 'integratedCode',
        align: "center",
        width: 80
      }, {
        title: '模型名称',
        key: 'integratedName',
        align: "left"
      }, {
        title: '启动Key',
        key: 'integratedStartKey',
        align: "center"
      }, {
        title: '备注',
        key: 'integratedDesc',
        align: "center"
      }, {
        title: '编辑时间',
        key: 'integratedUpdateTime',
        width: 100,
        align: "center",
        render: function render(h, params) {
          return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.integratedUpdateTime);
        }
      }, {
        title: '操作',
        key: 'integratedId',
        width: 120,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            "class": "list-row-button-wrap"
          }, [ListPageUtility.IViewTableInnerButton.EditButton(h, params, _self.idFieldName, _self), ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, _self.idFieldName, _self)]);
        }
      }],
      tableData: [],
      tableDataOriginal: [],
      selectionRows: null,
      pageTotal: 0,
      pageSize: 500,
      pageNum: 1,
      searchText: ""
    };
  },
  mounted: function mounted() {
    window._modulelistweblistcomp = this;
  },
  watch: {
    moduleData: function moduleData(newVal) {
      this.reloadData();
    },
    activeTabName: function activeTabName(newVal) {
      this.reloadData();
    },
    searchText: function searchText(newVal) {
      if (newVal) {
        var filterTableData = [];

        for (var i = 0; i < this.tableData.length; i++) {
          var row = this.tableData[i];

          if (row.formCode.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          } else if (row.formName.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          }
        }

        this.tableData = filterTableData;
      } else {
        this.tableData = this.tableDataOriginal;
      }
    }
  },
  methods: {
    getModuleName: function getModuleName() {
      return this.moduleData == null ? "请选中模块" : this.moduleData.moduleText;
    },
    selectionChange: function selectionChange(selection) {
      this.selectionRows = selection;
    },
    reloadData: function reloadData() {
      if (this.moduleData != null && this.activeTabName == "list-weblist") {
        this.searchCondition.integratedModuleId.value = this.moduleData.moduleId;
        ListPageUtility.IViewTableBindDataBySearch({
          url: this.acInterface.reloadData,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchCondition: this.searchCondition,
          pageAppObj: this,
          tableList: this,
          idField: this.idFieldName,
          autoSelectedOldRows: true,
          successFunc: function successFunc(result, pageAppObj) {
            pageAppObj.tableDataOriginal = result.data.list;
          },
          loadDict: false,
          custParas: {}
        });
      }
    },
    add: function add() {
      if (this.moduleData != null) {
        var url = BaseUtility.BuildView(this.acInterface.editView, {
          "op": "add",
          "moduleId": this.moduleData.moduleId
        });
        DialogUtility.OpenNewTabWindow(url);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
      }
    },
    edit: function edit(recordId) {
      var url = BaseUtility.BuildView(this.acInterface.editView, {
        "op": "update",
        "recordId": recordId
      });
      DialogUtility.OpenNewTabWindow(url);
    },
    del: function del(recordId) {
      ListPageUtility.IViewTableDeleteRow(this.acInterface["delete"], recordId, this);
    },
    statusEnable: function statusEnable(statusName) {
      ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
    },
    move: function move(type) {
      ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
    }
  },
  template: "<div class=\"module-list-wrap\">\n                    <div id=\"list-button-wrap\" class=\"list-button-outer-wrap\">\n                        <div class=\"module-list-name\"><Icon type=\"ios-arrow-dropright-circle\" />&nbsp;\u6A21\u5757\u3010{{getModuleName()}}\u3011</div>\n                        <div class=\"list-button-inner-wrap\">\n                            <ButtonGroup>                                <i-button  type=\"success\" @click=\"add()\" icon=\"md-add\">\u65B0\u589E</i-button>\n                                <i-button type=\"error\" icon=\"md-albums\" disabled>\u590D\u5236</i-button>\n                                <i-button type=\"error\" icon=\"md-bookmarks\" disabled>\u5386\u53F2\u7248\u672C</i-button>\n                                <i-button type=\"error\" icon=\"md-brush\" disabled>\u590D\u5236ID</i-button>\n                                <i-button type=\"error\" icon=\"md-arrow-up\" disabled>\u4E0A\u79FB</i-button>\n                                <i-button type=\"error\" icon=\"md-arrow-down\" disabled>\u4E0B\u79FB</i-button>\n                            </ButtonGroup>\n                        </div>\n                         <div style=\"float: right;width: 200px;margin-right: 10px;\">\n                            <i-input search class=\"input_border_bottom\" v-model=\"searchText\">\n                            </i-input>\n                        </div>\n                        <div style=\"clear: both\"></div>\n                    </div>\n                    <i-table :height=\"listHeight\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                             class=\"iv-list-table\" :highlight-row=\"true\"\n                             @on-selection-change=\"selectionChange\"></i-table>\n                </div>"
});
"use strict";

Vue.component("select-dblink-single-comp", {
  data: function data() {
    return {
      acInterface: {
        getDBLinkDataUrl: "/Rest/Builder/DataStorage/DBLink/GetFullDBLink",
        getSingleDBLinkDataUrl: "/Rest/Builder/DataStorage/DBLink/GetDetailData"
      },
      jsEditorInstance: null,
      dbLinkTree: {
        treeObj: null,
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "dbLinkName"
            },
            simpleData: {
              enable: true,
              idKey: "dbId",
              pIdKey: "dbOrderNum",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              var _self = this.getZTreeObj(treeId)._host;

              _self.selectedDBLink(treeNode);

              _self.handleClose();
            }
          }
        },
        treeData: null,
        clickNode: null
      },
      selectedDBLinkData: null
    };
  },
  mounted: function mounted() {},
  methods: {
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectDBLinkModelDialogWrap);
    },
    beginSelectDBLink: function beginSelectDBLink() {
      var elem = this.$refs.selectDBLinkModelDialogWrap;
      this.getDBLinkDataInitTree();
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 470,
        height: 500,
        title: "选择数据库连接"
      });
    },
    getDBLinkDataInitTree: function getDBLinkDataInitTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getDBLinkDataUrl, {}, function (result) {
        if (result.success) {
          _self.dbLinkTree.treeData = result.data;

          for (var i = 0; i < _self.dbLinkTree.treeData.length; i++) {
            _self.dbLinkTree.treeData[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/database_connect.png";
          }

          _self.$refs.dbLinkZTreeUL.setAttribute("id", "select-dbLink-single-comp-" + StringUtility.Guid());

          _self.dbLinkTree.treeObj = $.fn.zTree.init($(_self.$refs.dbLinkZTreeUL), _self.dbLinkTree.treeSetting, _self.dbLinkTree.treeData);

          _self.dbLinkTree.treeObj.expandAll(true);

          _self.dbLinkTree.treeObj._host = _self;
          fuzzySearchTreeObj(_self.dbLinkTree.treeObj, _self.$refs.txt_dbLink_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    selectedDBLink: function selectedDBLink(dbLinkData) {
      this.selectedDBLinkData = dbLinkData;
      this.$emit('on-selected-dblink', dbLinkData);
    },
    getSelectedDBLinkName: function getSelectedDBLinkName() {
      if (this.selectedDBLinkData == null) {
        return "请选择数据库连接";
      } else {
        return this.selectedDBLinkData.dbLinkName;
      }
    },
    setOldSelectedDBLink: function setOldSelectedDBLink(dbLinkId) {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getSingleDBLinkDataUrl, {
        "recordId": dbLinkId
      }, function (result) {
        if (result.success) {
          _self.selectedDBLinkData = result.data;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    }
  },
  template: "<div>\n                    <div class=\"select-view-dblink-wrap\">\n                        <div class=\"text\">{{getSelectedDBLinkName()}}</div>\n                        <div class=\"value\"></div>\n                        <div class=\"id\"></div>\n                        <div class=\"button\" @click=\"beginSelectDBLink()\"><Icon type=\"ios-funnel\" />&nbsp;\u9009\u62E9</div>\n                    </div>\n                    <div ref=\"selectDBLinkModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                        <div class=\"c1-select-model-source-wrap\">\n                            <i-input search class=\"input_border_bottom\" ref=\"txt_dbLink_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u6570\u636E\u5E93\u8FDE\u63A5\u540D\u79F0\">\n                            </i-input>\n                            <div class=\"inner-wrap div-custom-scroll\">\n                                <ul ref=\"dbLinkZTreeUL\" class=\"ztree\"></ul>\n                            </div>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("select-site-single-comp", {
  data: function data() {
    return {
      acInterface: {
        getDBLinkDataUrl: "/Rest/Builder/SiteInfo/GetFullSite",
        getSingleDBLinkDataUrl: "/Rest/Builder/DataStorage/DBLink/GetDetailData"
      },
      jsEditorInstance: null,
      siteTree: {
        treeObj: null,
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "siteName"
            },
            simpleData: {
              enable: true,
              idKey: "siteId",
              pIdKey: "siteOrderNum",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              var _self = this.getZTreeObj(treeId)._host;

              _self.selectedSite(treeNode);

              _self.handleClose();
            }
          }
        },
        treeData: null,
        clickNode: null
      },
      selectedSiteData: null
    };
  },
  mounted: function mounted() {},
  methods: {
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectSiteModelDialogWrap);
    },
    beginSelectSite: function beginSelectSite() {
      var elem = this.$refs.selectSiteModelDialogWrap;
      this.getSiteDataInitTree();
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 470,
        height: 500,
        title: "选择站点"
      });
    },
    getSiteDataInitTree: function getSiteDataInitTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getDBLinkDataUrl, {}, function (result) {
        if (result.success) {
          _self.siteTree.treeData = result.data;

          for (var i = 0; i < _self.siteTree.treeData.length; i++) {
            _self.siteTree.treeData[i].icon = BaseUtility.GetRootPath() + "/Themes/Png16X16/database_connect.png";
          }

          _self.$refs.siteZTreeUL.setAttribute("id", "select-dbLink-single-comp-" + StringUtility.Guid());

          _self.siteTree.treeObj = $.fn.zTree.init($(_self.$refs.siteZTreeUL), _self.siteTree.treeSetting, _self.siteTree.treeData);

          _self.siteTree.treeObj.expandAll(true);

          _self.siteTree.treeObj._host = _self;
          fuzzySearchTreeObj(_self.siteTree.treeObj, _self.$refs.txt_site_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    },
    selectedSite: function selectedSite(siteData) {
      this.selectedSiteData = siteData;
      this.$emit('on-selected-site', siteData);
    },
    getSelectedSiteName: function getSelectedSiteName() {
      if (this.selectedSiteData == null) {
        return "请选择站点";
      } else {
        return this.selectedSiteData.siteName;
      }
    },
    setOldSelectedSite: function setOldSelectedSite(dbLinkId) {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getSingleDBLinkDataUrl, {
        "recordId": dbLinkId
      }, function (result) {
        if (result.success) {
          _self.selectedSiteData = result.data;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    }
  },
  template: "<div>\n                    <div class=\"select-view-dblink-wrap\">\n                        <div class=\"text\">{{getSelectedSiteName()}}</div>\n                        <div class=\"value\"></div>\n                        <div class=\"id\"></div>\n                        <div class=\"button\" @click=\"beginSelectSite()\"><Icon type=\"ios-funnel\" />&nbsp;\u9009\u62E9</div>\n                    </div>\n                    <div ref=\"selectSiteModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                        <div class=\"c1-select-model-source-wrap\">\n                            <i-input search class=\"input_border_bottom\" ref=\"txt_site_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u7AD9\u70B9\u540D\u79F0\">\n                            </i-input>\n                            <div class=\"inner-wrap div-custom-scroll\">\n                                <ul ref=\"siteZTreeUL\" class=\"ztree\"></ul>\n                            </div>\n                        </div>\n                    </div>\n                </div>"
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXAvZGF0YXNldC1zaW1wbGUtc2VsZWN0LWNvbXAuanMiLCJDb21wL2pzLWRlc2lnbi1jb2RlLWZyYWdtZW50LmpzIiwiQ29tcC9zaXRlLXRlbXBsYXRlLXJlbGF0aW9uLWNvbXAuanMiLCJDb21wL3NxbC1nZW5lcmFsLWRlc2lnbi1jb21wLmpzIiwiQ29tcC90YWJsZS1yZWxhdGlvbi1jb250ZW50LWNvbXAuanMiLCJEaWFsb2cvc2VsZWN0LWRlZmF1bHQtdmFsdWUtZGlhbG9nLmpzIiwiRGlhbG9nL3NlbGVjdC1zaW5nbGUtdGFibGUtZGlhbG9nLmpzIiwiRGlhbG9nL3NlbGVjdC1zaW5nbGUtd2ViZm9ybS1kaWFsb2cuanMiLCJEaWFsb2cvc2VsZWN0LXZhbGlkYXRlLXJ1bGUtZGlhbG9nLmpzIiwiRGlhbG9nL3RhYmxlLXJlbGF0aW9uLWNvbm5lY3QtdHdvLXRhYmxlLWRpYWxvZy5qcyIsIkhUTUxEZXNpZ24vZGItdGFibGUtcmVsYXRpb24tY29tcC5qcyIsIkhUTUxEZXNpZ24vZGVzaWduLWh0bWwtZWxlbS1saXN0LmpzIiwiSFRNTERlc2lnbi9mZC1jb250cm9sLWJhc2UtaW5mby5qcyIsIkhUTUxEZXNpZ24vZmQtY29udHJvbC1iaW5kLXRvLmpzIiwiSFRNTERlc2lnbi9mZC1jb250cm9sLWRhdGFzb3VyY2UuanMiLCJIVE1MRGVzaWduL2ZkLWNvbnRyb2wtZmllbGQtYW5kLWFwaS5qcyIsIkhUTUxEZXNpZ24vZmQtY29udHJvbC1zZWxlY3QtYmluZC10by1zaW5nbGUtZmllbGQtZGlhbG9nLmpzIiwiSFRNTERlc2lnbi9pbm5lci1mb3JtLWJ1dHRvbi1saXN0LWNvbXAuanMiLCJIVE1MRGVzaWduL2xpc3Qtc2VhcmNoLWNvbnRyb2wtYmluZC10by1jb21wLmpzIiwiSFRNTERlc2lnbi9saXN0LXRhYmxlLWxhYmVsLWJpbmQtdG8tY29tcC5qcyIsIk1vZHVsZS9tb2R1bGUtbGlzdC13ZWJmb3JtLWNvbXAuanMiLCJNb2R1bGUvbW9kdWxlLWxpc3Qtd2VibGlzdC1jb21wLmpzIiwiTW9kdWxlL21vZHVsZS1saXN0LXdvcmtmbG93LWNvbXAuanMiLCJTZWxlY3RCdXR0b24vc2VsZWN0LWRibGluay1zaW5nbGUtY29tcC5qcyIsIlNlbGVjdEJ1dHRvbi9zZWxlY3Qtc2l0ZS1zaW5nbGUtY29tcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25xQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDemVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkJ1aWxkZXJWdWVFWENvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZGF0YXNldC1zaW1wbGUtc2VsZWN0LWNvbXBcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0RGF0YVNldERhdGE6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU2V0L0RhdGFTZXRNYWluL0dldERhdGFTZXRzRm9yWlRyZWVOb2RlTGlzdFwiXG4gICAgICB9LFxuICAgICAgZGF0YVNldFRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIGlmICh0cmVlTm9kZS5ub2RlVHlwZU5hbWUgPT0gXCJEYXRhU2V0XCIpIHtcbiAgICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZE5vZGUodHJlZU5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmVlRGF0YTogbnVsbCxcbiAgICAgICAgc2VsZWN0ZWRUYWJsZU5hbWU6IFwi5pegXCJcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuYmluZERhdGFTZXRUcmVlKCk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBiaW5kRGF0YVNldFRyZWU6IGZ1bmN0aW9uIGJpbmREYXRhU2V0VHJlZSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXREYXRhU2V0RGF0YSwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5kYXRhICE9IG51bGwgJiYgcmVzdWx0LmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAocmVzdWx0LmRhdGFbaV0ubm9kZVR5cGVOYW1lID09IFwiRGF0YVNldEdyb3VwXCIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuZGF0YVtpXS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi9wYWNrYWdlLnBuZ1wiO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhW2ldLmljb24gPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvVGhlbWVzL1BuZzE2WDE2L2FwcGxpY2F0aW9uX3ZpZXdfY29sdW1ucy5wbmdcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIF9zZWxmLmRhdGFTZXRUcmVlLnRyZWVEYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgX3NlbGYuZGF0YVNldFRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI2RhdGFTZXRaVHJlZVVMXCIpLCBfc2VsZi5kYXRhU2V0VHJlZS50cmVlU2V0dGluZywgX3NlbGYuZGF0YVNldFRyZWUudHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYuZGF0YVNldFRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG5cbiAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmooX3NlbGYuZGF0YVNldFRyZWUudHJlZU9iaiwgX3NlbGYuJHJlZnMudHh0X3NlYXJjaF90ZXh0LiRyZWZzLmlucHV0LCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIHNlbGVjdGVkTm9kZTogZnVuY3Rpb24gc2VsZWN0ZWROb2RlKHRyZWVOb2RlKSB7XG4gICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1kYXRhc2V0JywgdHJlZU5vZGUpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC13cmFwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVwiaW5wdXRfYm9yZGVyX2JvdHRvbVwiIHJlZj1cInR4dF9zZWFyY2hfdGV4dFwiIHBsYWNlaG9sZGVyPVwi6K+36L6T5YWl6KGo5ZCN5oiW6ICF5qCH6aKYXCI+PC9pLWlucHV0PlxcXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cImRhdGFTZXRaVHJlZVVMXCIgY2xhc3M9XCJ6dHJlZVwiPjwvdWw+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImpzLWRlc2lnbi1jb2RlLWZyYWdtZW50XCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAganNFZGl0b3JJbnN0YW5jZTogbnVsbFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIHNldEpTRWRpdG9ySW5zdGFuY2U6IGZ1bmN0aW9uIHNldEpTRWRpdG9ySW5zdGFuY2Uob2JqKSB7XG4gICAgICB0aGlzLmpzRWRpdG9ySW5zdGFuY2UgPSBvYmo7XG4gICAgfSxcbiAgICBnZXRKc0VkaXRvckluc3Q6IGZ1bmN0aW9uIGdldEpzRWRpdG9ySW5zdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmpzRWRpdG9ySW5zdGFuY2U7XG4gICAgfSxcbiAgICBpbnNlcnRKczogZnVuY3Rpb24gaW5zZXJ0SnMoanMpIHtcbiAgICAgIHZhciBkb2MgPSB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmdldERvYygpO1xuICAgICAgdmFyIGN1cnNvciA9IGRvYy5nZXRDdXJzb3IoKTtcbiAgICAgIGRvYy5yZXBsYWNlUmFuZ2UoanMsIGN1cnNvcik7XG4gICAgfSxcbiAgICBmb3JtYXRKUzogZnVuY3Rpb24gZm9ybWF0SlMoKSB7XG4gICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW1wic2VsZWN0QWxsXCJdKHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkpO1xuICAgICAgdmFyIHJhbmdlID0ge1xuICAgICAgICBmcm9tOiB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgdG86IHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKGZhbHNlKVxuICAgICAgfTtcbiAgICAgIDtcbiAgICAgIHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkuYXV0b0Zvcm1hdFJhbmdlKHJhbmdlLmZyb20sIHJhbmdlLnRvKTtcbiAgICB9LFxuICAgIGFsZXJ0RGVzYzogZnVuY3Rpb24gYWxlcnREZXNjKCkge30sXG4gICAgcmVmU2NyaXB0OiBmdW5jdGlvbiByZWZTY3JpcHQoKSB7XG4gICAgICB2YXIganMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIiBzcmM9XFxcIiR7Y29udGV4dFBhdGh9L0pzL0lzc3Vlc1V0aWxpdHkuanM/dHM9JHt0aW1lU3RhbXB9XFxcIj48L3NjcmlwdD5cIjtcbiAgICAgIHRoaXMuaW5zZXJ0SnMoanMpO1xuICAgIH0sXG4gICAgY2FsbFNlcnZpY2VNZXRob2Q6IGZ1bmN0aW9uIGNhbGxTZXJ2aWNlTWV0aG9kKCkge31cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC13cmFwXCI+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIiBAY2xpY2s9XCJmb3JtYXRKU1wiPuagvOW8j+WMljwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+6K+05piOMTwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCIgQGNsaWNrPVwicmVmU2NyaXB0XCI+5byV5YWl6ISa5pysPC9kaXY+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIj7ojrflj5ZVUkzlj4LmlbA8L2Rpdj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiPuiwg+eUqOacjeWKoeaWueazlTwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+5Yqg6L295pWw5o2u5a2X5YW4PC9kaXY+XFxcbiAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cblZ1ZS5jb21wb25lbnQoXCJzaXRlLXRlbXBsYXRlLXJlbGF0aW9uLWNvbXBcIiwge1xuICBwcm9wczogW1wicmVsYXRpb25cIl0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGVkaXRWaWV3OiBcIi9IVE1ML0J1aWxkZXIvU2l0ZS9UZW1wbGF0ZS9UZW1wbGF0ZURlc2lnbi5odG1sXCJcbiAgICAgIH0sXG4gICAgICBkaWFncmFtT2JqOiBudWxsXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICAkKHRoaXMuJHJlZnMucmVsYXRpb25Db250ZW50T3V0ZXJXcmFwKS5jc3MoXCJoZWlnaHRcIiwgUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSA3NSk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBhZGRFbXB0eVRlbXBsYXRlRXZlbnQ6IGZ1bmN0aW9uIGFkZEVtcHR5VGVtcGxhdGVFdmVudChlLCBvYmopIHtcbiAgICAgIHZhciBhZG9ybm1lbnQgPSBvYmoucGFydDtcbiAgICAgIHZhciBkaWFncmFtID0gZS5kaWFncmFtO1xuICAgICAgZGlhZ3JhbS5zdGFydFRyYW5zYWN0aW9uKFwiQWRkIFN0YXRlXCIpO1xuICAgICAgdmFyIGZyb21Ob2RlID0gYWRvcm5tZW50LmFkb3JuZWRQYXJ0O1xuICAgICAgdmFyIGZyb21EYXRhID0gZnJvbU5vZGUuZGF0YTtcbiAgICAgIHZhciB0b0RhdGEgPSB7XG4gICAgICAgIHRleHQ6IFwibmV3XCJcbiAgICAgIH07XG4gICAgICB2YXIgcCA9IGZyb21Ob2RlLmxvY2F0aW9uLmNvcHkoKTtcbiAgICAgIHAueCArPSAyMDA7XG4gICAgICB0b0RhdGEubG9jID0gZ28uUG9pbnQuc3RyaW5naWZ5KHApO1xuICAgICAgdmFyIG1vZGVsID0gZGlhZ3JhbS5tb2RlbDtcbiAgICAgIG1vZGVsLmFkZE5vZGVEYXRhKHRvRGF0YSk7XG4gICAgICB2YXIgbGlua2RhdGEgPSB7XG4gICAgICAgIGZyb206IG1vZGVsLmdldEtleUZvck5vZGVEYXRhKGZyb21EYXRhKSxcbiAgICAgICAgdG86IG1vZGVsLmdldEtleUZvck5vZGVEYXRhKHRvRGF0YSksXG4gICAgICAgIHRleHQ6IFwidHJhbnNpdGlvblwiXG4gICAgICB9O1xuICAgICAgbW9kZWwuYWRkTGlua0RhdGEobGlua2RhdGEpO1xuICAgICAgdmFyIG5ld25vZGUgPSBkaWFncmFtLmZpbmROb2RlRm9yRGF0YSh0b0RhdGEpO1xuICAgICAgZGlhZ3JhbS5zZWxlY3QobmV3bm9kZSk7XG4gICAgICBkaWFncmFtLmNvbW1pdFRyYW5zYWN0aW9uKFwiQWRkIFN0YXRlXCIpO1xuICAgICAgZGlhZ3JhbS5zY3JvbGxUb1JlY3QobmV3bm9kZS5hY3R1YWxCb3VuZHMpO1xuICAgIH0sXG4gICAgYmVnaW5FZGl0VGVtcGxhdGVFdmVudDogZnVuY3Rpb24gYmVnaW5FZGl0VGVtcGxhdGVFdmVudChlLCBvYmopIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICBcIm9wXCI6IFwiZWRpdFwiLFxuICAgICAgICBcInRlbXBsYXRlSWRcIjogb2JqLnBhcnQuZGF0YS5pZFxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdUYWJXaW5kb3codXJsKTtcbiAgICB9LFxuICAgIHJlbW92ZVRlbXBsYXRlRXZlbnQ6IGZ1bmN0aW9uIHJlbW92ZVRlbXBsYXRlRXZlbnQoZSwgb2JqKSB7XG4gICAgICB0aGlzLmRpYWdyYW1PYmouc3RhcnRUcmFuc2FjdGlvbigpO1xuICAgICAgdmFyIGFkb3JubWVudCA9IG9iai5wYXJ0O1xuICAgICAgdmFyIGRpYWdyYW0gPSBlLmRpYWdyYW07XG4gICAgICB2YXIgZnJvbU5vZGUgPSBhZG9ybm1lbnQuYWRvcm5lZFBhcnQ7XG4gICAgICB0aGlzLmRpYWdyYW1PYmoucmVtb3ZlKGZyb21Ob2RlKTtcbiAgICAgIHRoaXMuZGlhZ3JhbU9iai5jb21taXRUcmFuc2FjdGlvbihcImRlbGV0ZWQgbm9kZVwiKTtcbiAgICB9LFxuICAgIGdldERpYWdyYW1JbnN0YW5jZTogZnVuY3Rpb24gZ2V0RGlhZ3JhbUluc3RhbmNlKCQpIHtcbiAgICAgIHJldHVybiAkKGdvLkRpYWdyYW0sIFwiZGl2U2l0ZVRlbXBsYXRlUmVsYXRpb25XcmFwXCIsIHtcbiAgICAgICAgXCJhbmltYXRpb25NYW5hZ2VyLmluaXRpYWxBbmltYXRpb25TdHlsZVwiOiBnby5BbmltYXRpb25NYW5hZ2VyLk5vbmUsXG4gICAgICAgIFwiSW5pdGlhbEFuaW1hdGlvblN0YXJ0aW5nXCI6IGZ1bmN0aW9uIEluaXRpYWxBbmltYXRpb25TdGFydGluZyhlKSB7XG4gICAgICAgICAgdmFyIGFuaW1hdGlvbiA9IGUuc3ViamVjdC5kZWZhdWx0QW5pbWF0aW9uO1xuICAgICAgICAgIGFuaW1hdGlvbi5lYXNpbmcgPSBnby5BbmltYXRpb24uRWFzZU91dEV4cG87XG4gICAgICAgICAgYW5pbWF0aW9uLmR1cmF0aW9uID0gOTAwO1xuICAgICAgICAgIGFuaW1hdGlvbi5hZGQoZS5kaWFncmFtLCAnc2NhbGUnLCAwLjEsIDEpO1xuICAgICAgICAgIGFuaW1hdGlvbi5hZGQoZS5kaWFncmFtLCAnb3BhY2l0eScsIDAsIDEpO1xuICAgICAgICB9LFxuICAgICAgICBcInRvb2xNYW5hZ2VyLm1vdXNlV2hlZWxCZWhhdmlvclwiOiBnby5Ub29sTWFuYWdlci5XaGVlbFpvb20sXG4gICAgICAgIFwiY2xpY2tDcmVhdGluZ1Rvb2wuYXJjaGV0eXBlTm9kZURhdGFcIjoge1xuICAgICAgICAgIHRleHQ6IFwibmV3IG5vZGVcIlxuICAgICAgICB9LFxuICAgICAgICBcInVuZG9NYW5hZ2VyLmlzRW5hYmxlZFwiOiB0cnVlLFxuICAgICAgICBwb3NpdGlvbkNvbXB1dGF0aW9uOiBmdW5jdGlvbiBwb3NpdGlvbkNvbXB1dGF0aW9uKGRpYWdyYW0sIHB0KSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBnby5Qb2ludChNYXRoLmZsb29yKHB0LngpLCBNYXRoLmZsb29yKHB0LnkpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXREaWFncmFtTm9kZVRlbXBsYXRlOiBmdW5jdGlvbiBnZXREaWFncmFtTm9kZVRlbXBsYXRlKCQpIHtcbiAgICAgIHZhciByb3VuZGVkUmVjdGFuZ2xlUGFyYW1zID0ge1xuICAgICAgICBwYXJhbWV0ZXIxOiAyLFxuICAgICAgICBzcG90MTogZ28uU3BvdC5Ub3BMZWZ0LFxuICAgICAgICBzcG90MjogZ28uU3BvdC5Cb3R0b21SaWdodFxuICAgICAgfTtcbiAgICAgIHJldHVybiAkKGdvLk5vZGUsIFwiQXV0b1wiLCB7XG4gICAgICAgIGxvY2F0aW9uU3BvdDogZ28uU3BvdC5Ub3AsXG4gICAgICAgIGlzU2hhZG93ZWQ6IHRydWUsXG4gICAgICAgIHNoYWRvd0JsdXI6IDEsXG4gICAgICAgIHNoYWRvd09mZnNldDogbmV3IGdvLlBvaW50KDAsIDEpLFxuICAgICAgICBzaGFkb3dDb2xvcjogXCJyZ2JhKDAsIDAsIDAsIC4xNClcIlxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJsb2NhdGlvblwiLCBcImxvY1wiLCBnby5Qb2ludC5wYXJzZSkubWFrZVR3b1dheShnby5Qb2ludC5zdHJpbmdpZnkpLCAkKGdvLlNoYXBlLCBcIlJvdW5kZWRSZWN0YW5nbGVcIiwgcm91bmRlZFJlY3RhbmdsZVBhcmFtcywgX2RlZmluZVByb3BlcnR5KHtcbiAgICAgICAgbmFtZTogXCJTSEFQRVwiLFxuICAgICAgICBmaWxsOiBcIiNmZmZmZmZcIixcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDEsXG4gICAgICAgIHN0cm9rZTogbnVsbCxcbiAgICAgICAgcG9ydElkOiBcIlwiLFxuICAgICAgICBmcm9tTGlua2FibGU6IGZhbHNlLFxuICAgICAgICBmcm9tTGlua2FibGVTZWxmTm9kZTogdHJ1ZSxcbiAgICAgICAgZnJvbUxpbmthYmxlRHVwbGljYXRlczogdHJ1ZSxcbiAgICAgICAgdG9MaW5rYWJsZTogZmFsc2UsXG4gICAgICAgIHRvTGlua2FibGVTZWxmTm9kZTogdHJ1ZSxcbiAgICAgICAgdG9MaW5rYWJsZUR1cGxpY2F0ZXM6IHRydWUsXG4gICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCJcbiAgICAgIH0sIFwic3Ryb2tlXCIsIFwiaHNsKDMwLCAxMDAlLCA1MCUpXCIpKSwgJChnby5QYW5lbCwgXCJWZXJ0aWNhbFwiLCB7XG4gICAgICAgIGRlZmF1bHRBbGlnbm1lbnQ6IGdvLlNwb3QuVG9wTGVmdFxuICAgICAgfSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgZm9udDogXCJib2xkIHNtYWxsLWNhcHMgMTFwdCBoZWx2ZXRpY2EsIGJvbGQgYXJpYWwsIHNhbnMtc2VyaWZcIixcbiAgICAgICAgbWFyZ2luOiA3LFxuICAgICAgICBzdHJva2U6IFwicmdiYSgwLCAwLCAwLCAuODcpXCIsXG4gICAgICAgIGVkaXRhYmxlOiBmYWxzZVxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIpLm1ha2VUd29XYXkoKSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIGZvbnQ6IFwic21hbGwtY2FwcyAxMnB4IGhlbHZldGljYSwgYXJpYWwsIHNhbnMtc2VyaWZcIixcbiAgICAgICAgbWFyZ2luOiA3LFxuICAgICAgICBhbGlnbm1lbnQ6IGdvLlNwb3QuQ2VudGVyLFxuICAgICAgICBzdHJva2U6IFwicmdiYSgwLCAwLCAwLCAuODcpXCIsXG4gICAgICAgIGVkaXRhYmxlOiBmYWxzZVxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwiaWRcIikubWFrZVR3b1dheSgpKSkpO1xuICAgIH0sXG4gICAgZ2V0RGlhZ3JhbUFjdGl2ZU5vZGVUZW1wbGF0ZTogZnVuY3Rpb24gZ2V0RGlhZ3JhbUFjdGl2ZU5vZGVUZW1wbGF0ZSgkKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICB2YXIgcm91bmRlZFJlY3RhbmdsZVBhcmFtcyA9IHtcbiAgICAgICAgcGFyYW1ldGVyMTogMixcbiAgICAgICAgc3BvdDE6IGdvLlNwb3QuVG9wTGVmdCxcbiAgICAgICAgc3BvdDI6IGdvLlNwb3QuQm90dG9tUmlnaHRcbiAgICAgIH07XG4gICAgICByZXR1cm4gJChnby5BZG9ybm1lbnQsIFwiU3BvdFwiLCAkKGdvLlBhbmVsLCBcIkF1dG9cIiwgJChnby5TaGFwZSwgXCJSb3VuZGVkUmVjdGFuZ2xlXCIsIHJvdW5kZWRSZWN0YW5nbGVQYXJhbXMsIHtcbiAgICAgICAgZmlsbDogbnVsbCxcbiAgICAgICAgc3Ryb2tlOiBcIiM3OTg2Y2JcIixcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDJcbiAgICAgIH0pLCAkKGdvLlBsYWNlaG9sZGVyKSksICQoZ28uUGFuZWwsIFwiSG9yaXpvbnRhbFwiLCB7XG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5Ub3BSaWdodCxcbiAgICAgICAgYWxpZ25tZW50Rm9jdXM6IGdvLlNwb3QuVG9wTGVmdFxuICAgICAgfSwgJChcIkJ1dHRvblwiLCB7XG4gICAgICAgIGNsaWNrOiBfc2VsZi5hZGRFbXB0eVRlbXBsYXRlRXZlbnQsXG4gICAgICAgIHRvb2xUaXA6IF9zZWxmLm1ha2VEaWFncmFtVG9vbHRpcCgkLCBcIkFkZCBFeGNsdXNpdmVcIilcbiAgICAgIH0sICQoZ28uU2hhcGUsIFwiUGx1c0xpbmVcIiwge1xuICAgICAgICB3aWR0aDogMTIsXG4gICAgICAgIGhlaWdodDogMTIsXG4gICAgICAgIHN0cm9rZTogXCJoc2woMzAsIDEwMCUsIDUwJSlcIlxuICAgICAgfSkpLCAkKFwiQnV0dG9uXCIsIHtcbiAgICAgICAgY2xpY2s6IF9zZWxmLmJlZ2luRWRpdFRlbXBsYXRlRXZlbnRcbiAgICAgIH0sICQoZ28uU2hhcGUsIFwiR2VhclwiLCB7XG4gICAgICAgIHdpZHRoOiAxMixcbiAgICAgICAgaGVpZ2h0OiAxMixcbiAgICAgICAgZmlsbDogXCJoc2woMzAsIDEwMCUsIDUwJSlcIixcbiAgICAgICAgc3Ryb2tlOiBcImhzbCgzMCwgMTAwJSwgNTAlKVwiXG4gICAgICB9KSksICQoXCJCdXR0b25cIiwge1xuICAgICAgICBjbGljazogX3NlbGYucmVtb3ZlVGVtcGxhdGVFdmVudFxuICAgICAgfSwgJChnby5TaGFwZSwgXCJYTGluZVwiLCB7XG4gICAgICAgIHdpZHRoOiAxMixcbiAgICAgICAgaGVpZ2h0OiAxMixcbiAgICAgICAgc3Ryb2tlOiBcImhzbCgzMCwgMTAwJSwgNTAlKVwiXG4gICAgICB9KSkpLCAkKGdvLlBhbmVsLCBcIkF1dG9cIiwge1xuICAgICAgICBhbGlnbm1lbnQ6IGdvLlNwb3QuQm90dG9tQ2VudGVyLFxuICAgICAgICBhbGlnbm1lbnRGb2N1czogZ28uU3BvdC5Ub3BcbiAgICAgIH0sICQoZ28uU2hhcGUsIFwiUm91bmRlZFJlY3RhbmdsZVwiLCByb3VuZGVkUmVjdGFuZ2xlUGFyYW1zLCB7XG4gICAgICAgIGZpbGw6IG51bGwsXG4gICAgICAgIHN0cm9rZTogXCIjMmJmZmIzXCIsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxXG4gICAgICB9KSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgZm9udDogXCJzbWFsbC1jYXBzIDEycHggaGVsdmV0aWNhLCBhcmlhbCwgc2Fucy1zZXJpZlwiLFxuICAgICAgICBtYXJnaW46IDcsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5Cb3R0b21DZW50ZXIsXG4gICAgICAgIGFsaWdubWVudEZvY3VzOiBnby5TcG90LlRvcCxcbiAgICAgICAgc3Ryb2tlOiBcInJnYmEoMCwgMCwgMCwgLjg3KVwiLFxuICAgICAgICBlZGl0YWJsZTogZmFsc2VcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcImRlc2NcIikpKSk7XG4gICAgfSxcbiAgICBnZXREaWFncmFtU3RhcnROb2RlVGVtcGxhdGU6IGZ1bmN0aW9uIGdldERpYWdyYW1TdGFydE5vZGVUZW1wbGF0ZSgkKSB7XG4gICAgICByZXR1cm4gJChnby5Ob2RlLCBcIlNwb3RcIiwge1xuICAgICAgICBkZXNpcmVkU2l6ZTogbmV3IGdvLlNpemUoNzUsIDc1KVxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJsb2NhdGlvblwiLCBcImxvY1wiLCBnby5Qb2ludC5wYXJzZSkubWFrZVR3b1dheShnby5Qb2ludC5zdHJpbmdpZnkpLCAkKGdvLlNoYXBlLCBcIkNpcmNsZVwiLCB7XG4gICAgICAgIGZpbGw6IFwiIzUyY2U2MFwiLFxuICAgICAgICBzdHJva2U6IG51bGwsXG4gICAgICAgIHBvcnRJZDogXCJcIixcbiAgICAgICAgZnJvbUxpbmthYmxlOiBmYWxzZSxcbiAgICAgICAgZnJvbUxpbmthYmxlU2VsZk5vZGU6IHRydWUsXG4gICAgICAgIGZyb21MaW5rYWJsZUR1cGxpY2F0ZXM6IHRydWUsXG4gICAgICAgIHRvTGlua2FibGU6IGZhbHNlLFxuICAgICAgICB0b0xpbmthYmxlU2VsZk5vZGU6IHRydWUsXG4gICAgICAgIHRvTGlua2FibGVEdXBsaWNhdGVzOiB0cnVlLFxuICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiXG4gICAgICB9KSwgJChnby5UZXh0QmxvY2ssIFwiU3RhcnRcIiwge1xuICAgICAgICBmb250OiBcImJvbGQgMTZwdCBoZWx2ZXRpY2EsIGJvbGQgYXJpYWwsIHNhbnMtc2VyaWZcIixcbiAgICAgICAgc3Ryb2tlOiBcIndoaXRlc21va2VcIlxuICAgICAgfSkpO1xuICAgIH0sXG4gICAgZ2V0RGlhZ3JhbUVuZE5vZGVUZW1wbGF0ZTogZnVuY3Rpb24gZ2V0RGlhZ3JhbUVuZE5vZGVUZW1wbGF0ZSgkKSB7XG4gICAgICByZXR1cm4gJChnby5Ob2RlLCBcIlNwb3RcIiwge1xuICAgICAgICBkZXNpcmVkU2l6ZTogbmV3IGdvLlNpemUoNzUsIDc1KVxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJsb2NhdGlvblwiLCBcImxvY1wiLCBnby5Qb2ludC5wYXJzZSkubWFrZVR3b1dheShnby5Qb2ludC5zdHJpbmdpZnkpLCAkKGdvLlNoYXBlLCBcIkNpcmNsZVwiLCB7XG4gICAgICAgIGZpbGw6IFwibWFyb29uXCIsXG4gICAgICAgIHN0cm9rZTogbnVsbCxcbiAgICAgICAgcG9ydElkOiBcIlwiLFxuICAgICAgICBmcm9tTGlua2FibGU6IGZhbHNlLFxuICAgICAgICBmcm9tTGlua2FibGVTZWxmTm9kZTogdHJ1ZSxcbiAgICAgICAgZnJvbUxpbmthYmxlRHVwbGljYXRlczogdHJ1ZSxcbiAgICAgICAgdG9MaW5rYWJsZTogZmFsc2UsXG4gICAgICAgIHRvTGlua2FibGVTZWxmTm9kZTogdHJ1ZSxcbiAgICAgICAgdG9MaW5rYWJsZUR1cGxpY2F0ZXM6IHRydWUsXG4gICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCJcbiAgICAgIH0pLCAkKGdvLlNoYXBlLCBcIkNpcmNsZVwiLCB7XG4gICAgICAgIGZpbGw6IG51bGwsXG4gICAgICAgIGRlc2lyZWRTaXplOiBuZXcgZ28uU2l6ZSg2NSwgNjUpLFxuICAgICAgICBzdHJva2VXaWR0aDogMixcbiAgICAgICAgc3Ryb2tlOiBcIndoaXRlc21va2VcIlxuICAgICAgfSksICQoZ28uVGV4dEJsb2NrLCBcIkVuZFwiLCB7XG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNnB0IGhlbHZldGljYSwgYm9sZCBhcmlhbCwgc2Fucy1zZXJpZlwiLFxuICAgICAgICBzdHJva2U6IFwid2hpdGVzbW9rZVwiXG4gICAgICB9KSk7XG4gICAgfSxcbiAgICBnZXREaWFncmFtTGlua1RlbXBsYXRlOiBmdW5jdGlvbiBnZXREaWFncmFtTGlua1RlbXBsYXRlKCQpIHtcbiAgICAgIHJldHVybiAkKGdvLkxpbmssIHtcbiAgICAgICAgY3VydmU6IGdvLkxpbmsuQmV6aWVyLFxuICAgICAgICBhZGp1c3Rpbmc6IGdvLkxpbmsuU3RyZXRjaCxcbiAgICAgICAgcmVzaGFwYWJsZTogdHJ1ZSxcbiAgICAgICAgcmVsaW5rYWJsZUZyb206IHRydWUsXG4gICAgICAgIHJlbGlua2FibGVUbzogdHJ1ZSxcbiAgICAgICAgdG9TaG9ydExlbmd0aDogM1xuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJwb2ludHNcIikubWFrZVR3b1dheSgpLCBuZXcgZ28uQmluZGluZyhcImN1cnZpbmVzc1wiKSwgJChnby5TaGFwZSwge1xuICAgICAgICBzdHJva2VXaWR0aDogMS41XG4gICAgICB9LCBuZXcgZ28uQmluZGluZygnc3Ryb2tlJywgJ3Byb2dyZXNzJywgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgIHJldHVybiBwcm9ncmVzcyA/IFwiIzUyY2U2MFwiIDogJ2JsYWNrJztcbiAgICAgIH0pLCBuZXcgZ28uQmluZGluZygnc3Ryb2tlV2lkdGgnLCAncHJvZ3Jlc3MnLCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgcmV0dXJuIHByb2dyZXNzID8gMi41IDogMS41O1xuICAgICAgfSkpLCAkKGdvLlNoYXBlLCB7XG4gICAgICAgIHRvQXJyb3c6IFwic3RhbmRhcmRcIixcbiAgICAgICAgc3Ryb2tlOiBudWxsXG4gICAgICB9LCBuZXcgZ28uQmluZGluZygnZmlsbCcsICdwcm9ncmVzcycsIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gcHJvZ3Jlc3MgPyBcIiM1MmNlNjBcIiA6ICdibGFjayc7XG4gICAgICB9KSksICQoZ28uUGFuZWwsIFwiQXV0b1wiLCAkKGdvLlNoYXBlLCB7XG4gICAgICAgIGZpbGw6ICQoZ28uQnJ1c2gsIFwiUmFkaWFsXCIsIHtcbiAgICAgICAgICAwOiBcInJnYigyNDUsIDI0NSwgMjQ1KVwiLFxuICAgICAgICAgIDAuNzogXCJyZ2IoMjQ1LCAyNDUsIDI0NSlcIixcbiAgICAgICAgICAxOiBcInJnYmEoMjQ1LCAyNDUsIDI0NSwgMClcIlxuICAgICAgICB9KSxcbiAgICAgICAgc3Ryb2tlOiBudWxsXG4gICAgICB9KSwgJChnby5UZXh0QmxvY2ssIFwidHJhbnNpdGlvblwiLCB7XG4gICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgZm9udDogXCI5cHQgaGVsdmV0aWNhLCBhcmlhbCwgc2Fucy1zZXJpZlwiLFxuICAgICAgICBtYXJnaW46IDQsXG4gICAgICAgIGVkaXRhYmxlOiB0cnVlXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIikubWFrZVR3b1dheSgpKSkpO1xuICAgIH0sXG4gICAgbWFrZURpYWdyYW1Ub29sdGlwOiBmdW5jdGlvbiBtYWtlRGlhZ3JhbVRvb2x0aXAoJCwgdG9vbHRpcCkge1xuICAgICAgcmV0dXJuICQoXCJUb29sVGlwXCIsICQoZ28uVGV4dEJsb2NrLCB0b29sdGlwKSk7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgaWYgKHdpbmRvdy5nb1NhbXBsZXMpIGdvU2FtcGxlcygpO1xuICAgICAgdmFyICQgPSBnby5HcmFwaE9iamVjdC5tYWtlO1xuICAgICAgdGhpcy5kaWFncmFtT2JqID0gdGhpcy5nZXREaWFncmFtSW5zdGFuY2UoJCk7XG4gICAgICB0aGlzLmRpYWdyYW1PYmoubm9kZVRlbXBsYXRlID0gdGhpcy5nZXREaWFncmFtTm9kZVRlbXBsYXRlKCQpO1xuICAgICAgdGhpcy5kaWFncmFtT2JqLm5vZGVUZW1wbGF0ZS5zZWxlY3Rpb25BZG9ybm1lbnRUZW1wbGF0ZSA9IHRoaXMuZ2V0RGlhZ3JhbUFjdGl2ZU5vZGVUZW1wbGF0ZSgkKTtcbiAgICAgIHRoaXMuZGlhZ3JhbU9iai5ub2RlVGVtcGxhdGVNYXAuYWRkKFwiU3RhcnRcIiwgdGhpcy5nZXREaWFncmFtU3RhcnROb2RlVGVtcGxhdGUoJCkpO1xuICAgICAgdGhpcy5kaWFncmFtT2JqLm5vZGVUZW1wbGF0ZU1hcC5hZGQoXCJFbmRcIiwgdGhpcy5nZXREaWFncmFtRW5kTm9kZVRlbXBsYXRlKCQpKTtcbiAgICAgIHRoaXMuZGlhZ3JhbU9iai5saW5rVGVtcGxhdGUgPSB0aGlzLmdldERpYWdyYW1MaW5rVGVtcGxhdGUoJCk7XG4gICAgICB0aGlzLmRpYWdyYW1PYmoubW9kZWwgPSBnby5Nb2RlbC5mcm9tSnNvbih7XG4gICAgICAgIFwiY2xhc3NcIjogXCJnby5HcmFwaExpbmtzTW9kZWxcIixcbiAgICAgICAgXCJub2RlS2V5UHJvcGVydHlcIjogXCJpZFwiLFxuICAgICAgICBcIm5vZGVEYXRhQXJyYXlcIjogW3tcbiAgICAgICAgICBcImlkXCI6IC0zLFxuICAgICAgICAgIFwibG9jXCI6IFwiMTg1IC0xNThcIixcbiAgICAgICAgICBcImNhdGVnb3J5XCI6IFwiU3RhcnRcIixcbiAgICAgICAgICBcImRlc2NcIjogXCLpgqPmmK9cIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJpZFwiOiAtMSxcbiAgICAgICAgICBcImxvY1wiOiBcIi03MyAtMTUwXCIsXG4gICAgICAgICAgXCJjYXRlZ29yeVwiOiBcIlN0YXJ0XCIsXG4gICAgICAgICAgXCJkZXNjXCI6IFwi6YKj5pivXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaWRcIjogMCxcbiAgICAgICAgICBcImxvY1wiOiBcIi0yNCAxMTZcIixcbiAgICAgICAgICBcInRleHRcIjogXCLmnIDnu4jlubvmg7NcIixcbiAgICAgICAgICBcInRleHQyXCI6IFwi5pyA57uI5bm75oOzMlwiLFxuICAgICAgICAgIFwiZGVzY1wiOiBcIumCo+aYr1wiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImlkXCI6IDEsXG4gICAgICAgICAgXCJsb2NcIjogXCIyNzMgOTRcIixcbiAgICAgICAgICBcInRleHRcIjogXCLpm6rkuK3mgo3liIDooYxcIixcbiAgICAgICAgICBcImRlc2NcIjogXCLpgqPmmK9cIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJpZFwiOiBcIjIwMDBBXCIsXG4gICAgICAgICAgXCJsb2NcIjogXCIzNTIgMjcwXCIsXG4gICAgICAgICAgXCJ0ZXh0XCI6IFwi6KW/6JeP5aSp6Lev5Y+o5Y+o5Y+oXCIsXG4gICAgICAgICAgXCJkZXNjXCI6IFwi6YKj5pivXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaWRcIjogMyxcbiAgICAgICAgICBcImxvY1wiOiBcIjU5NSAtM1wiLFxuICAgICAgICAgIFwidGV4dFwiOiBcIuWkp+S6mua5vuWPqOWPqOWPqFwiLFxuICAgICAgICAgIFwiZGVzY1wiOiBcIumCo+aYr1wiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImlkXCI6IDQsXG4gICAgICAgICAgXCJsb2NcIjogXCI4OTQgLTE5MFwiLFxuICAgICAgICAgIFwidGV4dFwiOiBcIlZpZXcgQ2FydFwiLFxuICAgICAgICAgIFwiZGVzY1wiOiBcIumCo+aYr1wiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImlkXCI6IDUsXG4gICAgICAgICAgXCJsb2NcIjogXCI4MjAgMjAyXCIsXG4gICAgICAgICAgXCJ0ZXh0XCI6IFwiVXBkYXRlIENhcnRcIixcbiAgICAgICAgICBcImRlc2NcIjogXCLpgqPmmK9cIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJpZFwiOiA2LFxuICAgICAgICAgIFwibG9jXCI6IFwiMTA1MiA5MFwiLFxuICAgICAgICAgIFwidGV4dFwiOiBcIkNoZWNrb3V0XCIsXG4gICAgICAgICAgXCJkZXNjXCI6IFwi6YKj5pivXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaWRcIjogLTIsXG4gICAgICAgICAgXCJsb2NcIjogXCIxMTI0IDI2M1wiLFxuICAgICAgICAgIFwiY2F0ZWdvcnlcIjogXCJFbmRcIixcbiAgICAgICAgICBcImRlc2NcIjogXCLpgqPmmK9cIlxuICAgICAgICB9XSxcbiAgICAgICAgXCJsaW5rRGF0YUFycmF5XCI6IFt7XG4gICAgICAgICAgXCJmcm9tXCI6IC0xLFxuICAgICAgICAgIFwidG9cIjogMCxcbiAgICAgICAgICBcInRleHRcIjogXCJWaXNpdCBvbmxpbmUgc3RvcmVcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJmcm9tXCI6IDAsXG4gICAgICAgICAgXCJ0b1wiOiAxLFxuICAgICAgICAgIFwicHJvZ3Jlc3NcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgXCJ0ZXh0XCI6IFwiQnJvd3NlXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZnJvbVwiOiAwLFxuICAgICAgICAgIFwidG9cIjogXCIyMDAwQVwiLFxuICAgICAgICAgIFwicHJvZ3Jlc3NcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgXCJ0ZXh0XCI6IFwiVXNlIHNlYXJjaCBiYXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJmcm9tXCI6IDEsXG4gICAgICAgICAgXCJ0b1wiOiBcIjIwMDBBXCIsXG4gICAgICAgICAgXCJwcm9ncmVzc1wiOiBcInRydWVcIixcbiAgICAgICAgICBcInRleHRcIjogXCJVc2Ugc2VhcmNoIGJhclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImZyb21cIjogXCIyMDAwQVwiLFxuICAgICAgICAgIFwidG9cIjogMyxcbiAgICAgICAgICBcInByb2dyZXNzXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgIFwidGV4dFwiOiBcIkNsaWNrIGl0ZW1cIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJmcm9tXCI6IFwiMjAwMEFcIixcbiAgICAgICAgICBcInRvXCI6IFwiMjAwMEFcIixcbiAgICAgICAgICBcInRleHRcIjogXCJBbm90aGVyIHNlYXJjaFwiLFxuICAgICAgICAgIFwiY3VydmluZXNzXCI6IDIwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImZyb21cIjogMSxcbiAgICAgICAgICBcInRvXCI6IDMsXG4gICAgICAgICAgXCJwcm9ncmVzc1wiOiBcInRydWVcIixcbiAgICAgICAgICBcInRleHRcIjogXCJDbGljayBpdGVtXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZnJvbVwiOiAzLFxuICAgICAgICAgIFwidG9cIjogMCxcbiAgICAgICAgICBcInRleHRcIjogXCJOb3QgaW50ZXJlc3RlZFwiLFxuICAgICAgICAgIFwiY3VydmluZXNzXCI6IC0xMDBcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZnJvbVwiOiAzLFxuICAgICAgICAgIFwidG9cIjogNCxcbiAgICAgICAgICBcInByb2dyZXNzXCI6IFwidHJ1ZVwiLFxuICAgICAgICAgIFwidGV4dFwiOiBcIkFkZCB0byBjYXJ0XCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZnJvbVwiOiA0LFxuICAgICAgICAgIFwidG9cIjogMCxcbiAgICAgICAgICBcInRleHRcIjogXCJNb3JlIHNob3BwaW5nXCIsXG4gICAgICAgICAgXCJjdXJ2aW5lc3NcIjogLTE1MFxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJmcm9tXCI6IDQsXG4gICAgICAgICAgXCJ0b1wiOiA1LFxuICAgICAgICAgIFwidGV4dFwiOiBcIlVwZGF0ZSBuZWVkZWRcIixcbiAgICAgICAgICBcImN1cnZpbmVzc1wiOiAtNTBcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZnJvbVwiOiA1LFxuICAgICAgICAgIFwidG9cIjogNCxcbiAgICAgICAgICBcInRleHRcIjogXCJVcGRhdGUgbWFkZVwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImZyb21cIjogNCxcbiAgICAgICAgICBcInRvXCI6IDYsXG4gICAgICAgICAgXCJwcm9ncmVzc1wiOiBcInRydWVcIixcbiAgICAgICAgICBcInRleHRcIjogXCJQcm9jZWVkXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZnJvbVwiOiA2LFxuICAgICAgICAgIFwidG9cIjogNSxcbiAgICAgICAgICBcInRleHRcIjogXCJVcGRhdGUgbmVlZGVkXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZnJvbVwiOiA2LFxuICAgICAgICAgIFwidG9cIjogLTIsXG4gICAgICAgICAgXCJwcm9ncmVzc1wiOiBcInRydWVcIixcbiAgICAgICAgICBcInRleHRcIjogXCJQdXJjaGFzZSBtYWRlXCJcbiAgICAgICAgfV1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaWFncmFtT2JqLmFkZERpYWdyYW1MaXN0ZW5lcihcIk9iamVjdFNpbmdsZUNsaWNrZWRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHBhcnQgPSBlLnN1YmplY3QucGFydDtcbiAgICAgICAgY29uc29sZS5sb2cocGFydCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlhZ3JhbU9iai5hZGREaWFncmFtTGlzdGVuZXIoXCJTZWxlY3Rpb25Nb3ZlZFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgc3ViamVjdCA9IGUuc3ViamVjdDtcbiAgICAgICAgY29uc29sZS5sb2coc3ViamVjdCk7XG4gICAgICAgIGNvbnNvbGUubG9nKEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhlLmRpYWdyYW0ubW9kZWwubm9kZURhdGFBcnJheSkpO1xuICAgICAgICB2YXIgc2VsZWN0ZWROb2RlID0gZS5kaWFncmFtLnNlbGVjdGlvbi5maXJzdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkTm9kZVwiLCBzZWxlY3RlZE5vZGUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkTm9kZUtleVwiLCBzZWxlY3RlZE5vZGUua2V5KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJzZWxlY3RlZE5vZGVcIiwgc2VsZWN0ZWROb2RlLmxvY2F0aW9uLnRvU3RyaW5nKCkpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkTm9kZVwiLCBzZWxlY3RlZE5vZGUubG9jYXRpb24ueCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWROb2RlXCIsIHNlbGVjdGVkTm9kZS5sb2NhdGlvbi55KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2NhdGlvbk9iamVjdFwiLCBzZWxlY3RlZE5vZGUubG9jYXRpb25PYmplY3QpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwicmVsYXRpb25Db250ZW50T3V0ZXJXcmFwXFxcIiBjbGFzcz1cXFwic2l0ZS10ZW1wbGF0ZS1yZWxhdGlvbi1jb250ZW50LW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2l0ZS10ZW1wbGF0ZS1yZWxhdGlvbi1jb250ZW50LXdyYXBcXFwiIGlkPVxcXCJkaXZTaXRlVGVtcGxhdGVSZWxhdGlvbldyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIFxcdTZBMjFcXHU3MjQ4XFx1NTE3M1xcdTdDRkJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzcWwtZ2VuZXJhbC1kZXNpZ24tY29tcFwiLCB7XG4gIHByb3BzOiBbXCJzcWxEZXNpZ25lckhlaWdodFwiLCBcInZhbHVlXCIsIFwic2hvd0ZpZWxkXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzcWxUZXh0OiBcIlwiLFxuICAgICAgc2VsZWN0ZWRJdGVtVmFsdWU6IFwi6K+05piOXCIsXG4gICAgICBzZWxmVGFibGVGaWVsZHM6IFtdLFxuICAgICAgcGFyZW50VGFibGVGaWVsZHM6IFtdXG4gICAgfTtcbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBzcWxUZXh0OiBmdW5jdGlvbiBzcWxUZXh0KG5ld1ZhbCkge1xuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBuZXdWYWwpO1xuICAgIH0sXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKG5ld1ZhbCkge1xuICAgICAgdGhpcy5zcWxUZXh0ID0gbmV3VmFsO1xuICAgIH1cbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLnNxbENvZGVNaXJyb3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYSgkKFwiI1RleHRBcmVhU1FMRWRpdG9yXCIpWzBdLCB7XG4gICAgICBtb2RlOiBcInRleHQveC1zcWxcIixcbiAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgZm9sZEd1dHRlcjogdHJ1ZSxcbiAgICAgIHRoZW1lOiBcIm1vbm9rYWlcIlxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3FsRGVzaWduZXJIZWlnaHQpO1xuICAgIHRoaXMuc3FsQ29kZU1pcnJvci5zZXRTaXplKFwiMTAwJVwiLCB0aGlzLnNxbERlc2lnbmVySGVpZ2h0KTtcblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLnNxbENvZGVNaXJyb3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGNNaXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGNNaXJyb3IuZ2V0VmFsdWUoKSk7XG4gICAgICBfc2VsZi5zcWxUZXh0ID0gY01pcnJvci5nZXRWYWx1ZSgpO1xuICAgIH0pO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgZ2V0VmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlKCkge1xuICAgICAgdGhpcy5zcWxDb2RlTWlycm9yLmdldFZhbHVlKCk7XG4gICAgfSxcbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUodmFsdWUpIHtcbiAgICAgIHRoaXMuc3FsQ29kZU1pcnJvci5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgfSxcbiAgICBzZXRBYm91dFRhYmxlRmllbGRzOiBmdW5jdGlvbiBzZXRBYm91dFRhYmxlRmllbGRzKHNlbGZUYWJsZUZpZWxkcywgcGFyZW50VGFibGVGaWVsZHMpIHtcbiAgICAgIHRoaXMuc2VsZlRhYmxlRmllbGRzID0gc2VsZlRhYmxlRmllbGRzO1xuICAgICAgdGhpcy5wYXJlbnRUYWJsZUZpZWxkcyA9IHBhcmVudFRhYmxlRmllbGRzO1xuICAgIH0sXG4gICAgaW5zZXJ0RW52VG9FZGl0b3I6IGZ1bmN0aW9uIGluc2VydEVudlRvRWRpdG9yKGNvZGUpIHtcbiAgICAgIHRoaXMuaW5zZXJ0Q29kZUF0Q3Vyc29yKGNvZGUpO1xuICAgIH0sXG4gICAgaW5zZXJ0RmllbGRUb0VkaXRvcjogZnVuY3Rpb24gaW5zZXJ0RmllbGRUb0VkaXRvcihzb3VyY2VUeXBlLCBldmVudCkge1xuICAgICAgdmFyIHNvdXJjZUZpZWxkcyA9IG51bGw7XG5cbiAgICAgIGlmIChzb3VyY2VUeXBlID09IFwic2VsZlRhYmxlRmllbGRzXCIpIHtcbiAgICAgICAgc291cmNlRmllbGRzID0gdGhpcy5zZWxmVGFibGVGaWVsZHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb3VyY2VGaWVsZHMgPSB0aGlzLnBhcmVudFRhYmxlRmllbGRzO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc291cmNlRmllbGRzW2ldLmZpZWxkTmFtZSA9PSBldmVudCkge1xuICAgICAgICAgIHRoaXMuaW5zZXJ0Q29kZUF0Q3Vyc29yKHNvdXJjZUZpZWxkc1tpXS50YWJsZU5hbWUgKyBcIi5cIiArIHNvdXJjZUZpZWxkc1tpXS5maWVsZE5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBpbnNlcnRDb2RlQXRDdXJzb3I6IGZ1bmN0aW9uIGluc2VydENvZGVBdEN1cnNvcihjb2RlKSB7XG4gICAgICB2YXIgZG9jID0gdGhpcy5zcWxDb2RlTWlycm9yLmdldERvYygpO1xuICAgICAgdmFyIGN1cnNvciA9IGRvYy5nZXRDdXJzb3IoKTtcbiAgICAgIGRvYy5yZXBsYWNlUmFuZ2UoY29kZSwgY3Vyc29yKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPGRpdj5cXFxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cIlRleHRBcmVhU1FMRWRpdG9yXCI+PC90ZXh0YXJlYT5cXFxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDttYXJnaW4tdG9wOiA4cHhcIj5cXFxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXAgc2l6ZT1cInNtYWxsXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi35omA5Zyo57uE57uHSUR9XFwnKVwiPue7hOe7h0lkPC9CdXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi35omA5Zyo57uE57uH5ZCN56ewfVxcJylcIj7nu4Tnu4flkI3np7A8L0J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBAY2xpY2s9XCJpbnNlcnRFbnZUb0VkaXRvcihcXCcje0FwaVZhci7lvZPliY3nlKjmiLdJRH1cXCcpXCI+55So5oi3SWQ8L0J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBAY2xpY2s9XCJpbnNlcnRFbnZUb0VkaXRvcihcXCcje0FwaVZhci7lvZPliY3nlKjmiLflkI3np7B9XFwnKVwiPueUqOaIt+WQjeensDwvQnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIEBjbGljaz1cImluc2VydEVudlRvRWRpdG9yKFxcJyN7RGF0ZVRpbWUu5bm05bm05bm05bm0LeaciOaciC3ml6Xml6V9XFwnKVwiPnl5eXktTU0tZGQ8L0J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbj7or7TmmI48L0J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDogOHB4XCIgdi1pZj1cInNob3dGaWVsZFwiPlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdDttYXJnaW46IDRweCAxMHB4XCI+5pys6KGo5a2X5q61PC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCBwbGFjZWhvbGRlcj1cIum7mOiupOS9v+eUqElk5a2X5q61XCIgc2l6ZT1cInNtYWxsXCIgc3R5bGU9XCJ3aWR0aDoxNzVweFwiIEBvbi1jaGFuZ2U9XCJpbnNlcnRGaWVsZFRvRWRpdG9yKFxcJ3NlbGZUYWJsZUZpZWxkc1xcJywkZXZlbnQpXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHNlbGZUYWJsZUZpZWxkc1wiIDp2YWx1ZT1cIml0ZW0uZmllbGROYW1lXCIgOmtleT1cIml0ZW0uZmllbGROYW1lXCI+e3tpdGVtLmZpZWxkQ2FwdGlvbn19PC9pLW9wdGlvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnQ7bWFyZ2luOiA0cHggMTBweFwiPueItuihqOWtl+autTwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHNpemU9XCJzbWFsbFwiIHN0eWxlPVwid2lkdGg6MTc3cHhcIiBAb24tY2hhbmdlPVwiaW5zZXJ0RmllbGRUb0VkaXRvcihcXCdwYXJlbnRUYWJsZUZpZWxkc1xcJywkZXZlbnQpXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHBhcmVudFRhYmxlRmllbGRzXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJ0YWJsZS1yZWxhdGlvbi1jb250ZW50LWNvbXBcIiwge1xuICBwcm9wczogW1wicmVsYXRpb25cIl0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHM6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzXCIsXG4gICAgICAgIHNhdmVEaWFncmFtOiBcIi9SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvVGFibGVSZWxhdGlvbi9UYWJsZVJlbGF0aW9uL1NhdmVEaWFncmFtXCIsXG4gICAgICAgIGdldFNpbmdsZURpYWdyYW1EYXRhOiBcIi9SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvVGFibGVSZWxhdGlvbi9UYWJsZVJlbGF0aW9uL0dldERldGFpbERhdGFcIixcbiAgICAgICAgdGFibGVWaWV3OiBcIi9IVE1ML0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGVFZGl0Lmh0bWxcIlxuICAgICAgfSxcbiAgICAgIHRhYmxlUmVsYXRpb25EaWFncmFtOiBudWxsLFxuICAgICAgZGlzcGxheURlc2M6IHRydWUsXG4gICAgICBmb3JtYXRKc29uOiBudWxsLFxuICAgICAgcmVjb3JkSWQ6IHRoaXMucmVsYXRpb24ucmVsYXRpb25JZFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgJCh0aGlzLiRyZWZzLnJlbGF0aW9uQ29udGVudE91dGVyV3JhcCkuY3NzKFwiaGVpZ2h0XCIsIFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gNzUpO1xuXG4gICAgaWYgKFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZVdpZHRoKCkgPCAxMDAwKSB7XG4gICAgICB0aGlzLmRpc3BsYXlEZXNjID0gZmFsc2U7XG4gICAgICAkKFwiLnRhYmxlLXJlbGF0aW9uLW9wLWJ1dHRvbnMtb3V0ZXItd3JhcFwiKS5jc3MoXCJ3aWR0aFwiLCBcIjEwMCVcIik7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0RGlhZ3JhbSgpO1xuICAgIHRoaXMubG9hZFJlbGF0aW9uRGV0YWlsRGF0YSgpO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIGlmICh3aW5kb3cuZ29TYW1wbGVzKSBnb1NhbXBsZXMoKTtcbiAgICAgIHZhciAkID0gZ28uR3JhcGhPYmplY3QubWFrZTtcbiAgICAgIHZhciBteURpYWdyYW0gPSAkKGdvLkRpYWdyYW0sIFwidGFibGVSZWxhdGlvbkRpYWdyYW1EaXZcIiwge1xuICAgICAgICBhbGxvd0RlbGV0ZTogZmFsc2UsXG4gICAgICAgIGFsbG93Q29weTogZmFsc2UsXG4gICAgICAgIGxheW91dDogJChnby5Gb3JjZURpcmVjdGVkTGF5b3V0KSxcbiAgICAgICAgXCJ1bmRvTWFuYWdlci5pc0VuYWJsZWRcIjogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB2YXIgYmx1ZWdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDE1MCwgMTUwLCAyNTApXCIsXG4gICAgICAgIDAuNTogXCJyZ2IoODYsIDg2LCAxODYpXCIsXG4gICAgICAgIDE6IFwicmdiKDg2LCA4NiwgMTg2KVwiXG4gICAgICB9KTtcbiAgICAgIHZhciBncmVlbmdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDE1OCwgMjA5LCAxNTkpXCIsXG4gICAgICAgIDE6IFwicmdiKDY3LCAxMDEsIDU2KVwiXG4gICAgICB9KTtcbiAgICAgIHZhciByZWRncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigyMDYsIDEwNiwgMTAwKVwiLFxuICAgICAgICAxOiBcInJnYigxODAsIDU2LCA1MClcIlxuICAgICAgfSk7XG4gICAgICB2YXIgeWVsbG93Z3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMjU0LCAyMjEsIDUwKVwiLFxuICAgICAgICAxOiBcInJnYigyNTQsIDE4MiwgNTApXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIGxpZ2h0Z3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMTogXCIjRTZFNkZBXCIsXG4gICAgICAgIDA6IFwiI0ZGRkFGMFwiXG4gICAgICB9KTtcbiAgICAgIHZhciBpdGVtVGVtcGwgPSAkKGdvLlBhbmVsLCBcIkhvcml6b250YWxcIiwgJChnby5TaGFwZSwge1xuICAgICAgICBkZXNpcmVkU2l6ZTogbmV3IGdvLlNpemUoMTAsIDEwKVxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJmaWd1cmVcIiwgXCJmaWd1cmVcIiksIG5ldyBnby5CaW5kaW5nKFwiZmlsbFwiLCBcImNvbG9yXCIpKSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgc3Ryb2tlOiBcIiMzMzMzMzNcIixcbiAgICAgICAgZm9udDogXCJib2xkIDE0cHggc2Fucy1zZXJpZlwiXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJuYW1lXCIpKSk7XG4gICAgICBteURpYWdyYW0ubm9kZVRlbXBsYXRlID0gJChnby5Ob2RlLCBcIkF1dG9cIiwge1xuICAgICAgICBzZWxlY3Rpb25BZG9ybmVkOiB0cnVlLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGxheW91dENvbmRpdGlvbnM6IGdvLlBhcnQuTGF5b3V0U3RhbmRhcmQgJiB+Z28uUGFydC5MYXlvdXROb2RlU2l6ZWQsXG4gICAgICAgIGZyb21TcG90OiBnby5TcG90LkFsbFNpZGVzLFxuICAgICAgICB0b1Nwb3Q6IGdvLlNwb3QuQWxsU2lkZXMsXG4gICAgICAgIGlzU2hhZG93ZWQ6IHRydWUsXG4gICAgICAgIHNoYWRvd0NvbG9yOiBcIiNDNUMxQUFcIlxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJsb2NhdGlvblwiLCBcImxvY2F0aW9uXCIpLm1ha2VUd29XYXkoKSwgbmV3IGdvLkJpbmRpbmcoXCJkZXNpcmVkU2l6ZVwiLCBcInZpc2libGVcIiwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBnby5TaXplKE5hTiwgTmFOKTtcbiAgICAgIH0pLm9mT2JqZWN0KFwiTElTVFwiKSwgJChnby5TaGFwZSwgXCJSZWN0YW5nbGVcIiwge1xuICAgICAgICBmaWxsOiBsaWdodGdyYWQsXG4gICAgICAgIHN0cm9rZTogXCIjNzU2ODc1XCIsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAzXG4gICAgICB9KSwgJChnby5QYW5lbCwgXCJUYWJsZVwiLCB7XG4gICAgICAgIG1hcmdpbjogOCxcbiAgICAgICAgc3RyZXRjaDogZ28uR3JhcGhPYmplY3QuRmlsbFxuICAgICAgfSwgJChnby5Sb3dDb2x1bW5EZWZpbml0aW9uLCB7XG4gICAgICAgIHJvdzogMCxcbiAgICAgICAgc2l6aW5nOiBnby5Sb3dDb2x1bW5EZWZpbml0aW9uLk5vbmVcbiAgICAgIH0pLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICByb3c6IDAsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5DZW50ZXIsXG4gICAgICAgIG1hcmdpbjogbmV3IGdvLk1hcmdpbigwLCAxNCwgMCwgMiksXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNnB4IHNhbnMtc2VyaWZcIlxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwia2V5XCIpKSwgJChcIlBhbmVsRXhwYW5kZXJCdXR0b25cIiwgXCJMSVNUXCIsIHtcbiAgICAgICAgcm93OiAwLFxuICAgICAgICBhbGlnbm1lbnQ6IGdvLlNwb3QuVG9wUmlnaHRcbiAgICAgIH0pLCAkKGdvLlBhbmVsLCBcIlZlcnRpY2FsXCIsIHtcbiAgICAgICAgbmFtZTogXCJMSVNUXCIsXG4gICAgICAgIHJvdzogMSxcbiAgICAgICAgcGFkZGluZzogMyxcbiAgICAgICAgYWxpZ25tZW50OiBnby5TcG90LlRvcExlZnQsXG4gICAgICAgIGRlZmF1bHRBbGlnbm1lbnQ6IGdvLlNwb3QuTGVmdCxcbiAgICAgICAgc3RyZXRjaDogZ28uR3JhcGhPYmplY3QuSG9yaXpvbnRhbCxcbiAgICAgICAgaXRlbVRlbXBsYXRlOiBpdGVtVGVtcGxcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwiaXRlbUFycmF5XCIsIFwiaXRlbXNcIikpKSk7XG4gICAgICBteURpYWdyYW0ubGlua1RlbXBsYXRlID0gJChnby5MaW5rLCB7XG4gICAgICAgIHNlbGVjdGlvbkFkb3JuZWQ6IHRydWUsXG4gICAgICAgIGxheWVyTmFtZTogXCJGb3JlZ3JvdW5kXCIsXG4gICAgICAgIHJlc2hhcGFibGU6IHRydWUsXG4gICAgICAgIHJvdXRpbmc6IGdvLkxpbmsuQXZvaWRzTm9kZXMsXG4gICAgICAgIGNvcm5lcjogNSxcbiAgICAgICAgY3VydmU6IGdvLkxpbmsuSnVtcE92ZXJcbiAgICAgIH0sICQoZ28uU2hhcGUsIHtcbiAgICAgICAgc3Ryb2tlOiBcIiMzMDNCNDVcIixcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDIuNVxuICAgICAgfSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgZm9udDogXCJib2xkIDE0cHggc2Fucy1zZXJpZlwiLFxuICAgICAgICBzdHJva2U6IFwiIzE5NjdCM1wiLFxuICAgICAgICBzZWdtZW50SW5kZXg6IDAsXG4gICAgICAgIHNlZ21lbnRPZmZzZXQ6IG5ldyBnby5Qb2ludChOYU4sIE5hTiksXG4gICAgICAgIHNlZ21lbnRPcmllbnRhdGlvbjogZ28uTGluay5PcmllbnRVcHJpZ2h0XG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJ0ZXh0XCIpKSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICBmb250OiBcImJvbGQgMTRweCBzYW5zLXNlcmlmXCIsXG4gICAgICAgIHN0cm9rZTogXCIjMTk2N0IzXCIsXG4gICAgICAgIHNlZ21lbnRJbmRleDogLTEsXG4gICAgICAgIHNlZ21lbnRPZmZzZXQ6IG5ldyBnby5Qb2ludChOYU4sIE5hTiksXG4gICAgICAgIHNlZ21lbnRPcmllbnRhdGlvbjogZ28uTGluay5PcmllbnRVcHJpZ2h0XG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJ0b1RleHRcIikpKTtcbiAgICAgIHZhciBub2RlRGF0YUFycmF5ID0gW3tcbiAgICAgICAga2V5OiBcIlByb2R1Y3RzXCIsXG4gICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgIG5hbWU6IFwiUHJvZHVjdElEXCIsXG4gICAgICAgICAgaXNrZXk6IHRydWUsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IHllbGxvd2dyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiUHJvZHVjdE5hbWVcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkN1YmUxXCIsXG4gICAgICAgICAgY29sb3I6IGJsdWVncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIlN1cHBsaWVySURcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IFwicHVycGxlXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiQ2F0ZWdvcnlJRFwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogXCJwdXJwbGVcIlxuICAgICAgICB9XVxuICAgICAgfSwge1xuICAgICAgICBrZXk6IFwiU3VwcGxpZXJzXCIsXG4gICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgIG5hbWU6IFwiU3VwcGxpZXJJRFwiLFxuICAgICAgICAgIGlza2V5OiB0cnVlLFxuICAgICAgICAgIGZpZ3VyZTogXCJEZWNpc2lvblwiLFxuICAgICAgICAgIGNvbG9yOiB5ZWxsb3dncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkNvbXBhbnlOYW1lXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJDdWJlMVwiLFxuICAgICAgICAgIGNvbG9yOiBibHVlZ3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJDb250YWN0TmFtZVwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiQ3ViZTFcIixcbiAgICAgICAgICBjb2xvcjogYmx1ZWdyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiQWRkcmVzc1wiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiQ3ViZTFcIixcbiAgICAgICAgICBjb2xvcjogYmx1ZWdyYWRcbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiBcIkNhdGVnb3JpZXNcIixcbiAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgbmFtZTogXCJDYXRlZ29yeUlEXCIsXG4gICAgICAgICAgaXNrZXk6IHRydWUsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IHllbGxvd2dyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiQ2F0ZWdvcnlOYW1lXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJDdWJlMVwiLFxuICAgICAgICAgIGNvbG9yOiBibHVlZ3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJEZXNjcmlwdGlvblwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiQ3ViZTFcIixcbiAgICAgICAgICBjb2xvcjogYmx1ZWdyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiUGljdHVyZVwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiVHJpYW5nbGVVcFwiLFxuICAgICAgICAgIGNvbG9yOiByZWRncmFkXG4gICAgICAgIH1dXG4gICAgICB9LCB7XG4gICAgICAgIGtleTogXCJPcmRlciBEZXRhaWxzXCIsXG4gICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgIG5hbWU6IFwiT3JkZXJJRFwiLFxuICAgICAgICAgIGlza2V5OiB0cnVlLFxuICAgICAgICAgIGZpZ3VyZTogXCJEZWNpc2lvblwiLFxuICAgICAgICAgIGNvbG9yOiB5ZWxsb3dncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIlByb2R1Y3RJRFwiLFxuICAgICAgICAgIGlza2V5OiB0cnVlLFxuICAgICAgICAgIGZpZ3VyZTogXCJEZWNpc2lvblwiLFxuICAgICAgICAgIGNvbG9yOiB5ZWxsb3dncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIlVuaXRQcmljZVwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiTWFnbmV0aWNEYXRhXCIsXG4gICAgICAgICAgY29sb3I6IGdyZWVuZ3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJRdWFudGl0eVwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiTWFnbmV0aWNEYXRhXCIsXG4gICAgICAgICAgY29sb3I6IGdyZWVuZ3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJEaXNjb3VudFwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiTWFnbmV0aWNEYXRhXCIsXG4gICAgICAgICAgY29sb3I6IGdyZWVuZ3JhZFxuICAgICAgICB9XVxuICAgICAgfV07XG4gICAgICB2YXIgbGlua0RhdGFBcnJheSA9IFt7XG4gICAgICAgIGZyb206IFwiUHJvZHVjdHNcIixcbiAgICAgICAgdG86IFwiU3VwcGxpZXJzXCIsXG4gICAgICAgIHRleHQ6IFwiMC4uTlwiLFxuICAgICAgICB0b1RleHQ6IFwiMVwiXG4gICAgICB9LCB7XG4gICAgICAgIGZyb206IFwiUHJvZHVjdHNcIixcbiAgICAgICAgdG86IFwiQ2F0ZWdvcmllc1wiLFxuICAgICAgICB0ZXh0OiBcIjAuLk5cIixcbiAgICAgICAgdG9UZXh0OiBcIjFcIlxuICAgICAgfSwge1xuICAgICAgICBmcm9tOiBcIk9yZGVyIERldGFpbHNcIixcbiAgICAgICAgdG86IFwiUHJvZHVjdHNcIixcbiAgICAgICAgdGV4dDogXCIwLi5OXCIsXG4gICAgICAgIHRvVGV4dDogXCIxXCJcbiAgICAgIH1dO1xuICAgICAgbXlEaWFncmFtLm1vZGVsID0gJChnby5HcmFwaExpbmtzTW9kZWwsIHtcbiAgICAgICAgY29waWVzQXJyYXlzOiB0cnVlLFxuICAgICAgICBjb3BpZXNBcnJheU9iamVjdHM6IHRydWUsXG4gICAgICAgIG5vZGVEYXRhQXJyYXk6IG5vZGVEYXRhQXJyYXksXG4gICAgICAgIGxpbmtEYXRhQXJyYXk6IGxpbmtEYXRhQXJyYXlcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgc2hvd1NlbGVjdFRhYmxlRGlhbG9nOiBmdW5jdGlvbiBzaG93U2VsZWN0VGFibGVEaWFsb2coKSB7XG4gICAgICB0aGlzLiRyZWZzLnNlbGVjdFNpbmdsZVRhYmxlRGlhbG9nLmJlZ2luU2VsZWN0VGFibGUoKTtcbiAgICB9LFxuICAgIHNob3dTZWxlY3RGaWVsZENvbm5lY3REaWFsb2c6IGZ1bmN0aW9uIHNob3dTZWxlY3RGaWVsZENvbm5lY3REaWFsb2coKSB7XG4gICAgICB2YXIgZnJvbVRhYmxlSWQgPSBcIlwiO1xuICAgICAgdmFyIHRvVGFibGVJZCA9IFwiXCI7XG4gICAgICB2YXIgaSA9IDA7XG4gICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLnNlbGVjdGlvbi5lYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIGlmIChwYXJ0IGluc3RhbmNlb2YgZ28uTm9kZSkge1xuICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgIGZyb21UYWJsZUlkID0gcGFydC5kYXRhLnRhYmxlSWQ7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvVGFibGVJZCA9IHBhcnQuZGF0YS50YWJsZUlkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdG9UYWJsZUlkKSB7XG4gICAgICAgIHRvVGFibGVJZCA9IGZyb21UYWJsZUlkO1xuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbVRhYmxlSWQgIT0gXCJcIiAmJiB0b1RhYmxlSWQgIT0gXCJcIikge1xuICAgICAgICB0aGlzLiRyZWZzLnRhYmxlUmVsYXRpb25Db25uZWN0VHdvVGFibGVEaWFsb2cuYmVnaW5TZWxlY3RDb25uZWN0KGZyb21UYWJsZUlkLCB0b1RhYmxlSWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7flhYjpgInkuK0y5Liq6IqC54K5XCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkVGFibGVUb0RpYWdyYW06IGZ1bmN0aW9uIGFkZFRhYmxlVG9EaWFncmFtKHRhYmxlRGF0YSkge1xuICAgICAgdmFyIHRhYmxlSWQgPSB0YWJsZURhdGEuaWQ7XG4gICAgICB2YXIgdGFibGVJZHMgPSBbdGFibGVJZF07XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmICghdGhpcy50YWJsZUlzRXhpc3RJbkRpYWdyYW0odGFibGVJZCkpIHtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHMsIHtcbiAgICAgICAgICBcInRhYmxlSWRzXCI6IHRhYmxlSWRzXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHZhciBhbGxGaWVsZHMgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICAgIHZhciBzaW5nbGVUYWJsZSA9IHJlc3VsdC5leEtWRGF0YS5UYWJsZXNbMF07XG4gICAgICAgICAgICB2YXIgYWxsRmllbGRzU3R5bGUgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgYWxsRmllbGRzW2ldLmRpc3BsYXlUZXh0ID0gYWxsRmllbGRzW2ldLmZpZWxkTmFtZSArIFwiW1wiICsgYWxsRmllbGRzW2ldLmZpZWxkQ2FwdGlvbiArIFwiXVwiO1xuICAgICAgICAgICAgICBhbGxGaWVsZHNTdHlsZS5wdXNoKF9zZWxmLnJlbmRlcmVyRmllbGRTdHlsZShhbGxGaWVsZHNbaV0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1vZGVsTm9kZURhdGEgPSB7XG4gICAgICAgICAgICAgIHRhYmxlSWQ6IHRhYmxlSWQsXG4gICAgICAgICAgICAgIGxvYzogXCIwIDBcIixcbiAgICAgICAgICAgICAgZmllbGRzOiBhbGxGaWVsZHNTdHlsZSxcbiAgICAgICAgICAgICAgdGFibGVEYXRhOiBzaW5nbGVUYWJsZSxcbiAgICAgICAgICAgICAgdGFibGVOYW1lOiBzaW5nbGVUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgICAgICAgIHRhYmxlQ2FwdGlvbjogc2luZ2xlVGFibGUudGFibGVDYXB0aW9uLFxuICAgICAgICAgICAgICB0YWJsZURpc3BsYXlUZXh0OiBzaW5nbGVUYWJsZS50YWJsZU5hbWUgKyBcIltcIiArIHNpbmdsZVRhYmxlLnRhYmxlQ2FwdGlvbiArIFwiXVwiLFxuICAgICAgICAgICAgICBrZXk6IHNpbmdsZVRhYmxlLnRhYmxlSWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9zZWxmLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLnN0YXJ0VHJhbnNhY3Rpb24oXCJmbGFzaFwiKTtcblxuICAgICAgICAgICAgX3NlbGYudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuYWRkTm9kZURhdGEobW9kZWxOb2RlRGF0YSk7XG5cbiAgICAgICAgICAgIF9zZWxmLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLmNvbW1pdFRyYW5zYWN0aW9uKFwiZmxhc2hcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+l55S75biD5Lit5bey57uP5a2Y5Zyo6KGoOlwiICsgdGFibGVEYXRhLnRleHQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVsZXRlU2VsZWN0aW9uOiBmdW5jdGlvbiBkZWxldGVTZWxlY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5jb21tYW5kSGFuZGxlci5jYW5EZWxldGVTZWxlY3Rpb24oKSkge1xuICAgICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLmNvbW1hbmRIYW5kbGVyLmRlbGV0ZVNlbGVjdGlvbigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSxcbiAgICBjb25uZWN0U2VsZWN0aW9uTm9kZTogZnVuY3Rpb24gY29ubmVjdFNlbGVjdGlvbk5vZGUoY29ubmVjdERhdGEpIHtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuc3RhcnRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuICAgICAgdmFyIGxpbmVEYXRhID0ge1xuICAgICAgICBsaW5lSWQ6IFN0cmluZ1V0aWxpdHkuR3VpZCgpLFxuICAgICAgICBmcm9tOiBjb25uZWN0RGF0YS5mcm9tLnRhYmxlSWQsXG4gICAgICAgIHRvOiBjb25uZWN0RGF0YS50by50YWJsZUlkLFxuICAgICAgICBmcm9tVGV4dDogY29ubmVjdERhdGEuZnJvbS50ZXh0LFxuICAgICAgICB0b1RleHQ6IGNvbm5lY3REYXRhLnRvLnRleHRcbiAgICAgIH07XG4gICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLmFkZExpbmtEYXRhKGxpbmVEYXRhKTtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuY29tbWl0VHJhbnNhY3Rpb24oXCJmbGFzaFwiKTtcbiAgICB9LFxuICAgIHNhdmVNb2RlbFRvU2VydmVyOiBmdW5jdGlvbiBzYXZlTW9kZWxUb1NlcnZlcigpIHtcbiAgICAgIGlmICh0aGlzLnJlY29yZElkKSB7XG4gICAgICAgIHZhciBzZW5kRGF0YSA9IHtcbiAgICAgICAgICByZWNvcmRJZDogdGhpcy5yZWNvcmRJZCxcbiAgICAgICAgICByZWxhdGlvbkNvbnRlbnQ6IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh0aGlzLmdldERhdGFKc29uKCkpLFxuICAgICAgICAgIHJlbGF0aW9uRGlhZ3JhbUpzb246IHRoaXMuZ2V0RGlhZ3JhbUpzb24oKVxuICAgICAgICB9O1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2Uuc2F2ZURpYWdyYW0sIHNlbmREYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbml0RGlhZ3JhbTogZnVuY3Rpb24gaW5pdERpYWdyYW0oKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBpZiAod2luZG93LmdvU2FtcGxlcykgZ29TYW1wbGVzKCk7XG4gICAgICB2YXIgJCA9IGdvLkdyYXBoT2JqZWN0Lm1ha2U7XG4gICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtID0gJChnby5EaWFncmFtLCBcInRhYmxlUmVsYXRpb25EaWFncmFtRGl2XCIsIHtcbiAgICAgICAgYWxsb3dEZWxldGU6IHRydWUsXG4gICAgICAgIGFsbG93Q29weTogZmFsc2UsXG4gICAgICAgIGxheW91dDogJChnby5Gb3JjZURpcmVjdGVkTGF5b3V0LCB7XG4gICAgICAgICAgaXNPbmdvaW5nOiBmYWxzZVxuICAgICAgICB9KSxcbiAgICAgICAgXCJ1bmRvTWFuYWdlci5pc0VuYWJsZWRcIjogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB2YXIgdGFibGVSZWxhdGlvbkRpYWdyYW0gPSB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtO1xuICAgICAgdmFyIGxpZ2h0Z3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMTogXCIjRTZFNkZBXCIsXG4gICAgICAgIDA6IFwiI0ZGRkFGMFwiXG4gICAgICB9KTtcbiAgICAgIHZhciBpdGVtVGVtcGwgPSAkKGdvLlBhbmVsLCBcIkhvcml6b250YWxcIiwgJChnby5TaGFwZSwge1xuICAgICAgICBkZXNpcmVkU2l6ZTogbmV3IGdvLlNpemUoMTAsIDEwKVxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJmaWd1cmVcIiwgXCJmaWd1cmVcIiksIG5ldyBnby5CaW5kaW5nKFwiZmlsbFwiLCBcImNvbG9yXCIpKSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgc3Ryb2tlOiBcIiMzMzMzMzNcIixcbiAgICAgICAgZm9udDogXCJib2xkIDE0cHggc2Fucy1zZXJpZlwiXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJkaXNwbGF5VGV4dFwiKSkpO1xuICAgICAgdGFibGVSZWxhdGlvbkRpYWdyYW0ubm9kZVRlbXBsYXRlID0gJChnby5Ob2RlLCBcIkF1dG9cIiwge1xuICAgICAgICBzZWxlY3Rpb25BZG9ybmVkOiB0cnVlLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGxheW91dENvbmRpdGlvbnM6IGdvLlBhcnQuTGF5b3V0U3RhbmRhcmQgJiB+Z28uUGFydC5MYXlvdXROb2RlU2l6ZWQsXG4gICAgICAgIGZyb21TcG90OiBnby5TcG90LkFsbFNpZGVzLFxuICAgICAgICB0b1Nwb3Q6IGdvLlNwb3QuQWxsU2lkZXMsXG4gICAgICAgIGlzU2hhZG93ZWQ6IHRydWUsXG4gICAgICAgIHNoYWRvd0NvbG9yOiBcIiNDNUMxQUFcIixcbiAgICAgICAgZG91YmxlQ2xpY2s6IGZ1bmN0aW9uIGRvdWJsZUNsaWNrKGUsIG5vZGUpIHtcbiAgICAgICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KF9zZWxmLmFjSW50ZXJmYWNlLnRhYmxlVmlldywge1xuICAgICAgICAgICAgXCJvcFwiOiBcInZpZXdcIixcbiAgICAgICAgICAgIFwicmVjb3JkSWRcIjogbm9kZS5kYXRhLnRhYmxlSWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgICAgIHRpdGxlOiBcIuihqOiuvuiuoVwiXG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwibG9jYXRpb25cIiwgXCJsb2NcIiwgZ28uUG9pbnQucGFyc2UpLCBuZXcgZ28uQmluZGluZyhcImRlc2lyZWRTaXplXCIsIFwidmlzaWJsZVwiLCBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gbmV3IGdvLlNpemUoTmFOLCBOYU4pO1xuICAgICAgfSkub2ZPYmplY3QoXCJMSVNUXCIpLCAkKGdvLlNoYXBlLCBcIlJvdW5kZWRSZWN0YW5nbGVcIiwge1xuICAgICAgICBmaWxsOiBsaWdodGdyYWQsXG4gICAgICAgIHN0cm9rZTogXCIjNzU2ODc1XCIsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxXG4gICAgICB9KSwgJChnby5QYW5lbCwgXCJUYWJsZVwiLCB7XG4gICAgICAgIG1hcmdpbjogOCxcbiAgICAgICAgc3RyZXRjaDogZ28uR3JhcGhPYmplY3QuRmlsbFxuICAgICAgfSwgJChnby5Sb3dDb2x1bW5EZWZpbml0aW9uLCB7XG4gICAgICAgIHJvdzogMCxcbiAgICAgICAgc2l6aW5nOiBnby5Sb3dDb2x1bW5EZWZpbml0aW9uLk5vbmVcbiAgICAgIH0pLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICByb3c6IDAsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5DZW50ZXIsXG4gICAgICAgIG1hcmdpbjogbmV3IGdvLk1hcmdpbigwLCAxNCwgMCwgMiksXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNnB4IHNhbnMtc2VyaWZcIlxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwidGFibGVEaXNwbGF5VGV4dFwiKSksICQoXCJQYW5lbEV4cGFuZGVyQnV0dG9uXCIsIFwiTElTVFwiLCB7XG4gICAgICAgIHJvdzogMCxcbiAgICAgICAgYWxpZ25tZW50OiBnby5TcG90LlRvcFJpZ2h0XG4gICAgICB9KSwgJChnby5QYW5lbCwgXCJWZXJ0aWNhbFwiLCB7XG4gICAgICAgIG5hbWU6IFwiTElTVFwiLFxuICAgICAgICByb3c6IDEsXG4gICAgICAgIHBhZGRpbmc6IDMsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5Ub3BMZWZ0LFxuICAgICAgICBkZWZhdWx0QWxpZ25tZW50OiBnby5TcG90LkxlZnQsXG4gICAgICAgIHN0cmV0Y2g6IGdvLkdyYXBoT2JqZWN0Lkhvcml6b250YWwsXG4gICAgICAgIGl0ZW1UZW1wbGF0ZTogaXRlbVRlbXBsXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcIml0ZW1BcnJheVwiLCBcImZpZWxkc1wiKSkpKTtcbiAgICAgIHRhYmxlUmVsYXRpb25EaWFncmFtLmxpbmtUZW1wbGF0ZSA9ICQoZ28uTGluaywge1xuICAgICAgICBzZWxlY3Rpb25BZG9ybmVkOiB0cnVlLFxuICAgICAgICBsYXllck5hbWU6IFwiRm9yZWdyb3VuZFwiLFxuICAgICAgICByZXNoYXBhYmxlOiB0cnVlLFxuICAgICAgICByb3V0aW5nOiBnby5MaW5rLkF2b2lkc05vZGVzLFxuICAgICAgICBjb3JuZXI6IDUsXG4gICAgICAgIGN1cnZlOiBnby5MaW5rLkp1bXBPdmVyXG4gICAgICB9LCAkKGdvLlNoYXBlLCB7XG4gICAgICAgIHN0cm9rZTogXCIjMzAzQjQ1XCIsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxLjVcbiAgICAgIH0pLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgc3Ryb2tlOiBcIiMxOTY3QjNcIixcbiAgICAgICAgc2VnbWVudEluZGV4OiAwLFxuICAgICAgICBzZWdtZW50T2Zmc2V0OiBuZXcgZ28uUG9pbnQoTmFOLCBOYU4pLFxuICAgICAgICBzZWdtZW50T3JpZW50YXRpb246IGdvLkxpbmsuT3JpZW50VXByaWdodFxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwiZnJvbVRleHRcIikpLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgc3Ryb2tlOiBcIiMxOTY3QjNcIixcbiAgICAgICAgc2VnbWVudEluZGV4OiAtMSxcbiAgICAgICAgc2VnbWVudE9mZnNldDogbmV3IGdvLlBvaW50KE5hTiwgTmFOKSxcbiAgICAgICAgc2VnbWVudE9yaWVudGF0aW9uOiBnby5MaW5rLk9yaWVudFVwcmlnaHRcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcInRvVGV4dFwiKSkpO1xuICAgIH0sXG4gICAgbG9hZFJlbGF0aW9uRGV0YWlsRGF0YTogZnVuY3Rpb24gbG9hZFJlbGF0aW9uRGV0YWlsRGF0YSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRTaW5nbGVEaWFncmFtRGF0YSwge1xuICAgICAgICByZWNvcmRJZDogdGhpcy5yZWNvcmRJZCxcbiAgICAgICAgb3A6IFwiRWRpdFwiXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YS5yZWxhdGlvbkNvbnRlbnQpIHtcbiAgICAgICAgICAgIHZhciBkYXRhSnNvbiA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihyZXN1bHQuZGF0YS5yZWxhdGlvbkNvbnRlbnQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YUpzb24pO1xuXG4gICAgICAgICAgICBfc2VsZi5zZXREYXRhSnNvbihkYXRhSnNvbik7XG5cbiAgICAgICAgICAgIF9zZWxmLmNvbnZlcnRUb0Z1bGxKc29uKGRhdGFKc29uLCBfc2VsZi5kcmF3T2JqSW5EaWFncmFtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBkcmF3T2JqSW5EaWFncmFtOiBmdW5jdGlvbiBkcmF3T2JqSW5EaWFncmFtKGZ1bGxKc29uKSB7XG4gICAgICB2YXIgJCA9IGdvLkdyYXBoT2JqZWN0Lm1ha2U7XG4gICAgICB2YXIgYmx1ZWdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDE1MCwgMTUwLCAyNTApXCIsXG4gICAgICAgIDAuNTogXCJyZ2IoODYsIDg2LCAxODYpXCIsXG4gICAgICAgIDE6IFwicmdiKDg2LCA4NiwgMTg2KVwiXG4gICAgICB9KTtcbiAgICAgIHZhciBncmVlbmdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDE1OCwgMjA5LCAxNTkpXCIsXG4gICAgICAgIDE6IFwicmdiKDY3LCAxMDEsIDU2KVwiXG4gICAgICB9KTtcbiAgICAgIHZhciByZWRncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigyMDYsIDEwNiwgMTAwKVwiLFxuICAgICAgICAxOiBcInJnYigxODAsIDU2LCA1MClcIlxuICAgICAgfSk7XG4gICAgICB2YXIgeWVsbG93Z3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMjU0LCAyMjEsIDUwKVwiLFxuICAgICAgICAxOiBcInJnYigyNTQsIDE4MiwgNTApXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIGxpbmtEYXRhQXJyYXkgPSBmdWxsSnNvbi5saW5lTGlzdDtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwgPSAkKGdvLkdyYXBoTGlua3NNb2RlbCwge1xuICAgICAgICBjb3BpZXNBcnJheXM6IHRydWUsXG4gICAgICAgIGNvcGllc0FycmF5T2JqZWN0czogdHJ1ZSxcbiAgICAgICAgbm9kZURhdGFBcnJheTogZnVsbEpzb24udGFibGVMaXN0XG4gICAgICB9KTtcblxuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfc2VsZi50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5zdGFydFRyYW5zYWN0aW9uKFwiZmxhc2hcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdWxsSnNvbi5saW5lTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBsaW5lRGF0YSA9IGZ1bGxKc29uLmxpbmVMaXN0W2ldO1xuXG4gICAgICAgICAgX3NlbGYudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuYWRkTGlua0RhdGEobGluZURhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgX3NlbGYudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuY29tbWl0VHJhbnNhY3Rpb24oXCJmbGFzaFwiKTtcbiAgICAgIH0sIDUwMCk7XG4gICAgfSxcbiAgICBjb252ZXJ0VG9GdWxsSnNvbjogZnVuY3Rpb24gY29udmVydFRvRnVsbEpzb24oc2ltcGxlSnNvbiwgZnVuYykge1xuICAgICAgdmFyIGZ1bGxKc29uID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUoc2ltcGxlSnNvbik7XG4gICAgICB2YXIgdGFibGVJZHMgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaW1wbGVKc29uLnRhYmxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0YWJsZUlkcy5wdXNoKHNpbXBsZUpzb24udGFibGVMaXN0W2ldLnRhYmxlSWQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVzRmllbGRzQnlUYWJsZUlkcywge1xuICAgICAgICBcInRhYmxlSWRzXCI6IHRhYmxlSWRzXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIHZhciBhbGxGaWVsZHMgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB2YXIgYWxsVGFibGVzID0gcmVzdWx0LmV4S1ZEYXRhLlRhYmxlcztcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnVsbEpzb24udGFibGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2luZ2xlVGFibGVEYXRhID0gX3NlbGYuZ2V0U2luZ2xlVGFibGVEYXRhKGFsbFRhYmxlcywgZnVsbEpzb24udGFibGVMaXN0W2ldLnRhYmxlSWQpO1xuXG4gICAgICAgICAgICBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVEYXRhID0gc2luZ2xlVGFibGVEYXRhO1xuICAgICAgICAgICAgZnVsbEpzb24udGFibGVMaXN0W2ldLnRhYmxlTmFtZSA9IHNpbmdsZVRhYmxlRGF0YS50YWJsZU5hbWU7XG4gICAgICAgICAgICBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVDYXB0aW9uID0gc2luZ2xlVGFibGVEYXRhLnRhYmxlQ2FwdGlvbjtcbiAgICAgICAgICAgIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS50YWJsZURpc3BsYXlUZXh0ID0gc2luZ2xlVGFibGVEYXRhLmRpc3BsYXlUZXh0O1xuXG4gICAgICAgICAgICB2YXIgc2luZ2xlVGFibGVGaWVsZHNEYXRhID0gX3NlbGYuZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhKGFsbEZpZWxkcywgZnVsbEpzb24udGFibGVMaXN0W2ldLnRhYmxlSWQpO1xuXG4gICAgICAgICAgICBmdWxsSnNvbi50YWJsZUxpc3RbaV0uZmllbGRzID0gc2luZ2xlVGFibGVGaWVsZHNEYXRhO1xuICAgICAgICAgICAgZnVsbEpzb24udGFibGVMaXN0W2ldLmtleSA9IGZ1bGxKc29uLnRhYmxlTGlzdFtpXS50YWJsZUlkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9zZWxmLmRyYXdPYmpJbkRpYWdyYW0oZnVsbEpzb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgZ2V0U2luZ2xlVGFibGVEYXRhOiBmdW5jdGlvbiBnZXRTaW5nbGVUYWJsZURhdGEoYWxsVGFibGVzLCB0YWJsZUlkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbFRhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYWxsVGFibGVzW2ldLnRhYmxlSWQgPT0gdGFibGVJZCkge1xuICAgICAgICAgIGFsbFRhYmxlc1tpXS5kaXNwbGF5VGV4dCA9IGFsbFRhYmxlc1tpXS50YWJsZU5hbWUgKyBcIltcIiArIGFsbFRhYmxlc1tpXS50YWJsZUNhcHRpb24gKyBcIl1cIjtcbiAgICAgICAgICByZXR1cm4gYWxsVGFibGVzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhOiBmdW5jdGlvbiBnZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGEoYWxsRmllbGRzLCB0YWJsZUlkKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbGxGaWVsZHNbaV0uZmllbGRUYWJsZUlkID09IHRhYmxlSWQpIHtcbiAgICAgICAgICBhbGxGaWVsZHNbaV0uZGlzcGxheVRleHQgPSBhbGxGaWVsZHNbaV0uZmllbGROYW1lICsgXCJbXCIgKyBhbGxGaWVsZHNbaV0uZmllbGRDYXB0aW9uICsgXCJdXCI7XG4gICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5yZW5kZXJlckZpZWxkU3R5bGUoYWxsRmllbGRzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIHJlbmRlcmVyRmllbGRTdHlsZTogZnVuY3Rpb24gcmVuZGVyZXJGaWVsZFN0eWxlKGZpZWxkKSB7XG4gICAgICBpZiAoZmllbGQuZmllbGRJc1BrID09IFwi5pivXCIpIHtcbiAgICAgICAgZmllbGQuY29sb3IgPSB0aGlzLmdldEtleUZpZWxkQnJ1c2goKTtcbiAgICAgICAgZmllbGQuZmlndXJlID0gXCJEZWNpc2lvblwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmllbGQuY29sb3IgPSB0aGlzLmdldE5vckZpZWxkQnJ1c2goKTtcbiAgICAgICAgZmllbGQuZmlndXJlID0gXCJDdWJlMVwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmllbGQ7XG4gICAgfSxcbiAgICBnZXRLZXlGaWVsZEJydXNoOiBmdW5jdGlvbiBnZXRLZXlGaWVsZEJydXNoKCkge1xuICAgICAgcmV0dXJuIGdvLkdyYXBoT2JqZWN0Lm1ha2UoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMjU0LCAyMjEsIDUwKVwiLFxuICAgICAgICAxOiBcInJnYigyNTQsIDE4MiwgNTApXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0Tm9yRmllbGRCcnVzaDogZnVuY3Rpb24gZ2V0Tm9yRmllbGRCcnVzaCgpIHtcbiAgICAgIHJldHVybiBnby5HcmFwaE9iamVjdC5tYWtlKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDE1MCwgMTUwLCAyNTApXCIsXG4gICAgICAgIDAuNTogXCJyZ2IoODYsIDg2LCAxODYpXCIsXG4gICAgICAgIDE6IFwicmdiKDg2LCA4NiwgMTg2KVwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldERhdGFKc29uOiBmdW5jdGlvbiBnZXREYXRhSnNvbigpIHtcbiAgICAgIHZhciBkYXRhSnNvbiA9IHtcbiAgICAgICAgdGFibGVMaXN0OiBbXSxcbiAgICAgICAgbGluZUxpc3Q6IFtdXG4gICAgICB9O1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5ub2Rlcy5lYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIGlmIChwYXJ0IGluc3RhbmNlb2YgZ28uTm9kZSkge1xuICAgICAgICAgIGRhdGFKc29uLnRhYmxlTGlzdC5wdXNoKHtcbiAgICAgICAgICAgIHRhYmxlSWQ6IHBhcnQuZGF0YS50YWJsZUlkLFxuICAgICAgICAgICAgbG9jOiBwYXJ0LmxvY2F0aW9uLnggKyBcIiBcIiArIHBhcnQubG9jYXRpb24ueVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcnQgaW5zdGFuY2VvZiBnby5MaW5rKSB7XG4gICAgICAgICAgYWxlcnQoXCJsaW5lXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubGlua3MuZWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICBpZiAocGFydCBpbnN0YW5jZW9mIGdvLkxpbmspIHtcbiAgICAgICAgICBkYXRhSnNvbi5saW5lTGlzdC5wdXNoKHtcbiAgICAgICAgICAgIGxpbmVJZDogcGFydC5kYXRhLmxpbmVJZCxcbiAgICAgICAgICAgIGZyb206IHBhcnQuZGF0YS5mcm9tLFxuICAgICAgICAgICAgdG86IHBhcnQuZGF0YS50byxcbiAgICAgICAgICAgIGZyb21UZXh0OiBwYXJ0LmRhdGEuZnJvbVRleHQsXG4gICAgICAgICAgICB0b1RleHQ6IHBhcnQuZGF0YS50b1RleHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGF0YUpzb247XG4gICAgfSxcbiAgICBzZXREYXRhSnNvbjogZnVuY3Rpb24gc2V0RGF0YUpzb24oanNvbikge1xuICAgICAgdGhpcy5mb3JtYXRKc29uID0ganNvbjtcbiAgICB9LFxuICAgIGdldERpYWdyYW1Kc29uOiBmdW5jdGlvbiBnZXREaWFncmFtSnNvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLnRvSnNvbigpO1xuICAgIH0sXG4gICAgYWxlcnREYXRhSnNvbjogZnVuY3Rpb24gYWxlcnREYXRhSnNvbigpIHtcbiAgICAgIHZhciBkYXRhSnNvbiA9IHRoaXMuZ2V0RGF0YUpzb24oKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRKc29uQ29kZShkYXRhSnNvbik7XG4gICAgfSxcbiAgICBhbGVydERpYWdyYW1Kc29uOiBmdW5jdGlvbiBhbGVydERpYWdyYW1Kc29uKCkge1xuICAgICAgdmFyIGRpYWdyYW1Kc29uID0gdGhpcy5nZXREaWFncmFtSnNvbigpO1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEpzb25Db2RlKGRpYWdyYW1Kc29uKTtcbiAgICB9LFxuICAgIHRhYmxlSXNFeGlzdEluRGlhZ3JhbTogZnVuY3Rpb24gdGFibGVJc0V4aXN0SW5EaWFncmFtKHRhYmxlSWQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubm9kZXMuZWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICBpZiAocGFydCBpbnN0YW5jZW9mIGdvLk5vZGUpIHtcbiAgICAgICAgICBpZiAocGFydC5kYXRhLnRhYmxlSWQgPT0gdGFibGVJZCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIGRvd25Mb2FkTW9kZWxQTkc6IGZ1bmN0aW9uIGRvd25Mb2FkTW9kZWxQTkcoKSB7XG4gICAgICBmdW5jdGlvbiBteUNhbGxiYWNrKGJsb2IpIHtcbiAgICAgICAgdmFyIHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICB2YXIgZmlsZW5hbWUgPSBcIm15QmxvYkZpbGUxLnBuZ1wiO1xuICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBhLnN0eWxlID0gXCJkaXNwbGF5OiBub25lXCI7XG4gICAgICAgIGEuaHJlZiA9IHVybDtcbiAgICAgICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYihibG9iLCBmaWxlbmFtZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhLmNsaWNrKCk7XG4gICAgICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIGJsb2IgPSB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLm1ha2VJbWFnZURhdGEoe1xuICAgICAgICBiYWNrZ3JvdW5kOiBcIndoaXRlXCIsXG4gICAgICAgIHJldHVyblR5cGU6IFwiYmxvYlwiLFxuICAgICAgICBzY2FsZTogMSxcbiAgICAgICAgY2FsbGJhY2s6IG15Q2FsbGJhY2tcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcInJlbGF0aW9uQ29udGVudE91dGVyV3JhcFxcXCIgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLWNvbnRlbnQtb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1yZWxhdGlvbi1jb250ZW50LWhlYWRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1yZWxhdGlvbi1kZXNjLW91dGVyLXdyYXBcXFwiIHYtaWY9XFxcImRpc3BsYXlEZXNjXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tZGVzY1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU1OTA3XFx1NkNFOFxcdUZGMUF7e3JlbGF0aW9uLnJlbGF0aW9uRGVzY319XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLW9wLWJ1dHRvbnMtb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLW9wLWJ1dHRvbnMtaW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwIHNoYXBlPVxcXCJjaXJjbGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcInNob3dTZWxlY3RUYWJsZURpYWxvZ1xcXCIgdHlwZT1cXFwic3VjY2Vzc1xcXCIgaWNvbj1cXFwibWQtYWRkXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcInNob3dTZWxlY3RGaWVsZENvbm5lY3REaWFsb2dcXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcImxvZ28tc3RlYW1cXFwiPlxcdThGREVcXHU2M0E1PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gZGlzYWJsZWQgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtcmV0dXJuLWxlZnRcXFwiPlxcdTVGMTVcXHU1MTY1PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gZGlzYWJsZWQgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtcXItc2Nhbm5lclxcXCI+XFx1NTE2OFxcdTVDNEY8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBkaXNhYmxlZCB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1naXQtY29tcGFyZVxcXCI+XFx1NTM4NlxcdTUzRjI8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImFsZXJ0RGF0YUpzb25cXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcIm1kLWNvZGVcXFwiPlxcdTY1NzBcXHU2MzZFSnNvbjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiYWxlcnREaWFncmFtSnNvblxcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtY29kZS13b3JraW5nXFxcIj5cXHU1NkZFXFx1NUY2Mkpzb248L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImRvd25Mb2FkTW9kZWxQTkdcXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcIm1kLWNsb3VkLWRvd25sb2FkXFxcIj5cXHU0RTBCXFx1OEY3RDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwic2F2ZU1vZGVsVG9TZXJ2ZXJcXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcImxvZ28taW5zdGFncmFtXFxcIj5cXHU0RkREXFx1NUI1ODwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiZGVsZXRlU2VsZWN0aW9uXFxcIiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tY29udGVudC13cmFwXFxcIiBpZD1cXFwidGFibGVSZWxhdGlvbkRpYWdyYW1EaXZcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdC1zaW5nbGUtdGFibGUtZGlhbG9nIHJlZj1cXFwic2VsZWN0U2luZ2xlVGFibGVEaWFsb2dcXFwiIEBvbi1zZWxlY3RlZC10YWJsZT1cXFwiYWRkVGFibGVUb0RpYWdyYW1cXFwiPjwvc2VsZWN0LXNpbmdsZS10YWJsZS1kaWFsb2c+XFxuICAgICAgICAgICAgICAgICAgICA8dGFibGUtcmVsYXRpb24tY29ubmVjdC10d28tdGFibGUtZGlhbG9nIHJlZj1cXFwidGFibGVSZWxhdGlvbkNvbm5lY3RUd29UYWJsZURpYWxvZ1xcXCIgQG9uLWNvbXBsZXRlZC1jb25uZWN0PVxcXCJjb25uZWN0U2VsZWN0aW9uTm9kZVxcXCI+PC90YWJsZS1yZWxhdGlvbi1jb25uZWN0LXR3by10YWJsZS1kaWFsb2c+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1kZWZhdWx0LXZhbHVlLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRHcm91cFRyZWVEYXRhOiBcIi9SZXN0L0J1aWxkZXIvRW52VmFyaWFibGVHcm91cC9HZXRUcmVlRGF0YVwiLFxuICAgICAgICByZWxvYWRMaXN0RGF0YTogXCIvUmVzdC9CdWlsZGVyL0VudlZhcmlhYmxlL0dldExpc3REYXRhXCJcbiAgICAgIH0sXG4gICAgICBzZWxlY3RUeXBlOiBcIkNvbnN0XCIsXG4gICAgICBzZWxlY3RWYWx1ZTogXCJcIixcbiAgICAgIHNlbGVjdFRleHQ6IFwiXCIsXG4gICAgICBjb25zdFZhbHVlOiBcIlwiLFxuICAgICAgbGlzdEhlaWdodDogNDcwLFxuICAgICAgdHJlZToge1xuICAgICAgICB0cmVlSWRGaWVsZE5hbWU6IFwiZW52R3JvdXBJZFwiLFxuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0cmVlU2VsZWN0ZWROb2RlOiBudWxsLFxuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIGFzeW5jOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICB1cmw6IFwiXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcImVudkdyb3VwVGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImVudkdyb3VwSWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcImVudkdyb3VwUGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdElkOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuX2hvc3Q7XG5cbiAgICAgICAgICAgICAgX3NlbGYudHJlZU5vZGVTZWxlY3RlZChldmVudCwgdHJlZUlkLCB0cmVlTm9kZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHtcbiAgICAgICAgICAgICAgYXBwTGlzdC50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgdGl0bGU6ICflj5jph4/lkI3np7AnLFxuICAgICAgICBrZXk6ICdlbnZWYXJUZXh0JyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflj5jph4/lgLwnLFxuICAgICAgICBrZXk6ICdlbnZWYXJWYWx1ZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnZW52VmFySWQnLFxuICAgICAgICB3aWR0aDogMTIwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgfSwgW0xpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uU2VsZWN0ZWRCdXR0b24oaCwgcGFyYW1zLCBcImVudlZhcklkXCIsIF9zZWxmKV0pO1xuICAgICAgICB9XG4gICAgICB9XSxcbiAgICAgIHNlYXJjaENvbmRpdGlvbjoge1xuICAgICAgICBlbnZWYXJHcm91cElkOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcGFnZVRvdGFsOiAwLFxuICAgICAgcGFnZVNpemU6IDEwMCxcbiAgICAgIHBhZ2VOdW06IDFcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMubG9hZERhdGEoKTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdChvbGREYXRhKSB7XG4gICAgICBjb25zb2xlLmxvZyhvbGREYXRhKTtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3REZWZhdWx0VmFsdWVEaWFsb2dXcmFwO1xuICAgICAgdmFyIGhlaWdodCA9IDQ1MDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICBoZWlnaHQ6IDY4MCxcbiAgICAgICAgd2lkdGg6IDk4MCxcbiAgICAgICAgdGl0bGU6IFwi6K6+572u6buY6K6k5YC8XCJcbiAgICAgIH0pO1xuICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIDEwMTAwKTtcbiAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuXG4gICAgICBpZiAob2xkRGF0YSA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0VmFsdWUgPSBcIlwiO1xuICAgICAgICB0aGlzLnNlbGVjdFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmNvbnN0VmFsdWUgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICA7XG4gICAgfSxcbiAgICBsb2FkRGF0YTogZnVuY3Rpb24gbG9hZERhdGEoKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0R3JvdXBUcmVlRGF0YSwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LmRhdGEgIT0gbnVsbCAmJiByZXN1bHQuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMudHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjelRyZWVVTFwiKSwgdGhpcy50cmVlLnRyZWVTZXR0aW5nLCByZXN1bHQuZGF0YSk7XG4gICAgICAgICAgdGhpcy50cmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgICAgIHRoaXMudHJlZS50cmVlT2JqLl9ob3N0ID0gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBnZXRTZWxlY3RJbnN0YW5jZU5hbWU6IGZ1bmN0aW9uIGdldFNlbGVjdEluc3RhbmNlTmFtZSgpIHtcbiAgICAgIHJldHVybiBCYXNlVXRpbGl0eS5HZXRVcmxQYXJhVmFsdWUoXCJpbnN0YW5jZU5hbWVcIik7XG4gICAgfSxcbiAgICBzZWxlY3RDb21wbGV0ZTogZnVuY3Rpb24gc2VsZWN0Q29tcGxldGUoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgIGlmICh0aGlzLnNlbGVjdFR5cGUgPT0gXCJDb25zdFwiKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnN0VmFsdWUgPT0gXCJcIikge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+iuvue9ruW4uOmHj+m7mOiupOWAvO+8gVwiLCBudWxsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQuVHlwZSA9IFwiQ29uc3RcIjtcbiAgICAgICAgcmVzdWx0LlZhbHVlID0gdGhpcy5jb25zdFZhbHVlO1xuICAgICAgICByZXN1bHQuVGV4dCA9IHRoaXMuY29uc3RWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5UeXBlID0gXCJFbnZWYXJcIjtcbiAgICAgICAgcmVzdWx0LlZhbHVlID0gdGhpcy5zZWxlY3RWYWx1ZTtcbiAgICAgICAgcmVzdWx0LlRleHQgPSB0aGlzLnNlbGVjdFRleHQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLWRlZmF1bHQtdmFsdWUnLCByZXN1bHQpO1xuICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgIH0sXG4gICAgY2xlYXJDb21wbGV0ZTogZnVuY3Rpb24gY2xlYXJDb21wbGV0ZSgpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLWRlZmF1bHQtdmFsdWUnLCBudWxsKTtcbiAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBzZWxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZSgpIHt9LFxuICAgIGNsZWFyU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBjbGVhclNlYXJjaENvbmRpdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnNlYXJjaENvbmRpdGlvbikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbltrZXldLnZhbHVlID0gXCJcIjtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRyZWVOb2RlU2VsZWN0ZWQ6IGZ1bmN0aW9uIHRyZWVOb2RlU2VsZWN0ZWQoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgIHRoaXMucGFnZU51bSA9IDE7XG4gICAgICB0aGlzLmNsZWFyU2VhcmNoQ29uZGl0aW9uKCk7XG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5lbnZWYXJHcm91cElkLnZhbHVlID0gdHJlZU5vZGVbdGhpcy50cmVlLnRyZWVJZEZpZWxkTmFtZV07XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIHJlbG9hZERhdGE6IGZ1bmN0aW9uIHJlbG9hZERhdGEoKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUJpbmREYXRhQnlTZWFyY2goe1xuICAgICAgICB1cmw6IHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkTGlzdERhdGEsXG4gICAgICAgIHBhZ2VOdW06IHRoaXMucGFnZU51bSxcbiAgICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICAgIHNlYXJjaENvbmRpdGlvbjogdGhpcy5zZWFyY2hDb25kaXRpb24sXG4gICAgICAgIHBhZ2VBcHBPYmo6IHRoaXMsXG4gICAgICAgIHRhYmxlTGlzdDogdGhpcyxcbiAgICAgICAgaWRGaWVsZDogXCJlbnZWYXJJZFwiLFxuICAgICAgICBhdXRvU2VsZWN0ZWRPbGRSb3dzOiB0cnVlLFxuICAgICAgICBzdWNjZXNzRnVuYzogbnVsbCxcbiAgICAgICAgbG9hZERpY3Q6IGZhbHNlLFxuICAgICAgICBjdXN0UGFyYXM6IHt9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHNlbGVjdGVkOiBmdW5jdGlvbiBzZWxlY3RlZChpZCwgcGFyYW1zKSB7XG4gICAgICBjb25zb2xlLmxvZyhwYXJhbXMpO1xuICAgICAgdGhpcy5zZWxlY3RWYWx1ZSA9IHBhcmFtcy5yb3cuZW52VmFyVmFsdWU7XG4gICAgICB0aGlzLnNlbGVjdFRleHQgPSBwYXJhbXMucm93LmVudlZhclRleHQ7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2ICByZWY9XFxcInNlbGVjdERlZmF1bHRWYWx1ZURpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTttYXJnaW4tdG9wOiAwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHRhYnMgOnZhbHVlPVxcXCJzZWxlY3RUeXBlXFxcIiB2LW1vZGVsPVxcXCJzZWxlY3RUeXBlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgbGFiZWw9XFxcIlxcdTVFMzhcXHU5MUNGXFxcIiBuYW1lPVxcXCJDb25zdFxcXCIgPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1mb3JtIDpsYWJlbC13aWR0aD1cXFwiODBcXFwiIHN0eWxlPVxcXCJ3aWR0aDogODAlO21hcmdpbjogNTBweCBhdXRvIGF1dG87XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTVFMzhcXHU5MUNGXFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiY29uc3RWYWx1ZVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFiLXBhbmU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIGxhYmVsPVxcXCJcXHU3M0FGXFx1NTg4M1xcdTUzRDhcXHU5MUNGXFxcIiBuYW1lPVxcXCJFbnZWYXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJoZWlnaHQ6IDQ1cHg7Ym9yZGVyLWJvdHRvbTogZG90dGVkIDFweCAjOGE4YThhO21hcmdpbi1ib3R0b206IDEwcHg7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OiByaWdodDtwYWRkaW5nOiA4cHg7Ym9yZGVyLXJhZGl1czogOHB4O2NvbG9yOm9yYW5nZXJlZDtib3JkZXI6IHNvbGlkIDFweCAjYWRiZWQ4O1xcXCI+XFx1NURGMlxcdTdFQ0ZcXHU5MDA5XFx1NjJFOVxcdUZGMUF7e3NlbGVjdFRleHR9fTwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcIndpZHRoOiAzMCU7ZmxvYXQ6IGxlZnQ7aGVpZ2h0OiA1MTRweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XFxcInpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcIndpZHRoOiA2OCU7ZmxvYXQ6IGxlZnQ7aGVpZ2h0OiA1MTRweFxcXCIgY2xhc3M9XFxcIml2LWxpc3QtcGFnZS13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSA6aGVpZ2h0PVxcXCJsaXN0SGVpZ2h0XFxcIiBzdHJpcGUgYm9yZGVyIDpjb2x1bW5zPVxcXCJjb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwidGFibGVEYXRhXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tc2VsZWN0aW9uLWNoYW5nZT1cXFwic2VsZWN0aW9uQ2hhbmdlXFxcIj48L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgICAgIDwvdGFicz5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzZWxlY3RDb21wbGV0ZSgpXFxcIj4gXFx1Nzg2RSBcXHU4QkE0IDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJjbGVhckNvbXBsZXRlKClcXFwiPiBcXHU2RTA1IFxcdTdBN0EgPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiPlxcdTUxNzMgXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTtcbnZhciBEZWZhdWx0VmFsdWVVdGlsaXR5ID0ge1xuICBmb3JtYXRUZXh0OiBmdW5jdGlvbiBmb3JtYXRUZXh0KHR5cGUsIHRleHQpIHtcbiAgICBpZiAodHlwZSA9PSBcIkNvbnN0XCIpIHtcbiAgICAgIHJldHVybiBcIumdmeaAgeWAvDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIkVudlZhclwiKSB7XG4gICAgICByZXR1cm4gXCLnjq/looPlj5jph48644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJcIikge1xuICAgICAgcmV0dXJuIFwi44CQ5peg44CRXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIFwi5pyq55+l57G75Z6LXCIgKyB0ZXh0O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LXNpbmdsZS10YWJsZS1kaWFsb2dcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRUYWJsZURhdGFVcmw6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGb3JaVHJlZU5vZGVMaXN0XCJcbiAgICAgIH0sXG4gICAgICBqc0VkaXRvckluc3RhbmNlOiBudWxsLFxuICAgICAgdGFibGVUcmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICBpZiAodHJlZU5vZGUubm9kZVR5cGVOYW1lID09IFwiVGFibGVcIikge1xuICAgICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkVGFibGUoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkVGFibGUoZXZlbnQsIHRyZWVJZCwgbnVsbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVEYXRhOiBudWxsLFxuICAgICAgICBjbGlja05vZGU6IG51bGxcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZFRhYmxlRGF0YTogbnVsbFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc2VsZWN0VGFibGVNb2RlbERpYWxvZ1dyYXApO1xuICAgIH0sXG4gICAgYmVnaW5TZWxlY3RUYWJsZTogZnVuY3Rpb24gYmVnaW5TZWxlY3RUYWJsZSgpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3RUYWJsZU1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHRoaXMuZ2V0VGFibGVEYXRhSW5pdFRyZWUoKTtcbiAgICAgIHZhciBoZWlnaHQgPSA0NTA7XG5cbiAgICAgIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA+IDU1MCkge1xuICAgICAgICBoZWlnaHQgPSA2MDA7XG4gICAgICB9XG5cbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNTcwLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup6KGoXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0VGFibGVEYXRhSW5pdFRyZWU6IGZ1bmN0aW9uIGdldFRhYmxlRGF0YUluaXRUcmVlKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYudGFibGVUcmVlLnRyZWVEYXRhID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICBfc2VsZi4kcmVmcy50YWJsZVpUcmVlVUwuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzZWxlY3QtdGFibGUtc2luZ2xlLWNvbXAtXCIgKyBTdHJpbmdVdGlsaXR5Lkd1aWQoKSk7XG5cbiAgICAgICAgICBfc2VsZi50YWJsZVRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKF9zZWxmLiRyZWZzLnRhYmxlWlRyZWVVTCksIF9zZWxmLnRhYmxlVHJlZS50cmVlU2V0dGluZywgX3NlbGYudGFibGVUcmVlLnRyZWVEYXRhKTtcblxuICAgICAgICAgIF9zZWxmLnRhYmxlVHJlZS50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcblxuICAgICAgICAgIF9zZWxmLnRhYmxlVHJlZS50cmVlT2JqLl9ob3N0ID0gX3NlbGY7XG4gICAgICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKF9zZWxmLnRhYmxlVHJlZS50cmVlT2JqLCBfc2VsZi4kcmVmcy50eHRfdGFibGVfc2VhcmNoX3RleHQuJHJlZnMuaW5wdXQsIG51bGwsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRUYWJsZTogZnVuY3Rpb24gc2VsZWN0ZWRUYWJsZShldmVudCwgdHJlZUlkLCB0YWJsZURhdGEpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRUYWJsZURhdGEgPSB0YWJsZURhdGE7XG4gICAgfSxcbiAgICBjb21wbGV0ZWQ6IGZ1bmN0aW9uIGNvbXBsZXRlZCgpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkVGFibGVEYXRhKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLXRhYmxlJywgdGhpcy5zZWxlY3RlZFRhYmxlRGF0YSk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+36YCJ5oup6KGoIVwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJzZWxlY3RUYWJsZU1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC1zb3VyY2Utd3JhcCBjMS1zZWxlY3QtbW9kZWwtc291cmNlLWhhcy1idXR0b25zLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cXFwiaW5wdXRfYm9yZGVyX2JvdHRvbVxcXCIgcmVmPVxcXCJ0eHRfdGFibGVfc2VhcmNoX3RleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVcXHU4ODY4XFx1NTQwRFxcdTYyMTZcXHU4MDA1XFx1NjgwN1xcdTk4OThcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbm5lci13cmFwIGRpdi1jdXN0b20tc2Nyb2xsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwidGFibGVaVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwiYm90dG9tOiAxMnB4O3JpZ2h0OiAxMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJjb21wbGV0ZWQoKVxcXCIgaWNvbj1cXFwibWQtY2hlY2ttYXJrXFxcIj5cXHU3ODZFXFx1OEJBNDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJoYW5kbGVDbG9zZSgpXFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCI+XFx1NTE3M1xcdTk1RUQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1zaW5nbGUtd2ViZm9ybS1kaWFsb2dcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRUYWJsZURhdGFVcmw6IFwiL1Jlc3QvQnVpbGRlci9Gb3JtL0dldFdlYkZvcm1Gb3JaVHJlZU5vZGVMaXN0XCJcbiAgICAgIH0sXG4gICAgICBqc0VkaXRvckluc3RhbmNlOiBudWxsLFxuICAgICAgdHJlZToge1xuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuX2hvc3Q7XG5cbiAgICAgICAgICAgICAgaWYgKHRyZWVOb2RlLm5vZGVUeXBlTmFtZSA9PSBcIldlYkZvcm1cIikge1xuICAgICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRm9ybShldmVudCwgdHJlZUlkLCB0cmVlTm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVEYXRhOiBudWxsXG4gICAgICB9LFxuICAgICAgc2VsZWN0ZWRGb3JtRGF0YTogbnVsbCxcbiAgICAgIG9sZFNlbGVjdGVkRm9ybUlkOiBcIlwiXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3RNb2RlbERpYWxvZ1dyYXApO1xuICAgIH0sXG4gICAgYmVnaW5TZWxlY3RGb3JtOiBmdW5jdGlvbiBiZWdpblNlbGVjdEZvcm0oZm9ybUlkKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0TW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5nZXRGb3JtRGF0YUluaXRUcmVlKCk7XG4gICAgICB0aGlzLm9sZFNlbGVjdGVkRm9ybUlkID0gZm9ybUlkO1xuICAgICAgdmFyIGhlaWdodCA9IDUwMDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNTcwLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup56qX5L2TXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0Rm9ybURhdGFJbml0VHJlZTogZnVuY3Rpb24gZ2V0Rm9ybURhdGFJbml0VHJlZSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZURhdGFVcmwsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLnRyZWUudHJlZURhdGEgPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3NlbGYudHJlZS50cmVlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKF9zZWxmLnRyZWUudHJlZURhdGFbaV0ubm9kZVR5cGVOYW1lID09IFwiV2ViRm9ybVwiKSB7XG4gICAgICAgICAgICAgIF9zZWxmLnRyZWUudHJlZURhdGFbaV0uaWNvbiA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9UaGVtZXMvUG5nMTZYMTYvdGFibGUucG5nXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF9zZWxmLnRyZWUudHJlZURhdGFbaV0ubm9kZVR5cGVOYW1lID09IFwiTW9kdWxlXCIpIHtcbiAgICAgICAgICAgICAgX3NlbGYudHJlZS50cmVlRGF0YVtpXS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi9mb2xkZXItdGFibGUucG5nXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3NlbGYuJHJlZnMuZm9ybVpUcmVlVUwuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzZWxlY3QtZm9ybS1zaW5nbGUtY29tcC1cIiArIFN0cmluZ1V0aWxpdHkuR3VpZCgpKTtcblxuICAgICAgICAgIF9zZWxmLnRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKF9zZWxmLiRyZWZzLmZvcm1aVHJlZVVMKSwgX3NlbGYudHJlZS50cmVlU2V0dGluZywgX3NlbGYudHJlZS50cmVlRGF0YSk7XG5cbiAgICAgICAgICBfc2VsZi50cmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuXG4gICAgICAgICAgX3NlbGYudHJlZS50cmVlT2JqLl9ob3N0ID0gX3NlbGY7XG4gICAgICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKF9zZWxmLnRyZWUudHJlZU9iaiwgX3NlbGYuJHJlZnMudHh0X2Zvcm1fc2VhcmNoX3RleHQuJHJlZnMuaW5wdXQsIG51bGwsIHRydWUpO1xuXG4gICAgICAgICAgaWYgKF9zZWxmLm9sZFNlbGVjdGVkRm9ybUlkICE9IG51bGwgJiYgX3NlbGYub2xkU2VsZWN0ZWRGb3JtSWQgIT0gXCJcIikge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkTm9kZSA9IF9zZWxmLnRyZWUudHJlZU9iai5nZXROb2RlQnlQYXJhbShcImlkXCIsIF9zZWxmLm9sZFNlbGVjdGVkRm9ybUlkKTtcblxuICAgICAgICAgICAgX3NlbGYudHJlZS50cmVlT2JqLnNlbGVjdE5vZGUoc2VsZWN0ZWROb2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBzZWxlY3RlZEZvcm06IGZ1bmN0aW9uIHNlbGVjdGVkRm9ybShldmVudCwgdHJlZUlkLCBmb3JtRGF0YSkge1xuICAgICAgdGhpcy5zZWxlY3RlZEZvcm1EYXRhID0gZm9ybURhdGE7XG4gICAgfSxcbiAgICBjb21wbGV0ZWQ6IGZ1bmN0aW9uIGNvbXBsZXRlZCgpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkRm9ybURhdGEpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICBmb3JtTW9kdWxlSWQ6IHRoaXMuc2VsZWN0ZWRGb3JtRGF0YS5hdHRyNCxcbiAgICAgICAgICBmb3JtTW9kdWxlTmFtZTogdGhpcy5zZWxlY3RlZEZvcm1EYXRhLmF0dHIzLFxuICAgICAgICAgIGZvcm1JZDogdGhpcy5zZWxlY3RlZEZvcm1EYXRhLmlkLFxuICAgICAgICAgIGZvcm1OYW1lOiB0aGlzLnNlbGVjdGVkRm9ybURhdGEuYXR0cjEsXG4gICAgICAgICAgZm9ybUNvZGU6IHRoaXMuc2VsZWN0ZWRGb3JtRGF0YS5hdHRyMlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1mb3JtJywgcmVzdWx0KTtcbiAgICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7fpgInmi6nnqpfkvZMhXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcInNlbGVjdE1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtc291cmNlLXdyYXAgYzEtc2VsZWN0LW1vZGVsLXNvdXJjZS1oYXMtYnV0dG9ucy13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XFxcImlucHV0X2JvcmRlcl9ib3R0b21cXFwiIHJlZj1cXFwidHh0X2Zvcm1fc2VhcmNoX3RleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVcXHU4ODY4XFx1NTM1NVxcdTU0MERcXHU3OUYwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5uZXItd3JhcCBkaXYtY3VzdG9tLXNjcm9sbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCByZWY9XFxcImZvcm1aVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwiYm90dG9tOiAxMnB4O3JpZ2h0OiAxMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJjb21wbGV0ZWQoKVxcXCIgaWNvbj1cXFwibWQtY2hlY2ttYXJrXFxcIj5cXHU3ODZFXFx1OEJBNDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJoYW5kbGVDbG9zZSgpXFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCI+XFx1NTE3M1xcdTk1RUQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC12YWxpZGF0ZS1ydWxlLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3RWYWxpZGF0ZVR5cGU6IFwiTm9FbXB0eVwiLFxuICAgICAgcnVsZVBhcmFzOiB7XG4gICAgICAgIG1zZzogXCLlrZfmrrVcIixcbiAgICAgICAgbnVtTGVuZ3RoOiA0LFxuICAgICAgICBkZWNpbWFsTGVuZ3RoOiAwLFxuICAgICAgICBqc01ldGhvZE5hbWU6IFwiXCIsXG4gICAgICAgIHJlZ3VsYXJUZXh0OiBcIlwiLFxuICAgICAgICByZWd1bGFyTXNnOiBcIlwiXG4gICAgICB9LFxuICAgICAgYWRkZWRWYWxpZGF0ZVJ1bGU6IFtdLFxuICAgICAgdmFsaWRhdGVDb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0aXRsZTogJ+exu+WeiycsXG4gICAgICAgIGtleTogJ3ZhbGlkYXRlVHlwZScsXG4gICAgICAgIHdpZHRoOiAxNTAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5Y+C5pWwJyxcbiAgICAgICAga2V5OiAndmFsaWRhdGVQYXJhcycsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5Yig6ZmkJyxcbiAgICAgICAga2V5OiAndmFsaWRhdGVJZCcsXG4gICAgICAgIHdpZHRoOiAxMjAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbiBkZWxcIixcbiAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgICAgICBfc2VsZi5kZWxWYWxpZGF0ZShwYXJhbXMucm93W1widmFsaWRhdGVJZFwiXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KV0pO1xuICAgICAgICB9XG4gICAgICB9XVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdChvbGREYXRhKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0VmFsaWRhdGVSdWxlRGlhbG9nV3JhcDtcbiAgICAgIHZhciBoZWlnaHQgPSA0NTA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgaGVpZ2h0OiA2ODAsXG4gICAgICAgIHdpZHRoOiA5ODAsXG4gICAgICAgIHRpdGxlOiBcIuiuvue9rumqjOivgeinhOWImVwiXG4gICAgICB9KTtcbiAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIDEwMTAxKTtcbiAgICAgIHRoaXMucnVsZVBhcmFzLm1zZyA9IFwiYXV0b1wiO1xuICAgICAgdGhpcy5ydWxlUGFyYXMubnVtTGVuZ3RoID0gNDtcbiAgICAgIHRoaXMucnVsZVBhcmFzLmRlY2ltYWxMZW5ndGggPSAwO1xuICAgICAgdGhpcy5ydWxlUGFyYXMuanNNZXRob2ROYW1lID0gXCJcIjtcbiAgICAgIHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJUZXh0ID0gXCJcIjtcbiAgICAgIHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJNc2cgPSBcIlwiO1xuICAgICAgdGhpcy5hZGRlZFZhbGlkYXRlUnVsZSA9IFtdO1xuICAgICAgdGhpcy5iaW5kT2xkU2VsZWN0ZWRWYWx1ZShvbGREYXRhKTtcbiAgICB9LFxuICAgIGJpbmRPbGRTZWxlY3RlZFZhbHVlOiBmdW5jdGlvbiBiaW5kT2xkU2VsZWN0ZWRWYWx1ZShvbGREYXRhKSB7XG4gICAgICB2YXIgb2xkU2VsZWN0ZWRWYWx1ZSA9IG9sZERhdGE7XG5cbiAgICAgIGlmIChvbGRTZWxlY3RlZFZhbHVlLnJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5hZGRlZFZhbGlkYXRlUnVsZSA9IG9sZFNlbGVjdGVkVmFsdWUucnVsZXM7XG4gICAgICAgIHRoaXMucnVsZVBhcmFzLm1zZyA9IG9sZFNlbGVjdGVkVmFsdWUubXNnO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0U2VsZWN0SW5zdGFuY2VOYW1lOiBmdW5jdGlvbiBnZXRTZWxlY3RJbnN0YW5jZU5hbWUoKSB7XG4gICAgICByZXR1cm4gQmFzZVV0aWxpdHkuR2V0VXJsUGFyYVZhbHVlKFwiaW5zdGFuY2VOYW1lXCIpO1xuICAgIH0sXG4gICAgc2VsZWN0Q29tcGxldGU6IGZ1bmN0aW9uIHNlbGVjdENvbXBsZXRlKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuYWRkZWRWYWxpZGF0ZVJ1bGU7XG5cbiAgICAgIGlmICh0aGlzLmFkZGVkVmFsaWRhdGVSdWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICBtc2c6IHRoaXMucnVsZVBhcmFzLm1zZyxcbiAgICAgICAgICBydWxlczogdGhpcy5hZGRlZFZhbGlkYXRlUnVsZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC12YWxpZGF0ZS1ydWxlJywgSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUocmVzdWx0KSk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xlYXJDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2xlYXJDb21wbGV0ZTogZnVuY3Rpb24gY2xlYXJDb21wbGV0ZSgpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLWNsZWFyLXZhbGlkYXRlLXJ1bGUnKTtcbiAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc2VsZWN0VmFsaWRhdGVSdWxlRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBhZGRWYWxpZGF0ZVJ1bGU6IGZ1bmN0aW9uIGFkZFZhbGlkYXRlUnVsZSgpIHtcbiAgICAgIHZhciB2YWxpZGF0ZVBhcmFzID0gXCJcIjtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0VmFsaWRhdGVUeXBlID09IFwiTnVtYmVyXCIpIHtcbiAgICAgICAgdmFsaWRhdGVQYXJhcyA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh7XG4gICAgICAgICAgbnVtTGVuZ3RoOiB0aGlzLnJ1bGVQYXJhcy5udW1MZW5ndGgsXG4gICAgICAgICAgZGVjaW1hbExlbmd0aDogdGhpcy5ydWxlUGFyYXMuZGVjaW1hbExlbmd0aFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RWYWxpZGF0ZVR5cGUgPT0gXCJSZWd1bGFyXCIpIHtcbiAgICAgICAgdmFsaWRhdGVQYXJhcyA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh7XG4gICAgICAgICAgcmVndWxhclRleHQ6IHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJUZXh0LFxuICAgICAgICAgIHJlZ3VsYXJNc2c6IHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJNc2dcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0VmFsaWRhdGVUeXBlID09IFwiSnNNZXRob2RcIikge1xuICAgICAgICB2YWxpZGF0ZVBhcmFzID0gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHtcbiAgICAgICAgICBqc01ldGhvZE5hbWU6IHRoaXMucnVsZVBhcmFzLmpzTWV0aG9kTmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld1ZhbGlkYXRlUnVsZSA9IHtcbiAgICAgICAgXCJ2YWxpZGF0ZUlkXCI6IFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKCksXG4gICAgICAgIFwidmFsaWRhdGVUeXBlXCI6IHRoaXMuc2VsZWN0VmFsaWRhdGVUeXBlLFxuICAgICAgICBcInZhbGlkYXRlUGFyYXNcIjogdmFsaWRhdGVQYXJhc1xuICAgICAgfTtcbiAgICAgIHRoaXMuYWRkZWRWYWxpZGF0ZVJ1bGUucHVzaChuZXdWYWxpZGF0ZVJ1bGUpO1xuICAgIH0sXG4gICAgZGVsVmFsaWRhdGU6IGZ1bmN0aW9uIGRlbFZhbGlkYXRlKHZhbGlkYXRlSWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hZGRlZFZhbGlkYXRlUnVsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5hZGRlZFZhbGlkYXRlUnVsZVtpXS52YWxpZGF0ZUlkID09IHZhbGlkYXRlSWQpIHtcbiAgICAgICAgICB0aGlzLmFkZGVkVmFsaWRhdGVSdWxlLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcInNlbGVjdFZhbGlkYXRlUnVsZURpYWxvZ1dyYXBcXFwiIHYtY2xvYWsgY2xhc3M9XFxcImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjYXJkIHN0eWxlPVxcXCJtYXJnaW4tdG9wOiAxMHB4XFxcIiA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc2xvdD1cXFwidGl0bGVcXFwiPlxcdThCQkVcXHU3RjZFXFx1OUE4Q1xcdThCQzFcXHU4OUM0XFx1NTIxOTwvcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJzZWxlY3RWYWxpZGF0ZVR5cGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJOb0VtcHR5XFxcIj5cXHU0RTBEXFx1NEUzQVxcdTdBN0E8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJOdW1iZXJcXFwiPlxcdTY1NzBcXHU1QjU3PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiTW9iaWxlXFxcIj5cXHU2MjRCXFx1NjczQTwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIkRhdGVcXFwiPlxcdTY1RTVcXHU2NzFGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiVGltZVxcXCI+XFx1NjVGNlxcdTk1RjQ8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJEYXRlVGltZVxcXCI+XFx1NjVFNVxcdTY3MUZcXHU2NUY2XFx1OTVGNDwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIkVNYWlsXFxcIj5cXHU5MEFFXFx1NEVGNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIklEQ2FyZFxcXCI+XFx1OEVBQlxcdTRFRkRcXHU4QkMxPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiVVJMXFxcIj5VUkw8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJFTkNvZGVcXFwiPlxcdTgyRjFcXHU2NTg3PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiU2ltcGxlQ29kZVxcXCI+XFx1NzI3OVxcdTZCOEFcXHU1QjU3XFx1N0IyNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIlJlZ3VsYXJcXFwiPlxcdTZCNjNcXHU1MjE5XFx1ODg2OFxcdThGQkVcXHU1RjBGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiSnNNZXRob2RcXFwiPkpTXFx1NjVCOVxcdTZDRDU8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwic3VjY2Vzc1xcXCIgc2hhcGU9XFxcImNpcmNsZVxcXCIgaWNvbj1cXFwibWQtYWRkXFxcIiBzdHlsZT1cXFwibWFyZ2luLWxlZnQ6IDE1cHg7Y3Vyc29yOiBwb2ludGVyXFxcIiBAY2xpY2s9XFxcImFkZFZhbGlkYXRlUnVsZVxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2aWRlciBvcmllbnRhdGlvbj1cXFwibGVmdFxcXCIgOmRhc2hlZD1cXFwidHJ1ZVxcXCIgc3R5bGU9XFxcImZvbnQtc2l6ZTogMTJweFxcXCI+XFx1NTNDMlxcdTY1NzBcXHU4QkJFXFx1N0Y2RTwvZGl2aWRlcj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVxcdTY1NzBcXHU1QjU3XFx1N0M3QlxcdTU3OEJcXHU1M0MyXFx1NjU3MFxcdThCQkVcXHU3RjZFLS0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgdi1pZj1cXFwic2VsZWN0VmFsaWRhdGVUeXBlPT0nTnVtYmVyJ1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1mb3JtIDpsYWJlbC13aWR0aD1cXFwiODBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTk1N0ZcXHU1RUE2XFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dC1udW1iZXIgOm1heD1cXFwiMTBcXFwiIDptaW49XFxcIjFcXFwiIHYtbW9kZWw9XFxcInJ1bGVQYXJhcy5udW1MZW5ndGhcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBzdHlsZT1cXFwid2lkdGg6IDgwJVxcXCI+PC9pbnB1dC1udW1iZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjRcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlxcdTVDMEZcXHU2NTcwXFx1NEY0RFxcdTY1NzBcXHVGRjFBPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0LW51bWJlciA6bWF4PVxcXCIxMFxcXCIgOm1pbj1cXFwiMFxcXCIgdi1tb2RlbD1cXFwicnVsZVBhcmFzLmRlY2ltYWxMZW5ndGhcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBzdHlsZT1cXFwid2lkdGg6IDgwJVxcXCI+PC9pbnB1dC1udW1iZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Jvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVxcdTZCNjNcXHU1MjE5XFx1ODg2OFxcdThGQkVcXHU1RjBGXFx1N0M3QlxcdTU3OEJcXHU1M0MyXFx1NjU3MFxcdThCQkVcXHU3RjZFLS0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgdi1pZj1cXFwic2VsZWN0VmFsaWRhdGVUeXBlPT0nUmVndWxhcidcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktZm9ybSA6bGFiZWwtd2lkdGg9XFxcIjgwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU4ODY4XFx1OEZCRVxcdTVGMEZcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJFbnRlciBzb21ldGhpbmcuLi5cXFwiIHYtbW9kZWw9XFxcInJ1bGVQYXJhcy5yZWd1bGFyVGV4dFxcXCIgc3R5bGU9XFxcIndpZHRoOiA4MCVcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiNFxcXCIgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFx1NjNEMFxcdTc5M0FcXHU0RkUxXFx1NjA2RlxcdUZGMUE8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIkVudGVyIHNvbWV0aGluZy4uLlxcXCIgdi1tb2RlbD1cXFwicnVsZVBhcmFzLnJlZ3VsYXJNc2dcXFwiIHN0eWxlPVxcXCJ3aWR0aDogODAlXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Jvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLUpTXFx1NjVCOVxcdTZDRDVcXHU3QzdCXFx1NTc4QlxcdTUzQzJcXHU2NTcwXFx1OEJCRVxcdTdGNkUtLT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiB2LWlmPVxcXCJzZWxlY3RWYWxpZGF0ZVR5cGU9PSdKc01ldGhvZCdcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktZm9ybSA6bGFiZWwtd2lkdGg9XFxcIjgwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU2NUI5XFx1NkNENVxcdTU0MERcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJFbnRlciBzb21ldGhpbmcuLi5cXFwiIHYtbW9kZWw9XFxcInJ1bGVQYXJhcy5qc01ldGhvZE5hbWVcXFwiIHN0eWxlPVxcXCJ3aWR0aDogOTAlXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2NhcmQ+XFxuICAgICAgICAgICAgICAgICAgICA8Y2FyZCBzdHlsZT1cXFwibWFyZ2luLXRvcDogMTBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc2xvdD1cXFwidGl0bGVcXFwiPlxcdTVERjJcXHU2REZCXFx1NTJBMFxcdTg5QzRcXHU1MjE5PC9wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVxcXCJsZWZ0XFxcIiA6ZGFzaGVkPVxcXCJ0cnVlXFxcIiBzdHlsZT1cXFwiZm9udC1zaXplOiAxMnB4O21hcmdpbi10b3A6IDBweDttYXJnaW4tYm90dG9tOiA2cHhcXFwiPlxcdTYzRDBcXHU3OTNBXFx1NEZFMVxcdTYwNkY8L2RpdmlkZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gOmxhYmVsLXdpZHRoPVxcXCIwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVcXHU2M0QwXFx1NzkzQVxcdTRGRTFcXHU2MDZGLi4uXFxcIiAgdi1tb2RlbD1cXFwicnVsZVBhcmFzLm1zZ1xcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDEwcHg7b3ZlcmZsb3c6IGF1dG9cXFwiIGNsYXNzPVxcXCJpdi1saXN0LXBhZ2Utd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVxcXCJsZWZ0XFxcIiA6ZGFzaGVkPVxcXCJ0cnVlXFxcIiBzdHlsZT1cXFwiZm9udC1zaXplOiAxMnB4O21hcmdpbi10b3A6IDBweDttYXJnaW4tYm90dG9tOiA2cHhcXFwiPlxcdTlBOENcXHU4QkMxXFx1ODlDNFxcdTUyMTk8L2RpdmlkZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIGJvcmRlciA6Y29sdW1ucz1cXFwidmFsaWRhdGVDb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwiYWRkZWRWYWxpZGF0ZVJ1bGVcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgbm8tZGF0YS10ZXh0PVxcXCJcXHU4QkY3XFx1NkRGQlxcdTUyQTBcXHU5QThDXFx1OEJDMVxcdTg5QzRcXHU1MjE5XFxcIiA6aGVpZ2h0PVxcXCIxMzBcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvY2FyZD5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzZWxlY3RDb21wbGV0ZSgpXFxcIj4gXFx1Nzg2RSBcXHU4QkE0IDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJjbGVhckNvbXBsZXRlKClcXFwiPiBcXHU2RTA1IFxcdTdBN0EgPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiPlxcdTUxNzMgXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInRhYmxlLXJlbGF0aW9uLWNvbm5lY3QtdHdvLXRhYmxlLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHM6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzXCJcbiAgICAgIH0sXG4gICAgICBmcm9tVGFibGVGaWVsZDoge1xuICAgICAgICBmaWVsZERhdGE6IFtdLFxuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5a2X5q615ZCN56ewJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZE5hbWUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+agh+mimCcsXG4gICAgICAgICAga2V5OiAnZmllbGRDYXB0aW9uJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHRvVGFibGVGaWVsZDoge1xuICAgICAgICBmaWVsZERhdGE6IFtdLFxuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5a2X5q615ZCN56ewJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZE5hbWUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+agh+mimCcsXG4gICAgICAgICAga2V5OiAnZmllbGRDYXB0aW9uJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIGRpYWxvZ0hlaWdodDogMCxcbiAgICAgIHJlc3VsdERhdGE6IHtcbiAgICAgICAgZnJvbToge1xuICAgICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgICAgdGV4dDogXCJcIlxuICAgICAgICB9LFxuICAgICAgICB0bzoge1xuICAgICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgICAgdGV4dDogXCJcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5jb25uZWN0VGFibGVGaWVsZE1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBjb21wbGV0ZWQ6IGZ1bmN0aW9uIGNvbXBsZXRlZCgpIHtcbiAgICAgIGlmICh0aGlzLnJlc3VsdERhdGEuZnJvbS50ZXh0ICE9IFwiXCIgJiYgdGhpcy5yZXN1bHREYXRhLnRvLnRleHQgIT0gXCJcIikge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1jb21wbGV0ZWQtY29ubmVjdCcsIHRoaXMucmVzdWx0RGF0YSk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+36K6+572u5YWz6IGU5a2X5q61XCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RmllbGRzQW5kQmluZDogZnVuY3Rpb24gZ2V0RmllbGRzQW5kQmluZChmcm9tVGFibGVJZCwgdG9UYWJsZUlkKSB7XG4gICAgICB2YXIgdGFibGVJZHMgPSBbZnJvbVRhYmxlSWQsIHRvVGFibGVJZF07XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzLCB7XG4gICAgICAgIFwidGFibGVJZHNcIjogdGFibGVJZHNcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgdmFyIGFsbEZpZWxkcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIHZhciBhbGxUYWJsZXMgPSByZXN1bHQuZXhLVkRhdGEuVGFibGVzO1xuXG4gICAgICAgICAgdmFyIGZyb21UYWJsZUZpZWxkcyA9IF9zZWxmLmdldFNpbmdsZVRhYmxlRmllbGRzRGF0YShhbGxGaWVsZHMsIGZyb21UYWJsZUlkKTtcblxuICAgICAgICAgIHZhciB0b1RhYmxlRmllbGRzID0gX3NlbGYuZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhKGFsbEZpZWxkcywgdG9UYWJsZUlkKTtcblxuICAgICAgICAgIF9zZWxmLmZyb21UYWJsZUZpZWxkLmZpZWxkRGF0YSA9IGZyb21UYWJsZUZpZWxkcztcbiAgICAgICAgICBfc2VsZi50b1RhYmxlRmllbGQuZmllbGREYXRhID0gdG9UYWJsZUZpZWxkcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0Q29ubmVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3RDb25uZWN0KGZyb21UYWJsZUlkLCB0b1RhYmxlSWQpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5jb25uZWN0VGFibGVGaWVsZE1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS5mcm9tLnRhYmxlSWQgPSBmcm9tVGFibGVJZDtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS50by50YWJsZUlkID0gdG9UYWJsZUlkO1xuICAgICAgdGhpcy5yZXN1bHREYXRhLmZyb20udGV4dCA9IFwiXCI7XG4gICAgICB0aGlzLnJlc3VsdERhdGEudG8udGV4dCA9IFwiXCI7XG4gICAgICB0aGlzLmdldEZpZWxkc0FuZEJpbmQoZnJvbVRhYmxlSWQsIHRvVGFibGVJZCk7XG4gICAgICB2YXIgaGVpZ2h0ID0gNDUwO1xuXG4gICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA1NTApIHtcbiAgICAgICAgaGVpZ2h0ID0gNjAwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRpYWxvZ0hlaWdodCA9IGhlaWdodDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogODcwLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgdGl0bGU6IFwi6K6+572u5YWz6IGUXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhOiBmdW5jdGlvbiBnZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGEoYWxsRmllbGRzLCB0YWJsZUlkKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbGxGaWVsZHNbaV0uZmllbGRUYWJsZUlkID09IHRhYmxlSWQpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChhbGxGaWVsZHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICBzZWxlY3RlZEZyb21GaWVsZDogZnVuY3Rpb24gc2VsZWN0ZWRGcm9tRmllbGQocm93LCBpbmRleCkge1xuICAgICAgdGhpcy5yZXN1bHREYXRhLmZyb20udGV4dCA9IHJvdy5maWVsZE5hbWUgKyBcIlsxXVwiO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRUb0ZpZWxkOiBmdW5jdGlvbiBzZWxlY3RlZFRvRmllbGQocm93LCBpbmRleCkge1xuICAgICAgdGhpcy5yZXN1bHREYXRhLnRvLnRleHQgPSByb3cuZmllbGROYW1lICsgXCJbMC4uTl1cIjtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJjb25uZWN0VGFibGVGaWVsZE1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC1zb3VyY2Utd3JhcCBjMS1zZWxlY3QtbW9kZWwtc291cmNlLWhhcy1idXR0b25zLXdyYXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nOiAxMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogbGVmdDt3aWR0aDogNDklO2hlaWdodDogMTAwJTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJyZXN1bHREYXRhLmZyb20udGV4dFxcXCIgc3VmZml4PVxcXCJtZC1kb25lLWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTVGMDBcXHU1OUNCXFx1NTE3M1xcdTgwNTRcXHU1QjU3XFx1NkJCNVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIEBvbi1yb3ctY2xpY2s9XFxcInNlbGVjdGVkRnJvbUZpZWxkXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgOmhlaWdodD1cXFwiZGlhbG9nSGVpZ2h0LTE4MFxcXCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cXFwiZnJvbVRhYmxlRmllbGQuY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcImZyb21UYWJsZUZpZWxkLmZpZWxkRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OnJpZ2h0O3dpZHRoOiA0OSU7aGVpZ2h0OiAxMDAlO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcInJlc3VsdERhdGEudG8udGV4dFxcXCIgc3VmZml4PVxcXCJtZC1kb25lLWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTdFRDNcXHU2NzVGXFx1NTE3M1xcdTgwNTRcXHU1QjU3XFx1NkJCNVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIEBvbi1yb3ctY2xpY2s9XFxcInNlbGVjdGVkVG9GaWVsZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIDpoZWlnaHQ9XFxcImRpYWxvZ0hlaWdodC0xODBcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcInRvVGFibGVGaWVsZC5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwidG9UYWJsZUZpZWxkLmZpZWxkRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcImJvdHRvbTogMTJweDtyaWdodDogMTJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiY29tcGxldGVkKClcXFwiIGljb249XFxcIm1kLWNoZWNrbWFya1xcXCI+XFx1Nzg2RVxcdThCQTQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiPlxcdTUxNzNcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJkYi10YWJsZS1yZWxhdGlvbi1jb21wXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0VGFibGVzRGF0YVVybDogXCIvUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZvclpUcmVlTm9kZUxpc3RcIixcbiAgICAgICAgZ2V0VGFibGVGaWVsZHNVcmw6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZUZpZWxkc0J5VGFibGVJZFwiXG4gICAgICB9LFxuICAgICAgcmVsYXRpb25UYWJsZVRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdGFibGVUcmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfc2VsZiA9IHdpbmRvdy5fZGJ0YWJsZXJlbGF0aW9uY29tcDtcblxuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZFJlbGF0aW9uVGFibGVOb2RlKHRyZWVOb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRhYmxlVHJlZVJvb3REYXRhOiB7XG4gICAgICAgICAgaWQ6IFwiLTFcIixcbiAgICAgICAgICB0ZXh0OiBcIuaVsOaNruWFs+iBlFwiLFxuICAgICAgICAgIHBhcmVudElkOiBcIlwiLFxuICAgICAgICAgIG5vZGVUeXBlTmFtZTogXCLmoLnoioLngrlcIixcbiAgICAgICAgICBpY29uOiBcIi4uLy4uLy4uL1RoZW1lcy9QbmcxNlgxNi9jb2luc19hZGQucG5nXCIsXG4gICAgICAgICAgX25vZGVFeFR5cGU6IFwicm9vdFwiLFxuICAgICAgICAgIHRhYmxlSWQ6IFwiLTFcIlxuICAgICAgICB9LFxuICAgICAgICBjdXJyZW50U2VsZWN0ZWROb2RlOiBudWxsXG4gICAgICB9LFxuICAgICAgcmVsYXRpb25UYWJsZUVkaXRvclZpZXc6IHtcbiAgICAgICAgaXNTaG93VGFibGVFZGl0RGV0YWlsOiBmYWxzZSxcbiAgICAgICAgaXNTdWJFZGl0VHI6IGZhbHNlLFxuICAgICAgICBpc01haW5FZGl0VHI6IGZhbHNlLFxuICAgICAgICBzZWxQS0RhdGE6IFtdLFxuICAgICAgICBzZWxTZWxmS2V5RGF0YTogW10sXG4gICAgICAgIHNlbEZvcmVpZ25LZXlEYXRhOiBbXVxuICAgICAgfSxcbiAgICAgIGVtcHR5RWRpdG9yRGF0YToge1xuICAgICAgICBpZDogXCJcIixcbiAgICAgICAgcGFyZW50SWQ6IFwiXCIsXG4gICAgICAgIHNpbmdsZU5hbWU6IFwiXCIsXG4gICAgICAgIHBrRmllbGROYW1lOiBcIlwiLFxuICAgICAgICBkZXNjOiBcIlwiLFxuICAgICAgICBzZWxmS2V5RmllbGROYW1lOiBcIlwiLFxuICAgICAgICBvdXRlcktleUZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgcmVsYXRpb25UeXBlOiBcIjFUb05cIixcbiAgICAgICAgaXNTYXZlOiBcInRydWVcIixcbiAgICAgICAgY29uZGl0aW9uOiBcIlwiLFxuICAgICAgICB0YWJsZUlkOiBcIlwiLFxuICAgICAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIlxuICAgICAgfSxcbiAgICAgIGN1cnJlbnRFZGl0b3JEYXRhOiB7XG4gICAgICAgIGlkOiBcIlwiLFxuICAgICAgICBwYXJlbnRJZDogXCJcIixcbiAgICAgICAgc2luZ2xlTmFtZTogXCJcIixcbiAgICAgICAgcGtGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIGRlc2M6IFwiXCIsXG4gICAgICAgIHNlbGZLZXlGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIG91dGVyS2V5RmllbGROYW1lOiBcIlwiLFxuICAgICAgICByZWxhdGlvblR5cGU6IFwiMVRvTlwiLFxuICAgICAgICBpc1NhdmU6IFwidHJ1ZVwiLFxuICAgICAgICBjb25kaXRpb246IFwiXCIsXG4gICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgIHRhYmxlTmFtZTogXCJcIixcbiAgICAgICAgdGFibGVDYXB0aW9uOiBcIlwiXG4gICAgICB9LFxuICAgICAgc2VsZWN0VGFibGVUcmVlOiB7XG4gICAgICAgIG9sZFNlbGVjdGVkREJMaW5rSWQ6IFwiSkJ1aWxkNGRMb2NhdGlvbkRCTGlua1wiLFxuICAgICAgICBkaXNhYmxlZERCTGluazogZmFsc2UsXG4gICAgICAgIGRiTGlua0VudGl0aWVzOiBbXSxcbiAgICAgICAgdGFibGVUcmVlT2JqOiBudWxsLFxuICAgICAgICB0YWJsZVRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIGlmICh0cmVlTm9kZS5ub2RlVHlwZU5hbWUgPT0gXCJUYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gd2luZG93Ll9kYnRhYmxlcmVsYXRpb25jb21wO1xuICAgICAgICAgICAgICAgICQoXCIjZGl2U2VsZWN0VGFibGVcIikuZGlhbG9nKFwiY2xvc2VcIik7XG5cbiAgICAgICAgICAgICAgICBfc2VsZi5hZGRUYWJsZVRvUmVsYXRpb25UYWJsZVRyZWUodHJlZU5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVRyZWVEYXRhOiBudWxsLFxuICAgICAgICBhbGxUYWJsZVRyZWVEYXRhOiBudWxsLFxuICAgICAgICBzZWxlY3RlZFRhYmxlTmFtZTogXCLml6BcIlxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhU3RvcmU6IHt9LFxuICAgICAgcmVzdWx0RGF0YTogW10sXG4gICAgICB0cmVlTm9kZVNldHRpbmc6IHtcbiAgICAgICAgTWFpblRhYmxlTm9kZUltZzogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvcGFnZV9rZXkucG5nXCIsXG4gICAgICAgIFN1YlRhYmxlTm9kZUltZzogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvcGFnZV9yZWZyZXNoLnBuZ1wiXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmdldFRhYmxlc0FuZEJpbmRPbGRTZWxlY3RlZCgpO1xuICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI2RhdGFSZWxhdGlvblpUcmVlVUxcIiksIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudGFibGVUcmVlU2V0dGluZywgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50YWJsZVRyZWVSb290RGF0YSk7XG4gICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUgPSB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmouZ2V0Tm9kZUJ5UGFyYW0oXCJpZFwiLCBcIi0xXCIpO1xuICAgIHdpbmRvdy5fZGJ0YWJsZXJlbGF0aW9uY29tcCA9IHRoaXM7XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgY3VycmVudEVkaXRvckRhdGE6IHtcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIGhhbmRsZXIodmFsLCBvbGRWYWwpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlc3VsdERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy5yZXN1bHREYXRhW2ldLmlkID09IHZhbC5pZCkge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRJdGVtQ29weUVkaXRFbmFibGVWYWx1ZSh0aGlzLnJlc3VsdERhdGFbaV0sIHZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVlcDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIHJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlOiBmdW5jdGlvbiByZXN1bHRJdGVtQ29weUVkaXRFbmFibGVWYWx1ZSh0b09iaiwgZnJvbU9iaikge1xuICAgICAgdG9PYmouc2luZ2xlTmFtZSA9IGZyb21PYmouc2luZ2xlTmFtZTtcbiAgICAgIHRvT2JqLnBrRmllbGROYW1lID0gZnJvbU9iai5wa0ZpZWxkTmFtZTtcbiAgICAgIHRvT2JqLmRlc2MgPSBmcm9tT2JqLmRlc2M7XG4gICAgICB0b09iai5zZWxmS2V5RmllbGROYW1lID0gZnJvbU9iai5zZWxmS2V5RmllbGROYW1lO1xuICAgICAgdG9PYmoub3V0ZXJLZXlGaWVsZE5hbWUgPSBmcm9tT2JqLm91dGVyS2V5RmllbGROYW1lO1xuICAgICAgdG9PYmoucmVsYXRpb25UeXBlID0gZnJvbU9iai5yZWxhdGlvblR5cGU7XG4gICAgICB0b09iai5pc1NhdmUgPSBmcm9tT2JqLmlzU2F2ZTtcbiAgICAgIHRvT2JqLmNvbmRpdGlvbiA9IGZyb21PYmouY29uZGl0aW9uO1xuICAgIH0sXG4gICAgZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQ6IGZ1bmN0aW9uIGdldFRhYmxlRmllbGRzQnlUYWJsZUlkKHRhYmxlSWQpIHtcbiAgICAgIGlmICh0YWJsZUlkID09IFwiLTFcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXSkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wRGF0YVN0b3JlW1widGFibGVGaWVsZF9cIiArIHRhYmxlSWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0U3luYyh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlRmllbGRzVXJsLCB7XG4gICAgICAgICAgdGFibGVJZDogdGFibGVJZFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBfc2VsZi50ZW1wRGF0YVN0b3JlW1widGFibGVGaWVsZF9cIiArIHRhYmxlSWRdID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXSkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wRGF0YVN0b3JlW1widGFibGVGaWVsZF9cIiArIHRhYmxlSWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRFbXB0eVJlc3VsdEl0ZW06IGZ1bmN0aW9uIGdldEVtcHR5UmVzdWx0SXRlbSgpIHtcbiAgICAgIHJldHVybiBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZSh0aGlzLmVtcHR5RWRpdG9yRGF0YSk7XG4gICAgfSxcbiAgICBnZXRFeGlzdFJlc3VsdEl0ZW06IGZ1bmN0aW9uIGdldEV4aXN0UmVzdWx0SXRlbShpZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlc3VsdERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMucmVzdWx0RGF0YVtpXS5pZCA9PSBpZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlc3VsdERhdGFbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBnZXRUYWJsZXNBbmRCaW5kT2xkU2VsZWN0ZWQ6IGZ1bmN0aW9uIGdldFRhYmxlc0FuZEJpbmRPbGRTZWxlY3RlZCgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZXNEYXRhVXJsLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5zZWxlY3RUYWJsZVRyZWUuZGJMaW5rRW50aXRpZXMgPSByZXN1bHQuZXhLVkRhdGEuZGJMaW5rRW50aXR5TGlzdDtcbiAgICAgICAgICBfc2VsZi5zZWxlY3RUYWJsZVRyZWUuYWxsVGFibGVUcmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgX3NlbGYuYmluZFNlbGVjdFRhYmxlVHJlZSh0cnVlKTtcblxuICAgICAgICAgIGZ1enp5U2VhcmNoVHJlZU9iaihfc2VsZi5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlT2JqLCBfc2VsZi4kcmVmcy50eHRfdGFibGVfc2VhcmNoX3RleHQuJHJlZnMuaW5wdXQsIG51bGwsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgYmluZFNlbGVjdFRhYmxlVHJlZTogZnVuY3Rpb24gYmluZFNlbGVjdFRhYmxlVHJlZShpc0dldENvb2tpZU9sZFNlbGVjdGVkKSB7XG4gICAgICB2YXIgb2xkU2VsZWN0ZWREQkxpbmtJZCA9IENvb2tpZVV0aWxpdHkuR2V0Q29va2llKFwiREJUUkNEQkxJTktJRFwiKTtcblxuICAgICAgaWYgKG9sZFNlbGVjdGVkREJMaW5rSWQgJiYgaXNHZXRDb29raWVPbGRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnNlbGVjdFRhYmxlVHJlZS5vbGRTZWxlY3RlZERCTGlua0lkID0gb2xkU2VsZWN0ZWREQkxpbmtJZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9sZFNlbGVjdGVkREJMaW5rSWQgPSB0aGlzLnNlbGVjdFRhYmxlVHJlZS5vbGRTZWxlY3RlZERCTGlua0lkO1xuICAgICAgfVxuXG4gICAgICB2YXIgYmluZFRvVHJlZURhdGEgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlbGVjdFRhYmxlVHJlZS5hbGxUYWJsZVRyZWVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChvbGRTZWxlY3RlZERCTGlua0lkID09IHRoaXMuc2VsZWN0VGFibGVUcmVlLmFsbFRhYmxlVHJlZURhdGFbaV0ub3V0ZXJJZCkge1xuICAgICAgICAgIGJpbmRUb1RyZWVEYXRhLnB1c2godGhpcy5zZWxlY3RUYWJsZVRyZWUuYWxsVGFibGVUcmVlRGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlRGF0YSA9IGJpbmRUb1RyZWVEYXRhO1xuICAgICAgdGhpcy5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjc2VsZWN0VGFibGVaVHJlZVVMXCIpLCB0aGlzLnNlbGVjdFRhYmxlVHJlZS50YWJsZVRyZWVTZXR0aW5nLCB0aGlzLnNlbGVjdFRhYmxlVHJlZS50YWJsZVRyZWVEYXRhKTtcbiAgICAgIHRoaXMuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgfSxcbiAgICBjaGFuZ2VEQkxpbms6IGZ1bmN0aW9uIGNoYW5nZURCTGluayhkYkxpbmtJZCkge1xuICAgICAgQ29va2llVXRpbGl0eS5TZXRDb29raWUxTW9udGgoXCJEQlRSQ0RCTElOS0lEXCIsIGRiTGlua0lkKTtcbiAgICAgIHRoaXMuYmluZFNlbGVjdFRhYmxlVHJlZSh0cnVlKTtcbiAgICB9LFxuICAgIGdldE1haW5UYWJsZURCTGlua0lkOiBmdW5jdGlvbiBnZXRNYWluVGFibGVEQkxpbmtJZCgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RUYWJsZVRyZWUuYWxsVGFibGVUcmVlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RUYWJsZVRyZWUuYWxsVGFibGVUcmVlRGF0YVtpXS5pZCA9PSB0aGlzLmdldE1haW5UYWJsZUlkKCkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RUYWJsZVRyZWUuYWxsVGFibGVUcmVlRGF0YVtpXS5vdXRlcklkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH0sXG4gICAgZGVsZXRlU2VsZWN0ZWRSZWxhdGlvblRyZWVOb2RlOiBmdW5jdGlvbiBkZWxldGVTZWxlY3RlZFJlbGF0aW9uVHJlZU5vZGUoKSB7XG4gICAgICBpZiAodGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCkpIHtcbiAgICAgICAgICBpZiAoIXRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pc1BhcmVudCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlc3VsdERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMucmVzdWx0RGF0YVtpXS5pZCA9PSB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdERhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodGhpcy5jdXJyZW50RWRpdG9yRGF0YSwgdGhpcy5lbXB0eUVkaXRvckRhdGEpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RWRpdG9yRGF0YS5pZCA9IFwiXCI7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLnBhcmVudElkID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuJHJlZnMuc3FsR2VuZXJhbERlc2lnbkNvbXAuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFBLRGF0YSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxTZWxmS2V5RGF0YSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxGb3JlaWduS2V5RGF0YSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1Nob3dUYWJsZUVkaXREZXRhaWwgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5yZW1vdmVOb2RlKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlID0gbnVsbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLkuI3og73liKDpmaTniLboioLngrkhXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuS4jeiDveWIoOmZpOagueiKgueCuSFcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+36YCJ5oup6KaB5Yig6Zmk55qE6IqC54K5IVwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0VGFibGVUb1JlbGF0aW9uVGFibGU6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0VGFibGVUb1JlbGF0aW9uVGFibGUoKSB7XG4gICAgICBpZiAodGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICQoXCIjZGl2U2VsZWN0VGFibGVcIikuZGlhbG9nKHtcbiAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICB3aWR0aDogNzAwXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbWFpblRhYmxlREJMaW5rSWQgPSB0aGlzLmdldE1haW5UYWJsZURCTGlua0lkKCk7XG5cbiAgICAgICAgaWYgKG1haW5UYWJsZURCTGlua0lkKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RUYWJsZVRyZWUub2xkU2VsZWN0ZWREQkxpbmtJZCA9IG1haW5UYWJsZURCTGlua0lkO1xuICAgICAgICAgIHRoaXMuYmluZFNlbGVjdFRhYmxlVHJlZShmYWxzZSk7XG4gICAgICAgICAgdGhpcy5zZWxlY3RUYWJsZVRyZWUuZGlzYWJsZWREQkxpbmsgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2VsZWN0VGFibGVUcmVlLmRpc2FibGVkREJMaW5rID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIumAieaLqeS4gOS4queItuiKgueCuSFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhcHBlbmRNYWluVGFibGVOb2RlUHJvcDogZnVuY3Rpb24gYXBwZW5kTWFpblRhYmxlTm9kZVByb3Aobm9kZSkge1xuICAgICAgbm9kZS5fbm9kZUV4VHlwZSA9IFwiTWFpbk5vZGVcIjtcbiAgICAgIG5vZGUuaWNvbiA9IHRoaXMudHJlZU5vZGVTZXR0aW5nLk1haW5UYWJsZU5vZGVJbWc7XG4gICAgfSxcbiAgICBhcHBlbmRTdWJUYWJsZU5vZGVQcm9wOiBmdW5jdGlvbiBhcHBlbmRTdWJUYWJsZU5vZGVQcm9wKG5vZGUpIHtcbiAgICAgIG5vZGUuX25vZGVFeFR5cGUgPSBcIlN1Yk5vZGVcIjtcbiAgICAgIG5vZGUuaWNvbiA9IHRoaXMudHJlZU5vZGVTZXR0aW5nLlN1YlRhYmxlTm9kZUltZztcbiAgICB9LFxuICAgIGJ1aWxkUmVsYXRpb25UYWJsZU5vZGU6IGZ1bmN0aW9uIGJ1aWxkUmVsYXRpb25UYWJsZU5vZGUoc291cmNlTm9kZSwgdHJlZU5vZGVJZCkge1xuICAgICAgaWYgKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5fbm9kZUV4VHlwZSA9PSBcInJvb3RcIikge1xuICAgICAgICB0aGlzLmFwcGVuZE1haW5UYWJsZU5vZGVQcm9wKHNvdXJjZU5vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hcHBlbmRTdWJUYWJsZU5vZGVQcm9wKHNvdXJjZU5vZGUpO1xuICAgICAgfVxuXG4gICAgICBzb3VyY2VOb2RlLnRhYmxlSWQgPSBzb3VyY2VOb2RlLmlkO1xuXG4gICAgICBpZiAodHJlZU5vZGVJZCkge1xuICAgICAgICBzb3VyY2VOb2RlLmlkID0gdHJlZU5vZGVJZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvdXJjZU5vZGUuaWQgPSBTdHJpbmdVdGlsaXR5Lkd1aWQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNvdXJjZU5vZGU7XG4gICAgfSxcbiAgICBnZXRNYWluUmVsYXRpb25UYWJsZU5vZGU6IGZ1bmN0aW9uIGdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmdldE5vZGVCeVBhcmFtKFwiX25vZGVFeFR5cGVcIiwgXCJNYWluTm9kZVwiKTtcblxuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZ2V0TWFpblRhYmxlSWQ6IGZ1bmN0aW9uIGdldE1haW5UYWJsZUlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkgPyB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpLnRhYmxlSWQgOiBcIlwiO1xuICAgIH0sXG4gICAgZ2V0TWFpblRhYmxlTmFtZTogZnVuY3Rpb24gZ2V0TWFpblRhYmxlTmFtZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpID8gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKS52YWx1ZSA6IFwiXCI7XG4gICAgfSxcbiAgICBnZXRNYWluVGFibGVDYXB0aW9uOiBmdW5jdGlvbiBnZXRNYWluVGFibGVDYXB0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkgPyB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpLmF0dHIxIDogXCJcIjtcbiAgICB9LFxuICAgIGlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGU6IGZ1bmN0aW9uIGlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlkID09IFwiLTFcIjtcbiAgICB9LFxuICAgIGlzU2VsZWN0ZWRNYWluUmVsYXRpb25UYWJsZU5vZGU6IGZ1bmN0aW9uIGlzU2VsZWN0ZWRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLl9ub2RlRXhUeXBlID09IFwiTWFpbk5vZGVcIjtcbiAgICB9LFxuICAgIGFkZFRhYmxlVG9SZWxhdGlvblRhYmxlVHJlZTogZnVuY3Rpb24gYWRkVGFibGVUb1JlbGF0aW9uVGFibGVUcmVlKG5ld05vZGUpIHtcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgbmV3Tm9kZSA9IHRoaXMuYnVpbGRSZWxhdGlvblRhYmxlTm9kZShuZXdOb2RlKTtcbiAgICAgIHZhciB0ZW1wTm9kZSA9IHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCk7XG5cbiAgICAgIGlmICh0ZW1wTm9kZSAhPSBudWxsKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGUoKSkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuWPquWFgeiuuOWtmOWcqOS4gOS4quS4u+iusOW9lSFcIiwgbnVsbCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5hZGROb2Rlcyh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUsIC0xLCBuZXdOb2RlLCBmYWxzZSk7XG4gICAgICB2YXIgbmV3UmVzdWx0SXRlbSA9IHRoaXMuZ2V0RW1wdHlSZXN1bHRJdGVtKCk7XG4gICAgICBuZXdSZXN1bHRJdGVtLmlkID0gbmV3Tm9kZS5pZDtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0ucGFyZW50SWQgPSB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaWQ7XG4gICAgICBuZXdSZXN1bHRJdGVtLnRhYmxlSWQgPSBuZXdOb2RlLnRhYmxlSWQ7XG4gICAgICBuZXdSZXN1bHRJdGVtLnRhYmxlTmFtZSA9IG5ld05vZGUudmFsdWU7XG4gICAgICBuZXdSZXN1bHRJdGVtLnRhYmxlQ2FwdGlvbiA9IG5ld05vZGUuYXR0cjE7XG4gICAgICBuZXdSZXN1bHRJdGVtLnRhYmxlQ29kZSA9IG5ld05vZGUuY29kZTtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS5wdXNoKG5ld1Jlc3VsdEl0ZW0pO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRSZWxhdGlvblRhYmxlTm9kZTogZnVuY3Rpb24gc2VsZWN0ZWRSZWxhdGlvblRhYmxlTm9kZShub2RlKSB7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUgPSBub2RlO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1Nob3dUYWJsZUVkaXREZXRhaWwgPSAhdGhpcy5pc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzTWFpbkVkaXRUciA9IHRoaXMuaXNTZWxlY3RlZE1haW5SZWxhdGlvblRhYmxlTm9kZSgpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1N1YkVkaXRUciA9ICF0aGlzLmlzU2VsZWN0ZWRNYWluUmVsYXRpb25UYWJsZU5vZGUoKTtcblxuICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxQS0RhdGEgPSB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKG5vZGUudGFibGVJZCkgIT0gbnVsbCA/IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQobm9kZS50YWJsZUlkKSA6IFtdO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxTZWxmS2V5RGF0YSA9IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQobm9kZS50YWJsZUlkKSAhPSBudWxsID8gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChub2RlLnRhYmxlSWQpIDogW107XG4gICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUuZ2V0UGFyZW50Tm9kZSgpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxGb3JlaWduS2V5RGF0YSA9IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQocGFyZW50Tm9kZS50YWJsZUlkKSAhPSBudWxsID8gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChwYXJlbnROb2RlLnRhYmxlSWQpIDogW107XG4gICAgICB0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLmlkID0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlkO1xuICAgICAgdGhpcy5jdXJyZW50RWRpdG9yRGF0YS5wYXJlbnRJZCA9IHBhcmVudE5vZGUuaWQ7XG4gICAgICB2YXIgZXhpc3RSZXN1bHRJdGVtID0gdGhpcy5nZXRFeGlzdFJlc3VsdEl0ZW0obm9kZS5pZCk7XG5cbiAgICAgIGlmIChleGlzdFJlc3VsdEl0ZW0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlKHRoaXMuY3VycmVudEVkaXRvckRhdGEsIGV4aXN0UmVzdWx0SXRlbSk7XG5cbiAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3NlbGYuJHJlZnMuc3FsR2VuZXJhbERlc2lnbkNvbXAuc2V0VmFsdWUoX3NlbGYuY3VycmVudEVkaXRvckRhdGEuY29uZGl0aW9uKTtcblxuICAgICAgICAgIF9zZWxmLiRyZWZzLnNxbEdlbmVyYWxEZXNpZ25Db21wLnNldEFib3V0VGFibGVGaWVsZHMoX3NlbGYucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsU2VsZktleURhdGEsIF9zZWxmLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbEZvcmVpZ25LZXlEYXRhKTtcbiAgICAgICAgfSwgMzAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwi6YCa6L+HZ2V0RXhpc3RSZXN1bHRJdGVt6I635Y+W5LiN5Yiw5pWw5o2uIVwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFJlc3VsdERhdGE6IGZ1bmN0aW9uIGdldFJlc3VsdERhdGEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHREYXRhO1xuICAgIH0sXG4gICAgc2VyaWFsaXplUmVsYXRpb246IGZ1bmN0aW9uIHNlcmlhbGl6ZVJlbGF0aW9uKGlzRm9ybWF0KSB7XG4gICAgICBhbGVydChcInNlcmlhbGl6ZVJlbGF0aW9u5bey57uP5YGc55SoXCIpO1xuICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoaXNGb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZ0Zvcm1hdCh0aGlzLnJlc3VsdERhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHRoaXMucmVzdWx0RGF0YSk7XG4gICAgfSxcbiAgICBkZXNlcmlhbGl6ZVJlbGF0aW9uOiBmdW5jdGlvbiBkZXNlcmlhbGl6ZVJlbGF0aW9uKGpzb25TdHJpbmcpIHtcbiAgICAgIGFsZXJ0KFwiZGVzZXJpYWxpemVSZWxhdGlvbuW3sue7j+WBnOeUqFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9LFxuICAgIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG1haW5UYWJsZUlkOiB0aGlzLmdldE1haW5UYWJsZUlkKCksXG4gICAgICAgIG1haW5UYWJsZU5hbWU6IHRoaXMuZ2V0TWFpblRhYmxlTmFtZSgpLFxuICAgICAgICBtYWluVGFibGVDYXB0aW9uOiB0aGlzLmdldE1haW5UYWJsZUNhcHRpb24oKSxcbiAgICAgICAgcmVsYXRpb25EYXRhOiB0aGlzLnJlc3VsdERhdGFcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKGpzb25TdHJpbmcpIHtcbiAgICAgIHZhciB0ZW1wRGF0YSA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihqc29uU3RyaW5nKTtcbiAgICAgIHRoaXMucmVzdWx0RGF0YSA9IHRlbXBEYXRhO1xuICAgICAgdmFyIHRyZWVOb2RlRGF0YSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0cmVlTm9kZSA9IHtcbiAgICAgICAgICBcInZhbHVlXCI6IHRlbXBEYXRhW2ldLnRhYmxlTmFtZSxcbiAgICAgICAgICBcImF0dHIxXCI6IHRlbXBEYXRhW2ldLnRhYmxlQ2FwdGlvbixcbiAgICAgICAgICBcInRleHRcIjogXCLjgJBcIiArIHRlbXBEYXRhW2ldLnRhYmxlQ29kZSArIFwi44CRXCIgKyB0ZW1wRGF0YVtpXS50YWJsZUNhcHRpb24gKyBcIuOAkFwiICsgdGVtcERhdGFbaV0udGFibGVOYW1lICsgXCLjgJFcIixcbiAgICAgICAgICBcImlkXCI6IHRlbXBEYXRhW2ldLmlkLFxuICAgICAgICAgIFwicGFyZW50SWRcIjogdGVtcERhdGFbaV0ucGFyZW50SWQsXG4gICAgICAgICAgXCJ0YWJsZUlkXCI6IHRlbXBEYXRhW2ldLnRhYmxlSWQsXG4gICAgICAgICAgXCJ0YWJsZU5hbWVcIjogdGVtcERhdGFbaV0udGFibGVOYW1lLFxuICAgICAgICAgIFwidGFibGVDYXB0aW9uXCI6IHRlbXBEYXRhW2ldLnRhYmxlQ2FwdGlvbixcbiAgICAgICAgICBcInRhYmxlQ29kZVwiOiB0ZW1wRGF0YVtpXS50YWJsZUNvZGVcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGVtcERhdGFbaV0ucGFyZW50SWQgPT0gXCItMVwiKSB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRNYWluVGFibGVOb2RlUHJvcCh0cmVlTm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRTdWJUYWJsZU5vZGVQcm9wKHRyZWVOb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyZWVOb2RlRGF0YS5wdXNoKHRyZWVOb2RlKTtcbiAgICAgIH1cblxuICAgICAgdHJlZU5vZGVEYXRhLnB1c2godGhpcy5yZWxhdGlvblRhYmxlVHJlZS50YWJsZVRyZWVSb290RGF0YSk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNkYXRhUmVsYXRpb25aVHJlZVVMXCIpLCB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRhYmxlVHJlZVNldHRpbmcsIHRyZWVOb2RlRGF0YSk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgIH0sXG4gICAgYWxlcnRTZXJpYWxpemVSZWxhdGlvbjogZnVuY3Rpb24gYWxlcnRTZXJpYWxpemVSZWxhdGlvbigpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRKc29uQ29kZSh0aGlzLnJlc3VsdERhdGEpO1xuICAgIH0sXG4gICAgaW5wdXREZXNlcmlhbGl6ZVJlbGF0aW9uOiBmdW5jdGlvbiBpbnB1dERlc2VyaWFsaXplUmVsYXRpb24oKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LlByb21wdCh3aW5kb3csIHtcbiAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgaGVpZ2h0OiA2MDBcbiAgICAgIH0sIERpYWxvZ1V0aWxpdHkuRGlhbG9nUHJvbXB0SWQsIFwi6K+36LS05YWl5pWw5o2u5YWz6IGUSnNvbuiuvue9ruWtl+espuS4slwiLCBmdW5jdGlvbiAoanNvblN0cmluZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHdpbmRvdy5fZGJ0YWJsZXJlbGF0aW9uY29tcC5zZXRWYWx1ZShqc29uU3RyaW5nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGFsZXJ0KFwi5Y+N5bqP5YiX5YyW5aSx6LSlOlwiICsgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz1cXFwiZGItdGFibGUtcmVsYXRpb24tY29tcFxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVxcXCJsZWZ0XFxcIiA6ZGFzaGVkPVxcXCJ0cnVlXFxcIiBzdHlsZT1cXFwiZm9udC1zaXplOiAxMnB4O21hcmdpbi10b3A6IDBweDttYXJnaW4tYm90dG9tOiAxMHB4XFxcIj5cXHU2NTcwXFx1NjM2RVxcdTUxNzNcXHU3Q0ZCXFx1NTE3M1xcdTgwNTRcXHU4QkJFXFx1N0Y2RTwvZGl2aWRlcj5cXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZmxvYXQ6IGxlZnQ7d2lkdGg6IDM1MHB4O2hlaWdodDogMzMwcHg7Ym9yZGVyOiAjZGRkZGYxIDFweCBzb2xpZDtib3JkZXItcmFkaXVzOiA0cHg7cGFkZGluZzogMTBweCAxMHB4IDEwcHggMTBweDtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cCBzaGFwZT1cXFwiY2lyY2xlXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwic3VjY2Vzc1xcXCIgQGNsaWNrPVxcXCJiZWdpblNlbGVjdFRhYmxlVG9SZWxhdGlvblRhYmxlXFxcIj4mbmJzcDtcXHU2REZCXFx1NTJBMCZuYnNwOzwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiZGVsZXRlU2VsZWN0ZWRSZWxhdGlvblRyZWVOb2RlXFxcIj4mbmJzcDtcXHU1MjIwXFx1OTY2NCZuYnNwOzwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiYWxlcnRTZXJpYWxpemVSZWxhdGlvblxcXCI+XFx1NUU4RlxcdTUyMTdcXHU1MzE2PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJpbnB1dERlc2VyaWFsaXplUmVsYXRpb25cXFwiPlxcdTUzQ0RcXHU1RThGXFx1NTIxN1xcdTUzMTY8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbj5cXHU4QkY0XFx1NjYwRTwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cXFwiZGF0YVJlbGF0aW9uWlRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwib3ZlcmZsb3cteDogaGlkZGVuXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiA2MzBweDtoZWlnaHQ6IDMzMHB4O2JvcmRlcjogI2RkZGRmMSAxcHggc29saWQ7Ym9yZGVyLXJhZGl1czogNHB4O3BhZGRpbmc6IDEwcHggMTBweCAxMHB4IDEwcHg7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cXFwibGlnaHQtZ3JheS10YWJsZVxcXCIgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGNlbGxzcGFjaW5nPVxcXCIwXFxcIiBib3JkZXI9XFxcIjBcXFwiIHYtaWY9XFxcInJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU2hvd1RhYmxlRWRpdERldGFpbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTclXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMzMlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTUlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMzUlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XFxcImxhYmVsXFxcIj5TaW5nbGVOYW1lXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiY3VycmVudEVkaXRvckRhdGEuc2luZ2xlTmFtZVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU2NzJDXFx1NTE3M1xcdTgwNTRcXHU0RTJEXFx1NzY4NFxcdTU1MkZcXHU0RTAwXFx1NTQwRFxcdTc5RjAsXFx1NTNFRlxcdTRFRTVcXHU0RTNBXFx1N0E3QVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XFxcImxhYmVsXFxcIj5QS0tleVxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCBwbGFjZWhvbGRlcj1cXFwiXFx1OUVEOFxcdThCQTRcXHU0RjdGXFx1NzUyOElkXFx1NUI1N1xcdTZCQjVcXFwiIHYtbW9kZWw9XFxcImN1cnJlbnRFZGl0b3JEYXRhLnBrRmllbGROYW1lXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgc3R5bGU9XFxcIndpZHRoOjE5OXB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHYtZm9yPVxcXCJpdGVtIGluIHJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFBLRGF0YVxcXCIgOnZhbHVlPVxcXCJpdGVtLmZpZWxkTmFtZVxcXCIgOmtleT1cXFwiaXRlbS5maWVsZE5hbWVcXFwiPnt7aXRlbS5maWVsZENhcHRpb259fTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciB2LWlmPVxcXCJyZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1N1YkVkaXRUclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XFxcImxhYmVsXFxcIj5cXHU2NTcwXFx1NjM2RVxcdTUxNzNcXHU3Q0ZCXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHYtbW9kZWw9XFxcImN1cnJlbnRFZGl0b3JEYXRhLnJlbGF0aW9uVHlwZVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiMVRvMVxcXCI+MToxPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCIxVG9OXFxcIj4xOk48L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVxcXCJsYWJlbFxcXCI+XFx1NjYyRlxcdTU0MjZcXHU0RkREXFx1NUI1OFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVxcXCJjdXJyZW50RWRpdG9yRGF0YS5pc1NhdmVcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcInRydWVcXFwiPlxcdTY2MkY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImZhbHNlXFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHYtaWY9XFxcInJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU3ViRWRpdFRyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cXFwibGFiZWxcXFwiPlxcdTY3MkNcXHU4RUFCXFx1NTE3M1xcdTgwNTRcXHU1QjU3XFx1NkJCNVxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XFxcIlxcdTlFRDhcXHU4QkE0XFx1NEY3RlxcdTc1MjhJZFxcdTVCNTdcXHU2QkI1XFxcIiB2LW1vZGVsPVxcXCJjdXJyZW50RWRpdG9yRGF0YS5zZWxmS2V5RmllbGROYW1lXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgc3R5bGU9XFxcIndpZHRoOjE5OXB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHYtZm9yPVxcXCJpdGVtIGluIHJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFNlbGZLZXlEYXRhXFxcIiA6dmFsdWU9XFxcIml0ZW0uZmllbGROYW1lXFxcIiA6a2V5PVxcXCJpdGVtLmZpZWxkTmFtZVxcXCI+e3tpdGVtLmZpZWxkQ2FwdGlvbn19PC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cXFwibGFiZWxcXFwiPlxcdTU5MTZcXHU4MDU0XFx1NUI1N1xcdTZCQjVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHBsYWNlaG9sZGVyPVxcXCJcXHU5RUQ4XFx1OEJBNFxcdTRGN0ZcXHU3NTI4SWRcXHU1QjU3XFx1NkJCNVxcXCIgdi1tb2RlbD1cXFwiY3VycmVudEVkaXRvckRhdGEub3V0ZXJLZXlGaWVsZE5hbWVcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBzdHlsZT1cXFwid2lkdGg6MTk5cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XFxcIml0ZW0gaW4gcmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsRm9yZWlnbktleURhdGFcXFwiIDp2YWx1ZT1cXFwiaXRlbS5maWVsZE5hbWVcXFwiIDprZXk9XFxcIml0ZW0uZmllbGROYW1lXFxcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XFxcImxhYmVsXFxcIj5EZXNjXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiM1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiY3VycmVudEVkaXRvckRhdGEuZGVzY1xcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY0XFx1NjYwRVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cXFwibGFiZWxcXFwiPlxcdTUyQTBcXHU4RjdEXFx1Njc2MVxcdTRFRjZcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3FsLWdlbmVyYWwtZGVzaWduLWNvbXAgcmVmPVxcXCJzcWxHZW5lcmFsRGVzaWduQ29tcFxcXCIgOnNxbERlc2lnbmVySGVpZ2h0PVxcXCI3NFxcXCIgdi1tb2RlbD1cXFwiY3VycmVudEVkaXRvckRhdGEuY29uZGl0aW9uXFxcIiA6c2hvd0ZpZWxkPVxcXCJ0cnVlXFxcIj48L3NxbC1nZW5lcmFsLWRlc2lnbi1jb21wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XFxcImRpdlNlbGVjdFRhYmxlXFxcIiB0aXRsZT1cXFwiXFx1OEJGN1xcdTkwMDlcXHU2MkU5XFx1ODg2OFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVxcXCJpbnB1dF9ib3JkZXJfYm90dG9tXFxcIiByZWY9XFxcInR4dF90YWJsZV9zZWFyY2hfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NVxcdTg4NjhcXHU1NDBEXFx1NjIxNlxcdTgwMDVcXHU2ODA3XFx1OTg5OFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHYtbW9kZWw9XFxcInNlbGVjdFRhYmxlVHJlZS5vbGRTZWxlY3RlZERCTGlua0lkXFxcIiBzbG90PVxcXCJwcmVwZW5kXFxcIiBzdHlsZT1cXFwid2lkdGg6IDI4MHB4XFxcIiBAb24tY2hhbmdlPVxcXCJjaGFuZ2VEQkxpbmtcXFwiIDpkaXNhYmxlZD1cXFwic2VsZWN0VGFibGVUcmVlLmRpc2FibGVkREJMaW5rXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIDp2YWx1ZT1cXFwiaXRlbS5kYklkXFxcIiB2LWZvcj1cXFwiaXRlbSBpbiBzZWxlY3RUYWJsZVRyZWUuZGJMaW5rRW50aXRpZXNcXFwiIDprZXk9XFxcIml0ZW0uZGJJZFxcXCI+e3tpdGVtLmRiTGlua05hbWV9fTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXG4gICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cXFwic2VsZWN0VGFibGVaVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWUgZGl2LWN1c3RvbS1zY3JvbGxcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6IDUwMHB4O292ZXJmbG93LXk6c2Nyb2xsO292ZXJmbG93LXg6aGlkZGVuXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImRlc2lnbi1odG1sLWVsZW0tbGlzdFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHt9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkZXNpZ24taHRtbC1lbGVtLWxpc3Qtd3JhcFwiPlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzaWduLWh0bWwtZWxlbS1saXN0LWl0ZW1cIj7moLzlvI/ljJY8L2Rpdj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2lnbi1odG1sLWVsZW0tbGlzdC1pdGVtXCI+6K+05piOPC9kaXY+XFxcbiAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJmZC1jb250cm9sLWJhc2UtaW5mb1wiLCB7XG4gIHByb3BzOiBbXCJ2YWx1ZVwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmFzZUluZm86IHtcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIHNlcmlhbGl6ZTogXCJcIixcbiAgICAgICAgbmFtZTogXCJcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcIlwiLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJcIixcbiAgICAgICAgY3VzdFJlYWRvbmx5OiBcIlwiLFxuICAgICAgICBjdXN0RGlzYWJsZWQ6IFwiXCIsXG4gICAgICAgIHN0eWxlOiBcIlwiLFxuICAgICAgICBkZXNjOiBcIlwiLFxuICAgICAgICBzdGF0dXM6IFwiXCIsXG4gICAgICAgIGdyb3VwTmFtZTogXCJcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgYmFzZUluZm86IGZ1bmN0aW9uIGJhc2VJbmZvKG5ld1ZhbCkge1xuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBuZXdWYWwpO1xuICAgIH0sXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKG5ld1ZhbCkge1xuICAgICAgdGhpcy5iYXNlSW5mbyA9IG5ld1ZhbDtcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5iYXNlSW5mbyA9IHRoaXMudmFsdWU7XG5cbiAgICBpZiAoIXRoaXMuYmFzZUluZm8uc3RhdHVzKSB7XG4gICAgICB0aGlzLmJhc2VJbmZvLnN0YXR1cyA9IFwiZW5hYmxlXCI7XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7fSxcbiAgdGVtcGxhdGU6IFwiPHRhYmxlIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclxcXCIgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGNlbGxzcGFjaW5nPVxcXCIwXFxcIiBib3JkZXI9XFxcIjBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxMDBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMjQwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDkwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEyMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA5MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+SURcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLmlkXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+U2VyaWFsaXplXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLnNlcmlhbGl6ZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJ0cnVlXFxcIj5cXHU2NjJGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImZhbHNlXFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1NDJGXFx1NzUyOFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5zdGF0dXNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiZW5hYmxlXFxcIj5cXHU2NjJGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImRpc2FibGVcXFwiPlxcdTU0MjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPk5hbWVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLm5hbWVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5DbGFzc05hbWVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLmNsYXNzTmFtZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlBsYWNlaG9sZGVyPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLnBsYWNlaG9sZGVyXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+UmVhZG9ubHlcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcIm1hcmdpbjogYXV0b1xcXCIgdi1tb2RlbD1cXFwiYmFzZUluZm8uY3VzdFJlYWRvbmx5XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcInJlYWRvbmx5XFxcIj5cXHU2NjJGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIm5vcmVhZG9ubHlcXFwiPlxcdTU0MjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPkRpc2FibGVkXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLmN1c3REaXNhYmxlZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJkaXNhYmxlZFxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJub2Rpc2FibGVkXFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5Hcm91cDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5ncm91cE5hbWVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU2ODM3XFx1NUYwRlxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cXFwiN1xcXCIgdi1tb2RlbD1cXFwiYmFzZUluZm8uc3R5bGVcXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1OTA3XFx1NkNFOFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cXFwiNVxcXCIgdi1tb2RlbD1cXFwiYmFzZUluZm8uZGVzY1xcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJmZC1jb250cm9sLWJpbmQtdG9cIiwge1xuICBwcm9wczogW1wiYmluZFRvRmllbGRQcm9wXCIsIFwiZGVmYXVsdFZhbHVlUHJvcFwiLCBcInZhbGlkYXRlUnVsZXNQcm9wXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBiaW5kVG9GaWVsZDoge1xuICAgICAgICByZWxhdGlvbklkOiBcIlwiLFxuICAgICAgICB0YWJsZUlkOiBcIlwiLFxuICAgICAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIixcbiAgICAgICAgZmllbGROYW1lOiBcIlwiLFxuICAgICAgICBmaWVsZENhcHRpb246IFwiXCIsXG4gICAgICAgIGZpZWxkRGF0YVR5cGU6IFwiXCIsXG4gICAgICAgIGZpZWxkTGVuZ3RoOiBcIlwiXG4gICAgICB9LFxuICAgICAgdmFsaWRhdGVSdWxlczoge1xuICAgICAgICBtc2c6IFwiXCIsXG4gICAgICAgIHJ1bGVzOiBbXVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRWYWx1ZToge1xuICAgICAgICBkZWZhdWx0VHlwZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiLFxuICAgICAgICBkZWZhdWx0VGV4dDogXCJcIlxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhOiB7XG4gICAgICAgIGRlZmF1bHREaXNwbGF5VGV4dDogXCJcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgYmluZFRvUHJvcDogZnVuY3Rpb24gYmluZFRvUHJvcChuZXdWYWx1ZSkge1xuICAgICAgY29uc29sZS5sb2cobmV3VmFsdWUpO1xuICAgIH0sXG4gICAgYmluZFRvRmllbGRQcm9wOiBmdW5jdGlvbiBiaW5kVG9GaWVsZFByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuYmluZFRvRmllbGQgPSBuZXdWYWx1ZTtcbiAgICB9LFxuICAgIGRlZmF1bHRWYWx1ZVByb3A6IGZ1bmN0aW9uIGRlZmF1bHRWYWx1ZVByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlKSkge1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dCh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSwgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdmFsaWRhdGVSdWxlc1Byb3A6IGZ1bmN0aW9uIHZhbGlkYXRlUnVsZXNQcm9wKG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLnZhbGlkYXRlUnVsZXMgPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5iaW5kVG9GaWVsZCA9IHRoaXMuYmluZFRvRmllbGRQcm9wO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgc2V0Q29tcGxldGVkOiBmdW5jdGlvbiBzZXRDb21wbGV0ZWQoKSB7XG4gICAgICB0aGlzLiRlbWl0KCdvbi1zZXQtY29tcGxldGVkJywgdGhpcy5iaW5kVG9GaWVsZCwgdGhpcy5kZWZhdWx0VmFsdWUsIHRoaXMudmFsaWRhdGVSdWxlcyk7XG4gICAgfSxcbiAgICBzZWxlY3RCaW5kRmllbGRWaWV3OiBmdW5jdGlvbiBzZWxlY3RCaW5kRmllbGRWaWV3KCkge1xuICAgICAgd2luZG93Ll9TZWxlY3RCaW5kT2JqID0gdGhpcztcbiAgICAgIHdpbmRvdy5wYXJlbnQuYXBwRm9ybS5zZWxlY3RCaW5kVG9TaW5nbGVGaWVsZERpYWxvZ0JlZ2luKHdpbmRvdywgdGhpcy5nZXRTZWxlY3RGaWVsZFJlc3VsdFZhbHVlKCkpO1xuICAgIH0sXG4gICAgc2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZShyZXN1bHQpIHtcbiAgICAgIHRoaXMuYmluZFRvRmllbGQgPSB7fTtcblxuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGROYW1lID0gcmVzdWx0LmZpZWxkTmFtZTtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUlkID0gcmVzdWx0LnRhYmxlSWQ7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVOYW1lID0gcmVzdWx0LnRhYmxlTmFtZTtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUNhcHRpb24gPSByZXN1bHQudGFibGVDYXB0aW9uO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbiA9IHJlc3VsdC5maWVsZENhcHRpb247XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGREYXRhVHlwZSA9IHJlc3VsdC5maWVsZERhdGFUeXBlO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkTGVuZ3RoID0gcmVzdWx0LmZpZWxkTGVuZ3RoO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnJlbGF0aW9uSWQgPSByZXN1bHQucmVsYXRpb25JZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGROYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUlkID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZU5hbWUgPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlQ2FwdGlvbiA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGRDYXB0aW9uID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZERhdGFUeXBlID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZExlbmd0aCA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQucmVsYXRpb25JZCA9IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0Q29tcGxldGVkKCk7XG4gICAgfSxcbiAgICBnZXRTZWxlY3RGaWVsZFJlc3VsdFZhbHVlOiBmdW5jdGlvbiBnZXRTZWxlY3RGaWVsZFJlc3VsdFZhbHVlKCkge1xuICAgICAgcmV0dXJuIEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHRoaXMuYmluZFRvRmllbGQpO1xuICAgIH0sXG4gICAgc2VsZWN0RGVmYXVsdFZhbHVlVmlldzogZnVuY3Rpb24gc2VsZWN0RGVmYXVsdFZhbHVlVmlldygpIHtcbiAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHRoaXM7XG4gICAgICB3aW5kb3cucGFyZW50LmFwcEZvcm0uc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nQmVnaW4od2luZG93LCBudWxsKTtcbiAgICB9LFxuICAgIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUgPSByZXN1bHQuVHlwZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFZhbHVlID0gcmVzdWx0LlZhbHVlO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCA9IHJlc3VsdC5UZXh0O1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dCh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSwgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUgPSBcIlwiO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VmFsdWUgPSBcIlwiO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMudGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0ID0gXCJcIjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcbiAgICB9LFxuICAgIHNlbGVjdFZhbGlkYXRlUnVsZVZpZXc6IGZ1bmN0aW9uIHNlbGVjdFZhbGlkYXRlUnVsZVZpZXcoKSB7XG4gICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB0aGlzO1xuICAgICAgd2luZG93LnBhcmVudC5hcHBGb3JtLnNlbGVjdFZhbGlkYXRlUnVsZURpYWxvZ0JlZ2luKHdpbmRvdywgdGhpcy5nZXRTZWxlY3RWYWxpZGF0ZVJ1bGVSZXN1bHRWYWx1ZSgpKTtcbiAgICB9LFxuICAgIHNldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBzZXRTZWxlY3RWYWxpZGF0ZVJ1bGVSZXN1bHRWYWx1ZShyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnZhbGlkYXRlUnVsZXMgPSByZXN1bHQ7XG4gICAgICAgIHRoaXMuc2V0Q29tcGxldGVkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZhbGlkYXRlUnVsZXMubXNnID0gXCJcIjtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVJ1bGVzLnJ1bGVzID0gW107XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRTZWxlY3RWYWxpZGF0ZVJ1bGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gZ2V0U2VsZWN0VmFsaWRhdGVSdWxlUmVzdWx0VmFsdWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZVJ1bGVzO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPHRhYmxlIGNlbGxwYWRkaW5nPVxcXCIwXFxcIiBjZWxsc3BhY2luZz1cXFwiMFxcXCIgYm9yZGVyPVxcXCIwXFxcIiBjbGFzcz1cXFwiaHRtbC1kZXNpZ24tcGx1Z2luLWRpYWxvZy10YWJsZS13cmFwZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxMDBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMjgwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU3RUQxXFx1NUI5QVxcdTUyMzBcXHU4ODY4PGJ1dHRvbiBjbGFzcz1cXFwiYnRuLXNlbGVjdCBmcmlnaHRcXFwiIHYtb246Y2xpY2s9XFxcInNlbGVjdEJpbmRGaWVsZFZpZXdcXFwiPi4uLjwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1ODg2OFxcdTdGMTZcXHU1M0Y3XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2JpbmRUb0ZpZWxkLnRhYmxlSWR9fTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU2NTcwXFx1NjM2RVxcdTZFOTBcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU4ODY4XFx1NTQwRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tiaW5kVG9GaWVsZC50YWJsZU5hbWV9fTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU4ODY4XFx1NjgwN1xcdTk4OThcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7YmluZFRvRmllbGQudGFibGVDYXB0aW9ufX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NUI1N1xcdTZCQjVcXHU1NDBEXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkTmFtZX19PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTVCNTdcXHU2QkI1XFx1NjgwN1xcdTk4OThcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7YmluZFRvRmllbGQuZmllbGRDYXB0aW9ufX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1N0M3QlxcdTU3OEJcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7YmluZFRvRmllbGQuZmllbGREYXRhVHlwZX19PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTk1N0ZcXHU1RUE2XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkTGVuZ3RofX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNFxcXCI+XFx1OUVEOFxcdThCQTRcXHU1MDNDPGJ1dHRvbiBjbGFzcz1cXFwiYnRuLXNlbGVjdCBmcmlnaHRcXFwiIHYtb246Y2xpY2s9XFxcInNlbGVjdERlZmF1bHRWYWx1ZVZpZXdcXFwiPi4uLjwvYnV0dG9uPjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XFxcImhlaWdodDogMzVweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI0XFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e3RlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dH19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTY4MjFcXHU5QThDXFx1ODlDNFxcdTUyMTk8YnV0dG9uIGNsYXNzPVxcXCJidG4tc2VsZWN0IGZyaWdodFxcXCIgdi1vbjpjbGljaz1cXFwic2VsZWN0VmFsaWRhdGVSdWxlVmlld1xcXCI+Li4uPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI0XFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxMDBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjtcXFwiPlxcdTYzRDBcXHU3OTNBXFx1NkQ4OFxcdTYwNkZcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e3ZhbGlkYXRlUnVsZXMubXNnfX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjtcXFwiPlxcdTlBOENcXHU4QkMxXFx1N0M3QlxcdTU3OEI8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJiYWNrZ3JvdW5kOiAjZThlYWVjO3RleHQtYWxpZ246IGNlbnRlcjtcXFwiPlxcdTUzQzJcXHU2NTcwPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHYtZm9yPVxcXCJydWxlSXRlbSBpbiB2YWxpZGF0ZVJ1bGVzLnJ1bGVzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwiYmFja2dyb3VuZDogI2ZmZmZmZjt0ZXh0LWFsaWduOiBjZW50ZXI7Y29sb3I6ICNhZDkzNjFcXFwiPnt7cnVsZUl0ZW0udmFsaWRhdGVUeXBlfX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJiYWNrZ3JvdW5kOiAjZmZmZmZmO3RleHQtYWxpZ246IGNlbnRlcjtcXFwiPjxwIHYtaWY9XFxcInJ1bGVJdGVtLnZhbGlkYXRlUGFyYXMgPT09ICcnXFxcIj5cXHU2NUUwXFx1NTNDMlxcdTY1NzA8L3A+PHAgdi1lbHNlPnt7cnVsZUl0ZW0udmFsaWRhdGVQYXJhc319PC9wPjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgICAgIDwvdGFibGU+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZmQtY29udHJvbC1kYXRhc291cmNlXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0RERHcm91cFRyZWVEYXRhOiBcIi9SZXN0L1N5c3RlbVNldHRpbmcvRGljdC9EaWN0aW9uYXJ5R3JvdXAvR2V0VHJlZURhdGFcIlxuICAgICAgfSxcbiAgICAgIGRkR3JvdXBUcmVlT2JqOiBudWxsLFxuICAgICAgZGRHcm91cFRyZWVTZXR0aW5nOiB7XG4gICAgICAgIGFzeW5jOiB7XG4gICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgIHVybDogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICBuYW1lOiBcImRpY3RHcm91cFRleHRcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgaWRLZXk6IFwiZGljdEdyb3VwSWRcIixcbiAgICAgICAgICAgIHBJZEtleTogXCJkaWN0R3JvdXBQYXJlbnRJZFwiLFxuICAgICAgICAgICAgcm9vdElkOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWREaWN0aW9uYXJ5R3JvdXAodHJlZU5vZGUuZGljdEdyb3VwSWQsIHRyZWVOb2RlLmRpY3RHcm91cFRleHQpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHtcbiAgICAgICAgICAgIGFwcExpc3QudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbm9ybWFsRGF0YVNvdXJjZToge1xuICAgICAgICBkZWZhdWx0SXNOdWxsOiBcInRydWVcIixcbiAgICAgICAgc3FsRGF0YVNvdXJjZTogXCJcIixcbiAgICAgICAgZGljdGlvbmFyeUdyb3VwRGF0YVNvdXJjZUlkOiBcIlwiLFxuICAgICAgICBkaWN0aW9uYXJ5R3JvdXBEYXRhU291cmNlVGV4dDogXCJcIixcbiAgICAgICAgcmVzdERhdGFTb3VyY2U6IFwiXCIsXG4gICAgICAgIGludGVyZmFjZURhdGFTb3VyY2U6IFwiXCIsXG4gICAgICAgIHN0YXRpY0RhdGFTb3VyY2U6IFwiXCIsXG4gICAgICAgIGRlZmF1bHRTZWxlY3RlZDogXCJcIixcbiAgICAgICAgbGF5b3V0RGlyZWN0aW9uOiBcInZlcnRpY2FsXCIsXG4gICAgICAgIHJvd051bTogXCIwXCIsXG4gICAgICAgIGRpc3BsYXlWYWx1ZUluVGV4dDogXCJmYWxzZVwiXG4gICAgICB9LFxuICAgICAgc2hvd1NlbGVjdERpY3Rpb25hcnk6IGZhbHNlLFxuICAgICAgc2hvd0VkaXRTdGF0aWM6IGZhbHNlLFxuICAgICAgc2hvd1Byb3A6IHRydWVcbiAgICB9O1xuICB9LFxuICB3YXRjaDoge30sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5pbml0RERHcm91cFRyZWUoKTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcbiAgICAgIHRoaXMubm9ybWFsRGF0YVNvdXJjZS5zcWxEYXRhU291cmNlID0gZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMubm9ybWFsRGF0YVNvdXJjZS5zcWxEYXRhU291cmNlKTtcbiAgICAgIHJldHVybiB0aGlzLm5vcm1hbERhdGFTb3VyY2U7XG4gICAgfSxcbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUob2xkVmFsdWUpIHtcbiAgICAgIHRoaXMubm9ybWFsRGF0YVNvdXJjZSA9IG9sZFZhbHVlO1xuICAgICAgdGhpcy5ub3JtYWxEYXRhU291cmNlLnNxbERhdGFTb3VyY2UgPSBkZWNvZGVVUklDb21wb25lbnQob2xkVmFsdWUuc3FsRGF0YVNvdXJjZSk7XG4gICAgICB0aGlzLiRyZWZzLnNxbEdlbmVyYWxEZXNpZ25Db21wLnNldFZhbHVlKHRoaXMubm9ybWFsRGF0YVNvdXJjZS5zcWxEYXRhU291cmNlKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0RGljdGlvbmFyeUdyb3VwOiBmdW5jdGlvbiBiZWdpblNlbGVjdERpY3Rpb25hcnlHcm91cCgpIHtcbiAgICAgIHRoaXMuc2hvd1NlbGVjdERpY3Rpb25hcnkgPSB0cnVlO1xuICAgICAgdGhpcy5zaG93UHJvcCA9IGZhbHNlO1xuICAgIH0sXG4gICAgc2VsZWN0ZWREaWN0aW9uYXJ5R3JvdXA6IGZ1bmN0aW9uIHNlbGVjdGVkRGljdGlvbmFyeUdyb3VwKGRpY3Rpb25hcnlHcm91cERhdGFTb3VyY2VJZCwgZGljdGlvbmFyeUdyb3VwRGF0YVNvdXJjZVRleHQpIHtcbiAgICAgIHRoaXMubm9ybWFsRGF0YVNvdXJjZS5kaWN0aW9uYXJ5R3JvdXBEYXRhU291cmNlSWQgPSBkaWN0aW9uYXJ5R3JvdXBEYXRhU291cmNlSWQ7XG4gICAgICB0aGlzLm5vcm1hbERhdGFTb3VyY2UuZGljdGlvbmFyeUdyb3VwRGF0YVNvdXJjZVRleHQgPSBkaWN0aW9uYXJ5R3JvdXBEYXRhU291cmNlVGV4dDtcbiAgICAgIHRoaXMuc2hvd1NlbGVjdERpY3Rpb25hcnkgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd1Byb3AgPSB0cnVlO1xuICAgIH0sXG4gICAgaW5pdERER3JvdXBUcmVlOiBmdW5jdGlvbiBpbml0RERHcm91cFRyZWUoKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0RERHcm91cFRyZWVEYXRhLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LmRhdGEgIT0gbnVsbCAmJiByZXN1bHQuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZGRHcm91cFRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiN6VHJlZVVMXCIpLCB0aGlzLmRkR3JvdXBUcmVlU2V0dGluZywgcmVzdWx0LmRhdGEpO1xuICAgICAgICAgIHRoaXMuZGRHcm91cFRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgICAgIHRoaXMuZGRHcm91cFRyZWVPYmouX2hvc3QgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHYtc2hvdz1cXFwic2hvd1Byb3BcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDI4MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU5RUQ4XFx1OEJBNFxcdTdBN0FcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiIHYtbW9kZWw9XFxcIm5vcm1hbERhdGFTb3VyY2UuZGVmYXVsdElzTnVsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcInRydWVcXFwiPlxcdTY2MkY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJmYWxzZVxcXCI+XFx1NTQyNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiMlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTgzQjdcXHU1M0Q2XFx1NjU3MFxcdTYzNkVcXHU2RTkwXFx1NEYxOFxcdTUxNDhcXHU3RUE3XFx1NTIyQi0+XFx1NjcyQ1xcdTU3MzBcXHU2M0E1XFx1NTNFMy0+UmVzdFxcdTYzQTVcXHU1M0UzLT5cXHU2NTcwXFx1NjM2RVxcdTVCNTdcXHU1MTc4LT5zcWwtPlxcdTk3NTlcXHU2MDAxXFx1NTAzQ1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUkVTVFxcdTY1NzBcXHU2MzZFXFx1NkU5MFxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHYtbW9kZWw9XFxcIm5vcm1hbERhdGFTb3VyY2UucmVzdERhdGFTb3VyY2VcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2NzJDXFx1NTczMFxcdTYzQTVcXHU1M0UzXFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgdi1tb2RlbD1cXFwibm9ybWFsRGF0YVNvdXJjZS5pbnRlcmZhY2VEYXRhU291cmNlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NjU3MFxcdTYzNkVcXHU1QjU3XFx1NTE3OFxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZmxlZnRcXFwiPlxcdTdFRDFcXHU1QjlBXFx1NjU3MFxcdTYzNkVcXHU1QjU3XFx1NTE3ODpcXHUzMDEwPHNwYW4gc3R5bGU9XFxcImNvbG9yOiByZWRcXFwiPnt7bm9ybWFsRGF0YVNvdXJjZS5kaWN0aW9uYXJ5R3JvdXBEYXRhU291cmNlVGV4dH19PC9zcGFuPlxcdTMwMTE8L2Rpdj48YnV0dG9uIGNsYXNzPVxcXCJidG4tc2VsZWN0IGZyaWdodFxcXCIgdi1vbjpjbGljaz1cXFwiYmVnaW5TZWxlY3REaWN0aW9uYXJ5R3JvdXBcXFwiPi4uLjwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCByb3dzcGFuPVxcXCIyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1FMXFx1NjU3MFxcdTYzNkVcXHU2RTkwXFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cXFwiY29sb3I6IHJlZFxcXCI+W0lURVhUXFx1NEUwRUlWQUxVRVxcdThCRjdcXHU0RjdGXFx1NzUyOFxcdTU5MjdcXHU1MTk5XTwvc3Bhbj5cXHU3OTNBXFx1NEY4QjpcXHUzMDEwU0VMRUNUICcxJyBJVEVYVCwnMicgSVZBTFVFXFx1MzAxMVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcWwtZ2VuZXJhbC1kZXNpZ24tY29tcCByZWY9XFxcInNxbEdlbmVyYWxEZXNpZ25Db21wXFxcIiA6c3FsLWRlc2lnbmVyLWhlaWdodD1cXFwiNzRcXFwiICB2LW1vZGVsPVxcXCJub3JtYWxEYXRhU291cmNlLnNxbERhdGFTb3VyY2VcXFwiPjwvc3FsLWdlbmVyYWwtZGVzaWduLWNvbXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU5NzU5XFx1NjAwMVxcdTUwM0NcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiM1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcImJ0bi1zZWxlY3QgZnJpZ2h0XFxcIj4uLi48L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTlFRDhcXHU4QkE0XFx1OTAwOVxcdTRFMkRcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJub3JtYWxEYXRhU291cmNlLmRlZmF1bHRTZWxlY3RlZFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NjYzRVxcdTc5M0FWYWx1ZVxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcIm1hcmdpbjogYXV0b1xcXCIgdi1tb2RlbD1cXFwibm9ybWFsRGF0YVNvdXJjZS5kaXNwbGF5VmFsdWVJblRleHRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJ0cnVlXFxcIj5cXHU2NjJGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiZmFsc2VcXFwiPlxcdTU0MjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NjVCOVxcdTU0MTFcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiIHYtbW9kZWw9XFxcIm5vcm1hbERhdGFTb3VyY2UubGF5b3V0RGlyZWN0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwidmVydGljYWxcXFwiPlxcdTU3ODJcXHU3NkY0PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiaG9yaXpvbnRhbFxcXCI+XFx1NkMzNFxcdTVFNzM8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU1MzU1XFx1NTIxN1xcdTRFMkFcXHU2NTcwXFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgdi1tb2RlbD1cXFwibm9ybWFsRGF0YVNvdXJjZS5yb3dOdW1cXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBuYW1lPVxcXCJzZWxlY3REaWN0aW9uYXJ5XFxcIiB2LXNob3c9XFxcInNob3dTZWxlY3REaWN0aW9uYXJ5XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XFxcInpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBuYW1lPVxcXCJzZWxlY3REaWN0aW9uYXJ5XFxcIiB2LXNob3c9XFxcInNob3dFZGl0U3RhdGljXFxcIj5cXHU3RjE2XFx1OEY5MVxcdTk3NTlcXHU2MDAxXFx1NTAzQzwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJmZC1jb250cm9sLWZpZWxkLWFuZC1hcGlcIiwge1xuICBwcm9wczogW1wiZm9ybUlkXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGFibGVEYXRhOiBbXSxcbiAgICAgIGFwaToge1xuICAgICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICAgIGdldEFQSURhdGE6IFwiL1Jlc3QvQnVpbGRlci9BcGlJdGVtL0dldEFQSVNGb3JaVHJlZU5vZGVMaXN0XCJcbiAgICAgICAgfSxcbiAgICAgICAgYXBpVHJlZU9iajogbnVsbCxcbiAgICAgICAgYXBpVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIF9zZWxmLmFwaS5hcGlTZWxlY3REYXRhID0gdHJlZU5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhcGlEYXRhOiBudWxsLFxuICAgICAgICBhcGlTZWxlY3REYXRhOiBudWxsLFxuICAgICAgICBlZGl0VGFibGVPYmplY3Q6IG51bGwsXG4gICAgICAgIGVkaXRUYWJsZUNvbmZpZzoge1xuICAgICAgICAgIFN0YXR1czogXCJFZGl0XCIsXG4gICAgICAgICAgQWRkQWZ0ZXJSb3dFdmVudDogbnVsbCxcbiAgICAgICAgICBEYXRhRmllbGQ6IFwiZmllbGROYW1lXCIsXG4gICAgICAgICAgVGVtcGxhdGVzOiBbe1xuICAgICAgICAgICAgVGl0bGU6IFwiQVBJ5ZCN56ewXCIsXG4gICAgICAgICAgICBCaW5kTmFtZTogXCJ2YWx1ZVwiLFxuICAgICAgICAgICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX0xhYmVsXCIsXG4gICAgICAgICAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgICAgICAgICBGb3JtYXRlcjogZnVuY3Rpb24gRm9ybWF0ZXIodmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9zZWxmLmdldEFQSVRleHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFRpdGxlOiBcIuiwg+eUqOmhuuW6j1wiLFxuICAgICAgICAgICAgQmluZE5hbWU6IFwicnVuVGltZVwiLFxuICAgICAgICAgICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX1NlbGVjdFwiLFxuICAgICAgICAgICAgQ2xpZW50RGF0YVNvdXJjZTogW3tcbiAgICAgICAgICAgICAgXCJUZXh0XCI6IFwi5LmL5YmNXCIsXG4gICAgICAgICAgICAgIFwiVmFsdWVcIjogXCLkuYvliY1cIlxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBcIlRleHRcIjogXCLkuYvlkI5cIixcbiAgICAgICAgICAgICAgXCJWYWx1ZVwiOiBcIuS5i+WQjlwiXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIFdpZHRoOiAxMDBcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBSb3dJZENyZWF0ZXI6IGZ1bmN0aW9uIFJvd0lkQ3JlYXRlcigpIHt9LFxuICAgICAgICAgIFRhYmxlQ2xhc3M6IFwiZWRpdC10YWJsZVwiLFxuICAgICAgICAgIFJlbmRlcmVyVG86IFwiYXBpQ29udGFpbmVyXCIsXG4gICAgICAgICAgVGFibGVJZDogXCJhcGlDb250YWluZXJUYWJsZVwiLFxuICAgICAgICAgIFRhYmxlQXR0cnM6IHtcbiAgICAgICAgICAgIGNlbGxwYWRkaW5nOiBcIjFcIixcbiAgICAgICAgICAgIGNlbGxzcGFjaW5nOiBcIjFcIixcbiAgICAgICAgICAgIGJvcmRlcjogXCIxXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmaWVsZDoge1xuICAgICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICAgIGdldERhdGFTZXRNYWluVGFibGVGaWVsZHM6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU2V0L0RhdGFzZXRSZWxhdGVkVGFibGUvR2V0RGF0YVNldE1haW5UYWJsZUZpZWxkc1wiXG4gICAgICAgIH0sXG4gICAgICAgIGVkaXRUYWJsZU9iamVjdDogbnVsbCxcbiAgICAgICAgZWRpdFRhYmxlQ29uZmlnOiB7XG4gICAgICAgICAgU3RhdHVzOiBcIkVkaXRcIixcbiAgICAgICAgICBBZGRBZnRlclJvd0V2ZW50OiBudWxsLFxuICAgICAgICAgIERhdGFGaWVsZDogXCJmaWVsZE5hbWVcIixcbiAgICAgICAgICBUZW1wbGF0ZXM6IFt7XG4gICAgICAgICAgICBUaXRsZTogXCLooajlkI3moIfpophcIixcbiAgICAgICAgICAgIEJpbmROYW1lOiBcInRhYmxlTmFtZVwiLFxuICAgICAgICAgICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX0xhYmVsXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBUaXRsZTogXCLlrZfmrrXmoIfpophcIixcbiAgICAgICAgICAgIEJpbmROYW1lOiBcImZpZWxkTmFtZVwiLFxuICAgICAgICAgICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX1NlbGVjdFwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgVGl0bGU6IFwi6buY6K6k5YC8XCIsXG4gICAgICAgICAgICBCaW5kTmFtZTogXCJkZWZhdWx0VmFsdWVcIixcbiAgICAgICAgICAgIFJlbmRlcmVyOiBcIkVkaXRUYWJsZV9TZWxlY3REZWZhdWx0VmFsdWVcIixcbiAgICAgICAgICAgIEhpZGRlbjogZmFsc2VcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBSb3dJZENyZWF0ZXI6IGZ1bmN0aW9uIFJvd0lkQ3JlYXRlcigpIHt9LFxuICAgICAgICAgIFRhYmxlQ2xhc3M6IFwiZWRpdC10YWJsZVwiLFxuICAgICAgICAgIFJlbmRlcmVyVG86IFwiZmllbGRDb250YWluZXJcIixcbiAgICAgICAgICBUYWJsZUlkOiBcImZpZWxkQ29udGFpbmVyVGFibGVcIixcbiAgICAgICAgICBUYWJsZUF0dHJzOiB7XG4gICAgICAgICAgICBjZWxscGFkZGluZzogXCIxXCIsXG4gICAgICAgICAgICBjZWxsc3BhY2luZzogXCIxXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb2xkRm9ybUlkOiBcIlwiXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgcmVhZHk6IGZ1bmN0aW9uIHJlYWR5KGRhdGFTZXRJZCwgdGFibGVJZCkge1xuICAgICAgdGhpcy5kYXRhU2V0SWQgPSBkYXRhU2V0SWQ7XG4gICAgICB0aGlzLnRhYmxlSWQgPSB0YWJsZUlkO1xuICAgICAgdGhpcy5iaW5kVGFibGVGaWVsZHMobnVsbCk7XG4gICAgICB0aGlzLmJpbmRBUElUcmVlQW5kSW5pdEVkaXRUYWJsZShudWxsKTtcbiAgICB9LFxuICAgIGdldEpzb246IGZ1bmN0aW9uIGdldEpzb24oKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuQ29tcGxldGVkRWRpdGluZ1JvdygpO1xuICAgICAgcmVzdWx0LmFwaXMgPSB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuR2V0U2VyaWFsaXplSnNvbigpO1xuICAgICAgdGhpcy5maWVsZC5lZGl0VGFibGVPYmplY3QuQ29tcGxldGVkRWRpdGluZ1JvdygpO1xuICAgICAgcmVzdWx0LmZpZWxkcyA9IHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkdldFNlcmlhbGl6ZUpzb24oKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbiBzZXREYXRhKGFwaU9sZERhdGEsIGZpbGVkT2xkRGF0YSkge1xuICAgICAgaWYgKGFwaU9sZERhdGEpIHtcbiAgICAgICAgdGhpcy5hcGkuZWRpdFRhYmxlT2JqZWN0LkxvYWRKc29uRGF0YShhcGlPbGREYXRhKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVkT2xkRGF0YSkge1xuICAgICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdC5Mb2FkSnNvbkRhdGEoZmlsZWRPbGREYXRhKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZShkaWFsb2dFbGVtKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzW2RpYWxvZ0VsZW1dKTtcbiAgICB9LFxuICAgIGJpbmRUYWJsZUZpZWxkczogZnVuY3Rpb24gYmluZFRhYmxlRmllbGRzKG9sZERhdGEpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5maWVsZC5hY0ludGVyZmFjZS5nZXREYXRhU2V0TWFpblRhYmxlRmllbGRzLCB7XG4gICAgICAgIGRhdGFTZXRJZDogdGhpcy5kYXRhU2V0SWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgdmFyIGZpZWxkc0RhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZmllbGRzRGF0YS5wdXNoKHtcbiAgICAgICAgICAgIFZhbHVlOiByZXN1bHQuZGF0YVtpXS5maWVsZE5hbWUsXG4gICAgICAgICAgICBUZXh0OiByZXN1bHQuZGF0YVtpXS5maWVsZENhcHRpb25cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlQ29uZmlnLlRlbXBsYXRlc1swXS5EZWZhdWx0VmFsdWUgPSB7XG4gICAgICAgICAgVHlwZTogXCJDb25zdFwiLFxuICAgICAgICAgIFZhbHVlOiByZXN1bHQuZGF0YVswXS50YWJsZU5hbWVcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maWVsZC5lZGl0VGFibGVDb25maWcuVGVtcGxhdGVzWzFdLkNsaWVudERhdGFTb3VyY2UgPSBmaWVsZHNEYXRhO1xuXG4gICAgICAgIGlmICghdGhpcy5maWVsZC5lZGl0VGFibGVPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdCA9IE9iamVjdC5jcmVhdGUoRWRpdFRhYmxlKTtcbiAgICAgICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdC5Jbml0aWFsaXphdGlvbih0aGlzLmZpZWxkLmVkaXRUYWJsZUNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9sZEZvcm1JZCA9IHRoaXMuZm9ybUlkO1xuXG4gICAgICAgIGlmIChvbGREYXRhKSB7XG4gICAgICAgICAgdGhpcy5maWVsZC5lZGl0VGFibGVPYmplY3QuTG9hZEpzb25EYXRhKG9sZERhdGEpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcblxuICAgICAgaWYgKHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LlJlbW92ZUFsbFJvdygpO1xuICAgICAgfVxuXG4gICAgICBpZiAob2xkRGF0YSAmJiB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdCkge1xuICAgICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdC5Mb2FkSnNvbkRhdGEob2xkRGF0YSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRGaWVsZDogZnVuY3Rpb24gYWRkRmllbGQoKSB7XG4gICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdC5BZGRFZGl0aW5nUm93QnlUZW1wbGF0ZSgpO1xuICAgIH0sXG4gICAgcmVtb3ZlRmllbGQ6IGZ1bmN0aW9uIHJlbW92ZUZpZWxkKCkge1xuICAgICAgdGhpcy5maWVsZC5lZGl0VGFibGVPYmplY3QuUmVtb3ZlUm93KCk7XG4gICAgfSxcbiAgICBhZGRJbm5lckZvcm1DbG9zZUJ1dHRvbjogZnVuY3Rpb24gYWRkSW5uZXJGb3JtQ2xvc2VCdXR0b24oKSB7XG4gICAgICB2YXIgY2xvc2VCdXR0b25EYXRhID0ge1xuICAgICAgICBjYXB0aW9uOiBcIuWFs+mXrVwiLFxuICAgICAgICBpZDogXCJpbm5lcl9jbG9zZV9idXR0b25fXCIgKyBTdHJpbmdVdGlsaXR5LlRpbWVzdGFtcCgpLFxuICAgICAgICBidXR0b25UeXBlOiBcIuWFs+mXreaMiemSrlwiXG4gICAgICB9O1xuICAgICAgdGhpcy50YWJsZURhdGEucHVzaChjbG9zZUJ1dHRvbkRhdGEpO1xuICAgIH0sXG4gICAgYmluZEFQSVRyZWVBbmRJbml0RWRpdFRhYmxlOiBmdW5jdGlvbiBiaW5kQVBJVHJlZUFuZEluaXRFZGl0VGFibGUob2xkRGF0YSkge1xuICAgICAgaWYgKCF0aGlzLmFwaS5hcGlEYXRhKSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hcGkuYWNJbnRlcmZhY2UuZ2V0QVBJRGF0YSwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuYXBpLmFwaURhdGEgPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdC5kYXRhICE9IG51bGwgJiYgcmVzdWx0LmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5kYXRhW2ldLm5vZGVUeXBlTmFtZSA9PSBcIkdyb3VwXCIpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhW2ldLmljb24gPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvVGhlbWVzL1BuZzE2WDE2L3BhY2thZ2UucG5nXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhW2ldLmljb24gPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvVGhlbWVzL1BuZzE2WDE2L2FwcGxpY2F0aW9uX3ZpZXdfY29sdW1ucy5wbmdcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hcGkuYXBpVHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI2FwaVpUcmVlVUxcIiksIHRoaXMuYXBpLmFwaVRyZWVTZXR0aW5nLCByZXN1bHQuZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmFwaS5hcGlUcmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgICAgIGZ1enp5U2VhcmNoVHJlZU9iaih0aGlzLmFwaS5hcGlUcmVlT2JqLCB0aGlzLiRyZWZzLnR4dF9zZWFyY2hfYXBpX3RleHQuJHJlZnMuaW5wdXQsIG51bGwsIHRydWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuYXBpLmVkaXRUYWJsZU9iamVjdCA9IE9iamVjdC5jcmVhdGUoRWRpdFRhYmxlKTtcbiAgICAgICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuSW5pdGlhbGl6YXRpb24odGhpcy5hcGkuZWRpdFRhYmxlQ29uZmlnKTtcbiAgICAgICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuUmVtb3ZlQWxsUm93KCk7XG5cbiAgICAgICAgICBpZiAob2xkRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5hcGkuZWRpdFRhYmxlT2JqZWN0LkxvYWRKc29uRGF0YShvbGREYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0QXBpQ29uZmlnQW5kQmluZFRvVGFibGU6IGZ1bmN0aW9uIGdldEFwaUNvbmZpZ0FuZEJpbmRUb1RhYmxlKCkge1xuICAgICAgcmV0dXJuO1xuXG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYXBpLmFjSW50ZXJmYWNlLmdldEJ1dHRvbkFwaUNvbmZpZywge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgdmFyIGFwaVNlbGVjdERhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGdyb3VwID0ge1xuICAgICAgICAgICAgR3JvdXA6IHJlc3VsdC5kYXRhW2ldLm5hbWVcbiAgICAgICAgICB9O1xuICAgICAgICAgIHZhciBvcHRpb25zID0gW107XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlc3VsdC5kYXRhW2ldLmJ1dHRvbkFQSVZvTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgVmFsdWU6IHJlc3VsdC5kYXRhW2ldLmJ1dHRvbkFQSVZvTGlzdFtqXS5pZCxcbiAgICAgICAgICAgICAgVGV4dDogcmVzdWx0LmRhdGFbaV0uYnV0dG9uQVBJVm9MaXN0W2pdLm5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGdyb3VwW1wiT3B0aW9uc1wiXSA9IG9wdGlvbnM7XG4gICAgICAgICAgYXBpU2VsZWN0RGF0YS5wdXNoKGdyb3VwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9zZWxmLmFwaS5lZGl0VGFibGVDb25maWcuVGVtcGxhdGVzWzBdLkNsaWVudERhdGFTb3VyY2UgPSBhcGlTZWxlY3REYXRhO1xuICAgICAgICBfc2VsZi5hcGkuZWRpdFRhYmxlT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZShFZGl0VGFibGUpO1xuXG4gICAgICAgIF9zZWxmLmFwaS5lZGl0VGFibGVPYmplY3QuSW5pdGlhbGl6YXRpb24oX3NlbGYuYXBpLmVkaXRUYWJsZUNvbmZpZyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGFkZEFQSTogZnVuY3Rpb24gYWRkQVBJKCkge1xuICAgICAgaWYgKHRoaXMuYXBpLmFwaVNlbGVjdERhdGEubm9kZVR5cGVOYW1lID09IFwiQVBJXCIpIHtcbiAgICAgICAgdGhpcy5hcGkuZWRpdFRhYmxlT2JqZWN0LkFkZEVkaXRpbmdSb3dCeVRlbXBsYXRlKFtdLCB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMuYXBpLmFwaVNlbGVjdERhdGEudmFsdWUsXG4gICAgICAgICAgcnVuVGltZTogXCLkuYvlkI5cIlxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+36YCJ5oup6ZyA6KaB5re75Yqg55qEQVBJIVwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZUFQSTogZnVuY3Rpb24gcmVtb3ZlQVBJKCkge1xuICAgICAgdGhpcy5hcGkuZWRpdFRhYmxlT2JqZWN0LlJlbW92ZVJvdygpO1xuICAgIH0sXG4gICAgY2xlYXJBUEk6IGZ1bmN0aW9uIGNsZWFyQVBJKCkge1xuICAgICAgdGhpcy5hcGkuZWRpdFRhYmxlT2JqZWN0LlJlbW92ZUFsbFJvdygpO1xuICAgIH0sXG4gICAgZ2V0QVBJVGV4dDogZnVuY3Rpb24gZ2V0QVBJVGV4dCh2YWx1ZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFwaS5hcGlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmFwaS5hcGlEYXRhW2ldLm5vZGVUeXBlTmFtZSA9PSBcIkFQSVwiKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYXBpLmFwaURhdGFbaV0udmFsdWUgPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwaS5hcGlEYXRhW2ldLnRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz1cXFwiaXYtbGlzdC1wYWdlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OiBsZWZ0O3dpZHRoOiA5NCVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVxcXCJmaWVsZENvbnRhaW5lclxcXCIgY2xhc3M9XFxcImVkaXQtdGFibGUtd3JhcFxcXCIgc3R5bGU9XFxcImhlaWdodDogMTgwcHg7b3ZlcmZsb3c6IGF1dG87d2lkdGg6IDk4JTttYXJnaW46IGF1dG9cXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogcmlnaHQ7d2lkdGg6IDUlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cCB2ZXJ0aWNhbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBzaXplPVxcXCJzbWFsbFxcXCIgdHlwZT1cXFwic3VjY2Vzc1xcXCIgaWNvbj1cXFwibWQtYWRkXFxcIiBAY2xpY2s9XFxcImFkZEZpZWxkXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHNpemU9XFxcInNtYWxsXFxcIiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCIgQGNsaWNrPVxcXCJyZW1vdmVGaWVsZFxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDMyMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDYwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcImJhY2tncm91bmQ6ICNmZmZmZmZcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XFxcImlucHV0X2JvcmRlcl9ib3R0b21cXFwiIHJlZj1cXFwidHh0X3NlYXJjaF9hcGlfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NUFQSVxcdTU0MERcXHU3OUYwXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cXFwiYXBpWlRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OiAyNjBweDtvdmVyZmxvdzogYXV0b1xcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyO2JhY2tncm91bmQtY29sb3I6ICNmOGY4ZjhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwIHZlcnRpY2FsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHNpemU9XFxcInNtYWxsXFxcIiB0eXBlPVxcXCJzdWNjZXNzXFxcIiBpY29uPVxcXCJtZC1hZGRcXFwiIEBjbGljaz1cXFwiYWRkQVBJXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHNpemU9XFxcInNtYWxsXFxcIiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCIgQGNsaWNrPVxcXCJyZW1vdmVBUElcXFwiPjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gc2l6ZT1cXFwic21hbGxcXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcImlvcy10cmFzaFxcXCIgQGNsaWNrPVxcXCJjbGVhckFQSVxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcImJhY2tncm91bmQ6ICNmZmZmZmY7XFxcIiB2YWxpZ249XFxcInRvcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XFxcImFwaUNvbnRhaW5lclxcXCIgY2xhc3M9XFxcImVkaXQtdGFibGUtd3JhcFxcXCIgc3R5bGU9XFxcImhlaWdodDogMjYwcHg7b3ZlcmZsb3c6IGF1dG87d2lkdGg6IDk4JTttYXJnaW46IGF1dG9cXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZmQtY29udHJvbC1zZWxlY3QtYmluZC10by1zaW5nbGUtZmllbGQtZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlc0RhdGFVcmw6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGb3JaVHJlZU5vZGVMaXN0XCIsXG4gICAgICAgIGdldFRhYmxlRmllbGRzRGF0YVVybDogXCIvUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlRmllbGRzQnlUYWJsZUlkXCIsXG4gICAgICAgIGdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHM6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzXCJcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZERhdGE6IHtcbiAgICAgICAgcmVsYXRpb25JZDogXCJcIixcbiAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgdGFibGVOYW1lOiBcIlwiLFxuICAgICAgICB0YWJsZUNhcHRpb246IFwiXCIsXG4gICAgICAgIGZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgZmllbGRDYXB0aW9uOiBcIlwiLFxuICAgICAgICBmaWVsZERhdGFUeXBlOiBcIlwiLFxuICAgICAgICBmaWVsZExlbmd0aDogXCJcIlxuICAgICAgfSxcbiAgICAgIHRhYmxlVHJlZToge1xuICAgICAgICB0YWJsZVRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRhYmxlVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiZGlzcGxheVRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEudGFibGVJZCA9IHRyZWVOb2RlLnRhYmxlSWQ7XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS50YWJsZU5hbWUgPSB0cmVlTm9kZS50YWJsZU5hbWU7XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS50YWJsZUNhcHRpb24gPSB0cmVlTm9kZS50YWJsZUNhcHRpb247XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS5maWVsZE5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEuZmllbGRDYXB0aW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWREYXRhLmZpZWxkRGF0YVR5cGUgPSBcIlwiO1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEuZmllbGRMZW5ndGggPSBcIlwiO1xuICAgICAgICAgICAgICBfc2VsZi5maWVsZFRhYmxlLmZpZWxkRGF0YSA9IFtdO1xuXG4gICAgICAgICAgICAgIF9zZWxmLmZpbHRlckFsbEZpZWxkc1RvVGFibGUoX3NlbGYuc2VsZWN0ZWREYXRhLnRhYmxlSWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9LFxuICAgICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVRyZWVEYXRhOiBudWxsLFxuICAgICAgICBzZWxlY3RlZFRhYmxlTmFtZTogXCLml6BcIlxuICAgICAgfSxcbiAgICAgIGZpZWxkVGFibGU6IHtcbiAgICAgICAgZmllbGREYXRhOiBbXSxcbiAgICAgICAgdGFibGVIZWlnaHQ6IDQ3MCxcbiAgICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgICB0aXRsZTogJyAnLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICBrZXk6ICdpc1NlbGVjdGVkVG9CaW5kJyxcbiAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMucm93LmlzU2VsZWN0ZWRUb0JpbmQgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0LXJvdy1idXR0b24gc2VsZWN0ZWRcIlxuICAgICAgICAgICAgICB9KV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiXCJcbiAgICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICflkI3np7AnLFxuICAgICAgICAgIGtleTogJ2ZpZWxkTmFtZScsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5qCH6aKYJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZENhcHRpb24nLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgb2xkUmVsYXRpb25EYXRhU3RyaW5nOiBcIlwiLFxuICAgICAgcmVsYXRpb25EYXRhOiBudWxsLFxuICAgICAgYWxsRmllbGRzOiBudWxsLFxuICAgICAgb2xkQmluZEZpZWxkRGF0YTogbnVsbFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdChyZWxhdGlvbkRhdGEsIG9sZEJpbmRGaWVsZERhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwi5YWz6IGU6KGo5pWw5o2u77yaXCIpO1xuICAgICAgY29uc29sZS5sb2cocmVsYXRpb25EYXRhKTtcbiAgICAgIGNvbnNvbGUubG9nKFwi5bey57uP57uR5a6a5LqG55qE5pWw5o2u77yaXCIpO1xuICAgICAgY29uc29sZS5sb2cob2xkQmluZEZpZWxkRGF0YSk7XG5cbiAgICAgIGlmIChyZWxhdGlvbkRhdGEgPT0gbnVsbCB8fCByZWxhdGlvbkRhdGEgPT0gXCJcIiB8fCByZWxhdGlvbkRhdGEubGVuZ3RoID09IDApIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7flhYjorr7nva7ooajljZXnmoTmlbDmja7lhbPogZTvvIFcIik7XG4gICAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5mZENvbnRyb2xTZWxlY3RCaW5kVG9TaW5nbGVGaWVsZERpYWxvZ1dyYXA7XG4gICAgICB2YXIgaGVpZ2h0ID0gNDUwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICB3aWR0aDogOTgwLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nnu5HlrprlrZfmrrVcIlxuICAgICAgfSk7XG4gICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgICB0aGlzLm9sZEJpbmRGaWVsZERhdGEgPSBvbGRCaW5kRmllbGREYXRhO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEgPSBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZShvbGRCaW5kRmllbGREYXRhKTtcblxuICAgICAgaWYgKEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhyZWxhdGlvbkRhdGEpICE9IHRoaXMub2xkUmVsYXRpb25EYXRhU3RyaW5nKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVsYXRpb25EYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgcmVsYXRpb25EYXRhW2ldLmRpc3BsYXlUZXh0ID0gcmVsYXRpb25EYXRhW2ldLnRhYmxlTmFtZSArIFwiW1wiICsgcmVsYXRpb25EYXRhW2ldLnRhYmxlQ2FwdGlvbiArIFwiXShcIiArIHJlbGF0aW9uRGF0YVtpXS5yZWxhdGlvblR5cGUgKyBcIilcIjtcblxuICAgICAgICAgIGlmIChyZWxhdGlvbkRhdGFbaV0ucGFyZW50SWQgPT0gXCItMVwiKSB7XG4gICAgICAgICAgICByZWxhdGlvbkRhdGFbaV0uZGlzcGxheVRleHQgPSByZWxhdGlvbkRhdGFbaV0udGFibGVOYW1lICsgXCJbXCIgKyByZWxhdGlvbkRhdGFbaV0udGFibGVDYXB0aW9uICsgXCJdXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVsYXRpb25EYXRhW2ldLmljb24gPSBcIi4uLy4uLy4uL1RoZW1lcy9QbmcxNlgxNi90YWJsZS5wbmdcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFibGVUcmVlLnRhYmxlVHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI3RhYmxlWlRyZWVVTFwiKSwgdGhpcy50YWJsZVRyZWUudGFibGVUcmVlU2V0dGluZywgcmVsYXRpb25EYXRhKTtcbiAgICAgICAgdGhpcy50YWJsZVRyZWUudGFibGVUcmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgdGhpcy5vbGRSZWxhdGlvbkRhdGFTdHJpbmcgPSBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcocmVsYXRpb25EYXRhKTtcbiAgICAgICAgdGhpcy5yZWxhdGlvbkRhdGEgPSByZWxhdGlvbkRhdGE7XG4gICAgICAgIHRoaXMuZ2V0QWxsVGFibGVzRmllbGRzKHJlbGF0aW9uRGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0RmllbGRUb1NlbGVjdGVkU3RhdHVzKHRoaXMuYWxsRmllbGRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9sZEJpbmRGaWVsZERhdGEgJiYgb2xkQmluZEZpZWxkRGF0YS50YWJsZUlkICYmIG9sZEJpbmRGaWVsZERhdGEudGFibGVJZCAhPSBcIlwiKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZE5vZGUgPSB0aGlzLnRhYmxlVHJlZS50YWJsZVRyZWVPYmouZ2V0Tm9kZUJ5UGFyYW0oXCJ0YWJsZUlkXCIsIG9sZEJpbmRGaWVsZERhdGEudGFibGVJZCk7XG4gICAgICAgIHRoaXMudGFibGVUcmVlLnRhYmxlVHJlZU9iai5zZWxlY3ROb2RlKHNlbGVjdGVkTm9kZSwgZmFsc2UsIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXRGaWVsZFRvU2VsZWN0ZWRTdGF0dXM6IGZ1bmN0aW9uIHJlc2V0RmllbGRUb1NlbGVjdGVkU3RhdHVzKF9hbGxGaWVsZHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5maWVsZFRhYmxlLmZpZWxkRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmZpZWxkVGFibGUuZmllbGREYXRhW2ldLmlzU2VsZWN0ZWRUb0JpbmQgPSBcIjBcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKF9hbGxGaWVsZHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfYWxsRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgX2FsbEZpZWxkc1tpXS5pc1NlbGVjdGVkVG9CaW5kID0gXCIwXCI7XG5cbiAgICAgICAgICBpZiAoX2FsbEZpZWxkc1tpXS5maWVsZFRhYmxlSWQgPT0gdGhpcy5vbGRCaW5kRmllbGREYXRhLnRhYmxlSWQpIHtcbiAgICAgICAgICAgIGlmIChfYWxsRmllbGRzW2ldLmZpZWxkTmFtZSA9PSB0aGlzLm9sZEJpbmRGaWVsZERhdGEuZmllbGROYW1lKSB7XG4gICAgICAgICAgICAgIF9hbGxGaWVsZHNbaV0uaXNTZWxlY3RlZFRvQmluZCA9IFwiMVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWxsRmllbGRzID0gX2FsbEZpZWxkcztcbiAgICAgIH1cblxuICAgICAgdGhpcy5maWx0ZXJBbGxGaWVsZHNUb1RhYmxlKHRoaXMub2xkQmluZEZpZWxkRGF0YS50YWJsZUlkKTtcbiAgICB9LFxuICAgIGdldEFsbFRhYmxlc0ZpZWxkczogZnVuY3Rpb24gZ2V0QWxsVGFibGVzRmllbGRzKHJlbGF0aW9uRGF0YSkge1xuICAgICAgdmFyIHRhYmxlSWRzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVsYXRpb25EYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRhYmxlSWRzLnB1c2gocmVsYXRpb25EYXRhW2ldLnRhYmxlSWQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVzRmllbGRzQnlUYWJsZUlkcywge1xuICAgICAgICBcInRhYmxlSWRzXCI6IHRhYmxlSWRzXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIHZhciBhbGxGaWVsZHMgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB2YXIgc2luZ2xlVGFibGUgPSByZXN1bHQuZXhLVkRhdGEuVGFibGVzWzBdO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwi6YeN5paw6I635Y+W5pWw5o2uXCIpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGFsbEZpZWxkcyk7XG5cbiAgICAgICAgICBfc2VsZi5yZXNldEZpZWxkVG9TZWxlY3RlZFN0YXR1cyhhbGxGaWVsZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgZmlsdGVyQWxsRmllbGRzVG9UYWJsZTogZnVuY3Rpb24gZmlsdGVyQWxsRmllbGRzVG9UYWJsZSh0YWJsZUlkKSB7XG4gICAgICBpZiAodGFibGVJZCkge1xuICAgICAgICB2YXIgZmllbGRzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFsbEZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLmFsbEZpZWxkc1tpXS5maWVsZFRhYmxlSWQgPT0gdGFibGVJZCkge1xuICAgICAgICAgICAgZmllbGRzLnB1c2godGhpcy5hbGxGaWVsZHNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmllbGRUYWJsZS5maWVsZERhdGEgPSBmaWVsZHM7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZmllbGRUYWJsZS5maWVsZERhdGEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2VsZWN0ZWRGaWVsZDogZnVuY3Rpb24gc2VsZWN0ZWRGaWVsZChzZWxlY3Rpb24sIGluZGV4KSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YS5maWVsZE5hbWUgPSBzZWxlY3Rpb24uZmllbGROYW1lO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEuZmllbGRDYXB0aW9uID0gc2VsZWN0aW9uLmZpZWxkQ2FwdGlvbjtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLmZpZWxkRGF0YVR5cGUgPSBzZWxlY3Rpb24uZmllbGREYXRhVHlwZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLmZpZWxkTGVuZ3RoID0gc2VsZWN0aW9uLmZpZWxkRGF0YUxlbmd0aDtcbiAgICAgIHZhciBzZWxlY3RlZE5vZGUgPSB0aGlzLnRhYmxlVHJlZS50YWJsZVRyZWVPYmouZ2V0Tm9kZUJ5UGFyYW0oXCJ0YWJsZUlkXCIsIHNlbGVjdGlvbi5maWVsZFRhYmxlSWQpO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEudGFibGVJZCA9IHNlbGVjdGVkTm9kZS50YWJsZUlkO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEudGFibGVOYW1lID0gc2VsZWN0ZWROb2RlLnRhYmxlTmFtZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLnRhYmxlQ2FwdGlvbiA9IHNlbGVjdGVkTm9kZS50YWJsZUNhcHRpb247XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YS5yZWxhdGlvbklkID0gc2VsZWN0ZWROb2RlLmlkO1xuICAgIH0sXG4gICAgc2VsZWN0Q29tcGxldGU6IGZ1bmN0aW9uIHNlbGVjdENvbXBsZXRlKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuc2VsZWN0ZWREYXRhO1xuXG4gICAgICBpZiAoIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShyZXN1bHQudGFibGVJZCkgJiYgIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShyZXN1bHQuZmllbGROYW1lKSkge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1iaW5kLXRvLXNpbmdsZS1maWVsZCcsIHJlc3VsdCk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqemcgOimgee7keWumueahOWtl+autSFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGVhckNvbXBsZXRlOiBmdW5jdGlvbiBjbGVhckNvbXBsZXRlKCkge1xuICAgICAgd2luZG93Lk9wZW5lcldpbmRvd09ialt0aGlzLmdldFNlbGVjdEluc3RhbmNlTmFtZSgpXS5zZXRTZWxlY3RGaWVsZFJlc3VsdFZhbHVlKG51bGwpO1xuICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5mZENvbnRyb2xTZWxlY3RCaW5kVG9TaW5nbGVGaWVsZERpYWxvZ1dyYXApO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcImZkQ29udHJvbFNlbGVjdEJpbmRUb1NpbmdsZUZpZWxkRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImdlbmVyYWwtZWRpdC1wYWdlLXdyYXAgZGVzaWduLWRpYWxvZy13cmFwZXItc2luZ2xlLWRpYWxvZ1xcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0LXRhYmxlLXdyYXBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdmlkZXIgb3JpZW50YXRpb249XFxcImxlZnRcXFwiIDpkYXNoZWQ9XFxcInRydWVcXFwiIHN0eWxlPVxcXCJmb250LXNpemU6IDEycHhcXFwiPlxcdTkwMDlcXHU2MkU5XFx1ODg2ODwvZGl2aWRlcj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGlkPVxcXCJ0eHRTZWFyY2hUYWJsZVRyZWVcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMTAwJTtoZWlnaHQ6IDMycHg7bWFyZ2luLXRvcDogMnB4XFxcIiAvPi0tPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cXFwidGFibGVaVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdC1maWVsZC13cmFwZXIgaXYtbGlzdC1wYWdlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVxcXCJsZWZ0XFxcIiA6ZGFzaGVkPVxcXCJ0cnVlXFxcIiBzdHlsZT1cXFwiZm9udC1zaXplOiAxMnB4XFxcIj5cXHU5MDA5XFx1NjJFOVxcdTVCNTdcXHU2QkI1PC9kaXZpZGVyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIGJvcmRlciA6Y29sdW1ucz1cXFwiZmllbGRUYWJsZS5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwiZmllbGRUYWJsZS5maWVsZERhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIDpoaWdobGlnaHQtcm93PVxcXCJ0cnVlXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBvbi1yb3ctY2xpY2s9XFxcInNlbGVjdGVkRmllbGRcXFwiIDpoZWlnaHQ9XFxcImZpZWxkVGFibGUudGFibGVIZWlnaHRcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBuby1kYXRhLXRleHQ9XFxcIlxcdThCRjdcXHU5MDA5XFx1NjJFOVxcdTg4NjhcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcInNlbGVjdENvbXBsZXRlKClcXFwiPiBcXHU3ODZFIFxcdThCQTQgPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNsZWFyQ29tcGxldGUoKVxcXCI+IFxcdTZFMDUgXFx1N0E3QSA8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCI+XFx1NTE3MyBcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiaW5uZXItZm9ybS1idXR0b24tbGlzdC1jb21wXCIsIHtcbiAgcHJvcHM6IFtcImZvcm1JZFwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgIHRpdGxlOiAn5qCH6aKYJyxcbiAgICAgICAga2V5OiAnY2FwdGlvbicsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57G75Z6LJyxcbiAgICAgICAga2V5OiAnYnV0dG9uVHlwZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnaWQnLFxuICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgdmFyIGJ1dHRvbnMgPSBbXTtcblxuICAgICAgICAgIGlmIChwYXJhbXMucm93LmJ1dHRvblR5cGUgIT0gXCLlhbPpl63mjInpkq5cIikge1xuICAgICAgICAgICAgYnV0dG9ucy5wdXNoKExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRWRpdEJ1dHRvbihoLCBwYXJhbXMsIFwiaWRcIiwgX3NlbGYpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBidXR0b25zLnB1c2goTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5EZWxldGVCdXR0b24oaCwgcGFyYW1zLCBcImlkXCIsIF9zZWxmKSk7XG4gICAgICAgICAgYnV0dG9ucy5wdXNoKExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uTW92ZVVwQnV0dG9uKGgsIHBhcmFtcywgXCJpZFwiLCBfc2VsZikpO1xuICAgICAgICAgIGJ1dHRvbnMucHVzaChMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLk1vdmVEb3duQnV0dG9uKGgsIHBhcmFtcywgXCJpZFwiLCBfc2VsZikpO1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIGJ1dHRvbnMpO1xuICAgICAgICB9XG4gICAgICB9XSxcbiAgICAgIHRhYmxlRGF0YTogW10sXG4gICAgICBpbm5lclNhdmVCdXR0b25FZGl0RGF0YToge1xuICAgICAgICBjYXB0aW9uOiBcIlwiLFxuICAgICAgICBzYXZlQW5kQ2xvc2U6IFwidHJ1ZVwiLFxuICAgICAgICBhcGlzOiBbXSxcbiAgICAgICAgZmllbGRzOiBbXSxcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIGJ1dHRvblR5cGU6IFwi5L+d5a2Y5oyJ6ZKuXCIsXG4gICAgICAgIGN1c3RTZXJ2ZXJSZXNvbHZlTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0U2VydmVyUmVzb2x2ZU1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlck1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdENsaWVudFJlbmRlcmVyTWV0aG9kUGFyYTogXCJcIixcbiAgICAgICAgY3VzdENsaWVudFJlbmRlcmVyQWZ0ZXJNZXRob2Q6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlckFmdGVyTWV0aG9kUGFyYTogXCJcIixcbiAgICAgICAgY3VzdENsaWVudENsaWNrQmVmb3JlTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50Q2xpY2tCZWZvcmVNZXRob2RQYXJhOiBcIlwiXG4gICAgICB9LFxuICAgICAgYXBpOiB7XG4gICAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgICAgZ2V0QVBJRGF0YTogXCIvUmVzdC9CdWlsZGVyL0FwaUl0ZW0vR2V0QVBJU0ZvclpUcmVlTm9kZUxpc3RcIlxuICAgICAgICB9LFxuICAgICAgICBhcGlUcmVlT2JqOiBudWxsLFxuICAgICAgICBhcGlUcmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgX3NlbGYuYXBpLmFwaVNlbGVjdERhdGEgPSB0cmVlTm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFwaURhdGE6IG51bGwsXG4gICAgICAgIGFwaVNlbGVjdERhdGE6IG51bGwsXG4gICAgICAgIGVkaXRUYWJsZU9iamVjdDogbnVsbCxcbiAgICAgICAgZWRpdFRhYmxlQ29uZmlnOiB7XG4gICAgICAgICAgU3RhdHVzOiBcIkVkaXRcIixcbiAgICAgICAgICBBZGRBZnRlclJvd0V2ZW50OiBudWxsLFxuICAgICAgICAgIERhdGFGaWVsZDogXCJmaWVsZE5hbWVcIixcbiAgICAgICAgICBUZW1wbGF0ZXM6IFt7XG4gICAgICAgICAgICBUaXRsZTogXCJBUEnlkI3np7BcIixcbiAgICAgICAgICAgIEJpbmROYW1lOiBcInZhbHVlXCIsXG4gICAgICAgICAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfTGFiZWxcIixcbiAgICAgICAgICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICAgICAgICAgIEZvcm1hdGVyOiBmdW5jdGlvbiBGb3JtYXRlcih2YWx1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gX3NlbGYuZ2V0QVBJVGV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgVGl0bGU6IFwi6LCD55So6aG65bqPXCIsXG4gICAgICAgICAgICBCaW5kTmFtZTogXCJydW5UaW1lXCIsXG4gICAgICAgICAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfU2VsZWN0XCIsXG4gICAgICAgICAgICBDbGllbnREYXRhU291cmNlOiBbe1xuICAgICAgICAgICAgICBcIlRleHRcIjogXCLkuYvliY1cIixcbiAgICAgICAgICAgICAgXCJWYWx1ZVwiOiBcIuS5i+WJjVwiXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIFwiVGV4dFwiOiBcIuS5i+WQjlwiLFxuICAgICAgICAgICAgICBcIlZhbHVlXCI6IFwi5LmL5ZCOXCJcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgV2lkdGg6IDEwMFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIFJvd0lkQ3JlYXRlcjogZnVuY3Rpb24gUm93SWRDcmVhdGVyKCkge30sXG4gICAgICAgICAgVGFibGVDbGFzczogXCJlZGl0LXRhYmxlXCIsXG4gICAgICAgICAgUmVuZGVyZXJUbzogXCJhcGlDb250YWluZXJcIixcbiAgICAgICAgICBUYWJsZUlkOiBcImFwaUNvbnRhaW5lclRhYmxlXCIsXG4gICAgICAgICAgVGFibGVBdHRyczoge1xuICAgICAgICAgICAgY2VsbHBhZGRpbmc6IFwiMVwiLFxuICAgICAgICAgICAgY2VsbHNwYWNpbmc6IFwiMVwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIjFcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZpZWxkOiB7XG4gICAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgICAgZ2V0Rm9ybU1haW5UYWJsZUZpZWxkczogXCIvUmVzdC9CdWlsZGVyL0Zvcm0vR2V0Rm9ybU1haW5UYWJsZUZpZWxkc1wiXG4gICAgICAgIH0sXG4gICAgICAgIGVkaXRUYWJsZU9iamVjdDogbnVsbCxcbiAgICAgICAgZWRpdFRhYmxlQ29uZmlnOiB7XG4gICAgICAgICAgU3RhdHVzOiBcIkVkaXRcIixcbiAgICAgICAgICBBZGRBZnRlclJvd0V2ZW50OiBudWxsLFxuICAgICAgICAgIERhdGFGaWVsZDogXCJmaWVsZE5hbWVcIixcbiAgICAgICAgICBUZW1wbGF0ZXM6IFt7XG4gICAgICAgICAgICBUaXRsZTogXCLooajlkI3moIfpophcIixcbiAgICAgICAgICAgIEJpbmROYW1lOiBcInRhYmxlTmFtZVwiLFxuICAgICAgICAgICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX0xhYmVsXCJcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBUaXRsZTogXCLlrZfmrrXmoIfpophcIixcbiAgICAgICAgICAgIEJpbmROYW1lOiBcImZpZWxkTmFtZVwiLFxuICAgICAgICAgICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX1NlbGVjdFwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgVGl0bGU6IFwi6buY6K6k5YC8XCIsXG4gICAgICAgICAgICBCaW5kTmFtZTogXCJkZWZhdWx0VmFsdWVcIixcbiAgICAgICAgICAgIFJlbmRlcmVyOiBcIkVkaXRUYWJsZV9TZWxlY3REZWZhdWx0VmFsdWVcIixcbiAgICAgICAgICAgIEhpZGRlbjogZmFsc2VcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBUaXRsZTogXCLooahJRFwiLFxuICAgICAgICAgICAgQmluZE5hbWU6IFwidGFibGVJZFwiLFxuICAgICAgICAgICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX0xhYmVsXCJcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBSb3dJZENyZWF0ZXI6IGZ1bmN0aW9uIFJvd0lkQ3JlYXRlcigpIHt9LFxuICAgICAgICAgIFRhYmxlQ2xhc3M6IFwiZWRpdC10YWJsZVwiLFxuICAgICAgICAgIFJlbmRlcmVyVG86IFwiZmllbGRDb250YWluZXJcIixcbiAgICAgICAgICBUYWJsZUlkOiBcImZpZWxkQ29udGFpbmVyVGFibGVcIixcbiAgICAgICAgICBUYWJsZUF0dHJzOiB7XG4gICAgICAgICAgICBjZWxscGFkZGluZzogXCIxXCIsXG4gICAgICAgICAgICBjZWxsc3BhY2luZzogXCIxXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb2xkRm9ybUlkOiBcIlwiLFxuICAgICAgaW5uZXJKc0NsaWVudEJ1dHRvbkVkaXREYXRhOiB7XG4gICAgICAgIGNhcHRpb246IFwiXCIsXG4gICAgICAgIGV4ZWNBbmRDbG9zZTogXCJ0cnVlXCIsXG4gICAgICAgIGlkOiBcIlwiLFxuICAgICAgICBidXR0b25UeXBlOiBcIuiEmuacrOaMiemSrlwiLFxuICAgICAgICBhY3Rpb25UeXBlOiBcInJlbG9hZERhdGFcIixcbiAgICAgICAgY2FsbEpzTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0U2VydmVyUmVzb2x2ZU1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdFNlcnZlclJlc29sdmVNZXRob2RQYXJhOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50UmVuZGVyZXJNZXRob2Q6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlck1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlckFmdGVyTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50UmVuZGVyZXJBZnRlck1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRDbGlja0JlZm9yZU1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdENsaWVudENsaWNrQmVmb3JlTWV0aG9kUGFyYTogXCJcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIHJlYWR5OiBmdW5jdGlvbiByZWFkeSh0YWJsZURhdGFKc29uKSB7XG4gICAgICBpZiAodGFibGVEYXRhSnNvbiAhPSBudWxsICYmIHRhYmxlRGF0YUpzb24gIT0gXCJcIikge1xuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0YWJsZURhdGFKc29uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5iaW5kQVBJVHJlZUFuZEluaXRFZGl0VGFibGUobnVsbCk7XG4gICAgfSxcbiAgICBnZXRKc29uOiBmdW5jdGlvbiBnZXRKc29uKCkge1xuICAgICAgcmV0dXJuIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh0aGlzLnRhYmxlRGF0YSk7XG4gICAgfSxcbiAgICBlZGl0OiBmdW5jdGlvbiBlZGl0KGlkLCBwYXJhbXMpIHtcbiAgICAgIGlmIChwYXJhbXMucm93W1wiYnV0dG9uVHlwZVwiXSA9PSBcIuS/neWtmOaMiemSrlwiKSB7XG4gICAgICAgIHRoaXMuZWRpdElubmVyRm9ybVNhdmVCdXR0b24ocGFyYW1zKTtcbiAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnJvd1tcImJ1dHRvblR5cGVcIl0gPT0gXCLohJrmnKzmjInpkq5cIikge1xuICAgICAgICB0aGlzLmVkaXRJbm5lckZvcm1Kc0NsaWVudEJ1dHRvbihwYXJhbXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiBkZWwoaWQsIHBhcmFtcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy50YWJsZURhdGFbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMudGFibGVEYXRhLCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbW92ZVVwOiBmdW5jdGlvbiBtb3ZlVXAoaWQsIHBhcmFtcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy50YWJsZURhdGFbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuTW92ZVVwKHRoaXMudGFibGVEYXRhLCBpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdmVEb3duOiBmdW5jdGlvbiBtb3ZlRG93bihpZCwgcGFyYW1zKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLnRhYmxlRGF0YVtpXS5pZCA9PSBpZCkge1xuICAgICAgICAgIEFycmF5VXRpbGl0eS5Nb3ZlRG93bih0aGlzLnRhYmxlRGF0YSwgaSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRJbm5lckZvcm1TYXZlQnV0dG9uOiBmdW5jdGlvbiBhZGRJbm5lckZvcm1TYXZlQnV0dG9uKCkge1xuICAgICAgaWYgKHRoaXMuZm9ybUlkICE9IG51bGwgJiYgdGhpcy5mb3JtSWQgIT0gXCJcIikge1xuICAgICAgICB0aGlzLmVkaXRTYXZlQnV0dG9uU3RhdHVjID0gXCJhZGRcIjtcbiAgICAgICAgdGhpcy5yZXNldElubmVyU2F2ZUJ1dHRvbkRhdGEoKTtcbiAgICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLmlubmVyRm9ybVNhdmVCdXR0b25XcmFwO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgIGhlaWdodDogNTIwLFxuICAgICAgICAgIHdpZHRoOiA3MjAsXG4gICAgICAgICAgdGl0bGU6IFwi56qX5L2T5YaF5L+d5a2Y5oyJ6ZKuXCJcbiAgICAgICAgfSk7XG4gICAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgICAgICB0aGlzLmlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLmlkID0gXCJpbm5lcl9mb3JtX3NhdmVfYnV0dG9uX1wiICsgU3RyaW5nVXRpbGl0eS5UaW1lc3RhbXAoKTtcbiAgICAgICAgdGhpcy5iaW5kVGFibGVGaWVsZHMobnVsbCk7XG4gICAgICAgIHRoaXMuY2xlYXJBUEkoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+35YWI6K6+572u57uR5a6a55qE56qX5L2TIVwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZShkaWFsb2dFbGVtKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzW2RpYWxvZ0VsZW1dKTtcbiAgICB9LFxuICAgIGVkaXRJbm5lckZvcm1TYXZlQnV0dG9uOiBmdW5jdGlvbiBlZGl0SW5uZXJGb3JtU2F2ZUJ1dHRvbihwYXJhbXMpIHtcbiAgICAgIHRoaXMuYWRkSW5uZXJGb3JtU2F2ZUJ1dHRvbigpO1xuICAgICAgdGhpcy5pbm5lclNhdmVCdXR0b25FZGl0RGF0YSA9IEpzb25VdGlsaXR5LkNsb25lU3RyaW5naWZ5KHBhcmFtcy5yb3cpO1xuICAgICAgdGhpcy5lZGl0U2F2ZUJ1dHRvblN0YXR1YyA9IFwiZWRpdFwiO1xuICAgICAgdGhpcy5iaW5kQVBJVHJlZUFuZEluaXRFZGl0VGFibGUodGhpcy5pbm5lclNhdmVCdXR0b25FZGl0RGF0YS5hcGlzKTtcbiAgICAgIHRoaXMuYmluZFRhYmxlRmllbGRzKHRoaXMuaW5uZXJTYXZlQnV0dG9uRWRpdERhdGEuZmllbGRzKTtcbiAgICB9LFxuICAgIHJlc2V0SW5uZXJTYXZlQnV0dG9uRGF0YTogZnVuY3Rpb24gcmVzZXRJbm5lclNhdmVCdXR0b25EYXRhKCkge1xuICAgICAgdGhpcy5pbm5lclNhdmVCdXR0b25FZGl0RGF0YSA9IHtcbiAgICAgICAgY2FwdGlvbjogXCJcIixcbiAgICAgICAgc2F2ZUFuZENsb3NlOiBcInRydWVcIixcbiAgICAgICAgYXBpczogW10sXG4gICAgICAgIGZpZWxkczogW10sXG4gICAgICAgIGlkOiBcIlwiLFxuICAgICAgICBidXR0b25UeXBlOiBcIuS/neWtmOaMiemSrlwiLFxuICAgICAgICBjdXN0U2VydmVyUmVzb2x2ZU1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdFNlcnZlclJlc29sdmVNZXRob2RQYXJhOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50UmVuZGVyZXJNZXRob2Q6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlck1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlckFmdGVyTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50UmVuZGVyZXJBZnRlck1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRDbGlja0JlZm9yZU1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdENsaWVudENsaWNrQmVmb3JlTWV0aG9kUGFyYTogXCJcIlxuICAgICAgfTtcbiAgICB9LFxuICAgIHNhdmVJbm5lclNhdmVCdXR0b25Ub0xpc3Q6IGZ1bmN0aW9uIHNhdmVJbm5lclNhdmVCdXR0b25Ub0xpc3QoKSB7XG4gICAgICB2YXIgc2luZ2xlSW5uZXJGb3JtQnV0dG9uRGF0YSA9IEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHRoaXMuaW5uZXJTYXZlQnV0dG9uRWRpdERhdGEpO1xuICAgICAgdGhpcy5hcGkuZWRpdFRhYmxlT2JqZWN0LkNvbXBsZXRlZEVkaXRpbmdSb3coKTtcbiAgICAgIHNpbmdsZUlubmVyRm9ybUJ1dHRvbkRhdGEuYXBpcyA9IHRoaXMuYXBpLmVkaXRUYWJsZU9iamVjdC5HZXRTZXJpYWxpemVKc29uKCk7XG4gICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdC5Db21wbGV0ZWRFZGl0aW5nUm93KCk7XG4gICAgICBzaW5nbGVJbm5lckZvcm1CdXR0b25EYXRhLmZpZWxkcyA9IHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkdldFNlcmlhbGl6ZUpzb24oKTtcblxuICAgICAgaWYgKHRoaXMuZWRpdFNhdmVCdXR0b25TdGF0dWMgPT0gXCJhZGRcIikge1xuICAgICAgICB0aGlzLnRhYmxlRGF0YS5wdXNoKHNpbmdsZUlubmVyRm9ybUJ1dHRvbkRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLnRhYmxlRGF0YVtpXS5pZCA9PSBzaW5nbGVJbm5lckZvcm1CdXR0b25EYXRhLmlkKSB7XG4gICAgICAgICAgICBWdWUuc2V0KHRoaXMudGFibGVEYXRhLCBpLCBzaW5nbGVJbm5lckZvcm1CdXR0b25EYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVDbG9zZShcImlubmVyRm9ybVNhdmVCdXR0b25XcmFwXCIpO1xuICAgIH0sXG4gICAgYmluZFRhYmxlRmllbGRzOiBmdW5jdGlvbiBiaW5kVGFibGVGaWVsZHMob2xkRGF0YSkge1xuICAgICAgaWYgKHRoaXMub2xkRm9ybUlkICE9IHRoaXMuZm9ybUlkKSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5maWVsZC5hY0ludGVyZmFjZS5nZXRGb3JtTWFpblRhYmxlRmllbGRzLCB7XG4gICAgICAgICAgZm9ybUlkOiB0aGlzLmZvcm1JZFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICB2YXIgZmllbGRzRGF0YSA9IFtdO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZmllbGRzRGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgVmFsdWU6IHJlc3VsdC5kYXRhW2ldLmZpZWxkTmFtZSxcbiAgICAgICAgICAgICAgVGV4dDogcmVzdWx0LmRhdGFbaV0uZmllbGRDYXB0aW9uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZUNvbmZpZy5UZW1wbGF0ZXNbMF0uRGVmYXVsdFZhbHVlID0ge1xuICAgICAgICAgICAgVHlwZTogXCJDb25zdFwiLFxuICAgICAgICAgICAgVmFsdWU6IHJlc3VsdC5kYXRhWzBdLnRhYmxlTmFtZVxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5maWVsZC5lZGl0VGFibGVDb25maWcuVGVtcGxhdGVzWzNdLkRlZmF1bHRWYWx1ZSA9IHtcbiAgICAgICAgICAgIFR5cGU6IFwiQ29uc3RcIixcbiAgICAgICAgICAgIFZhbHVlOiByZXN1bHQuZGF0YVswXS50YWJsZUlkXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZUNvbmZpZy5UZW1wbGF0ZXNbMV0uQ2xpZW50RGF0YVNvdXJjZSA9IGZpZWxkc0RhdGE7XG5cbiAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdCA9IE9iamVjdC5jcmVhdGUoRWRpdFRhYmxlKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkluaXRpYWxpemF0aW9uKHRoaXMuZmllbGQuZWRpdFRhYmxlQ29uZmlnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLm9sZEZvcm1JZCA9IHRoaXMuZm9ybUlkO1xuXG4gICAgICAgICAgaWYgKG9sZERhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkxvYWRKc29uRGF0YShvbGREYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5maWVsZC5lZGl0VGFibGVPYmplY3QpIHtcbiAgICAgICAgdGhpcy5maWVsZC5lZGl0VGFibGVPYmplY3QuUmVtb3ZlQWxsUm93KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvbGREYXRhICYmIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkxvYWRKc29uRGF0YShvbGREYXRhKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZEZpZWxkOiBmdW5jdGlvbiBhZGRGaWVsZCgpIHtcbiAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkFkZEVkaXRpbmdSb3dCeVRlbXBsYXRlKCk7XG4gICAgfSxcbiAgICByZW1vdmVGaWVsZDogZnVuY3Rpb24gcmVtb3ZlRmllbGQoKSB7XG4gICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdC5SZW1vdmVSb3coKTtcbiAgICB9LFxuICAgIGJpbmRBUElUcmVlQW5kSW5pdEVkaXRUYWJsZTogZnVuY3Rpb24gYmluZEFQSVRyZWVBbmRJbml0RWRpdFRhYmxlKG9sZERhdGEpIHtcbiAgICAgIGlmICghdGhpcy5hcGkuYXBpRGF0YSkge1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYXBpLmFjSW50ZXJmYWNlLmdldEFQSURhdGEsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICB0aGlzLmFwaS5hcGlEYXRhID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQuZGF0YSAhPSBudWxsICYmIHJlc3VsdC5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZGF0YVtpXS5ub2RlVHlwZU5hbWUgPT0gXCJHcm91cFwiKSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQuZGF0YVtpXS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi9wYWNrYWdlLnBuZ1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQuZGF0YVtpXS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi9hcHBsaWNhdGlvbl92aWV3X2NvbHVtbnMucG5nXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXBpLmFwaVRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNhcGlaVHJlZVVMXCIpLCB0aGlzLmFwaS5hcGlUcmVlU2V0dGluZywgcmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgdGhpcy5hcGkuYXBpVHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmoodGhpcy5hcGkuYXBpVHJlZU9iaiwgdGhpcy4kcmVmcy50eHRfc2VhcmNoX2FwaV90ZXh0LiRyZWZzLmlucHV0LCBudWxsLCB0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QgPSBPYmplY3QuY3JlYXRlKEVkaXRUYWJsZSk7XG4gICAgICAgIHRoaXMuYXBpLmVkaXRUYWJsZU9iamVjdC5Jbml0aWFsaXphdGlvbih0aGlzLmFwaS5lZGl0VGFibGVDb25maWcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuUmVtb3ZlQWxsUm93KCk7XG5cbiAgICAgIGlmIChvbGREYXRhKSB7XG4gICAgICAgIHRoaXMuYXBpLmVkaXRUYWJsZU9iamVjdC5Mb2FkSnNvbkRhdGEob2xkRGF0YSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRBcGlDb25maWdBbmRCaW5kVG9UYWJsZTogZnVuY3Rpb24gZ2V0QXBpQ29uZmlnQW5kQmluZFRvVGFibGUoKSB7XG4gICAgICByZXR1cm47XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hcGkuYWNJbnRlcmZhY2UuZ2V0QnV0dG9uQXBpQ29uZmlnLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB2YXIgYXBpU2VsZWN0RGF0YSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgZ3JvdXAgPSB7XG4gICAgICAgICAgICBHcm91cDogcmVzdWx0LmRhdGFbaV0ubmFtZVxuICAgICAgICAgIH07XG4gICAgICAgICAgdmFyIG9wdGlvbnMgPSBbXTtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmVzdWx0LmRhdGFbaV0uYnV0dG9uQVBJVm9MaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBvcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBWYWx1ZTogcmVzdWx0LmRhdGFbaV0uYnV0dG9uQVBJVm9MaXN0W2pdLmlkLFxuICAgICAgICAgICAgICBUZXh0OiByZXN1bHQuZGF0YVtpXS5idXR0b25BUElWb0xpc3Rbal0ubmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZ3JvdXBbXCJPcHRpb25zXCJdID0gb3B0aW9ucztcbiAgICAgICAgICBhcGlTZWxlY3REYXRhLnB1c2goZ3JvdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgX3NlbGYuYXBpLmVkaXRUYWJsZUNvbmZpZy5UZW1wbGF0ZXNbMF0uQ2xpZW50RGF0YVNvdXJjZSA9IGFwaVNlbGVjdERhdGE7XG4gICAgICAgIF9zZWxmLmFwaS5lZGl0VGFibGVPYmplY3QgPSBPYmplY3QuY3JlYXRlKEVkaXRUYWJsZSk7XG5cbiAgICAgICAgX3NlbGYuYXBpLmVkaXRUYWJsZU9iamVjdC5Jbml0aWFsaXphdGlvbihfc2VsZi5hcGkuZWRpdFRhYmxlQ29uZmlnKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgYWRkQVBJOiBmdW5jdGlvbiBhZGRBUEkoKSB7XG4gICAgICBpZiAodGhpcy5hcGkuYXBpU2VsZWN0RGF0YS5ub2RlVHlwZU5hbWUgPT0gXCJBUElcIikge1xuICAgICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGUoW10sIHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5hcGkuYXBpU2VsZWN0RGF0YS52YWx1ZSxcbiAgICAgICAgICBydW5UaW1lOiBcIuS5i+WQjlwiXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7fpgInmi6npnIDopoHmt7vliqDnmoRBUEkhXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlQVBJOiBmdW5jdGlvbiByZW1vdmVBUEkoKSB7XG4gICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuUmVtb3ZlUm93KCk7XG4gICAgfSxcbiAgICBjbGVhckFQSTogZnVuY3Rpb24gY2xlYXJBUEkoKSB7XG4gICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuUmVtb3ZlQWxsUm93KCk7XG4gICAgfSxcbiAgICBnZXRBUElUZXh0OiBmdW5jdGlvbiBnZXRBUElUZXh0KHZhbHVlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXBpLmFwaURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYXBpLmFwaURhdGFbaV0ubm9kZVR5cGVOYW1lID09IFwiQVBJXCIpIHtcbiAgICAgICAgICBpZiAodGhpcy5hcGkuYXBpRGF0YVtpXS52YWx1ZSA9PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBpLmFwaURhdGFbaV0udGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSxcbiAgICBhZGRJbm5lckZvcm1DbG9zZUJ1dHRvbjogZnVuY3Rpb24gYWRkSW5uZXJGb3JtQ2xvc2VCdXR0b24oKSB7XG4gICAgICB2YXIgY2xvc2VCdXR0b25EYXRhID0ge1xuICAgICAgICBjYXB0aW9uOiBcIuWFs+mXrVwiLFxuICAgICAgICBpZDogXCJpbm5lcl9jbG9zZV9idXR0b25fXCIgKyBTdHJpbmdVdGlsaXR5LlRpbWVzdGFtcCgpLFxuICAgICAgICBidXR0b25UeXBlOiBcIuWFs+mXreaMiemSrlwiXG4gICAgICB9O1xuICAgICAgdGhpcy50YWJsZURhdGEucHVzaChjbG9zZUJ1dHRvbkRhdGEpO1xuICAgIH0sXG4gICAgYWRkSW5uZXJGb3JtSnNDbGllbnRCdXR0b246IGZ1bmN0aW9uIGFkZElubmVyRm9ybUpzQ2xpZW50QnV0dG9uKCkge1xuICAgICAgdGhpcy5lZGl0SnNDbGllbnRCdXR0b25TdGF0dWMgPSBcImFkZFwiO1xuICAgICAgdGhpcy5yZXNldElubmVySnNDbGllbnRCdXR0b25EYXRhKCk7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuaW5uZXJGb3JtSnNDbGllbnRCdXR0b25XcmFwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIGhlaWdodDogNTIwLFxuICAgICAgICB3aWR0aDogNzIwLFxuICAgICAgICB0aXRsZTogXCLnqpfkvZPlhoXohJrmnKzmjInpkq5cIlxuICAgICAgfSk7XG4gICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgICB0aGlzLmlubmVySnNDbGllbnRCdXR0b25FZGl0RGF0YS5pZCA9IFwiaW5uZXJfZm9ybV9qc19jbGllbnRfYnV0dG9uX1wiICsgU3RyaW5nVXRpbGl0eS5UaW1lc3RhbXAoKTtcbiAgICB9LFxuICAgIGVkaXRJbm5lckZvcm1Kc0NsaWVudEJ1dHRvbjogZnVuY3Rpb24gZWRpdElubmVyRm9ybUpzQ2xpZW50QnV0dG9uKHBhcmFtcykge1xuICAgICAgdGhpcy5hZGRJbm5lckZvcm1Kc0NsaWVudEJ1dHRvbigpO1xuICAgICAgdGhpcy5pbm5lckpzQ2xpZW50QnV0dG9uRWRpdERhdGEgPSBKc29uVXRpbGl0eS5DbG9uZVN0cmluZ2lmeShwYXJhbXMucm93KTtcbiAgICAgIHRoaXMuZWRpdEpzQ2xpZW50QnV0dG9uU3RhdHVjID0gXCJlZGl0XCI7XG4gICAgfSxcbiAgICByZXNldElubmVySnNDbGllbnRCdXR0b25EYXRhOiBmdW5jdGlvbiByZXNldElubmVySnNDbGllbnRCdXR0b25EYXRhKCkge1xuICAgICAgdGhpcy5pbm5lckpzQ2xpZW50QnV0dG9uRWRpdERhdGEgPSB7XG4gICAgICAgIGNhcHRpb246IFwiXCIsXG4gICAgICAgIGV4ZWNBbmRDbG9zZTogXCJ0cnVlXCIsXG4gICAgICAgIGlkOiBcIlwiLFxuICAgICAgICBidXR0b25UeXBlOiBcIuiEmuacrOaMiemSrlwiLFxuICAgICAgICBhY3Rpb25UeXBlOiBcInJlbG9hZERhdGFcIixcbiAgICAgICAgY2FsbEpzTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0U2VydmVyUmVzb2x2ZU1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdFNlcnZlclJlc29sdmVNZXRob2RQYXJhOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50UmVuZGVyZXJNZXRob2Q6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlck1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlckFmdGVyTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50UmVuZGVyZXJBZnRlck1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRDbGlja0JlZm9yZU1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdENsaWVudENsaWNrQmVmb3JlTWV0aG9kUGFyYTogXCJcIlxuICAgICAgfTtcbiAgICB9LFxuICAgIHNhdmVJbm5lckpzQ2xpZW50QnV0dG9uVG9MaXN0OiBmdW5jdGlvbiBzYXZlSW5uZXJKc0NsaWVudEJ1dHRvblRvTGlzdCgpIHtcbiAgICAgIHZhciBzaW5nbGVJbm5lckZvcm1CdXR0b25EYXRhID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUodGhpcy5pbm5lckpzQ2xpZW50QnV0dG9uRWRpdERhdGEpO1xuXG4gICAgICBpZiAodGhpcy5lZGl0SnNDbGllbnRCdXR0b25TdGF0dWMgPT0gXCJhZGRcIikge1xuICAgICAgICB0aGlzLnRhYmxlRGF0YS5wdXNoKHNpbmdsZUlubmVyRm9ybUJ1dHRvbkRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLnRhYmxlRGF0YVtpXS5pZCA9PSBzaW5nbGVJbm5lckZvcm1CdXR0b25EYXRhLmlkKSB7XG4gICAgICAgICAgICBWdWUuc2V0KHRoaXMudGFibGVEYXRhLCBpLCBzaW5nbGVJbm5lckZvcm1CdXR0b25EYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVDbG9zZShcImlubmVyRm9ybUpzQ2xpZW50QnV0dG9uV3JhcFwiKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgc3R5bGU9XFxcImhlaWdodDogMjEwcHhcXFwiIGNsYXNzPVxcXCJpdi1saXN0LXBhZ2Utd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj1cXFwiaW5uZXJGb3JtU2F2ZUJ1dHRvbldyYXBcXFwiIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXdyYXBlciBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTttYXJnaW4tdG9wOiAwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJzIHNpemU9XFxcInNtYWxsXFxcIiBuYW1lPVxcXCJpbm5lci1mb3JtLXNhdmUtYnV0dG9uLWVkaXQtdGFic1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWItcGFuZSB0YWI9XFxcImlubmVyLWZvcm0tc2F2ZS1idXR0b24tZWRpdC10YWJzXFxcIiBsYWJlbD1cXFwiXFx1N0VEMVxcdTVCOUFcXHU0RkUxXFx1NjA2RlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGNlbGxzcGFjaW5nPVxcXCIwXFxcIiBib3JkZXI9XFxcIjBcXFwiIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogNjBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDIyMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTY4MDdcXHU5ODk4XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJTYXZlQnV0dG9uRWRpdERhdGEuY2FwdGlvblxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NEZERFxcdTVCNThcXHU1RTc2XFx1NTE3M1xcdTk1RURcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJpbm5lclNhdmVCdXR0b25FZGl0RGF0YS5zYXZlQW5kQ2xvc2VcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcInRydWVcXFwiPlxcdTY2MkY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImZhbHNlXFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTVCNTdcXHU2QkI1XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiM1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiaGVpZ2h0OiAxNDBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OiBsZWZ0O3dpZHRoOiA5NCVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cXFwiZmllbGRDb250YWluZXJcXFwiIGNsYXNzPVxcXCJlZGl0LXRhYmxlLXdyYXBcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6IDMxMHB4O292ZXJmbG93OiBhdXRvO3dpZHRoOiA5OCU7bWFyZ2luOiBhdXRvXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OiByaWdodDt3aWR0aDogNSVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cCB2ZXJ0aWNhbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gc2l6ZT1cXFwic21hbGxcXFwiIHR5cGU9XFxcInN1Y2Nlc3NcXFwiIGljb249XFxcIm1kLWFkZFxcXCIgQGNsaWNrPVxcXCJhZGRGaWVsZFxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gc2l6ZT1cXFwic21hbGxcXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIiBAY2xpY2s9XFxcInJlbW92ZUZpZWxkXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIHRhYj1cXFwiaW5uZXItZm9ybS1zYXZlLWJ1dHRvbi1lZGl0LXRhYnNcXFwiIGxhYmVsPVxcXCJBUElcXHU4QkJFXFx1N0Y2RVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGNlbGxzcGFjaW5nPVxcXCIwXFxcIiBib3JkZXI9XFxcIjBcXFwiIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMzIwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA2MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwiYmFja2dyb3VuZDogI2ZmZmZmZlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVxcXCJpbnB1dF9ib3JkZXJfYm90dG9tXFxcIiByZWY9XFxcInR4dF9zZWFyY2hfYXBpX3RleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVBUElcXHU1NDBEXFx1NzlGMFxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cXFwiYXBpWlRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OiAzMjBweDtvdmVyZmxvdzogYXV0b1xcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjtiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOGY4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwIHZlcnRpY2FsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gc2l6ZT1cXFwic21hbGxcXFwiIHR5cGU9XFxcInN1Y2Nlc3NcXFwiIGljb249XFxcIm1kLWFkZFxcXCIgQGNsaWNrPVxcXCJhZGRBUElcXFwiPjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBzaXplPVxcXCJzbWFsbFxcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiIEBjbGljaz1cXFwicmVtb3ZlQVBJXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gc2l6ZT1cXFwic21hbGxcXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcImlvcy10cmFzaFxcXCIgQGNsaWNrPVxcXCJjbGVhckFQSVxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcImJhY2tncm91bmQ6ICNmZmZmZmY7XFxcIiB2YWxpZ249XFxcInRvcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cXFwiYXBpQ29udGFpbmVyXFxcIiBjbGFzcz1cXFwiZWRpdC10YWJsZS13cmFwXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OiAzNDBweDtvdmVyZmxvdzogYXV0bzt3aWR0aDogOTglO21hcmdpbjogYXV0b1xcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgdGFiPVxcXCJpbm5lci1mb3JtLXNhdmUtYnV0dG9uLWVkaXQtdGFic1xcXCIgbGFiZWw9XFxcIlxcdTVGMDBcXHU1M0QxXFx1NjI2OVxcdTVDNTVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPVxcXCIwXFxcIiBjZWxsc3BhY2luZz1cXFwiMFxcXCIgYm9yZGVyPVxcXCIwXFxcIiBjbGFzcz1cXFwiaHRtbC1kZXNpZ24tcGx1Z2luLWRpYWxvZy10YWJsZS13cmFwZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDE1MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5JRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLmlkXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU2NzBEXFx1NTJBMVxcdTdBRUZcXHU4OUUzXFx1Njc5MFxcdTdDN0JcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lclNhdmVCdXR0b25FZGl0RGF0YS5jdXN0U2VydmVyUmVzb2x2ZU1ldGhvZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU2MzA5XFx1OTRBRVxcdThGREJcXHU4ODRDXFx1NjcwRFxcdTUyQTFcXHU3QUVGXFx1ODlFM1xcdTY3OTBcXHU2NUY2LFxcdTdDN0JcXHU1MTY4XFx1NzlGMCxcXHU1QzA2XFx1OEMwM1xcdTc1MjhcXHU4QkU1XFx1N0M3QixcXHU5NzAwXFx1ODk4MVxcdTVCOUVcXHU3M0IwXFx1NjNBNVxcdTUzRTNJRm9ybUJ1dHRvbkN1c3RSZXNvbHZlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTUzQzJcXHU2NTcwXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJTYXZlQnV0dG9uRWRpdERhdGEuY3VzdFNlcnZlclJlc29sdmVNZXRob2RQYXJhXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTY3MERcXHU1MkExXFx1N0FFRlxcdTg5RTNcXHU2NzkwXFx1N0M3QlxcdTc2ODRcXHU1M0MyXFx1NjU3MFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU2RTMyXFx1NjdEM1xcdTY1QjlcXHU2Q0Q1XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJTYXZlQnV0dG9uRWRpdERhdGEuY3VzdENsaWVudFJlbmRlcmVyTWV0aG9kXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTVCQTJcXHU2MjM3XFx1N0FFRlxcdTZFMzJcXHU2N0QzXFx1NjVCOVxcdTZDRDUsXFx1NjMwOVxcdTk0QUVcXHU1QzA2XFx1N0VDRlxcdTc1MzFcXHU4QkU1XFx1NjVCOVxcdTZDRDVcXHU2RTMyXFx1NjdEMyxcXHU2NzAwXFx1N0VDOFxcdTVGNjJcXHU2MjEwXFx1OTg3NVxcdTk3NjJcXHU1MTQzXFx1N0QyMCxcXHU5NzAwXFx1ODk4MVxcdThGRDRcXHU1NkRFXFx1NjcwMFxcdTdFQzhcXHU1MTQzXFx1N0QyMFxcdTc2ODRIVE1MXFx1NUJGOVxcdThDNjFcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NTNDMlxcdTY1NzBcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lclNhdmVCdXR0b25FZGl0RGF0YS5jdXN0Q2xpZW50UmVuZGVyZXJNZXRob2RQYXJhXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTVCQTJcXHU2MjM3XFx1N0FFRlxcdTZFMzJcXHU2N0QzXFx1NjVCOVxcdTZDRDVcXHU3Njg0XFx1NTNDMlxcdTY1NzBcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NkUzMlxcdTY3RDNcXHU1NDBFXFx1NjVCOVxcdTZDRDVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lclNhdmVCdXR0b25FZGl0RGF0YS5jdXN0Q2xpZW50UmVuZGVyZXJBZnRlck1ldGhvZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU2RTMyXFx1NjdEM1xcdTU0MEVcXHU4QzAzXFx1NzUyOFxcdTY1QjlcXHU2Q0Q1LFxcdTdFQ0ZcXHU4RkM3XFx1OUVEOFxcdThCQTRcXHU3Njg0XFx1NkUzMlxcdTY3RDMsXFx1NjVFMFxcdThGRDRcXHU1NkRFXFx1NTAzQ1xcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1M0MyXFx1NjU3MFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLmN1c3RDbGllbnRSZW5kZXJlckFmdGVyTWV0aG9kUGFyYVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU2RTMyXFx1NjdEM1xcdTU0MEVcXHU2NUI5XFx1NkNENVxcdTc2ODRcXHU1M0MyXFx1NjU3MFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU3MEI5XFx1NTFGQlxcdTUyNERcXHU2NUI5XFx1NkNENVxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLmN1c3RDbGllbnRDbGlja0JlZm9yZU1ldGhvZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU3MEI5XFx1NTFGQlxcdThCRTVcXHU2MzA5XFx1OTRBRVxcdTY1RjZcXHU3Njg0XFx1NTI0RFxcdTdGNkVcXHU2NUI5XFx1NkNENSxcXHU1OTgyXFx1Njc5Q1xcdThGRDRcXHU1NkRFZmFsc2VcXHU1QzA2XFx1OTYzQlxcdTZCNjJcXHU5RUQ4XFx1OEJBNFxcdThDMDNcXHU3NTI4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTUzQzJcXHU2NTcwXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJTYXZlQnV0dG9uRWRpdERhdGEuY3VzdENsaWVudENsaWNrQmVmb3JlTWV0aG9kUGFyYVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU3MEI5XFx1NTFGQlxcdTUyNERcXHU2NUI5XFx1NkNENVxcdTc2ODRcXHU1M0MyXFx1NjU3MFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFiLXBhbmU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJzPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6NHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiIHN0eWxlPVxcXCJtYXJnaW4tcmlnaHQ6IDRweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcInNhdmVJbm5lclNhdmVCdXR0b25Ub0xpc3QoKVxcXCI+IFxcdTRGREQgXFx1NUI1ODwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoJ2lubmVyRm9ybVNhdmVCdXR0b25XcmFwJylcXFwiPlxcdTUxNzMgXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPVxcXCJpbm5lckZvcm1Kc0NsaWVudEJ1dHRvbldyYXBcXFwiIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXdyYXBlciBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTttYXJnaW4tdG9wOiAwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJzIHNpemU9XFxcInNtYWxsXFxcIiBuYW1lPVxcXCJpbm5lci1mb3JtLWpzLWNsaWVudC1idXR0b24tZWRpdC10YWJzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIHRhYj1cXFwiaW5uZXItZm9ybS1qcy1jbGllbnQtYnV0dG9uLWVkaXQtdGFic1xcXCIgbGFiZWw9XFxcIlxcdTdFRDFcXHU1QjlBXFx1NEZFMVxcdTYwNkZcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPVxcXCIwXFxcIiBjZWxsc3BhY2luZz1cXFwiMFxcXCIgYm9yZGVyPVxcXCIwXFxcIiBjbGFzcz1cXFwiaHRtbC1kZXNpZ24tcGx1Z2luLWRpYWxvZy10YWJsZS13cmFwZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDgwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAyMjBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU2ODA3XFx1OTg5OFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVySnNDbGllbnRCdXR0b25FZGl0RGF0YS5jYXB0aW9uXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU0RkREXFx1NUI1OFxcdTVFNzZcXHU1MTczXFx1OTVFRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiIHYtbW9kZWw9XFxcImlubmVySnNDbGllbnRCdXR0b25FZGl0RGF0YS5leGVjQW5kQ2xvc2VcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcInRydWVcXFwiPlxcdTY2MkY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImZhbHNlXFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTUyQThcXHU0RjVDXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiM1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcIm1hcmdpbjogYXV0b1xcXCIgdi1tb2RlbD1cXFwiaW5uZXJKc0NsaWVudEJ1dHRvbkVkaXREYXRhLmFjdGlvblR5cGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcInJlbG9hZERhdGFcXFwiPlxcdTkxQ0RcXHU2NUIwXFx1NTJBMFxcdThGN0Q8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImNhbGxKc01ldGhvZFxcXCI+XFx1OEMwM1xcdTc1MjhKU1xcdTY1QjlcXHU2Q0Q1PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTYyNjdcXHU4ODRDXFx1NjVCOVxcdTZDRDVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lckpzQ2xpZW50QnV0dG9uRWRpdERhdGEuY2FsbEpzTWV0aG9kXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1OEMwM1xcdTc1MjhKU1xcdTY1QjlcXHU2Q0Q1XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIHRhYj1cXFwiaW5uZXItZm9ybS1qcy1jbGllbnQtYnV0dG9uLWVkaXQtdGFic1xcXCIgbGFiZWw9XFxcIlxcdTVGMDBcXHU1M0QxXFx1NjI2OVxcdTVDNTVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPVxcXCIwXFxcIiBjZWxsc3BhY2luZz1cXFwiMFxcXCIgYm9yZGVyPVxcXCIwXFxcIiBjbGFzcz1cXFwiaHRtbC1kZXNpZ24tcGx1Z2luLWRpYWxvZy10YWJsZS13cmFwZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDE1MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5JRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVySnNDbGllbnRCdXR0b25FZGl0RGF0YS5pZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NjcwRFxcdTUyQTFcXHU3QUVGXFx1ODlFM1xcdTY3OTBcXHU3QzdCXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJKc0NsaWVudEJ1dHRvbkVkaXREYXRhLmN1c3RTZXJ2ZXJSZXNvbHZlTWV0aG9kXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTYzMDlcXHU5NEFFXFx1OEZEQlxcdTg4NENcXHU2NzBEXFx1NTJBMVxcdTdBRUZcXHU4OUUzXFx1Njc5MFxcdTY1RjYsXFx1N0M3QlxcdTUxNjhcXHU3OUYwLFxcdTVDMDZcXHU4QzAzXFx1NzUyOFxcdThCRTVcXHU3QzdCLFxcdTk3MDBcXHU4OTgxXFx1NUI5RVxcdTczQjBcXHU2M0E1XFx1NTNFM0lGb3JtQnV0dG9uQ3VzdFJlc29sdmVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NTNDMlxcdTY1NzBcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lckpzQ2xpZW50QnV0dG9uRWRpdERhdGEuY3VzdFNlcnZlclJlc29sdmVNZXRob2RQYXJhXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTY3MERcXHU1MkExXFx1N0FFRlxcdTg5RTNcXHU2NzkwXFx1N0M3QlxcdTc2ODRcXHU1M0MyXFx1NjU3MFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU2RTMyXFx1NjdEM1xcdTY1QjlcXHU2Q0Q1XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJKc0NsaWVudEJ1dHRvbkVkaXREYXRhLmN1c3RDbGllbnRSZW5kZXJlck1ldGhvZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU2RTMyXFx1NjdEM1xcdTY1QjlcXHU2Q0Q1LFxcdTYzMDlcXHU5NEFFXFx1NUMwNlxcdTdFQ0ZcXHU3NTMxXFx1OEJFNVxcdTY1QjlcXHU2Q0Q1XFx1NkUzMlxcdTY3RDMsXFx1NjcwMFxcdTdFQzhcXHU1RjYyXFx1NjIxMFxcdTk4NzVcXHU5NzYyXFx1NTE0M1xcdTdEMjAsXFx1OTcwMFxcdTg5ODFcXHU4RkQ0XFx1NTZERVxcdTY3MDBcXHU3RUM4XFx1NTE0M1xcdTdEMjBcXHU3Njg0SFRNTFxcdTVCRjlcXHU4QzYxXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTUzQzJcXHU2NTcwXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJKc0NsaWVudEJ1dHRvbkVkaXREYXRhLmN1c3RDbGllbnRSZW5kZXJlck1ldGhvZFBhcmFcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NkUzMlxcdTY3RDNcXHU2NUI5XFx1NkNENVxcdTc2ODRcXHU1M0MyXFx1NjU3MFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU2RTMyXFx1NjdEM1xcdTU0MEVcXHU2NUI5XFx1NkNENVxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVySnNDbGllbnRCdXR0b25FZGl0RGF0YS5jdXN0Q2xpZW50UmVuZGVyZXJBZnRlck1ldGhvZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU2RTMyXFx1NjdEM1xcdTU0MEVcXHU4QzAzXFx1NzUyOFxcdTY1QjlcXHU2Q0Q1LFxcdTdFQ0ZcXHU4RkM3XFx1OUVEOFxcdThCQTRcXHU3Njg0XFx1NkUzMlxcdTY3RDMsXFx1NjVFMFxcdThGRDRcXHU1NkRFXFx1NTAzQ1xcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1M0MyXFx1NjU3MFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVySnNDbGllbnRCdXR0b25FZGl0RGF0YS5jdXN0Q2xpZW50UmVuZGVyZXJBZnRlck1ldGhvZFBhcmFcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NkUzMlxcdTY3RDNcXHU1NDBFXFx1NjVCOVxcdTZDRDVcXHU3Njg0XFx1NTNDMlxcdTY1NzBcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NzBCOVxcdTUxRkJcXHU1MjREXFx1NjVCOVxcdTZDRDVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lckpzQ2xpZW50QnV0dG9uRWRpdERhdGEuY3VzdENsaWVudENsaWNrQmVmb3JlTWV0aG9kXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTVCQTJcXHU2MjM3XFx1N0FFRlxcdTcwQjlcXHU1MUZCXFx1OEJFNVxcdTYzMDlcXHU5NEFFXFx1NjVGNlxcdTc2ODRcXHU1MjREXFx1N0Y2RVxcdTY1QjlcXHU2Q0Q1LFxcdTU5ODJcXHU2NzlDXFx1OEZENFxcdTU2REVmYWxzZVxcdTVDMDZcXHU5NjNCXFx1NkI2MlxcdTlFRDhcXHU4QkE0XFx1OEMwM1xcdTc1MjhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NTNDMlxcdTY1NzBcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lckpzQ2xpZW50QnV0dG9uRWRpdERhdGEuY3VzdENsaWVudENsaWNrQmVmb3JlTWV0aG9kUGFyYVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU3MEI5XFx1NTFGQlxcdTUyNERcXHU2NUI5XFx1NkNENVxcdTc2ODRcXHU1M0MyXFx1NjU3MFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFiLXBhbmU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJzPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwicGFkZGluZy10b3A6NHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiIHN0eWxlPVxcXCJtYXJnaW4tcmlnaHQ6IDRweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcInNhdmVJbm5lckpzQ2xpZW50QnV0dG9uVG9MaXN0KClcXFwiPiBcXHU0RkREIFxcdTVCNTg8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKCdpbm5lckZvcm1Kc0NsaWVudEJ1dHRvbldyYXAnKVxcXCI+XFx1NTE3MyBcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiaGVpZ2h0OiAyMTBweDt3aWR0aDogMTAwJVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZmxvYXQ6IGxlZnQ7d2lkdGg6IDgyJVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XFxcIjIxMFxcXCIgd2lkdGg9XFxcIjEwMCVcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJ0YWJsZURhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPVxcXCJzbWFsbFxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OiBsZWZ0O3dpZHRoOiAxNSU7bWFyZ2luLWxlZnQ6IDhweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXAgdmVydGljYWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwic3VjY2Vzc1xcXCIgQGNsaWNrPVxcXCJhZGRJbm5lckZvcm1TYXZlQnV0dG9uKClcXFwiIGljb249XFxcIm1kLWFkZFxcXCI+XFx1NEZERFxcdTVCNThcXHU2MzA5XFx1OTRBRTwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJhZGRJbm5lckZvcm1DbG9zZUJ1dHRvbigpXFxcIiBpY29uPVxcXCJtZC1hZGRcXFwiPlxcdTUxNzNcXHU5NUVEXFx1NjMwOVxcdTk0QUU8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiYWRkSW5uZXJGb3JtSnNDbGllbnRCdXR0b24oKVxcXCIgaWNvbj1cXFwibWQtYWRkXFxcIj5cXHU4MTFBXFx1NjcyQ1xcdTYzMDlcXHU5NEFFPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBzaXplPVxcXCJzbWFsbFxcXCIgaWNvbj1cXFwibWQtYWRkXFxcIiBkaXNhYmxlZD5cXHU2MTBGXFx1ODlDMVxcdTYzMDlcXHU5NEFFPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBzaXplPVxcXCJzbWFsbFxcXCIgaWNvbj1cXFwibWQtYWRkXFxcIiBkaXNhYmxlZD5cXHU2RDQxXFx1N0EwQlxcdTYzMDlcXHU5NEFFPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBzaXplPVxcXCJzbWFsbFxcXCIgZGlzYWJsZWQgaWNvbj1cXFwibWQtYWRkXFxcIj5cXHU2MkY3XFx1OEQxREpzb248L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHNpemU9XFxcInNtYWxsXFxcIiBkaXNhYmxlZCBpY29uPVxcXCJtZC1hZGRcXFwiPlxcdTlFQ0ZcXHU4RDM0SnNvbjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImxpc3Qtc2VhcmNoLWNvbnRyb2wtYmluZC10by1jb21wXCIsIHtcbiAgcHJvcHM6IFtcImJpbmRUb1NlYXJjaEZpZWxkUHJvcFwiLCBcImRhdGFTZXRJZFwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGJpbmRUb1NlYXJjaEZpZWxkOiB7XG4gICAgICAgIGNvbHVtblRpdGxlOiBcIlwiLFxuICAgICAgICBjb2x1bW5UYWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIGNvbHVtbk5hbWU6IFwiXCIsXG4gICAgICAgIGNvbHVtbkNhcHRpb246IFwiXCIsXG4gICAgICAgIGNvbHVtbkRhdGFUeXBlTmFtZTogXCJcIixcbiAgICAgICAgY29sdW1uT3BlcmF0b3I6IFwi5Yy56YWNXCJcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0VmFsdWU6IHtcbiAgICAgICAgZGVmYXVsdFR5cGU6IFwiXCIsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFRleHQ6IFwiXCJcbiAgICAgIH0sXG4gICAgICB0cmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIGNoa1N0eWxlOiBcInJhZGlvXCIsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGlkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0Q29sdW1uKHRyZWVOb2RlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkRibENsaWNrOiBmdW5jdGlvbiBvbkRibENsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7fSxcbiAgICAgICAgICAgIG9uQXN5bmNTdWNjZXNzOiBmdW5jdGlvbiBvbkFzeW5jU3VjY2VzcyhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSwgbXNnKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZURhdGE6IG51bGxcbiAgICAgIH0sXG4gICAgICB0ZW1wRGF0YToge1xuICAgICAgICBkZWZhdWx0RGlzcGxheVRleHQ6IFwiXCJcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICB3YXRjaDoge1xuICAgIGJpbmRUb1NlYXJjaEZpZWxkUHJvcDogZnVuY3Rpb24gYmluZFRvU2VhcmNoRmllbGRQcm9wKG5ld1ZhbHVlKSB7XG4gICAgICBjb25zb2xlLmxvZyhuZXdWYWx1ZSk7XG4gICAgfSxcbiAgICBkZWZhdWx0VmFsdWVQcm9wOiBmdW5jdGlvbiBkZWZhdWx0VmFsdWVQcm9wKG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICBpZiAoIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eSh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSkpIHtcbiAgICAgICAgdGhpcy50ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHQgPSBEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQodGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUsIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5iaW5kVG9GaWVsZCA9IHRoaXMuYmluZFRvRmllbGRQcm9wO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdChkYXRhU2V0UE8pIHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGFTZXRQTyk7XG4gICAgICB2YXIgdHJlZU5vZGVBcnJheSA9IFtdO1xuICAgICAgdmFyIHJvb3ROb2RlID0ge1xuICAgICAgICBwaWQ6IFwiLTFcIixcbiAgICAgICAgdGV4dDogZGF0YVNldFBPLmRzTmFtZSxcbiAgICAgICAgaWQ6IGRhdGFTZXRQTy5kc0lkLFxuICAgICAgICBub2RlVHlwZTogXCJEYXRhU2V0XCJcbiAgICAgIH07XG4gICAgICB0cmVlTm9kZUFycmF5LnB1c2gocm9vdE5vZGUpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFTZXRQTy5yZWxhdGVkVGFibGVWb0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdHJlZU5vZGVBcnJheS5wdXNoKHtcbiAgICAgICAgICBwaWQ6IGRhdGFTZXRQTy5kc0lkLFxuICAgICAgICAgIHRleHQ6IGRhdGFTZXRQTy5yZWxhdGVkVGFibGVWb0xpc3RbaV0ucnRUYWJsZUNhcHRpb24sXG4gICAgICAgICAgaWQ6IGRhdGFTZXRQTy5yZWxhdGVkVGFibGVWb0xpc3RbaV0ucnRUYWJsZUlkLFxuICAgICAgICAgIG5vZGVUeXBlOiBcIlRhYmxlXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBkYXRhU2V0UE8ucmVsYXRlZFRhYmxlVm9MaXN0W2ldLnRhYmxlRmllbGRQT0xpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICB2YXIgc2luZ2xlTm9kZSA9IGRhdGFTZXRQTy5yZWxhdGVkVGFibGVWb0xpc3RbaV0udGFibGVGaWVsZFBPTGlzdFtqXTtcbiAgICAgICAgICBzaW5nbGVOb2RlLnBpZCA9IGRhdGFTZXRQTy5yZWxhdGVkVGFibGVWb0xpc3RbaV0ucnRUYWJsZUlkO1xuICAgICAgICAgIHNpbmdsZU5vZGUudGV4dCA9IHNpbmdsZU5vZGUuZmllbGRDYXB0aW9uICsgXCJbXCIgKyBzaW5nbGVOb2RlLmZpZWxkTmFtZSArIFwiXVwiO1xuICAgICAgICAgIHNpbmdsZU5vZGUubm9kZVR5cGUgPSBcIlRhYmxlRmllbGRcIjtcbiAgICAgICAgICBzaW5nbGVOb2RlLmlkID0gc2luZ2xlTm9kZS5maWVsZElkO1xuICAgICAgICAgIHNpbmdsZU5vZGUuaWNvbiA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9UaGVtZXMvUG5nMTZYMTYvcGFnZS5wbmdcIjtcbiAgICAgICAgICB0cmVlTm9kZUFycmF5LnB1c2goc2luZ2xlTm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy50cmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJCh0aGlzLiRyZWZzLnpUcmVlVUwpLCB0aGlzLnRyZWUudHJlZVNldHRpbmcsIHRyZWVOb2RlQXJyYXkpO1xuICAgICAgdGhpcy50cmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKHRoaXMudHJlZS50cmVlT2JqLCB0aGlzLiRyZWZzLnR4dF9zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG4gICAgfSxcbiAgICBzZWxlY3RDb2x1bW46IGZ1bmN0aW9uIHNlbGVjdENvbHVtbihmaWVsZFBPKSB7XG4gICAgICBpZiAoZmllbGRQTy5ub2RlVHlwZSA9PSBcIlRhYmxlRmllbGRcIikge1xuICAgICAgICB0aGlzLmJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtblRhYmxlTmFtZSA9IGZpZWxkUE8udGFibGVOYW1lO1xuICAgICAgICB0aGlzLmJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbk5hbWUgPSBmaWVsZFBPLmZpZWxkTmFtZTtcbiAgICAgICAgdGhpcy5iaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5DYXB0aW9uID0gZmllbGRQTy5maWVsZENhcHRpb247XG4gICAgICAgIHRoaXMuYmluZFRvU2VhcmNoRmllbGQuY29sdW1uRGF0YVR5cGVOYW1lID0gZmllbGRQTy5maWVsZERhdGFUeXBlO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYmluZFRvU2VhcmNoRmllbGQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYmluZFRvU2VhcmNoRmllbGQ6IHRoaXMuYmluZFRvU2VhcmNoRmllbGQsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdGhpcy5kZWZhdWx0VmFsdWVcbiAgICAgIH07XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbiBzZXREYXRhKGJpbmRUb1NlYXJjaEZpZWxkLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGJpbmRUb1NlYXJjaEZpZWxkKTtcbiAgICAgIHRoaXMuYmluZFRvU2VhcmNoRmllbGQgPSBiaW5kVG9TZWFyY2hGaWVsZDtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgICAgdGhpcy50ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHQgPSBEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQodGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUsIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0KTtcbiAgICB9LFxuICAgIHNlbGVjdERlZmF1bHRWYWx1ZVZpZXc6IGZ1bmN0aW9uIHNlbGVjdERlZmF1bHRWYWx1ZVZpZXcoKSB7XG4gICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB0aGlzO1xuICAgICAgd2luZG93LnBhcmVudC5saXN0RGVzaWduLnNlbGVjdERlZmF1bHRWYWx1ZURpYWxvZ0JlZ2luKHdpbmRvdywgbnVsbCk7XG4gICAgfSxcbiAgICBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlID0gcmVzdWx0LlR5cGU7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRWYWx1ZSA9IHJlc3VsdC5WYWx1ZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQgPSByZXN1bHQuVGV4dDtcbiAgICAgICAgdGhpcy50ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHQgPSBEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQodGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUsIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IFwiXCI7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGNlbGxzcGFjaW5nPVxcXCIwXFxcIiBib3JkZXI9XFxcIjBcXFwiIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAyODBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIC8+XFxuICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NjgwN1xcdTk4OThcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5UaXRsZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHJvd3NwYW49XFxcIjlcXFwiIHZhbGlnbj1cXFwidG9wXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cXFwiaW5wdXRfYm9yZGVyX2JvdHRvbVxcXCIgcmVmPVxcXCJ0eHRfc2VhcmNoX3RleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVcXHU1MjE3XFx1NTQwRFxcdTYyMTZcXHU4MDA1XFx1NjgwN1xcdTk4OThcXFwiPjwvaS1pbnB1dD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCByZWY9XFxcInpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZSBkaXYtY3VzdG9tLXNjcm9sbFxcXCIgc3R5bGU9XFxcImhlaWdodDogNDMwcHg7b3ZlcmZsb3cteDpoaWRkZW47b3ZlcmZsb3cteTogc2Nyb2xsXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2MjQwXFx1NUM1RVxcdTg4NjhcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7YmluZFRvU2VhcmNoRmllbGQuY29sdW1uVGFibGVOYW1lfX1cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1N0VEMVxcdTVCOUFcXHU1QjU3XFx1NkJCNVxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3tiaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5DYXB0aW9ufX1cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NUI1N1xcdTZCQjVcXHU1NDBEXFx1NzlGMFxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3tiaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5OYW1lfX1cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NUI1N1xcdTZCQjVcXHU3QzdCXFx1NTc4QlxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3tiaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5EYXRhVHlwZU5hbWV9fVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU4RkQwXFx1N0I5N1xcdTdCMjZcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCB2LW1vZGVsPVxcXCJiaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5PcGVyYXRvclxcXCIgc3R5bGU9XFxcIndpZHRoOjI2MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcImVxXFxcIj5cXHU3QjQ5XFx1NEU4RTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJsaWtlXFxcIj5cXHU1MzM5XFx1OTE0RDwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJub3RfZXFcXFwiPlxcdTRFMERcXHU3QjQ5XFx1NEU4RTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJndFxcXCI+XFx1NTkyN1xcdTRFOEU8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2YWx1ZT1cXFwiZ3RfZXFcXFwiPlxcdTU5MjdcXHU0RThFXFx1N0I0OVxcdTRFOEU8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2YWx1ZT1cXFwibHRcXFwiPlxcdTVDMEZcXHU0RThFPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcImx0X2VxXFxcIj5cXHU1QzBGXFx1NEU4RVxcdTdCNDlcXHU0RThFPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcImxlZnRfbGlrZVxcXCI+XFx1NURFNlxcdTUzMzlcXHU5MTREPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcInJpZ2h0X2xpa2VcXFwiPlxcdTUzRjNcXHU1MzM5XFx1OTE0RDwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJpbmNsdWRlXFxcIj5cXHU1MzA1XFx1NTQyQltcXHU2NjgyXFx1NjVGNlxcdTRFMERcXHU2NTJGXFx1NjMwMV08L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjJcXFwiPlxcdTlFRDhcXHU4QkE0XFx1NTAzQzxidXR0b24gY2xhc3M9XFxcImJ0bi1zZWxlY3QgZnJpZ2h0XFxcIiB2LW9uOmNsaWNrPVxcXCJzZWxlY3REZWZhdWx0VmFsdWVWaWV3XFxcIj4uLi48L2J1dHRvbj48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHN0eWxlPVxcXCJoZWlnaHQ6IDM1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiMlxcXCIgc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7dGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0fX1cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NTkwN1xcdTZDRThcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVxcXCI4XFxcIj48L3RleHRhcmVhPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImxpc3QtdGFibGUtbGFiZWwtYmluZC10by1jb21wXCIsIHtcbiAgcHJvcHM6IFtcImJpbmRQcm9wUHJvcFwiLCBcImRhdGFTZXRJZFwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGJpbmRQcm9wOiB7XG4gICAgICAgIGNvbHVtblRhYmxlTmFtZTogXCJcIixcbiAgICAgICAgY29sdW1uTmFtZTogXCJcIixcbiAgICAgICAgY29sdW1uQ2FwdGlvbjogXCJcIixcbiAgICAgICAgY29sdW1uRGF0YVR5cGVOYW1lOiBcIlwiLFxuICAgICAgICB0YXJnZXRCdXR0b25JZDogXCJcIixcbiAgICAgICAgY29sdW1uQWxpZ246IFwi5bGF5Lit5a+56b2QXCJcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0VmFsdWU6IHtcbiAgICAgICAgZGVmYXVsdFR5cGU6IFwiXCIsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFRleHQ6IFwiXCJcbiAgICAgIH0sXG4gICAgICB0cmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIGNoa1N0eWxlOiBcInJhZGlvXCIsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGlkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0Q29sdW1uKHRyZWVOb2RlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkRibENsaWNrOiBmdW5jdGlvbiBvbkRibENsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7fSxcbiAgICAgICAgICAgIG9uQXN5bmNTdWNjZXNzOiBmdW5jdGlvbiBvbkFzeW5jU3VjY2VzcyhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSwgbXNnKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZURhdGE6IG51bGxcbiAgICAgIH0sXG4gICAgICB0ZW1wRGF0YToge1xuICAgICAgICBkZWZhdWx0RGlzcGxheVRleHQ6IFwiXCJcbiAgICAgIH0sXG4gICAgICBidXR0b25zOiBbXVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgYmluZFByb3BQcm9wOiBmdW5jdGlvbiBiaW5kUHJvcFByb3AobmV3VmFsdWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKG5ld1ZhbHVlKTtcbiAgICB9LFxuICAgIGRlZmF1bHRWYWx1ZVByb3A6IGZ1bmN0aW9uIGRlZmF1bHRWYWx1ZVByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlKSkge1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dCh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSwgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJpbmRUb0ZpZWxkID0gdGhpcy5iaW5kVG9GaWVsZFByb3A7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGRhdGFTZXRWbywgYnV0dG9ucykge1xuICAgICAgY29uc29sZS5sb2coZGF0YVNldFZvKTtcbiAgICAgIHZhciB0cmVlTm9kZUFycmF5ID0gW107XG4gICAgICB2YXIgdHJlZU5vZGVEYXRhID0gZGF0YVNldFZvLmNvbHVtblZvTGlzdDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmVlTm9kZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNpbmdsZU5vZGUgPSB0cmVlTm9kZURhdGFbaV07XG4gICAgICAgIHNpbmdsZU5vZGUucGlkID0gZGF0YVNldFZvLmRzSWQ7XG4gICAgICAgIHNpbmdsZU5vZGUudGV4dCA9IHNpbmdsZU5vZGUuY29sdW1uQ2FwdGlvbiArIFwiW1wiICsgc2luZ2xlTm9kZS5jb2x1bW5OYW1lICsgXCJdXCI7XG4gICAgICAgIHNpbmdsZU5vZGUubm9kZVR5cGUgPSBcIkRhdGFTZXRDb2x1bW5cIjtcbiAgICAgICAgc2luZ2xlTm9kZS5pZCA9IHNpbmdsZU5vZGUuY29sdW1uSWQ7XG4gICAgICAgIHNpbmdsZU5vZGUuaWNvbiA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9UaGVtZXMvUG5nMTZYMTYvcGFnZS5wbmdcIjtcbiAgICAgICAgdHJlZU5vZGVBcnJheS5wdXNoKHNpbmdsZU5vZGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcm9vdE5vZGUgPSB7XG4gICAgICAgIHBpZDogXCItMVwiLFxuICAgICAgICB0ZXh0OiBkYXRhU2V0Vm8uZHNOYW1lLFxuICAgICAgICBpZDogZGF0YVNldFZvLmRzSWQsXG4gICAgICAgIG5vZGVUeXBlOiBcIkRhdGFTZXRcIlxuICAgICAgfTtcbiAgICAgIHRyZWVOb2RlQXJyYXkucHVzaChyb290Tm9kZSk7XG4gICAgICB0aGlzLnRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKHRoaXMuJHJlZnMuelRyZWVVTCksIHRoaXMudHJlZS50cmVlU2V0dGluZywgdHJlZU5vZGVBcnJheSk7XG4gICAgICB0aGlzLnRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICB0aGlzLmJ1dHRvbnMgPSBidXR0b25zO1xuICAgIH0sXG4gICAgc2VsZWN0Q29sdW1uOiBmdW5jdGlvbiBzZWxlY3RDb2x1bW4oY29sdW1uVm8pIHtcbiAgICAgIHRoaXMuYmluZFByb3AuY29sdW1uVGFibGVOYW1lID0gY29sdW1uVm8uY29sdW1uVGFibGVOYW1lO1xuICAgICAgdGhpcy5iaW5kUHJvcC5jb2x1bW5OYW1lID0gY29sdW1uVm8uY29sdW1uTmFtZTtcbiAgICAgIHRoaXMuYmluZFByb3AuY29sdW1uQ2FwdGlvbiA9IGNvbHVtblZvLmNvbHVtbkNhcHRpb247XG4gICAgICB0aGlzLmJpbmRQcm9wLmNvbHVtbkRhdGFUeXBlTmFtZSA9IGNvbHVtblZvLmNvbHVtbkRhdGFUeXBlTmFtZTtcbiAgICB9LFxuICAgIGdldERhdGE6IGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmJpbmRQcm9wKTtcblxuICAgICAgaWYgKCF0aGlzLmJpbmRQcm9wLnRhcmdldEJ1dHRvbklkKSB7XG4gICAgICAgIHRoaXMuYmluZFByb3AudGFyZ2V0QnV0dG9uSWQgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBiaW5kUHJvcDogdGhpcy5iaW5kUHJvcCxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLmRlZmF1bHRWYWx1ZVxuICAgICAgfTtcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uIHNldERhdGEoYmluZFByb3AsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgY29uc29sZS5sb2coYmluZFByb3ApO1xuICAgICAgdGhpcy5iaW5kUHJvcCA9IGJpbmRQcm9wO1xuICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dCh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSwgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQpO1xuICAgIH0sXG4gICAgc2VsZWN0RGVmYXVsdFZhbHVlVmlldzogZnVuY3Rpb24gc2VsZWN0RGVmYXVsdFZhbHVlVmlldygpIHtcbiAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHRoaXM7XG4gICAgICB3aW5kb3cucGFyZW50Lmxpc3REZXNpZ24uc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nQmVnaW4od2luZG93LCBudWxsKTtcbiAgICB9LFxuICAgIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUgPSByZXN1bHQuVHlwZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFZhbHVlID0gcmVzdWx0LlZhbHVlO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCA9IHJlc3VsdC5UZXh0O1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dCh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSwgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUgPSBcIlwiO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VmFsdWUgPSBcIlwiO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMudGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0ID0gXCJcIjtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjx0YWJsZSBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDI4MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU1QkY5XFx1OUY1MFxcdTY1QjlcXHU1RjBGXFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3Qgdi1tb2RlbD1cXFwiYmluZFByb3AuY29sdW1uQWxpZ25cXFwiIHN0eWxlPVxcXCJ3aWR0aDoyNjBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJcXHU1REU2XFx1NUJGOVxcdTlGNTBcXFwiPlxcdTVERTZcXHU1QkY5XFx1OUY1MDwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJcXHU1QzQ1XFx1NEUyRFxcdTVCRjlcXHU5RjUwXFxcIj5cXHU1QzQ1XFx1NEUyRFxcdTVCRjlcXHU5RjUwPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcIlxcdTUzRjNcXHU1QkY5XFx1OUY1MFxcXCI+XFx1NTNGM1xcdTVCRjlcXHU5RjUwPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCByb3dzcGFuPVxcXCI5XFxcIiB2YWxpZ249XFxcInRvcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgcmVmPVxcXCJ6VHJlZVVMXFxcIiBpZD1cXFwibGlzdC10YWJsZS1sYWJlbC1iaW5kLXRvLWNvbXAtdHJlZVxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OiA0NzBweDtvdmVyZmxvdzogYXV0b1xcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NjI0MFxcdTVDNUVcXHU4ODY4XFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2JpbmRQcm9wLmNvbHVtblRhYmxlTmFtZX19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTdFRDFcXHU1QjlBXFx1NUI1N1xcdTZCQjVcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7YmluZFByb3AuY29sdW1uQ2FwdGlvbn19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTVCNTdcXHU2QkI1XFx1NTQwRFxcdTc5RjBcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7YmluZFByb3AuY29sdW1uTmFtZX19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTVCNTdcXHU2QkI1XFx1N0M3QlxcdTU3OEJcXHVGRjFBIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2JpbmRQcm9wLmNvbHVtbkRhdGFUeXBlTmFtZX19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTg5RTZcXHU1M0QxXFx1NjMwOVxcdTk0QUVcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCB2LW1vZGVsPVxcXCJiaW5kUHJvcC50YXJnZXRCdXR0b25JZFxcXCIgc3R5bGU9XFxcIndpZHRoOjI2MHB4XFxcIiA6Y2xlYXJhYmxlPVxcXCJ0cnVlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gOnZhbHVlPVxcXCJpdGVtLmJ1dHRvbklkXFxcIiB2LWZvcj1cXFwiaXRlbSBpbiBidXR0b25zXFxcIj57e2l0ZW0uYnV0dG9uQ2FwdGlvbn19PC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIyXFxcIj5cXHU5RUQ4XFx1OEJBNFxcdTUwM0M8YnV0dG9uIGNsYXNzPVxcXCJidG4tc2VsZWN0IGZyaWdodFxcXCIgdi1vbjpjbGljaz1cXFwic2VsZWN0RGVmYXVsdFZhbHVlVmlld1xcXCI+Li4uPC9idXR0b24+PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBzdHlsZT1cXFwiaGVpZ2h0OiAzNXB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjJcXFwiIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e3RlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dH19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTU5MDdcXHU2Q0U4XFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cXFwiOFxcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJtb2R1bGUtbGlzdC13ZWJmb3JtLWNvbXBcIiwge1xuICBwcm9wczogWydsaXN0SGVpZ2h0JywgJ21vZHVsZURhdGEnLCAnYWN0aXZlVGFiTmFtZSddLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZWRpdFZpZXc6IFwiL0hUTUwvQnVpbGRlci9Gb3JtL0Zvcm1EZXNpZ24uaHRtbFwiLFxuICAgICAgICBwcmV2aWV3V2ViRm9ybVVybDogXCIvSFRNTC9CdWlsZGVyL0Zvcm0vRm9ybVByZXZpZXcuaHRtbFwiLFxuICAgICAgICByZWxvYWREYXRhOiBcIi9SZXN0L0J1aWxkZXIvRm9ybS9HZXRMaXN0RGF0YVwiLFxuICAgICAgICBcImRlbGV0ZVwiOiBcIi9SZXN0L0J1aWxkZXIvRm9ybS9EZWxldGVcIixcbiAgICAgICAgbW92ZTogXCIvUmVzdC9CdWlsZGVyL0Zvcm0vTW92ZVwiLFxuICAgICAgICBjb3B5Rm9ybTogXCIvUmVzdC9CdWlsZGVyL0Zvcm0vQ29weUZvcm1cIlxuICAgICAgfSxcbiAgICAgIGlkRmllbGROYW1lOiBcImZvcm1JZFwiLFxuICAgICAgc2VhcmNoQ29uZGl0aW9uOiB7XG4gICAgICAgIGZvcm1Nb2R1bGVJZDoge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLlN0cmluZ1R5cGVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgIHR5cGU6ICdzZWxlY3Rpb24nLFxuICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e8luWPtycsXG4gICAgICAgIGtleTogJ2Zvcm1Db2RlJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHdpZHRoOiA4MFxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+ihqOWNleWQjeensCcsXG4gICAgICAgIGtleTogJ2Zvcm1OYW1lJyxcbiAgICAgICAgYWxpZ246IFwibGVmdFwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5ZSv5LiA5ZCNJyxcbiAgICAgICAga2V5OiAnZm9ybVNpbmdsZU5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgIGtleTogJ2Zvcm1EZXNjJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJbovpHml7bpl7QnLFxuICAgICAgICBrZXk6ICdmb3JtVXBkYXRlVGltZScsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVSZW5kZXJlci5Ub0RhdGVZWVlZX01NX0REKGgsIHBhcmFtcy5yb3cuZm9ybVVwZGF0ZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnZm9ybUlkJyxcbiAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCBfc2VsZi5pZEZpZWxkTmFtZSwgX3NlbGYpLCBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkRlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIF9zZWxmLmlkRmllbGROYW1lLCBfc2VsZildKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgdGFibGVEYXRhT3JpZ2luYWw6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiA1MDAsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgc2VhcmNoVGV4dDogXCJcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgd2luZG93Ll9tb2R1bGVsaXN0d2ViZm9ybWNvbXAgPSB0aGlzO1xuICB9LFxuICB3YXRjaDoge1xuICAgIG1vZHVsZURhdGE6IGZ1bmN0aW9uIG1vZHVsZURhdGEobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGFjdGl2ZVRhYk5hbWU6IGZ1bmN0aW9uIGFjdGl2ZVRhYk5hbWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIHNlYXJjaFRleHQ6IGZ1bmN0aW9uIHNlYXJjaFRleHQobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgIHZhciBmaWx0ZXJUYWJsZURhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGVEYXRhW2ldO1xuXG4gICAgICAgICAgaWYgKHJvdy5mb3JtQ29kZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5mb3JtTmFtZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IGZpbHRlclRhYmxlRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gdGhpcy50YWJsZURhdGFPcmlnaW5hbDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRNb2R1bGVOYW1lOiBmdW5jdGlvbiBnZXRNb2R1bGVOYW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kdWxlRGF0YSA9PSBudWxsID8gXCLor7fpgInkuK3mqKHlnZdcIiA6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVUZXh0O1xuICAgIH0sXG4gICAgc2VsZWN0aW9uQ2hhbmdlOiBmdW5jdGlvbiBzZWxlY3Rpb25DaGFuZ2Uoc2VsZWN0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBzZWxlY3Rpb247XG4gICAgfSxcbiAgICByZWxvYWREYXRhOiBmdW5jdGlvbiByZWxvYWREYXRhKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsICYmIHRoaXMuYWN0aXZlVGFiTmFtZSA9PSBcImxpc3Qtd2ViZm9ybVwiKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmZvcm1Nb2R1bGVJZC52YWx1ZSA9IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZDtcbiAgICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoKHtcbiAgICAgICAgICB1cmw6IHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkRGF0YSxcbiAgICAgICAgICBwYWdlTnVtOiB0aGlzLnBhZ2VOdW0sXG4gICAgICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uOiB0aGlzLnNlYXJjaENvbmRpdGlvbixcbiAgICAgICAgICBwYWdlQXBwT2JqOiB0aGlzLFxuICAgICAgICAgIHRhYmxlTGlzdDogdGhpcyxcbiAgICAgICAgICBpZEZpZWxkOiB0aGlzLmlkRmllbGROYW1lLFxuICAgICAgICAgIGF1dG9TZWxlY3RlZE9sZFJvd3M6IHRydWUsXG4gICAgICAgICAgc3VjY2Vzc0Z1bmM6IGZ1bmN0aW9uIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaikge1xuICAgICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFPcmlnaW5hbCA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2FkRGljdDogZmFsc2UsXG4gICAgICAgICAgY3VzdFBhcmFzOiB7fVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJhZGRcIixcbiAgICAgICAgICBcIm1vZHVsZUlkXCI6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3VGFiV2luZG93KHVybCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nmqKHlnZchXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChyZWNvcmRJZCkge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRWaWV3LCB7XG4gICAgICAgIFwib3BcIjogXCJ1cGRhdGVcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZFxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdUYWJXaW5kb3codXJsKTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gZGVsKHJlY29yZElkKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZURlbGV0ZVJvdyh0aGlzLmFjSW50ZXJmYWNlW1wiZGVsZXRlXCJdLCByZWNvcmRJZCwgdGhpcyk7XG4gICAgfSxcbiAgICBzdGF0dXNFbmFibGU6IGZ1bmN0aW9uIHN0YXR1c0VuYWJsZShzdGF0dXNOYW1lKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHRoaXMuYWNJbnRlcmZhY2Uuc3RhdHVzQ2hhbmdlLCB0aGlzLnNlbGVjdGlvblJvd3MsIGFwcExpc3QuaWRGaWVsZE5hbWUsIHN0YXR1c05hbWUsIGFwcExpc3QpO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24gbW92ZSh0eXBlKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdNb3ZlRmFjZSh0aGlzLmFjSW50ZXJmYWNlLm1vdmUsIHRoaXMuc2VsZWN0aW9uUm93cywgdGhpcy5pZEZpZWxkTmFtZSwgdHlwZSwgdGhpcyk7XG4gICAgfSxcbiAgICBwcmV2aWV3V2ViRm9ybTogZnVuY3Rpb24gcHJldmlld1dlYkZvcm0oKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUodGhpcy5zZWxlY3Rpb25Sb3dzLCB0aGlzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICAgIHZhciByZWNvcmRJZCA9IHNlbGVjdGlvblJvd3NbMF1bdGhpcy5pZEZpZWxkTmFtZV07XG4gICAgICAgIHZhciBwcmV2aWV3VXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UucHJldmlld1dlYkZvcm1VcmwsIHtcbiAgICAgICAgICBGb3JtSWQ6IHJlY29yZElkLFxuICAgICAgICAgIE9wZXJhdGlvblR5cGU6IFwiYWRkXCIsXG4gICAgICAgICAgUmVjb3JkSWQ6IFN0cmluZ1V0aWxpdHkuR3VpZCgpXG4gICAgICAgIH0pO1xuICAgICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdUYWJXaW5kb3cocHJldmlld1VybCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNvcHk6IGZ1bmN0aW9uIGNvcHkoKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUodGhpcy5zZWxlY3Rpb25Sb3dzLCB0aGlzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICAgIHZhciByZWNvcmRJZCA9IHNlbGVjdGlvblJvd3NbMF1bdGhpcy5pZEZpZWxkTmFtZV07XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5jb3B5Rm9ybSwge1xuICAgICAgICAgIGZvcm1JZDogcmVjb3JkSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz1cXFwibW9kdWxlLWxpc3Qtd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVxcXCJsaXN0LWJ1dHRvbi13cmFwXFxcIiBjbGFzcz1cXFwibGlzdC1idXR0b24tb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibW9kdWxlLWxpc3QtbmFtZVxcXCI+PEljb24gdHlwZT1cXFwiaW9zLWFycm93LWRyb3ByaWdodC1jaXJjbGVcXFwiIC8+Jm5ic3A7XFx1NkEyMVxcdTU3NTdcXHUzMDEwe3tnZXRNb2R1bGVOYW1lKCl9fVxcdTMwMTE8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uICB0eXBlPVxcXCJzdWNjZXNzXFxcIiBAY2xpY2s9XFxcImFkZCgpXFxcIiBpY29uPVxcXCJtZC1hZGRcXFwiPlxcdTY1QjBcXHU1ODlFPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNvcHkoKVxcXCIgaWNvbj1cXFwibWQtYWxidW1zXFxcIj5cXHU1OTBEXFx1NTIzNjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJwcmV2aWV3V2ViRm9ybSgpXFxcIiAgaWNvbj1cXFwibWQtcHJpY2V0YWdcXFwiPlxcdTk4ODRcXHU4OUM4PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBkaXNhYmxlZCBpY29uPVxcXCJtZC1hZGRcXFwiPlxcdTVGMTVcXHU1MTY1VVJMIDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgZGlzYWJsZWQgaWNvbj1cXFwibWQtYm9va21hcmtzXFxcIj5cXHU1Mzg2XFx1NTNGMlxcdTcyNDhcXHU2NzJDPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcIm1vdmUoJ3VwJylcXFwiIGljb249XFxcIm1kLWFycm93LXVwXFxcIj5cXHU0RTBBXFx1NzlGQjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJtb3ZlKCdkb3duJylcXFwiIGljb249XFxcIm1kLWFycm93LWRvd25cXFwiPlxcdTRFMEJcXHU3OUZCPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Hcm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiAyMDBweDttYXJnaW4tcmlnaHQ6IDEwcHg7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVxcXCJpbnB1dF9ib3JkZXJfYm90dG9tXFxcIiB2LW1vZGVsPVxcXCJzZWFyY2hUZXh0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImNsZWFyOiBib3RoXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cXFwibGlzdEhlaWdodFxcXCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cXFwiY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcInRhYmxlRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBvbi1zZWxlY3Rpb24tY2hhbmdlPVxcXCJzZWxlY3Rpb25DaGFuZ2VcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwibW9kdWxlLWxpc3Qtd2VibGlzdC1jb21wXCIsIHtcbiAgcHJvcHM6IFsnbGlzdEhlaWdodCcsICdtb2R1bGVEYXRhJywgJ2FjdGl2ZVRhYk5hbWUnXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGVkaXRWaWV3OiBcIi9IVE1ML0J1aWxkZXIvTGlzdC9MaXN0RGVzaWduLmh0bWxcIixcbiAgICAgICAgcmVsb2FkRGF0YTogXCIvUmVzdC9CdWlsZGVyL0xpc3QvR2V0TGlzdERhdGFcIixcbiAgICAgICAgXCJkZWxldGVcIjogXCIvUmVzdC9CdWlsZGVyL0xpc3QvRGVsZXRlXCIsXG4gICAgICAgIG1vdmU6IFwiL1Jlc3QvQnVpbGRlci9MaXN0L01vdmVcIlxuICAgICAgfSxcbiAgICAgIGlkRmllbGROYW1lOiBcImxpc3RJZFwiLFxuICAgICAgc2VhcmNoQ29uZGl0aW9uOiB7XG4gICAgICAgIGxpc3RNb2R1bGVJZDoge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLlN0cmluZ1R5cGVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgIHR5cGU6ICdzZWxlY3Rpb24nLFxuICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e8luWPtycsXG4gICAgICAgIGtleTogJ2xpc3RDb2RlJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHdpZHRoOiA4MFxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+WIl+ihqOWQjeensCcsXG4gICAgICAgIGtleTogJ2xpc3ROYW1lJyxcbiAgICAgICAgYWxpZ246IFwibGVmdFwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5ZSv5LiA5ZCNJyxcbiAgICAgICAga2V5OiAnbGlzdFNpbmdsZU5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgIGtleTogJ2xpc3REZXNjJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJbovpHml7bpl7QnLFxuICAgICAgICBrZXk6ICdsaXN0VXBkYXRlVGltZScsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVSZW5kZXJlci5Ub0RhdGVZWVlZX01NX0REKGgsIHBhcmFtcy5yb3cubGlzdFVwZGF0ZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnbGlzdElkJyxcbiAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCBfc2VsZi5pZEZpZWxkTmFtZSwgX3NlbGYpLCBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkRlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIF9zZWxmLmlkRmllbGROYW1lLCBfc2VsZildKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgdGFibGVEYXRhT3JpZ2luYWw6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiA1MDAsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgc2VhcmNoVGV4dDogXCJcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgd2luZG93Ll9tb2R1bGVsaXN0d2VibGlzdGNvbXAgPSB0aGlzO1xuICB9LFxuICB3YXRjaDoge1xuICAgIG1vZHVsZURhdGE6IGZ1bmN0aW9uIG1vZHVsZURhdGEobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGFjdGl2ZVRhYk5hbWU6IGZ1bmN0aW9uIGFjdGl2ZVRhYk5hbWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIHNlYXJjaFRleHQ6IGZ1bmN0aW9uIHNlYXJjaFRleHQobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgIHZhciBmaWx0ZXJUYWJsZURhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGVEYXRhW2ldO1xuXG4gICAgICAgICAgaWYgKHJvdy5mb3JtQ29kZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5mb3JtTmFtZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IGZpbHRlclRhYmxlRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gdGhpcy50YWJsZURhdGFPcmlnaW5hbDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRNb2R1bGVOYW1lOiBmdW5jdGlvbiBnZXRNb2R1bGVOYW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kdWxlRGF0YSA9PSBudWxsID8gXCLor7fpgInkuK3mqKHlnZdcIiA6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVUZXh0O1xuICAgIH0sXG4gICAgc2VsZWN0aW9uQ2hhbmdlOiBmdW5jdGlvbiBzZWxlY3Rpb25DaGFuZ2Uoc2VsZWN0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBzZWxlY3Rpb247XG4gICAgfSxcbiAgICByZWxvYWREYXRhOiBmdW5jdGlvbiByZWxvYWREYXRhKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsICYmIHRoaXMuYWN0aXZlVGFiTmFtZSA9PSBcImxpc3Qtd2VibGlzdFwiKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmxpc3RNb2R1bGVJZC52YWx1ZSA9IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZDtcbiAgICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoKHtcbiAgICAgICAgICB1cmw6IHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkRGF0YSxcbiAgICAgICAgICBwYWdlTnVtOiB0aGlzLnBhZ2VOdW0sXG4gICAgICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uOiB0aGlzLnNlYXJjaENvbmRpdGlvbixcbiAgICAgICAgICBwYWdlQXBwT2JqOiB0aGlzLFxuICAgICAgICAgIHRhYmxlTGlzdDogdGhpcyxcbiAgICAgICAgICBpZEZpZWxkOiB0aGlzLmlkRmllbGROYW1lLFxuICAgICAgICAgIGF1dG9TZWxlY3RlZE9sZFJvd3M6IHRydWUsXG4gICAgICAgICAgc3VjY2Vzc0Z1bmM6IGZ1bmN0aW9uIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaikge1xuICAgICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFPcmlnaW5hbCA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2FkRGljdDogZmFsc2UsXG4gICAgICAgICAgY3VzdFBhcmFzOiB7fVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJhZGRcIixcbiAgICAgICAgICBcIm1vZHVsZUlkXCI6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3VGFiV2luZG93KHVybCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nmqKHlnZchXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChyZWNvcmRJZCkge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRWaWV3LCB7XG4gICAgICAgIFwib3BcIjogXCJ1cGRhdGVcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZFxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdUYWJXaW5kb3codXJsKTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gZGVsKHJlY29yZElkKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZURlbGV0ZVJvdyh0aGlzLmFjSW50ZXJmYWNlW1wiZGVsZXRlXCJdLCByZWNvcmRJZCwgdGhpcyk7XG4gICAgfSxcbiAgICBzdGF0dXNFbmFibGU6IGZ1bmN0aW9uIHN0YXR1c0VuYWJsZShzdGF0dXNOYW1lKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHRoaXMuYWNJbnRlcmZhY2Uuc3RhdHVzQ2hhbmdlLCB0aGlzLnNlbGVjdGlvblJvd3MsIGFwcExpc3QuaWRGaWVsZE5hbWUsIHN0YXR1c05hbWUsIGFwcExpc3QpO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24gbW92ZSh0eXBlKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdNb3ZlRmFjZSh0aGlzLmFjSW50ZXJmYWNlLm1vdmUsIHRoaXMuc2VsZWN0aW9uUm93cywgdGhpcy5pZEZpZWxkTmFtZSwgdHlwZSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtb2R1bGUtbGlzdC13cmFwXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3QtYnV0dG9uLXdyYXBcIiBjbGFzcz1cImxpc3QtYnV0dG9uLW91dGVyLXdyYXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZHVsZS1saXN0LW5hbWVcIj48SWNvbiB0eXBlPVwiaW9zLWFycm93LWRyb3ByaWdodC1jaXJjbGVcIiAvPiZuYnNwO+aooeWdl+OAkHt7Z2V0TW9kdWxlTmFtZSgpfX3jgJE8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtYnV0dG9uLWlubmVyLXdyYXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cD5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gIHR5cGU9XCJzdWNjZXNzXCIgQGNsaWNrPVwiYWRkKClcIiBpY29uPVwibWQtYWRkXCI+5paw5aKePC9pLWJ1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLWFsYnVtc1wiPuWkjeWItjwvaS1idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJlcnJvclwiIGljb249XCJtZC1wcmljZXRhZ1wiPumihOiniDwvaS1idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJlcnJvclwiIGljb249XCJtZC1ib29rbWFya3NcIj7ljoblj7LniYjmnKw8L2ktYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYnJ1c2hcIj7lpI3liLZJRDwvaS1idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwibW92ZShcXCd1cFxcJylcIiBpY29uPVwibWQtYXJyb3ctdXBcIj7kuIrnp7s8L2ktYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cIm1vdmUoXFwnZG93blxcJylcIiBpY29uPVwibWQtYXJyb3ctZG93blwiPuS4i+enuzwvaS1idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogcmlnaHQ7d2lkdGg6IDIwMHB4O21hcmdpbi1yaWdodDogMTBweDtcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cImlucHV0X2JvcmRlcl9ib3R0b21cIiB2LW1vZGVsPVwic2VhcmNoVGV4dFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImNsZWFyOiBib3RoXCI+PC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cImxpc3RIZWlnaHRcIiBzdHJpcGUgYm9yZGVyIDpjb2x1bW5zPVwiY29sdW1uc0NvbmZpZ1wiIDpkYXRhPVwidGFibGVEYXRhXCJcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIml2LWxpc3QtdGFibGVcIiA6aGlnaGxpZ2h0LXJvdz1cInRydWVcIlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBvbi1zZWxlY3Rpb24tY2hhbmdlPVwic2VsZWN0aW9uQ2hhbmdlXCI+PC9pLXRhYmxlPlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJtb2R1bGUtbGlzdC13b3JrZmxvdy1jb21wXCIsIHtcbiAgcHJvcHM6IFsnbGlzdEhlaWdodCcsICdtb2R1bGVEYXRhJywgJ2FjdGl2ZVRhYk5hbWUnXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGVkaXRWaWV3OiBcIi9IVE1ML1dvcmtGbG93L01vZGVsZXIvSW5kZXguaHRtbFwiLFxuICAgICAgICByZWxvYWREYXRhOiBcIi9SZXN0L0J1aWxkZXIvRmxvd0ludGVncmF0ZWQvR2V0TGlzdERhdGFcIixcbiAgICAgICAgXCJkZWxldGVcIjogXCIvUmVzdC9CdWlsZGVyL0Zsb3dJbnRlZ3JhdGVkL0RlbGV0ZVwiLFxuICAgICAgICBtb3ZlOiBcIi9SZXN0L0J1aWxkZXIvRmxvd0ludGVncmF0ZWQvTW92ZVwiXG4gICAgICB9LFxuICAgICAgaWRGaWVsZE5hbWU6IFwiaW50ZWdyYXRlZElkXCIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IHtcbiAgICAgICAgaW50ZWdyYXRlZE1vZHVsZUlkOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW5Y+3JyxcbiAgICAgICAga2V5OiAnaW50ZWdyYXRlZENvZGUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgd2lkdGg6IDgwXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5qih5Z6L5ZCN56ewJyxcbiAgICAgICAga2V5OiAnaW50ZWdyYXRlZE5hbWUnLFxuICAgICAgICBhbGlnbjogXCJsZWZ0XCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflkK/liqhLZXknLFxuICAgICAgICBrZXk6ICdpbnRlZ3JhdGVkU3RhcnRLZXknLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgIGtleTogJ2ludGVncmF0ZWREZXNjJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJbovpHml7bpl7QnLFxuICAgICAgICBrZXk6ICdpbnRlZ3JhdGVkVXBkYXRlVGltZScsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVSZW5kZXJlci5Ub0RhdGVZWVlZX01NX0REKGgsIHBhcmFtcy5yb3cuaW50ZWdyYXRlZFVwZGF0ZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnaW50ZWdyYXRlZElkJyxcbiAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCBfc2VsZi5pZEZpZWxkTmFtZSwgX3NlbGYpLCBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkRlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIF9zZWxmLmlkRmllbGROYW1lLCBfc2VsZildKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgdGFibGVEYXRhT3JpZ2luYWw6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiA1MDAsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgc2VhcmNoVGV4dDogXCJcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgd2luZG93Ll9tb2R1bGVsaXN0d2VibGlzdGNvbXAgPSB0aGlzO1xuICB9LFxuICB3YXRjaDoge1xuICAgIG1vZHVsZURhdGE6IGZ1bmN0aW9uIG1vZHVsZURhdGEobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGFjdGl2ZVRhYk5hbWU6IGZ1bmN0aW9uIGFjdGl2ZVRhYk5hbWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIHNlYXJjaFRleHQ6IGZ1bmN0aW9uIHNlYXJjaFRleHQobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgIHZhciBmaWx0ZXJUYWJsZURhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGVEYXRhW2ldO1xuXG4gICAgICAgICAgaWYgKHJvdy5mb3JtQ29kZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5mb3JtTmFtZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IGZpbHRlclRhYmxlRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gdGhpcy50YWJsZURhdGFPcmlnaW5hbDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRNb2R1bGVOYW1lOiBmdW5jdGlvbiBnZXRNb2R1bGVOYW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kdWxlRGF0YSA9PSBudWxsID8gXCLor7fpgInkuK3mqKHlnZdcIiA6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVUZXh0O1xuICAgIH0sXG4gICAgc2VsZWN0aW9uQ2hhbmdlOiBmdW5jdGlvbiBzZWxlY3Rpb25DaGFuZ2Uoc2VsZWN0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBzZWxlY3Rpb247XG4gICAgfSxcbiAgICByZWxvYWREYXRhOiBmdW5jdGlvbiByZWxvYWREYXRhKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsICYmIHRoaXMuYWN0aXZlVGFiTmFtZSA9PSBcImxpc3Qtd2VibGlzdFwiKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmludGVncmF0ZWRNb2R1bGVJZC52YWx1ZSA9IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZDtcbiAgICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoKHtcbiAgICAgICAgICB1cmw6IHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkRGF0YSxcbiAgICAgICAgICBwYWdlTnVtOiB0aGlzLnBhZ2VOdW0sXG4gICAgICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uOiB0aGlzLnNlYXJjaENvbmRpdGlvbixcbiAgICAgICAgICBwYWdlQXBwT2JqOiB0aGlzLFxuICAgICAgICAgIHRhYmxlTGlzdDogdGhpcyxcbiAgICAgICAgICBpZEZpZWxkOiB0aGlzLmlkRmllbGROYW1lLFxuICAgICAgICAgIGF1dG9TZWxlY3RlZE9sZFJvd3M6IHRydWUsXG4gICAgICAgICAgc3VjY2Vzc0Z1bmM6IGZ1bmN0aW9uIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaikge1xuICAgICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFPcmlnaW5hbCA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2FkRGljdDogZmFsc2UsXG4gICAgICAgICAgY3VzdFBhcmFzOiB7fVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJhZGRcIixcbiAgICAgICAgICBcIm1vZHVsZUlkXCI6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3VGFiV2luZG93KHVybCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nmqKHlnZchXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChyZWNvcmRJZCkge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRWaWV3LCB7XG4gICAgICAgIFwib3BcIjogXCJ1cGRhdGVcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZFxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdUYWJXaW5kb3codXJsKTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gZGVsKHJlY29yZElkKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZURlbGV0ZVJvdyh0aGlzLmFjSW50ZXJmYWNlW1wiZGVsZXRlXCJdLCByZWNvcmRJZCwgdGhpcyk7XG4gICAgfSxcbiAgICBzdGF0dXNFbmFibGU6IGZ1bmN0aW9uIHN0YXR1c0VuYWJsZShzdGF0dXNOYW1lKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHRoaXMuYWNJbnRlcmZhY2Uuc3RhdHVzQ2hhbmdlLCB0aGlzLnNlbGVjdGlvblJvd3MsIGFwcExpc3QuaWRGaWVsZE5hbWUsIHN0YXR1c05hbWUsIGFwcExpc3QpO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24gbW92ZSh0eXBlKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdNb3ZlRmFjZSh0aGlzLmFjSW50ZXJmYWNlLm1vdmUsIHRoaXMuc2VsZWN0aW9uUm93cywgdGhpcy5pZEZpZWxkTmFtZSwgdHlwZSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPVxcXCJtb2R1bGUtbGlzdC13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XFxcImxpc3QtYnV0dG9uLXdyYXBcXFwiIGNsYXNzPVxcXCJsaXN0LWJ1dHRvbi1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtb2R1bGUtbGlzdC1uYW1lXFxcIj48SWNvbiB0eXBlPVxcXCJpb3MtYXJyb3ctZHJvcHJpZ2h0LWNpcmNsZVxcXCIgLz4mbmJzcDtcXHU2QTIxXFx1NTc1N1xcdTMwMTB7e2dldE1vZHVsZU5hbWUoKX19XFx1MzAxMTwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXA+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gIHR5cGU9XFxcInN1Y2Nlc3NcXFwiIEBjbGljaz1cXFwiYWRkKClcXFwiIGljb249XFxcIm1kLWFkZFxcXCI+XFx1NjVCMFxcdTU4OUU8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcImVycm9yXFxcIiBpY29uPVxcXCJtZC1hbGJ1bXNcXFwiIGRpc2FibGVkPlxcdTU5MERcXHU1MjM2PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJlcnJvclxcXCIgaWNvbj1cXFwibWQtYm9va21hcmtzXFxcIiBkaXNhYmxlZD5cXHU1Mzg2XFx1NTNGMlxcdTcyNDhcXHU2NzJDPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJlcnJvclxcXCIgaWNvbj1cXFwibWQtYnJ1c2hcXFwiIGRpc2FibGVkPlxcdTU5MERcXHU1MjM2SUQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcImVycm9yXFxcIiBpY29uPVxcXCJtZC1hcnJvdy11cFxcXCIgZGlzYWJsZWQ+XFx1NEUwQVxcdTc5RkI8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcImVycm9yXFxcIiBpY29uPVxcXCJtZC1hcnJvdy1kb3duXFxcIiBkaXNhYmxlZD5cXHU0RTBCXFx1NzlGQjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OiByaWdodDt3aWR0aDogMjAwcHg7bWFyZ2luLXJpZ2h0OiAxMHB4O1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cXFwiaW5wdXRfYm9yZGVyX2JvdHRvbVxcXCIgdi1tb2RlbD1cXFwic2VhcmNoVGV4dFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJjbGVhcjogYm90aFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XFxcImxpc3RIZWlnaHRcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJ0YWJsZURhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tc2VsZWN0aW9uLWNoYW5nZT1cXFwic2VsZWN0aW9uQ2hhbmdlXFxcIj48L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1kYmxpbmstc2luZ2xlLWNvbXBcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXREQkxpbmtEYXRhVXJsOiBcIi9SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvREJMaW5rL0dldEZ1bGxEQkxpbmtcIixcbiAgICAgICAgZ2V0U2luZ2xlREJMaW5rRGF0YVVybDogXCIvUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RCTGluay9HZXREZXRhaWxEYXRhXCJcbiAgICAgIH0sXG4gICAgICBqc0VkaXRvckluc3RhbmNlOiBudWxsLFxuICAgICAgZGJMaW5rVHJlZToge1xuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJkYkxpbmtOYW1lXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiZGJJZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwiZGJPcmRlck51bVwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERCTGluayh0cmVlTm9kZSk7XG5cbiAgICAgICAgICAgICAgX3NlbGYuaGFuZGxlQ2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVEYXRhOiBudWxsLFxuICAgICAgICBjbGlja05vZGU6IG51bGxcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZERCTGlua0RhdGE6IG51bGxcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzLnNlbGVjdERCTGlua01vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdERCTGluazogZnVuY3Rpb24gYmVnaW5TZWxlY3REQkxpbmsoKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0REJMaW5rTW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5nZXREQkxpbmtEYXRhSW5pdFRyZWUoKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNDcwLFxuICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup5pWw5o2u5bqT6L+e5o6lXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0REJMaW5rRGF0YUluaXRUcmVlOiBmdW5jdGlvbiBnZXREQkxpbmtEYXRhSW5pdFRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0REJMaW5rRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuZGJMaW5rVHJlZS50cmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfc2VsZi5kYkxpbmtUcmVlLnRyZWVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBfc2VsZi5kYkxpbmtUcmVlLnRyZWVEYXRhW2ldLmljb24gPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvVGhlbWVzL1BuZzE2WDE2L2RhdGFiYXNlX2Nvbm5lY3QucG5nXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3NlbGYuJHJlZnMuZGJMaW5rWlRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1kYkxpbmstc2luZ2xlLWNvbXAtXCIgKyBTdHJpbmdVdGlsaXR5Lkd1aWQoKSk7XG5cbiAgICAgICAgICBfc2VsZi5kYkxpbmtUcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChfc2VsZi4kcmVmcy5kYkxpbmtaVHJlZVVMKSwgX3NlbGYuZGJMaW5rVHJlZS50cmVlU2V0dGluZywgX3NlbGYuZGJMaW5rVHJlZS50cmVlRGF0YSk7XG5cbiAgICAgICAgICBfc2VsZi5kYkxpbmtUcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuXG4gICAgICAgICAgX3NlbGYuZGJMaW5rVHJlZS50cmVlT2JqLl9ob3N0ID0gX3NlbGY7XG4gICAgICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKF9zZWxmLmRiTGlua1RyZWUudHJlZU9iaiwgX3NlbGYuJHJlZnMudHh0X2RiTGlua19zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBzZWxlY3RlZERCTGluazogZnVuY3Rpb24gc2VsZWN0ZWREQkxpbmsoZGJMaW5rRGF0YSkge1xuICAgICAgdGhpcy5zZWxlY3RlZERCTGlua0RhdGEgPSBkYkxpbmtEYXRhO1xuICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtZGJsaW5rJywgZGJMaW5rRGF0YSk7XG4gICAgfSxcbiAgICBnZXRTZWxlY3RlZERCTGlua05hbWU6IGZ1bmN0aW9uIGdldFNlbGVjdGVkREJMaW5rTmFtZSgpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkREJMaW5rRGF0YSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcIuivt+mAieaLqeaVsOaNruW6k+i/nuaOpVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWREQkxpbmtEYXRhLmRiTGlua05hbWU7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRPbGRTZWxlY3RlZERCTGluazogZnVuY3Rpb24gc2V0T2xkU2VsZWN0ZWREQkxpbmsoZGJMaW5rSWQpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRTaW5nbGVEQkxpbmtEYXRhVXJsLCB7XG4gICAgICAgIFwicmVjb3JkSWRcIjogZGJMaW5rSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuc2VsZWN0ZWREQkxpbmtEYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0LXZpZXctZGJsaW5rLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRleHRcXFwiPnt7Z2V0U2VsZWN0ZWREQkxpbmtOYW1lKCl9fTwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInZhbHVlXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uXFxcIiBAY2xpY2s9XFxcImJlZ2luU2VsZWN0REJMaW5rKClcXFwiPjxJY29uIHR5cGU9XFxcImlvcy1mdW5uZWxcXFwiIC8+Jm5ic3A7XFx1OTAwOVxcdTYyRTk8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9XFxcInNlbGVjdERCTGlua01vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtc291cmNlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XFxcImlucHV0X2JvcmRlcl9ib3R0b21cXFwiIHJlZj1cXFwidHh0X2RiTGlua19zZWFyY2hfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NVxcdTY1NzBcXHU2MzZFXFx1NUU5M1xcdThGREVcXHU2M0E1XFx1NTQwRFxcdTc5RjBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXAgZGl2LWN1c3RvbS1zY3JvbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwiZGJMaW5rWlRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzZWxlY3Qtc2l0ZS1zaW5nbGUtY29tcFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldERCTGlua0RhdGFVcmw6IFwiL1Jlc3QvQnVpbGRlci9TaXRlSW5mby9HZXRGdWxsU2l0ZVwiLFxuICAgICAgICBnZXRTaW5nbGVEQkxpbmtEYXRhVXJsOiBcIi9SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvREJMaW5rL0dldERldGFpbERhdGFcIlxuICAgICAgfSxcbiAgICAgIGpzRWRpdG9ySW5zdGFuY2U6IG51bGwsXG4gICAgICBzaXRlVHJlZToge1xuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJzaXRlTmFtZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcInNpdGVJZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwic2l0ZU9yZGVyTnVtXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLl9ob3N0O1xuXG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkU2l0ZSh0cmVlTm9kZSk7XG5cbiAgICAgICAgICAgICAgX3NlbGYuaGFuZGxlQ2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVEYXRhOiBudWxsLFxuICAgICAgICBjbGlja05vZGU6IG51bGxcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZFNpdGVEYXRhOiBudWxsXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3RTaXRlTW9kZWxEaWFsb2dXcmFwKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0U2l0ZTogZnVuY3Rpb24gYmVnaW5TZWxlY3RTaXRlKCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNlbGVjdFNpdGVNb2RlbERpYWxvZ1dyYXA7XG4gICAgICB0aGlzLmdldFNpdGVEYXRhSW5pdFRyZWUoKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNDcwLFxuICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup56uZ54K5XCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0U2l0ZURhdGFJbml0VHJlZTogZnVuY3Rpb24gZ2V0U2l0ZURhdGFJbml0VHJlZSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXREQkxpbmtEYXRhVXJsLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5zaXRlVHJlZS50cmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfc2VsZi5zaXRlVHJlZS50cmVlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgX3NlbGYuc2l0ZVRyZWUudHJlZURhdGFbaV0uaWNvbiA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9UaGVtZXMvUG5nMTZYMTYvZGF0YWJhc2VfY29ubmVjdC5wbmdcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfc2VsZi4kcmVmcy5zaXRlWlRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1kYkxpbmstc2luZ2xlLWNvbXAtXCIgKyBTdHJpbmdVdGlsaXR5Lkd1aWQoKSk7XG5cbiAgICAgICAgICBfc2VsZi5zaXRlVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoX3NlbGYuJHJlZnMuc2l0ZVpUcmVlVUwpLCBfc2VsZi5zaXRlVHJlZS50cmVlU2V0dGluZywgX3NlbGYuc2l0ZVRyZWUudHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYuc2l0ZVRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG5cbiAgICAgICAgICBfc2VsZi5zaXRlVHJlZS50cmVlT2JqLl9ob3N0ID0gX3NlbGY7XG4gICAgICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKF9zZWxmLnNpdGVUcmVlLnRyZWVPYmosIF9zZWxmLiRyZWZzLnR4dF9zaXRlX3NlYXJjaF90ZXh0LiRyZWZzLmlucHV0LCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIHNlbGVjdGVkU2l0ZTogZnVuY3Rpb24gc2VsZWN0ZWRTaXRlKHNpdGVEYXRhKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkU2l0ZURhdGEgPSBzaXRlRGF0YTtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLXNpdGUnLCBzaXRlRGF0YSk7XG4gICAgfSxcbiAgICBnZXRTZWxlY3RlZFNpdGVOYW1lOiBmdW5jdGlvbiBnZXRTZWxlY3RlZFNpdGVOYW1lKCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRTaXRlRGF0YSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcIuivt+mAieaLqeermeeCuVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRTaXRlRGF0YS5zaXRlTmFtZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldE9sZFNlbGVjdGVkU2l0ZTogZnVuY3Rpb24gc2V0T2xkU2VsZWN0ZWRTaXRlKGRiTGlua0lkKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0U2luZ2xlREJMaW5rRGF0YVVybCwge1xuICAgICAgICBcInJlY29yZElkXCI6IGRiTGlua0lkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLnNlbGVjdGVkU2l0ZURhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3Qtdmlldy1kYmxpbmstd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGV4dFxcXCI+e3tnZXRTZWxlY3RlZFNpdGVOYW1lKCl9fTwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInZhbHVlXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uXFxcIiBAY2xpY2s9XFxcImJlZ2luU2VsZWN0U2l0ZSgpXFxcIj48SWNvbiB0eXBlPVxcXCJpb3MtZnVubmVsXFxcIiAvPiZuYnNwO1xcdTkwMDlcXHU2MkU5PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPVxcXCJzZWxlY3RTaXRlTW9kZWxEaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXdyYXAgZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC1zb3VyY2Utd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cXFwiaW5wdXRfYm9yZGVyX2JvdHRvbVxcXCIgcmVmPVxcXCJ0eHRfc2l0ZV9zZWFyY2hfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NVxcdTdBRDlcXHU3MEI5XFx1NTQwRFxcdTc5RjBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXAgZGl2LWN1c3RvbS1zY3JvbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwic2l0ZVpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyJdfQ==
