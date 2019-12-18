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
                jb4dcProcessTitle:"",
                jb4dcProcessDescription:""
            }
        }
    }
}

export { PODefinition };