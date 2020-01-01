class PODefinition{
    static GetDialogPropertiesPO(){
        return {
            bpmn:{
                id:"",
                name:"",
                isExecutable:"true",
                documentation:"",
                conditionExpression:""
            },
            camunda: {
                jobPriority: "",
                candidateStarterGroups: "",
                candidateStarterUsers: "",
                versionTag: "",
                historyTimeToLive: "",
                taskPriority: "",
                executionListener: [],
                taskListener: [],
                extensionProperties: [],
                assignee:"",
                priority:"",
                candidateUsers:"",
                candidateGroups:"",
                dueDate:"",
                followUpDate:""
            },
            jb4dc:{
                jb4dcFlowCategory:"",
                jb4dcCode:"",
                jb4dcFormId:"",
                jb4dcTenantId:"",
                jb4dcProcessTitleEditText:"",
                jb4dcProcessTitleEditValue:"",
                jb4dcProcessDescriptionEditText:"",
                jb4dcProcessDescriptionEditValue:"",
                jb4dcActions:[],
                jb4dcSequenceFlowConditionEditText:""
            }
        }
    }
    static GetJB4DCActionPO(){
        return {
            actionType:"send",
            actionCode:"action_"+StringUtility.Timestamp(),
            actionCaption:"确认",
            actionShowOpinionDialog:"false",
            actionDescription:"",
            actionDisplayConditionEditText:"",
            actionDisplayConditionEditValue:"",
            actionCallJsMethod:"",
            actionHTMLId:"",
            actionHTMLClass:"",
            actionUpdateFields:[],
            actionCallApis:[]
        }
    }
    static RemoveExcludeProp(templatePO,actualPO){
        var result={};
        for(var key in templatePO){
            if(actualPO[key]){
                result[key]=actualPO[key];
            }
        }
        return result;
    }
}

export { PODefinition };