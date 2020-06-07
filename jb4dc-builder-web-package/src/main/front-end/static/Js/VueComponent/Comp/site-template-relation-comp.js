Vue.component("site-template-relation-comp", {
    props: ["relation"],
    data: function () {
        return {
            diagramObj:null
        }
    },
    mounted: function () {
        $(this.$refs.relationContentOuterWrap).css("height",PageStyleUtility.GetPageHeight()-75);
        //this.init();
        /*if(PageStyleUtility.GetPageWidth()<1000){
            this.displayDesc=false;
            $(".table-relation-op-buttons-outer-wrap").css("width","100%");
        }*/
        this.init();
    },
    methods: {
        beginEditTemplateEvent:function(e, obj){
            console.log(obj);
        },
        removeTemplateEvent:function(e,obj){
            this.diagramObj.startTransaction();

            var adornment = obj.part;
            var diagram = e.diagram;
            var fromNode = adornment.adornedPart;

            this.diagramObj.remove(fromNode);
            this.diagramObj.commitTransaction("deleted node");
            //this.diagramObj.remove(obj);
        },
        init: function () {
            var _self=this;

            if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make;  // for conciseness in defining templates

            // some constants that will be reused within templates
            var roundedRectangleParams = {
                parameter1: 2,  // set the rounded corner
                spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight  // make content go all the way to inside edges of rounded corners
            };

            var myDiagram =
                $(go.Diagram, "divSiteTemplateRelationWrap",  // must name or refer to the DIV HTML element
                    {
                        "animationManager.initialAnimationStyle": go.AnimationManager.None,
                        "InitialAnimationStarting": function (e) {
                            var animation = e.subject.defaultAnimation;
                            animation.easing = go.Animation.EaseOutExpo;
                            animation.duration = 900;
                            animation.add(e.diagram, 'scale', 0.1, 1);
                            animation.add(e.diagram, 'opacity', 0, 1);
                        },

                        // have mouse wheel events zoom in and out instead of scroll up and down
                        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                        // support double-click in background creating a new node
                        "clickCreatingTool.archetypeNodeData": {text: "new node"},
                        // enable undo & redo
                        "undoManager.isEnabled": true,
                        positionComputation: function (diagram, pt) {
                            return new go.Point(Math.floor(pt.x), Math.floor(pt.y));
                        }
                    });

            this.diagramObj=myDiagram;

            // when the document is modified, add a "*" to the title and enable the "Save" button
            myDiagram.addDiagramListener("Modified", function (e) {
                var button = document.getElementById("SaveButton");
                if (button) button.disabled = !myDiagram.isModified;
                var idx = document.title.indexOf("*");
                if (myDiagram.isModified) {
                    if (idx < 0) document.title += "*";
                } else {
                    if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            });

            // define the Node template
            myDiagram.nodeTemplate =
                $(go.Node, "Auto",
                    {
                        locationSpot: go.Spot.Top,
                        isShadowed: true, shadowBlur: 1,
                        shadowOffset: new go.Point(0, 1),
                        shadowColor: "rgba(0, 0, 0, .14)"
                    },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    // define the node's outer shape, which will surround the TextBlock
                    $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                        {
                            name: "SHAPE", fill: "#ffffff", strokeWidth: 0,
                            stroke: null,
                            portId: "",  // this Shape is the Node's port, not the whole Node
                            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
                            cursor: "pointer"
                        }),
                    $(go.TextBlock,
                        {
                            font: "bold small-caps 11pt helvetica, bold arial, sans-serif",
                            margin: 7,
                            stroke: "rgba(0, 0, 0, .87)",
                            editable: true  // editing the text automatically updates the model data
                        },
                        new go.Binding("text").makeTwoWay())
                );


            // unlike the normal selection Adornment, this one includes a Button
            myDiagram.nodeTemplate.selectionAdornmentTemplate =
                $(go.Adornment, "Spot",
                    $(go.Panel, "Auto",
                        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                            {fill: null, stroke: "#7986cb", strokeWidth: 3}),
                        $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
                    ),
                    $(go.Panel, "Horizontal",
                        {
                            alignment: go.Spot.TopRight,
                        }, // panel properties

                        // the button to create a "next" node, at the top-right corner
                        $("Button",
                            {
                                alignment: go.Spot.TopRight,
                                click: addNodeAndLink  // this function is defined below
                            },
                            $(go.Shape, "PlusLine", {width: 12, height: 12,stroke:"hsl(30, 100%, 50%)"})
                        ),
                        $("Button",
                            {
                                alignment: go.Spot.TopCenter,
                                click: _self.beginEditTemplateEvent  // this function is defined below
                            },
                            $(go.Shape, "Gear", {width: 12, height: 12,fill:"hsl(30, 100%, 50%)",stroke:"hsl(30, 100%, 50%)"})

                        ),
                        $("Button",
                            {
                                alignment: go.Spot.TopCenter,
                                click: _self.removeTemplateEvent  // this function is defined below
                            },
                            $(go.Shape, "XLine", {width: 12, height: 12,stroke:"hsl(30, 100%, 50%)"})
                        )
                    ),

                    // end button
                ); // end Adornment

            myDiagram.nodeTemplateMap.add("Start",
                $(go.Node, "Spot", {desiredSize: new go.Size(75, 75)},
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    $(go.Shape, "Circle",
                        {
                            fill: "#52ce60", /* green */
                            stroke: null,
                            portId: "",
                            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
                            cursor: "pointer"
                        }),
                    $(go.TextBlock, "Start",
                        {
                            font: "bold 16pt helvetica, bold arial, sans-serif",
                            stroke: "whitesmoke"
                        })
                )
            );

            myDiagram.nodeTemplateMap.add("End",
                $(go.Node, "Spot", {desiredSize: new go.Size(75, 75)},
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    $(go.Shape, "Circle",
                        {
                            fill: "maroon",
                            stroke: null,
                            portId: "",
                            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
                            cursor: "pointer"
                        }),
                    $(go.Shape, "Circle", {
                        fill: null,
                        desiredSize: new go.Size(65, 65),
                        strokeWidth: 2,
                        stroke: "whitesmoke"
                    }),
                    $(go.TextBlock, "End",
                        {
                            font: "bold 16pt helvetica, bold arial, sans-serif",
                            stroke: "whitesmoke"
                        })
                )
            );

            // clicking the button inserts a new node to the right of the selected node,
            // and adds a link to that new node
            function addNodeAndLink(e, obj) {
                //alert(1);
                var adornment = obj.part;
                var diagram = e.diagram;
                diagram.startTransaction("Add State");

                // get the node data for which the user clicked the button
                var fromNode = adornment.adornedPart;
                var fromData = fromNode.data;
                // create a new "State" data object, positioned off to the right of the adorned Node
                var toData = {text: "new"};
                var p = fromNode.location.copy();
                p.x += 200;
                toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
                // add the new node data to the model
                var model = diagram.model;
                model.addNodeData(toData);

                // create a link data from the old node data to the new node data
                var linkdata = {
                    from: model.getKeyForNodeData(fromData),  // or just: fromData.id
                    to: model.getKeyForNodeData(toData),
                    text: "transition"
                };
                // and add the link data to the model
                model.addLinkData(linkdata);

                // select the new Node
                var newnode = diagram.findNodeForData(toData);
                diagram.select(newnode);

                diagram.commitTransaction("Add State");

                // if the new node is off-screen, scroll the diagram to show the new node
                diagram.scrollToRect(newnode.actualBounds);
            }

            // replace the default Link template in the linkTemplateMap
            myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                    {
                        curve: go.Link.Bezier,
                        adjusting: go.Link.Stretch,
                        reshapable: true, relinkableFrom: true, relinkableTo: true,
                        toShortLength: 3
                    },
                    new go.Binding("points").makeTwoWay(),
                    new go.Binding("curviness"),
                    $(go.Shape,  // the link shape
                        {strokeWidth: 1.5},
                        new go.Binding('stroke', 'progress', function (progress) {
                            return progress ? "#52ce60" /* green */ : 'black';
                        }),
                        new go.Binding('strokeWidth', 'progress', function (progress) {
                            return progress ? 2.5 : 1.5;
                        })
                    ),
                    $(go.Shape,  // the arrowhead
                        {toArrow: "standard", stroke: null},
                        new go.Binding('fill', 'progress', function (progress) {
                            return progress ? "#52ce60" /* green */ : 'black';
                        }),
                    ),
                    $(go.Panel, "Auto",
                        $(go.Shape,  // the label background, which becomes transparent around the edges
                            {
                                fill: $(go.Brush, "Radial",
                                    {0: "rgb(245, 245, 245)", 0.7: "rgb(245, 245, 245)", 1: "rgba(245, 245, 245, 0)"}),
                                stroke: null
                            }),
                        $(go.TextBlock, "transition",  // the label text
                            {
                                textAlign: "center",
                                font: "9pt helvetica, arial, sans-serif",
                                margin: 4,
                                editable: true  // enable in-place editing
                            },
                            // editing the text automatically updates the model data
                            new go.Binding("text").makeTwoWay())
                    )
                );

            myDiagram.model = go.Model.fromJson({ "class": "go.GraphLinksModel",
                "nodeKeyProperty": "id",
                "nodeDataArray": [
                    {"id":-3, "loc":"185 -158", "category":"Start"},
                    {"id":-1, "loc":"155 -138", "category":"Start"},
                    {"id":0, "loc":"190 15", "text":"Shopping"},
                    {"id":1, "loc":"353 32", "text":"Browse Items"},
                    {"id":2, "loc":"353 166", "text":"Search Items"},
                    {"id":3, "loc":"512 12", "text":"View Item"},
                    {"id":4, "loc":"661 17", "text":"View Cart"},
                    {"id":5, "loc":"644 171", "text":"Update Cart"},
                    {"id":6, "loc":"800 96", "text":"Checkout"},
                    {"id":-2, "loc":"757 229", "category":"End"}
                ],
                "linkDataArray": [
                    { "from": -1, "to": 0, "text": "Visit online store" },
                    { "from": 0, "to": 1,  "progress": "true", "text": "Browse" },
                    { "from": 0, "to": 2,  "progress": "true", "text": "Use search bar" },
                    { "from": 1, "to": 2,  "progress": "true", "text": "Use search bar" },
                    { "from": 2, "to": 3,  "progress": "true", "text": "Click item" },
                    { "from": 2, "to": 2,  "text": "Another search", "curviness": 20 },
                    { "from": 1, "to": 3,  "progress": "true", "text": "Click item" },
                    { "from": 3, "to": 0,  "text": "Not interested", "curviness": -100 },
                    { "from": 3, "to": 4,  "progress": "true", "text": "Add to cart" },
                    { "from": 4, "to": 0,  "text": "More shopping", "curviness": -150 },
                    { "from": 4, "to": 5,  "text": "Update needed", "curviness": -50 },
                    { "from": 5, "to": 4,  "text": "Update made" },
                    { "from": 4, "to": 6,  "progress": "true", "text": "Proceed" },
                    { "from": 6, "to": 5,  "text": "Update needed" },
                    { "from": 6, "to": -2, "progress": "true", "text": "Purchase made" }
                ]
            });
            // read in the JSON data from the "mySavedModel" element
            //load();
        }
    },
    template: `<div ref="relationContentOuterWrap" class="site-template-relation-content-outer-wrap">
                    <div class="site-template-relation-content-wrap" id="divSiteTemplateRelationWrap">
                        模版关系
                    </div>
                </div>`
});
