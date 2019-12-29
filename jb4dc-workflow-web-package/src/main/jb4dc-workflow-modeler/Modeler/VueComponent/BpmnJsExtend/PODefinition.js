class PODefinition{
    static GetDialogPropertiesPO(){
        return {
            bpmn:{
                id:"",
                name:"",
                isExecutable:"true",
                documentation:""
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
                jb4dcActions:[]
            }
        }
    }
}

export { PODefinition };