class PODefinition{
    static GetDialogPropertiesPO(){
        return {
            bpmn: {
                elem:null,
                id: "",
                name: "",
                isExecutable: "true",
                documentation: "",
                conditionExpression: "",
                multiInstanceLoopCharacteristics: {
                    loopCharacteristics: "false",
                    isSequential: "",
                    collection: "",
                    elementVariable: "",
                    completionCondition: ""
                },
                messages: [],
                signals:[],
                messageEventDefinition: {
                    id: "",
                    messageRef: "",
                    class:""
                },
                signalEventDefinition:{
                    id: "",
                    signalRef: ""
                },
                attachedToRef: "",
                cancelActivity: "",
                timerEventDefinition:{
                    type:"",
                    id:"",
                    value:""
                }
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
                followUpDate:"",
                class:"",
                type:"",
                topic:""
            },
            jb4dc: {
                jb4dcFlowCategory: "",
                jb4dcCode: "",
                jb4dcFormId: "",
                jb4dcFormEx1Id: "",
                jb4dcOuterFormUrl: "",
                jb4dcOuterFormEx1Url: "",
                jb4dcTenantId: "",
                jb4dcProcessTitleEditText: "",
                jb4dcProcessTitleEditValue: "",
                jb4dcProcessDescriptionEditText: "",
                jb4dcProcessDescriptionEditValue: "",
                jb4dcSequenceFlowConditionEditText: "",
                jb4dcProcessCandidateStarterGroups: [],
                jb4dcProcessCandidateStarterUsers: [],
                jb4dcCandidateUsersDesc: "",
                jb4dcCandidateGroupsDesc: "",
                jb4dcActions: {
                    opinionBindToField: "",
                    opinionBindToElemId: "",
                    actions: []
                },
                jb4dcMainReceiveObjects: [],
                jb4dcCCReceiveObjects: [],
                jb4dcProcessActionConfirm: "true",
                jb4dcProcessModelGroups: [],
                jb4dcProcessModelImageClass: "lab la-elementor",
                jb4dcProcessModelManagerGroups: [],
                jb4dcProcessModelManagerUsers: [],
                jb4dcProcessRestartEnable: "true",
                jb4dcProcessAnyJumpEnable: "true",
                jb4dcAuthorities: {
                    authoritiesUsed: "true",
                    authoritiesOnlySendBackCanEdit: "false",
                    authoritiesAllFieldAuthority: "",
                    authoritiesFileAuthority: "",
                    authoritiesDocumentAuthority: "",
                    authoritiesJsApi: "",
                    authoritiesJavaApi: "",
                    authoritiesDesc: "",
                    authorities: []
                },
                jb4dcUseContentDocument:"byProcessConfig",
                jb4dcContentDocumentPlugin:"uploadConvertToPDFPlugin",
                jb4dcContentDocumentRedHeadTemplate:"",
                jb4dcFormPlugin:"webFormPlugin",
                jb4dcFormParas:"",
                jb4dcFormEx1Plugin:"webFormPlugin",
                jb4dcFormEx1Paras:""
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
    static GetJB4DCActionExecuteVariablePO(){
        return {
            actionExecuteVariableType:"静态变量",
            actionExecuteVariableCode:"actionExecuteVariable_"+StringUtility.Timestamp(),
            actionExecuteVariableKey:"",
            actionExecuteVariableValue:"",
            actionExecuteVariableDesc:""
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
            actionRunSqls:[],
            actionUpdateFields:[],
            actionCallApis:[],
            actionExecuteVariables:[],
            actionConfirm:"false",
            actionValidate:"无",
            actionsOpinionBindToField:"",
            actionsOpinionBindToElemId:"",
            actionMainReceiveObjects:[],
            actionCCReceiveObjects:[],
            actionAutoSend:"false",
            actionSendMessageId:"",
            actionSendSignalId:"",
            actionCallComplete:"true"
        }
    }
    static GetJB4DCAuthorityPO(){
        return {
            authorityType:"",
            authorityTableName:"",
            authorityFieldName:"",
            authorityEditEnable:"",
            authorityViewEnable:"",
            authorityEmptyEditEnable:"",
            authorityDesc:""
        }
    }
    static GetJB4DCReceiveObjectPO(){
        return {
            receiveObjectCode:"receiveObject_"+StringUtility.Timestamp(),
            receiveObjectType:"",
            receiveObjectGroupName:"",
            receiveObjectValue:"",
            receiveObjectText:"",
            receiveObjectConfig:""
        }
    }
    static RemoveExcludeProp(templatePO,actualPO){
        var result={};
        for(var key in templatePO) {
            if (actualPO[key]) {
                result[key] = actualPO[key];
            }
        }
        return result;
    }
}

export { PODefinition };