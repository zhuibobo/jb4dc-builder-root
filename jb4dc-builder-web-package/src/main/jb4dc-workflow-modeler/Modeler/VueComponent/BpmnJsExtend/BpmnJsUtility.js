import { PODefinition } from "./PODefinition.js"

class BpmnJsUtility {
    static GetAttr(element,attr,defaultValue){
        var bo = element.businessObject;
        if(bo.get(attr)) {
            return bo.get(attr);
        }
        if(defaultValue){
            return defaultValue;
        }
        return "";
    }
    static SetAttr(element,attr,value,defaultValue){
        var bo = element.businessObject;
        if(value){
            bo[attr]=value;
        }
        else{
            if(defaultValue){
                bo[attr]=defaultValue;
            }
            else {
                bo[attr] = null;
            }
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
    static Is_ServiceTask(element){
        return element.type=="bpmn:ServiceTask";
    }
    static Is_SequenceFlow(element){
        return element.type=="bpmn:SequenceFlow";
    }
    static Is_BoundaryEvent(element){
        return element.type=="bpmn:BoundaryEvent";
    }
    static Is_IntermediateThrowEvent(element){
        return element.type=="bpmn:IntermediateThrowEvent";
    }
    static Is_IntermediateCatchEvent(element){
        return element.type=="bpmn:IntermediateCatchEvent";
    }
    static Is_StartEvent(element){
        return element.type=="bpmn:StartEvent";
    }
    static Is_StartEvent_For_Message(element){
        if(element.type=="bpmn:StartEvent"&&element.businessObject.eventDefinitions&&element.businessObject.eventDefinitions[0].$type=="bpmn:MessageEventDefinition"){
            return true;
        }
        return false;
    }
    static Is_StartEvent_For_Signal(element){
        if(element.type=="bpmn:StartEvent"&&element.businessObject.eventDefinitions&&element.businessObject.eventDefinitions[0].$type=="bpmn:SignalEventDefinition"){
            return true;
        }
        return false;
    }
    static Is_StartEvent_For_Timer(element){
        if(element.type=="bpmn:StartEvent"&&element.businessObject.eventDefinitions&&element.businessObject.eventDefinitions[0].$type=="bpmn:TimerEventDefinition"){
            return true;
        }
        return false;
    }
    static Is_EndEvent(element){
        return element.type=="bpmn:EndEvent";
    }
    static Is_EndEvent_For_Signal(element){
        if(element.type=="bpmn:EndEvent"&&element.businessObject.eventDefinitions&&element.businessObject.eventDefinitions[0].$type=="bpmn:SignalEventDefinition"){
            return true;
        }
        return false;
    }
    //#endregion

    //#region BPMN
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

    static BPMN_Attr_GetCancelActivity(element) {
        var value = this.GetAttr(element, "cancelActivity");
        return value ? "true" : "false";
    }
    static BPMN_Attr_SetCancelActivity(element, value) {
        //debugger;
        this.SetAttr(element, "cancelActivity", value == "true" ? true : false);
        //this.SetAttr(element, "cancelActivity", value);
    }

    static BPMN_GetExtensionElements(element){
        var bo = element.businessObject;
        //debugger;
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
    static BPMN_GetMultiInstanceLoopCharacteristics(element){
        var bo = element.businessObject;
        if (bo.loopCharacteristics) {
            //debugger;
            return {
                loopCharacteristics:"true",
                isSequential: bo.loopCharacteristics.isSequential ? "true" : "false",
                collection:bo.loopCharacteristics.collection ? bo.loopCharacteristics.collection : "",
                elementVariable:bo.loopCharacteristics.elementVariable ? bo.loopCharacteristics.elementVariable : "",
                completionCondition:bo.loopCharacteristics.completionCondition?bo.loopCharacteristics.completionCondition.body:""
            }
            /*if(bo.conditionExpression.body){
                return bo.conditionExpression.body;
            }*/
        }
        return {
            loopCharacteristics: "false",
            isSequential: "",
            collection: "",
            elementVariable: "",
            completionCondition:""
        };
        //debugger;
    }
    static BPMN_SetMultiInstanceLoopCharacteristics(element,multiInstanceLoopCharacteristics){
        var bo = element.businessObject;
        if(multiInstanceLoopCharacteristics.loopCharacteristics=="true") {
            if (!bo.loopCharacteristics){
                var loopCharacteristics = bo.$model.create('bpmn:MultiInstanceLoopCharacteristics',{});
                bo.loopCharacteristics=loopCharacteristics;
            }

            bo.loopCharacteristics.isSequential = (multiInstanceLoopCharacteristics.isSequential == "true" ? true : false);
            bo.loopCharacteristics.collection = multiInstanceLoopCharacteristics.collection;
            bo.loopCharacteristics.elementVariable = multiInstanceLoopCharacteristics.elementVariable;

            //if (!bo.loopCharacteristics.completionCondition){
                //var completionCondition = bo.$model.create('bpmn:completionCondition');
                //bo.completionCondition=completionCondition;
            //}

            if(multiInstanceLoopCharacteristics.completionCondition){
                //debugger;
                var completionCondition = bo.$model.create('bpmn:FormalExpression',{body:multiInstanceLoopCharacteristics.completionCondition});
                bo.loopCharacteristics.completionCondition=completionCondition;
            }
            else {
                bo.loopCharacteristics.completionCondition=null;
            }
        }
        else {
            bo.loopCharacteristics=null;
        }
    }

    static BPMN_SetMessages(element,messageArray){
        //console.log(messageArray);
        if(this.Is_Process(element)){
            var definitionsBo=element.businessObject.$parent;
            //var definitionsBo=bo.$parent;
            for (let i = definitionsBo.rootElements.length-1; i >=0; i--) {
                if (definitionsBo.rootElements[i].$type == "bpmn:Message") {
                    //console.log(definitionsBo.rootElements[i].name);
                    ArrayUtility.Delete(definitionsBo.rootElements, i);
                }
            }
            for (let i = 0; i < messageArray.length; i++) {
                var messageElem = definitionsBo.$model.create('bpmn:Message', {
                    id: messageArray[i].id,
                    name: messageArray[i].name,
                    jb4dcDesc:messageArray[i].jb4dcDesc
                });
                definitionsBo.rootElements.push(messageElem);
            }
        }
    }
    static BPMN_GetMessages(element) {
        //debugger;
        //if(this.Is_Process(element)){
        var messageArray = [];
        var definitionsBo;
        if(this.Is_Process(element)){
            definitionsBo = element.businessObject.$parent;
        }
        else{
            definitionsBo = element.businessObject.$parent.$parent;
        }

        //var definitionsBo=bo.$parent;
        for (let i = 0; i < definitionsBo.rootElements.length; i++) {
            if (definitionsBo.rootElements[i].$type == "bpmn:Message") {
                messageArray.push({
                    id: definitionsBo.rootElements[i].id,
                    name: definitionsBo.rootElements[i].name,
                    jb4dcDesc: definitionsBo.rootElements[i].jb4dcDesc ? definitionsBo.rootElements[i].jb4dcDesc : ""
                });
            }
        }
        return messageArray;
        //}
        //return []
    }
    static BPMN_GetMessageElement(definitionsBo,messageId) {
        for (let i = 0; i < definitionsBo.rootElements.length; i++) {
            if (definitionsBo.rootElements[i].$type == "bpmn:Message" && definitionsBo.rootElements[i].id == messageId) {
                return definitionsBo.rootElements[i];
            }
        }
        return null;
    }

    static BPMN_SetSignals(element,signalsArray){
        //console.log(messageArray);
        if(this.Is_Process(element)){
            var definitionsBo=element.businessObject.$parent;
            //var definitionsBo=bo.$parent;
            for (let i = definitionsBo.rootElements.length-1; i >=0; i--) {
                if (definitionsBo.rootElements[i].$type == "bpmn:Signal") {
                    //console.log(definitionsBo.rootElements[i].name);
                    ArrayUtility.Delete(definitionsBo.rootElements, i);
                }
            }
            for (let i = 0; i < signalsArray.length; i++) {
                var signalElem = definitionsBo.$model.create('bpmn:Signal', {
                    id: signalsArray[i].id,
                    name: signalsArray[i].name,
                    jb4dcDesc:signalsArray[i].jb4dcDesc
                });
                definitionsBo.rootElements.push(signalElem);
            }
        }
    }
    static BPMN_GetSignals(element) {
        //if(this.Is_Process(element)){
        var signalsArray = [];
        //var definitionsBo=element.businessObject.$parent;
        var definitionsBo;
        if (this.Is_Process(element)) {
            definitionsBo = element.businessObject.$parent;
        } else {
            definitionsBo = element.businessObject.$parent.$parent;
        }
        //var definitionsBo=bo.$parent;
        for (let i = definitionsBo.rootElements.length - 1; i >= 0; i--) {
            if (definitionsBo.rootElements[i].$type == "bpmn:Signal") {
                signalsArray.push({
                    id: definitionsBo.rootElements[i].id,
                    name: definitionsBo.rootElements[i].name,
                    jb4dcDesc: definitionsBo.rootElements[i].jb4dcDesc ? definitionsBo.rootElements[i].jb4dcDesc : ""
                });
            }
        }
        return signalsArray;
        //}
        //return []
    }
    static BPMN_GetSignalElement(definitionsBo,signalId) {
        for (let i = 0; i < definitionsBo.rootElements.length; i++) {
            if (definitionsBo.rootElements[i].$type == "bpmn:Signal" && definitionsBo.rootElements[i].id == signalId) {
                return definitionsBo.rootElements[i];
            }
        }
        return null;
    }

    static BPMN_SetMessageEventDefinition(element,messageEventDefinition){
        //debugger;
        if(messageEventDefinition&&messageEventDefinition.id) {
            var bo = element.businessObject;
            var messageId = messageEventDefinition.messageRef;
            var messageEventDefinitionId = messageEventDefinition.id;
            var definitionsBo = element.businessObject.$parent.$parent;
            var messageElement = this.BPMN_GetMessageElement(definitionsBo, messageId);
            //console.log(bo);
            //if (bo.messageEventDefinition) {
            //    bo.messageEventDefinition.id = messageEventDefinitionId;
            //    bo.messageEventDefinition.messageRef = messageElement;
            //}
            //else{
            var eventDefinition = bo.$model.create('bpmn:MessageEventDefinition', {
                id: messageEventDefinitionId,
                messageRef: messageElement,
                class: StringUtility.IsNotNullOrEmpty(messageEventDefinition.class)?messageEventDefinition.class:null
            });
            bo.eventDefinitions = [eventDefinition];
            //}
        }
    }
    static BPMN_GetMessageEventDefinition(element){
        //debugger;
        var bo = element.businessObject;
        if(bo.eventDefinitions) {
            for (let i = 0; i < bo.eventDefinitions.length; i++) {
                if (bo.eventDefinitions[i].$type == "bpmn:MessageEventDefinition") {
                    return {
                        id: bo.eventDefinitions[i].id,
                        messageRef: bo.eventDefinitions[i].messageRef ? bo.eventDefinitions[i].messageRef.id : "",
                        class: bo.eventDefinitions[i].class ? bo.eventDefinitions[i].class : "",
                    }
                }
            }
        }
        return {
            id:"",
            messageRef:"",
            class:""
        }
    }

    static BPMN_SetSignalEventDefinition(element,signalEventDefinition){
        if(signalEventDefinition&&signalEventDefinition.id){
            var bo = element.businessObject;
            var signalId=signalEventDefinition.signalRef;
            var signalEventDefinitionId=signalEventDefinition.id;
            var definitionsBo = element.businessObject.$parent.$parent;
            var signalElement=this.BPMN_GetSignalElement(definitionsBo,signalId);
            var eventDefinition = bo.$model.create('bpmn:SignalEventDefinition',{id:signalEventDefinitionId,signalRef:signalElement});
            bo.eventDefinitions=[eventDefinition];
        }
    }
    static BPMN_GetSignalEventDefinition(element){
        //debugger;
        var bo = element.businessObject;
        if(bo.eventDefinitions) {
            for (let i = 0; i < bo.eventDefinitions.length; i++) {
                if (bo.eventDefinitions[i].$type == "bpmn:SignalEventDefinition") {
                    return {
                        id: bo.eventDefinitions[i].id,
                        signalRef: bo.eventDefinitions[i].signalRef ? bo.eventDefinitions[i].signalRef.id : ""
                    }
                }
            }
        }
        return {
            id:"",
            signalRef:""
        }
    }

    static BPMN_SetTimerEventDefinition(element,timerEventDefinition){
        //debugger;
        if(timerEventDefinition&&timerEventDefinition.id) {
            var bo = element.businessObject;
            var eventDefinition = bo.$model.create('bpmn:TimerEventDefinition', {id: timerEventDefinition.id});
            var formalExpression = bo.$model.create('bpmn:FormalExpression', {body: timerEventDefinition.value});
            if(timerEventDefinition.type=="timeDate") {
                eventDefinition.timeDate=formalExpression;
            }
            else if(timerEventDefinition.type=="timeDuration") {
                eventDefinition.timeDuration=formalExpression;
            }
            else if(timerEventDefinition.type=="timeCycle") {
                eventDefinition.timeCycle=formalExpression;
            }
            bo.eventDefinitions=[eventDefinition];
        }
    }
    static BPMN_GetTimerEventDefinition(element){
        var bo = element.businessObject;
        if(bo.eventDefinitions) {
            for (let i = 0; i < bo.eventDefinitions.length; i++) {
                if (bo.eventDefinitions[i].$type == "bpmn:TimerEventDefinition") {
                    var innType = "";
                    var innValue="";
                    if (bo.eventDefinitions[i].timeDate) {
                        innType="timeDate";
                        innValue=bo.eventDefinitions[i].timeDate.body;
                    } else if (bo.eventDefinitions[i].timeDuration) {
                        innType="timeDuration";
                        innValue=bo.eventDefinitions[i].timeDuration.body;
                    } else if (bo.eventDefinitions[i].timeCycle) {
                        innType="timeCycle";
                        innValue=bo.eventDefinitions[i].timeCycle.body;
                    }
                    return {
                        type: innType,
                        id: bo.eventDefinitions[i].id,
                        value: innValue
                    }
                }
            }
        }
        return {
            type:"",
            id:"",
            value:""
        }
    }
    //#endregion

    //#region CAMUNDA
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

    static CAMUNDA_Attr_GetClass(element){
        return this.GetAttr(element,"class");
    }
    static CAMUNDA_Attr_SetClass(element, _class){
        return this.SetAttr(element,"class",_class);
    }

    static CAMUNDA_Attr_GetType(element){
        return this.GetAttr(element,"type");
    }
    static CAMUNDA_Attr_SetType(element, _type){
        return this.SetAttr(element,"type",_type);
    }

    static CAMUNDA_Attr_GetTopic(element){
        return this.GetAttr(element,"topic");
    }
    static CAMUNDA_Attr_SetTopic(element, topic){
        return this.SetAttr(element,"topic",topic);
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

    //#region JB4DC
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

    static JB4DC_Attr_GetJb4dcFormEx1Id(element){
        return this.GetAttr(element,"jb4dcFormEx1Id");
    }
    static JB4DC_Attr_SetJb4dcFormEx1Id(element, jb4dcFormEx1Id){
        this.SetAttr(element,"jb4dcFormEx1Id",jb4dcFormEx1Id);
    }

    static JB4DC_Attr_GetJb4dcFormId(element){
        return this.GetAttr(element,"jb4dcFormId");
    }
    static JB4DC_Attr_SetJb4dcFormId(element, jb4dcFormId){
        this.SetAttr(element,"jb4dcFormId",jb4dcFormId);
    }

    static JB4DC_Attr_GetJb4dcOuterFormUrl(element){
        return this.GetAttr(element,"jb4dcOuterFormUrl");
    }
    static JB4DC_Attr_SetJb4dcOuterFormUrl(element, jb4dcOuterFormUrl){
        this.SetAttr(element,"jb4dcOuterFormUrl",jb4dcOuterFormUrl);
    }

    static JB4DC_Attr_GetJb4dcOuterFormEx1Url(element){
        return this.GetAttr(element,"jb4dcOuterFormEx1Url");
    }
    static JB4DC_Attr_SetJb4dcOuterFormEx1Url(element, jb4dcOuterFormEx1Url){
        this.SetAttr(element,"jb4dcOuterFormEx1Url",jb4dcOuterFormEx1Url);
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

    static JB4DC_Attr_GetJb4dcProcessCandidateStarterGroups(element){
        var arrStr=this.GetAttr(element,"jb4dcProcessCandidateStarterGroups");
        if(arrStr){
            return JsonUtility.StringToJson(arrStr);
        }
        return [];
    }
    static JB4DC_Attr_SetJb4dcProcessCandidateStarterGroups(element, jb4dcProcessCandidateStarterGroups){
        //var arrStr=
        this.SetAttr(element,"jb4dcProcessCandidateStarterGroups",JsonUtility.JsonToString(jb4dcProcessCandidateStarterGroups));
    }

    static JB4DC_Attr_GetJb4dcProcessCandidateStarterUsers(element){
        var arrStr=this.GetAttr(element,"jb4dcProcessCandidateStarterUsers");
        if(arrStr){
            return JsonUtility.StringToJson(arrStr);
        }
        return [];
    }
    static JB4DC_Attr_SetJb4dcProcessCandidateStarterUsers(element, jb4dcProcessCandidateStarterUsers){
        this.SetAttr(element,"jb4dcProcessCandidateStarterUsers",JsonUtility.JsonToString(jb4dcProcessCandidateStarterUsers));
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

    static JB4DC_Attr_GetJb4dcProcessActionConfirm(element){
        return this.GetAttr(element,"jb4dcProcessActionConfirm","false");
    }
    static JB4DC_Attr_SetJb4dcProcessActionConfirm(element, jb4dcActionConfirm){
        this.SetAttr(element,"jb4dcProcessActionConfirm",jb4dcActionConfirm,"false");
    }

    static JB4DC_Attr_GetJb4dcProcessModelGroups(element){
        var arrStr=this.GetAttr(element,"jb4dcProcessModelGroups");
        if(arrStr){
            return JsonUtility.StringToJson(arrStr);
        }
        return [];
    }
    static JB4DC_Attr_SetJb4dcProcessModelGroups(element, jb4dcProcessModelGroups){
        this.SetAttr(element,"jb4dcProcessModelGroups",JsonUtility.JsonToString(jb4dcProcessModelGroups));
        //this.SetAttr(element,"jb4dcProcessModelGroups",jb4dcProcessModelGroups);
    }

    static JB4DC_Attr_GetJb4dcProcessModelImageClass(element){
        return this.GetAttr(element,"jb4dcProcessModelImageClass","lab la-elementor");
    }
    static JB4DC_Attr_SetJb4dcProcessModelImageClass(element, jb4dcProcessModelImageClass){
        this.SetAttr(element,"jb4dcProcessModelImageClass",jb4dcProcessModelImageClass);
    }

    static JB4DC_Attr_GetJb4dcProcessModelManagerGroups(element){
        var arrStr=this.GetAttr(element,"jb4dcProcessModelManagerGroups");
        if(arrStr){
            return JsonUtility.StringToJson(arrStr);
        }
        return [];
    }
    static JB4DC_Attr_SetJb4dcProcessModelManagerGroups(element, jb4dcProcessModelManagerGroups){
        this.SetAttr(element,"jb4dcProcessModelManagerGroups",JsonUtility.JsonToString(jb4dcProcessModelManagerGroups));
    }

    static JB4DC_Attr_GetJb4dcProcessModelManagerUsers(element){
        var arrStr=this.GetAttr(element,"jb4dcProcessModelManagerUsers");
        if(arrStr){
            return JsonUtility.StringToJson(arrStr);
        }
        return [];
    }
    static JB4DC_Attr_SetJb4dcProcessModelManagerUsers(element, jb4dcProcessModelManagerUsers){
        this.SetAttr(element,"jb4dcProcessModelManagerUsers",JsonUtility.JsonToString(jb4dcProcessModelManagerUsers));
    }

    static JB4DC_Attr_GetJb4dcProcessRestartEnable(element){
        return this.GetAttr(element,"jb4dcProcessRestartEnable","true");
    }
    static JB4DC_Attr_SetJb4dcProcessRestartEnable(element, jb4dcProcessRestartEnable){
        this.SetAttr(element,"jb4dcProcessRestartEnable",jb4dcProcessRestartEnable,"true");
    }

    static JB4DC_Attr_GetJb4dcProcessAnyJumpEnable(element){
        return this.GetAttr(element,"jb4dcProcessAnyJumpEnable","true");
    }
    static JB4DC_Attr_SetJb4dcProcessAnyJumpEnable(element, jb4dcProcessAnyJumpEnable){
        this.SetAttr(element,"jb4dcProcessAnyJumpEnable",jb4dcProcessAnyJumpEnable,"true");
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

    static JB4DC_GetMainReceiveObjectsArray(element){
        var extensionElements=this.BPMN_GetExtensionElements(element);
        if(extensionElements){
            if(extensionElements.values){
                var actions;
                actions = ArrayUtility.WhereSingle(extensionElements.values, function (item) {
                    return item.$type == "jb4dc:Jb4dcMainReceiveObjects";
                });
                if(actions&&actions.values){
                    return actions.values
                }
                return null;
            }
        }
        return null;
    }
    static JB4DC_SetMainReceiveObjectsArray(element,ary,autoCreate){
        var extensionElements=this.BPMN_GetExtensionElements(element);
        if(autoCreate&&!extensionElements){
            this.BPMN_CreateExtensionElements(element);
            extensionElements=this.BPMN_GetExtensionElements(element);
        }
        if(extensionElements){
            if(ary) {
                //debugger;
                var bo = element.businessObject;

                var receiveObjects = null;
                if (extensionElements.values) {
                    receiveObjects = ArrayUtility.WhereSingle(extensionElements.values, function (item) {
                        return item.$type == "jb4dc:Jb4dcMainReceiveObjects";
                    });
                }
                else{
                    extensionElements.values=[];
                }

                if(!receiveObjects){
                    receiveObjects=bo.$model.create('jb4dc:Jb4dcMainReceiveObjects');
                    extensionElements.values.push(receiveObjects);
                }
                receiveObjects.values=[];

                ary.forEach(function (item) {
                    var jb4dcAction = bo.$model.create('jb4dc:Jb4dcReceiveObject', PODefinition.RemoveExcludeProp(PODefinition.GetJB4DCReceiveObjectPO(),item));
                    receiveObjects.values.push(jb4dcAction);
                })
            }
        }
        else{
            var message="元素"+this.BPMN_Attr_GetId(element)+"不存在jb4dc:jb4dcMainReceiveObjects子元素!";
            BaseUtility.ThrowMessage(message);
        }
    }

    static JB4DC_GetCCReceiveObjectsArray(element){
        var extensionElements=this.BPMN_GetExtensionElements(element);
        if(extensionElements){
            if(extensionElements.values){
                var actions;
                actions = ArrayUtility.WhereSingle(extensionElements.values, function (item) {
                    return item.$type == "jb4dc:Jb4dcCCReceiveObjects";
                });
                if(actions&&actions.values){
                    return actions.values
                }
                return null;
            }
        }
        return null;
    }
    static JB4DC_SetCCReceiveObjectsArray(element,ary,autoCreate){
        var extensionElements=this.BPMN_GetExtensionElements(element);
        if(autoCreate&&!extensionElements){
            this.BPMN_CreateExtensionElements(element);
            extensionElements=this.BPMN_GetExtensionElements(element);
        }
        if(extensionElements){
            if(ary) {
                //debugger;
                var bo = element.businessObject;

                var receiveObjects = null;
                if (extensionElements.values) {
                    receiveObjects = ArrayUtility.WhereSingle(extensionElements.values, function (item) {
                        return item.$type == "jb4dc:Jb4dcCCReceiveObjects";
                    });
                }
                else{
                    extensionElements.values=[];
                }

                if(!receiveObjects){
                    receiveObjects=bo.$model.create('jb4dc:Jb4dcCCReceiveObjects');
                    extensionElements.values.push(receiveObjects);
                }
                receiveObjects.values=[];

                ary.forEach(function (item) {
                    var jb4dcAction = bo.$model.create('jb4dc:Jb4dcReceiveObject', PODefinition.RemoveExcludeProp(PODefinition.GetJB4DCReceiveObjectPO(),item));
                    receiveObjects.values.push(jb4dcAction);
                })
            }
        }
        else{
            var message="元素"+this.BPMN_Attr_GetId(element)+"不存在jb4dc:jb4dcCCReceiveObjects子元素!";
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