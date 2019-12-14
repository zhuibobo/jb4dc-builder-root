class BpmnJsUtility {
    static GetAttr(element,attr){
        var bo = element.businessObject;
        if(bo.get(attr)) {
            return bo.get(attr);
        }
        return "";
    }
    static SetAttr(element,attr,value){
        var bo = element.businessObject;
        bo[attr]=value;
    }



    //#region
    static BPMN_GetElementDocumentation(element, create) {
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
    static BPMN_GetElementDocumentationText(element){
        var bo = element.businessObject;
        var docs = bo.get('documentation');
        if(docs==null||docs.length==0){
            return "";
        }
        return docs[0].text;
    }
    static BPMN_SetElementDocumentationText(element,text) {
        let documentation = this.BPMN_GetElementDocumentation(element, true);
        documentation.text = text;
    }

    static BPMN_Attr_GetId(element){
        return this.GetAttr(element,"id");
    }

    static BPMN_Attr_GetName(element){
        return this.GetAttr(element,"name");
    }
    static BPMN_Attr_SetName(element, name){
        this.SetAttr(element,"name",name);
    }

    static BPMN_Attr_Process_GetIsExecutable(element){
        return this.GetAttr(element,"isExecutable");
    }
    static BPMN_Attr_Process_SetIsExecutable(element){
        return this.SetAttr(element,"isExecutable","true");
    }
    static BPMN_Attr_Process_SetNotExecutable(element){
        return this.SetAttr(element,"isExecutable","false");
    }

    static BPMN_Attr_GetSourceRef(element){
        return this.GetAttr(element,"sourceRef");
    }
    static BPMN_Attr_SetSourceRef(element, sourceRef){
        this.SetAttr(element,"sourceRef",sourceRef);
    }

    static BPMN_Attr_GetTargetRef(element){
        return this.GetAttr(element,"targetRef");
    }
    static BPMN_Attr_SetTargetRef(element, targetRef){
        this.SetAttr(element,"targetRef",targetRef);
    }

    static BPMN_Attr_GetValue(element){
        return this.GetAttr(element,"value");
    }
    static BPMN_Attr_SetValue(element, value){
        this.SetAttr(element,"value",value);
    }

    static BPMN_Attr_GetExtensionElements(element){
        var bo = element.businessObject;
        var extensionElements = bo.get('extensionElements');
        if(extensionElements){
            return extensionElements;
        }
        return null;
    }
    static BPMN_Attr_CreateExtensionElements(element){
        //debugger;
        if(!this.BPMN_Attr_GetExtensionElements(element)){
            var bo = element.businessObject;
            var extensionElements = bo.$model.create('bpmn:ExtensionElements',{});
            extensionElements.values=[];
            bo.extensionElements=extensionElements;
            return extensionElements;
            //bo.values.push(extensionElements);
            //var executionListener = extensionElements.businessObject.$model.create('camunda:ExecutionListener', { "class":""});
            //executionListener.text=222;
            //return extensionElements;
        }
    }

    static BPMN_GetIncomingSequenceFlowArray(element){
        var bo = element.businessObject;
        var incoming = bo.get('incoming');
        console.log(incoming);
        return incoming
    }
    static BPMN_GetOutgoingSequenceFlowArray(element){
        var bo = element.businessObject;
        var outgoing = bo.get('outgoing');
        console.log(outgoing);
        return outgoing;
    }
    //#endregion

    //#region
    static CAMUNDA_Attr_GetJobPriority(element){
        return this.GetAttr(element,"jobPriority");
    }
    static CAMUNDA_Attr_SetJobPriority(element, jobPriority){
        return this.SetAttr(element,"jobPriority",jobPriority);
    }

    static CAMUNDA_Attr_GetCandidateStarterGroups(element){
        return this.GetAttr(element,"candidateStarterGroups");
    }
    static CAMUNDA_Attr_SetCandidateStarterGroups(element, candidateStarterGroups){
        return this.SetAttr(element,"candidateStarterGroups",candidateStarterGroups);
    }

    static CAMUNDA_Attr_GetCandidateStarterUsers(element){
        return this.GetAttr(element,"candidateStarterUsers");
    }
    static CAMUNDA_Attr_SetCandidateStarterUsers(element, candidateStarterUsers){
        return this.SetAttr(element,"candidateStarterUsers",candidateStarterUsers);
    }

    static CAMUNDA_Attr_GetVersionTag(element){
        return this.GetAttr(element,"versionTag");
    }
    static CAMUNDA_Attr_SetVersionTag(element, versionTag){
        return this.SetAttr(element,"versionTag",versionTag);
    }

    static CAMUNDA_Attr_GetAssignee(element){
        return this.GetAttr(element,"assignee");
    }
    static CAMUNDA_Attr_SetAssignee(element, assignee){
        return this.SetAttr(element,"assignee",assignee);
    }

    static CAMUNDA_Attr_GetCandidateUsers(element){
        return this.GetAttr(element,"candidateUsers");
    }
    static CAMUNDA_Attr_SetCandidateUsers(element, candidateUsers){
        return this.SetAttr(element,"candidateUsers",candidateUsers);
    }

    static CAMUNDA_Attr_GetCandidateGroups(element){
        return this.GetAttr(element,"candidateGroups");
    }
    static CAMUNDA_Attr_SetCandidateGroups(element, candidateGroups){
        return this.SetAttr(element,"candidateGroups",candidateGroups);
    }

    static CAMUNDA_Attr_GetDueDate(element){
        return this.GetAttr(element,"dueDate");
    }
    static CAMUNDA_Attr_SetDueDate(element, dueDate){
        return this.SetAttr(element,"dueDate",dueDate);
    }

    static CAMUNDA_Attr_GetFollowUpDate(element){
        return this.GetAttr(element,"followUpDate");
    }
    static CAMUNDA_Attr_SetFollowUpDate(element, followUpDate){
        return this.SetAttr(element,"followUpDate",followUpDate);
    }

    static CAMUNDA_Attr_GetPriority(element){
        return this.GetAttr(element,"priority");
    }
    static CAMUNDA_Attr_SetPriority(element, priority){
        return this.SetAttr(element,"priority",priority);
    }

    static _CAMUNDA_ClearListenerArray(element,$type){
        var extensionElements=this.BPMN_Attr_GetExtensionElements(element);
        if(extensionElements){
            if(extensionElements.values){
                for(var i=extensionElements.values.length-1;i>=0;i--){
                    if(extensionElements.values[i].$type==$type) {
                        ArrayUtility.Delete(extensionElements.values, i)
                    }
                }
            }
        }
    }
    static _CAMUNDA_GetListenerArray(element,$type){
        var extensionElements=this.BPMN_Attr_GetExtensionElements(element);
        if(extensionElements){
            if(extensionElements.values){
                var result=[];
                extensionElements.values.forEach(function (item) {
                    if(item.$type==$type){
                        result.push(item);
                    }
                });
                return result;
            }
        }
        return null;
    }
    static _CAMUNDA_SetListenerArray(element,$type,ary){
        var extensionElements=this.BPMN_Attr_GetExtensionElements(element);
        if(extensionElements){
            if(ary){
                var bo = element.businessObject;
                //console.log(extensionElements);
                this._CAMUNDA_ClearListenerArray(element,$type);
                ary.forEach(function (item) {
                    var executionListener=bo.$model.create($type, {"class":item.className,"event":item.eventName});
                    extensionElements.values.push(executionListener);
                })
            }
        }
        else{
            var message="元素1"+this.BPMN_Attr_GetId(element)+"不存在bpmn:extensionElements子元素!";
            BaseUtility.ThrowMessage(message);
        }
    }
    //bpmn:extensionElements->camunda:executionListener
    static CAMUNDA_ClearExecutionListenerArray(element){
        this._CAMUNDA_ClearListenerArray(element,"camunda:ExecutionListener");
    }
    static CAMUNDA_GetExecutionListenerArray(element){
        return this._CAMUNDA_GetListenerArray(element,"camunda:ExecutionListener");
    }
    static CAMUNDA_SetExecutionListenerArray(element,ary){
        this._CAMUNDA_SetListenerArray(element,"camunda:ExecutionListener",ary);
    }

    //bpmn:extensionElements->camunda:taskListener
    static CAMUNDA_ClearExecutionListenerArray(element){
        this._CAMUNDA_ClearListenerArray(element,"camunda:TaskListener");
    }
    static CAMUNDA_GetExecutionListenerArray(element){
        return this._CAMUNDA_GetListenerArray(element,"camunda:TaskListener");
    }
    static CAMUNDA_SetExecutionListenerArray(element,ary){
        this._CAMUNDA_SetListenerArray(element,"camunda:TaskListener",ary);
    }

    //bpmn:extensionElements->camunda:properties->camunda:property
    static CAMUNDA_GetPropertiesArray(element){
        var extensionElements=this.BPMN_Attr_GetExtensionElements(element);
        if(extensionElements){
            if(extensionElements.values){
                var properties = null;
                properties = ArrayUtility.WhereSingle(extensionElements.values, function (item) {
                    return item.$type == "camunda:Properties";
                });
                if(properties&&properties.values){
                    return properties.values
                }
                return null;
            }
        }
        return null;
    }
    static CAMUNDA_SetPropertiesArray(element,ary){
        var extensionElements=this.BPMN_Attr_GetExtensionElements(element);
        if(extensionElements){
            if(ary) {
                //debugger;
                var bo = element.businessObject;

                var properties = null;
                if (extensionElements.values) {
                    properties = ArrayUtility.WhereSingle(extensionElements.values, function (item) {
                        return item.$type == "camunda:Properties";
                    });
                }
                else{
                    extensionElements.values=[];
                }

                if(!properties){
                    properties=bo.$model.create('camunda:Properties');
                    extensionElements.values.push(properties);
                }
                //if(!properties.values){
                    properties.values=[];
                //}

                ary.forEach(function (item) {
                    var camunda_Property = bo.$model.create('camunda:Property', {
                        "name": item.name,
                        "value": item.value
                    });
                    properties.values.push(camunda_Property);
                })
            }
        }
        else{
            var message="元素"+this.BPMN_Attr_GetId(element)+"不存在bpmn:extensionElements子元素!";
            BaseUtility.ThrowMessage(message);
        }
    }

    //#endregion

    //#region
    static JB4DC_Attr_GetCode(element){
        return this.GetAttr(element,"jb4dcCode");
    }
    static JB4DC_Attr_SetCode(element, jb4dcCode){
        this.SetAttr(element,"jb4dcCode",jb4dcCode);
    }

    static JB4DC_Attr_GetFormKey(element){
        return this.GetAttr(element,"jb4dcFormKey");
    }
    static JB4DC_Attr_SetFormKey(element, jb4dcFormKey){
        this.SetAttr(element,"jb4dcFormKey",jb4dcFormKey);
    }
    //#endregion

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