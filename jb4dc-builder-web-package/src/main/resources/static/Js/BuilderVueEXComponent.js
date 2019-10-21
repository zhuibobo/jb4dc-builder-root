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
      var js = "<script type=\"text/javascript\" src=\"${contextPath}/UIComponent/TreeTable/Js/TreeTable.js\"></script>";
      this.insertJs(js);
    },
    callServiceMethod: function callServiceMethod() {}
  },
  template: '<div class="js-code-fragment-wrap">\
            <div class="js-code-fragment-item" @click="formatJS">格式化</div>\
            <div class="js-code-fragment-item">说明</div>\
            <div class="js-code-fragment-item" @click="refScript">引入脚本</div>\
            <div class="js-code-fragment-item">获取URL参数</div>\
            <div class="js-code-fragment-item">调用服务方法</div>\
            <div class="js-code-fragment-item">加载数据字典</div>\
        </div>'
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
      this.ruleParas.msg = "字段";
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
        this.msg = oldSelectedValue.msg;
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
        move: "/Rest/Builder/Form/Move"
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
        align: "center"
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
        DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {
          width: 0,
          height: 0
        }, 2);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
      }
    },
    edit: function edit(recordId) {
      var url = BaseUtility.BuildView(this.acInterface.editView, {
        "op": "update",
        "recordId": recordId
      });
      DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {
        width: 0,
        height: 0
      }, 2);
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
          FormId: recordId
        });
        DialogUtility.OpenNewTabWindow(previewUrl);
      });
    }
  },
  template: "<div class=\"module-list-wrap\">\n                    <div id=\"list-button-wrap\" class=\"list-button-outer-wrap\">\n                        <div class=\"module-list-name\"><Icon type=\"ios-arrow-dropright-circle\" />&nbsp;\u6A21\u5757\u3010{{getModuleName()}}\u3011</div>\n                        <div class=\"list-button-inner-wrap\">\n                            <ButtonGroup>\n                                <i-button  type=\"success\" @click=\"add()\" icon=\"md-add\">\u65B0\u589E</i-button>\n                                <i-button type=\"primary\" @click=\"previewWebForm()\"  icon=\"md-pricetag\">\u9884\u89C8</i-button>\n                                <i-button type=\"primary\" disabled icon=\"md-add\">\u5F15\u5165URL </i-button>\n                                <i-button type=\"primary\" disabled icon=\"md-albums\">\u590D\u5236</i-button>\n                                <i-button type=\"primary\" disabled icon=\"md-bookmarks\">\u5386\u53F2\u7248\u672C</i-button>\n                                <i-button type=\"primary\" disabled icon=\"md-brush\">\u590D\u5236ID</i-button>\n                                <i-button type=\"primary\" @click=\"move('up')\" icon=\"md-arrow-up\">\u4E0A\u79FB</i-button>\n                                <i-button type=\"primary\" @click=\"move('down')\" icon=\"md-arrow-down\">\u4E0B\u79FB</i-button>\n                            </ButtonGroup>\n                        </div>\n                         <div style=\"float: right;width: 200px;margin-right: 10px;\">\n                            <i-input search class=\"input_border_bottom\" v-model=\"searchText\">\n                            </i-input>\n                        </div>                        <div style=\"clear: both\"></div>\n                    </div>\n                    <i-table :height=\"listHeight\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                             class=\"iv-list-table\" :highlight-row=\"true\"\n                             @on-selection-change=\"selectionChange\"></i-table>\n                </div>"
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
        align: "center"
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
        DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {
          width: 0,
          height: 0
        }, 2);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
      }
    },
    edit: function edit(recordId) {
      var url = BaseUtility.BuildView(this.acInterface.editView, {
        "op": "update",
        "recordId": recordId
      });
      DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {
        width: 0,
        height: 0
      }, 2);
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
            _self.dbLinkTree.treeData[i].icon = "../../../../Themes/Png16X16/database_connect.png";
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
  template: "<div class=\"db-table-relation-comp\">\n                <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px;margin-top: 0px;margin-bottom: 10px\">\u6570\u636E\u5173\u7CFB\u5173\u8054\u8BBE\u7F6E</divider>\n                <div style=\"float: left;width: 350px;height: 330px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 10px 10px 10px;\">\n                    <button-group shape=\"circle\" style=\"margin: auto\">\n                        <i-button type=\"success\" @click=\"beginSelectTableToRelationTable\">&nbsp;\u6DFB\u52A0&nbsp;</i-button>\n                        <i-button @click=\"deleteSelectedRelationTreeNode\">&nbsp;\u5220\u9664&nbsp;</i-button>\n                        <i-button @click=\"alertSerializeRelation\">\u5E8F\u5217\u5316</i-button>\n                        <i-button @click=\"inputDeserializeRelation\">\u53CD\u5E8F\u5217\u5316</i-button>\n                        <i-button>\u8BF4\u660E</i-button>\n                    </button-group>\n                    <ul id=\"dataRelationZTreeUL\" class=\"ztree\" style=\"overflow-x: hidden\"></ul>\n                </div>\n                <div style=\"float: right;width: 630px;height: 330px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 10px 10px 10px;\">\n                    <table class=\"light-gray-table\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" v-if=\"relationTableEditorView.isShowTableEditDetail\">\n                        <colgroup>\n                            <col style=\"width: 17%\" />\n                            <col style=\"width: 33%\" />\n                            <col style=\"width: 15%\" />\n                            <col style=\"width: 35%\" />\n                        </colgroup>\n                        <tbody>\n                            <tr>\n                                <td class=\"label\">SingleName\uFF1A</td>\n                                <td>\n                                    <i-input v-model=\"currentEditorData.singleName\" size=\"small\" placeholder=\"\u672C\u5173\u8054\u4E2D\u7684\u552F\u4E00\u540D\u79F0,\u53EF\u4EE5\u4E3A\u7A7A\" />\n                                </td>\n                                <td class=\"label\">PKKey\uFF1A</td>\n                                <td>\n                                    <i-select placeholder=\"\u9ED8\u8BA4\u4F7F\u7528Id\u5B57\u6BB5\" v-model=\"currentEditorData.pkFieldName\" size=\"small\" style=\"width:199px\">\n                                        <i-option v-for=\"item in relationTableEditorView.selPKData\" :value=\"item.fieldName\" :key=\"item.fieldName\">{{item.fieldCaption}}</i-option>\n                                    </i-select>\n                                </td>\n                            </tr>\n                            <tr v-if=\"relationTableEditorView.isSubEditTr\">\n                                <td class=\"label\">\u6570\u636E\u5173\u7CFB\uFF1A</td>\n                                <td>\n                                    <radio-group v-model=\"currentEditorData.relationType\" type=\"button\" size=\"small\">\n                                        <radio label=\"1To1\">1:1</radio>\n                                        <radio label=\"1ToN\">1:N</radio>\n                                    </radio-group>\n                                </td>\n                                <td class=\"label\">\u662F\u5426\u4FDD\u5B58\uFF1A</td>\n                                <td>\n                                    <radio-group v-model=\"currentEditorData.isSave\" type=\"button\" size=\"small\">\n                                        <radio label=\"true\">\u662F</radio>\n                                        <radio label=\"false\">\u5426</radio>\n                                    </radio-group>\n                                </td>\n                            </tr>\n                            <tr v-if=\"relationTableEditorView.isSubEditTr\">\n                                <td class=\"label\">\u672C\u8EAB\u5173\u8054\u5B57\u6BB5\uFF1A</td>\n                                <td>\n                                     <i-select placeholder=\"\u9ED8\u8BA4\u4F7F\u7528Id\u5B57\u6BB5\" v-model=\"currentEditorData.selfKeyFieldName\" size=\"small\" style=\"width:199px\">\n                                        <i-option v-for=\"item in relationTableEditorView.selSelfKeyData\" :value=\"item.fieldName\" :key=\"item.fieldName\">{{item.fieldCaption}}</i-option>\n                                    </i-select>\n                                </td>\n                                <td class=\"label\">\u5916\u8054\u5B57\u6BB5\uFF1A</td>\n                                <td>\n                                     <i-select placeholder=\"\u9ED8\u8BA4\u4F7F\u7528Id\u5B57\u6BB5\" v-model=\"currentEditorData.outerKeyFieldName\" size=\"small\" style=\"width:199px\">\n                                        <i-option v-for=\"item in relationTableEditorView.selForeignKeyData\" :value=\"item.fieldName\" :key=\"item.fieldName\">{{item.fieldCaption}}</i-option>\n                                    </i-select>\n                                </td>\n                            </tr>\n                            <tr>\n                                <td class=\"label\">Desc\uFF1A</td>\n                                <td colspan=\"3\">\n                                    <i-input v-model=\"currentEditorData.desc\" size=\"small\" placeholder=\"\u8BF4\u660E\" />\n                                </td>\n                            </tr>\n                            <tr>\n                                <td class=\"label\">\u52A0\u8F7D\u6761\u4EF6\uFF1A</td>\n                                <td colspan=\"3\">\n                                    <sql-general-design-comp ref=\"sqlGeneralDesignComp\" :sqlDesignerHeight=\"74\" v-model=\"currentEditorData.condition\" :showField=\"true\"></sql-general-design-comp>\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n                <div id=\"divSelectTable\" title=\"\u8BF7\u9009\u62E9\u8868\" style=\"display: none\">\n                    <i-input search class=\"input_border_bottom\" ref=\"txt_table_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u8868\u540D\u6216\u8005\u6807\u9898\">\n                        <i-select v-model=\"selectTableTree.oldSelectedDBLinkId\" slot=\"prepend\" style=\"width: 280px\" @on-change=\"changeDBLink\" :disabled=\"selectTableTree.disabledDBLink\">\n                            <i-option :value=\"item.dbId\" v-for=\"item in selectTableTree.dbLinkEntities\">{{item.dbLinkName}}</i-option>\n                        </i-select>\n                    </i-input>\n                    <ul id=\"selectTableZTreeUL\" class=\"ztree div-custom-scroll\" style=\"height: 500px;overflow-y:scroll;overflow-x:hidden\"></ul>\n                </div>\n              </div>"
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
        status: ""
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
  template: "<table class=\"html-design-plugin-dialog-table-wraper\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 240px\" />\n                        <col style=\"width: 90px\" />\n                        <col style=\"width: 120px\" />\n                        <col style=\"width: 90px\" />\n                        <col />\n                    </colgroup>\n                    <tbody>\n                        <tr>\n                            <td>ID\uFF1A</td>\n                            <td>\n                                <input type=\"text\" v-model=\"baseInfo.id\" />\n                            </td>\n                            <td>Serialize\uFF1A</td>\n                            <td style=\"text-align: center\">\n                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.serialize\">\n                                    <radio label=\"true\">\u662F</radio>\n                                    <radio label=\"false\">\u5426</radio>\n                                </radio-group>\n                            </td>\n                            <td>\u542F\u7528\uFF1A</td>\n                            <td style=\"text-align: center\">\n                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.status\">\n                                    <radio label=\"enable\">\u662F</radio>\n                                    <radio label=\"disable\">\u5426</radio>\n                                </radio-group>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>Name\uFF1A</td>\n                            <td>\n                                <input type=\"text\" v-model=\"baseInfo.name\" />\n                            </td>\n                            <td>ClassName\uFF1A</td>\n                            <td colspan=\"3\">\n                                <input type=\"text\" v-model=\"baseInfo.className\" />\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>Placeholder</td>\n                            <td>\n                                <input type=\"text\" v-model=\"baseInfo.placeholder\" />\n                            </td>\n                            <td>Readonly\uFF1A</td>\n                            <td style=\"text-align: center\">\n                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.custReadonly\">\n                                    <radio label=\"readonly\">\u662F</radio>\n                                    <radio label=\"noreadonly\">\u5426</radio>\n                                </radio-group>\n                            </td>\n                            <td>Disabled\uFF1A</td>\n                            <td style=\"text-align: center\">\n                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.custDisabled\">\n                                    <radio label=\"disabled\">\u662F</radio>\n                                    <radio label=\"nodisabled\">\u5426</radio>\n                                </radio-group>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\u6837\u5F0F\uFF1A</td>\n                            <td colspan=\"5\">\n                                <textarea rows=\"7\" v-model=\"baseInfo.style\"></textarea>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\u5907\u6CE8\uFF1A</td>\n                            <td colspan=\"5\">\n                                <textarea rows=\"8\" v-model=\"baseInfo.desc\"></textarea>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>"
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
      normalDataSource: {
        defaultIsNull: "true",
        sqlDataSource: "",
        dictionaryIdDataSource: "",
        restDataSource: "",
        staticDataSource: ""
      }
    };
  },
  watch: {},
  mounted: function mounted() {},
  methods: {
    getValue: function getValue() {
      this.normalDataSource.sqlDataSource = encodeURIComponent(this.normalDataSource.sqlDataSource);
      return this.normalDataSource;
    },
    setValue: function setValue(newValue) {
      this.normalDataSource = newValue;
      this.normalDataSource.sqlDataSource = decodeURIComponent(newValue.sqlDataSource);
      this.$refs.sqlGeneralDesignComp.setValue(this.normalDataSource.sqlDataSource);
    }
  },
  template: "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 280px\" />\n                        <col style=\"width: 100px\" />\n                        <col />\n                    </colgroup>\n                    <tbody>\n                        <tr>\n                            <td>\n                                \u9ED8\u8BA4\u7A7A\uFF1A\n                            </td>\n                            <td>\n                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"normalDataSource.defaultIsNull\">\n                                    <radio label=\"true\">\u662F</radio>\n                                    <radio label=\"false\">\u5426</radio>\n                                </radio-group>\n                            </td>\n                            <td colspan=\"2\">\n                                \u83B7\u53D6\u6570\u636E\u6E90\u4F18\u5148\u7EA7\u522B->Rest\u63A5\u53E3->\u672C\u5730\u63A5\u53E3->sql->\u9759\u6001\u503C\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u9759\u6001\u503C\uFF1A\n                            </td>\n                            <td colspan=\"3\">\n\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u6570\u636E\u5B57\u5178\uFF1A\n                            </td>\n                            <td colspan=\"3\">\n\n                            </td>\n                        </tr>\n                        <tr>\n                            <td rowspan=\"2\">\n                                SQL\u6570\u636E\u6E90\uFF1A\n                            </td>\n                            <td colspan=\"3\">\n                                <span style=\"color: red\">[ITEXT\u4E0EIVALUE\u8BF7\u4F7F\u7528\u5927\u5199]</span>\u793A\u4F8B:\u3010SELECT '1' ITEXT,'2' IVALUE\u3011\n                            </td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"3\" style=\"background-color: #FFFFFF\">\n                                <sql-general-design-comp ref=\"sqlGeneralDesignComp\" :sql-designer-height=\"74\"  v-model=\"normalDataSource.sqlDataSource\"></sql-general-design-comp>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                REST\u6570\u636E\u6E90\uFF1A\n                            </td>\n                            <td colspan=\"3\">\n                                \n                            </td>\n                        </tr>\n                    </tbody>\n                </table>"
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

          if (params.row.buttonType == "保存按钮") {
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
            BindName: "Value",
            Renderer: "EditTable_Label",
            TitleCellClassName: "TitleCell",
            Formater: function Formater(value) {
              return _self.getAPIText(value);
            }
          }, {
            Title: "调用顺序",
            BindName: "RunTime",
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
            BindName: "TableName",
            Renderer: "EditTable_Label"
          }, {
            Title: "字段标题",
            BindName: "FieldName",
            Renderer: "EditTable_Select"
          }, {
            Title: "默认值",
            BindName: "DefaultValue",
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
    ready: function ready(tableDataJson) {
      if (tableDataJson != null && tableDataJson != "") {
        this.tableData = JsonUtility.StringToJson(tableDataJson);
      }

      this.bindAPITreeAndInitEditTable(null);
    },
    getJson: function getJson() {
      return JsonUtility.JsonToString(this.tableData);
    },
    handleClose: function handleClose(dialogElem) {
      DialogUtility.CloseDialogElem(this.$refs[dialogElem]);
    },
    edit: function edit(id, params) {
      if (params.row["buttonType"] == "保存按钮") {
        this.editInnerFormSaveButton(params);
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
        var elem = this.$refs.innerFormButtonEdit;
        DialogUtility.DialogElemObj(elem, {
          modal: true,
          height: 520,
          width: 720,
          title: "窗体内按钮"
        });
        $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
        $(window.document).find(".ui-dialog").css("zIndex", 10101);
        this.innerSaveButtonEditData.id = "inner_form_button_" + StringUtility.Timestamp();
        this.bindTableFields(null);
      } else {
        DialogUtility.AlertText("请先设置绑定的窗体!");
      }
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

      this.handleClose("innerFormButtonEdit");
    },
    bindTableFields: function bindTableFields(oldData) {
      if (this.oldFormId != this.formId) {
        AjaxUtility.Post(this.field.acInterface.getFormMainTableFields, {
          formId: this.formId
        }, function (result) {
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
      this.field.editTableObject.AddEditingRowByTemplate();
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
          Value: this.api.apiSelectData.value,
          RunTime: "之后"
        });
      } else {
        DialogUtility.AlertText("请选择需要添加的API!");
      }
    },
    removeAPI: function removeAPI() {
      this.api.editTableObject.RemoveRow();
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
  template: "<div style=\"height: 210px\" class=\"iv-list-page-wrap\">\n                    <div ref=\"innerFormButtonEdit\" class=\"html-design-plugin-dialog-wraper general-edit-page-wrap\" style=\"display: none;margin-top: 0px\">\n                        <tabs size=\"small\">\n                            <tab-pane label=\"\u7ED1\u5B9A\u4FE1\u606F\">\n                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                                    <colgroup>\n                                        <col style=\"width: 60px\" />\n                                        <col style=\"width: 220px\" />\n                                        <col style=\"width: 100px\" />\n                                        <col />\n                                    </colgroup>\n                                    <tbody>\n                                        <tr>\n                                            <td>\u6807\u9898\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.caption\" />\n                                            </td>\n                                            <td>\u4FDD\u5B58\u5E76\u5173\u95ED\uFF1A</td>\n                                            <td>\n                                                <radio-group type=\"button\" style=\"margin: auto\" v-model=\"innerSaveButtonEditData.saveAndClose\">\n                                                    <radio label=\"true\">\u662F</radio>\n                                                    <radio label=\"false\">\u5426</radio>\n                                                </radio-group>\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5B57\u6BB5\uFF1A</td>\n                                            <td colspan=\"3\">\n                                                <div style=\"height: 140px\">\n                                                    <div style=\"float: left;width: 94%\">\n                                                        <div id=\"fieldContainer\" class=\"edit-table-wrap\" style=\"height: 320px;overflow: auto;width: 98%;margin: auto\"></div>\n                                                    </div>\n                                                    <div style=\"float: right;width: 5%\">\n                                                        <button-group vertical>\n                                                            <i-button size=\"small\" type=\"success\" icon=\"md-add\" @click=\"addField\"></i-button>\n                                                            <i-button size=\"small\" type=\"primary\" icon=\"md-close\" @click=\"removeField\"></i-button>\n                                                        </button-group>\n                                                    </div>\n                                                </div>\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </tab-pane>\n                            <tab-pane label=\"API\u8BBE\u7F6E\">\n                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                                    <colgroup>\n                                        <col style=\"width: 320px\" />\n                                        <col style=\"width: 60px\" />\n                                        <col />\n                                    </colgroup>\n                                    <tbody>\n                                        <tr>\n                                            <td style=\"background: #ffffff\">\n                                                <i-input search class=\"input_border_bottom\" ref=\"txt_search_api_text\" placeholder=\"\u8BF7\u8F93\u5165API\u540D\u79F0\"></i-input>\n                                                <ul id=\"apiZTreeUL\" class=\"ztree\" style=\"height: 320px;overflow: auto\"></ul>\n                                            </td>\n                                            <td style=\"text-align: center;background-color: #f8f8f8\">\n                                                <button-group vertical>\n                                                    <i-button size=\"small\" type=\"success\" icon=\"md-add\" @click=\"addAPI\"></i-button>\n                                                    <i-button size=\"small\" type=\"primary\" icon=\"md-close\" @click=\"removeAPI\"></i-button>\n                                                </button-group>\n                                            </td>\n                                            <td style=\"background: #ffffff;\" valign=\"top\">\n                                                <div id=\"apiContainer\" class=\"edit-table-wrap\" style=\"height: 340px;overflow: auto;width: 98%;margin: auto\"></div>\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </tab-pane>\n                            <tab-pane label=\"\u5F00\u53D1\u6269\u5C55\">\n                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                                    <colgroup>\n                                        <col style=\"width: 150px\" />\n                                        <col />\n                                    </colgroup>\n                                    <tbody>\n                                        <tr>\n                                            <td>ID\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.id\" size=\"small\" placeholder=\"\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u670D\u52A1\u7AEF\u89E3\u6790\u7C7B\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custServerResolveMethod\" size=\"small\" placeholder=\"\u6309\u94AE\u8FDB\u884C\u670D\u52A1\u7AEF\u89E3\u6790\u65F6,\u7C7B\u5168\u79F0,\u5C06\u8C03\u7528\u8BE5\u7C7B,\u9700\u8981\u5B9E\u73B0\u63A5\u53E3IFormButtonCustResolve\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custServerResolveMethodPara\" size=\"small\" placeholder=\"\u670D\u52A1\u7AEF\u89E3\u6790\u7C7B\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5BA2\u6237\u7AEF\u6E32\u67D3\u65B9\u6CD5\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientRendererMethod\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u65B9\u6CD5,\u6309\u94AE\u5C06\u7ECF\u7531\u8BE5\u65B9\u6CD5\u6E32\u67D3,\u6700\u7EC8\u5F62\u6210\u9875\u9762\u5143\u7D20,\u9700\u8981\u8FD4\u56DE\u6700\u7EC8\u5143\u7D20\u7684HTML\u5BF9\u8C61\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientRendererMethodPara\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u65B9\u6CD5\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5BA2\u6237\u7AEF\u6E32\u67D3\u540E\u65B9\u6CD5\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientRendererAfterMethod\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u540E\u8C03\u7528\u65B9\u6CD5,\u7ECF\u8FC7\u9ED8\u8BA4\u7684\u6E32\u67D3,\u65E0\u8FD4\u56DE\u503C\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientRendererAfterMethodPara\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u6E32\u67D3\u540E\u65B9\u6CD5\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u5BA2\u6237\u7AEF\u70B9\u51FB\u524D\u65B9\u6CD5\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientClickBeforeMethod\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u70B9\u51FB\u8BE5\u6309\u94AE\u65F6\u7684\u524D\u7F6E\u65B9\u6CD5,\u5982\u679C\u8FD4\u56DEfalse\u5C06\u963B\u6B62\u9ED8\u8BA4\u8C03\u7528\" />\n                                            </td>\n                                        </tr>\n                                        <tr>\n                                            <td>\u53C2\u6570\uFF1A</td>\n                                            <td>\n                                                <i-input v-model=\"innerSaveButtonEditData.custClientClickBeforeMethodPara\" size=\"small\" placeholder=\"\u5BA2\u6237\u7AEF\u70B9\u51FB\u524D\u65B9\u6CD5\u7684\u53C2\u6570\" />\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </tab-pane>\n                        </tabs>\n                        <div class=\"button-outer-wrap\">\n                            <div class=\"button-inner-wrap\">\n                                <button-group>\n                                    <i-button type=\"primary\" @click=\"saveInnerSaveButtonToList()\"> \u4FDD \u5B58</i-button>\n                                    <i-button @click=\"handleClose('innerFormButtonEdit')\">\u5173 \u95ED</i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                    <div style=\"height: 210px;width: 100%\">\n                        <div style=\"float: left;width: 84%\">\n                            <i-table :height=\"210\" width=\"100%\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                                                     class=\"iv-list-table\" :highlight-row=\"true\"\n                                                     size=\"small\"></i-table>\n                        </div>\n                        <div style=\"float: right;width: 15%\">\n                            <ButtonGroup vertical>\n                                <i-button type=\"success\" @click=\"addInnerFormSaveButton()\" icon=\"md-add\">\u4FDD\u5B58\u6309\u94AE</i-button>\n                                <i-button icon=\"md-add\" disabled>\u610F\u89C1\u6309\u94AE</i-button>\n                                <i-button type=\"primary\" @click=\"addInnerFormCloseButton()\" icon=\"md-add\">\u5173\u95ED\u6309\u94AE</i-button>\n                            </ButtonGroup>\n                        </div>\n                    </div>\n                </div>"
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
  template: "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 280px\" />\n                        <col />\n                    </colgroup>\n                    <tbody>\n                        <tr>\n                            <td>\n                                \u5BF9\u9F50\u65B9\u5F0F\uFF1A\n                            </td>\n                            <td>\n                                <i-select v-model=\"bindProp.columnAlign\" style=\"width:260px\">\n                                    <i-option value=\"\u5DE6\u5BF9\u9F50\">\u5DE6\u5BF9\u9F50</i-option>\n                                    <i-option value=\"\u5C45\u4E2D\u5BF9\u9F50\">\u5C45\u4E2D\u5BF9\u9F50</i-option>\n                                    <i-option value=\"\u53F3\u5BF9\u9F50\">\u53F3\u5BF9\u9F50</i-option>\n                                </i-select>\n                            </td>\n                            <td rowspan=\"9\" valign=\"top\">\n                                <ul ref=\"zTreeUL\" class=\"ztree\"></ul>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u6240\u5C5E\u8868\uFF1A\n                            </td>\n                            <td>\n                                {{bindProp.columnTableName}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u7ED1\u5B9A\u5B57\u6BB5\uFF1A\n                            </td>\n                            <td>\n                                {{bindProp.columnCaption}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u5B57\u6BB5\u540D\u79F0\uFF1A\n                            </td>\n                            <td>\n                                {{bindProp.columnName}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u5B57\u6BB5\u7C7B\u578B\uFF1A \n                            </td>\n                            <td>\n                                {{bindProp.columnDataTypeName}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u89E6\u53D1\u6309\u94AE\uFF1A\n                            </td>\n                            <td>\n                                <i-select v-model=\"bindProp.targetButtonId\" style=\"width:260px\" :clearable=\"true\">\n                                    <i-option :value=\"item.buttonId\" v-for=\"item in buttons\">{{item.buttonCaption}}</i-option>\n                                </i-select>\n                            </td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"2\">\u9ED8\u8BA4\u503C<button class=\"btn-select fright\" v-on:click=\"selectDefaultValueView\">...</button></td>\n                        </tr>\n                        <tr style=\"height: 35px\">\n                            <td colspan=\"2\" style=\"background-color: #ffffff;\">\n                                {{tempData.defaultDisplayText}}\n                            </td>\n                        </tr>\n                        <tr>\n                            <td>\n                                \u5907\u6CE8\uFF1A\n                            </td>\n                            <td>\n                                <textarea rows=\"8\"></textarea>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>"
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXAvZGF0YXNldC1zaW1wbGUtc2VsZWN0LWNvbXAuanMiLCJDb21wL2pzLWRlc2lnbi1jb2RlLWZyYWdtZW50LmpzIiwiQ29tcC9zcWwtZ2VuZXJhbC1kZXNpZ24tY29tcC5qcyIsIkNvbXAvdGFibGUtcmVsYXRpb24tY29udGVudC1jb21wLmpzIiwiRGlhbG9nL3NlbGVjdC1kZWZhdWx0LXZhbHVlLWRpYWxvZy5qcyIsIkRpYWxvZy9zZWxlY3Qtc2luZ2xlLXRhYmxlLWRpYWxvZy5qcyIsIkRpYWxvZy9zZWxlY3Qtc2luZ2xlLXdlYmZvcm0tZGlhbG9nLmpzIiwiRGlhbG9nL3NlbGVjdC12YWxpZGF0ZS1ydWxlLWRpYWxvZy5qcyIsIkRpYWxvZy90YWJsZS1yZWxhdGlvbi1jb25uZWN0LXR3by10YWJsZS1kaWFsb2cuanMiLCJNb2R1bGUvbW9kdWxlLWxpc3Qtd2ViZm9ybS1jb21wLmpzIiwiTW9kdWxlL21vZHVsZS1saXN0LXdlYmxpc3QtY29tcC5qcyIsIlNlbGVjdEJ1dHRvbi9zZWxlY3QtZGJsaW5rLXNpbmdsZS1jb21wLmpzIiwiSFRNTERlc2lnbi9kYi10YWJsZS1yZWxhdGlvbi1jb21wLmpzIiwiSFRNTERlc2lnbi9kZXNpZ24taHRtbC1lbGVtLWxpc3QuanMiLCJIVE1MRGVzaWduL2ZkLWNvbnRyb2wtYmFzZS1pbmZvLmpzIiwiSFRNTERlc2lnbi9mZC1jb250cm9sLWJpbmQtdG8uanMiLCJIVE1MRGVzaWduL2ZkLWNvbnRyb2wtZGF0YXNvdXJjZS5qcyIsIkhUTUxEZXNpZ24vZmQtY29udHJvbC1zZWxlY3QtYmluZC10by1zaW5nbGUtZmllbGQtZGlhbG9nLmpzIiwiSFRNTERlc2lnbi9pbm5lci1mb3JtLWJ1dHRvbi1saXN0LWNvbXAuanMiLCJIVE1MRGVzaWduL2xpc3Qtc2VhcmNoLWNvbnRyb2wtYmluZC10by1jb21wLmpzIiwiSFRNTERlc2lnbi9saXN0LXRhYmxlLWxhYmVsLWJpbmQtdG8tY29tcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25xQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJCdWlsZGVyVnVlRVhDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImRhdGFzZXQtc2ltcGxlLXNlbGVjdC1jb21wXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldERhdGFTZXREYXRhOiBcIi9SZXN0L0J1aWxkZXIvRGF0YVNldC9EYXRhU2V0TWFpbi9HZXREYXRhU2V0c0ZvclpUcmVlTm9kZUxpc3RcIlxuICAgICAgfSxcbiAgICAgIGRhdGFTZXRUcmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIGNoa1N0eWxlOiBcInJhZGlvXCIsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBpZiAodHJlZU5vZGUubm9kZVR5cGVOYW1lID09IFwiRGF0YVNldFwiKSB7XG4gICAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWROb2RlKHRyZWVOb2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZURhdGE6IG51bGwsXG4gICAgICAgIHNlbGVjdGVkVGFibGVOYW1lOiBcIuaXoFwiXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJpbmREYXRhU2V0VHJlZSgpO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYmluZERhdGFTZXRUcmVlOiBmdW5jdGlvbiBiaW5kRGF0YVNldFRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0RGF0YVNldERhdGEsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YSAhPSBudWxsICYmIHJlc3VsdC5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdC5kYXRhW2ldLm5vZGVUeXBlTmFtZSA9PSBcIkRhdGFTZXRHcm91cFwiKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmRhdGFbaV0uaWNvbiA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9UaGVtZXMvUG5nMTZYMTYvcGFja2FnZS5wbmdcIjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuZGF0YVtpXS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi9hcHBsaWNhdGlvbl92aWV3X2NvbHVtbnMucG5nXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfc2VsZi5kYXRhU2V0VHJlZS50cmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIF9zZWxmLmRhdGFTZXRUcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNkYXRhU2V0WlRyZWVVTFwiKSwgX3NlbGYuZGF0YVNldFRyZWUudHJlZVNldHRpbmcsIF9zZWxmLmRhdGFTZXRUcmVlLnRyZWVEYXRhKTtcblxuICAgICAgICAgIF9zZWxmLmRhdGFTZXRUcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuXG4gICAgICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKF9zZWxmLmRhdGFTZXRUcmVlLnRyZWVPYmosIF9zZWxmLiRyZWZzLnR4dF9zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBzZWxlY3RlZE5vZGU6IGZ1bmN0aW9uIHNlbGVjdGVkTm9kZSh0cmVlTm9kZSkge1xuICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtZGF0YXNldCcsIHRyZWVOb2RlKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtd3JhcFwiPlxcXG4gICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cImlucHV0X2JvcmRlcl9ib3R0b21cIiByZWY9XCJ0eHRfc2VhcmNoX3RleHRcIiBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpeihqOWQjeaIluiAheagh+mimFwiPjwvaS1pbnB1dD5cXFxuICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XCJkYXRhU2V0WlRyZWVVTFwiIGNsYXNzPVwienRyZWVcIj48L3VsPlxcXG4gICAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJqcy1kZXNpZ24tY29kZS1mcmFnbWVudFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGpzRWRpdG9ySW5zdGFuY2U6IG51bGxcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBzZXRKU0VkaXRvckluc3RhbmNlOiBmdW5jdGlvbiBzZXRKU0VkaXRvckluc3RhbmNlKG9iaikge1xuICAgICAgdGhpcy5qc0VkaXRvckluc3RhbmNlID0gb2JqO1xuICAgIH0sXG4gICAgZ2V0SnNFZGl0b3JJbnN0OiBmdW5jdGlvbiBnZXRKc0VkaXRvckluc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5qc0VkaXRvckluc3RhbmNlO1xuICAgIH0sXG4gICAgaW5zZXJ0SnM6IGZ1bmN0aW9uIGluc2VydEpzKGpzKSB7XG4gICAgICB2YXIgZG9jID0gdGhpcy5nZXRKc0VkaXRvckluc3QoKS5nZXREb2MoKTtcbiAgICAgIHZhciBjdXJzb3IgPSBkb2MuZ2V0Q3Vyc29yKCk7XG4gICAgICBkb2MucmVwbGFjZVJhbmdlKGpzLCBjdXJzb3IpO1xuICAgIH0sXG4gICAgZm9ybWF0SlM6IGZ1bmN0aW9uIGZvcm1hdEpTKCkge1xuICAgICAgQ29kZU1pcnJvci5jb21tYW5kc1tcInNlbGVjdEFsbFwiXSh0aGlzLmdldEpzRWRpdG9ySW5zdCgpKTtcbiAgICAgIHZhciByYW5nZSA9IHtcbiAgICAgICAgZnJvbTogdGhpcy5nZXRKc0VkaXRvckluc3QoKS5nZXRDdXJzb3IodHJ1ZSksXG4gICAgICAgIHRvOiB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmdldEN1cnNvcihmYWxzZSlcbiAgICAgIH07XG4gICAgICA7XG4gICAgICB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmF1dG9Gb3JtYXRSYW5nZShyYW5nZS5mcm9tLCByYW5nZS50byk7XG4gICAgfSxcbiAgICBhbGVydERlc2M6IGZ1bmN0aW9uIGFsZXJ0RGVzYygpIHt9LFxuICAgIHJlZlNjcmlwdDogZnVuY3Rpb24gcmVmU2NyaXB0KCkge1xuICAgICAgdmFyIGpzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCIgc3JjPVxcXCIke2NvbnRleHRQYXRofS9VSUNvbXBvbmVudC9UcmVlVGFibGUvSnMvVHJlZVRhYmxlLmpzXFxcIj48L3NjcmlwdD5cIjtcbiAgICAgIHRoaXMuaW5zZXJ0SnMoanMpO1xuICAgIH0sXG4gICAgY2FsbFNlcnZpY2VNZXRob2Q6IGZ1bmN0aW9uIGNhbGxTZXJ2aWNlTWV0aG9kKCkge31cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC13cmFwXCI+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIiBAY2xpY2s9XCJmb3JtYXRKU1wiPuagvOW8j+WMljwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+6K+05piOPC9kaXY+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIiBAY2xpY2s9XCJyZWZTY3JpcHRcIj7lvJXlhaXohJrmnKw8L2Rpdj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiPuiOt+WPllVSTOWPguaVsDwvZGl2PlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+6LCD55So5pyN5Yqh5pa55rOVPC9kaXY+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIj7liqDovb3mlbDmja7lrZflhbg8L2Rpdj5cXFxuICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNxbC1nZW5lcmFsLWRlc2lnbi1jb21wXCIsIHtcbiAgcHJvcHM6IFtcInNxbERlc2lnbmVySGVpZ2h0XCIsIFwidmFsdWVcIiwgXCJzaG93RmllbGRcIl0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNxbFRleHQ6IFwiXCIsXG4gICAgICBzZWxlY3RlZEl0ZW1WYWx1ZTogXCLor7TmmI5cIixcbiAgICAgIHNlbGZUYWJsZUZpZWxkczogW10sXG4gICAgICBwYXJlbnRUYWJsZUZpZWxkczogW11cbiAgICB9O1xuICB9LFxuICB3YXRjaDoge1xuICAgIHNxbFRleHQ6IGZ1bmN0aW9uIHNxbFRleHQobmV3VmFsKSB7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG5ld1ZhbCk7XG4gICAgfSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnNxbFRleHQgPSBuZXdWYWw7XG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuc3FsQ29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKCQoXCIjVGV4dEFyZWFTUUxFZGl0b3JcIilbMF0sIHtcbiAgICAgIG1vZGU6IFwidGV4dC94LXNxbFwiLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICBmb2xkR3V0dGVyOiB0cnVlLFxuICAgICAgdGhlbWU6IFwibW9ub2thaVwiXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zcWxEZXNpZ25lckhlaWdodCk7XG4gICAgdGhpcy5zcWxDb2RlTWlycm9yLnNldFNpemUoXCIxMDAlXCIsIHRoaXMuc3FsRGVzaWduZXJIZWlnaHQpO1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHRoaXMuc3FsQ29kZU1pcnJvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoY01pcnJvcikge1xuICAgICAgY29uc29sZS5sb2coY01pcnJvci5nZXRWYWx1ZSgpKTtcbiAgICAgIF9zZWxmLnNxbFRleHQgPSBjTWlycm9yLmdldFZhbHVlKCk7XG4gICAgfSk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XG4gICAgICB0aGlzLnNxbENvZGVNaXJyb3IuZ2V0VmFsdWUoKTtcbiAgICB9LFxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgdGhpcy5zcWxDb2RlTWlycm9yLnNldFZhbHVlKHZhbHVlKTtcbiAgICB9LFxuICAgIHNldEFib3V0VGFibGVGaWVsZHM6IGZ1bmN0aW9uIHNldEFib3V0VGFibGVGaWVsZHMoc2VsZlRhYmxlRmllbGRzLCBwYXJlbnRUYWJsZUZpZWxkcykge1xuICAgICAgdGhpcy5zZWxmVGFibGVGaWVsZHMgPSBzZWxmVGFibGVGaWVsZHM7XG4gICAgICB0aGlzLnBhcmVudFRhYmxlRmllbGRzID0gcGFyZW50VGFibGVGaWVsZHM7XG4gICAgfSxcbiAgICBpbnNlcnRFbnZUb0VkaXRvcjogZnVuY3Rpb24gaW5zZXJ0RW52VG9FZGl0b3IoY29kZSkge1xuICAgICAgdGhpcy5pbnNlcnRDb2RlQXRDdXJzb3IoY29kZSk7XG4gICAgfSxcbiAgICBpbnNlcnRGaWVsZFRvRWRpdG9yOiBmdW5jdGlvbiBpbnNlcnRGaWVsZFRvRWRpdG9yKHNvdXJjZVR5cGUsIGV2ZW50KSB7XG4gICAgICB2YXIgc291cmNlRmllbGRzID0gbnVsbDtcblxuICAgICAgaWYgKHNvdXJjZVR5cGUgPT0gXCJzZWxmVGFibGVGaWVsZHNcIikge1xuICAgICAgICBzb3VyY2VGaWVsZHMgPSB0aGlzLnNlbGZUYWJsZUZpZWxkcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvdXJjZUZpZWxkcyA9IHRoaXMucGFyZW50VGFibGVGaWVsZHM7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VGaWVsZHNbaV0uZmllbGROYW1lID09IGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5pbnNlcnRDb2RlQXRDdXJzb3Ioc291cmNlRmllbGRzW2ldLnRhYmxlTmFtZSArIFwiLlwiICsgc291cmNlRmllbGRzW2ldLmZpZWxkTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGluc2VydENvZGVBdEN1cnNvcjogZnVuY3Rpb24gaW5zZXJ0Q29kZUF0Q3Vyc29yKGNvZGUpIHtcbiAgICAgIHZhciBkb2MgPSB0aGlzLnNxbENvZGVNaXJyb3IuZ2V0RG9jKCk7XG4gICAgICB2YXIgY3Vyc29yID0gZG9jLmdldEN1cnNvcigpO1xuICAgICAgZG9jLnJlcGxhY2VSYW5nZShjb2RlLCBjdXJzb3IpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2PlxcXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiVGV4dEFyZWFTUUxFZGl0b3JcIj48L3RleHRhcmVhPlxcXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0O21hcmdpbi10b3A6IDhweFwiPlxcXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cCBzaXplPVwic21hbGxcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBAY2xpY2s9XCJpbnNlcnRFbnZUb0VkaXRvcihcXCcje0FwaVZhci7lvZPliY3nlKjmiLfmiYDlnKjnu4Tnu4dJRH1cXCcpXCI+57uE57uHSWQ8L0J1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBAY2xpY2s9XCJpbnNlcnRFbnZUb0VkaXRvcihcXCcje0FwaVZhci7lvZPliY3nlKjmiLfmiYDlnKjnu4Tnu4flkI3np7B9XFwnKVwiPue7hOe7h+WQjeensDwvQnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIEBjbGljaz1cImluc2VydEVudlRvRWRpdG9yKFxcJyN7QXBpVmFyLuW9k+WJjeeUqOaIt0lEfVxcJylcIj7nlKjmiLdJZDwvQnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIEBjbGljaz1cImluc2VydEVudlRvRWRpdG9yKFxcJyN7QXBpVmFyLuW9k+WJjeeUqOaIt+WQjeensH1cXCcpXCI+55So5oi35ZCN56ewPC9CdXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tEYXRlVGltZS7lubTlubTlubTlubQt5pyI5pyILeaXpeaXpX1cXCcpXCI+eXl5eS1NTS1kZDwvQnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uPuivtOaYjjwvQnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOiA4cHhcIiB2LWlmPVwic2hvd0ZpZWxkXCI+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0O21hcmdpbjogNHB4IDEwcHhcIj7mnKzooajlrZfmrrU8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnRcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHBsYWNlaG9sZGVyPVwi6buY6K6k5L2/55SoSWTlrZfmrrVcIiBzaXplPVwic21hbGxcIiBzdHlsZT1cIndpZHRoOjE3NXB4XCIgQG9uLWNoYW5nZT1cImluc2VydEZpZWxkVG9FZGl0b3IoXFwnc2VsZlRhYmxlRmllbGRzXFwnLCRldmVudClcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gc2VsZlRhYmxlRmllbGRzXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdDttYXJnaW46IDRweCAxMHB4XCI+54i26KGo5a2X5q61PC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCBwbGFjZWhvbGRlcj1cIum7mOiupOS9v+eUqElk5a2X5q61XCIgc2l6ZT1cInNtYWxsXCIgc3R5bGU9XCJ3aWR0aDoxNzdweFwiIEBvbi1jaGFuZ2U9XCJpbnNlcnRGaWVsZFRvRWRpdG9yKFxcJ3BhcmVudFRhYmxlRmllbGRzXFwnLCRldmVudClcIj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gcGFyZW50VGFibGVGaWVsZHNcIiA6dmFsdWU9XCJpdGVtLmZpZWxkTmFtZVwiIDprZXk9XCJpdGVtLmZpZWxkTmFtZVwiPnt7aXRlbS5maWVsZENhcHRpb259fTwvaS1vcHRpb24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInRhYmxlLXJlbGF0aW9uLWNvbnRlbnQtY29tcFwiLCB7XG4gIHByb3BzOiBbXCJyZWxhdGlvblwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0VGFibGVzRmllbGRzQnlUYWJsZUlkczogXCIvUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHNcIixcbiAgICAgICAgc2F2ZURpYWdyYW06IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9UYWJsZVJlbGF0aW9uL1RhYmxlUmVsYXRpb24vU2F2ZURpYWdyYW1cIixcbiAgICAgICAgZ2V0U2luZ2xlRGlhZ3JhbURhdGE6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9UYWJsZVJlbGF0aW9uL1RhYmxlUmVsYXRpb24vR2V0RGV0YWlsRGF0YVwiLFxuICAgICAgICB0YWJsZVZpZXc6IFwiL0hUTUwvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZUVkaXQuaHRtbFwiXG4gICAgICB9LFxuICAgICAgdGFibGVSZWxhdGlvbkRpYWdyYW06IG51bGwsXG4gICAgICBkaXNwbGF5RGVzYzogdHJ1ZSxcbiAgICAgIGZvcm1hdEpzb246IG51bGwsXG4gICAgICByZWNvcmRJZDogdGhpcy5yZWxhdGlvbi5yZWxhdGlvbklkXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICAkKHRoaXMuJHJlZnMucmVsYXRpb25Db250ZW50T3V0ZXJXcmFwKS5jc3MoXCJoZWlnaHRcIiwgUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSA3NSk7XG5cbiAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSA8IDEwMDApIHtcbiAgICAgIHRoaXMuZGlzcGxheURlc2MgPSBmYWxzZTtcbiAgICAgICQoXCIudGFibGUtcmVsYXRpb24tb3AtYnV0dG9ucy1vdXRlci13cmFwXCIpLmNzcyhcIndpZHRoXCIsIFwiMTAwJVwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXREaWFncmFtKCk7XG4gICAgdGhpcy5sb2FkUmVsYXRpb25EZXRhaWxEYXRhKCk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgaWYgKHdpbmRvdy5nb1NhbXBsZXMpIGdvU2FtcGxlcygpO1xuICAgICAgdmFyICQgPSBnby5HcmFwaE9iamVjdC5tYWtlO1xuICAgICAgdmFyIG15RGlhZ3JhbSA9ICQoZ28uRGlhZ3JhbSwgXCJ0YWJsZVJlbGF0aW9uRGlhZ3JhbURpdlwiLCB7XG4gICAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgICAgYWxsb3dDb3B5OiBmYWxzZSxcbiAgICAgICAgbGF5b3V0OiAkKGdvLkZvcmNlRGlyZWN0ZWRMYXlvdXQpLFxuICAgICAgICBcInVuZG9NYW5hZ2VyLmlzRW5hYmxlZFwiOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHZhciBibHVlZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTUwLCAxNTAsIDI1MClcIixcbiAgICAgICAgMC41OiBcInJnYig4NiwgODYsIDE4NilcIixcbiAgICAgICAgMTogXCJyZ2IoODYsIDg2LCAxODYpXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIGdyZWVuZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTU4LCAyMDksIDE1OSlcIixcbiAgICAgICAgMTogXCJyZ2IoNjcsIDEwMSwgNTYpXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIHJlZGdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDIwNiwgMTA2LCAxMDApXCIsXG4gICAgICAgIDE6IFwicmdiKDE4MCwgNTYsIDUwKVwiXG4gICAgICB9KTtcbiAgICAgIHZhciB5ZWxsb3dncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigyNTQsIDIyMSwgNTApXCIsXG4gICAgICAgIDE6IFwicmdiKDI1NCwgMTgyLCA1MClcIlxuICAgICAgfSk7XG4gICAgICB2YXIgbGlnaHRncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAxOiBcIiNFNkU2RkFcIixcbiAgICAgICAgMDogXCIjRkZGQUYwXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIGl0ZW1UZW1wbCA9ICQoZ28uUGFuZWwsIFwiSG9yaXpvbnRhbFwiLCAkKGdvLlNoYXBlLCB7XG4gICAgICAgIGRlc2lyZWRTaXplOiBuZXcgZ28uU2l6ZSgxMCwgMTApXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcImZpZ3VyZVwiLCBcImZpZ3VyZVwiKSwgbmV3IGdvLkJpbmRpbmcoXCJmaWxsXCIsIFwiY29sb3JcIikpLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICBzdHJva2U6IFwiIzMzMzMzM1wiLFxuICAgICAgICBmb250OiBcImJvbGQgMTRweCBzYW5zLXNlcmlmXCJcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcIm5hbWVcIikpKTtcbiAgICAgIG15RGlhZ3JhbS5ub2RlVGVtcGxhdGUgPSAkKGdvLk5vZGUsIFwiQXV0b1wiLCB7XG4gICAgICAgIHNlbGVjdGlvbkFkb3JuZWQ6IHRydWUsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgbGF5b3V0Q29uZGl0aW9uczogZ28uUGFydC5MYXlvdXRTdGFuZGFyZCAmIH5nby5QYXJ0LkxheW91dE5vZGVTaXplZCxcbiAgICAgICAgZnJvbVNwb3Q6IGdvLlNwb3QuQWxsU2lkZXMsXG4gICAgICAgIHRvU3BvdDogZ28uU3BvdC5BbGxTaWRlcyxcbiAgICAgICAgaXNTaGFkb3dlZDogdHJ1ZSxcbiAgICAgICAgc2hhZG93Q29sb3I6IFwiI0M1QzFBQVwiXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcImxvY2F0aW9uXCIsIFwibG9jYXRpb25cIikubWFrZVR3b1dheSgpLCBuZXcgZ28uQmluZGluZyhcImRlc2lyZWRTaXplXCIsIFwidmlzaWJsZVwiLCBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gbmV3IGdvLlNpemUoTmFOLCBOYU4pO1xuICAgICAgfSkub2ZPYmplY3QoXCJMSVNUXCIpLCAkKGdvLlNoYXBlLCBcIlJlY3RhbmdsZVwiLCB7XG4gICAgICAgIGZpbGw6IGxpZ2h0Z3JhZCxcbiAgICAgICAgc3Ryb2tlOiBcIiM3NTY4NzVcIixcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDNcbiAgICAgIH0pLCAkKGdvLlBhbmVsLCBcIlRhYmxlXCIsIHtcbiAgICAgICAgbWFyZ2luOiA4LFxuICAgICAgICBzdHJldGNoOiBnby5HcmFwaE9iamVjdC5GaWxsXG4gICAgICB9LCAkKGdvLlJvd0NvbHVtbkRlZmluaXRpb24sIHtcbiAgICAgICAgcm93OiAwLFxuICAgICAgICBzaXppbmc6IGdvLlJvd0NvbHVtbkRlZmluaXRpb24uTm9uZVxuICAgICAgfSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIHJvdzogMCxcbiAgICAgICAgYWxpZ25tZW50OiBnby5TcG90LkNlbnRlcixcbiAgICAgICAgbWFyZ2luOiBuZXcgZ28uTWFyZ2luKDAsIDE0LCAwLCAyKSxcbiAgICAgICAgZm9udDogXCJib2xkIDE2cHggc2Fucy1zZXJpZlwiXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJrZXlcIikpLCAkKFwiUGFuZWxFeHBhbmRlckJ1dHRvblwiLCBcIkxJU1RcIiwge1xuICAgICAgICByb3c6IDAsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5Ub3BSaWdodFxuICAgICAgfSksICQoZ28uUGFuZWwsIFwiVmVydGljYWxcIiwge1xuICAgICAgICBuYW1lOiBcIkxJU1RcIixcbiAgICAgICAgcm93OiAxLFxuICAgICAgICBwYWRkaW5nOiAzLFxuICAgICAgICBhbGlnbm1lbnQ6IGdvLlNwb3QuVG9wTGVmdCxcbiAgICAgICAgZGVmYXVsdEFsaWdubWVudDogZ28uU3BvdC5MZWZ0LFxuICAgICAgICBzdHJldGNoOiBnby5HcmFwaE9iamVjdC5Ib3Jpem9udGFsLFxuICAgICAgICBpdGVtVGVtcGxhdGU6IGl0ZW1UZW1wbFxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJpdGVtQXJyYXlcIiwgXCJpdGVtc1wiKSkpKTtcbiAgICAgIG15RGlhZ3JhbS5saW5rVGVtcGxhdGUgPSAkKGdvLkxpbmssIHtcbiAgICAgICAgc2VsZWN0aW9uQWRvcm5lZDogdHJ1ZSxcbiAgICAgICAgbGF5ZXJOYW1lOiBcIkZvcmVncm91bmRcIixcbiAgICAgICAgcmVzaGFwYWJsZTogdHJ1ZSxcbiAgICAgICAgcm91dGluZzogZ28uTGluay5Bdm9pZHNOb2RlcyxcbiAgICAgICAgY29ybmVyOiA1LFxuICAgICAgICBjdXJ2ZTogZ28uTGluay5KdW1wT3ZlclxuICAgICAgfSwgJChnby5TaGFwZSwge1xuICAgICAgICBzdHJva2U6IFwiIzMwM0I0NVwiLFxuICAgICAgICBzdHJva2VXaWR0aDogMi41XG4gICAgICB9KSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICBmb250OiBcImJvbGQgMTRweCBzYW5zLXNlcmlmXCIsXG4gICAgICAgIHN0cm9rZTogXCIjMTk2N0IzXCIsXG4gICAgICAgIHNlZ21lbnRJbmRleDogMCxcbiAgICAgICAgc2VnbWVudE9mZnNldDogbmV3IGdvLlBvaW50KE5hTiwgTmFOKSxcbiAgICAgICAgc2VnbWVudE9yaWVudGF0aW9uOiBnby5MaW5rLk9yaWVudFVwcmlnaHRcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcInRleHRcIikpLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgc3Ryb2tlOiBcIiMxOTY3QjNcIixcbiAgICAgICAgc2VnbWVudEluZGV4OiAtMSxcbiAgICAgICAgc2VnbWVudE9mZnNldDogbmV3IGdvLlBvaW50KE5hTiwgTmFOKSxcbiAgICAgICAgc2VnbWVudE9yaWVudGF0aW9uOiBnby5MaW5rLk9yaWVudFVwcmlnaHRcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcInRvVGV4dFwiKSkpO1xuICAgICAgdmFyIG5vZGVEYXRhQXJyYXkgPSBbe1xuICAgICAgICBrZXk6IFwiUHJvZHVjdHNcIixcbiAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgbmFtZTogXCJQcm9kdWN0SURcIixcbiAgICAgICAgICBpc2tleTogdHJ1ZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogeWVsbG93Z3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJQcm9kdWN0TmFtZVwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiQ3ViZTFcIixcbiAgICAgICAgICBjb2xvcjogYmx1ZWdyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiU3VwcGxpZXJJRFwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogXCJwdXJwbGVcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJDYXRlZ29yeUlEXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJEZWNpc2lvblwiLFxuICAgICAgICAgIGNvbG9yOiBcInB1cnBsZVwiXG4gICAgICAgIH1dXG4gICAgICB9LCB7XG4gICAgICAgIGtleTogXCJTdXBwbGllcnNcIixcbiAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgbmFtZTogXCJTdXBwbGllcklEXCIsXG4gICAgICAgICAgaXNrZXk6IHRydWUsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IHllbGxvd2dyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiQ29tcGFueU5hbWVcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkN1YmUxXCIsXG4gICAgICAgICAgY29sb3I6IGJsdWVncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkNvbnRhY3ROYW1lXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJDdWJlMVwiLFxuICAgICAgICAgIGNvbG9yOiBibHVlZ3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJBZGRyZXNzXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJDdWJlMVwiLFxuICAgICAgICAgIGNvbG9yOiBibHVlZ3JhZFxuICAgICAgICB9XVxuICAgICAgfSwge1xuICAgICAgICBrZXk6IFwiQ2F0ZWdvcmllc1wiLFxuICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICBuYW1lOiBcIkNhdGVnb3J5SURcIixcbiAgICAgICAgICBpc2tleTogdHJ1ZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogeWVsbG93Z3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJDYXRlZ29yeU5hbWVcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkN1YmUxXCIsXG4gICAgICAgICAgY29sb3I6IGJsdWVncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJDdWJlMVwiLFxuICAgICAgICAgIGNvbG9yOiBibHVlZ3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJQaWN0dXJlXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJUcmlhbmdsZVVwXCIsXG4gICAgICAgICAgY29sb3I6IHJlZGdyYWRcbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiBcIk9yZGVyIERldGFpbHNcIixcbiAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgbmFtZTogXCJPcmRlcklEXCIsXG4gICAgICAgICAgaXNrZXk6IHRydWUsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IHllbGxvd2dyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiUHJvZHVjdElEXCIsXG4gICAgICAgICAgaXNrZXk6IHRydWUsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IHllbGxvd2dyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiVW5pdFByaWNlXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJNYWduZXRpY0RhdGFcIixcbiAgICAgICAgICBjb2xvcjogZ3JlZW5ncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIlF1YW50aXR5XCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJNYWduZXRpY0RhdGFcIixcbiAgICAgICAgICBjb2xvcjogZ3JlZW5ncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkRpc2NvdW50XCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJNYWduZXRpY0RhdGFcIixcbiAgICAgICAgICBjb2xvcjogZ3JlZW5ncmFkXG4gICAgICAgIH1dXG4gICAgICB9XTtcbiAgICAgIHZhciBsaW5rRGF0YUFycmF5ID0gW3tcbiAgICAgICAgZnJvbTogXCJQcm9kdWN0c1wiLFxuICAgICAgICB0bzogXCJTdXBwbGllcnNcIixcbiAgICAgICAgdGV4dDogXCIwLi5OXCIsXG4gICAgICAgIHRvVGV4dDogXCIxXCJcbiAgICAgIH0sIHtcbiAgICAgICAgZnJvbTogXCJQcm9kdWN0c1wiLFxuICAgICAgICB0bzogXCJDYXRlZ29yaWVzXCIsXG4gICAgICAgIHRleHQ6IFwiMC4uTlwiLFxuICAgICAgICB0b1RleHQ6IFwiMVwiXG4gICAgICB9LCB7XG4gICAgICAgIGZyb206IFwiT3JkZXIgRGV0YWlsc1wiLFxuICAgICAgICB0bzogXCJQcm9kdWN0c1wiLFxuICAgICAgICB0ZXh0OiBcIjAuLk5cIixcbiAgICAgICAgdG9UZXh0OiBcIjFcIlxuICAgICAgfV07XG4gICAgICBteURpYWdyYW0ubW9kZWwgPSAkKGdvLkdyYXBoTGlua3NNb2RlbCwge1xuICAgICAgICBjb3BpZXNBcnJheXM6IHRydWUsXG4gICAgICAgIGNvcGllc0FycmF5T2JqZWN0czogdHJ1ZSxcbiAgICAgICAgbm9kZURhdGFBcnJheTogbm9kZURhdGFBcnJheSxcbiAgICAgICAgbGlua0RhdGFBcnJheTogbGlua0RhdGFBcnJheVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBzaG93U2VsZWN0VGFibGVEaWFsb2c6IGZ1bmN0aW9uIHNob3dTZWxlY3RUYWJsZURpYWxvZygpIHtcbiAgICAgIHRoaXMuJHJlZnMuc2VsZWN0U2luZ2xlVGFibGVEaWFsb2cuYmVnaW5TZWxlY3RUYWJsZSgpO1xuICAgIH0sXG4gICAgc2hvd1NlbGVjdEZpZWxkQ29ubmVjdERpYWxvZzogZnVuY3Rpb24gc2hvd1NlbGVjdEZpZWxkQ29ubmVjdERpYWxvZygpIHtcbiAgICAgIHZhciBmcm9tVGFibGVJZCA9IFwiXCI7XG4gICAgICB2YXIgdG9UYWJsZUlkID0gXCJcIjtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0uc2VsZWN0aW9uLmVhY2goZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgaWYgKHBhcnQgaW5zdGFuY2VvZiBnby5Ob2RlKSB7XG4gICAgICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgZnJvbVRhYmxlSWQgPSBwYXJ0LmRhdGEudGFibGVJZDtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9UYWJsZUlkID0gcGFydC5kYXRhLnRhYmxlSWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCF0b1RhYmxlSWQpIHtcbiAgICAgICAgdG9UYWJsZUlkID0gZnJvbVRhYmxlSWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmcm9tVGFibGVJZCAhPSBcIlwiICYmIHRvVGFibGVJZCAhPSBcIlwiKSB7XG4gICAgICAgIHRoaXMuJHJlZnMudGFibGVSZWxhdGlvbkNvbm5lY3RUd29UYWJsZURpYWxvZy5iZWdpblNlbGVjdENvbm5lY3QoZnJvbVRhYmxlSWQsIHRvVGFibGVJZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+WFiOmAieS4rTLkuKroioLngrlcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRUYWJsZVRvRGlhZ3JhbTogZnVuY3Rpb24gYWRkVGFibGVUb0RpYWdyYW0odGFibGVEYXRhKSB7XG4gICAgICB2YXIgdGFibGVJZCA9IHRhYmxlRGF0YS5pZDtcbiAgICAgIHZhciB0YWJsZUlkcyA9IFt0YWJsZUlkXTtcblxuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgaWYgKCF0aGlzLnRhYmxlSXNFeGlzdEluRGlhZ3JhbSh0YWJsZUlkKSkge1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVzRmllbGRzQnlUYWJsZUlkcywge1xuICAgICAgICAgIFwidGFibGVJZHNcIjogdGFibGVJZHNcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgdmFyIGFsbEZpZWxkcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgdmFyIHNpbmdsZVRhYmxlID0gcmVzdWx0LmV4S1ZEYXRhLlRhYmxlc1swXTtcbiAgICAgICAgICAgIHZhciBhbGxGaWVsZHNTdHlsZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBhbGxGaWVsZHNbaV0uZGlzcGxheVRleHQgPSBhbGxGaWVsZHNbaV0uZmllbGROYW1lICsgXCJbXCIgKyBhbGxGaWVsZHNbaV0uZmllbGRDYXB0aW9uICsgXCJdXCI7XG4gICAgICAgICAgICAgIGFsbEZpZWxkc1N0eWxlLnB1c2goX3NlbGYucmVuZGVyZXJGaWVsZFN0eWxlKGFsbEZpZWxkc1tpXSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbW9kZWxOb2RlRGF0YSA9IHtcbiAgICAgICAgICAgICAgdGFibGVJZDogdGFibGVJZCxcbiAgICAgICAgICAgICAgbG9jOiBcIjAgMFwiLFxuICAgICAgICAgICAgICBmaWVsZHM6IGFsbEZpZWxkc1N0eWxlLFxuICAgICAgICAgICAgICB0YWJsZURhdGE6IHNpbmdsZVRhYmxlLFxuICAgICAgICAgICAgICB0YWJsZU5hbWU6IHNpbmdsZVRhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgICAgICAgdGFibGVDYXB0aW9uOiBzaW5nbGVUYWJsZS50YWJsZUNhcHRpb24sXG4gICAgICAgICAgICAgIHRhYmxlRGlzcGxheVRleHQ6IHNpbmdsZVRhYmxlLnRhYmxlTmFtZSArIFwiW1wiICsgc2luZ2xlVGFibGUudGFibGVDYXB0aW9uICsgXCJdXCIsXG4gICAgICAgICAgICAgIGtleTogc2luZ2xlVGFibGUudGFibGVJZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX3NlbGYudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuc3RhcnRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuXG4gICAgICAgICAgICBfc2VsZi50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5hZGROb2RlRGF0YShtb2RlbE5vZGVEYXRhKTtcblxuICAgICAgICAgICAgX3NlbGYudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuY29tbWl0VHJhbnNhY3Rpb24oXCJmbGFzaFwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor6XnlLvluIPkuK3lt7Lnu4/lrZjlnKjooag6XCIgKyB0YWJsZURhdGEudGV4dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVTZWxlY3Rpb246IGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLmNvbW1hbmRIYW5kbGVyLmNhbkRlbGV0ZVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0uY29tbWFuZEhhbmRsZXIuZGVsZXRlU2VsZWN0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbm5lY3RTZWxlY3Rpb25Ob2RlOiBmdW5jdGlvbiBjb25uZWN0U2VsZWN0aW9uTm9kZShjb25uZWN0RGF0YSkge1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5zdGFydFRyYW5zYWN0aW9uKFwiZmxhc2hcIik7XG4gICAgICB2YXIgbGluZURhdGEgPSB7XG4gICAgICAgIGxpbmVJZDogU3RyaW5nVXRpbGl0eS5HdWlkKCksXG4gICAgICAgIGZyb206IGNvbm5lY3REYXRhLmZyb20udGFibGVJZCxcbiAgICAgICAgdG86IGNvbm5lY3REYXRhLnRvLnRhYmxlSWQsXG4gICAgICAgIGZyb21UZXh0OiBjb25uZWN0RGF0YS5mcm9tLnRleHQsXG4gICAgICAgIHRvVGV4dDogY29ubmVjdERhdGEudG8udGV4dFxuICAgICAgfTtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuYWRkTGlua0RhdGEobGluZURhdGEpO1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5jb21taXRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuICAgIH0sXG4gICAgc2F2ZU1vZGVsVG9TZXJ2ZXI6IGZ1bmN0aW9uIHNhdmVNb2RlbFRvU2VydmVyKCkge1xuICAgICAgaWYgKHRoaXMucmVjb3JkSWQpIHtcbiAgICAgICAgdmFyIHNlbmREYXRhID0ge1xuICAgICAgICAgIHJlY29yZElkOiB0aGlzLnJlY29yZElkLFxuICAgICAgICAgIHJlbGF0aW9uQ29udGVudDogSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHRoaXMuZ2V0RGF0YUpzb24oKSksXG4gICAgICAgICAgcmVsYXRpb25EaWFncmFtSnNvbjogdGhpcy5nZXREaWFncmFtSnNvbigpXG4gICAgICAgIH07XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5zYXZlRGlhZ3JhbSwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluaXREaWFncmFtOiBmdW5jdGlvbiBpbml0RGlhZ3JhbSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmICh3aW5kb3cuZ29TYW1wbGVzKSBnb1NhbXBsZXMoKTtcbiAgICAgIHZhciAkID0gZ28uR3JhcGhPYmplY3QubWFrZTtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0gPSAkKGdvLkRpYWdyYW0sIFwidGFibGVSZWxhdGlvbkRpYWdyYW1EaXZcIiwge1xuICAgICAgICBhbGxvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgICAgYWxsb3dDb3B5OiBmYWxzZSxcbiAgICAgICAgbGF5b3V0OiAkKGdvLkZvcmNlRGlyZWN0ZWRMYXlvdXQsIHtcbiAgICAgICAgICBpc09uZ29pbmc6IGZhbHNlXG4gICAgICAgIH0pLFxuICAgICAgICBcInVuZG9NYW5hZ2VyLmlzRW5hYmxlZFwiOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHZhciB0YWJsZVJlbGF0aW9uRGlhZ3JhbSA9IHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW07XG4gICAgICB2YXIgbGlnaHRncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAxOiBcIiNFNkU2RkFcIixcbiAgICAgICAgMDogXCIjRkZGQUYwXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIGl0ZW1UZW1wbCA9ICQoZ28uUGFuZWwsIFwiSG9yaXpvbnRhbFwiLCAkKGdvLlNoYXBlLCB7XG4gICAgICAgIGRlc2lyZWRTaXplOiBuZXcgZ28uU2l6ZSgxMCwgMTApXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcImZpZ3VyZVwiLCBcImZpZ3VyZVwiKSwgbmV3IGdvLkJpbmRpbmcoXCJmaWxsXCIsIFwiY29sb3JcIikpLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICBzdHJva2U6IFwiIzMzMzMzM1wiLFxuICAgICAgICBmb250OiBcImJvbGQgMTRweCBzYW5zLXNlcmlmXCJcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcImRpc3BsYXlUZXh0XCIpKSk7XG4gICAgICB0YWJsZVJlbGF0aW9uRGlhZ3JhbS5ub2RlVGVtcGxhdGUgPSAkKGdvLk5vZGUsIFwiQXV0b1wiLCB7XG4gICAgICAgIHNlbGVjdGlvbkFkb3JuZWQ6IHRydWUsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgbGF5b3V0Q29uZGl0aW9uczogZ28uUGFydC5MYXlvdXRTdGFuZGFyZCAmIH5nby5QYXJ0LkxheW91dE5vZGVTaXplZCxcbiAgICAgICAgZnJvbVNwb3Q6IGdvLlNwb3QuQWxsU2lkZXMsXG4gICAgICAgIHRvU3BvdDogZ28uU3BvdC5BbGxTaWRlcyxcbiAgICAgICAgaXNTaGFkb3dlZDogdHJ1ZSxcbiAgICAgICAgc2hhZG93Q29sb3I6IFwiI0M1QzFBQVwiLFxuICAgICAgICBkb3VibGVDbGljazogZnVuY3Rpb24gZG91YmxlQ2xpY2soZSwgbm9kZSkge1xuICAgICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcoX3NlbGYuYWNJbnRlcmZhY2UudGFibGVWaWV3LCB7XG4gICAgICAgICAgICBcIm9wXCI6IFwidmlld1wiLFxuICAgICAgICAgICAgXCJyZWNvcmRJZFwiOiBub2RlLmRhdGEudGFibGVJZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICAgICAgdGl0bGU6IFwi6KGo6K6+6K6hXCJcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJsb2NhdGlvblwiLCBcImxvY1wiLCBnby5Qb2ludC5wYXJzZSksIG5ldyBnby5CaW5kaW5nKFwiZGVzaXJlZFNpemVcIiwgXCJ2aXNpYmxlXCIsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiBuZXcgZ28uU2l6ZShOYU4sIE5hTik7XG4gICAgICB9KS5vZk9iamVjdChcIkxJU1RcIiksICQoZ28uU2hhcGUsIFwiUm91bmRlZFJlY3RhbmdsZVwiLCB7XG4gICAgICAgIGZpbGw6IGxpZ2h0Z3JhZCxcbiAgICAgICAgc3Ryb2tlOiBcIiM3NTY4NzVcIixcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDFcbiAgICAgIH0pLCAkKGdvLlBhbmVsLCBcIlRhYmxlXCIsIHtcbiAgICAgICAgbWFyZ2luOiA4LFxuICAgICAgICBzdHJldGNoOiBnby5HcmFwaE9iamVjdC5GaWxsXG4gICAgICB9LCAkKGdvLlJvd0NvbHVtbkRlZmluaXRpb24sIHtcbiAgICAgICAgcm93OiAwLFxuICAgICAgICBzaXppbmc6IGdvLlJvd0NvbHVtbkRlZmluaXRpb24uTm9uZVxuICAgICAgfSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIHJvdzogMCxcbiAgICAgICAgYWxpZ25tZW50OiBnby5TcG90LkNlbnRlcixcbiAgICAgICAgbWFyZ2luOiBuZXcgZ28uTWFyZ2luKDAsIDE0LCAwLCAyKSxcbiAgICAgICAgZm9udDogXCJib2xkIDE2cHggc2Fucy1zZXJpZlwiXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJ0YWJsZURpc3BsYXlUZXh0XCIpKSwgJChcIlBhbmVsRXhwYW5kZXJCdXR0b25cIiwgXCJMSVNUXCIsIHtcbiAgICAgICAgcm93OiAwLFxuICAgICAgICBhbGlnbm1lbnQ6IGdvLlNwb3QuVG9wUmlnaHRcbiAgICAgIH0pLCAkKGdvLlBhbmVsLCBcIlZlcnRpY2FsXCIsIHtcbiAgICAgICAgbmFtZTogXCJMSVNUXCIsXG4gICAgICAgIHJvdzogMSxcbiAgICAgICAgcGFkZGluZzogMyxcbiAgICAgICAgYWxpZ25tZW50OiBnby5TcG90LlRvcExlZnQsXG4gICAgICAgIGRlZmF1bHRBbGlnbm1lbnQ6IGdvLlNwb3QuTGVmdCxcbiAgICAgICAgc3RyZXRjaDogZ28uR3JhcGhPYmplY3QuSG9yaXpvbnRhbCxcbiAgICAgICAgaXRlbVRlbXBsYXRlOiBpdGVtVGVtcGxcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwiaXRlbUFycmF5XCIsIFwiZmllbGRzXCIpKSkpO1xuICAgICAgdGFibGVSZWxhdGlvbkRpYWdyYW0ubGlua1RlbXBsYXRlID0gJChnby5MaW5rLCB7XG4gICAgICAgIHNlbGVjdGlvbkFkb3JuZWQ6IHRydWUsXG4gICAgICAgIGxheWVyTmFtZTogXCJGb3JlZ3JvdW5kXCIsXG4gICAgICAgIHJlc2hhcGFibGU6IHRydWUsXG4gICAgICAgIHJvdXRpbmc6IGdvLkxpbmsuQXZvaWRzTm9kZXMsXG4gICAgICAgIGNvcm5lcjogNSxcbiAgICAgICAgY3VydmU6IGdvLkxpbmsuSnVtcE92ZXJcbiAgICAgIH0sICQoZ28uU2hhcGUsIHtcbiAgICAgICAgc3Ryb2tlOiBcIiMzMDNCNDVcIixcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDEuNVxuICAgICAgfSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgZm9udDogXCJib2xkIDE0cHggc2Fucy1zZXJpZlwiLFxuICAgICAgICBzdHJva2U6IFwiIzE5NjdCM1wiLFxuICAgICAgICBzZWdtZW50SW5kZXg6IDAsXG4gICAgICAgIHNlZ21lbnRPZmZzZXQ6IG5ldyBnby5Qb2ludChOYU4sIE5hTiksXG4gICAgICAgIHNlZ21lbnRPcmllbnRhdGlvbjogZ28uTGluay5PcmllbnRVcHJpZ2h0XG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJmcm9tVGV4dFwiKSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgZm9udDogXCJib2xkIDE0cHggc2Fucy1zZXJpZlwiLFxuICAgICAgICBzdHJva2U6IFwiIzE5NjdCM1wiLFxuICAgICAgICBzZWdtZW50SW5kZXg6IC0xLFxuICAgICAgICBzZWdtZW50T2Zmc2V0OiBuZXcgZ28uUG9pbnQoTmFOLCBOYU4pLFxuICAgICAgICBzZWdtZW50T3JpZW50YXRpb246IGdvLkxpbmsuT3JpZW50VXByaWdodFxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwidG9UZXh0XCIpKSk7XG4gICAgfSxcbiAgICBsb2FkUmVsYXRpb25EZXRhaWxEYXRhOiBmdW5jdGlvbiBsb2FkUmVsYXRpb25EZXRhaWxEYXRhKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFNpbmdsZURpYWdyYW1EYXRhLCB7XG4gICAgICAgIHJlY29yZElkOiB0aGlzLnJlY29yZElkLFxuICAgICAgICBvcDogXCJFZGl0XCJcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5kYXRhLnJlbGF0aW9uQ29udGVudCkge1xuICAgICAgICAgICAgdmFyIGRhdGFKc29uID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHJlc3VsdC5kYXRhLnJlbGF0aW9uQ29udGVudCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhSnNvbik7XG5cbiAgICAgICAgICAgIF9zZWxmLnNldERhdGFKc29uKGRhdGFKc29uKTtcblxuICAgICAgICAgICAgX3NlbGYuY29udmVydFRvRnVsbEpzb24oZGF0YUpzb24sIF9zZWxmLmRyYXdPYmpJbkRpYWdyYW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGRyYXdPYmpJbkRpYWdyYW06IGZ1bmN0aW9uIGRyYXdPYmpJbkRpYWdyYW0oZnVsbEpzb24pIHtcbiAgICAgIHZhciAkID0gZ28uR3JhcGhPYmplY3QubWFrZTtcbiAgICAgIHZhciBibHVlZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTUwLCAxNTAsIDI1MClcIixcbiAgICAgICAgMC41OiBcInJnYig4NiwgODYsIDE4NilcIixcbiAgICAgICAgMTogXCJyZ2IoODYsIDg2LCAxODYpXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIGdyZWVuZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTU4LCAyMDksIDE1OSlcIixcbiAgICAgICAgMTogXCJyZ2IoNjcsIDEwMSwgNTYpXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIHJlZGdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDIwNiwgMTA2LCAxMDApXCIsXG4gICAgICAgIDE6IFwicmdiKDE4MCwgNTYsIDUwKVwiXG4gICAgICB9KTtcbiAgICAgIHZhciB5ZWxsb3dncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigyNTQsIDIyMSwgNTApXCIsXG4gICAgICAgIDE6IFwicmdiKDI1NCwgMTgyLCA1MClcIlxuICAgICAgfSk7XG4gICAgICB2YXIgbGlua0RhdGFBcnJheSA9IGZ1bGxKc29uLmxpbmVMaXN0O1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbCA9ICQoZ28uR3JhcGhMaW5rc01vZGVsLCB7XG4gICAgICAgIGNvcGllc0FycmF5czogdHJ1ZSxcbiAgICAgICAgY29waWVzQXJyYXlPYmplY3RzOiB0cnVlLFxuICAgICAgICBub2RlRGF0YUFycmF5OiBmdWxsSnNvbi50YWJsZUxpc3RcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9zZWxmLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLnN0YXJ0VHJhbnNhY3Rpb24oXCJmbGFzaFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bGxKc29uLmxpbmVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGxpbmVEYXRhID0gZnVsbEpzb24ubGluZUxpc3RbaV07XG5cbiAgICAgICAgICBfc2VsZi50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5hZGRMaW5rRGF0YShsaW5lRGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBfc2VsZi50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5jb21taXRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuICAgICAgfSwgNTAwKTtcbiAgICB9LFxuICAgIGNvbnZlcnRUb0Z1bGxKc29uOiBmdW5jdGlvbiBjb252ZXJ0VG9GdWxsSnNvbihzaW1wbGVKc29uLCBmdW5jKSB7XG4gICAgICB2YXIgZnVsbEpzb24gPSBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZShzaW1wbGVKc29uKTtcbiAgICAgIHZhciB0YWJsZUlkcyA9IG5ldyBBcnJheSgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpbXBsZUpzb24udGFibGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRhYmxlSWRzLnB1c2goc2ltcGxlSnNvbi50YWJsZUxpc3RbaV0udGFibGVJZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzLCB7XG4gICAgICAgIFwidGFibGVJZHNcIjogdGFibGVJZHNcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgdmFyIGFsbEZpZWxkcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIHZhciBhbGxUYWJsZXMgPSByZXN1bHQuZXhLVkRhdGEuVGFibGVzO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdWxsSnNvbi50YWJsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzaW5nbGVUYWJsZURhdGEgPSBfc2VsZi5nZXRTaW5nbGVUYWJsZURhdGEoYWxsVGFibGVzLCBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVJZCk7XG5cbiAgICAgICAgICAgIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS50YWJsZURhdGEgPSBzaW5nbGVUYWJsZURhdGE7XG4gICAgICAgICAgICBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVOYW1lID0gc2luZ2xlVGFibGVEYXRhLnRhYmxlTmFtZTtcbiAgICAgICAgICAgIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS50YWJsZUNhcHRpb24gPSBzaW5nbGVUYWJsZURhdGEudGFibGVDYXB0aW9uO1xuICAgICAgICAgICAgZnVsbEpzb24udGFibGVMaXN0W2ldLnRhYmxlRGlzcGxheVRleHQgPSBzaW5nbGVUYWJsZURhdGEuZGlzcGxheVRleHQ7XG5cbiAgICAgICAgICAgIHZhciBzaW5nbGVUYWJsZUZpZWxkc0RhdGEgPSBfc2VsZi5nZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGEoYWxsRmllbGRzLCBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVJZCk7XG5cbiAgICAgICAgICAgIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS5maWVsZHMgPSBzaW5nbGVUYWJsZUZpZWxkc0RhdGE7XG4gICAgICAgICAgICBmdWxsSnNvbi50YWJsZUxpc3RbaV0ua2V5ID0gZnVsbEpzb24udGFibGVMaXN0W2ldLnRhYmxlSWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3NlbGYuZHJhd09iakluRGlhZ3JhbShmdWxsSnNvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBnZXRTaW5nbGVUYWJsZURhdGE6IGZ1bmN0aW9uIGdldFNpbmdsZVRhYmxlRGF0YShhbGxUYWJsZXMsIHRhYmxlSWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsVGFibGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbGxUYWJsZXNbaV0udGFibGVJZCA9PSB0YWJsZUlkKSB7XG4gICAgICAgICAgYWxsVGFibGVzW2ldLmRpc3BsYXlUZXh0ID0gYWxsVGFibGVzW2ldLnRhYmxlTmFtZSArIFwiW1wiICsgYWxsVGFibGVzW2ldLnRhYmxlQ2FwdGlvbiArIFwiXVwiO1xuICAgICAgICAgIHJldHVybiBhbGxUYWJsZXNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBnZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGE6IGZ1bmN0aW9uIGdldFNpbmdsZVRhYmxlRmllbGRzRGF0YShhbGxGaWVsZHMsIHRhYmxlSWQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFsbEZpZWxkc1tpXS5maWVsZFRhYmxlSWQgPT0gdGFibGVJZCkge1xuICAgICAgICAgIGFsbEZpZWxkc1tpXS5kaXNwbGF5VGV4dCA9IGFsbEZpZWxkc1tpXS5maWVsZE5hbWUgKyBcIltcIiArIGFsbEZpZWxkc1tpXS5maWVsZENhcHRpb24gKyBcIl1cIjtcbiAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnJlbmRlcmVyRmllbGRTdHlsZShhbGxGaWVsZHNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgcmVuZGVyZXJGaWVsZFN0eWxlOiBmdW5jdGlvbiByZW5kZXJlckZpZWxkU3R5bGUoZmllbGQpIHtcbiAgICAgIGlmIChmaWVsZC5maWVsZElzUGsgPT0gXCLmmK9cIikge1xuICAgICAgICBmaWVsZC5jb2xvciA9IHRoaXMuZ2V0S2V5RmllbGRCcnVzaCgpO1xuICAgICAgICBmaWVsZC5maWd1cmUgPSBcIkRlY2lzaW9uXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWVsZC5jb2xvciA9IHRoaXMuZ2V0Tm9yRmllbGRCcnVzaCgpO1xuICAgICAgICBmaWVsZC5maWd1cmUgPSBcIkN1YmUxXCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaWVsZDtcbiAgICB9LFxuICAgIGdldEtleUZpZWxkQnJ1c2g6IGZ1bmN0aW9uIGdldEtleUZpZWxkQnJ1c2goKSB7XG4gICAgICByZXR1cm4gZ28uR3JhcGhPYmplY3QubWFrZShnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigyNTQsIDIyMSwgNTApXCIsXG4gICAgICAgIDE6IFwicmdiKDI1NCwgMTgyLCA1MClcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXROb3JGaWVsZEJydXNoOiBmdW5jdGlvbiBnZXROb3JGaWVsZEJydXNoKCkge1xuICAgICAgcmV0dXJuIGdvLkdyYXBoT2JqZWN0Lm1ha2UoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTUwLCAxNTAsIDI1MClcIixcbiAgICAgICAgMC41OiBcInJnYig4NiwgODYsIDE4NilcIixcbiAgICAgICAgMTogXCJyZ2IoODYsIDg2LCAxODYpXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0RGF0YUpzb246IGZ1bmN0aW9uIGdldERhdGFKc29uKCkge1xuICAgICAgdmFyIGRhdGFKc29uID0ge1xuICAgICAgICB0YWJsZUxpc3Q6IFtdLFxuICAgICAgICBsaW5lTGlzdDogW11cbiAgICAgIH07XG4gICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLm5vZGVzLmVhY2goZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgaWYgKHBhcnQgaW5zdGFuY2VvZiBnby5Ob2RlKSB7XG4gICAgICAgICAgZGF0YUpzb24udGFibGVMaXN0LnB1c2goe1xuICAgICAgICAgICAgdGFibGVJZDogcGFydC5kYXRhLnRhYmxlSWQsXG4gICAgICAgICAgICBsb2M6IHBhcnQubG9jYXRpb24ueCArIFwiIFwiICsgcGFydC5sb2NhdGlvbi55XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFydCBpbnN0YW5jZW9mIGdvLkxpbmspIHtcbiAgICAgICAgICBhbGVydChcImxpbmVcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5saW5rcy5lYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIGlmIChwYXJ0IGluc3RhbmNlb2YgZ28uTGluaykge1xuICAgICAgICAgIGRhdGFKc29uLmxpbmVMaXN0LnB1c2goe1xuICAgICAgICAgICAgbGluZUlkOiBwYXJ0LmRhdGEubGluZUlkLFxuICAgICAgICAgICAgZnJvbTogcGFydC5kYXRhLmZyb20sXG4gICAgICAgICAgICB0bzogcGFydC5kYXRhLnRvLFxuICAgICAgICAgICAgZnJvbVRleHQ6IHBhcnQuZGF0YS5mcm9tVGV4dCxcbiAgICAgICAgICAgIHRvVGV4dDogcGFydC5kYXRhLnRvVGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkYXRhSnNvbjtcbiAgICB9LFxuICAgIHNldERhdGFKc29uOiBmdW5jdGlvbiBzZXREYXRhSnNvbihqc29uKSB7XG4gICAgICB0aGlzLmZvcm1hdEpzb24gPSBqc29uO1xuICAgIH0sXG4gICAgZ2V0RGlhZ3JhbUpzb246IGZ1bmN0aW9uIGdldERpYWdyYW1Kc29uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwudG9Kc29uKCk7XG4gICAgfSxcbiAgICBhbGVydERhdGFKc29uOiBmdW5jdGlvbiBhbGVydERhdGFKc29uKCkge1xuICAgICAgdmFyIGRhdGFKc29uID0gdGhpcy5nZXREYXRhSnNvbigpO1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEpzb25Db2RlKGRhdGFKc29uKTtcbiAgICB9LFxuICAgIGFsZXJ0RGlhZ3JhbUpzb246IGZ1bmN0aW9uIGFsZXJ0RGlhZ3JhbUpzb24oKSB7XG4gICAgICB2YXIgZGlhZ3JhbUpzb24gPSB0aGlzLmdldERpYWdyYW1Kc29uKCk7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0SnNvbkNvZGUoZGlhZ3JhbUpzb24pO1xuICAgIH0sXG4gICAgdGFibGVJc0V4aXN0SW5EaWFncmFtOiBmdW5jdGlvbiB0YWJsZUlzRXhpc3RJbkRpYWdyYW0odGFibGVJZCkge1xuICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5ub2Rlcy5lYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIGlmIChwYXJ0IGluc3RhbmNlb2YgZ28uTm9kZSkge1xuICAgICAgICAgIGlmIChwYXJ0LmRhdGEudGFibGVJZCA9PSB0YWJsZUlkKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgZG93bkxvYWRNb2RlbFBORzogZnVuY3Rpb24gZG93bkxvYWRNb2RlbFBORygpIHtcbiAgICAgIGZ1bmN0aW9uIG15Q2FsbGJhY2soYmxvYikge1xuICAgICAgICB2YXIgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgIHZhciBmaWxlbmFtZSA9IFwibXlCbG9iRmlsZTEucG5nXCI7XG4gICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIGEuc3R5bGUgPSBcImRpc3BsYXk6IG5vbmVcIjtcbiAgICAgICAgYS5ocmVmID0gdXJsO1xuICAgICAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG5cbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgd2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iKGJsb2IsIGZpbGVuYW1lKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGEuY2xpY2soKTtcbiAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgYmxvYiA9IHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubWFrZUltYWdlRGF0YSh7XG4gICAgICAgIGJhY2tncm91bmQ6IFwid2hpdGVcIixcbiAgICAgICAgcmV0dXJuVHlwZTogXCJibG9iXCIsXG4gICAgICAgIHNjYWxlOiAxLFxuICAgICAgICBjYWxsYmFjazogbXlDYWxsYmFja1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwicmVsYXRpb25Db250ZW50T3V0ZXJXcmFwXFxcIiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tY29udGVudC1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLWNvbnRlbnQtaGVhZGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLWRlc2Mtb3V0ZXItd3JhcFxcXCIgdi1pZj1cXFwiZGlzcGxheURlc2NcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1yZWxhdGlvbi1kZXNjXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTU5MDdcXHU2Q0U4XFx1RkYxQXt7cmVsYXRpb24ucmVsYXRpb25EZXNjfX1cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tb3AtYnV0dG9ucy1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tb3AtYnV0dG9ucy1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXAgc2hhcGU9XFxcImNpcmNsZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwic2hvd1NlbGVjdFRhYmxlRGlhbG9nXFxcIiB0eXBlPVxcXCJzdWNjZXNzXFxcIiBpY29uPVxcXCJtZC1hZGRcXFwiPjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwic2hvd1NlbGVjdEZpZWxkQ29ubmVjdERpYWxvZ1xcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibG9nby1zdGVhbVxcXCI+XFx1OEZERVxcdTYzQTU8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBkaXNhYmxlZCB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1yZXR1cm4tbGVmdFxcXCI+XFx1NUYxNVxcdTUxNjU8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBkaXNhYmxlZCB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1xci1zY2FubmVyXFxcIj5cXHU1MTY4XFx1NUM0RjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIGRpc2FibGVkIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcIm1kLWdpdC1jb21wYXJlXFxcIj5cXHU1Mzg2XFx1NTNGMjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiYWxlcnREYXRhSnNvblxcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtY29kZVxcXCI+XFx1NjU3MFxcdTYzNkVKc29uPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJhbGVydERpYWdyYW1Kc29uXFxcIiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1jb2RlLXdvcmtpbmdcXFwiPlxcdTU2RkVcXHU1RjYySnNvbjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiZG93bkxvYWRNb2RlbFBOR1xcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtY2xvdWQtZG93bmxvYWRcXFwiPlxcdTRFMEJcXHU4RjdEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJzYXZlTW9kZWxUb1NlcnZlclxcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibG9nby1pbnN0YWdyYW1cXFwiPlxcdTRGRERcXHU1QjU4PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJkZWxldGVTZWxlY3Rpb25cXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1yZWxhdGlvbi1jb250ZW50LXdyYXBcXFwiIGlkPVxcXCJ0YWJsZVJlbGF0aW9uRGlhZ3JhbURpdlxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0LXNpbmdsZS10YWJsZS1kaWFsb2cgcmVmPVxcXCJzZWxlY3RTaW5nbGVUYWJsZURpYWxvZ1xcXCIgQG9uLXNlbGVjdGVkLXRhYmxlPVxcXCJhZGRUYWJsZVRvRGlhZ3JhbVxcXCI+PC9zZWxlY3Qtc2luZ2xlLXRhYmxlLWRpYWxvZz5cXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZS1yZWxhdGlvbi1jb25uZWN0LXR3by10YWJsZS1kaWFsb2cgcmVmPVxcXCJ0YWJsZVJlbGF0aW9uQ29ubmVjdFR3b1RhYmxlRGlhbG9nXFxcIiBAb24tY29tcGxldGVkLWNvbm5lY3Q9XFxcImNvbm5lY3RTZWxlY3Rpb25Ob2RlXFxcIj48L3RhYmxlLXJlbGF0aW9uLWNvbm5lY3QtdHdvLXRhYmxlLWRpYWxvZz5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LWRlZmF1bHQtdmFsdWUtZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldEdyb3VwVHJlZURhdGE6IFwiL1Jlc3QvQnVpbGRlci9FbnZWYXJpYWJsZUdyb3VwL0dldFRyZWVEYXRhXCIsXG4gICAgICAgIHJlbG9hZExpc3REYXRhOiBcIi9SZXN0L0J1aWxkZXIvRW52VmFyaWFibGUvR2V0TGlzdERhdGFcIlxuICAgICAgfSxcbiAgICAgIHNlbGVjdFR5cGU6IFwiQ29uc3RcIixcbiAgICAgIHNlbGVjdFZhbHVlOiBcIlwiLFxuICAgICAgc2VsZWN0VGV4dDogXCJcIixcbiAgICAgIGNvbnN0VmFsdWU6IFwiXCIsXG4gICAgICBsaXN0SGVpZ2h0OiA0NzAsXG4gICAgICB0cmVlOiB7XG4gICAgICAgIHRyZWVJZEZpZWxkTmFtZTogXCJlbnZHcm91cElkXCIsXG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRyZWVTZWxlY3RlZE5vZGU6IG51bGwsXG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgYXN5bmM6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHVybDogXCJcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiZW52R3JvdXBUZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiZW52R3JvdXBJZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwiZW52R3JvdXBQYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290SWQ6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICBfc2VsZi50cmVlTm9kZVNlbGVjdGVkKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkFzeW5jU3VjY2VzczogZnVuY3Rpb24gb25Bc3luY1N1Y2Nlc3MoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUsIG1zZykge1xuICAgICAgICAgICAgICBhcHBMaXN0LnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRhYmxlRGF0YTogW10sXG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0aXRsZTogJ+WPmOmHj+WQjeensCcsXG4gICAgICAgIGtleTogJ2VudlZhclRleHQnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+WPmOmHj+WAvCcsXG4gICAgICAgIGtleTogJ2VudlZhclZhbHVlJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICBrZXk6ICdlbnZWYXJJZCcsXG4gICAgICAgIHdpZHRoOiAxMjAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICB9LCBbTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5TZWxlY3RlZEJ1dHRvbihoLCBwYXJhbXMsIFwiZW52VmFySWRcIiwgX3NlbGYpXSk7XG4gICAgICAgIH1cbiAgICAgIH1dLFxuICAgICAgc2VhcmNoQ29uZGl0aW9uOiB7XG4gICAgICAgIGVudlZhckdyb3VwSWQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwYWdlVG90YWw6IDAsXG4gICAgICBwYWdlU2l6ZTogMTAwLFxuICAgICAgcGFnZU51bTogMVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5sb2FkRGF0YSgpO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KG9sZERhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKG9sZERhdGEpO1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNlbGVjdERlZmF1bHRWYWx1ZURpYWxvZ1dyYXA7XG4gICAgICB2YXIgaGVpZ2h0ID0gNDUwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICB3aWR0aDogOTgwLFxuICAgICAgICB0aXRsZTogXCLorr7nva7pu5jorqTlgLxcIlxuICAgICAgfSk7XG4gICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG5cbiAgICAgIGlmIChvbGREYXRhID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RWYWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuc2VsZWN0VGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMuY29uc3RWYWx1ZSA9IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIDtcbiAgICB9LFxuICAgIGxvYWREYXRhOiBmdW5jdGlvbiBsb2FkRGF0YSgpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRHcm91cFRyZWVEYXRhLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YSAhPSBudWxsICYmIHJlc3VsdC5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LmRhdGEubGVuZ3RoOyBpKyspIHt9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy50cmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiN6VHJlZVVMXCIpLCB0aGlzLnRyZWUudHJlZVNldHRpbmcsIHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICB0aGlzLnRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICAgICAgdGhpcy50cmVlLnRyZWVPYmouX2hvc3QgPSB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGdldFNlbGVjdEluc3RhbmNlTmFtZTogZnVuY3Rpb24gZ2V0U2VsZWN0SW5zdGFuY2VOYW1lKCkge1xuICAgICAgcmV0dXJuIEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZShcImluc3RhbmNlTmFtZVwiKTtcbiAgICB9LFxuICAgIHNlbGVjdENvbXBsZXRlOiBmdW5jdGlvbiBzZWxlY3RDb21wbGV0ZSgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0VHlwZSA9PSBcIkNvbnN0XCIpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uc3RWYWx1ZSA9PSBcIlwiKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36K6+572u5bi46YeP6buY6K6k5YC877yBXCIsIG51bGwpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5UeXBlID0gXCJDb25zdFwiO1xuICAgICAgICByZXN1bHQuVmFsdWUgPSB0aGlzLmNvbnN0VmFsdWU7XG4gICAgICAgIHJlc3VsdC5UZXh0ID0gdGhpcy5jb25zdFZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LlR5cGUgPSBcIkVudlZhclwiO1xuICAgICAgICByZXN1bHQuVmFsdWUgPSB0aGlzLnNlbGVjdFZhbHVlO1xuICAgICAgICByZXN1bHQuVGV4dCA9IHRoaXMuc2VsZWN0VGV4dDtcbiAgICAgIH1cblxuICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtZGVmYXVsdC12YWx1ZScsIHJlc3VsdCk7XG4gICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgfSxcbiAgICBjbGVhckNvbXBsZXRlOiBmdW5jdGlvbiBjbGVhckNvbXBsZXRlKCkge1xuICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtZGVmYXVsdC12YWx1ZScsIG51bGwpO1xuICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3REZWZhdWx0VmFsdWVEaWFsb2dXcmFwKTtcbiAgICB9LFxuICAgIHNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlKCkge30sXG4gICAgY2xlYXJTZWFyY2hDb25kaXRpb246IGZ1bmN0aW9uIGNsZWFyU2VhcmNoQ29uZGl0aW9uKCkge1xuICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuc2VhcmNoQ29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uW2tleV0udmFsdWUgPSBcIlwiO1xuICAgICAgfVxuICAgIH0sXG4gICAgdHJlZU5vZGVTZWxlY3RlZDogZnVuY3Rpb24gdHJlZU5vZGVTZWxlY3RlZChldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgdGhpcy5wYWdlTnVtID0gMTtcbiAgICAgIHRoaXMuY2xlYXJTZWFyY2hDb25kaXRpb24oKTtcbiAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmVudlZhckdyb3VwSWQudmFsdWUgPSB0cmVlTm9kZVt0aGlzLnRyZWUudHJlZUlkRmllbGROYW1lXTtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaCh7XG4gICAgICAgIHVybDogdGhpcy5hY0ludGVyZmFjZS5yZWxvYWRMaXN0RGF0YSxcbiAgICAgICAgcGFnZU51bTogdGhpcy5wYWdlTnVtLFxuICAgICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZSxcbiAgICAgICAgc2VhcmNoQ29uZGl0aW9uOiB0aGlzLnNlYXJjaENvbmRpdGlvbixcbiAgICAgICAgcGFnZUFwcE9iajogdGhpcyxcbiAgICAgICAgdGFibGVMaXN0OiB0aGlzLFxuICAgICAgICBpZEZpZWxkOiBcImVudlZhcklkXCIsXG4gICAgICAgIGF1dG9TZWxlY3RlZE9sZFJvd3M6IHRydWUsXG4gICAgICAgIHN1Y2Nlc3NGdW5jOiBudWxsLFxuICAgICAgICBsb2FkRGljdDogZmFsc2UsXG4gICAgICAgIGN1c3RQYXJhczoge31cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgc2VsZWN0ZWQ6IGZ1bmN0aW9uIHNlbGVjdGVkKGlkLCBwYXJhbXMpIHtcbiAgICAgIGNvbnNvbGUubG9nKHBhcmFtcyk7XG4gICAgICB0aGlzLnNlbGVjdFZhbHVlID0gcGFyYW1zLnJvdy5lbnZWYXJWYWx1ZTtcbiAgICAgIHRoaXMuc2VsZWN0VGV4dCA9IHBhcmFtcy5yb3cuZW52VmFyVGV4dDtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgIHJlZj1cXFwic2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lO21hcmdpbi10b3A6IDBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8dGFicyA6dmFsdWU9XFxcInNlbGVjdFR5cGVcXFwiIHYtbW9kZWw9XFxcInNlbGVjdFR5cGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWItcGFuZSBsYWJlbD1cXFwiXFx1NUUzOFxcdTkxQ0ZcXFwiIG5hbWU9XFxcIkNvbnN0XFxcIiA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gOmxhYmVsLXdpZHRoPVxcXCI4MFxcXCIgc3R5bGU9XFxcIndpZHRoOiA4MCU7bWFyZ2luOiA1MHB4IGF1dG8gYXV0bztcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NUUzOFxcdTkxQ0ZcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJjb25zdFZhbHVlXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWZvcm0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgbGFiZWw9XFxcIlxcdTczQUZcXHU1ODgzXFx1NTNEOFxcdTkxQ0ZcXFwiIG5hbWU9XFxcIkVudlZhclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImhlaWdodDogNDVweDtib3JkZXItYm90dG9tOiBkb3R0ZWQgMXB4ICM4YThhOGE7bWFyZ2luLWJvdHRvbTogMTBweDtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZmxvYXQ6IHJpZ2h0O3BhZGRpbmc6IDhweDtib3JkZXItcmFkaXVzOiA4cHg7Y29sb3I6b3JhbmdlcmVkO2JvcmRlcjogc29saWQgMXB4ICNhZGJlZDg7XFxcIj5cXHU1REYyXFx1N0VDRlxcdTkwMDlcXHU2MkU5XFx1RkYxQXt7c2VsZWN0VGV4dH19PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwid2lkdGg6IDMwJTtmbG9hdDogbGVmdDtoZWlnaHQ6IDUxNHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cXFwielRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwid2lkdGg6IDY4JTtmbG9hdDogbGVmdDtoZWlnaHQ6IDUxNHB4XFxcIiBjbGFzcz1cXFwiaXYtbGlzdC1wYWdlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XFxcImxpc3RIZWlnaHRcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJ0YWJsZURhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIDpoaWdobGlnaHQtcm93PVxcXCJ0cnVlXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBvbi1zZWxlY3Rpb24tY2hhbmdlPVxcXCJzZWxlY3Rpb25DaGFuZ2VcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICAgICAgPC90YWJzPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcInNlbGVjdENvbXBsZXRlKClcXFwiPiBcXHU3ODZFIFxcdThCQTQgPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNsZWFyQ29tcGxldGUoKVxcXCI+IFxcdTZFMDUgXFx1N0E3QSA8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCI+XFx1NTE3MyBcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pO1xudmFyIERlZmF1bHRWYWx1ZVV0aWxpdHkgPSB7XG4gIGZvcm1hdFRleHQ6IGZ1bmN0aW9uIGZvcm1hdFRleHQodHlwZSwgdGV4dCkge1xuICAgIGlmICh0eXBlID09IFwiQ29uc3RcIikge1xuICAgICAgcmV0dXJuIFwi6Z2Z5oCB5YC8OuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwiRW52VmFyXCIpIHtcbiAgICAgIHJldHVybiBcIueOr+Wig+WPmOmHjzrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIlwiKSB7XG4gICAgICByZXR1cm4gXCLjgJDml6DjgJFcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gXCLmnKrnn6XnsbvlnotcIiArIHRleHQ7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzZWxlY3Qtc2luZ2xlLXRhYmxlLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlRGF0YVVybDogXCIvUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZvclpUcmVlTm9kZUxpc3RcIlxuICAgICAgfSxcbiAgICAgIGpzRWRpdG9ySW5zdGFuY2U6IG51bGwsXG4gICAgICB0YWJsZVRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLl9ob3N0O1xuXG4gICAgICAgICAgICAgIGlmICh0cmVlTm9kZS5ub2RlVHlwZU5hbWUgPT0gXCJUYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWRUYWJsZShldmVudCwgdHJlZUlkLCB0cmVlTm9kZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWRUYWJsZShldmVudCwgdHJlZUlkLCBudWxsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZURhdGE6IG51bGwsXG4gICAgICAgIGNsaWNrTm9kZTogbnVsbFxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkVGFibGVEYXRhOiBudWxsXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3RUYWJsZU1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdFRhYmxlOiBmdW5jdGlvbiBiZWdpblNlbGVjdFRhYmxlKCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNlbGVjdFRhYmxlTW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5nZXRUYWJsZURhdGFJbml0VHJlZSgpO1xuICAgICAgdmFyIGhlaWdodCA9IDQ1MDtcblxuICAgICAgaWYgKFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpID4gNTUwKSB7XG4gICAgICAgIGhlaWdodCA9IDYwMDtcbiAgICAgIH1cblxuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA1NzAsXG4gICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICB0aXRsZTogXCLpgInmi6nooahcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRUYWJsZURhdGFJbml0VHJlZTogZnVuY3Rpb24gZ2V0VGFibGVEYXRhSW5pdFRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVEYXRhVXJsLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi50YWJsZVRyZWUudHJlZURhdGEgPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgIF9zZWxmLiRyZWZzLnRhYmxlWlRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC10YWJsZS1zaW5nbGUtY29tcC1cIiArIFN0cmluZ1V0aWxpdHkuR3VpZCgpKTtcblxuICAgICAgICAgIF9zZWxmLnRhYmxlVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoX3NlbGYuJHJlZnMudGFibGVaVHJlZVVMKSwgX3NlbGYudGFibGVUcmVlLnRyZWVTZXR0aW5nLCBfc2VsZi50YWJsZVRyZWUudHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYudGFibGVUcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuXG4gICAgICAgICAgX3NlbGYudGFibGVUcmVlLnRyZWVPYmouX2hvc3QgPSBfc2VsZjtcbiAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmooX3NlbGYudGFibGVUcmVlLnRyZWVPYmosIF9zZWxmLiRyZWZzLnR4dF90YWJsZV9zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBzZWxlY3RlZFRhYmxlOiBmdW5jdGlvbiBzZWxlY3RlZFRhYmxlKGV2ZW50LCB0cmVlSWQsIHRhYmxlRGF0YSkge1xuICAgICAgdGhpcy5zZWxlY3RlZFRhYmxlRGF0YSA9IHRhYmxlRGF0YTtcbiAgICB9LFxuICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gY29tcGxldGVkKCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRUYWJsZURhdGEpIHtcbiAgICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtdGFibGUnLCB0aGlzLnNlbGVjdGVkVGFibGVEYXRhKTtcbiAgICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7fpgInmi6nooaghXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcInNlbGVjdFRhYmxlTW9kZWxEaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXdyYXAgZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXNvdXJjZS13cmFwIGMxLXNlbGVjdC1tb2RlbC1zb3VyY2UtaGFzLWJ1dHRvbnMtd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVxcXCJpbnB1dF9ib3JkZXJfYm90dG9tXFxcIiByZWY9XFxcInR4dF90YWJsZV9zZWFyY2hfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NVxcdTg4NjhcXHU1NDBEXFx1NjIxNlxcdTgwMDVcXHU2ODA3XFx1OTg5OFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXAgZGl2LWN1c3RvbS1zY3JvbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgcmVmPVxcXCJ0YWJsZVpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJib3R0b206IDEycHg7cmlnaHQ6IDEycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNvbXBsZXRlZCgpXFxcIiBpY29uPVxcXCJtZC1jaGVja21hcmtcXFwiPlxcdTc4NkVcXHU4QkE0PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj5cXHU1MTczXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LXNpbmdsZS13ZWJmb3JtLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlRGF0YVVybDogXCIvUmVzdC9CdWlsZGVyL0Zvcm0vR2V0V2ViRm9ybUZvclpUcmVlTm9kZUxpc3RcIlxuICAgICAgfSxcbiAgICAgIGpzRWRpdG9ySW5zdGFuY2U6IG51bGwsXG4gICAgICB0cmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICBpZiAodHJlZU5vZGUubm9kZVR5cGVOYW1lID09IFwiV2ViRm9ybVwiKSB7XG4gICAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWRGb3JtKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZURhdGE6IG51bGxcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZEZvcm1EYXRhOiBudWxsLFxuICAgICAgb2xkU2VsZWN0ZWRGb3JtSWQ6IFwiXCJcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzLnNlbGVjdE1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdEZvcm06IGZ1bmN0aW9uIGJlZ2luU2VsZWN0Rm9ybShmb3JtSWQpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3RNb2RlbERpYWxvZ1dyYXA7XG4gICAgICB0aGlzLmdldEZvcm1EYXRhSW5pdFRyZWUoKTtcbiAgICAgIHRoaXMub2xkU2VsZWN0ZWRGb3JtSWQgPSBmb3JtSWQ7XG4gICAgICB2YXIgaGVpZ2h0ID0gNTAwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA1NzAsXG4gICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICB0aXRsZTogXCLpgInmi6nnqpfkvZNcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRGb3JtRGF0YUluaXRUcmVlOiBmdW5jdGlvbiBnZXRGb3JtRGF0YUluaXRUcmVlKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYudHJlZS50cmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfc2VsZi50cmVlLnRyZWVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoX3NlbGYudHJlZS50cmVlRGF0YVtpXS5ub2RlVHlwZU5hbWUgPT0gXCJXZWJGb3JtXCIpIHtcbiAgICAgICAgICAgICAgX3NlbGYudHJlZS50cmVlRGF0YVtpXS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi90YWJsZS5wbmdcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX3NlbGYudHJlZS50cmVlRGF0YVtpXS5ub2RlVHlwZU5hbWUgPT0gXCJNb2R1bGVcIikge1xuICAgICAgICAgICAgICBfc2VsZi50cmVlLnRyZWVEYXRhW2ldLmljb24gPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvVGhlbWVzL1BuZzE2WDE2L2ZvbGRlci10YWJsZS5wbmdcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfc2VsZi4kcmVmcy5mb3JtWlRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1mb3JtLXNpbmdsZS1jb21wLVwiICsgU3RyaW5nVXRpbGl0eS5HdWlkKCkpO1xuXG4gICAgICAgICAgX3NlbGYudHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoX3NlbGYuJHJlZnMuZm9ybVpUcmVlVUwpLCBfc2VsZi50cmVlLnRyZWVTZXR0aW5nLCBfc2VsZi50cmVlLnRyZWVEYXRhKTtcblxuICAgICAgICAgIF9zZWxmLnRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG5cbiAgICAgICAgICBfc2VsZi50cmVlLnRyZWVPYmouX2hvc3QgPSBfc2VsZjtcbiAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmooX3NlbGYudHJlZS50cmVlT2JqLCBfc2VsZi4kcmVmcy50eHRfZm9ybV9zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG5cbiAgICAgICAgICBpZiAoX3NlbGYub2xkU2VsZWN0ZWRGb3JtSWQgIT0gbnVsbCAmJiBfc2VsZi5vbGRTZWxlY3RlZEZvcm1JZCAhPSBcIlwiKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWROb2RlID0gX3NlbGYudHJlZS50cmVlT2JqLmdldE5vZGVCeVBhcmFtKFwiaWRcIiwgX3NlbGYub2xkU2VsZWN0ZWRGb3JtSWQpO1xuXG4gICAgICAgICAgICBfc2VsZi50cmVlLnRyZWVPYmouc2VsZWN0Tm9kZShzZWxlY3RlZE5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIHNlbGVjdGVkRm9ybTogZnVuY3Rpb24gc2VsZWN0ZWRGb3JtKGV2ZW50LCB0cmVlSWQsIGZvcm1EYXRhKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRm9ybURhdGEgPSBmb3JtRGF0YTtcbiAgICB9LFxuICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gY29tcGxldGVkKCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRGb3JtRGF0YSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgIGZvcm1Nb2R1bGVJZDogdGhpcy5zZWxlY3RlZEZvcm1EYXRhLmF0dHI0LFxuICAgICAgICAgIGZvcm1Nb2R1bGVOYW1lOiB0aGlzLnNlbGVjdGVkRm9ybURhdGEuYXR0cjMsXG4gICAgICAgICAgZm9ybUlkOiB0aGlzLnNlbGVjdGVkRm9ybURhdGEuaWQsXG4gICAgICAgICAgZm9ybU5hbWU6IHRoaXMuc2VsZWN0ZWRGb3JtRGF0YS5hdHRyMSxcbiAgICAgICAgICBmb3JtQ29kZTogdGhpcy5zZWxlY3RlZEZvcm1EYXRhLmF0dHIyXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLWZvcm0nLCByZXN1bHQpO1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+mAieaLqeeql+S9kyFcIik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwic2VsZWN0TW9kZWxEaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXdyYXAgZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmU7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC1zb3VyY2Utd3JhcCBjMS1zZWxlY3QtbW9kZWwtc291cmNlLWhhcy1idXR0b25zLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cXFwiaW5wdXRfYm9yZGVyX2JvdHRvbVxcXCIgcmVmPVxcXCJ0eHRfZm9ybV9zZWFyY2hfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NVxcdTg4NjhcXHU1MzU1XFx1NTQwRFxcdTc5RjBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbm5lci13cmFwIGRpdi1jdXN0b20tc2Nyb2xsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwiZm9ybVpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJib3R0b206IDEycHg7cmlnaHQ6IDEycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNvbXBsZXRlZCgpXFxcIiBpY29uPVxcXCJtZC1jaGVja21hcmtcXFwiPlxcdTc4NkVcXHU4QkE0PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj5cXHU1MTczXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LXZhbGlkYXRlLXJ1bGUtZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbGVjdFZhbGlkYXRlVHlwZTogXCJOb0VtcHR5XCIsXG4gICAgICBydWxlUGFyYXM6IHtcbiAgICAgICAgbXNnOiBcIuWtl+autVwiLFxuICAgICAgICBudW1MZW5ndGg6IDQsXG4gICAgICAgIGRlY2ltYWxMZW5ndGg6IDAsXG4gICAgICAgIGpzTWV0aG9kTmFtZTogXCJcIixcbiAgICAgICAgcmVndWxhclRleHQ6IFwiXCIsXG4gICAgICAgIHJlZ3VsYXJNc2c6IFwiXCJcbiAgICAgIH0sXG4gICAgICBhZGRlZFZhbGlkYXRlUnVsZTogW10sXG4gICAgICB2YWxpZGF0ZUNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgIHRpdGxlOiAn57G75Z6LJyxcbiAgICAgICAga2V5OiAndmFsaWRhdGVUeXBlJyxcbiAgICAgICAgd2lkdGg6IDE1MCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflj4LmlbAnLFxuICAgICAgICBrZXk6ICd2YWxpZGF0ZVBhcmFzJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfliKDpmaQnLFxuICAgICAgICBrZXk6ICd2YWxpZGF0ZUlkJyxcbiAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uIGRlbFwiLFxuICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgICAgIF9zZWxmLmRlbFZhbGlkYXRlKHBhcmFtcy5yb3dbXCJ2YWxpZGF0ZUlkXCJdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXSk7XG4gICAgICAgIH1cbiAgICAgIH1dXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KG9sZERhdGEpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3RWYWxpZGF0ZVJ1bGVEaWFsb2dXcmFwO1xuICAgICAgdmFyIGhlaWdodCA9IDQ1MDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICBoZWlnaHQ6IDY4MCxcbiAgICAgICAgd2lkdGg6IDk4MCxcbiAgICAgICAgdGl0bGU6IFwi6K6+572u6aqM6K+B6KeE5YiZXCJcbiAgICAgIH0pO1xuICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIDEwMTAwKTtcbiAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgICAgdGhpcy5ydWxlUGFyYXMubXNnID0gXCLlrZfmrrVcIjtcbiAgICAgIHRoaXMucnVsZVBhcmFzLm51bUxlbmd0aCA9IDQ7XG4gICAgICB0aGlzLnJ1bGVQYXJhcy5kZWNpbWFsTGVuZ3RoID0gMDtcbiAgICAgIHRoaXMucnVsZVBhcmFzLmpzTWV0aG9kTmFtZSA9IFwiXCI7XG4gICAgICB0aGlzLnJ1bGVQYXJhcy5yZWd1bGFyVGV4dCA9IFwiXCI7XG4gICAgICB0aGlzLnJ1bGVQYXJhcy5yZWd1bGFyTXNnID0gXCJcIjtcbiAgICAgIHRoaXMuYWRkZWRWYWxpZGF0ZVJ1bGUgPSBbXTtcbiAgICAgIHRoaXMuYmluZE9sZFNlbGVjdGVkVmFsdWUob2xkRGF0YSk7XG4gICAgfSxcbiAgICBiaW5kT2xkU2VsZWN0ZWRWYWx1ZTogZnVuY3Rpb24gYmluZE9sZFNlbGVjdGVkVmFsdWUob2xkRGF0YSkge1xuICAgICAgdmFyIG9sZFNlbGVjdGVkVmFsdWUgPSBvbGREYXRhO1xuXG4gICAgICBpZiAob2xkU2VsZWN0ZWRWYWx1ZS5ydWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuYWRkZWRWYWxpZGF0ZVJ1bGUgPSBvbGRTZWxlY3RlZFZhbHVlLnJ1bGVzO1xuICAgICAgICB0aGlzLm1zZyA9IG9sZFNlbGVjdGVkVmFsdWUubXNnO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0U2VsZWN0SW5zdGFuY2VOYW1lOiBmdW5jdGlvbiBnZXRTZWxlY3RJbnN0YW5jZU5hbWUoKSB7XG4gICAgICByZXR1cm4gQmFzZVV0aWxpdHkuR2V0VXJsUGFyYVZhbHVlKFwiaW5zdGFuY2VOYW1lXCIpO1xuICAgIH0sXG4gICAgc2VsZWN0Q29tcGxldGU6IGZ1bmN0aW9uIHNlbGVjdENvbXBsZXRlKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuYWRkZWRWYWxpZGF0ZVJ1bGU7XG5cbiAgICAgIGlmICh0aGlzLmFkZGVkVmFsaWRhdGVSdWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICBtc2c6IHRoaXMucnVsZVBhcmFzLm1zZyxcbiAgICAgICAgICBydWxlczogdGhpcy5hZGRlZFZhbGlkYXRlUnVsZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC12YWxpZGF0ZS1ydWxlJywgSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUocmVzdWx0KSk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xlYXJDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2xlYXJDb21wbGV0ZTogZnVuY3Rpb24gY2xlYXJDb21wbGV0ZSgpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLWNsZWFyLXZhbGlkYXRlLXJ1bGUnKTtcbiAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc2VsZWN0VmFsaWRhdGVSdWxlRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBhZGRWYWxpZGF0ZVJ1bGU6IGZ1bmN0aW9uIGFkZFZhbGlkYXRlUnVsZSgpIHtcbiAgICAgIHZhciB2YWxpZGF0ZVBhcmFzID0gXCJcIjtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0VmFsaWRhdGVUeXBlID09IFwiTnVtYmVyXCIpIHtcbiAgICAgICAgdmFsaWRhdGVQYXJhcyA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh7XG4gICAgICAgICAgbnVtTGVuZ3RoOiB0aGlzLnJ1bGVQYXJhcy5udW1MZW5ndGgsXG4gICAgICAgICAgZGVjaW1hbExlbmd0aDogdGhpcy5ydWxlUGFyYXMuZGVjaW1hbExlbmd0aFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RWYWxpZGF0ZVR5cGUgPT0gXCJSZWd1bGFyXCIpIHtcbiAgICAgICAgdmFsaWRhdGVQYXJhcyA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh7XG4gICAgICAgICAgcmVndWxhclRleHQ6IHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJUZXh0LFxuICAgICAgICAgIHJlZ3VsYXJNc2c6IHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJNc2dcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0VmFsaWRhdGVUeXBlID09IFwiSnNNZXRob2RcIikge1xuICAgICAgICB2YWxpZGF0ZVBhcmFzID0gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHtcbiAgICAgICAgICBqc01ldGhvZE5hbWU6IHRoaXMucnVsZVBhcmFzLmpzTWV0aG9kTmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld1ZhbGlkYXRlUnVsZSA9IHtcbiAgICAgICAgXCJ2YWxpZGF0ZUlkXCI6IFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKCksXG4gICAgICAgIFwidmFsaWRhdGVUeXBlXCI6IHRoaXMuc2VsZWN0VmFsaWRhdGVUeXBlLFxuICAgICAgICBcInZhbGlkYXRlUGFyYXNcIjogdmFsaWRhdGVQYXJhc1xuICAgICAgfTtcbiAgICAgIHRoaXMuYWRkZWRWYWxpZGF0ZVJ1bGUucHVzaChuZXdWYWxpZGF0ZVJ1bGUpO1xuICAgIH0sXG4gICAgZGVsVmFsaWRhdGU6IGZ1bmN0aW9uIGRlbFZhbGlkYXRlKHZhbGlkYXRlSWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hZGRlZFZhbGlkYXRlUnVsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5hZGRlZFZhbGlkYXRlUnVsZVtpXS52YWxpZGF0ZUlkID09IHZhbGlkYXRlSWQpIHtcbiAgICAgICAgICB0aGlzLmFkZGVkVmFsaWRhdGVSdWxlLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcInNlbGVjdFZhbGlkYXRlUnVsZURpYWxvZ1dyYXBcXFwiIHYtY2xvYWsgY2xhc3M9XFxcImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjYXJkIHN0eWxlPVxcXCJtYXJnaW4tdG9wOiAxMHB4XFxcIiA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc2xvdD1cXFwidGl0bGVcXFwiPlxcdThCQkVcXHU3RjZFXFx1OUE4Q1xcdThCQzFcXHU4OUM0XFx1NTIxOTwvcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJzZWxlY3RWYWxpZGF0ZVR5cGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJOb0VtcHR5XFxcIj5cXHU0RTBEXFx1NEUzQVxcdTdBN0E8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJOdW1iZXJcXFwiPlxcdTY1NzBcXHU1QjU3PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiTW9iaWxlXFxcIj5cXHU2MjRCXFx1NjczQTwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIkRhdGVcXFwiPlxcdTY1RTVcXHU2NzFGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiVGltZVxcXCI+XFx1NjVGNlxcdTk1RjQ8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJEYXRlVGltZVxcXCI+XFx1NjVFNVxcdTY3MUZcXHU2NUY2XFx1OTVGNDwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIkVNYWlsXFxcIj5cXHU5MEFFXFx1NEVGNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIklEQ2FyZFxcXCI+XFx1OEVBQlxcdTRFRkRcXHU4QkMxPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiVVJMXFxcIj5VUkw8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJFTkNvZGVcXFwiPlxcdTgyRjFcXHU2NTg3PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiU2ltcGxlQ29kZVxcXCI+XFx1NzI3OVxcdTZCOEFcXHU1QjU3XFx1N0IyNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIlJlZ3VsYXJcXFwiPlxcdTZCNjNcXHU1MjE5XFx1ODg2OFxcdThGQkVcXHU1RjBGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiSnNNZXRob2RcXFwiPkpTXFx1NjVCOVxcdTZDRDU8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwic3VjY2Vzc1xcXCIgc2hhcGU9XFxcImNpcmNsZVxcXCIgaWNvbj1cXFwibWQtYWRkXFxcIiBzdHlsZT1cXFwibWFyZ2luLWxlZnQ6IDE1cHg7Y3Vyc29yOiBwb2ludGVyXFxcIiBAY2xpY2s9XFxcImFkZFZhbGlkYXRlUnVsZVxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2aWRlciBvcmllbnRhdGlvbj1cXFwibGVmdFxcXCIgOmRhc2hlZD1cXFwidHJ1ZVxcXCIgc3R5bGU9XFxcImZvbnQtc2l6ZTogMTJweFxcXCI+XFx1NTNDMlxcdTY1NzBcXHU4QkJFXFx1N0Y2RTwvZGl2aWRlcj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVxcdTY1NzBcXHU1QjU3XFx1N0M3QlxcdTU3OEJcXHU1M0MyXFx1NjU3MFxcdThCQkVcXHU3RjZFLS0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgdi1pZj1cXFwic2VsZWN0VmFsaWRhdGVUeXBlPT0nTnVtYmVyJ1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1mb3JtIDpsYWJlbC13aWR0aD1cXFwiODBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTk1N0ZcXHU1RUE2XFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dC1udW1iZXIgOm1heD1cXFwiMTBcXFwiIDptaW49XFxcIjFcXFwiIHYtbW9kZWw9XFxcInJ1bGVQYXJhcy5udW1MZW5ndGhcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBzdHlsZT1cXFwid2lkdGg6IDgwJVxcXCI+PC9pbnB1dC1udW1iZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjRcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlxcdTVDMEZcXHU2NTcwXFx1NEY0RFxcdTY1NzBcXHVGRjFBPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0LW51bWJlciA6bWF4PVxcXCIxMFxcXCIgOm1pbj1cXFwiMFxcXCIgdi1tb2RlbD1cXFwicnVsZVBhcmFzLmRlY2ltYWxMZW5ndGhcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBzdHlsZT1cXFwid2lkdGg6IDgwJVxcXCI+PC9pbnB1dC1udW1iZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Jvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVxcdTZCNjNcXHU1MjE5XFx1ODg2OFxcdThGQkVcXHU1RjBGXFx1N0M3QlxcdTU3OEJcXHU1M0MyXFx1NjU3MFxcdThCQkVcXHU3RjZFLS0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgdi1pZj1cXFwic2VsZWN0VmFsaWRhdGVUeXBlPT0nUmVndWxhcidcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktZm9ybSA6bGFiZWwtd2lkdGg9XFxcIjgwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU4ODY4XFx1OEZCRVxcdTVGMEZcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJFbnRlciBzb21ldGhpbmcuLi5cXFwiIHYtbW9kZWw9XFxcInJ1bGVQYXJhcy5yZWd1bGFyVGV4dFxcXCIgc3R5bGU9XFxcIndpZHRoOiA4MCVcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiNFxcXCIgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFx1NjNEMFxcdTc5M0FcXHU0RkUxXFx1NjA2RlxcdUZGMUE8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIkVudGVyIHNvbWV0aGluZy4uLlxcXCIgdi1tb2RlbD1cXFwicnVsZVBhcmFzLnJlZ3VsYXJNc2dcXFwiIHN0eWxlPVxcXCJ3aWR0aDogODAlXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Jvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLUpTXFx1NjVCOVxcdTZDRDVcXHU3QzdCXFx1NTc4QlxcdTUzQzJcXHU2NTcwXFx1OEJCRVxcdTdGNkUtLT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiB2LWlmPVxcXCJzZWxlY3RWYWxpZGF0ZVR5cGU9PSdKc01ldGhvZCdcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktZm9ybSA6bGFiZWwtd2lkdGg9XFxcIjgwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU2NUI5XFx1NkNENVxcdTU0MERcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJFbnRlciBzb21ldGhpbmcuLi5cXFwiIHYtbW9kZWw9XFxcInJ1bGVQYXJhcy5qc01ldGhvZE5hbWVcXFwiIHN0eWxlPVxcXCJ3aWR0aDogOTAlXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2NhcmQ+XFxuICAgICAgICAgICAgICAgICAgICA8Y2FyZCBzdHlsZT1cXFwibWFyZ2luLXRvcDogMTBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc2xvdD1cXFwidGl0bGVcXFwiPlxcdTVERjJcXHU2REZCXFx1NTJBMFxcdTg5QzRcXHU1MjE5PC9wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVxcXCJsZWZ0XFxcIiA6ZGFzaGVkPVxcXCJ0cnVlXFxcIiBzdHlsZT1cXFwiZm9udC1zaXplOiAxMnB4O21hcmdpbi10b3A6IDBweDttYXJnaW4tYm90dG9tOiA2cHhcXFwiPlxcdTYzRDBcXHU3OTNBXFx1NEZFMVxcdTYwNkY8L2RpdmlkZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gOmxhYmVsLXdpZHRoPVxcXCIwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVcXHU2M0QwXFx1NzkzQVxcdTRGRTFcXHU2MDZGLi4uXFxcIiAgdi1tb2RlbD1cXFwicnVsZVBhcmFzLm1zZ1xcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDEwcHg7b3ZlcmZsb3c6IGF1dG9cXFwiIGNsYXNzPVxcXCJpdi1saXN0LXBhZ2Utd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVxcXCJsZWZ0XFxcIiA6ZGFzaGVkPVxcXCJ0cnVlXFxcIiBzdHlsZT1cXFwiZm9udC1zaXplOiAxMnB4O21hcmdpbi10b3A6IDBweDttYXJnaW4tYm90dG9tOiA2cHhcXFwiPlxcdTlBOENcXHU4QkMxXFx1ODlDNFxcdTUyMTk8L2RpdmlkZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIGJvcmRlciA6Y29sdW1ucz1cXFwidmFsaWRhdGVDb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwiYWRkZWRWYWxpZGF0ZVJ1bGVcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgbm8tZGF0YS10ZXh0PVxcXCJcXHU4QkY3XFx1NkRGQlxcdTUyQTBcXHU5QThDXFx1OEJDMVxcdTg5QzRcXHU1MjE5XFxcIiA6aGVpZ2h0PVxcXCIxMzBcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvY2FyZD5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzZWxlY3RDb21wbGV0ZSgpXFxcIj4gXFx1Nzg2RSBcXHU4QkE0IDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJjbGVhckNvbXBsZXRlKClcXFwiPiBcXHU2RTA1IFxcdTdBN0EgPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiPlxcdTUxNzMgXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInRhYmxlLXJlbGF0aW9uLWNvbm5lY3QtdHdvLXRhYmxlLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHM6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzXCJcbiAgICAgIH0sXG4gICAgICBmcm9tVGFibGVGaWVsZDoge1xuICAgICAgICBmaWVsZERhdGE6IFtdLFxuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5a2X5q615ZCN56ewJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZE5hbWUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+agh+mimCcsXG4gICAgICAgICAga2V5OiAnZmllbGRDYXB0aW9uJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHRvVGFibGVGaWVsZDoge1xuICAgICAgICBmaWVsZERhdGE6IFtdLFxuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5a2X5q615ZCN56ewJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZE5hbWUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+agh+mimCcsXG4gICAgICAgICAga2V5OiAnZmllbGRDYXB0aW9uJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIGRpYWxvZ0hlaWdodDogMCxcbiAgICAgIHJlc3VsdERhdGE6IHtcbiAgICAgICAgZnJvbToge1xuICAgICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgICAgdGV4dDogXCJcIlxuICAgICAgICB9LFxuICAgICAgICB0bzoge1xuICAgICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgICAgdGV4dDogXCJcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5jb25uZWN0VGFibGVGaWVsZE1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBjb21wbGV0ZWQ6IGZ1bmN0aW9uIGNvbXBsZXRlZCgpIHtcbiAgICAgIGlmICh0aGlzLnJlc3VsdERhdGEuZnJvbS50ZXh0ICE9IFwiXCIgJiYgdGhpcy5yZXN1bHREYXRhLnRvLnRleHQgIT0gXCJcIikge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1jb21wbGV0ZWQtY29ubmVjdCcsIHRoaXMucmVzdWx0RGF0YSk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+36K6+572u5YWz6IGU5a2X5q61XCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RmllbGRzQW5kQmluZDogZnVuY3Rpb24gZ2V0RmllbGRzQW5kQmluZChmcm9tVGFibGVJZCwgdG9UYWJsZUlkKSB7XG4gICAgICB2YXIgdGFibGVJZHMgPSBbZnJvbVRhYmxlSWQsIHRvVGFibGVJZF07XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzLCB7XG4gICAgICAgIFwidGFibGVJZHNcIjogdGFibGVJZHNcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgdmFyIGFsbEZpZWxkcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIHZhciBhbGxUYWJsZXMgPSByZXN1bHQuZXhLVkRhdGEuVGFibGVzO1xuXG4gICAgICAgICAgdmFyIGZyb21UYWJsZUZpZWxkcyA9IF9zZWxmLmdldFNpbmdsZVRhYmxlRmllbGRzRGF0YShhbGxGaWVsZHMsIGZyb21UYWJsZUlkKTtcblxuICAgICAgICAgIHZhciB0b1RhYmxlRmllbGRzID0gX3NlbGYuZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhKGFsbEZpZWxkcywgdG9UYWJsZUlkKTtcblxuICAgICAgICAgIF9zZWxmLmZyb21UYWJsZUZpZWxkLmZpZWxkRGF0YSA9IGZyb21UYWJsZUZpZWxkcztcbiAgICAgICAgICBfc2VsZi50b1RhYmxlRmllbGQuZmllbGREYXRhID0gdG9UYWJsZUZpZWxkcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0Q29ubmVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3RDb25uZWN0KGZyb21UYWJsZUlkLCB0b1RhYmxlSWQpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5jb25uZWN0VGFibGVGaWVsZE1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS5mcm9tLnRhYmxlSWQgPSBmcm9tVGFibGVJZDtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS50by50YWJsZUlkID0gdG9UYWJsZUlkO1xuICAgICAgdGhpcy5yZXN1bHREYXRhLmZyb20udGV4dCA9IFwiXCI7XG4gICAgICB0aGlzLnJlc3VsdERhdGEudG8udGV4dCA9IFwiXCI7XG4gICAgICB0aGlzLmdldEZpZWxkc0FuZEJpbmQoZnJvbVRhYmxlSWQsIHRvVGFibGVJZCk7XG4gICAgICB2YXIgaGVpZ2h0ID0gNDUwO1xuXG4gICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA1NTApIHtcbiAgICAgICAgaGVpZ2h0ID0gNjAwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRpYWxvZ0hlaWdodCA9IGhlaWdodDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogODcwLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgdGl0bGU6IFwi6K6+572u5YWz6IGUXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhOiBmdW5jdGlvbiBnZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGEoYWxsRmllbGRzLCB0YWJsZUlkKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbGxGaWVsZHNbaV0uZmllbGRUYWJsZUlkID09IHRhYmxlSWQpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChhbGxGaWVsZHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICBzZWxlY3RlZEZyb21GaWVsZDogZnVuY3Rpb24gc2VsZWN0ZWRGcm9tRmllbGQocm93LCBpbmRleCkge1xuICAgICAgdGhpcy5yZXN1bHREYXRhLmZyb20udGV4dCA9IHJvdy5maWVsZE5hbWUgKyBcIlsxXVwiO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRUb0ZpZWxkOiBmdW5jdGlvbiBzZWxlY3RlZFRvRmllbGQocm93LCBpbmRleCkge1xuICAgICAgdGhpcy5yZXN1bHREYXRhLnRvLnRleHQgPSByb3cuZmllbGROYW1lICsgXCJbMC4uTl1cIjtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJjb25uZWN0VGFibGVGaWVsZE1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC1zb3VyY2Utd3JhcCBjMS1zZWxlY3QtbW9kZWwtc291cmNlLWhhcy1idXR0b25zLXdyYXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nOiAxMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogbGVmdDt3aWR0aDogNDklO2hlaWdodDogMTAwJTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJyZXN1bHREYXRhLmZyb20udGV4dFxcXCIgc3VmZml4PVxcXCJtZC1kb25lLWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTVGMDBcXHU1OUNCXFx1NTE3M1xcdTgwNTRcXHU1QjU3XFx1NkJCNVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIEBvbi1yb3ctY2xpY2s9XFxcInNlbGVjdGVkRnJvbUZpZWxkXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgOmhlaWdodD1cXFwiZGlhbG9nSGVpZ2h0LTE4MFxcXCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cXFwiZnJvbVRhYmxlRmllbGQuY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcImZyb21UYWJsZUZpZWxkLmZpZWxkRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OnJpZ2h0O3dpZHRoOiA0OSU7aGVpZ2h0OiAxMDAlO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcInJlc3VsdERhdGEudG8udGV4dFxcXCIgc3VmZml4PVxcXCJtZC1kb25lLWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTdFRDNcXHU2NzVGXFx1NTE3M1xcdTgwNTRcXHU1QjU3XFx1NkJCNVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIEBvbi1yb3ctY2xpY2s9XFxcInNlbGVjdGVkVG9GaWVsZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIDpoZWlnaHQ9XFxcImRpYWxvZ0hlaWdodC0xODBcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcInRvVGFibGVGaWVsZC5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwidG9UYWJsZUZpZWxkLmZpZWxkRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcImJvdHRvbTogMTJweDtyaWdodDogMTJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiY29tcGxldGVkKClcXFwiIGljb249XFxcIm1kLWNoZWNrbWFya1xcXCI+XFx1Nzg2RVxcdThCQTQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiPlxcdTUxNzNcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJtb2R1bGUtbGlzdC13ZWJmb3JtLWNvbXBcIiwge1xuICBwcm9wczogWydsaXN0SGVpZ2h0JywgJ21vZHVsZURhdGEnLCAnYWN0aXZlVGFiTmFtZSddLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZWRpdFZpZXc6IFwiL0hUTUwvQnVpbGRlci9Gb3JtL0Zvcm1EZXNpZ24uaHRtbFwiLFxuICAgICAgICBwcmV2aWV3V2ViRm9ybVVybDogXCIvSFRNTC9CdWlsZGVyL0Zvcm0vRm9ybVByZXZpZXcuaHRtbFwiLFxuICAgICAgICByZWxvYWREYXRhOiBcIi9SZXN0L0J1aWxkZXIvRm9ybS9HZXRMaXN0RGF0YVwiLFxuICAgICAgICBcImRlbGV0ZVwiOiBcIi9SZXN0L0J1aWxkZXIvRm9ybS9EZWxldGVcIixcbiAgICAgICAgbW92ZTogXCIvUmVzdC9CdWlsZGVyL0Zvcm0vTW92ZVwiXG4gICAgICB9LFxuICAgICAgaWRGaWVsZE5hbWU6IFwiZm9ybUlkXCIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IHtcbiAgICAgICAgZm9ybU1vZHVsZUlkOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW5Y+3JyxcbiAgICAgICAga2V5OiAnZm9ybUNvZGUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgd2lkdGg6IDgwXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn6KGo5Y2V5ZCN56ewJyxcbiAgICAgICAga2V5OiAnZm9ybU5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+WUr+S4gOWQjScsXG4gICAgICAgIGtleTogJ2Zvcm1TaW5nbGVOYW1lJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflpIfms6gnLFxuICAgICAgICBrZXk6ICdmb3JtRGVzYycsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW6L6R5pe26Ze0JyxcbiAgICAgICAga2V5OiAnZm9ybVVwZGF0ZVRpbWUnLFxuICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlUmVuZGVyZXIuVG9EYXRlWVlZWV9NTV9ERChoLCBwYXJhbXMucm93LmZvcm1VcGRhdGVUaW1lKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgIGtleTogJ2Zvcm1JZCcsXG4gICAgICAgIHdpZHRoOiAxMjAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICB9LCBbTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5FZGl0QnV0dG9uKGgsIHBhcmFtcywgX3NlbGYuaWRGaWVsZE5hbWUsIF9zZWxmKSwgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5EZWxldGVCdXR0b24oaCwgcGFyYW1zLCBfc2VsZi5pZEZpZWxkTmFtZSwgX3NlbGYpXSk7XG4gICAgICAgIH1cbiAgICAgIH1dLFxuICAgICAgdGFibGVEYXRhOiBbXSxcbiAgICAgIHRhYmxlRGF0YU9yaWdpbmFsOiBbXSxcbiAgICAgIHNlbGVjdGlvblJvd3M6IG51bGwsXG4gICAgICBwYWdlVG90YWw6IDAsXG4gICAgICBwYWdlU2l6ZTogNTAwLFxuICAgICAgcGFnZU51bTogMSxcbiAgICAgIHNlYXJjaFRleHQ6IFwiXCJcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHdpbmRvdy5fbW9kdWxlbGlzdHdlYmZvcm1jb21wID0gdGhpcztcbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBtb2R1bGVEYXRhOiBmdW5jdGlvbiBtb2R1bGVEYXRhKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBhY3RpdmVUYWJOYW1lOiBmdW5jdGlvbiBhY3RpdmVUYWJOYW1lKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBzZWFyY2hUZXh0OiBmdW5jdGlvbiBzZWFyY2hUZXh0KG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICB2YXIgZmlsdGVyVGFibGVEYXRhID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlRGF0YVtpXTtcblxuICAgICAgICAgIGlmIChyb3cuZm9ybUNvZGUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyb3cuZm9ybU5hbWUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YWJsZURhdGEgPSBmaWx0ZXJUYWJsZURhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IHRoaXMudGFibGVEYXRhT3JpZ2luYWw7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgZ2V0TW9kdWxlTmFtZTogZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vZHVsZURhdGEgPT0gbnVsbCA/IFwi6K+36YCJ5Lit5qih5Z2XXCIgOiB0aGlzLm1vZHVsZURhdGEubW9kdWxlVGV4dDtcbiAgICB9LFxuICAgIHNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlKHNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gc2VsZWN0aW9uO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCAmJiB0aGlzLmFjdGl2ZVRhYk5hbWUgPT0gXCJsaXN0LXdlYmZvcm1cIikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5mb3JtTW9kdWxlSWQudmFsdWUgPSB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWQ7XG4gICAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaCh7XG4gICAgICAgICAgdXJsOiB0aGlzLmFjSW50ZXJmYWNlLnJlbG9hZERhdGEsXG4gICAgICAgICAgcGFnZU51bTogdGhpcy5wYWdlTnVtLFxuICAgICAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAgICAgIHNlYXJjaENvbmRpdGlvbjogdGhpcy5zZWFyY2hDb25kaXRpb24sXG4gICAgICAgICAgcGFnZUFwcE9iajogdGhpcyxcbiAgICAgICAgICB0YWJsZUxpc3Q6IHRoaXMsXG4gICAgICAgICAgaWRGaWVsZDogdGhpcy5pZEZpZWxkTmFtZSxcbiAgICAgICAgICBhdXRvU2VsZWN0ZWRPbGRSb3dzOiB0cnVlLFxuICAgICAgICAgIHN1Y2Nlc3NGdW5jOiBmdW5jdGlvbiBzdWNjZXNzRnVuYyhyZXN1bHQsIHBhZ2VBcHBPYmopIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhT3JpZ2luYWwgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbG9hZERpY3Q6IGZhbHNlLFxuICAgICAgICAgIGN1c3RQYXJhczoge31cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZCgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdFZpZXcsIHtcbiAgICAgICAgICBcIm9wXCI6IFwiYWRkXCIsXG4gICAgICAgICAgXCJtb2R1bGVJZFwiOiB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWRcbiAgICAgICAgfSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuT3Blbk5ld1dpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICB9LCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqeaooeWdlyFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlZGl0OiBmdW5jdGlvbiBlZGl0KHJlY29yZElkKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdFZpZXcsIHtcbiAgICAgICAgXCJvcFwiOiBcInVwZGF0ZVwiLFxuICAgICAgICBcInJlY29yZElkXCI6IHJlY29yZElkXG4gICAgICB9KTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3Blbk5ld1dpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gZGVsKHJlY29yZElkKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZURlbGV0ZVJvdyh0aGlzLmFjSW50ZXJmYWNlW1wiZGVsZXRlXCJdLCByZWNvcmRJZCwgdGhpcyk7XG4gICAgfSxcbiAgICBzdGF0dXNFbmFibGU6IGZ1bmN0aW9uIHN0YXR1c0VuYWJsZShzdGF0dXNOYW1lKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHRoaXMuYWNJbnRlcmZhY2Uuc3RhdHVzQ2hhbmdlLCB0aGlzLnNlbGVjdGlvblJvd3MsIGFwcExpc3QuaWRGaWVsZE5hbWUsIHN0YXR1c05hbWUsIGFwcExpc3QpO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24gbW92ZSh0eXBlKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdNb3ZlRmFjZSh0aGlzLmFjSW50ZXJmYWNlLm1vdmUsIHRoaXMuc2VsZWN0aW9uUm93cywgdGhpcy5pZEZpZWxkTmFtZSwgdHlwZSwgdGhpcyk7XG4gICAgfSxcbiAgICBwcmV2aWV3V2ViRm9ybTogZnVuY3Rpb24gcHJldmlld1dlYkZvcm0oKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUodGhpcy5zZWxlY3Rpb25Sb3dzLCB0aGlzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICAgIHZhciByZWNvcmRJZCA9IHNlbGVjdGlvblJvd3NbMF1bdGhpcy5pZEZpZWxkTmFtZV07XG4gICAgICAgIHZhciBwcmV2aWV3VXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UucHJldmlld1dlYkZvcm1VcmwsIHtcbiAgICAgICAgICBGb3JtSWQ6IHJlY29yZElkXG4gICAgICAgIH0pO1xuICAgICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdUYWJXaW5kb3cocHJldmlld1VybCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9XFxcIm1vZHVsZS1saXN0LXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cXFwibGlzdC1idXR0b24td3JhcFxcXCIgY2xhc3M9XFxcImxpc3QtYnV0dG9uLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm1vZHVsZS1saXN0LW5hbWVcXFwiPjxJY29uIHR5cGU9XFxcImlvcy1hcnJvdy1kcm9wcmlnaHQtY2lyY2xlXFxcIiAvPiZuYnNwO1xcdTZBMjFcXHU1NzU3XFx1MzAxMHt7Z2V0TW9kdWxlTmFtZSgpfX1cXHUzMDExPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1idXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiAgdHlwZT1cXFwic3VjY2Vzc1xcXCIgQGNsaWNrPVxcXCJhZGQoKVxcXCIgaWNvbj1cXFwibWQtYWRkXFxcIj5cXHU2NUIwXFx1NTg5RTwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJwcmV2aWV3V2ViRm9ybSgpXFxcIiAgaWNvbj1cXFwibWQtcHJpY2V0YWdcXFwiPlxcdTk4ODRcXHU4OUM4PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBkaXNhYmxlZCBpY29uPVxcXCJtZC1hZGRcXFwiPlxcdTVGMTVcXHU1MTY1VVJMIDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgZGlzYWJsZWQgaWNvbj1cXFwibWQtYWxidW1zXFxcIj5cXHU1OTBEXFx1NTIzNjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgZGlzYWJsZWQgaWNvbj1cXFwibWQtYm9va21hcmtzXFxcIj5cXHU1Mzg2XFx1NTNGMlxcdTcyNDhcXHU2NzJDPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBkaXNhYmxlZCBpY29uPVxcXCJtZC1icnVzaFxcXCI+XFx1NTkwRFxcdTUyMzZJRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJtb3ZlKCd1cCcpXFxcIiBpY29uPVxcXCJtZC1hcnJvdy11cFxcXCI+XFx1NEUwQVxcdTc5RkI8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwibW92ZSgnZG93bicpXFxcIiBpY29uPVxcXCJtZC1hcnJvdy1kb3duXFxcIj5cXHU0RTBCXFx1NzlGQjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OiByaWdodDt3aWR0aDogMjAwcHg7bWFyZ2luLXJpZ2h0OiAxMHB4O1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cXFwiaW5wdXRfYm9yZGVyX2JvdHRvbVxcXCIgdi1tb2RlbD1cXFwic2VhcmNoVGV4dFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJjbGVhcjogYm90aFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XFxcImxpc3RIZWlnaHRcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJ0YWJsZURhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tc2VsZWN0aW9uLWNoYW5nZT1cXFwic2VsZWN0aW9uQ2hhbmdlXFxcIj48L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcIm1vZHVsZS1saXN0LXdlYmxpc3QtY29tcFwiLCB7XG4gIHByb3BzOiBbJ2xpc3RIZWlnaHQnLCAnbW9kdWxlRGF0YScsICdhY3RpdmVUYWJOYW1lJ10sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBlZGl0VmlldzogXCIvSFRNTC9CdWlsZGVyL0xpc3QvTGlzdERlc2lnbi5odG1sXCIsXG4gICAgICAgIHJlbG9hZERhdGE6IFwiL1Jlc3QvQnVpbGRlci9MaXN0L0dldExpc3REYXRhXCIsXG4gICAgICAgIFwiZGVsZXRlXCI6IFwiL1Jlc3QvQnVpbGRlci9MaXN0L0RlbGV0ZVwiLFxuICAgICAgICBtb3ZlOiBcIi9SZXN0L0J1aWxkZXIvTGlzdC9Nb3ZlXCJcbiAgICAgIH0sXG4gICAgICBpZEZpZWxkTmFtZTogXCJsaXN0SWRcIixcbiAgICAgIHNlYXJjaENvbmRpdGlvbjoge1xuICAgICAgICBsaXN0TW9kdWxlSWQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0eXBlOiAnc2VsZWN0aW9uJyxcbiAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJblj7cnLFxuICAgICAgICBrZXk6ICdsaXN0Q29kZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICB3aWR0aDogODBcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfliJfooajlkI3np7AnLFxuICAgICAgICBrZXk6ICdsaXN0TmFtZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5ZSv5LiA5ZCNJyxcbiAgICAgICAga2V5OiAnbGlzdFNpbmdsZU5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgIGtleTogJ2xpc3REZXNjJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJbovpHml7bpl7QnLFxuICAgICAgICBrZXk6ICdsaXN0VXBkYXRlVGltZScsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVSZW5kZXJlci5Ub0RhdGVZWVlZX01NX0REKGgsIHBhcmFtcy5yb3cubGlzdFVwZGF0ZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnbGlzdElkJyxcbiAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCBfc2VsZi5pZEZpZWxkTmFtZSwgX3NlbGYpLCBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkRlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIF9zZWxmLmlkRmllbGROYW1lLCBfc2VsZildKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgdGFibGVEYXRhT3JpZ2luYWw6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiA1MDAsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgc2VhcmNoVGV4dDogXCJcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgd2luZG93Ll9tb2R1bGVsaXN0d2VibGlzdGNvbXAgPSB0aGlzO1xuICB9LFxuICB3YXRjaDoge1xuICAgIG1vZHVsZURhdGE6IGZ1bmN0aW9uIG1vZHVsZURhdGEobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGFjdGl2ZVRhYk5hbWU6IGZ1bmN0aW9uIGFjdGl2ZVRhYk5hbWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIHNlYXJjaFRleHQ6IGZ1bmN0aW9uIHNlYXJjaFRleHQobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgIHZhciBmaWx0ZXJUYWJsZURhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGVEYXRhW2ldO1xuXG4gICAgICAgICAgaWYgKHJvdy5mb3JtQ29kZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5mb3JtTmFtZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IGZpbHRlclRhYmxlRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gdGhpcy50YWJsZURhdGFPcmlnaW5hbDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRNb2R1bGVOYW1lOiBmdW5jdGlvbiBnZXRNb2R1bGVOYW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kdWxlRGF0YSA9PSBudWxsID8gXCLor7fpgInkuK3mqKHlnZdcIiA6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVUZXh0O1xuICAgIH0sXG4gICAgc2VsZWN0aW9uQ2hhbmdlOiBmdW5jdGlvbiBzZWxlY3Rpb25DaGFuZ2Uoc2VsZWN0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBzZWxlY3Rpb247XG4gICAgfSxcbiAgICByZWxvYWREYXRhOiBmdW5jdGlvbiByZWxvYWREYXRhKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsICYmIHRoaXMuYWN0aXZlVGFiTmFtZSA9PSBcImxpc3Qtd2VibGlzdFwiKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmxpc3RNb2R1bGVJZC52YWx1ZSA9IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZDtcbiAgICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoKHtcbiAgICAgICAgICB1cmw6IHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkRGF0YSxcbiAgICAgICAgICBwYWdlTnVtOiB0aGlzLnBhZ2VOdW0sXG4gICAgICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uOiB0aGlzLnNlYXJjaENvbmRpdGlvbixcbiAgICAgICAgICBwYWdlQXBwT2JqOiB0aGlzLFxuICAgICAgICAgIHRhYmxlTGlzdDogdGhpcyxcbiAgICAgICAgICBpZEZpZWxkOiB0aGlzLmlkRmllbGROYW1lLFxuICAgICAgICAgIGF1dG9TZWxlY3RlZE9sZFJvd3M6IHRydWUsXG4gICAgICAgICAgc3VjY2Vzc0Z1bmM6IGZ1bmN0aW9uIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaikge1xuICAgICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFPcmlnaW5hbCA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2FkRGljdDogZmFsc2UsXG4gICAgICAgICAgY3VzdFBhcmFzOiB7fVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJhZGRcIixcbiAgICAgICAgICBcIm1vZHVsZUlkXCI6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3V2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgIH0sIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup5qih5Z2XIVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVkaXQ6IGZ1bmN0aW9uIGVkaXQocmVjb3JkSWQpIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICBcIm9wXCI6IFwidXBkYXRlXCIsXG4gICAgICAgIFwicmVjb3JkSWRcIjogcmVjb3JkSWRcbiAgICAgIH0pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3V2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDBcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiBkZWwocmVjb3JkSWQpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlRGVsZXRlUm93KHRoaXMuYWNJbnRlcmZhY2VbXCJkZWxldGVcIl0sIHJlY29yZElkLCB0aGlzKTtcbiAgICB9LFxuICAgIHN0YXR1c0VuYWJsZTogZnVuY3Rpb24gc3RhdHVzRW5hYmxlKHN0YXR1c05hbWUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2UodGhpcy5hY0ludGVyZmFjZS5zdGF0dXNDaGFuZ2UsIHRoaXMuc2VsZWN0aW9uUm93cywgYXBwTGlzdC5pZEZpZWxkTmFtZSwgc3RhdHVzTmFtZSwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKHR5cGUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld01vdmVGYWNlKHRoaXMuYWNJbnRlcmZhY2UubW92ZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCB0aGlzLmlkRmllbGROYW1lLCB0eXBlLCB0aGlzKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm1vZHVsZS1saXN0LXdyYXBcIj5cXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibGlzdC1idXR0b24td3JhcFwiIGNsYXNzPVwibGlzdC1idXR0b24tb3V0ZXItd3JhcFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kdWxlLWxpc3QtbmFtZVwiPjxJY29uIHR5cGU9XCJpb3MtYXJyb3ctZHJvcHJpZ2h0LWNpcmNsZVwiIC8+Jm5ic3A75qih5Z2X44CQe3tnZXRNb2R1bGVOYW1lKCl9feOAkTwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1idXR0b24taW5uZXItd3JhcFwiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiAgdHlwZT1cInN1Y2Nlc3NcIiBAY2xpY2s9XCJhZGQoKVwiIGljb249XCJtZC1hZGRcIj7mlrDlop48L2ktYnV0dG9uPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYWxidW1zXCI+5aSN5Yi2PC9pLWJ1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLXByaWNldGFnXCI+6aKE6KeIPC9pLWJ1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLWJvb2ttYXJrc1wiPuWOhuWPsueJiOacrDwvaS1idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJlcnJvclwiIGljb249XCJtZC1icnVzaFwiPuWkjeWItklEPC9pLWJ1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ3VwXFwnKVwiIGljb249XCJtZC1hcnJvdy11cFwiPuS4iuenuzwvaS1idXR0b24+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwibW92ZShcXCdkb3duXFwnKVwiIGljb249XCJtZC1hcnJvdy1kb3duXCI+5LiL56e7PC9pLWJ1dHRvbj5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiByaWdodDt3aWR0aDogMjAwcHg7bWFyZ2luLXJpZ2h0OiAxMHB4O1wiPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVwiaW5wdXRfYm9yZGVyX2JvdHRvbVwiIHYtbW9kZWw9XCJzZWFyY2hUZXh0XCI+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY2xlYXI6IGJvdGhcIj48L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxuICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSA6aGVpZ2h0PVwibGlzdEhlaWdodFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XCJjb2x1bW5zQ29uZmlnXCIgOmRhdGE9XCJ0YWJsZURhdGFcIlxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiaXYtbGlzdC10YWJsZVwiIDpoaWdobGlnaHQtcm93PVwidHJ1ZVwiXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XCJzZWxlY3Rpb25DaGFuZ2VcIj48L2ktdGFibGU+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1kYmxpbmstc2luZ2xlLWNvbXBcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXREQkxpbmtEYXRhVXJsOiBcIi9SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvREJMaW5rL0dldEZ1bGxEQkxpbmtcIixcbiAgICAgICAgZ2V0U2luZ2xlREJMaW5rRGF0YVVybDogXCIvUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RCTGluay9HZXREZXRhaWxEYXRhXCJcbiAgICAgIH0sXG4gICAgICBqc0VkaXRvckluc3RhbmNlOiBudWxsLFxuICAgICAgZGJMaW5rVHJlZToge1xuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJkYkxpbmtOYW1lXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiZGJJZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwiZGJPcmRlck51bVwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERCTGluayh0cmVlTm9kZSk7XG5cbiAgICAgICAgICAgICAgX3NlbGYuaGFuZGxlQ2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVEYXRhOiBudWxsLFxuICAgICAgICBjbGlja05vZGU6IG51bGxcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZERCTGlua0RhdGE6IG51bGxcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzLnNlbGVjdERCTGlua01vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdERCTGluazogZnVuY3Rpb24gYmVnaW5TZWxlY3REQkxpbmsoKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0REJMaW5rTW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5nZXREQkxpbmtEYXRhSW5pdFRyZWUoKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNDcwLFxuICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup5pWw5o2u5bqT6L+e5o6lXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0REJMaW5rRGF0YUluaXRUcmVlOiBmdW5jdGlvbiBnZXREQkxpbmtEYXRhSW5pdFRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0REJMaW5rRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuZGJMaW5rVHJlZS50cmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfc2VsZi5kYkxpbmtUcmVlLnRyZWVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBfc2VsZi5kYkxpbmtUcmVlLnRyZWVEYXRhW2ldLmljb24gPSBcIi4uLy4uLy4uLy4uL1RoZW1lcy9QbmcxNlgxNi9kYXRhYmFzZV9jb25uZWN0LnBuZ1wiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9zZWxmLiRyZWZzLmRiTGlua1pUcmVlVUwuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzZWxlY3QtZGJMaW5rLXNpbmdsZS1jb21wLVwiICsgU3RyaW5nVXRpbGl0eS5HdWlkKCkpO1xuXG4gICAgICAgICAgX3NlbGYuZGJMaW5rVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoX3NlbGYuJHJlZnMuZGJMaW5rWlRyZWVVTCksIF9zZWxmLmRiTGlua1RyZWUudHJlZVNldHRpbmcsIF9zZWxmLmRiTGlua1RyZWUudHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYuZGJMaW5rVHJlZS50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcblxuICAgICAgICAgIF9zZWxmLmRiTGlua1RyZWUudHJlZU9iai5faG9zdCA9IF9zZWxmO1xuICAgICAgICAgIGZ1enp5U2VhcmNoVHJlZU9iaihfc2VsZi5kYkxpbmtUcmVlLnRyZWVPYmosIF9zZWxmLiRyZWZzLnR4dF9kYkxpbmtfc2VhcmNoX3RleHQuJHJlZnMuaW5wdXQsIG51bGwsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgc2VsZWN0ZWREQkxpbms6IGZ1bmN0aW9uIHNlbGVjdGVkREJMaW5rKGRiTGlua0RhdGEpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWREQkxpbmtEYXRhID0gZGJMaW5rRGF0YTtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLWRibGluaycsIGRiTGlua0RhdGEpO1xuICAgIH0sXG4gICAgZ2V0U2VsZWN0ZWREQkxpbmtOYW1lOiBmdW5jdGlvbiBnZXRTZWxlY3RlZERCTGlua05hbWUoKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZERCTGlua0RhdGEgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCLor7fpgInmi6nmlbDmja7lupPov57mjqVcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkREJMaW5rRGF0YS5kYkxpbmtOYW1lO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0T2xkU2VsZWN0ZWREQkxpbms6IGZ1bmN0aW9uIHNldE9sZFNlbGVjdGVkREJMaW5rKGRiTGlua0lkKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0U2luZ2xlREJMaW5rRGF0YVVybCwge1xuICAgICAgICBcInJlY29yZElkXCI6IGRiTGlua0lkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLnNlbGVjdGVkREJMaW5rRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdC12aWV3LWRibGluay13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj57e2dldFNlbGVjdGVkREJMaW5rTmFtZSgpfX08L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ2YWx1ZVxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaWRcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvblxcXCIgQGNsaWNrPVxcXCJiZWdpblNlbGVjdERCTGluaygpXFxcIj48SWNvbiB0eXBlPVxcXCJpb3MtZnVubmVsXFxcIiAvPiZuYnNwO1xcdTkwMDlcXHU2MkU5PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPVxcXCJzZWxlY3REQkxpbmtNb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtd3JhcCBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXNvdXJjZS13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVxcXCJpbnB1dF9ib3JkZXJfYm90dG9tXFxcIiByZWY9XFxcInR4dF9kYkxpbmtfc2VhcmNoX3RleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVcXHU2NTcwXFx1NjM2RVxcdTVFOTNcXHU4RkRFXFx1NjNBNVxcdTU0MERcXHU3OUYwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbm5lci13cmFwIGRpdi1jdXN0b20tc2Nyb2xsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCByZWY9XFxcImRiTGlua1pUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZGItdGFibGUtcmVsYXRpb24tY29tcFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlc0RhdGFVcmw6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGb3JaVHJlZU5vZGVMaXN0XCIsXG4gICAgICAgIGdldFRhYmxlRmllbGRzVXJsOiBcIi9SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVGaWVsZHNCeVRhYmxlSWRcIlxuICAgICAgfSxcbiAgICAgIHJlbGF0aW9uVGFibGVUcmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRhYmxlVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB3aW5kb3cuX2RidGFibGVyZWxhdGlvbmNvbXA7XG5cbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWRSZWxhdGlvblRhYmxlTm9kZSh0cmVlTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVRyZWVSb290RGF0YToge1xuICAgICAgICAgIGlkOiBcIi0xXCIsXG4gICAgICAgICAgdGV4dDogXCLmlbDmja7lhbPogZRcIixcbiAgICAgICAgICBwYXJlbnRJZDogXCJcIixcbiAgICAgICAgICBub2RlVHlwZU5hbWU6IFwi5qC56IqC54K5XCIsXG4gICAgICAgICAgaWNvbjogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvY29pbnNfYWRkLnBuZ1wiLFxuICAgICAgICAgIF9ub2RlRXhUeXBlOiBcInJvb3RcIixcbiAgICAgICAgICB0YWJsZUlkOiBcIi0xXCJcbiAgICAgICAgfSxcbiAgICAgICAgY3VycmVudFNlbGVjdGVkTm9kZTogbnVsbFxuICAgICAgfSxcbiAgICAgIHJlbGF0aW9uVGFibGVFZGl0b3JWaWV3OiB7XG4gICAgICAgIGlzU2hvd1RhYmxlRWRpdERldGFpbDogZmFsc2UsXG4gICAgICAgIGlzU3ViRWRpdFRyOiBmYWxzZSxcbiAgICAgICAgaXNNYWluRWRpdFRyOiBmYWxzZSxcbiAgICAgICAgc2VsUEtEYXRhOiBbXSxcbiAgICAgICAgc2VsU2VsZktleURhdGE6IFtdLFxuICAgICAgICBzZWxGb3JlaWduS2V5RGF0YTogW11cbiAgICAgIH0sXG4gICAgICBlbXB0eUVkaXRvckRhdGE6IHtcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIHBhcmVudElkOiBcIlwiLFxuICAgICAgICBzaW5nbGVOYW1lOiBcIlwiLFxuICAgICAgICBwa0ZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgZGVzYzogXCJcIixcbiAgICAgICAgc2VsZktleUZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgb3V0ZXJLZXlGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIHJlbGF0aW9uVHlwZTogXCIxVG9OXCIsXG4gICAgICAgIGlzU2F2ZTogXCJ0cnVlXCIsXG4gICAgICAgIGNvbmRpdGlvbjogXCJcIixcbiAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgdGFibGVOYW1lOiBcIlwiLFxuICAgICAgICB0YWJsZUNhcHRpb246IFwiXCJcbiAgICAgIH0sXG4gICAgICBjdXJyZW50RWRpdG9yRGF0YToge1xuICAgICAgICBpZDogXCJcIixcbiAgICAgICAgcGFyZW50SWQ6IFwiXCIsXG4gICAgICAgIHNpbmdsZU5hbWU6IFwiXCIsXG4gICAgICAgIHBrRmllbGROYW1lOiBcIlwiLFxuICAgICAgICBkZXNjOiBcIlwiLFxuICAgICAgICBzZWxmS2V5RmllbGROYW1lOiBcIlwiLFxuICAgICAgICBvdXRlcktleUZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgcmVsYXRpb25UeXBlOiBcIjFUb05cIixcbiAgICAgICAgaXNTYXZlOiBcInRydWVcIixcbiAgICAgICAgY29uZGl0aW9uOiBcIlwiLFxuICAgICAgICB0YWJsZUlkOiBcIlwiLFxuICAgICAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIlxuICAgICAgfSxcbiAgICAgIHNlbGVjdFRhYmxlVHJlZToge1xuICAgICAgICBvbGRTZWxlY3RlZERCTGlua0lkOiBcIkpCdWlsZDRkTG9jYXRpb25EQkxpbmtcIixcbiAgICAgICAgZGlzYWJsZWREQkxpbms6IGZhbHNlLFxuICAgICAgICBkYkxpbmtFbnRpdGllczogW10sXG4gICAgICAgIHRhYmxlVHJlZU9iajogbnVsbCxcbiAgICAgICAgdGFibGVUcmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIGNoa1N0eWxlOiBcInJhZGlvXCIsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBpZiAodHJlZU5vZGUubm9kZVR5cGVOYW1lID09IFwiVGFibGVcIikge1xuICAgICAgICAgICAgICAgIHZhciBfc2VsZiA9IHdpbmRvdy5fZGJ0YWJsZXJlbGF0aW9uY29tcDtcbiAgICAgICAgICAgICAgICAkKFwiI2RpdlNlbGVjdFRhYmxlXCIpLmRpYWxvZyhcImNsb3NlXCIpO1xuXG4gICAgICAgICAgICAgICAgX3NlbGYuYWRkVGFibGVUb1JlbGF0aW9uVGFibGVUcmVlKHRyZWVOb2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdGFibGVUcmVlRGF0YTogbnVsbCxcbiAgICAgICAgYWxsVGFibGVUcmVlRGF0YTogbnVsbCxcbiAgICAgICAgc2VsZWN0ZWRUYWJsZU5hbWU6IFwi5pegXCJcbiAgICAgIH0sXG4gICAgICB0ZW1wRGF0YVN0b3JlOiB7fSxcbiAgICAgIHJlc3VsdERhdGE6IFtdLFxuICAgICAgdHJlZU5vZGVTZXR0aW5nOiB7XG4gICAgICAgIE1haW5UYWJsZU5vZGVJbWc6IFwiLi4vLi4vLi4vVGhlbWVzL1BuZzE2WDE2L3BhZ2Vfa2V5LnBuZ1wiLFxuICAgICAgICBTdWJUYWJsZU5vZGVJbWc6IFwiLi4vLi4vLi4vVGhlbWVzL1BuZzE2WDE2L3BhZ2VfcmVmcmVzaC5wbmdcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5nZXRUYWJsZXNBbmRCaW5kT2xkU2VsZWN0ZWQoKTtcbiAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNkYXRhUmVsYXRpb25aVHJlZVVMXCIpLCB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRhYmxlVHJlZVNldHRpbmcsIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudGFibGVUcmVlUm9vdERhdGEpO1xuICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlID0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmdldE5vZGVCeVBhcmFtKFwiaWRcIiwgXCItMVwiKTtcbiAgICB3aW5kb3cuX2RidGFibGVyZWxhdGlvbmNvbXAgPSB0aGlzO1xuICB9LFxuICB3YXRjaDoge1xuICAgIGN1cnJlbnRFZGl0b3JEYXRhOiB7XG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbiBoYW5kbGVyKHZhbCwgb2xkVmFsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZXN1bHREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMucmVzdWx0RGF0YVtpXS5pZCA9PSB2YWwuaWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodGhpcy5yZXN1bHREYXRhW2ldLCB2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZXA6IHRydWVcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICByZXN1bHRJdGVtQ29weUVkaXRFbmFibGVWYWx1ZTogZnVuY3Rpb24gcmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodG9PYmosIGZyb21PYmopIHtcbiAgICAgIHRvT2JqLnNpbmdsZU5hbWUgPSBmcm9tT2JqLnNpbmdsZU5hbWU7XG4gICAgICB0b09iai5wa0ZpZWxkTmFtZSA9IGZyb21PYmoucGtGaWVsZE5hbWU7XG4gICAgICB0b09iai5kZXNjID0gZnJvbU9iai5kZXNjO1xuICAgICAgdG9PYmouc2VsZktleUZpZWxkTmFtZSA9IGZyb21PYmouc2VsZktleUZpZWxkTmFtZTtcbiAgICAgIHRvT2JqLm91dGVyS2V5RmllbGROYW1lID0gZnJvbU9iai5vdXRlcktleUZpZWxkTmFtZTtcbiAgICAgIHRvT2JqLnJlbGF0aW9uVHlwZSA9IGZyb21PYmoucmVsYXRpb25UeXBlO1xuICAgICAgdG9PYmouaXNTYXZlID0gZnJvbU9iai5pc1NhdmU7XG4gICAgICB0b09iai5jb25kaXRpb24gPSBmcm9tT2JqLmNvbmRpdGlvbjtcbiAgICB9LFxuICAgIGdldFRhYmxlRmllbGRzQnlUYWJsZUlkOiBmdW5jdGlvbiBnZXRUYWJsZUZpZWxkc0J5VGFibGVJZCh0YWJsZUlkKSB7XG4gICAgICBpZiAodGFibGVJZCA9PSBcIi0xXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnRlbXBEYXRhU3RvcmVbXCJ0YWJsZUZpZWxkX1wiICsgdGFibGVJZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmModGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZUZpZWxkc1VybCwge1xuICAgICAgICAgIHRhYmxlSWQ6IHRhYmxlSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgX3NlbGYudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnRlbXBEYXRhU3RvcmVbXCJ0YWJsZUZpZWxkX1wiICsgdGFibGVJZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RW1wdHlSZXN1bHRJdGVtOiBmdW5jdGlvbiBnZXRFbXB0eVJlc3VsdEl0ZW0oKSB7XG4gICAgICByZXR1cm4gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUodGhpcy5lbXB0eUVkaXRvckRhdGEpO1xuICAgIH0sXG4gICAgZ2V0RXhpc3RSZXN1bHRJdGVtOiBmdW5jdGlvbiBnZXRFeGlzdFJlc3VsdEl0ZW0oaWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZXN1bHREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc3VsdERhdGFbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHREYXRhW2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZ2V0VGFibGVzQW5kQmluZE9sZFNlbGVjdGVkOiBmdW5jdGlvbiBnZXRUYWJsZXNBbmRCaW5kT2xkU2VsZWN0ZWQoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVzRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuc2VsZWN0VGFibGVUcmVlLmRiTGlua0VudGl0aWVzID0gcmVzdWx0LmV4S1ZEYXRhLmRiTGlua0VudGl0eUxpc3Q7XG4gICAgICAgICAgX3NlbGYuc2VsZWN0VGFibGVUcmVlLmFsbFRhYmxlVHJlZURhdGEgPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgIF9zZWxmLmJpbmRTZWxlY3RUYWJsZVRyZWUodHJ1ZSk7XG5cbiAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmooX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZU9iaiwgX3NlbGYuJHJlZnMudHh0X3RhYmxlX3NlYXJjaF90ZXh0LiRyZWZzLmlucHV0LCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGJpbmRTZWxlY3RUYWJsZVRyZWU6IGZ1bmN0aW9uIGJpbmRTZWxlY3RUYWJsZVRyZWUoaXNHZXRDb29raWVPbGRTZWxlY3RlZCkge1xuICAgICAgdmFyIG9sZFNlbGVjdGVkREJMaW5rSWQgPSBDb29raWVVdGlsaXR5LkdldENvb2tpZShcIkRCVFJDREJMSU5LSURcIik7XG5cbiAgICAgIGlmIChvbGRTZWxlY3RlZERCTGlua0lkICYmIGlzR2V0Q29va2llT2xkU2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RUYWJsZVRyZWUub2xkU2VsZWN0ZWREQkxpbmtJZCA9IG9sZFNlbGVjdGVkREJMaW5rSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvbGRTZWxlY3RlZERCTGlua0lkID0gdGhpcy5zZWxlY3RUYWJsZVRyZWUub2xkU2VsZWN0ZWREQkxpbmtJZDtcbiAgICAgIH1cblxuICAgICAgdmFyIGJpbmRUb1RyZWVEYXRhID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RUYWJsZVRyZWUuYWxsVGFibGVUcmVlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAob2xkU2VsZWN0ZWREQkxpbmtJZCA9PSB0aGlzLnNlbGVjdFRhYmxlVHJlZS5hbGxUYWJsZVRyZWVEYXRhW2ldLm91dGVySWQpIHtcbiAgICAgICAgICBiaW5kVG9UcmVlRGF0YS5wdXNoKHRoaXMuc2VsZWN0VGFibGVUcmVlLmFsbFRhYmxlVHJlZURhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZURhdGEgPSBiaW5kVG9UcmVlRGF0YTtcbiAgICAgIHRoaXMuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI3NlbGVjdFRhYmxlWlRyZWVVTFwiKSwgdGhpcy5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlU2V0dGluZywgdGhpcy5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlRGF0YSk7XG4gICAgICB0aGlzLnNlbGVjdFRhYmxlVHJlZS50YWJsZVRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgIH0sXG4gICAgY2hhbmdlREJMaW5rOiBmdW5jdGlvbiBjaGFuZ2VEQkxpbmsoZGJMaW5rSWQpIHtcbiAgICAgIENvb2tpZVV0aWxpdHkuU2V0Q29va2llMU1vbnRoKFwiREJUUkNEQkxJTktJRFwiLCBkYkxpbmtJZCk7XG4gICAgICB0aGlzLmJpbmRTZWxlY3RUYWJsZVRyZWUodHJ1ZSk7XG4gICAgfSxcbiAgICBnZXRNYWluVGFibGVEQkxpbmtJZDogZnVuY3Rpb24gZ2V0TWFpblRhYmxlREJMaW5rSWQoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VsZWN0VGFibGVUcmVlLmFsbFRhYmxlVHJlZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0VGFibGVUcmVlLmFsbFRhYmxlVHJlZURhdGFbaV0uaWQgPT0gdGhpcy5nZXRNYWluVGFibGVJZCgpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0VGFibGVUcmVlLmFsbFRhYmxlVHJlZURhdGFbaV0ub3V0ZXJJZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9LFxuICAgIGRlbGV0ZVNlbGVjdGVkUmVsYXRpb25UcmVlTm9kZTogZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWRSZWxhdGlvblRyZWVOb2RlKCkge1xuICAgICAgaWYgKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaXNQYXJlbnQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZXN1bHREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlc3VsdERhdGFbaV0uaWQgPT0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bHREYXRhLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlKHRoaXMuY3VycmVudEVkaXRvckRhdGEsIHRoaXMuZW1wdHlFZGl0b3JEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEVkaXRvckRhdGEuaWQgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RWRpdG9yRGF0YS5wYXJlbnRJZCA9IFwiXCI7XG4gICAgICAgICAgICB0aGlzLiRyZWZzLnNxbEdlbmVyYWxEZXNpZ25Db21wLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxQS0RhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsU2VsZktleURhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsRm9yZWlnbktleURhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTaG93VGFibGVFZGl0RGV0YWlsID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmoucmVtb3ZlTm9kZSh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5LiN6IO95Yig6Zmk54i26IqC54K5IVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLkuI3og73liKDpmaTmoLnoioLngrkhXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+mAieaLqeimgeWIoOmZpOeahOiKgueCuSFcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdFRhYmxlVG9SZWxhdGlvblRhYmxlOiBmdW5jdGlvbiBiZWdpblNlbGVjdFRhYmxlVG9SZWxhdGlvblRhYmxlKCkge1xuICAgICAgaWYgKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSkge1xuICAgICAgICAkKFwiI2RpdlNlbGVjdFRhYmxlXCIpLmRpYWxvZyh7XG4gICAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgICAgd2lkdGg6IDcwMFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG1haW5UYWJsZURCTGlua0lkID0gdGhpcy5nZXRNYWluVGFibGVEQkxpbmtJZCgpO1xuXG4gICAgICAgIGlmIChtYWluVGFibGVEQkxpbmtJZCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0VGFibGVUcmVlLm9sZFNlbGVjdGVkREJMaW5rSWQgPSBtYWluVGFibGVEQkxpbmtJZDtcbiAgICAgICAgICB0aGlzLmJpbmRTZWxlY3RUYWJsZVRyZWUoZmFsc2UpO1xuICAgICAgICAgIHRoaXMuc2VsZWN0VGFibGVUcmVlLmRpc2FibGVkREJMaW5rID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdFRhYmxlVHJlZS5kaXNhYmxlZERCTGluayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLpgInmi6nkuIDkuKrniLboioLngrkhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXBwZW5kTWFpblRhYmxlTm9kZVByb3A6IGZ1bmN0aW9uIGFwcGVuZE1haW5UYWJsZU5vZGVQcm9wKG5vZGUpIHtcbiAgICAgIG5vZGUuX25vZGVFeFR5cGUgPSBcIk1haW5Ob2RlXCI7XG4gICAgICBub2RlLmljb24gPSB0aGlzLnRyZWVOb2RlU2V0dGluZy5NYWluVGFibGVOb2RlSW1nO1xuICAgIH0sXG4gICAgYXBwZW5kU3ViVGFibGVOb2RlUHJvcDogZnVuY3Rpb24gYXBwZW5kU3ViVGFibGVOb2RlUHJvcChub2RlKSB7XG4gICAgICBub2RlLl9ub2RlRXhUeXBlID0gXCJTdWJOb2RlXCI7XG4gICAgICBub2RlLmljb24gPSB0aGlzLnRyZWVOb2RlU2V0dGluZy5TdWJUYWJsZU5vZGVJbWc7XG4gICAgfSxcbiAgICBidWlsZFJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBidWlsZFJlbGF0aW9uVGFibGVOb2RlKHNvdXJjZU5vZGUsIHRyZWVOb2RlSWQpIHtcbiAgICAgIGlmICh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuX25vZGVFeFR5cGUgPT0gXCJyb290XCIpIHtcbiAgICAgICAgdGhpcy5hcHBlbmRNYWluVGFibGVOb2RlUHJvcChzb3VyY2VOb2RlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYXBwZW5kU3ViVGFibGVOb2RlUHJvcChzb3VyY2VOb2RlKTtcbiAgICAgIH1cblxuICAgICAgc291cmNlTm9kZS50YWJsZUlkID0gc291cmNlTm9kZS5pZDtcblxuICAgICAgaWYgKHRyZWVOb2RlSWQpIHtcbiAgICAgICAgc291cmNlTm9kZS5pZCA9IHRyZWVOb2RlSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb3VyY2VOb2RlLmlkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzb3VyY2VOb2RlO1xuICAgIH0sXG4gICAgZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBnZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5nZXROb2RlQnlQYXJhbShcIl9ub2RlRXhUeXBlXCIsIFwiTWFpbk5vZGVcIik7XG5cbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldE1haW5UYWJsZUlkOiBmdW5jdGlvbiBnZXRNYWluVGFibGVJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpID8gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKS50YWJsZUlkIDogXCJcIjtcbiAgICB9LFxuICAgIGdldE1haW5UYWJsZU5hbWU6IGZ1bmN0aW9uIGdldE1haW5UYWJsZU5hbWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSA/IHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkudmFsdWUgOiBcIlwiO1xuICAgIH0sXG4gICAgZ2V0TWFpblRhYmxlQ2FwdGlvbjogZnVuY3Rpb24gZ2V0TWFpblRhYmxlQ2FwdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpID8gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKS5hdHRyMSA6IFwiXCI7XG4gICAgfSxcbiAgICBpc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBpc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pZCA9PSBcIi0xXCI7XG4gICAgfSxcbiAgICBpc1NlbGVjdGVkTWFpblJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBpc1NlbGVjdGVkTWFpblJlbGF0aW9uVGFibGVOb2RlKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5fbm9kZUV4VHlwZSA9PSBcIk1haW5Ob2RlXCI7XG4gICAgfSxcbiAgICBhZGRUYWJsZVRvUmVsYXRpb25UYWJsZVRyZWU6IGZ1bmN0aW9uIGFkZFRhYmxlVG9SZWxhdGlvblRhYmxlVHJlZShuZXdOb2RlKSB7XG4gICAgICBuZXdOb2RlID0gdGhpcy5idWlsZFJlbGF0aW9uVGFibGVOb2RlKG5ld05vZGUpO1xuICAgICAgdmFyIHRlbXBOb2RlID0gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKTtcblxuICAgICAgaWYgKHRlbXBOb2RlICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi5Y+q5YWB6K645a2Y5Zyo5LiA5Liq5Li76K6w5b2VIVwiLCBudWxsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmFkZE5vZGVzKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSwgLTEsIG5ld05vZGUsIGZhbHNlKTtcbiAgICAgIHZhciBuZXdSZXN1bHRJdGVtID0gdGhpcy5nZXRFbXB0eVJlc3VsdEl0ZW0oKTtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0uaWQgPSBuZXdOb2RlLmlkO1xuICAgICAgbmV3UmVzdWx0SXRlbS5wYXJlbnRJZCA9IHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pZDtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVJZCA9IG5ld05vZGUudGFibGVJZDtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVOYW1lID0gbmV3Tm9kZS52YWx1ZTtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVDYXB0aW9uID0gbmV3Tm9kZS5hdHRyMTtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVDb2RlID0gbmV3Tm9kZS5jb2RlO1xuICAgICAgdGhpcy5yZXN1bHREYXRhLnB1c2gobmV3UmVzdWx0SXRlbSk7XG4gICAgfSxcbiAgICBzZWxlY3RlZFJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBzZWxlY3RlZFJlbGF0aW9uVGFibGVOb2RlKG5vZGUpIHtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSA9IG5vZGU7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU2hvd1RhYmxlRWRpdERldGFpbCA9ICF0aGlzLmlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGUoKTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNNYWluRWRpdFRyID0gdGhpcy5pc1NlbGVjdGVkTWFpblJlbGF0aW9uVGFibGVOb2RlKCk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU3ViRWRpdFRyID0gIXRoaXMuaXNTZWxlY3RlZE1haW5SZWxhdGlvblRhYmxlTm9kZSgpO1xuXG4gICAgICBpZiAodGhpcy5pc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFBLRGF0YSA9IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQobm9kZS50YWJsZUlkKSAhPSBudWxsID8gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChub2RlLnRhYmxlSWQpIDogW107XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFNlbGZLZXlEYXRhID0gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChub2RlLnRhYmxlSWQpICE9IG51bGwgPyB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKG5vZGUudGFibGVJZCkgOiBbXTtcbiAgICAgIHZhciBwYXJlbnROb2RlID0gbm9kZS5nZXRQYXJlbnROb2RlKCk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbEZvcmVpZ25LZXlEYXRhID0gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChwYXJlbnROb2RlLnRhYmxlSWQpICE9IG51bGwgPyB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKHBhcmVudE5vZGUudGFibGVJZCkgOiBbXTtcbiAgICAgIHRoaXMuY3VycmVudEVkaXRvckRhdGEuaWQgPSB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaWQ7XG4gICAgICB0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLnBhcmVudElkID0gcGFyZW50Tm9kZS5pZDtcbiAgICAgIHZhciBleGlzdFJlc3VsdEl0ZW0gPSB0aGlzLmdldEV4aXN0UmVzdWx0SXRlbShub2RlLmlkKTtcblxuICAgICAgaWYgKGV4aXN0UmVzdWx0SXRlbSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodGhpcy5jdXJyZW50RWRpdG9yRGF0YSwgZXhpc3RSZXN1bHRJdGVtKTtcblxuICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfc2VsZi4kcmVmcy5zcWxHZW5lcmFsRGVzaWduQ29tcC5zZXRWYWx1ZShfc2VsZi5jdXJyZW50RWRpdG9yRGF0YS5jb25kaXRpb24pO1xuXG4gICAgICAgICAgX3NlbGYuJHJlZnMuc3FsR2VuZXJhbERlc2lnbkNvbXAuc2V0QWJvdXRUYWJsZUZpZWxkcyhfc2VsZi5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxTZWxmS2V5RGF0YSwgX3NlbGYucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsRm9yZWlnbktleURhdGEpO1xuICAgICAgICB9LCAzMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCLpgJrov4dnZXRFeGlzdFJlc3VsdEl0ZW3ojrflj5bkuI3liLDmlbDmja4hXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0UmVzdWx0RGF0YTogZnVuY3Rpb24gZ2V0UmVzdWx0RGF0YSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdERhdGE7XG4gICAgfSxcbiAgICBzZXJpYWxpemVSZWxhdGlvbjogZnVuY3Rpb24gc2VyaWFsaXplUmVsYXRpb24oaXNGb3JtYXQpIHtcbiAgICAgIGFsZXJ0KFwic2VyaWFsaXplUmVsYXRpb27lt7Lnu4/lgZznlKhcIik7XG4gICAgICByZXR1cm47XG5cbiAgICAgIGlmIChpc0Zvcm1hdCkge1xuICAgICAgICByZXR1cm4gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nRm9ybWF0KHRoaXMucmVzdWx0RGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcodGhpcy5yZXN1bHREYXRhKTtcbiAgICB9LFxuICAgIGRlc2VyaWFsaXplUmVsYXRpb246IGZ1bmN0aW9uIGRlc2VyaWFsaXplUmVsYXRpb24oanNvblN0cmluZykge1xuICAgICAgYWxlcnQoXCJkZXNlcmlhbGl6ZVJlbGF0aW9u5bey57uP5YGc55SoXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH0sXG4gICAgZ2V0VmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbWFpblRhYmxlSWQ6IHRoaXMuZ2V0TWFpblRhYmxlSWQoKSxcbiAgICAgICAgbWFpblRhYmxlTmFtZTogdGhpcy5nZXRNYWluVGFibGVOYW1lKCksXG4gICAgICAgIG1haW5UYWJsZUNhcHRpb246IHRoaXMuZ2V0TWFpblRhYmxlQ2FwdGlvbigpLFxuICAgICAgICByZWxhdGlvbkRhdGE6IHRoaXMucmVzdWx0RGF0YVxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUoanNvblN0cmluZykge1xuICAgICAgdmFyIHRlbXBEYXRhID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKGpzb25TdHJpbmcpO1xuICAgICAgdGhpcy5yZXN1bHREYXRhID0gdGVtcERhdGE7XG4gICAgICB2YXIgdHJlZU5vZGVEYXRhID0gbmV3IEFycmF5KCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRyZWVOb2RlID0ge1xuICAgICAgICAgIFwidmFsdWVcIjogdGVtcERhdGFbaV0udGFibGVOYW1lLFxuICAgICAgICAgIFwiYXR0cjFcIjogdGVtcERhdGFbaV0udGFibGVDYXB0aW9uLFxuICAgICAgICAgIFwidGV4dFwiOiBcIuOAkFwiICsgdGVtcERhdGFbaV0udGFibGVDb2RlICsgXCLjgJFcIiArIHRlbXBEYXRhW2ldLnRhYmxlQ2FwdGlvbiArIFwi44CQXCIgKyB0ZW1wRGF0YVtpXS50YWJsZU5hbWUgKyBcIuOAkVwiLFxuICAgICAgICAgIFwiaWRcIjogdGVtcERhdGFbaV0uaWQsXG4gICAgICAgICAgXCJwYXJlbnRJZFwiOiB0ZW1wRGF0YVtpXS5wYXJlbnRJZCxcbiAgICAgICAgICBcInRhYmxlSWRcIjogdGVtcERhdGFbaV0udGFibGVJZCxcbiAgICAgICAgICBcInRhYmxlTmFtZVwiOiB0ZW1wRGF0YVtpXS50YWJsZU5hbWUsXG4gICAgICAgICAgXCJ0YWJsZUNhcHRpb25cIjogdGVtcERhdGFbaV0udGFibGVDYXB0aW9uLFxuICAgICAgICAgIFwidGFibGVDb2RlXCI6IHRlbXBEYXRhW2ldLnRhYmxlQ29kZVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0ZW1wRGF0YVtpXS5wYXJlbnRJZCA9PSBcIi0xXCIpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZE1haW5UYWJsZU5vZGVQcm9wKHRyZWVOb2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZFN1YlRhYmxlTm9kZVByb3AodHJlZU5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJlZU5vZGVEYXRhLnB1c2godHJlZU5vZGUpO1xuICAgICAgfVxuXG4gICAgICB0cmVlTm9kZURhdGEucHVzaCh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRhYmxlVHJlZVJvb3REYXRhKTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI2RhdGFSZWxhdGlvblpUcmVlVUxcIiksIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudGFibGVUcmVlU2V0dGluZywgdHJlZU5vZGVEYXRhKTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgfSxcbiAgICBhbGVydFNlcmlhbGl6ZVJlbGF0aW9uOiBmdW5jdGlvbiBhbGVydFNlcmlhbGl6ZVJlbGF0aW9uKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEpzb25Db2RlKHRoaXMucmVzdWx0RGF0YSk7XG4gICAgfSxcbiAgICBpbnB1dERlc2VyaWFsaXplUmVsYXRpb246IGZ1bmN0aW9uIGlucHV0RGVzZXJpYWxpemVSZWxhdGlvbigpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuUHJvbXB0KHdpbmRvdywge1xuICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICBoZWlnaHQ6IDYwMFxuICAgICAgfSwgRGlhbG9nVXRpbGl0eS5EaWFsb2dQcm9tcHRJZCwgXCLor7fotLTlhaXmlbDmja7lhbPogZRKc29u6K6+572u5a2X56ym5LiyXCIsIGZ1bmN0aW9uIChqc29uU3RyaW5nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgd2luZG93Ll9kYnRhYmxlcmVsYXRpb25jb21wLnNldFZhbHVlKGpzb25TdHJpbmcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgYWxlcnQoXCLlj43luo/liJfljJblpLHotKU6XCIgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPVxcXCJkYi10YWJsZS1yZWxhdGlvbi1jb21wXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdmlkZXIgb3JpZW50YXRpb249XFxcImxlZnRcXFwiIDpkYXNoZWQ9XFxcInRydWVcXFwiIHN0eWxlPVxcXCJmb250LXNpemU6IDEycHg7bWFyZ2luLXRvcDogMHB4O21hcmdpbi1ib3R0b206IDEwcHhcXFwiPlxcdTY1NzBcXHU2MzZFXFx1NTE3M1xcdTdDRkJcXHU1MTczXFx1ODA1NFxcdThCQkVcXHU3RjZFPC9kaXZpZGVyPlxcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogbGVmdDt3aWR0aDogMzUwcHg7aGVpZ2h0OiAzMzBweDtib3JkZXI6ICNkZGRkZjEgMXB4IHNvbGlkO2JvcmRlci1yYWRpdXM6IDRweDtwYWRkaW5nOiAxMHB4IDEwcHggMTBweCAxMHB4O1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwIHNoYXBlPVxcXCJjaXJjbGVcXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJzdWNjZXNzXFxcIiBAY2xpY2s9XFxcImJlZ2luU2VsZWN0VGFibGVUb1JlbGF0aW9uVGFibGVcXFwiPiZuYnNwO1xcdTZERkJcXHU1MkEwJm5ic3A7PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJkZWxldGVTZWxlY3RlZFJlbGF0aW9uVHJlZU5vZGVcXFwiPiZuYnNwO1xcdTUyMjBcXHU5NjY0Jm5ic3A7PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJhbGVydFNlcmlhbGl6ZVJlbGF0aW9uXFxcIj5cXHU1RThGXFx1NTIxN1xcdTUzMTY8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImlucHV0RGVzZXJpYWxpemVSZWxhdGlvblxcXCI+XFx1NTNDRFxcdTVFOEZcXHU1MjE3XFx1NTMxNjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uPlxcdThCRjRcXHU2NjBFPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVxcXCJkYXRhUmVsYXRpb25aVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiIHN0eWxlPVxcXCJvdmVyZmxvdy14OiBoaWRkZW5cXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogcmlnaHQ7d2lkdGg6IDYzMHB4O2hlaWdodDogMzMwcHg7Ym9yZGVyOiAjZGRkZGYxIDFweCBzb2xpZDtib3JkZXItcmFkaXVzOiA0cHg7cGFkZGluZzogMTBweCAxMHB4IDEwcHggMTBweDtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVxcXCJsaWdodC1ncmF5LXRhYmxlXFxcIiBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgdi1pZj1cXFwicmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTaG93VGFibGVFZGl0RGV0YWlsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxNyVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAzMyVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxNSVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAzNSVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cXFwibGFiZWxcXFwiPlNpbmdsZU5hbWVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJjdXJyZW50RWRpdG9yRGF0YS5zaW5nbGVOYW1lXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTY3MkNcXHU1MTczXFx1ODA1NFxcdTRFMkRcXHU3Njg0XFx1NTUyRlxcdTRFMDBcXHU1NDBEXFx1NzlGMCxcXHU1M0VGXFx1NEVFNVxcdTRFM0FcXHU3QTdBXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cXFwibGFiZWxcXFwiPlBLS2V5XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHBsYWNlaG9sZGVyPVxcXCJcXHU5RUQ4XFx1OEJBNFxcdTRGN0ZcXHU3NTI4SWRcXHU1QjU3XFx1NkJCNVxcXCIgdi1tb2RlbD1cXFwiY3VycmVudEVkaXRvckRhdGEucGtGaWVsZE5hbWVcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBzdHlsZT1cXFwid2lkdGg6MTk5cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XFxcIml0ZW0gaW4gcmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsUEtEYXRhXFxcIiA6dmFsdWU9XFxcIml0ZW0uZmllbGROYW1lXFxcIiA6a2V5PVxcXCJpdGVtLmZpZWxkTmFtZVxcXCI+e3tpdGVtLmZpZWxkQ2FwdGlvbn19PC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHYtaWY9XFxcInJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU3ViRWRpdFRyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cXFwibGFiZWxcXFwiPlxcdTY1NzBcXHU2MzZFXFx1NTE3M1xcdTdDRkJcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdi1tb2RlbD1cXFwiY3VycmVudEVkaXRvckRhdGEucmVsYXRpb25UeXBlXFxcIiB0eXBlPVxcXCJidXR0b25cXFwiIHNpemU9XFxcInNtYWxsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCIxVG8xXFxcIj4xOjE8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIjFUb05cXFwiPjE6TjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XFxcImxhYmVsXFxcIj5cXHU2NjJGXFx1NTQyNlxcdTRGRERcXHU1QjU4XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHYtbW9kZWw9XFxcImN1cnJlbnRFZGl0b3JEYXRhLmlzU2F2ZVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwidHJ1ZVxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiZmFsc2VcXFwiPlxcdTU0MjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgdi1pZj1cXFwicmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTdWJFZGl0VHJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVxcXCJsYWJlbFxcXCI+XFx1NjcyQ1xcdThFQUJcXHU1MTczXFx1ODA1NFxcdTVCNTdcXHU2QkI1XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCBwbGFjZWhvbGRlcj1cXFwiXFx1OUVEOFxcdThCQTRcXHU0RjdGXFx1NzUyOElkXFx1NUI1N1xcdTZCQjVcXFwiIHYtbW9kZWw9XFxcImN1cnJlbnRFZGl0b3JEYXRhLnNlbGZLZXlGaWVsZE5hbWVcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBzdHlsZT1cXFwid2lkdGg6MTk5cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XFxcIml0ZW0gaW4gcmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsU2VsZktleURhdGFcXFwiIDp2YWx1ZT1cXFwiaXRlbS5maWVsZE5hbWVcXFwiIDprZXk9XFxcIml0ZW0uZmllbGROYW1lXFxcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVxcXCJsYWJlbFxcXCI+XFx1NTkxNlxcdTgwNTRcXHU1QjU3XFx1NkJCNVxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XFxcIlxcdTlFRDhcXHU4QkE0XFx1NEY3RlxcdTc1MjhJZFxcdTVCNTdcXHU2QkI1XFxcIiB2LW1vZGVsPVxcXCJjdXJyZW50RWRpdG9yRGF0YS5vdXRlcktleUZpZWxkTmFtZVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHN0eWxlPVxcXCJ3aWR0aDoxOTlweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cXFwiaXRlbSBpbiByZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxGb3JlaWduS2V5RGF0YVxcXCIgOnZhbHVlPVxcXCJpdGVtLmZpZWxkTmFtZVxcXCIgOmtleT1cXFwiaXRlbS5maWVsZE5hbWVcXFwiPnt7aXRlbS5maWVsZENhcHRpb259fTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cXFwibGFiZWxcXFwiPkRlc2NcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJjdXJyZW50RWRpdG9yRGF0YS5kZXNjXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjRcXHU2NjBFXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVxcXCJsYWJlbFxcXCI+XFx1NTJBMFxcdThGN0RcXHU2NzYxXFx1NEVGNlxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcWwtZ2VuZXJhbC1kZXNpZ24tY29tcCByZWY9XFxcInNxbEdlbmVyYWxEZXNpZ25Db21wXFxcIiA6c3FsRGVzaWduZXJIZWlnaHQ9XFxcIjc0XFxcIiB2LW1vZGVsPVxcXCJjdXJyZW50RWRpdG9yRGF0YS5jb25kaXRpb25cXFwiIDpzaG93RmllbGQ9XFxcInRydWVcXFwiPjwvc3FsLWdlbmVyYWwtZGVzaWduLWNvbXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cXFwiZGl2U2VsZWN0VGFibGVcXFwiIHRpdGxlPVxcXCJcXHU4QkY3XFx1OTAwOVxcdTYyRTlcXHU4ODY4XFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XFxcImlucHV0X2JvcmRlcl9ib3R0b21cXFwiIHJlZj1cXFwidHh0X3RhYmxlX3NlYXJjaF90ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1OEJGN1xcdThGOTNcXHU1MTY1XFx1ODg2OFxcdTU0MERcXHU2MjE2XFx1ODAwNVxcdTY4MDdcXHU5ODk4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3Qgdi1tb2RlbD1cXFwic2VsZWN0VGFibGVUcmVlLm9sZFNlbGVjdGVkREJMaW5rSWRcXFwiIHNsb3Q9XFxcInByZXBlbmRcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMjgwcHhcXFwiIEBvbi1jaGFuZ2U9XFxcImNoYW5nZURCTGlua1xcXCIgOmRpc2FibGVkPVxcXCJzZWxlY3RUYWJsZVRyZWUuZGlzYWJsZWREQkxpbmtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gOnZhbHVlPVxcXCJpdGVtLmRiSWRcXFwiIHYtZm9yPVxcXCJpdGVtIGluIHNlbGVjdFRhYmxlVHJlZS5kYkxpbmtFbnRpdGllc1xcXCI+e3tpdGVtLmRiTGlua05hbWV9fTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXG4gICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cXFwic2VsZWN0VGFibGVaVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWUgZGl2LWN1c3RvbS1zY3JvbGxcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6IDUwMHB4O292ZXJmbG93LXk6c2Nyb2xsO292ZXJmbG93LXg6aGlkZGVuXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImRlc2lnbi1odG1sLWVsZW0tbGlzdFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHt9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkZXNpZ24taHRtbC1lbGVtLWxpc3Qtd3JhcFwiPlxcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzaWduLWh0bWwtZWxlbS1saXN0LWl0ZW1cIj7moLzlvI/ljJY8L2Rpdj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2lnbi1odG1sLWVsZW0tbGlzdC1pdGVtXCI+6K+05piOPC9kaXY+XFxcbiAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJmZC1jb250cm9sLWJhc2UtaW5mb1wiLCB7XG4gIHByb3BzOiBbXCJ2YWx1ZVwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmFzZUluZm86IHtcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIHNlcmlhbGl6ZTogXCJcIixcbiAgICAgICAgbmFtZTogXCJcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcIlwiLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJcIixcbiAgICAgICAgY3VzdFJlYWRvbmx5OiBcIlwiLFxuICAgICAgICBjdXN0RGlzYWJsZWQ6IFwiXCIsXG4gICAgICAgIHN0eWxlOiBcIlwiLFxuICAgICAgICBkZXNjOiBcIlwiLFxuICAgICAgICBzdGF0dXM6IFwiXCJcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICB3YXRjaDoge1xuICAgIGJhc2VJbmZvOiBmdW5jdGlvbiBiYXNlSW5mbyhuZXdWYWwpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgbmV3VmFsKTtcbiAgICB9LFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShuZXdWYWwpIHtcbiAgICAgIHRoaXMuYmFzZUluZm8gPSBuZXdWYWw7XG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuYmFzZUluZm8gPSB0aGlzLnZhbHVlO1xuXG4gICAgaWYgKCF0aGlzLmJhc2VJbmZvLnN0YXR1cykge1xuICAgICAgdGhpcy5iYXNlSW5mby5zdGF0dXMgPSBcImVuYWJsZVwiO1xuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge30sXG4gIHRlbXBsYXRlOiBcIjx0YWJsZSBjbGFzcz1cXFwiaHRtbC1kZXNpZ24tcGx1Z2luLWRpYWxvZy10YWJsZS13cmFwZXJcXFwiIGNlbGxwYWRkaW5nPVxcXCIwXFxcIiBjZWxsc3BhY2luZz1cXFwiMFxcXCIgYm9yZGVyPVxcXCIwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDI0MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA5MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxMjBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogOTBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIC8+XFxuICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPklEXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5pZFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlNlcmlhbGl6ZVxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5zZXJpYWxpemVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwidHJ1ZVxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJmYWxzZVxcXCI+XFx1NTQyNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NTQyRlxcdTc1MjhcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcIm1hcmdpbjogYXV0b1xcXCIgdi1tb2RlbD1cXFwiYmFzZUluZm8uc3RhdHVzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImVuYWJsZVxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJkaXNhYmxlXFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5OYW1lXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5uYW1lXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+Q2xhc3NOYW1lXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5jbGFzc05hbWVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5QbGFjZWhvbGRlcjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5wbGFjZWhvbGRlclxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlJlYWRvbmx5XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLmN1c3RSZWFkb25seVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJyZWFkb25seVxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJub3JlYWRvbmx5XFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5EaXNhYmxlZFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5jdXN0RGlzYWJsZWRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiZGlzYWJsZWRcXFwiPlxcdTY2MkY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwibm9kaXNhYmxlZFxcXCI+XFx1NTQyNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NjgzN1xcdTVGMEZcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIHJvd3M9XFxcIjdcXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLnN0eWxlXFxcIj48L3RleHRhcmVhPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NTkwN1xcdTZDRThcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIHJvd3M9XFxcIjhcXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLmRlc2NcXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgICAgIDwvdGFibGU+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZmQtY29udHJvbC1iaW5kLXRvXCIsIHtcbiAgcHJvcHM6IFtcImJpbmRUb0ZpZWxkUHJvcFwiLCBcImRlZmF1bHRWYWx1ZVByb3BcIiwgXCJ2YWxpZGF0ZVJ1bGVzUHJvcFwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmluZFRvRmllbGQ6IHtcbiAgICAgICAgcmVsYXRpb25JZDogXCJcIixcbiAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgdGFibGVOYW1lOiBcIlwiLFxuICAgICAgICB0YWJsZUNhcHRpb246IFwiXCIsXG4gICAgICAgIGZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgZmllbGRDYXB0aW9uOiBcIlwiLFxuICAgICAgICBmaWVsZERhdGFUeXBlOiBcIlwiLFxuICAgICAgICBmaWVsZExlbmd0aDogXCJcIlxuICAgICAgfSxcbiAgICAgIHZhbGlkYXRlUnVsZXM6IHtcbiAgICAgICAgbXNnOiBcIlwiLFxuICAgICAgICBydWxlczogW11cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0VmFsdWU6IHtcbiAgICAgICAgZGVmYXVsdFR5cGU6IFwiXCIsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFRleHQ6IFwiXCJcbiAgICAgIH0sXG4gICAgICB0ZW1wRGF0YToge1xuICAgICAgICBkZWZhdWx0RGlzcGxheVRleHQ6IFwiXCJcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICB3YXRjaDoge1xuICAgIGJpbmRUb1Byb3A6IGZ1bmN0aW9uIGJpbmRUb1Byb3AobmV3VmFsdWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKG5ld1ZhbHVlKTtcbiAgICB9LFxuICAgIGJpbmRUb0ZpZWxkUHJvcDogZnVuY3Rpb24gYmluZFRvRmllbGRQcm9wKG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLmJpbmRUb0ZpZWxkID0gbmV3VmFsdWU7XG4gICAgfSxcbiAgICBkZWZhdWx0VmFsdWVQcm9wOiBmdW5jdGlvbiBkZWZhdWx0VmFsdWVQcm9wKG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICBpZiAoIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eSh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSkpIHtcbiAgICAgICAgdGhpcy50ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHQgPSBEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQodGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUsIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHZhbGlkYXRlUnVsZXNQcm9wOiBmdW5jdGlvbiB2YWxpZGF0ZVJ1bGVzUHJvcChuZXdWYWx1ZSkge1xuICAgICAgdGhpcy52YWxpZGF0ZVJ1bGVzID0gbmV3VmFsdWU7XG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuYmluZFRvRmllbGQgPSB0aGlzLmJpbmRUb0ZpZWxkUHJvcDtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIHNldENvbXBsZXRlZDogZnVuY3Rpb24gc2V0Q29tcGxldGVkKCkge1xuICAgICAgdGhpcy4kZW1pdCgnb24tc2V0LWNvbXBsZXRlZCcsIHRoaXMuYmluZFRvRmllbGQsIHRoaXMuZGVmYXVsdFZhbHVlLCB0aGlzLnZhbGlkYXRlUnVsZXMpO1xuICAgIH0sXG4gICAgc2VsZWN0QmluZEZpZWxkVmlldzogZnVuY3Rpb24gc2VsZWN0QmluZEZpZWxkVmlldygpIHtcbiAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHRoaXM7XG4gICAgICB3aW5kb3cucGFyZW50LmFwcEZvcm0uc2VsZWN0QmluZFRvU2luZ2xlRmllbGREaWFsb2dCZWdpbih3aW5kb3csIHRoaXMuZ2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZSgpKTtcbiAgICB9LFxuICAgIHNldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICB0aGlzLmJpbmRUb0ZpZWxkID0ge307XG5cbiAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkTmFtZSA9IHJlc3VsdC5maWVsZE5hbWU7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVJZCA9IHJlc3VsdC50YWJsZUlkO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlTmFtZSA9IHJlc3VsdC50YWJsZU5hbWU7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVDYXB0aW9uID0gcmVzdWx0LnRhYmxlQ2FwdGlvbjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZENhcHRpb24gPSByZXN1bHQuZmllbGRDYXB0aW9uO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkRGF0YVR5cGUgPSByZXN1bHQuZmllbGREYXRhVHlwZTtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZExlbmd0aCA9IHJlc3VsdC5maWVsZExlbmd0aDtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5yZWxhdGlvbklkID0gcmVzdWx0LnJlbGF0aW9uSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkTmFtZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVJZCA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVOYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUNhcHRpb24gPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbiA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGREYXRhVHlwZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGRMZW5ndGggPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnJlbGF0aW9uSWQgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldENvbXBsZXRlZCgpO1xuICAgIH0sXG4gICAgZ2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZTogZnVuY3Rpb24gZ2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZSgpIHtcbiAgICAgIHJldHVybiBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZSh0aGlzLmJpbmRUb0ZpZWxkKTtcbiAgICB9LFxuICAgIHNlbGVjdERlZmF1bHRWYWx1ZVZpZXc6IGZ1bmN0aW9uIHNlbGVjdERlZmF1bHRWYWx1ZVZpZXcoKSB7XG4gICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB0aGlzO1xuICAgICAgd2luZG93LnBhcmVudC5hcHBGb3JtLnNlbGVjdERlZmF1bHRWYWx1ZURpYWxvZ0JlZ2luKHdpbmRvdywgbnVsbCk7XG4gICAgfSxcbiAgICBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlID0gcmVzdWx0LlR5cGU7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRWYWx1ZSA9IHJlc3VsdC5WYWx1ZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQgPSByZXN1bHQuVGV4dDtcbiAgICAgICAgdGhpcy50ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHQgPSBEZWZhdWx0VmFsdWVVdGlsaXR5LmZvcm1hdFRleHQodGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUsIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0Q29tcGxldGVkKCk7XG4gICAgfSxcbiAgICBzZWxlY3RWYWxpZGF0ZVJ1bGVWaWV3OiBmdW5jdGlvbiBzZWxlY3RWYWxpZGF0ZVJ1bGVWaWV3KCkge1xuICAgICAgd2luZG93Ll9TZWxlY3RCaW5kT2JqID0gdGhpcztcbiAgICAgIHdpbmRvdy5wYXJlbnQuYXBwRm9ybS5zZWxlY3RWYWxpZGF0ZVJ1bGVEaWFsb2dCZWdpbih3aW5kb3csIHRoaXMuZ2V0U2VsZWN0VmFsaWRhdGVSdWxlUmVzdWx0VmFsdWUoKSk7XG4gICAgfSxcbiAgICBzZXRTZWxlY3RWYWxpZGF0ZVJ1bGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0VmFsaWRhdGVSdWxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVJ1bGVzID0gcmVzdWx0O1xuICAgICAgICB0aGlzLnNldENvbXBsZXRlZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVJ1bGVzLm1zZyA9IFwiXCI7XG4gICAgICAgIHRoaXMudmFsaWRhdGVSdWxlcy5ydWxlcyA9IFtdO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0U2VsZWN0VmFsaWRhdGVSdWxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIGdldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVSdWxlcztcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjx0YWJsZSBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDI4MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxMDBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIC8+XFxuICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1N0VEMVxcdTVCOUFcXHU1MjMwXFx1ODg2ODxidXR0b24gY2xhc3M9XFxcImJ0bi1zZWxlY3QgZnJpZ2h0XFxcIiB2LW9uOmNsaWNrPVxcXCJzZWxlY3RCaW5kRmllbGRWaWV3XFxcIj4uLi48L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTg4NjhcXHU3RjE2XFx1NTNGN1xcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tiaW5kVG9GaWVsZC50YWJsZUlkfX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NjU3MFxcdTYzNkVcXHU2RTkwXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1ODg2OFxcdTU0MERcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7YmluZFRvRmllbGQudGFibGVOYW1lfX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1ODg2OFxcdTY4MDdcXHU5ODk4XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2JpbmRUb0ZpZWxkLnRhYmxlQ2FwdGlvbn19PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTVCNTdcXHU2QkI1XFx1NTQwRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tiaW5kVG9GaWVsZC5maWVsZE5hbWV9fTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1QjU3XFx1NkJCNVxcdTY4MDdcXHU5ODk4XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbn19PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTdDN0JcXHU1NzhCXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkRGF0YVR5cGV9fTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU5NTdGXFx1NUVBNlxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tiaW5kVG9GaWVsZC5maWVsZExlbmd0aH19PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjRcXFwiPlxcdTlFRDhcXHU4QkE0XFx1NTAzQzxidXR0b24gY2xhc3M9XFxcImJ0bi1zZWxlY3QgZnJpZ2h0XFxcIiB2LW9uOmNsaWNrPVxcXCJzZWxlY3REZWZhdWx0VmFsdWVWaWV3XFxcIj4uLi48L2J1dHRvbj48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHN0eWxlPVxcXCJoZWlnaHQ6IDM1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNFxcXCIgc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3t0ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHR9fVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2ODIxXFx1OUE4Q1xcdTg5QzRcXHU1MjE5PGJ1dHRvbiBjbGFzcz1cXFwiYnRuLXNlbGVjdCBmcmlnaHRcXFwiIHYtb246Y2xpY2s9XFxcInNlbGVjdFZhbGlkYXRlUnVsZVZpZXdcXFwiPi4uLjwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNFxcXCIgc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6ICNmZmZmZmZcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIj5cXHU2M0QwXFx1NzkzQVxcdTZEODhcXHU2MDZGXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3t2YWxpZGF0ZVJ1bGVzLm1zZ319PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIj5cXHU5QThDXFx1OEJDMVxcdTdDN0JcXHU1NzhCPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwiYmFja2dyb3VuZDogI2U4ZWFlYzt0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIj5cXHU1M0MyXFx1NjU3MDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciB2LWZvcj1cXFwicnVsZUl0ZW0gaW4gdmFsaWRhdGVSdWxlcy5ydWxlc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcImJhY2tncm91bmQ6ICNmZmZmZmY7dGV4dC1hbGlnbjogY2VudGVyO2NvbG9yOiAjYWQ5MzYxXFxcIj57e3J1bGVJdGVtLnZhbGlkYXRlVHlwZX19PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwiYmFja2dyb3VuZDogI2ZmZmZmZjt0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIj48cCB2LWlmPVxcXCJydWxlSXRlbS52YWxpZGF0ZVBhcmFzID09PSAnJ1xcXCI+XFx1NjVFMFxcdTUzQzJcXHU2NTcwPC9wPjxwIHYtZWxzZT57e3J1bGVJdGVtLnZhbGlkYXRlUGFyYXN9fTwvcD48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImZkLWNvbnRyb2wtZGF0YXNvdXJjZVwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vcm1hbERhdGFTb3VyY2U6IHtcbiAgICAgICAgZGVmYXVsdElzTnVsbDogXCJ0cnVlXCIsXG4gICAgICAgIHNxbERhdGFTb3VyY2U6IFwiXCIsXG4gICAgICAgIGRpY3Rpb25hcnlJZERhdGFTb3VyY2U6IFwiXCIsXG4gICAgICAgIHJlc3REYXRhU291cmNlOiBcIlwiLFxuICAgICAgICBzdGF0aWNEYXRhU291cmNlOiBcIlwiXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgd2F0Y2g6IHt9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XG4gICAgICB0aGlzLm5vcm1hbERhdGFTb3VyY2Uuc3FsRGF0YVNvdXJjZSA9IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLm5vcm1hbERhdGFTb3VyY2Uuc3FsRGF0YVNvdXJjZSk7XG4gICAgICByZXR1cm4gdGhpcy5ub3JtYWxEYXRhU291cmNlO1xuICAgIH0sXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLm5vcm1hbERhdGFTb3VyY2UgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMubm9ybWFsRGF0YVNvdXJjZS5zcWxEYXRhU291cmNlID0gZGVjb2RlVVJJQ29tcG9uZW50KG5ld1ZhbHVlLnNxbERhdGFTb3VyY2UpO1xuICAgICAgdGhpcy4kcmVmcy5zcWxHZW5lcmFsRGVzaWduQ29tcC5zZXRWYWx1ZSh0aGlzLm5vcm1hbERhdGFTb3VyY2Uuc3FsRGF0YVNvdXJjZSk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGNlbGxzcGFjaW5nPVxcXCIwXFxcIiBib3JkZXI9XFxcIjBcXFwiIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAyODBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCAvPlxcbiAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTlFRDhcXHU4QkE0XFx1N0E3QVxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcIm1hcmdpbjogYXV0b1xcXCIgdi1tb2RlbD1cXFwibm9ybWFsRGF0YVNvdXJjZS5kZWZhdWx0SXNOdWxsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcInRydWVcXFwiPlxcdTY2MkY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiZmFsc2VcXFwiPlxcdTU0MjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1ODNCN1xcdTUzRDZcXHU2NTcwXFx1NjM2RVxcdTZFOTBcXHU0RjE4XFx1NTE0OFxcdTdFQTdcXHU1MjJCLT5SZXN0XFx1NjNBNVxcdTUzRTMtPlxcdTY3MkNcXHU1NzMwXFx1NjNBNVxcdTUzRTMtPnNxbC0+XFx1OTc1OVxcdTYwMDFcXHU1MDNDXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTk3NTlcXHU2MDAxXFx1NTAzQ1xcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjNcXFwiPlxcblxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2NTcwXFx1NjM2RVxcdTVCNTdcXHU1MTc4XFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiM1xcXCI+XFxuXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCByb3dzcGFuPVxcXCIyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNRTFxcdTY1NzBcXHU2MzZFXFx1NkU5MFxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XFxcImNvbG9yOiByZWRcXFwiPltJVEVYVFxcdTRFMEVJVkFMVUVcXHU4QkY3XFx1NEY3RlxcdTc1MjhcXHU1OTI3XFx1NTE5OV08L3NwYW4+XFx1NzkzQVxcdTRGOEI6XFx1MzAxMFNFTEVDVCAnMScgSVRFWFQsJzInIElWQUxVRVxcdTMwMTFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjNcXFwiIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcWwtZ2VuZXJhbC1kZXNpZ24tY29tcCByZWY9XFxcInNxbEdlbmVyYWxEZXNpZ25Db21wXFxcIiA6c3FsLWRlc2lnbmVyLWhlaWdodD1cXFwiNzRcXFwiICB2LW1vZGVsPVxcXCJub3JtYWxEYXRhU291cmNlLnNxbERhdGFTb3VyY2VcXFwiPjwvc3FsLWdlbmVyYWwtZGVzaWduLWNvbXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJFU1RcXHU2NTcwXFx1NjM2RVxcdTZFOTBcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImZkLWNvbnRyb2wtc2VsZWN0LWJpbmQtdG8tc2luZ2xlLWZpZWxkLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRUYWJsZXNEYXRhVXJsOiBcIi9SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVzRm9yWlRyZWVOb2RlTGlzdFwiLFxuICAgICAgICBnZXRUYWJsZUZpZWxkc0RhdGFVcmw6IFwiL1Jlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZUZpZWxkc0J5VGFibGVJZFwiLFxuICAgICAgICBnZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzOiBcIi9SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVzRmllbGRzQnlUYWJsZUlkc1wiXG4gICAgICB9LFxuICAgICAgc2VsZWN0ZWREYXRhOiB7XG4gICAgICAgIHJlbGF0aW9uSWQ6IFwiXCIsXG4gICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgIHRhYmxlTmFtZTogXCJcIixcbiAgICAgICAgdGFibGVDYXB0aW9uOiBcIlwiLFxuICAgICAgICBmaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIGZpZWxkQ2FwdGlvbjogXCJcIixcbiAgICAgICAgZmllbGREYXRhVHlwZTogXCJcIixcbiAgICAgICAgZmllbGRMZW5ndGg6IFwiXCJcbiAgICAgIH0sXG4gICAgICB0YWJsZVRyZWU6IHtcbiAgICAgICAgdGFibGVUcmVlT2JqOiBudWxsLFxuICAgICAgICB0YWJsZVRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIGNoa1N0eWxlOiBcInJhZGlvXCIsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcImRpc3BsYXlUZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWREYXRhLnRhYmxlSWQgPSB0cmVlTm9kZS50YWJsZUlkO1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEudGFibGVOYW1lID0gdHJlZU5vZGUudGFibGVOYW1lO1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEudGFibGVDYXB0aW9uID0gdHJlZU5vZGUudGFibGVDYXB0aW9uO1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEuZmllbGROYW1lID0gXCJcIjtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWREYXRhLmZpZWxkQ2FwdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS5maWVsZERhdGFUeXBlID0gXCJcIjtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWREYXRhLmZpZWxkTGVuZ3RoID0gXCJcIjtcbiAgICAgICAgICAgICAgX3NlbGYuZmllbGRUYWJsZS5maWVsZERhdGEgPSBbXTtcblxuICAgICAgICAgICAgICBfc2VsZi5maWx0ZXJBbGxGaWVsZHNUb1RhYmxlKF9zZWxmLnNlbGVjdGVkRGF0YS50YWJsZUlkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkRibENsaWNrOiBmdW5jdGlvbiBvbkRibENsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7fSxcbiAgICAgICAgICAgIG9uQXN5bmNTdWNjZXNzOiBmdW5jdGlvbiBvbkFzeW5jU3VjY2VzcyhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSwgbXNnKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdGFibGVUcmVlRGF0YTogbnVsbCxcbiAgICAgICAgc2VsZWN0ZWRUYWJsZU5hbWU6IFwi5pegXCJcbiAgICAgIH0sXG4gICAgICBmaWVsZFRhYmxlOiB7XG4gICAgICAgIGZpZWxkRGF0YTogW10sXG4gICAgICAgIHRhYmxlSGVpZ2h0OiA0NzAsXG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdGl0bGU6ICcgJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAga2V5OiAnaXNTZWxlY3RlZFRvQmluZCcsXG4gICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zLnJvdy5pc1NlbGVjdGVkVG9CaW5kID09IFwiMVwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdC1yb3ctYnV0dG9uIHNlbGVjdGVkXCJcbiAgICAgICAgICAgICAgfSldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIlwiXG4gICAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5ZCN56ewJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZE5hbWUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+agh+mimCcsXG4gICAgICAgICAga2V5OiAnZmllbGRDYXB0aW9uJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIG9sZFJlbGF0aW9uRGF0YVN0cmluZzogXCJcIixcbiAgICAgIHJlbGF0aW9uRGF0YTogbnVsbCxcbiAgICAgIGFsbEZpZWxkczogbnVsbCxcbiAgICAgIG9sZEJpbmRGaWVsZERhdGE6IG51bGxcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBiZWdpblNlbGVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3QocmVsYXRpb25EYXRhLCBvbGRCaW5kRmllbGREYXRhKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIuWFs+iBlOihqOaVsOaNru+8mlwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlbGF0aW9uRGF0YSk7XG4gICAgICBjb25zb2xlLmxvZyhcIuW3sue7j+e7keWumuS6hueahOaVsOaNru+8mlwiKTtcbiAgICAgIGNvbnNvbGUubG9nKG9sZEJpbmRGaWVsZERhdGEpO1xuXG4gICAgICBpZiAocmVsYXRpb25EYXRhID09IG51bGwgfHwgcmVsYXRpb25EYXRhID09IFwiXCIgfHwgcmVsYXRpb25EYXRhLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+35YWI6K6+572u6KGo5Y2V55qE5pWw5o2u5YWz6IGU77yBXCIpO1xuICAgICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIDEwMTAxKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuZmRDb250cm9sU2VsZWN0QmluZFRvU2luZ2xlRmllbGREaWFsb2dXcmFwO1xuICAgICAgdmFyIGhlaWdodCA9IDQ1MDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICBoZWlnaHQ6IDY4MCxcbiAgICAgICAgd2lkdGg6IDk4MCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup57uR5a6a5a2X5q61XCJcbiAgICAgIH0pO1xuICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIDEwMTAwKTtcbiAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgICAgdGhpcy5vbGRCaW5kRmllbGREYXRhID0gb2xkQmluZEZpZWxkRGF0YTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUob2xkQmluZEZpZWxkRGF0YSk7XG5cbiAgICAgIGlmIChKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcocmVsYXRpb25EYXRhKSAhPSB0aGlzLm9sZFJlbGF0aW9uRGF0YVN0cmluZykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbGF0aW9uRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHJlbGF0aW9uRGF0YVtpXS5kaXNwbGF5VGV4dCA9IHJlbGF0aW9uRGF0YVtpXS50YWJsZU5hbWUgKyBcIltcIiArIHJlbGF0aW9uRGF0YVtpXS50YWJsZUNhcHRpb24gKyBcIl0oXCIgKyByZWxhdGlvbkRhdGFbaV0ucmVsYXRpb25UeXBlICsgXCIpXCI7XG5cbiAgICAgICAgICBpZiAocmVsYXRpb25EYXRhW2ldLnBhcmVudElkID09IFwiLTFcIikge1xuICAgICAgICAgICAgcmVsYXRpb25EYXRhW2ldLmRpc3BsYXlUZXh0ID0gcmVsYXRpb25EYXRhW2ldLnRhYmxlTmFtZSArIFwiW1wiICsgcmVsYXRpb25EYXRhW2ldLnRhYmxlQ2FwdGlvbiArIFwiXVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlbGF0aW9uRGF0YVtpXS5pY29uID0gXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvdGFibGUucG5nXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlVHJlZS50YWJsZVRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiN0YWJsZVpUcmVlVUxcIiksIHRoaXMudGFibGVUcmVlLnRhYmxlVHJlZVNldHRpbmcsIHJlbGF0aW9uRGF0YSk7XG4gICAgICAgIHRoaXMudGFibGVUcmVlLnRhYmxlVHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICAgIHRoaXMub2xkUmVsYXRpb25EYXRhU3RyaW5nID0gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHJlbGF0aW9uRGF0YSk7XG4gICAgICAgIHRoaXMucmVsYXRpb25EYXRhID0gcmVsYXRpb25EYXRhO1xuICAgICAgICB0aGlzLmdldEFsbFRhYmxlc0ZpZWxkcyhyZWxhdGlvbkRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXNldEZpZWxkVG9TZWxlY3RlZFN0YXR1cyh0aGlzLmFsbEZpZWxkcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvbGRCaW5kRmllbGREYXRhICYmIG9sZEJpbmRGaWVsZERhdGEudGFibGVJZCAmJiBvbGRCaW5kRmllbGREYXRhLnRhYmxlSWQgIT0gXCJcIikge1xuICAgICAgICB2YXIgc2VsZWN0ZWROb2RlID0gdGhpcy50YWJsZVRyZWUudGFibGVUcmVlT2JqLmdldE5vZGVCeVBhcmFtKFwidGFibGVJZFwiLCBvbGRCaW5kRmllbGREYXRhLnRhYmxlSWQpO1xuICAgICAgICB0aGlzLnRhYmxlVHJlZS50YWJsZVRyZWVPYmouc2VsZWN0Tm9kZShzZWxlY3RlZE5vZGUsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlc2V0RmllbGRUb1NlbGVjdGVkU3RhdHVzOiBmdW5jdGlvbiByZXNldEZpZWxkVG9TZWxlY3RlZFN0YXR1cyhfYWxsRmllbGRzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmllbGRUYWJsZS5maWVsZERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5maWVsZFRhYmxlLmZpZWxkRGF0YVtpXS5pc1NlbGVjdGVkVG9CaW5kID0gXCIwXCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChfYWxsRmllbGRzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2FsbEZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIF9hbGxGaWVsZHNbaV0uaXNTZWxlY3RlZFRvQmluZCA9IFwiMFwiO1xuXG4gICAgICAgICAgaWYgKF9hbGxGaWVsZHNbaV0uZmllbGRUYWJsZUlkID09IHRoaXMub2xkQmluZEZpZWxkRGF0YS50YWJsZUlkKSB7XG4gICAgICAgICAgICBpZiAoX2FsbEZpZWxkc1tpXS5maWVsZE5hbWUgPT0gdGhpcy5vbGRCaW5kRmllbGREYXRhLmZpZWxkTmFtZSkge1xuICAgICAgICAgICAgICBfYWxsRmllbGRzW2ldLmlzU2VsZWN0ZWRUb0JpbmQgPSBcIjFcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFsbEZpZWxkcyA9IF9hbGxGaWVsZHM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmlsdGVyQWxsRmllbGRzVG9UYWJsZSh0aGlzLm9sZEJpbmRGaWVsZERhdGEudGFibGVJZCk7XG4gICAgfSxcbiAgICBnZXRBbGxUYWJsZXNGaWVsZHM6IGZ1bmN0aW9uIGdldEFsbFRhYmxlc0ZpZWxkcyhyZWxhdGlvbkRhdGEpIHtcbiAgICAgIHZhciB0YWJsZUlkcyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbGF0aW9uRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB0YWJsZUlkcy5wdXNoKHJlbGF0aW9uRGF0YVtpXS50YWJsZUlkKTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHMsIHtcbiAgICAgICAgXCJ0YWJsZUlkc1wiOiB0YWJsZUlkc1xuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICB2YXIgYWxsRmllbGRzID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgdmFyIHNpbmdsZVRhYmxlID0gcmVzdWx0LmV4S1ZEYXRhLlRhYmxlc1swXTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIumHjeaWsOiOt+WPluaVsOaNrlwiKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhhbGxGaWVsZHMpO1xuXG4gICAgICAgICAgX3NlbGYucmVzZXRGaWVsZFRvU2VsZWN0ZWRTdGF0dXMoYWxsRmllbGRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGZpbHRlckFsbEZpZWxkc1RvVGFibGU6IGZ1bmN0aW9uIGZpbHRlckFsbEZpZWxkc1RvVGFibGUodGFibGVJZCkge1xuICAgICAgaWYgKHRhYmxlSWQpIHtcbiAgICAgICAgdmFyIGZpZWxkcyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hbGxGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy5hbGxGaWVsZHNbaV0uZmllbGRUYWJsZUlkID09IHRhYmxlSWQpIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKHRoaXMuYWxsRmllbGRzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpZWxkVGFibGUuZmllbGREYXRhID0gZmllbGRzO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZpZWxkVGFibGUuZmllbGREYXRhKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNlbGVjdGVkRmllbGQ6IGZ1bmN0aW9uIHNlbGVjdGVkRmllbGQoc2VsZWN0aW9uLCBpbmRleCkge1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEuZmllbGROYW1lID0gc2VsZWN0aW9uLmZpZWxkTmFtZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLmZpZWxkQ2FwdGlvbiA9IHNlbGVjdGlvbi5maWVsZENhcHRpb247XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YS5maWVsZERhdGFUeXBlID0gc2VsZWN0aW9uLmZpZWxkRGF0YVR5cGU7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YS5maWVsZExlbmd0aCA9IHNlbGVjdGlvbi5maWVsZERhdGFMZW5ndGg7XG4gICAgICB2YXIgc2VsZWN0ZWROb2RlID0gdGhpcy50YWJsZVRyZWUudGFibGVUcmVlT2JqLmdldE5vZGVCeVBhcmFtKFwidGFibGVJZFwiLCBzZWxlY3Rpb24uZmllbGRUYWJsZUlkKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLnRhYmxlSWQgPSBzZWxlY3RlZE5vZGUudGFibGVJZDtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLnRhYmxlTmFtZSA9IHNlbGVjdGVkTm9kZS50YWJsZU5hbWU7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YS50YWJsZUNhcHRpb24gPSBzZWxlY3RlZE5vZGUudGFibGVDYXB0aW9uO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEucmVsYXRpb25JZCA9IHNlbGVjdGVkTm9kZS5pZDtcbiAgICB9LFxuICAgIHNlbGVjdENvbXBsZXRlOiBmdW5jdGlvbiBzZWxlY3RDb21wbGV0ZSgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB0aGlzLnNlbGVjdGVkRGF0YTtcblxuICAgICAgaWYgKCFTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkocmVzdWx0LnRhYmxlSWQpICYmICFTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkocmVzdWx0LmZpZWxkTmFtZSkpIHtcbiAgICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtYmluZC10by1zaW5nbGUtZmllbGQnLCByZXN1bHQpO1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6npnIDopoHnu5HlrprnmoTlrZfmrrUhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2xlYXJDb21wbGV0ZTogZnVuY3Rpb24gY2xlYXJDb21wbGV0ZSgpIHtcbiAgICAgIHdpbmRvdy5PcGVuZXJXaW5kb3dPYmpbdGhpcy5nZXRTZWxlY3RJbnN0YW5jZU5hbWUoKV0uc2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZShudWxsKTtcbiAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuZmRDb250cm9sU2VsZWN0QmluZFRvU2luZ2xlRmllbGREaWFsb2dXcmFwKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJmZENvbnRyb2xTZWxlY3RCaW5kVG9TaW5nbGVGaWVsZERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJnZW5lcmFsLWVkaXQtcGFnZS13cmFwIGRlc2lnbi1kaWFsb2ctd3JhcGVyLXNpbmdsZS1kaWFsb2dcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdC10YWJsZS13cmFwZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVxcXCJsZWZ0XFxcIiA6ZGFzaGVkPVxcXCJ0cnVlXFxcIiBzdHlsZT1cXFwiZm9udC1zaXplOiAxMnB4XFxcIj5cXHU5MDA5XFx1NjJFOVxcdTg4Njg8L2RpdmlkZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPCEtLTxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBpZD1cXFwidHh0U2VhcmNoVGFibGVUcmVlXFxcIiBzdHlsZT1cXFwid2lkdGg6IDEwMCU7aGVpZ2h0OiAzMnB4O21hcmdpbi10b3A6IDJweFxcXCIgLz4tLT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XFxcInRhYmxlWlRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3QtZmllbGQtd3JhcGVyIGl2LWxpc3QtcGFnZS13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2aWRlciBvcmllbnRhdGlvbj1cXFwibGVmdFxcXCIgOmRhc2hlZD1cXFwidHJ1ZVxcXCIgc3R5bGU9XFxcImZvbnQtc2l6ZTogMTJweFxcXCI+XFx1OTAwOVxcdTYyRTlcXHU1QjU3XFx1NkJCNTwvZGl2aWRlcj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBib3JkZXIgOmNvbHVtbnM9XFxcImZpZWxkVGFibGUuY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcImZpZWxkVGFibGUuZmllbGREYXRhXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tcm93LWNsaWNrPVxcXCJzZWxlY3RlZEZpZWxkXFxcIiA6aGVpZ2h0PVxcXCJmaWVsZFRhYmxlLnRhYmxlSGVpZ2h0XFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgbm8tZGF0YS10ZXh0PVxcXCJcXHU4QkY3XFx1OTAwOVxcdTYyRTlcXHU4ODY4XFxcIj48L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzZWxlY3RDb21wbGV0ZSgpXFxcIj4gXFx1Nzg2RSBcXHU4QkE0IDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJjbGVhckNvbXBsZXRlKClcXFwiPiBcXHU2RTA1IFxcdTdBN0EgPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiPlxcdTUxNzMgXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImlubmVyLWZvcm0tYnV0dG9uLWxpc3QtY29tcFwiLCB7XG4gIHByb3BzOiBbXCJmb3JtSWRcIl0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0aXRsZTogJ+agh+mimCcsXG4gICAgICAgIGtleTogJ2NhcHRpb24nLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+exu+WeiycsXG4gICAgICAgIGtleTogJ2J1dHRvblR5cGUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgIGtleTogJ2lkJyxcbiAgICAgICAgd2lkdGg6IDIwMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHZhciBidXR0b25zID0gW107XG5cbiAgICAgICAgICBpZiAocGFyYW1zLnJvdy5idXR0b25UeXBlID09IFwi5L+d5a2Y5oyJ6ZKuXCIpIHtcbiAgICAgICAgICAgIGJ1dHRvbnMucHVzaChMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCBcImlkXCIsIF9zZWxmKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnV0dG9ucy5wdXNoKExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgXCJpZFwiLCBfc2VsZikpO1xuICAgICAgICAgIGJ1dHRvbnMucHVzaChMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLk1vdmVVcEJ1dHRvbihoLCBwYXJhbXMsIFwiaWRcIiwgX3NlbGYpKTtcbiAgICAgICAgICBidXR0b25zLnB1c2goTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5Nb3ZlRG93bkJ1dHRvbihoLCBwYXJhbXMsIFwiaWRcIiwgX3NlbGYpKTtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICB9LCBidXR0b25zKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgaW5uZXJTYXZlQnV0dG9uRWRpdERhdGE6IHtcbiAgICAgICAgY2FwdGlvbjogXCJcIixcbiAgICAgICAgc2F2ZUFuZENsb3NlOiBcInRydWVcIixcbiAgICAgICAgYXBpczogW10sXG4gICAgICAgIGZpZWxkczogW10sXG4gICAgICAgIGlkOiBcIlwiLFxuICAgICAgICBidXR0b25UeXBlOiBcIuS/neWtmOaMiemSrlwiLFxuICAgICAgICBjdXN0U2VydmVyUmVzb2x2ZU1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdFNlcnZlclJlc29sdmVNZXRob2RQYXJhOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50UmVuZGVyZXJNZXRob2Q6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlck1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlckFmdGVyTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50UmVuZGVyZXJBZnRlck1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRDbGlja0JlZm9yZU1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdENsaWVudENsaWNrQmVmb3JlTWV0aG9kUGFyYTogXCJcIlxuICAgICAgfSxcbiAgICAgIGFwaToge1xuICAgICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICAgIGdldEFQSURhdGE6IFwiL1Jlc3QvQnVpbGRlci9BcGlJdGVtL0dldEFQSVNGb3JaVHJlZU5vZGVMaXN0XCJcbiAgICAgICAgfSxcbiAgICAgICAgYXBpVHJlZU9iajogbnVsbCxcbiAgICAgICAgYXBpVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIF9zZWxmLmFwaS5hcGlTZWxlY3REYXRhID0gdHJlZU5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhcGlEYXRhOiBudWxsLFxuICAgICAgICBhcGlTZWxlY3REYXRhOiBudWxsLFxuICAgICAgICBlZGl0VGFibGVPYmplY3Q6IG51bGwsXG4gICAgICAgIGVkaXRUYWJsZUNvbmZpZzoge1xuICAgICAgICAgIFN0YXR1czogXCJFZGl0XCIsXG4gICAgICAgICAgQWRkQWZ0ZXJSb3dFdmVudDogbnVsbCxcbiAgICAgICAgICBEYXRhRmllbGQ6IFwiZmllbGROYW1lXCIsXG4gICAgICAgICAgVGVtcGxhdGVzOiBbe1xuICAgICAgICAgICAgVGl0bGU6IFwiQVBJ5ZCN56ewXCIsXG4gICAgICAgICAgICBCaW5kTmFtZTogXCJWYWx1ZVwiLFxuICAgICAgICAgICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX0xhYmVsXCIsXG4gICAgICAgICAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgICAgICAgICBGb3JtYXRlcjogZnVuY3Rpb24gRm9ybWF0ZXIodmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9zZWxmLmdldEFQSVRleHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFRpdGxlOiBcIuiwg+eUqOmhuuW6j1wiLFxuICAgICAgICAgICAgQmluZE5hbWU6IFwiUnVuVGltZVwiLFxuICAgICAgICAgICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX1NlbGVjdFwiLFxuICAgICAgICAgICAgQ2xpZW50RGF0YVNvdXJjZTogW3tcbiAgICAgICAgICAgICAgXCJUZXh0XCI6IFwi5LmL5YmNXCIsXG4gICAgICAgICAgICAgIFwiVmFsdWVcIjogXCLkuYvliY1cIlxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBcIlRleHRcIjogXCLkuYvlkI5cIixcbiAgICAgICAgICAgICAgXCJWYWx1ZVwiOiBcIuS5i+WQjlwiXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIFdpZHRoOiAxMDBcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBSb3dJZENyZWF0ZXI6IGZ1bmN0aW9uIFJvd0lkQ3JlYXRlcigpIHt9LFxuICAgICAgICAgIFRhYmxlQ2xhc3M6IFwiZWRpdC10YWJsZVwiLFxuICAgICAgICAgIFJlbmRlcmVyVG86IFwiYXBpQ29udGFpbmVyXCIsXG4gICAgICAgICAgVGFibGVJZDogXCJhcGlDb250YWluZXJUYWJsZVwiLFxuICAgICAgICAgIFRhYmxlQXR0cnM6IHtcbiAgICAgICAgICAgIGNlbGxwYWRkaW5nOiBcIjFcIixcbiAgICAgICAgICAgIGNlbGxzcGFjaW5nOiBcIjFcIixcbiAgICAgICAgICAgIGJvcmRlcjogXCIxXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmaWVsZDoge1xuICAgICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICAgIGdldEZvcm1NYWluVGFibGVGaWVsZHM6IFwiL1Jlc3QvQnVpbGRlci9Gb3JtL0dldEZvcm1NYWluVGFibGVGaWVsZHNcIlxuICAgICAgICB9LFxuICAgICAgICBlZGl0VGFibGVPYmplY3Q6IG51bGwsXG4gICAgICAgIGVkaXRUYWJsZUNvbmZpZzoge1xuICAgICAgICAgIFN0YXR1czogXCJFZGl0XCIsXG4gICAgICAgICAgQWRkQWZ0ZXJSb3dFdmVudDogbnVsbCxcbiAgICAgICAgICBEYXRhRmllbGQ6IFwiZmllbGROYW1lXCIsXG4gICAgICAgICAgVGVtcGxhdGVzOiBbe1xuICAgICAgICAgICAgVGl0bGU6IFwi6KGo5ZCN5qCH6aKYXCIsXG4gICAgICAgICAgICBCaW5kTmFtZTogXCJUYWJsZU5hbWVcIixcbiAgICAgICAgICAgIFJlbmRlcmVyOiBcIkVkaXRUYWJsZV9MYWJlbFwiXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgVGl0bGU6IFwi5a2X5q615qCH6aKYXCIsXG4gICAgICAgICAgICBCaW5kTmFtZTogXCJGaWVsZE5hbWVcIixcbiAgICAgICAgICAgIFJlbmRlcmVyOiBcIkVkaXRUYWJsZV9TZWxlY3RcIlxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIFRpdGxlOiBcIum7mOiupOWAvFwiLFxuICAgICAgICAgICAgQmluZE5hbWU6IFwiRGVmYXVsdFZhbHVlXCIsXG4gICAgICAgICAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlXCIsXG4gICAgICAgICAgICBIaWRkZW46IGZhbHNlXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgUm93SWRDcmVhdGVyOiBmdW5jdGlvbiBSb3dJZENyZWF0ZXIoKSB7fSxcbiAgICAgICAgICBUYWJsZUNsYXNzOiBcImVkaXQtdGFibGVcIixcbiAgICAgICAgICBSZW5kZXJlclRvOiBcImZpZWxkQ29udGFpbmVyXCIsXG4gICAgICAgICAgVGFibGVJZDogXCJmaWVsZENvbnRhaW5lclRhYmxlXCIsXG4gICAgICAgICAgVGFibGVBdHRyczoge1xuICAgICAgICAgICAgY2VsbHBhZGRpbmc6IFwiMVwiLFxuICAgICAgICAgICAgY2VsbHNwYWNpbmc6IFwiMVwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIjFcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9sZEZvcm1JZDogXCJcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIHJlYWR5OiBmdW5jdGlvbiByZWFkeSh0YWJsZURhdGFKc29uKSB7XG4gICAgICBpZiAodGFibGVEYXRhSnNvbiAhPSBudWxsICYmIHRhYmxlRGF0YUpzb24gIT0gXCJcIikge1xuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0YWJsZURhdGFKc29uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5iaW5kQVBJVHJlZUFuZEluaXRFZGl0VGFibGUobnVsbCk7XG4gICAgfSxcbiAgICBnZXRKc29uOiBmdW5jdGlvbiBnZXRKc29uKCkge1xuICAgICAgcmV0dXJuIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh0aGlzLnRhYmxlRGF0YSk7XG4gICAgfSxcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoZGlhbG9nRWxlbSkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmc1tkaWFsb2dFbGVtXSk7XG4gICAgfSxcbiAgICBlZGl0OiBmdW5jdGlvbiBlZGl0KGlkLCBwYXJhbXMpIHtcbiAgICAgIGlmIChwYXJhbXMucm93W1wiYnV0dG9uVHlwZVwiXSA9PSBcIuS/neWtmOaMiemSrlwiKSB7XG4gICAgICAgIHRoaXMuZWRpdElubmVyRm9ybVNhdmVCdXR0b24ocGFyYW1zKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gZGVsKGlkLCBwYXJhbXMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMudGFibGVEYXRhW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnRhYmxlRGF0YSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vdmVVcDogZnVuY3Rpb24gbW92ZVVwKGlkLCBwYXJhbXMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMudGFibGVEYXRhW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgQXJyYXlVdGlsaXR5Lk1vdmVVcCh0aGlzLnRhYmxlRGF0YSwgaSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBtb3ZlRG93bjogZnVuY3Rpb24gbW92ZURvd24oaWQsIHBhcmFtcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy50YWJsZURhdGFbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuTW92ZURvd24odGhpcy50YWJsZURhdGEsIGkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYWRkSW5uZXJGb3JtU2F2ZUJ1dHRvbjogZnVuY3Rpb24gYWRkSW5uZXJGb3JtU2F2ZUJ1dHRvbigpIHtcbiAgICAgIGlmICh0aGlzLmZvcm1JZCAhPSBudWxsICYmIHRoaXMuZm9ybUlkICE9IFwiXCIpIHtcbiAgICAgICAgdGhpcy5lZGl0U2F2ZUJ1dHRvblN0YXR1YyA9IFwiYWRkXCI7XG4gICAgICAgIHRoaXMucmVzZXRJbm5lclNhdmVCdXR0b25EYXRhKCk7XG4gICAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5pbm5lckZvcm1CdXR0b25FZGl0O1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgIGhlaWdodDogNTIwLFxuICAgICAgICAgIHdpZHRoOiA3MjAsXG4gICAgICAgICAgdGl0bGU6IFwi56qX5L2T5YaF5oyJ6ZKuXCJcbiAgICAgICAgfSk7XG4gICAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgICAgICB0aGlzLmlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLmlkID0gXCJpbm5lcl9mb3JtX2J1dHRvbl9cIiArIFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKCk7XG4gICAgICAgIHRoaXMuYmluZFRhYmxlRmllbGRzKG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7flhYjorr7nva7nu5HlrprnmoTnqpfkvZMhXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdElubmVyRm9ybVNhdmVCdXR0b246IGZ1bmN0aW9uIGVkaXRJbm5lckZvcm1TYXZlQnV0dG9uKHBhcmFtcykge1xuICAgICAgdGhpcy5hZGRJbm5lckZvcm1TYXZlQnV0dG9uKCk7XG4gICAgICB0aGlzLmlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhID0gSnNvblV0aWxpdHkuQ2xvbmVTdHJpbmdpZnkocGFyYW1zLnJvdyk7XG4gICAgICB0aGlzLmVkaXRTYXZlQnV0dG9uU3RhdHVjID0gXCJlZGl0XCI7XG4gICAgICB0aGlzLmJpbmRBUElUcmVlQW5kSW5pdEVkaXRUYWJsZSh0aGlzLmlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLmFwaXMpO1xuICAgICAgdGhpcy5iaW5kVGFibGVGaWVsZHModGhpcy5pbm5lclNhdmVCdXR0b25FZGl0RGF0YS5maWVsZHMpO1xuICAgIH0sXG4gICAgcmVzZXRJbm5lclNhdmVCdXR0b25EYXRhOiBmdW5jdGlvbiByZXNldElubmVyU2F2ZUJ1dHRvbkRhdGEoKSB7XG4gICAgICB0aGlzLmlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhID0ge1xuICAgICAgICBjYXB0aW9uOiBcIlwiLFxuICAgICAgICBzYXZlQW5kQ2xvc2U6IFwidHJ1ZVwiLFxuICAgICAgICBhcGlzOiBbXSxcbiAgICAgICAgZmllbGRzOiBbXSxcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIGJ1dHRvblR5cGU6IFwi5L+d5a2Y5oyJ6ZKuXCIsXG4gICAgICAgIGN1c3RTZXJ2ZXJSZXNvbHZlTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0U2VydmVyUmVzb2x2ZU1ldGhvZFBhcmE6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlck1ldGhvZDogXCJcIixcbiAgICAgICAgY3VzdENsaWVudFJlbmRlcmVyTWV0aG9kUGFyYTogXCJcIixcbiAgICAgICAgY3VzdENsaWVudFJlbmRlcmVyQWZ0ZXJNZXRob2Q6IFwiXCIsXG4gICAgICAgIGN1c3RDbGllbnRSZW5kZXJlckFmdGVyTWV0aG9kUGFyYTogXCJcIixcbiAgICAgICAgY3VzdENsaWVudENsaWNrQmVmb3JlTWV0aG9kOiBcIlwiLFxuICAgICAgICBjdXN0Q2xpZW50Q2xpY2tCZWZvcmVNZXRob2RQYXJhOiBcIlwiXG4gICAgICB9O1xuICAgIH0sXG4gICAgc2F2ZUlubmVyU2F2ZUJ1dHRvblRvTGlzdDogZnVuY3Rpb24gc2F2ZUlubmVyU2F2ZUJ1dHRvblRvTGlzdCgpIHtcbiAgICAgIHZhciBzaW5nbGVJbm5lckZvcm1CdXR0b25EYXRhID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUodGhpcy5pbm5lclNhdmVCdXR0b25FZGl0RGF0YSk7XG4gICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuQ29tcGxldGVkRWRpdGluZ1JvdygpO1xuICAgICAgc2luZ2xlSW5uZXJGb3JtQnV0dG9uRGF0YS5hcGlzID0gdGhpcy5hcGkuZWRpdFRhYmxlT2JqZWN0LkdldFNlcmlhbGl6ZUpzb24oKTtcbiAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkNvbXBsZXRlZEVkaXRpbmdSb3coKTtcbiAgICAgIHNpbmdsZUlubmVyRm9ybUJ1dHRvbkRhdGEuZmllbGRzID0gdGhpcy5maWVsZC5lZGl0VGFibGVPYmplY3QuR2V0U2VyaWFsaXplSnNvbigpO1xuXG4gICAgICBpZiAodGhpcy5lZGl0U2F2ZUJ1dHRvblN0YXR1YyA9PSBcImFkZFwiKSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRhLnB1c2goc2luZ2xlSW5uZXJGb3JtQnV0dG9uRGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMudGFibGVEYXRhW2ldLmlkID09IHNpbmdsZUlubmVyRm9ybUJ1dHRvbkRhdGEuaWQpIHtcbiAgICAgICAgICAgIFZ1ZS5zZXQodGhpcy50YWJsZURhdGEsIGksIHNpbmdsZUlubmVyRm9ybUJ1dHRvbkRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZUNsb3NlKFwiaW5uZXJGb3JtQnV0dG9uRWRpdFwiKTtcbiAgICB9LFxuICAgIGJpbmRUYWJsZUZpZWxkczogZnVuY3Rpb24gYmluZFRhYmxlRmllbGRzKG9sZERhdGEpIHtcbiAgICAgIGlmICh0aGlzLm9sZEZvcm1JZCAhPSB0aGlzLmZvcm1JZCkge1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuZmllbGQuYWNJbnRlcmZhY2UuZ2V0Rm9ybU1haW5UYWJsZUZpZWxkcywge1xuICAgICAgICAgIGZvcm1JZDogdGhpcy5mb3JtSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIHZhciBmaWVsZHNEYXRhID0gW107XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmaWVsZHNEYXRhLnB1c2goe1xuICAgICAgICAgICAgICBWYWx1ZTogcmVzdWx0LmRhdGFbaV0uZmllbGROYW1lLFxuICAgICAgICAgICAgICBUZXh0OiByZXN1bHQuZGF0YVtpXS5maWVsZENhcHRpb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlQ29uZmlnLlRlbXBsYXRlc1swXS5EZWZhdWx0VmFsdWUgPSB7XG4gICAgICAgICAgICBUeXBlOiBcIkNvbnN0XCIsXG4gICAgICAgICAgICBWYWx1ZTogcmVzdWx0LmRhdGFbMF0udGFibGVOYW1lXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZUNvbmZpZy5UZW1wbGF0ZXNbMV0uQ2xpZW50RGF0YVNvdXJjZSA9IGZpZWxkc0RhdGE7XG5cbiAgICAgICAgICBpZiAoIXRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdCA9IE9iamVjdC5jcmVhdGUoRWRpdFRhYmxlKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkluaXRpYWxpemF0aW9uKHRoaXMuZmllbGQuZWRpdFRhYmxlQ29uZmlnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLm9sZEZvcm1JZCA9IHRoaXMuZm9ybUlkO1xuXG4gICAgICAgICAgaWYgKG9sZERhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkxvYWRKc29uRGF0YShvbGREYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5maWVsZC5lZGl0VGFibGVPYmplY3QpIHtcbiAgICAgICAgdGhpcy5maWVsZC5lZGl0VGFibGVPYmplY3QuUmVtb3ZlQWxsUm93KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvbGREYXRhICYmIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkxvYWRKc29uRGF0YShvbGREYXRhKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZEZpZWxkOiBmdW5jdGlvbiBhZGRGaWVsZCgpIHtcbiAgICAgIHRoaXMuZmllbGQuZWRpdFRhYmxlT2JqZWN0LkFkZEVkaXRpbmdSb3dCeVRlbXBsYXRlKCk7XG4gICAgfSxcbiAgICByZW1vdmVGaWVsZDogZnVuY3Rpb24gcmVtb3ZlRmllbGQoKSB7XG4gICAgICB0aGlzLmZpZWxkLmVkaXRUYWJsZU9iamVjdC5BZGRFZGl0aW5nUm93QnlUZW1wbGF0ZSgpO1xuICAgIH0sXG4gICAgYWRkSW5uZXJGb3JtQ2xvc2VCdXR0b246IGZ1bmN0aW9uIGFkZElubmVyRm9ybUNsb3NlQnV0dG9uKCkge1xuICAgICAgdmFyIGNsb3NlQnV0dG9uRGF0YSA9IHtcbiAgICAgICAgY2FwdGlvbjogXCLlhbPpl61cIixcbiAgICAgICAgaWQ6IFwiaW5uZXJfY2xvc2VfYnV0dG9uX1wiICsgU3RyaW5nVXRpbGl0eS5UaW1lc3RhbXAoKSxcbiAgICAgICAgYnV0dG9uVHlwZTogXCLlhbPpl63mjInpkq5cIlxuICAgICAgfTtcbiAgICAgIHRoaXMudGFibGVEYXRhLnB1c2goY2xvc2VCdXR0b25EYXRhKTtcbiAgICB9LFxuICAgIGJpbmRBUElUcmVlQW5kSW5pdEVkaXRUYWJsZTogZnVuY3Rpb24gYmluZEFQSVRyZWVBbmRJbml0RWRpdFRhYmxlKG9sZERhdGEpIHtcbiAgICAgIGlmICghdGhpcy5hcGkuYXBpRGF0YSkge1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYXBpLmFjSW50ZXJmYWNlLmdldEFQSURhdGEsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICB0aGlzLmFwaS5hcGlEYXRhID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQuZGF0YSAhPSBudWxsICYmIHJlc3VsdC5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZGF0YVtpXS5ub2RlVHlwZU5hbWUgPT0gXCJHcm91cFwiKSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQuZGF0YVtpXS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi9wYWNrYWdlLnBuZ1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQuZGF0YVtpXS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi9hcHBsaWNhdGlvbl92aWV3X2NvbHVtbnMucG5nXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXBpLmFwaVRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNhcGlaVHJlZVVMXCIpLCB0aGlzLmFwaS5hcGlUcmVlU2V0dGluZywgcmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgdGhpcy5hcGkuYXBpVHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmoodGhpcy5hcGkuYXBpVHJlZU9iaiwgdGhpcy4kcmVmcy50eHRfc2VhcmNoX2FwaV90ZXh0LiRyZWZzLmlucHV0LCBudWxsLCB0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QgPSBPYmplY3QuY3JlYXRlKEVkaXRUYWJsZSk7XG4gICAgICAgIHRoaXMuYXBpLmVkaXRUYWJsZU9iamVjdC5Jbml0aWFsaXphdGlvbih0aGlzLmFwaS5lZGl0VGFibGVDb25maWcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuUmVtb3ZlQWxsUm93KCk7XG5cbiAgICAgIGlmIChvbGREYXRhKSB7XG4gICAgICAgIHRoaXMuYXBpLmVkaXRUYWJsZU9iamVjdC5Mb2FkSnNvbkRhdGEob2xkRGF0YSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRBcGlDb25maWdBbmRCaW5kVG9UYWJsZTogZnVuY3Rpb24gZ2V0QXBpQ29uZmlnQW5kQmluZFRvVGFibGUoKSB7XG4gICAgICByZXR1cm47XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hcGkuYWNJbnRlcmZhY2UuZ2V0QnV0dG9uQXBpQ29uZmlnLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB2YXIgYXBpU2VsZWN0RGF0YSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgZ3JvdXAgPSB7XG4gICAgICAgICAgICBHcm91cDogcmVzdWx0LmRhdGFbaV0ubmFtZVxuICAgICAgICAgIH07XG4gICAgICAgICAgdmFyIG9wdGlvbnMgPSBbXTtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmVzdWx0LmRhdGFbaV0uYnV0dG9uQVBJVm9MaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBvcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICBWYWx1ZTogcmVzdWx0LmRhdGFbaV0uYnV0dG9uQVBJVm9MaXN0W2pdLmlkLFxuICAgICAgICAgICAgICBUZXh0OiByZXN1bHQuZGF0YVtpXS5idXR0b25BUElWb0xpc3Rbal0ubmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZ3JvdXBbXCJPcHRpb25zXCJdID0gb3B0aW9ucztcbiAgICAgICAgICBhcGlTZWxlY3REYXRhLnB1c2goZ3JvdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgX3NlbGYuYXBpLmVkaXRUYWJsZUNvbmZpZy5UZW1wbGF0ZXNbMF0uQ2xpZW50RGF0YVNvdXJjZSA9IGFwaVNlbGVjdERhdGE7XG4gICAgICAgIF9zZWxmLmFwaS5lZGl0VGFibGVPYmplY3QgPSBPYmplY3QuY3JlYXRlKEVkaXRUYWJsZSk7XG5cbiAgICAgICAgX3NlbGYuYXBpLmVkaXRUYWJsZU9iamVjdC5Jbml0aWFsaXphdGlvbihfc2VsZi5hcGkuZWRpdFRhYmxlQ29uZmlnKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgYWRkQVBJOiBmdW5jdGlvbiBhZGRBUEkoKSB7XG4gICAgICBpZiAodGhpcy5hcGkuYXBpU2VsZWN0RGF0YS5ub2RlVHlwZU5hbWUgPT0gXCJBUElcIikge1xuICAgICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGUoW10sIHtcbiAgICAgICAgICBWYWx1ZTogdGhpcy5hcGkuYXBpU2VsZWN0RGF0YS52YWx1ZSxcbiAgICAgICAgICBSdW5UaW1lOiBcIuS5i+WQjlwiXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7fpgInmi6npnIDopoHmt7vliqDnmoRBUEkhXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlQVBJOiBmdW5jdGlvbiByZW1vdmVBUEkoKSB7XG4gICAgICB0aGlzLmFwaS5lZGl0VGFibGVPYmplY3QuUmVtb3ZlUm93KCk7XG4gICAgfSxcbiAgICBnZXRBUElUZXh0OiBmdW5jdGlvbiBnZXRBUElUZXh0KHZhbHVlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXBpLmFwaURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuYXBpLmFwaURhdGFbaV0ubm9kZVR5cGVOYW1lID09IFwiQVBJXCIpIHtcbiAgICAgICAgICBpZiAodGhpcy5hcGkuYXBpRGF0YVtpXS52YWx1ZSA9PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBpLmFwaURhdGFbaV0udGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHN0eWxlPVxcXCJoZWlnaHQ6IDIxMHB4XFxcIiBjbGFzcz1cXFwiaXYtbGlzdC1wYWdlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9XFxcImlubmVyRm9ybUJ1dHRvbkVkaXRcXFwiIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXdyYXBlciBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTttYXJnaW4tdG9wOiAwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJzIHNpemU9XFxcInNtYWxsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIGxhYmVsPVxcXCJcXHU3RUQxXFx1NUI5QVxcdTRGRTFcXHU2MDZGXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA2MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMjIwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxMDBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NjgwN1xcdTk4OThcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lclNhdmVCdXR0b25FZGl0RGF0YS5jYXB0aW9uXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU0RkREXFx1NUI1OFxcdTVFNzZcXHU1MTczXFx1OTVFRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiIHYtbW9kZWw9XFxcImlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLnNhdmVBbmRDbG9zZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwidHJ1ZVxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiZmFsc2VcXFwiPlxcdTU0MjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NUI1N1xcdTZCQjVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJoZWlnaHQ6IDE0MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZmxvYXQ6IGxlZnQ7d2lkdGg6IDk0JVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVxcXCJmaWVsZENvbnRhaW5lclxcXCIgY2xhc3M9XFxcImVkaXQtdGFibGUtd3JhcFxcXCIgc3R5bGU9XFxcImhlaWdodDogMzIwcHg7b3ZlcmZsb3c6IGF1dG87d2lkdGg6IDk4JTttYXJnaW46IGF1dG9cXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiA1JVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwIHZlcnRpY2FsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBzaXplPVxcXCJzbWFsbFxcXCIgdHlwZT1cXFwic3VjY2Vzc1xcXCIgaWNvbj1cXFwibWQtYWRkXFxcIiBAY2xpY2s9XFxcImFkZEZpZWxkXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBzaXplPVxcXCJzbWFsbFxcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiIEBjbGljaz1cXFwicmVtb3ZlRmllbGRcXFwiPjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgbGFiZWw9XFxcIkFQSVxcdThCQkVcXHU3RjZFXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAzMjBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDYwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJiYWNrZ3JvdW5kOiAjZmZmZmZmXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XFxcImlucHV0X2JvcmRlcl9ib3R0b21cXFwiIHJlZj1cXFwidHh0X3NlYXJjaF9hcGlfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NUFQSVxcdTU0MERcXHU3OUYwXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVxcXCJhcGlaVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6IDMyMHB4O292ZXJmbG93OiBhdXRvXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyO2JhY2tncm91bmQtY29sb3I6ICNmOGY4ZjhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXAgdmVydGljYWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBzaXplPVxcXCJzbWFsbFxcXCIgdHlwZT1cXFwic3VjY2Vzc1xcXCIgaWNvbj1cXFwibWQtYWRkXFxcIiBAY2xpY2s9XFxcImFkZEFQSVxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHNpemU9XFxcInNtYWxsXFxcIiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCIgQGNsaWNrPVxcXCJyZW1vdmVBUElcXFwiPjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJiYWNrZ3JvdW5kOiAjZmZmZmZmO1xcXCIgdmFsaWduPVxcXCJ0b3BcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XFxcImFwaUNvbnRhaW5lclxcXCIgY2xhc3M9XFxcImVkaXQtdGFibGUtd3JhcFxcXCIgc3R5bGU9XFxcImhlaWdodDogMzQwcHg7b3ZlcmZsb3c6IGF1dG87d2lkdGg6IDk4JTttYXJnaW46IGF1dG9cXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIGxhYmVsPVxcXCJcXHU1RjAwXFx1NTNEMVxcdTYyNjlcXHU1QzU1XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxNTBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+SURcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lclNhdmVCdXR0b25FZGl0RGF0YS5pZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NjcwRFxcdTUyQTFcXHU3QUVGXFx1ODlFM1xcdTY3OTBcXHU3QzdCXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJTYXZlQnV0dG9uRWRpdERhdGEuY3VzdFNlcnZlclJlc29sdmVNZXRob2RcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1NjMwOVxcdTk0QUVcXHU4RkRCXFx1ODg0Q1xcdTY3MERcXHU1MkExXFx1N0FFRlxcdTg5RTNcXHU2NzkwXFx1NjVGNixcXHU3QzdCXFx1NTE2OFxcdTc5RjAsXFx1NUMwNlxcdThDMDNcXHU3NTI4XFx1OEJFNVxcdTdDN0IsXFx1OTcwMFxcdTg5ODFcXHU1QjlFXFx1NzNCMFxcdTYzQTVcXHU1M0UzSUZvcm1CdXR0b25DdXN0UmVzb2x2ZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1M0MyXFx1NjU3MFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLmN1c3RTZXJ2ZXJSZXNvbHZlTWV0aG9kUGFyYVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU2NzBEXFx1NTJBMVxcdTdBRUZcXHU4OUUzXFx1Njc5MFxcdTdDN0JcXHU3Njg0XFx1NTNDMlxcdTY1NzBcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NkUzMlxcdTY3RDNcXHU2NUI5XFx1NkNENVxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLmN1c3RDbGllbnRSZW5kZXJlck1ldGhvZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU2RTMyXFx1NjdEM1xcdTY1QjlcXHU2Q0Q1LFxcdTYzMDlcXHU5NEFFXFx1NUMwNlxcdTdFQ0ZcXHU3NTMxXFx1OEJFNVxcdTY1QjlcXHU2Q0Q1XFx1NkUzMlxcdTY3RDMsXFx1NjcwMFxcdTdFQzhcXHU1RjYyXFx1NjIxMFxcdTk4NzVcXHU5NzYyXFx1NTE0M1xcdTdEMjAsXFx1OTcwMFxcdTg5ODFcXHU4RkQ0XFx1NTZERVxcdTY3MDBcXHU3RUM4XFx1NTE0M1xcdTdEMjBcXHU3Njg0SFRNTFxcdTVCRjlcXHU4QzYxXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTUzQzJcXHU2NTcwXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJTYXZlQnV0dG9uRWRpdERhdGEuY3VzdENsaWVudFJlbmRlcmVyTWV0aG9kUGFyYVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1QkEyXFx1NjIzN1xcdTdBRUZcXHU2RTMyXFx1NjdEM1xcdTY1QjlcXHU2Q0Q1XFx1NzY4NFxcdTUzQzJcXHU2NTcwXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTVCQTJcXHU2MjM3XFx1N0FFRlxcdTZFMzJcXHU2N0QzXFx1NTQwRVxcdTY1QjlcXHU2Q0Q1XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW5uZXJTYXZlQnV0dG9uRWRpdERhdGEuY3VzdENsaWVudFJlbmRlcmVyQWZ0ZXJNZXRob2RcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NkUzMlxcdTY3RDNcXHU1NDBFXFx1OEMwM1xcdTc1MjhcXHU2NUI5XFx1NkNENSxcXHU3RUNGXFx1OEZDN1xcdTlFRDhcXHU4QkE0XFx1NzY4NFxcdTZFMzJcXHU2N0QzLFxcdTY1RTBcXHU4RkQ0XFx1NTZERVxcdTUwM0NcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NTNDMlxcdTY1NzBcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lclNhdmVCdXR0b25FZGl0RGF0YS5jdXN0Q2xpZW50UmVuZGVyZXJBZnRlck1ldGhvZFBhcmFcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NkUzMlxcdTY3RDNcXHU1NDBFXFx1NjVCOVxcdTZDRDVcXHU3Njg0XFx1NTNDMlxcdTY1NzBcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NzBCOVxcdTUxRkJcXHU1MjREXFx1NjVCOVxcdTZDRDVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbm5lclNhdmVCdXR0b25FZGl0RGF0YS5jdXN0Q2xpZW50Q2xpY2tCZWZvcmVNZXRob2RcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NzBCOVxcdTUxRkJcXHU4QkU1XFx1NjMwOVxcdTk0QUVcXHU2NUY2XFx1NzY4NFxcdTUyNERcXHU3RjZFXFx1NjVCOVxcdTZDRDUsXFx1NTk4MlxcdTY3OUNcXHU4RkQ0XFx1NTZERWZhbHNlXFx1NUMwNlxcdTk2M0JcXHU2QjYyXFx1OUVEOFxcdThCQTRcXHU4QzAzXFx1NzUyOFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1M0MyXFx1NjU3MFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImlubmVyU2F2ZUJ1dHRvbkVkaXREYXRhLmN1c3RDbGllbnRDbGlja0JlZm9yZU1ldGhvZFBhcmFcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1NUJBMlxcdTYyMzdcXHU3QUVGXFx1NzBCOVxcdTUxRkJcXHU1MjREXFx1NjVCOVxcdTZDRDVcXHU3Njg0XFx1NTNDMlxcdTY1NzBcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFicz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwic2F2ZUlubmVyU2F2ZUJ1dHRvblRvTGlzdCgpXFxcIj4gXFx1NEZERCBcXHU1QjU4PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJoYW5kbGVDbG9zZSgnaW5uZXJGb3JtQnV0dG9uRWRpdCcpXFxcIj5cXHU1MTczIFxcdTk1RUQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJoZWlnaHQ6IDIxMHB4O3dpZHRoOiAxMDAlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogbGVmdDt3aWR0aDogODQlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cXFwiMjEwXFxcIiB3aWR0aD1cXFwiMTAwJVxcXCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cXFwiY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcInRhYmxlRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU9XFxcInNtYWxsXFxcIj48L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiAxNSVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXAgdmVydGljYWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwic3VjY2Vzc1xcXCIgQGNsaWNrPVxcXCJhZGRJbm5lckZvcm1TYXZlQnV0dG9uKClcXFwiIGljb249XFxcIm1kLWFkZFxcXCI+XFx1NEZERFxcdTVCNThcXHU2MzA5XFx1OTRBRTwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gaWNvbj1cXFwibWQtYWRkXFxcIiBkaXNhYmxlZD5cXHU2MTBGXFx1ODlDMVxcdTYzMDlcXHU5NEFFPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImFkZElubmVyRm9ybUNsb3NlQnV0dG9uKClcXFwiIGljb249XFxcIm1kLWFkZFxcXCI+XFx1NTE3M1xcdTk1RURcXHU2MzA5XFx1OTRBRTwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwibGlzdC1zZWFyY2gtY29udHJvbC1iaW5kLXRvLWNvbXBcIiwge1xuICBwcm9wczogW1wiYmluZFRvU2VhcmNoRmllbGRQcm9wXCIsIFwiZGF0YVNldElkXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYmluZFRvU2VhcmNoRmllbGQ6IHtcbiAgICAgICAgY29sdW1uVGl0bGU6IFwiXCIsXG4gICAgICAgIGNvbHVtblRhYmxlTmFtZTogXCJcIixcbiAgICAgICAgY29sdW1uTmFtZTogXCJcIixcbiAgICAgICAgY29sdW1uQ2FwdGlvbjogXCJcIixcbiAgICAgICAgY29sdW1uRGF0YVR5cGVOYW1lOiBcIlwiLFxuICAgICAgICBjb2x1bW5PcGVyYXRvcjogXCLljLnphY1cIlxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRWYWx1ZToge1xuICAgICAgICBkZWZhdWx0VHlwZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiLFxuICAgICAgICBkZWZhdWx0VGV4dDogXCJcIlxuICAgICAgfSxcbiAgICAgIHRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwaWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RDb2x1bW4odHJlZU5vZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9LFxuICAgICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmVlRGF0YTogbnVsbFxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhOiB7XG4gICAgICAgIGRlZmF1bHREaXNwbGF5VGV4dDogXCJcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgYmluZFRvU2VhcmNoRmllbGRQcm9wOiBmdW5jdGlvbiBiaW5kVG9TZWFyY2hGaWVsZFByb3AobmV3VmFsdWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKG5ld1ZhbHVlKTtcbiAgICB9LFxuICAgIGRlZmF1bHRWYWx1ZVByb3A6IGZ1bmN0aW9uIGRlZmF1bHRWYWx1ZVByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlKSkge1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dCh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSwgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJpbmRUb0ZpZWxkID0gdGhpcy5iaW5kVG9GaWVsZFByb3A7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGRhdGFTZXRQTykge1xuICAgICAgY29uc29sZS5sb2coZGF0YVNldFBPKTtcbiAgICAgIHZhciB0cmVlTm9kZUFycmF5ID0gW107XG4gICAgICB2YXIgcm9vdE5vZGUgPSB7XG4gICAgICAgIHBpZDogXCItMVwiLFxuICAgICAgICB0ZXh0OiBkYXRhU2V0UE8uZHNOYW1lLFxuICAgICAgICBpZDogZGF0YVNldFBPLmRzSWQsXG4gICAgICAgIG5vZGVUeXBlOiBcIkRhdGFTZXRcIlxuICAgICAgfTtcbiAgICAgIHRyZWVOb2RlQXJyYXkucHVzaChyb290Tm9kZSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YVNldFBPLnJlbGF0ZWRUYWJsZVZvTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0cmVlTm9kZUFycmF5LnB1c2goe1xuICAgICAgICAgIHBpZDogZGF0YVNldFBPLmRzSWQsXG4gICAgICAgICAgdGV4dDogZGF0YVNldFBPLnJlbGF0ZWRUYWJsZVZvTGlzdFtpXS5ydFRhYmxlQ2FwdGlvbixcbiAgICAgICAgICBpZDogZGF0YVNldFBPLnJlbGF0ZWRUYWJsZVZvTGlzdFtpXS5ydFRhYmxlSWQsXG4gICAgICAgICAgbm9kZVR5cGU6IFwiVGFibGVcIlxuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRhdGFTZXRQTy5yZWxhdGVkVGFibGVWb0xpc3RbaV0udGFibGVGaWVsZFBPTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciBzaW5nbGVOb2RlID0gZGF0YVNldFBPLnJlbGF0ZWRUYWJsZVZvTGlzdFtpXS50YWJsZUZpZWxkUE9MaXN0W2pdO1xuICAgICAgICAgIHNpbmdsZU5vZGUucGlkID0gZGF0YVNldFBPLnJlbGF0ZWRUYWJsZVZvTGlzdFtpXS5ydFRhYmxlSWQ7XG4gICAgICAgICAgc2luZ2xlTm9kZS50ZXh0ID0gc2luZ2xlTm9kZS5maWVsZENhcHRpb24gKyBcIltcIiArIHNpbmdsZU5vZGUuZmllbGROYW1lICsgXCJdXCI7XG4gICAgICAgICAgc2luZ2xlTm9kZS5ub2RlVHlwZSA9IFwiVGFibGVGaWVsZFwiO1xuICAgICAgICAgIHNpbmdsZU5vZGUuaWQgPSBzaW5nbGVOb2RlLmZpZWxkSWQ7XG4gICAgICAgICAgc2luZ2xlTm9kZS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi9wYWdlLnBuZ1wiO1xuICAgICAgICAgIHRyZWVOb2RlQXJyYXkucHVzaChzaW5nbGVOb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKHRoaXMuJHJlZnMuelRyZWVVTCksIHRoaXMudHJlZS50cmVlU2V0dGluZywgdHJlZU5vZGVBcnJheSk7XG4gICAgICB0aGlzLnRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICBmdXp6eVNlYXJjaFRyZWVPYmoodGhpcy50cmVlLnRyZWVPYmosIHRoaXMuJHJlZnMudHh0X3NlYXJjaF90ZXh0LiRyZWZzLmlucHV0LCBudWxsLCB0cnVlKTtcbiAgICB9LFxuICAgIHNlbGVjdENvbHVtbjogZnVuY3Rpb24gc2VsZWN0Q29sdW1uKGZpZWxkUE8pIHtcbiAgICAgIGlmIChmaWVsZFBPLm5vZGVUeXBlID09IFwiVGFibGVGaWVsZFwiKSB7XG4gICAgICAgIHRoaXMuYmluZFRvU2VhcmNoRmllbGQuY29sdW1uVGFibGVOYW1lID0gZmllbGRQTy50YWJsZU5hbWU7XG4gICAgICAgIHRoaXMuYmluZFRvU2VhcmNoRmllbGQuY29sdW1uTmFtZSA9IGZpZWxkUE8uZmllbGROYW1lO1xuICAgICAgICB0aGlzLmJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbkNhcHRpb24gPSBmaWVsZFBPLmZpZWxkQ2FwdGlvbjtcbiAgICAgICAgdGhpcy5iaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5EYXRhVHlwZU5hbWUgPSBmaWVsZFBPLmZpZWxkRGF0YVR5cGU7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXREYXRhOiBmdW5jdGlvbiBnZXREYXRhKCkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5iaW5kVG9TZWFyY2hGaWVsZCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBiaW5kVG9TZWFyY2hGaWVsZDogdGhpcy5iaW5kVG9TZWFyY2hGaWVsZCxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLmRlZmF1bHRWYWx1ZVxuICAgICAgfTtcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uIHNldERhdGEoYmluZFRvU2VhcmNoRmllbGQsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgY29uc29sZS5sb2coYmluZFRvU2VhcmNoRmllbGQpO1xuICAgICAgdGhpcy5iaW5kVG9TZWFyY2hGaWVsZCA9IGJpbmRUb1NlYXJjaEZpZWxkO1xuICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dCh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSwgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQpO1xuICAgIH0sXG4gICAgc2VsZWN0RGVmYXVsdFZhbHVlVmlldzogZnVuY3Rpb24gc2VsZWN0RGVmYXVsdFZhbHVlVmlldygpIHtcbiAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHRoaXM7XG4gICAgICB3aW5kb3cucGFyZW50Lmxpc3REZXNpZ24uc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nQmVnaW4od2luZG93LCBudWxsKTtcbiAgICB9LFxuICAgIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUgPSByZXN1bHQuVHlwZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFZhbHVlID0gcmVzdWx0LlZhbHVlO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCA9IHJlc3VsdC5UZXh0O1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IERlZmF1bHRWYWx1ZVV0aWxpdHkuZm9ybWF0VGV4dCh0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSwgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUgPSBcIlwiO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VmFsdWUgPSBcIlwiO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMudGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0ID0gXCJcIjtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjx0YWJsZSBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDI4MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2ODA3XFx1OTg5OFxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHYtbW9kZWw9XFxcImJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtblRpdGxlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgcm93c3Bhbj1cXFwiOVxcXCIgdmFsaWduPVxcXCJ0b3BcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVxcXCJpbnB1dF9ib3JkZXJfYm90dG9tXFxcIiByZWY9XFxcInR4dF9zZWFyY2hfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NVxcdTUyMTdcXHU1NDBEXFx1NjIxNlxcdTgwMDVcXHU2ODA3XFx1OTg5OFxcXCI+PC9pLWlucHV0PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwielRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlIGRpdi1jdXN0b20tc2Nyb2xsXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OiA0MzBweDtvdmVyZmxvdy14OmhpZGRlbjtvdmVyZmxvdy15OiBzY3JvbGxcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTYyNDBcXHU1QzVFXFx1ODg2OFxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3tiaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5UYWJsZU5hbWV9fVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU3RUQxXFx1NUI5QVxcdTVCNTdcXHU2QkI1XFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2JpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbkNhcHRpb259fVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU1QjU3XFx1NkJCNVxcdTU0MERcXHU3OUYwXFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2JpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbk5hbWV9fVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU1QjU3XFx1NkJCNVxcdTdDN0JcXHU1NzhCXFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2JpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbkRhdGFUeXBlTmFtZX19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdThGRDBcXHU3Qjk3XFx1N0IyNlxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHYtbW9kZWw9XFxcImJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbk9wZXJhdG9yXFxcIiBzdHlsZT1cXFwid2lkdGg6MjYwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2YWx1ZT1cXFwiZXFcXFwiPlxcdTdCNDlcXHU0RThFPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcImxpa2VcXFwiPlxcdTUzMzlcXHU5MTREPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcIm5vdF9lcVxcXCI+XFx1NEUwRFxcdTdCNDlcXHU0RThFPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcImd0XFxcIj5cXHU1OTI3XFx1NEU4RTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJndF9lcVxcXCI+XFx1NTkyN1xcdTRFOEVcXHU3QjQ5XFx1NEU4RTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJsdFxcXCI+XFx1NUMwRlxcdTRFOEU8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2YWx1ZT1cXFwibHRfZXFcXFwiPlxcdTVDMEZcXHU0RThFXFx1N0I0OVxcdTRFOEU8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2YWx1ZT1cXFwibGVmdF9saWtlXFxcIj5cXHU1REU2XFx1NTMzOVxcdTkxNEQ8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2YWx1ZT1cXFwicmlnaHRfbGlrZVxcXCI+XFx1NTNGM1xcdTUzMzlcXHU5MTREPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcImluY2x1ZGVcXFwiPlxcdTUzMDVcXHU1NDJCW1xcdTY2ODJcXHU2NUY2XFx1NEUwRFxcdTY1MkZcXHU2MzAxXTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiMlxcXCI+XFx1OUVEOFxcdThCQTRcXHU1MDNDPGJ1dHRvbiBjbGFzcz1cXFwiYnRuLXNlbGVjdCBmcmlnaHRcXFwiIHYtb246Y2xpY2s9XFxcInNlbGVjdERlZmF1bHRWYWx1ZVZpZXdcXFwiPi4uLjwvYnV0dG9uPjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XFxcImhlaWdodDogMzVweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIyXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3t0ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHR9fVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU1OTA3XFx1NkNFOFxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIHJvd3M9XFxcIjhcXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgICAgIDwvdGFibGU+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwibGlzdC10YWJsZS1sYWJlbC1iaW5kLXRvLWNvbXBcIiwge1xuICBwcm9wczogW1wiYmluZFByb3BQcm9wXCIsIFwiZGF0YVNldElkXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYmluZFByb3A6IHtcbiAgICAgICAgY29sdW1uVGFibGVOYW1lOiBcIlwiLFxuICAgICAgICBjb2x1bW5OYW1lOiBcIlwiLFxuICAgICAgICBjb2x1bW5DYXB0aW9uOiBcIlwiLFxuICAgICAgICBjb2x1bW5EYXRhVHlwZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhcmdldEJ1dHRvbklkOiBcIlwiLFxuICAgICAgICBjb2x1bW5BbGlnbjogXCLlsYXkuK3lr7npvZBcIlxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRWYWx1ZToge1xuICAgICAgICBkZWZhdWx0VHlwZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiLFxuICAgICAgICBkZWZhdWx0VGV4dDogXCJcIlxuICAgICAgfSxcbiAgICAgIHRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwaWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RDb2x1bW4odHJlZU5vZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9LFxuICAgICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmVlRGF0YTogbnVsbFxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhOiB7XG4gICAgICAgIGRlZmF1bHREaXNwbGF5VGV4dDogXCJcIlxuICAgICAgfSxcbiAgICAgIGJ1dHRvbnM6IFtdXG4gICAgfTtcbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBiaW5kUHJvcFByb3A6IGZ1bmN0aW9uIGJpbmRQcm9wUHJvcChuZXdWYWx1ZSkge1xuICAgICAgY29uc29sZS5sb2cobmV3VmFsdWUpO1xuICAgIH0sXG4gICAgZGVmYXVsdFZhbHVlUHJvcDogZnVuY3Rpb24gZGVmYXVsdFZhbHVlUHJvcChuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgaWYgKCFTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkodGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUpKSB7XG4gICAgICAgIHRoaXMudGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0ID0gRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuYmluZFRvRmllbGQgPSB0aGlzLmJpbmRUb0ZpZWxkUHJvcDtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoZGF0YVNldFZvLCBidXR0b25zKSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhU2V0Vm8pO1xuICAgICAgdmFyIHRyZWVOb2RlQXJyYXkgPSBbXTtcbiAgICAgIHZhciB0cmVlTm9kZURhdGEgPSBkYXRhU2V0Vm8uY29sdW1uVm9MaXN0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWVOb2RlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2luZ2xlTm9kZSA9IHRyZWVOb2RlRGF0YVtpXTtcbiAgICAgICAgc2luZ2xlTm9kZS5waWQgPSBkYXRhU2V0Vm8uZHNJZDtcbiAgICAgICAgc2luZ2xlTm9kZS50ZXh0ID0gc2luZ2xlTm9kZS5jb2x1bW5DYXB0aW9uICsgXCJbXCIgKyBzaW5nbGVOb2RlLmNvbHVtbk5hbWUgKyBcIl1cIjtcbiAgICAgICAgc2luZ2xlTm9kZS5ub2RlVHlwZSA9IFwiRGF0YVNldENvbHVtblwiO1xuICAgICAgICBzaW5nbGVOb2RlLmlkID0gc2luZ2xlTm9kZS5jb2x1bW5JZDtcbiAgICAgICAgc2luZ2xlTm9kZS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1RoZW1lcy9QbmcxNlgxNi9wYWdlLnBuZ1wiO1xuICAgICAgICB0cmVlTm9kZUFycmF5LnB1c2goc2luZ2xlTm9kZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciByb290Tm9kZSA9IHtcbiAgICAgICAgcGlkOiBcIi0xXCIsXG4gICAgICAgIHRleHQ6IGRhdGFTZXRWby5kc05hbWUsXG4gICAgICAgIGlkOiBkYXRhU2V0Vm8uZHNJZCxcbiAgICAgICAgbm9kZVR5cGU6IFwiRGF0YVNldFwiXG4gICAgICB9O1xuICAgICAgdHJlZU5vZGVBcnJheS5wdXNoKHJvb3ROb2RlKTtcbiAgICAgIHRoaXMudHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQodGhpcy4kcmVmcy56VHJlZVVMKSwgdGhpcy50cmVlLnRyZWVTZXR0aW5nLCB0cmVlTm9kZUFycmF5KTtcbiAgICAgIHRoaXMudHJlZS50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgIHRoaXMuYnV0dG9ucyA9IGJ1dHRvbnM7XG4gICAgfSxcbiAgICBzZWxlY3RDb2x1bW46IGZ1bmN0aW9uIHNlbGVjdENvbHVtbihjb2x1bW5Wbykge1xuICAgICAgdGhpcy5iaW5kUHJvcC5jb2x1bW5UYWJsZU5hbWUgPSBjb2x1bW5Wby5jb2x1bW5UYWJsZU5hbWU7XG4gICAgICB0aGlzLmJpbmRQcm9wLmNvbHVtbk5hbWUgPSBjb2x1bW5Wby5jb2x1bW5OYW1lO1xuICAgICAgdGhpcy5iaW5kUHJvcC5jb2x1bW5DYXB0aW9uID0gY29sdW1uVm8uY29sdW1uQ2FwdGlvbjtcbiAgICAgIHRoaXMuYmluZFByb3AuY29sdW1uRGF0YVR5cGVOYW1lID0gY29sdW1uVm8uY29sdW1uRGF0YVR5cGVOYW1lO1xuICAgIH0sXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYmluZFByb3ApO1xuXG4gICAgICBpZiAoIXRoaXMuYmluZFByb3AudGFyZ2V0QnV0dG9uSWQpIHtcbiAgICAgICAgdGhpcy5iaW5kUHJvcC50YXJnZXRCdXR0b25JZCA9IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGJpbmRQcm9wOiB0aGlzLmJpbmRQcm9wLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IHRoaXMuZGVmYXVsdFZhbHVlXG4gICAgICB9O1xuICAgIH0sXG4gICAgc2V0RGF0YTogZnVuY3Rpb24gc2V0RGF0YShiaW5kUHJvcCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICBjb25zb2xlLmxvZyhiaW5kUHJvcCk7XG4gICAgICB0aGlzLmJpbmRQcm9wID0gYmluZFByb3A7XG4gICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgIHRoaXMudGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0ID0gRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgfSxcbiAgICBzZWxlY3REZWZhdWx0VmFsdWVWaWV3OiBmdW5jdGlvbiBzZWxlY3REZWZhdWx0VmFsdWVWaWV3KCkge1xuICAgICAgd2luZG93Ll9TZWxlY3RCaW5kT2JqID0gdGhpcztcbiAgICAgIHdpbmRvdy5wYXJlbnQubGlzdERlc2lnbi5zZWxlY3REZWZhdWx0VmFsdWVEaWFsb2dCZWdpbih3aW5kb3csIG51bGwpO1xuICAgIH0sXG4gICAgc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZShyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSA9IHJlc3VsdC5UeXBlO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VmFsdWUgPSByZXN1bHQuVmFsdWU7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0ID0gcmVzdWx0LlRleHQ7XG4gICAgICAgIHRoaXMudGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0ID0gRGVmYXVsdFZhbHVlVXRpbGl0eS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRWYWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0ID0gXCJcIjtcbiAgICAgICAgdGhpcy50ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHQgPSBcIlwiO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPHRhYmxlIGNlbGxwYWRkaW5nPVxcXCIwXFxcIiBjZWxsc3BhY2luZz1cXFwiMFxcXCIgYm9yZGVyPVxcXCIwXFxcIiBjbGFzcz1cXFwiaHRtbC1kZXNpZ24tcGx1Z2luLWRpYWxvZy10YWJsZS13cmFwZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxMDBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMjgwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCAvPlxcbiAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTVCRjlcXHU5RjUwXFx1NjVCOVxcdTVGMEZcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCB2LW1vZGVsPVxcXCJiaW5kUHJvcC5jb2x1bW5BbGlnblxcXCIgc3R5bGU9XFxcIndpZHRoOjI2MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcIlxcdTVERTZcXHU1QkY5XFx1OUY1MFxcXCI+XFx1NURFNlxcdTVCRjlcXHU5RjUwPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcIlxcdTVDNDVcXHU0RTJEXFx1NUJGOVxcdTlGNTBcXFwiPlxcdTVDNDVcXHU0RTJEXFx1NUJGOVxcdTlGNTA8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2YWx1ZT1cXFwiXFx1NTNGM1xcdTVCRjlcXHU5RjUwXFxcIj5cXHU1M0YzXFx1NUJGOVxcdTlGNTA8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHJvd3NwYW49XFxcIjlcXFwiIHZhbGlnbj1cXFwidG9wXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCByZWY9XFxcInpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NjI0MFxcdTVDNUVcXHU4ODY4XFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2JpbmRQcm9wLmNvbHVtblRhYmxlTmFtZX19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTdFRDFcXHU1QjlBXFx1NUI1N1xcdTZCQjVcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7YmluZFByb3AuY29sdW1uQ2FwdGlvbn19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTVCNTdcXHU2QkI1XFx1NTQwRFxcdTc5RjBcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7YmluZFByb3AuY29sdW1uTmFtZX19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTVCNTdcXHU2QkI1XFx1N0M3QlxcdTU3OEJcXHVGRjFBIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2JpbmRQcm9wLmNvbHVtbkRhdGFUeXBlTmFtZX19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTg5RTZcXHU1M0QxXFx1NjMwOVxcdTk0QUVcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCB2LW1vZGVsPVxcXCJiaW5kUHJvcC50YXJnZXRCdXR0b25JZFxcXCIgc3R5bGU9XFxcIndpZHRoOjI2MHB4XFxcIiA6Y2xlYXJhYmxlPVxcXCJ0cnVlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gOnZhbHVlPVxcXCJpdGVtLmJ1dHRvbklkXFxcIiB2LWZvcj1cXFwiaXRlbSBpbiBidXR0b25zXFxcIj57e2l0ZW0uYnV0dG9uQ2FwdGlvbn19PC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIyXFxcIj5cXHU5RUQ4XFx1OEJBNFxcdTUwM0M8YnV0dG9uIGNsYXNzPVxcXCJidG4tc2VsZWN0IGZyaWdodFxcXCIgdi1vbjpjbGljaz1cXFwic2VsZWN0RGVmYXVsdFZhbHVlVmlld1xcXCI+Li4uPC9idXR0b24+PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBzdHlsZT1cXFwiaGVpZ2h0OiAzNXB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjJcXFwiIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e3RlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dH19XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTU5MDdcXHU2Q0U4XFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cXFwiOFxcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cIlxufSk7Il19
