var FlowRuntimeVarBuilder={
    BuilderSelectedReceiverToInstanceVar:function (nextFlowNodeEntities,selectedReceiverData){
        var resultData=[];

        for (let i = 0; i < selectedReceiverData.length; i++) {
            var receiver = selectedReceiverData[i];
            resultData.push({
                nodeId:receiver.flowNodeEntity.id,
                receiverId:receiver.id,
                receiverName:receiver.name,
                receiverTypeName:receiver.typeName,
                receiveType:receiver.receiveType
            })
        }

        return resultData;
        /*var resultData=[];

        for (let i = 0; i < nextTaskEntityList.length; i++) {
            var taskEntity=nextTaskEntityList[i];
            var receivers = ArrayUtility.Where(selectedReceiverData, item => {
                return item.taskEntity.id == taskEntity.id && item.receiveType == "main"
            });

            if(taskEntity.multiInstanceTask){
                var assigneeCollection=taskEntity.multiInstanceLoopCharacteristics.collection;

                var valueArray=[];
                for (let j = 0; j < receivers.length; j++) {
                    valueArray.push(receivers[j].id);
                }
                resultData.push({
                    key:assigneeCollection,
                    value:JsonUtility.JsonToString(valueArray)
                })
            }
            else {
                var assignee = taskEntity.assignee;
                resultData.push({
                    key:assignee,
                    value:receivers[0].id
                })
            }
        }
        return resultData;*/
    }
}