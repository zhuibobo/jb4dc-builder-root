import {RemoteUtility} from '../../Remote/RemoteUtility';

class CodeMirrorUtility{
    static TryResolveCodeMirrorValueToMarkText(codeMirrorInstance,sourceTextAreaElem,resolveSourceObject) {
        //debugger;
        //console.log("1");
        var doc = codeMirrorInstance.getDoc();
        var editValue=doc.getValue();
        doc.setValue(editValue);
        //var reg = new RegExp("\\$\\{[TableField|EnvVar][^\\}]*\\}", "g");
        var reg = new RegExp("\\__\\$[__$BusinessData$.__$TableField$$|EnvVar][^\\}|^\\ ]*\\$", "g");
        var result = "";

        var itemTypeText;
        var itemTypeValue;
        var itemText;
        var itemValue;
        while ((result = reg.exec(editValue)) != null) {
            var valueItemFull = result.toString();

            /*if(valueItemFull.indexOf("==")>0){
                valueItemFull=valueItemFull.split("==")[0];
            }*/
            //debugger;
            itemTypeValue = valueItemFull.substring(3, valueItemFull.indexOf("$$"));
            itemValue = valueItemFull.substring(valueItemFull.indexOf("$$") + 2, valueItemFull.length - 1);

            var cursor = codeMirrorInstance.getSearchCursor(valueItemFull);
            cursor.findNext();
            while (cursor.atOccurrence) {
                /*console.log(cursor);
                cursor.findNext();
                console.log(cursor);
                cursor.findNext();
                console.log(cursor);*/

                switch (itemTypeValue) {
                    case "EnvVar": {
                        itemTypeText = "环境变量";
                        itemText = RemoteUtility.GetEnvVariableTextByEnvValue(itemValue);
                    }
                        break;
                    case "BusinessData$.__$TableField": {
                        //debugger;
                        itemTypeText = "业务数据.表字段";
                        var tempTableName = itemValue.split("$$")[0];
                        var tempTableId = itemValue.split("$$")[0];
                        var tempFieldName = itemValue.split("$$")[1];
                        var tempPO = RemoteUtility.GetTableFieldPOByTableId(tempTableId, tempFieldName);
                        itemText = tempPO.tableCaption + "." + tempPO.fieldCaption;
                    }
                        break;
                    case "FlowAction": {
                        console.log(itemTypeValue);
                        console.log(itemValue);

                        var taskId = itemValue.split("$$")[0];
                        var taskName = "";
                        var actionId = itemValue.split("$$")[1];
                        var actionName = "";

                        if (resolveSourceObject) {
                            for (var i = 0; i < resolveSourceObject.length; i++) {
                                var taskObj = resolveSourceObject[i];
                                if (taskObj.taskId == taskId) {
                                    taskName = taskObj.taskName;

                                    for (let j = 0; j < taskObj.actionArray.length; j++) {
                                        var actionObj = taskObj.actionArray[j];
                                        if (actionObj.actionCode == actionId) {
                                            actionName = actionObj.actionCaption;
                                        }
                                    }
                                }
                            }
                        }
                        itemTypeText = "流程动作";
                        itemText = taskName + "." + actionName;
                    }
                        break;
                    case "FlowVar":{
                        itemTypeText = "流程变量";
                        itemText = itemValue;
                    }
                    default:
                        break;
                }

                var htmlNode = document.createElement("span");
                //if(valueItemFull.indexOf("@[")>=0) {
                    htmlNode.innerText = itemTypeText + "." + itemText;
                //}
                //else{
                    //htmlNode.innerText = "${" + itemTypeText + "." + itemText + "}";
                //}
                htmlNode.className = "code-mirror-mark-text";
                doc.markText(cursor.from(), {line: cursor.to().line, ch: cursor.to().ch}, {
                    replacedWith: htmlNode
                });
                cursor.findNext();
            }
        }

        return {
            editText:$(sourceTextAreaElem).next().find(".CodeMirror-code").text(),
            editValue:doc.getValue()
        }
    }
}

class CodeMirrorUtility1{
    static TryResolveCodeMirrorValueToMarkText(codeMirrorInstance,sourceTextAreaElem,resolveSourceObject) {
        debugger;
        //console.log("1");
        var doc = codeMirrorInstance.getDoc();
        var editValue=doc.getValue();
        doc.setValue(editValue);
        //var reg = new RegExp("\\$\\{[TableField|EnvVar][^\\}]*\\}", "g");
        var reg = new RegExp("\\$\\{[TableField|EnvVar][^\\}]*\\}|@\\[[^\\}]*]", "g");
        var result = "";


        var itemTypeText;
        var itemTypeValue;
        var itemText;
        var itemValue;
        while ((result = reg.exec(editValue)) != null) {
            var valueItemFull = result.toString();

            if(valueItemFull.indexOf("==")>0){
                valueItemFull=valueItemFull.split("==")[0];
            }

            itemTypeValue = valueItemFull.substring(2, valueItemFull.indexOf("."));
            itemValue = valueItemFull.substring(valueItemFull.indexOf(".") + 1, valueItemFull.length - 1);


            var cursor = codeMirrorInstance.getSearchCursor(valueItemFull);
            cursor.findNext();
            while (cursor.atOccurrence) {
                /*console.log(cursor);
                cursor.findNext();
                console.log(cursor);
                cursor.findNext();
                console.log(cursor);*/

                switch (itemTypeValue) {
                    case "EnvVar": {
                        itemTypeText = "环境变量";
                        itemText = RemoteUtility.GetEnvVariableTextByEnvValue(itemValue);
                    }
                        break;
                    case "TableField": {
                        //debugger;
                        itemTypeText = "表字段";
                        var tempTableName = itemValue.split(".")[0];
                        var tempTableId = itemValue.split(".")[0];
                        var tempFieldName = itemValue.split(".")[1];
                        var tempPO = RemoteUtility.GetTableFieldPOByTableId(tempTableId, tempFieldName);
                        itemText = tempPO.tableCaption + "." + tempPO.fieldCaption;
                    }
                        break;
                    case "FlowAction":{
                        console.log(itemTypeValue);
                        console.log(itemValue);
                        var taskId=itemValue.split(".")[0];
                        var taskName="";
                        var actionId=itemValue.split(".")[1];
                        var actionName="";
                        for (var i = 0; i < resolveSourceObject.length; i++) {
                            var taskObj = resolveSourceObject[i];
                            if (taskObj.taskId == taskId) {
                                taskName = taskObj.taskName;

                                for (let j = 0; j < taskObj.actionArray.length; j++) {
                                    var actionObj=taskObj.actionArray[j];
                                    if(actionObj.actionCode==actionId){
                                        actionName=actionObj.actionCaption;
                                    }
                                }
                            }
                        }
                        itemTypeText = "流程动作";
                        itemText = taskName+"."+actionName;
                    }
                    case "FlowVar":{
                        itemTypeText = "流程变量";
                        itemText = itemValue;
                    }
                    default:
                        break;
                }

                var htmlNode = document.createElement("span");
                if(valueItemFull.indexOf("@[")>=0) {
                    htmlNode.innerText = "@[" + itemTypeText + "." + itemText + "]";
                }
                else{
                    htmlNode.innerText = "${" + itemTypeText + "." + itemText + "}";
                }
                htmlNode.className = "code-mirror-mark-text";
                doc.markText(cursor.from(), {line: cursor.to().line, ch: cursor.to().ch}, {
                    replacedWith: htmlNode
                });
                cursor.findNext();
            }
        }

        return {
            editText:$(sourceTextAreaElem).next().find(".CodeMirror-code").text(),
            editValue:doc.getValue()
        }
    }
}
export { CodeMirrorUtility };