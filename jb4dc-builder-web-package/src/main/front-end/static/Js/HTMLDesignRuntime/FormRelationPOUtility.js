let FormRelationPOUtility={
    //配合FindFieldPOInRelationFormRecordComplexPoOneDataRecord方法使用,避免每次进行查询
    _FieldPOCache:null,
    BuildRecord:function(fieldPOArray,desc,recordId,outerFieldName,outerFieldValue){
        if(!recordId){
            throw "方法需要提供recordId参数!";
        }
        if(!outerFieldName){
            throw "方法需要提供outerFieldName参数!";
        }
        if(!outerFieldValue){
            throw "方法需要提供outerFieldValue参数!";
        }
        return {
            "recordId":recordId,
            "desc": desc,
            "recordFieldPOList": fieldPOArray,
            "outerFieldName": outerFieldName,
            "outerFieldValue": outerFieldValue
        };
    },
    FindRecordFieldPOArray:function(record){
        return record.recordFieldPOList;
    },
    Add1To1DataRecordFieldPOList:function (relationPO, fieldPOList,desc,recordId,outerFieldName,outerFieldValue) {
        relationPO.oneDataRecord=this.BuildRecord(fieldPOList,desc,recordId,outerFieldName,outerFieldValue);
        return relationPO;
    },
    Add1To1DataRecord:function (relationPO, recordPO) {
        relationPO.oneDataRecord=recordPO;
        return relationPO;
    },
    Get1To1DataRecord:function (relationPO) {
        return relationPO.oneDataRecord;
        //return relationPO.oneDataRecord.recordFieldPOList;
    },
    Get1To1DataRecordFieldPOArray:function (relationPO) {
        if(relationPO.oneDataRecord) {
            return this.FindRecordFieldPOArray(relationPO.oneDataRecord);
        }
        return null;
        //return relationPO.oneDataRecord.recordFieldPOList;
    },
    Add1ToNDataRecord:function (relationPO, arrayData) {
        relationPO.listDataRecord=arrayData;
        return relationPO;
    },
    Get1ToNDataRecord:function (relationPO) {
        return relationPO.listDataRecord;
    },
    FindFieldPOInOneDataRecord:function(oneDataRecord,fieldName){
        var fieldPOArray=this.FindRecordFieldPOArray(oneDataRecord);
        var fieldPO=ArrayUtility.WhereSingle(fieldPOArray,function (item) {
            return item.fieldName==fieldName;
        });
        if(fieldPO){
            return fieldPO;
        }
        throw "FormRuntime.FindFieldPOInOneDataRecord:找不到字段"+fieldName+"的数据值!";
    },
    FindFieldValueInOneDataRecord:function(oneDataRecord,fieldName) {
        var recordFieldPOList = this.FindRecordFieldPOArray(oneDataRecord);
        var fieldPO = ArrayUtility.WhereSingle(recordFieldPOList, function (item) {
            return item.fieldName == fieldName;
        });
        if (fieldPO) {
            return fieldPO.value;
        }
        throw "FormRuntime.FindFieldPOByRelationPO:找不到字段" + fieldName + "的数据值!";
    },
    FindIDFieldPOInOneDataRecord:function(oneDataRecord){
        return this.FindFieldPOInOneDataRecord(oneDataRecord,"ID");
    },
    FindFieldPOByRelationPO:function(relationPO,fieldName){
        var recordFieldPOList = FormRelationPOUtility.Get1To1DataRecordFieldPOArray(relationPO);
        var fieldPO=ArrayUtility.WhereSingle(recordFieldPOList,function (item) {
            return item.fieldName==fieldName;
        });
        if(fieldPO){
            return fieldPO;
        }
        throw "FormRuntime.FindFieldPOByRelationPO:找不到字段"+fieldName+"的数据值!";
    },
    FindIdFieldPOByRelationPO:function(relationPO){
        return this.FindFieldPOByRelationPO(relationPO,"ID");
    },
    FindMainRelationPO:function(relationPOList){
        return ArrayUtility.WhereSingle(relationPOList,function (item) {
            return item.isMain==true||item.parentId=="-1";
        });
    },
    FindNotMainRelationPO:function(relationPOList){
        return ArrayUtility.Where(relationPOList,function (item) {
            return item.isMain!=true||item.parentId!="-1";
        });
    },
    FindRelationPOById:function (relationPOList, id) {
        return ArrayUtility.WhereSingle(relationPOList,function (po) {
            return po.id==id;
        })
    },
    FindRelationPOByTableName:function (relationPOList, tableName) {
        return ArrayUtility.WhereSingle(relationPOList,function (po) {
            return po.tableName==tableName;
        });
    },
    FindRelationPOBySingleName:function (relationPOList, singleName) {
        return ArrayUtility.WhereSingle(relationPOList,function (po) {
            return po.singleName==singleName;
        })
    },
    FindFieldPOInRelationFormRecordComplexPoOneDataRecord:function (relationFormRecordComplexPo,relationId,tableName,fieldName) {
        //debugger;
        if (this._FieldPOCache == null) {
            this._FieldPOCache = {};
            var formRecordDataRelationPOList = relationFormRecordComplexPo.formRecordDataRelationPOList;
            for (var i = 0; i < formRecordDataRelationPOList.length; i++) {
                var formRecordDataRelationPO = formRecordDataRelationPOList[i];
                var innerRelationId = formRecordDataRelationPO.id;
                var fieldPOList = this.Get1To1DataRecordFieldPOArray(formRecordDataRelationPO);
                if(fieldPOList) {
                    //var fieldPOList=this.FindRecordFieldPOArray(oneDataRecord);
                    for (var j = 0; j < fieldPOList.length; j++) {
                        var fieldPO = fieldPOList[j];
                        var innerFieldName = fieldPO.fieldName;
                        this._FieldPOCache[innerRelationId + "_" + innerFieldName] = fieldPO;
                    }
                }
            }
        }

        return this._FieldPOCache[relationId + "_" + fieldName];
    },
    FindRelationPOInRelationFormRecordComplexPo:function (relationFormRecordComplexPo,relationId) {
        return ArrayUtility.WhereSingle(relationFormRecordComplexPo.formRecordDataRelationPOList,function (item) {
            return item.id==relationId;
        })
    },
    FindChildRelationPOList:function (relationPOList,parentRelationPO) {
        return ArrayUtility.Where(relationPOList,function (item) {
            return item.parentId=parentRelationPO.id;
        });
    },
    HasChildRelationPO:function (relationPOList,parentPOId) {
        return ArrayUtility.Exist(relationPOList,function (item) {
            return item.parentId==parentPOId;
        });
    },
    CreateFieldInOneDataRecord:function(recordFieldPOArray,fieldName,fieldValue) {
        //var recordFieldPOArray=this.FindRecordFieldPOArray(oneDataRecord)
        var fieldPO = JsonUtility.CloneSimple(recordFieldPOArray[0]);
        fieldPO.fieldName = fieldName;
        fieldPO.value = fieldValue;
        recordFieldPOArray.push(fieldPO);
    },
    CreateIdFieldInOneDataRecord:function(recordFieldPOArray,idValue){
        if(!idValue){
            idValue = StringUtility.Guid();
        }
        this.CreateFieldInOneDataRecord(recordFieldPOArray,"ID",idValue);
    }
}