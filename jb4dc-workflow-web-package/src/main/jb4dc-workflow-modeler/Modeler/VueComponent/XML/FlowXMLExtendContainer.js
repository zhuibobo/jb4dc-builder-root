class FlowXMLExtendContainer {
    _HTMLEditorInst = null

    GetXMLEditorInst() {
        return this._HTMLEditorInst;
    }

    SetEditorXML(xml) {
        //debugger;
        if (!StringUtility.IsNullOrEmpty(xml)) {
            this.GetXMLEditorInst().setValue(xml);

            CodeMirror.commands["selectAll"](this.GetXMLEditorInst());
            var range = {from: this.GetXMLEditorInst().getCursor(true), to: this.GetXMLEditorInst().getCursor(false)};

            this.GetXMLEditorInst().autoFormatRange(range.from, range.to);

            var a1 = {line: 0, ch: 2};
            this.GetXMLEditorInst().getDoc().eachLine(function (line) {
            });

            return;
            //尝试获取CKEditor编辑器中选中的元素
            var selectedElem = CKEditorUtility.GetSelectedElem();
            //console.log(selectedElem);
            var searchHTML = "";
            if (selectedElem) {
                searchHTML = selectedElem.outerHTML().split(">")[0];
                //alert(searchHTML);
            }
            //console.log("-------------------------------");
            var cursor = this.GetHTMLEditorInst().getSearchCursor(searchHTML);
            cursor.findNext();
            //console.log(cursor);
            //console.log(cursor.from()+"|"+cursor.to());
            if (cursor.from() && cursor.to()) {
                this.GetHTMLEditorInst().getDoc().setSelection(cursor.from(), cursor.to());
            }
        }
    }

    GetEditorXML() {
        return this.GetXMLEditorInst().getValue();
    }

    InitializeXMLCodeDesign() {
        var mixedMode = {
            name: "htmlmixed",
            scriptTypes: [{
                matches: /\/x-handlebars-template|\/x-mustache/i,
                mode: null
            },
                {
                    matches: /(text|application)\/(x-)?vb(a|script)/i,
                    mode: "vbscript"
                }]
        };
        this._HTMLEditorInst = CodeMirror.fromTextArea(document.getElementById("TextAreaXMLEditor"), {
            mode: mixedMode,
            selectionPointer: true,
            theme: "monokai",
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            lineNumbers: true,
            lineWrapping: true
        });
        this._HTMLEditorInst.setSize("100%", PageStyleUtility.GetWindowHeight() - 95);
        //$(".CodeMirror").height(PageStyleUtility.GetWindowHeight()-60);
        /**/
    }
}

export { FlowXMLExtendContainer };