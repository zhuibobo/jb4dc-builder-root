package com.jb4dc.workflow.exenum;

public class WorkFlowEnum {
    public static String Instance_Status_Name_End="End";
    public static String Instance_Status_Name_Running="Running";
    public static String Instance_Status_Name_Draft="Draft";
    public static String Instance_Status_Name_Suspended="Suspended";

    public static String ExTask_Type_Main="主送任务";
    public static String ExTask_Type_CC="抄送任务";

    public static String ExTask_Status_End="End";
    public static String ExTask_Status_CancelEnd="CancelEnd";
    public static String ExTask_Status_Processing="Processing";
    public static String ExTask_Status_Cancel="Cancel";

    public static String ExTask_Multi_Task_Single="Single";
    public static String ExTask_Multi_Task_Sequential="Sequential";
    public static String ExTask_Multi_Task_Parallel="Parallel";

    public static String ExTask_Handler_Type_Self="SELF";
    public static String ExTask_Handler_Type_Agency="AGENCY";

    public static String ExTask_Create_By_Initial="Initial-Create";
    public static String ExTask_Create_By_Send="Send-Create";
    public static String ExTask_Create_By_Cancel="Cancel-Create";
    public static String ExTask_Create_By_Jump="Jump-Create";
    public static String ExTask_Create_By_Restart="Restart-Create";

    public static String UserTask_Start_Node_Id="UserTask_Start_Node";
    public static String StartEvent_Node_Id="StartEvent_N1";

    public static String FlowCategoryName_AllProcess="AllProcess"; //全部流程
    public static String FlowCategoryName_GeneralProcess="GeneralProcess"; //通用流程
    public static String FlowCategoryName_DailyAffairsProcess="DailyAffairsProcess"; //日常事务流程
    public static String FlowCategoryName_ReceiveDocumentProcess="ReceiveDocumentProcess"; //公文收文流程
    public static String FlowCategoryName_SendDocumentProcess="SendDocumentProcess"; //公文发文流程
    public static String FlowCategoryName_AdministrativeApprovalProcess="AdministrativeApprovalProcess"; //行政审批流程
    public static String FlowCategoryName_AdministrativeLicensingProcess="AdministrativeLicensingProcess"; //行政许可流程
    public static String FlowCategoryName_CommunityServiceProcess="CommunityServiceProcess"; //社区服务流程
}
