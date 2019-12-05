class BpmnJsUtility {
    static GetElementDocumentation(element, create) {
        var bo = element.businessObject;
        var docs = bo.get('documentation');
        var comments; // get comments node
        //debugger;
        docs.some(function (d) {
            return (comments = d);
        }); // create if not existing

        if (!comments && create) {
            comments = bo.$model.create('bpmn:Documentation');
            docs.push(comments);
        }
        return comments;
    }
    static GetElementDocumentationText(element){
        var bo = element.businessObject;
        var docs = bo.get('documentation');
        if(docs==null||docs.length==0){
            return "";
        }
        return docs[0].text;
    }
    static SetElementDocumentationText(element,text) {
        let documentation = this.GetElementDocumentation(element, true);
        documentation.text = text;
    }

    static GetElementName(element){
        var bo = element.businessObject;
        if(bo.get('name')) {
            return bo.get('name');
        }
        return "";
    }

    static SetElementName(element,name){
        var bo = element.businessObject;
        bo.name=name;
    }

    static GetExtensionElements(element, create){
        var bo = element.businessObject;
        console.log(bo);
        var docs = bo.get('documentation');
        var comments; // get comments node

        //debugger;
        //docs.some(function (d) {
        //    return d.textFormat === 'text/x-comments' && (comments = d);
        //}); // create if not existing

        if (!comments && create) {
            comments = bo.$model.create('bpmn:ExtensionElements', {});
            docs.push(comments);

            bo = comments.businessObject;
            var executionListener = bo.$model.create('camunda:ExecutionListener', { "class":""});
            executionListener.text=222;

        }

        return comments;
    }
}

export { BpmnJsUtility };