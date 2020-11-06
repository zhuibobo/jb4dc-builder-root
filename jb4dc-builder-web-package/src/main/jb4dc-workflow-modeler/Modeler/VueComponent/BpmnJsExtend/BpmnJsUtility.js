import { PODefinition } from "./PODefinition.js"

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
        if(value){
            bo[attr]=value;
        }
        else{
            bo[attr]=null;
        }
    }

    static GetElement(bpmnModeler,elemId){
        var elementRegistry = bpmnModeler.get('elementRegistry');
        //console.log(elementRegistry);
        return elementRegistry.get(elemId);
    }

    static GetProcessElement(bpmnModeler){
        var elementRegistry = bpmnModeler.get('elementRegistry');
        var allElements=elementRegistry.getAll();
        var result=null;
        for (var i = 0; i < allElements.length; i++) {
            if(allElements[i].type=="bpmn:Process"){
                result=allElements[i];
                break;
            }
        }
        return result;
    }

    static GetProcessFormId(processElement){
        return this.JB4DC_Attr_GetJb4dcFormId(processElement);
    }
    //#region
    static Is_Process(element){
        return element.type=="bpmn:Process";
    }
    static Is_UserTask(element){
        return element.type=="bpmn:UserTask";
    }
    static Is_SequenceFlow(element){
        return element.type=="bpmn:SequenceFlow";
    }
    //#endregion

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
        if(docs[0].text) {
            return docs[0].text;
        }
        return "";
    }
    static BPMN_SetElementDocumentationText(element,text) {
        let documentation = this.BPMN_GetElementDocumentation(element, true);
        documentation.text = text;
    }

    static BPMN_Attr_GetId(element){
        return this.GetAttr(element,"id");
    }
    static BPMN_Attr_SetId(element,id){
        return this.SetAttr(element,"id",id);
    }

    static BPMN_Attr_GetName(element){
        return this.GetAttr(element,"name");
    }
    static BPMN_Attr_SetName(element, name){
        this.SetAttr(element,"name",name);
    }

    static BPMN_Attr_Process_GetIsExecutable(element){
        return this.GetAttr(element,"isExecutable").toString().toLocaleLowerCase();
    }
    static BPMN_Attr_Process_SetIsExecutable(element,isExecutable){
        return this.SetAttr(element,"isExecutable",isExecutable);
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

    static BPMN_GetExtensionElements(element){
        var bo = element.businessObject;
        var extensionElements = bo.get('extensionElements');
        if(extensionElements){
            return extensionElements;
        }
        return null;
    }
    static BPMN_CreateExtensionElements(element){
        //debugger;
        if(!this.BPMN_GetExtensionElements(element)){
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
        //console.log(incoming);
        return incoming
    }
    static BPMN_GetOutgoingSequenceFlowArray(element){
        var bo = element.businessObject;
        var outgoing = bo.get('outgoing');
        //console.log(outgoing);
        return outgoing;
    }

    static BPMN_GetConditionExpression(element) {
        var bo = element.businessObject;
        //console.log(bo);
        if (bo.conditionExpression) {
            if(bo.conditionExpression.body){
                return bo.conditionExpression.body;
            }
        }
        return "";
    }
    static BPMN_SetConditionExpression(element,conditionExpression){
        var bo = element.businessObject;
        //console.log(bo);
        if (bo.conditionExpression) {
            bo.conditionExpression.body = conditionExpression;
        }
        else{
            var formalExpression = bo.$model.create('bpmn:FormalExpression',{});
            formalExpression.body=conditionExpression;
            bo.conditionExpression=formalExpression;
        }
    }
    //#endregion

    //#region
    static CAMUNDA_Attr_GetTaskPriority(element){
        return this.GetAttr(element,"taskPriority");
    }
    static CAMUNDA_Attr_SetTaskPriority(element, taskPriority){
        return this.SetAttr(element,"taskPriority",taskPriority);
    }
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

    static CAMUNDA_Attr_GetHistoryTimeToLive(element){
        return this.GetAttr(element,"historyTimeToLive");
    }
    static CAMUNDA_Attr_SetHistoryTimeToLive(element, historyTimeToLive){
        return this.SetAttr(element,"historyTimeToLive",historyTimeToLive);
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
        var extensionElements=this.BPMN_GetExtensionElements(element);
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
        var extensionElements=this.BPMN_GetExtensionElements(element);
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
    static _CAMUNDA_SetListenerArray(element,$type,ary,autoCreate){
        var extensionElements=this.BPMN_GetExtensionElements(element);
        if(autoCreate&&!extensionElements){
            this.BPMN_CreateExtensionElements(element);
            extensionElements=this.BPMN_GetExtensionElements(element);
        }
        if(extensionElements){
            if(ary){
                var bo = element.businessObject;
                //console.log(extensionElements);
                this._CAMUNDA_ClearListenerArray(element,$type);
                ary.forEach(function (item) {
                    var executionListener;
                    if(item.listenerType=="class") {
                        executionListener = bo.$model.create($type, {"class": item.value, "event": item.eventName});
                        extensionElements.values.push(executionListener);
                    }
                    else if(item.listenerType=="expression") {
                        executionListener = bo.$model.create($type, {"expression": item.value, "event": item.eventName});
                        extensionElements.values.push(executionListener);
                    }
                    else if(item.listenerType=="delegateExpression") {
                        executionListener = bo.$model.create($type, {"delegateExpression": item.value, "event": item.eventName});
                        extensionElements.values.push(executionListener);
                    }
                    else {
                        DialogUtility.AlertText(`暂不支持${item.listenerType}的设置!`);
                    }
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
    static CAMUNDA_GetExecutionListenerJson(element){
        var listenerArray=this.CAMUNDA_GetExecutionListenerArray(element);

        if(listenerArray){
            var result=[];
            listenerArray.forEach(function (item) {
                if(item.get("class")){
                    result.push({
                        listenerType:"class",value:item.get("class"),eventName:item.get("event")
                    })
                }
                else if(item.get("expression")){
                    result.push({
                        listenerType:"expression",value:item.get("expression"),eventName:item.get("event")
                    })
                }
                else if(item.get("delegateExpression")){
                    result.push({
                        listenerType:"delegateExpression",value:item.get("delegateExpression"),eventName:item.get("event")
                    })
                }
            })
            return result;
        }
        return null;
    }
    static CAMUNDA_SetExecutionListenerArray(element,ary,autoCreate){
        this._CAMUNDA_SetListenerArray(element,"camunda:ExecutionListener",ary,autoCreate);
    }

    //bpmn:extensionElements->camunda:taskListener
    static CAMUNDA_ClearTaskListenerArray(element){
        this._CAMUNDA_ClearListenerArray(element,"camunda:TaskListener");
    }
    static CAMUNDA_GetTaskListenerArray(element){
        return this._CAMUNDA_GetListenerArray(element,"camunda:TaskListener");
    }
    static CAMUNDA_GetTaskListenerArrayJson(element){
        var listenerArray=this.CAMUNDA_GetTaskListenerArray(element);

        if(listenerArray){
            var result=[];
            listenerArray.forEach(function (item) {
                if(item.get("class")){
                    result.push({
                        listenerType:"class",value:item.get("class"),eventName:item.get("event")
                    })
                }
                else if(item.get("expression")){
                    result.push({
                        listenerType:"expression",value:item.get("expression"),eventName:item.get("event")
                    })
                }
                else if(item.get("delegateExpression")){
                    result.push({
                        listenerType:"delegateExpression",value:item.get("delegateExpression"),eventName:item.get("event")
                    })
                }
            })
            return result;
        }
        return null;
    }
    static CAMUNDA_SetTaskListenerArray(element,ary,autoCreate){
        this._CAMUNDA_SetListenerArray(element,"camunda:TaskListener",ary,autoCreate);
    }

    //bpmn:extensionElements->camunda:properties->camunda:property
    static CAMUNDA_ClearPropertiesArray(element){
        var extensionElements=this.BPMN_GetExtensionElements(element);
        if(extensionElements){
            if(extensionElements.values){
                /*var properties = null;
                properties = ArrayUtility.WhereSingle(extensionElements.values, function (item) {
                    return item.$type == "camunda:Properties";
                });*/
                for(var i=extensionElements.values.length-1;i>=0;i--){
                    if(extensionElements.values[i].$type=="camunda:Properties") {
                        ArrayUtility.Delete(extensionElements.values, i)
                    }
                }
            }
        }
    }
    static CAMUNDA_GetPropertiesArray(element){
        var extensionElements=this.BPMN_GetExtensionElements(element);
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
    static CAMUNDA_GetPropertiesJson(element,ary) {
        var propertiesArray = this.CAMUNDA_GetPropertiesArray(element);
        if(propertiesArray) {
            var result = [];
            propertiesArray.forEach(function (item) {
                result.push({
                    name:item.name,
                    value: item.value
                })
            })
            return result;
        }
        return null
    }

    static CAMUNDA_SetPropertiesArray(element,ary,autoCreate){
        var extensionElements=this.BPMN_GetExtensionElements(element);
        if(autoCreate&&!extensionElements){
            this.BPMN_CreateExtensionElements(element);
            extensionElements=this.BPMN_GetExtensionElements(element);
        }
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
    static JB4DC_Attr_GetJb4dcFlowCategory(element){
        return this.GetAttr(element,"jb4dcFlowCategory");
    }
    static JB4DC_Attr_SetJb4dcFlowCategory(element, jb4dcFlowCategory){
        this.SetAttr(element,"jb4dcFlowCategory",jb4dcFlowCategory);
    }

    static JB4DC_Attr_GetJb4dcCode(element){
        return this.GetAttr(element,"jb4dcCode");
    }
    static JB4DC_Attr_SetJb4dcCode(element, jb4dcCode){
        this.SetAttr(element,"jb4dcCode",jb4dcCode);
    }

    static JB4DC_Attr_GetJb4dcSequenceFlowConditionEditText(element){
        return this.GetAttr(element,"jb4dcSequenceFlowConditionEditText");
    }
    static JB4DC_Attr_SetJb4dcSequenceFlowConditionEditText(element, jb4dcSequenceFlowConditionEditText){
        this.SetAttr(element,"jb4dcSequenceFlowConditionEditText",jb4dcSequenceFlowConditionEditText);
    }

    static JB4DC_Attr_GetJb4dcFormId(element){
        return this.GetAttr(element,"jb4dcFormId");
    }
    static JB4DC_Attr_SetJb4dcFormId(element, jb4dcFormId){
        this.SetAttr(element,"jb4dcFormId",jb4dcFormId);
    }

    static JB4DC_Attr_GetJb4dcTenantId(element){
        return this.GetAttr(element,"jb4dcTenantId");
    }
    static JB4DC_Attr_SetJb4dcTenantId(element, jb4dcTenantId){
        this.SetAttr(element,"jb4dcTenantId",jb4dcTenantId);
    }

    static JB4DC_Attr_GetJb4dcProcessTitleEditText(element){
        return this.GetAttr(element,"jb4dcProcessTitleEditText");
    }
    static JB4DC_Attr_SetJb4dcProcessTitleEditText(element, jb4dcProcessTitleEditText){
        this.SetAttr(element,"jb4dcProcessTitleEditText",jb4dcProcessTitleEditText);
    }

    static JB4DC_Attr_GetJb4dcProcessTitleEditValue(element){
        return this.GetAttr(element,"jb4dcProcessTitleEditValue");
    }
    static JB4DC_Attr_SetJb4dcProcessTitleEditValue(element, jb4dcProcessTitleEditValue){
        this.SetAttr(element,"jb4dcProcessTitleEditValue",jb4dcProcessTitleEditValue);
    }

    static JB4DC_Attr_GetJb4dcProcessDescriptionEditText(element){
        return this.GetAttr(element,"jb4dcProcessDescriptionEditText");
    }
    static JB4DC_Attr_SetJb4dcProcessDescriptionEditText(element, jb4dcProcessDescriptionEditText){
        this.SetAttr(element,"jb4dcProcessDescriptionEditText",jb4dcProcessDescriptionEditText);
    }

    static JB4DC_Attr_GetJb4dcProcessDescriptionEditValue(element){
        return this.GetAttr(element,"jb4dcProcessDescriptionEditValue");
    }
    static JB4DC_Attr_SetJb4dcProcessDescriptionEditValue(element, jb4dcProcessDescriptionEditValue){
        this.SetAttr(element,"jb4dcProcessDescriptionEditValue",jb4dcProcessDescriptionEditValue);
    }

    static JB4DC_Attr_GetJb4dcProcessCandidateStarterGroupsDesc(element){
        return this.GetAttr(element,"jb4dcProcessCandidateStarterGroupsDesc");
    }
    static JB4DC_Attr_SetJb4dcProcessCandidateStarterGroupsDesc(element, jb4dcProcessCandidateStarterGroupsDesc){
        this.SetAttr(element,"jb4dcProcessCandidateStarterGroupsDesc",jb4dcProcessCandidateStarterGroupsDesc);
    }

    static JB4DC_Attr_GetJb4dcProcessCandidateStarterUsersDesc(element){
        return this.GetAttr(element,"jb4dcProcessCandidateStarterUsersDesc");
    }
    static JB4DC_Attr_SetJb4dcProcessCandidateStarterUsersDesc(element, jb4dcProcessCandidateStarterUsersDesc){
        this.SetAttr(element,"jb4dcProcessCandidateStarterUsersDesc",jb4dcProcessCandidateStarterUsersDesc);
    }

    static JB4DC_Attr_GetJb4dcCandidateUsersDesc(element){
        return this.GetAttr(element,"jb4dcCandidateUsersDesc");
    }
    static JB4DC_Attr_SetJb4dcCandidateUsersDesc(element, jb4dcCandidateUsersDesc){
        this.SetAttr(element,"jb4dcCandidateUsersDesc",jb4dcCandidateUsersDesc);
    }

    static JB4DC_Attr_GetJb4dcCandidateGroupsDesc(element){
        return this.GetAttr(element,"jb4dcCandidateGroupsDesc");
    }
    static JB4DC_Attr_SetJb4dcCandidateGroupsDesc(element, CandidateGroupsDesc){
        this.SetAttr(element,"jb4dcCandidateGroupsDesc",CandidateGroupsDesc);
    }

    static JB4DC_Attr_GetJb4dcActionsOpinionBindToField(element){
        return this.GetAttr(element,"jb4dcActionsOpinionBindToField");
    }
    static JB4DC_Attr_SetJb4dcActionsOpinionBindToField(element, jb4dcActionsOpinionBindToField){
        this.SetAttr(element,"jb4dcActionsOpinionBindToField",jb4dcActionsOpinionBindToField);
    }

    static JB4DC_Attr_GetJb4dcActionsOpinionBindToElemId(element){
        return this.GetAttr(element,"jb4dcActionsOpinionBindToElemId");
    }
    static JB4DC_Attr_SetJb4dcActionsOpinionBindToElemId(element, jb4dcActionsOpinionBindToElemId){
        this.SetAttr(element,"jb4dcActionsOpinionBindToElemId",jb4dcActionsOpinionBindToElemId);
    }

    static JB4DC_Attr_GetJb4dcActionConfirm(element){
        return this.GetAttr(element,"jb4dcActionConfirm");
    }
    static JB4DC_Attr_SetJb4dcActionConfirm(element, jb4dcActionConfirm){
        this.SetAttr(element,"jb4dcActionConfirm",jb4dcActionConfirm);
    }

    static JB4DC_GetActionsArray(element){
        var extensionElements=this.BPMN_GetExtensionElements(element);
        if(extensionElements){
            if(extensionElements.values){
                var actions;
                actions = ArrayUtility.WhereSingle(extensionElements.values, function (item) {
                    return item.$type == "jb4dc:Jb4dcActions";
                });
                if(actions&&actions.values){
                    return actions.values
                }
                return null;
            }
        }
        return null;
    }
    static JB4DC_SetActionsArray(element,ary,autoCreate){
        var extensionElements=this.BPMN_GetExtensionElements(element);
        if(autoCreate&&!extensionElements){
            this.BPMN_CreateExtensionElements(element);
            extensionElements=this.BPMN_GetExtensionElements(element);
        }
        if(extensionElements){
            if(ary) {
                //debugger;
                var bo = element.businessObject;

                var actions = null;
                if (extensionElements.values) {
                    actions = ArrayUtility.WhereSingle(extensionElements.values, function (item) {
                        return item.$type == "jb4dc:Jb4dcActions";
                    });
                }
                else{
                    extensionElements.values=[];
                }

                if(!actions){
                    actions=bo.$model.create('jb4dc:Jb4dcActions');
                    extensionElements.values.push(actions);
                }
                actions.values=[];

                ary.forEach(function (item) {
                    var jb4dcAction = bo.$model.create('jb4dc:Jb4dcAction', PODefinition.RemoveExcludeProp(PODefinition.GetJB4DCActionPO(),item));
                    actions.values.push(jb4dcAction);
                })
            }
        }
        else{
            var message="元素"+this.BPMN_Attr_GetId(element)+"不存在bpmn:extensionElements子元素!";
            BaseUtility.ThrowMessage(message);
        }
    }

    static _LoopFindSourceRefIsUserTaskBusinessObject(elemBusinessObject,userTaskListBusinessObject,searchedElemId){
        //debugger;
        if(!searchedElemId){
            searchedElemId=elemBusinessObject.id;
        }
        else{
            searchedElemId+=";"+elemBusinessObject.id;
        }
        if(elemBusinessObject.sourceRef){
            var sourceRefElement=elemBusinessObject.sourceRef;
            if(sourceRefElement.$type=="bpmn:UserTask"){
                userTaskListBusinessObject.push(sourceRefElement);
            }
            else{
                if(searchedElemId.indexOf(sourceRefElement.id)<=0) {
                    this._LoopFindSourceRefIsUserTaskBusinessObject(sourceRefElement, userTaskListBusinessObject,searchedElemId);
                }
            }
        }
        if(elemBusinessObject.incoming){
            var incomingSequenceFlowElementList=elemBusinessObject.incoming;
            for (var i = 0; i < incomingSequenceFlowElementList.length; i++) {
                var tempSequenceFlowElement=incomingSequenceFlowElementList[i];
                if(searchedElemId.indexOf(tempSequenceFlowElement.id)<=0) {
                    this._LoopFindSourceRefIsUserTaskBusinessObject(tempSequenceFlowElement, userTaskListBusinessObject, searchedElemId);
                }
            }
        }
    }
    static JB4DC_TryGetMayUserTaskBusinessObjectBySequenceFlowId(bpmnModeler,elementId){
        var sequenceFlowElement=this.GetElement(bpmnModeler,elementId);
        //console.log(sequenceFlowElement.businessObject);
        var userTaskListBusinessObject=[];
        this._LoopFindSourceRefIsUserTaskBusinessObject(sequenceFlowElement.businessObject,userTaskListBusinessObject);
        userTaskListBusinessObject=ArrayUtility.Unique(userTaskListBusinessObject);
        //console.log(userTaskList);
        return userTaskListBusinessObject;
        /*if(sequenceFlowElement.type=="bpmn:SequenceFlow"){
            var bo = sequenceFlowElement.businessObject;
            var sourceRefElement=bo.sourceRef;
            console.log(sourceRefElement);
            if(sourceRefElement.$type=="bpmn:UserTask"){
                return [this.GetElement(bpmnModeler,sourceRefElement.id)];
            }
            else if(sourceRefElement.$type=="bpmn:ExclusiveGateway"){
                var result=[];

                var incomingSequenceFlowElementList=sourceRefElement.incoming;
                for (var i = 0; i <incomingSequenceFlowElementList.length ; i++) {
                    var tempSequenceFlowElement=incomingSequenceFlowElementList[i];

                }

                return result;
            }
        }
        return [];*/
    }
    static JB4DC_TryGetMayBeActionsBySequenceFlowId(bpmnModeler,elementId){
        var mayBeUserTaskListBusinessObject=this.JB4DC_TryGetMayUserTaskBusinessObjectBySequenceFlowId(bpmnModeler,elementId);
        var result=[];
        for (var i = 0; i < mayBeUserTaskListBusinessObject.length; i++) {
            var userTaskElemId = mayBeUserTaskListBusinessObject[i].id;
            var userTaskElem = this.GetElement(bpmnModeler, userTaskElemId);
            var actionArray = this.JB4DC_GetActionsArray(userTaskElem);
            result.push({
                taskElem: userTaskElem,
                taskName:userTaskElem.businessObject.name,
                taskId:userTaskElem.businessObject.id,
                actionArray: actionArray
            });
            //console.log(actionArray);
        }
        return result;
        //console.log(mayBeUserTaskListBusinessObject);
        //var sequenceFlow=this.GetElement(bpmnModeler,elementId);
        //console.log(sequenceFlow);
    }
    //#endregion

    /*static GetExtensionElements(element, create){
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
    }*/
}

export { BpmnJsUtility };