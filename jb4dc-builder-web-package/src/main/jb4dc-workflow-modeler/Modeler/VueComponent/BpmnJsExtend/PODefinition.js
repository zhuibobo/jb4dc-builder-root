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
    static GetDialogPropertiesPOCN(){
        return {
            bpmnCN:{
                idCN:"ID",
                nameCN:"名称",
                isExecutableCN:"能否执行",
                documentationCN:"文档",
                conditionExpressionCN:"执行条件"
            },
            camundaCN: {
                jobPriorityCN: "",
                candidateStarterGroupsCN: "",
                candidateStarterUsersCN: "",
                versionTagCN: "",
                historyTimeToLiveCN: "",
                taskPriorityCN: "",
                executionListenerCN: "执行监听",
                taskListenerCN: "任务监听",
                extensionPropertiesCN: "扩展属性",
                assigneeCN:"接收人",
                priorityCN:"",
                candidateUsersCN:"候选人",
                candidateGroupsCN:"候选人分组",
                dueDateCN:"",
                followUpDateCN:""
            },
            jb4dcCN:{
                jb4dcFlowCategoryCN:"流程类别",
                jb4dcCodeCN:"编号",
                jb4dcFormIdCN:"绑定窗体",
                jb4dcTenantIdCN:"租户",
                jb4dcProcessTitleEditTextCN:"标题设置",
                jb4dcProcessTitleEditValueCN:"",
                jb4dcProcessDescriptionEditTextCN:"备注设置",
                jb4dcProcessDescriptionEditValueCN:"",
                jb4dcActionsCN:"流程动作",
                jb4dcSequenceFlowConditionEditTextCN:"执行条件"
            }
        }
    }
    static TranslatePropertiesToCN(propGroupName,propName){
        return this.GetDialogPropertiesPOCN()[propGroupName+"CN"][propName+"CN"];
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