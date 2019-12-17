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
                extensionProperties: []
            },
            jb4dc:{
                tenantId:""
            }
        }
    }
}

export { PODefinition };