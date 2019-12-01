class BpmnJsUtility {
    static GetCommentsElement(element, create) {
        var bo = element.businessObject;
        var docs = bo.get('documentation');
        var comments; // get comments node

        //debugger;
        docs.some(function (d) {
            return d.textFormat === 'text/x-comments' && (comments = d);
        }); // create if not existing

        if (!comments && create) {
            comments = bo.$model.create('bpmn:Documentation', {
                textFormat: 'text/x-comments'
            });
            docs.push(comments);
        }

        return comments;
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