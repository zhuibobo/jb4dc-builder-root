let FormRelationPOUtility={
    //配合FindFieldPOInRelationFormRecordComplexPoOneDataRecord方法使用,避免每次进行查询
    _FieldPOCache:null,
    BuildRecord:function(fieldPOArray,desc,recordId,outerFieldName,outerFieldValue,selfFieldName){
        if(desc==undefined||desc==null) {
            throw "方法需要提供desc参数!";
        }
        if(recordId==undefined||recordId==null) {
            throw "方法需要提供recordId参数!";
        }
        if(outerFieldName==undefined||outerFieldName==null){
            throw "方法需要提供outerFieldName参数!";
        }
        if(outerFieldValue==undefined||outerFieldValue==null){
            throw "方法需要提供outerFieldValue参数!";
        }
        if(selfFieldName==undefined||selfFieldName==null){
            throw "方法需要提供selfFieldName参数!";
        }
        return {
            "recordId":recordId,
            "desc": desc,
            "recordFieldPOList": fieldPOArray,
            "outerFieldName": outerFieldName,
            "outerFieldValue": outerFieldValue,
            "selfFieldName":selfFieldName
        };
    },
    FindRecordFieldPOArray:function(record){
        return record.recordFieldPOList;
    },
    Add1To1DataRecordFieldPOList:function (relationPO, fieldPOList,desc,recordId,outerFieldName,outerFieldValue,selfFieldName) {
        relationPO.oneDataRecord=this.BuildRecord(fieldPOList,desc,recordId,outerFieldName,outerFieldValue,selfFieldName);
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
        for (var i = 0; i < arrayData.length; i++) {
            if(arrayData[i].desc==undefined||arrayData[i].desc==null) {
                throw "arrayData中的数据对象需要包含desc属性!";
            }
            if(arrayData[i].recordId==undefined||arrayData[i].recordId==null) {
                throw "arrayData中的数据对象需要包含recordId属性!";
            }
            if(arrayData[i].recordFieldPOList==undefined||arrayData[i].recordFieldPOList==null) {
                throw "arrayData中的数据对象需要包含recordFieldPOList属性!";
            }
            if(arrayData[i].outerFieldName==undefined||arrayData[i].outerFieldName==null) {
                throw "arrayData中的数据对象需要包含outerFieldName属性!";
            }
            if(arrayData[i].outerFieldValue==undefined||arrayData[i].outerFieldValue==null) {
                throw "arrayData中的数据对象需要包含outerFieldValue属性!";
            }
            if(arrayData[i].selfFieldName==undefined||arrayData[i].selfFieldName==null) {
                throw "arrayData中的数据对象需要包含selfFieldName属性!";
            }
        }
        relationPO.listDataRecord=arrayData;
        return relationPO;
    },
    Get1ToNDataRecord:function (relationPO) {
        return relationPO.listDataRecord;
    },
    FindFieldPOInOneDataRecordEnableNull:function (oneDataRecord,fieldName){
        var fieldPOArray=this.FindRecordFieldPOArray(oneDataRecord);
        var fieldPO=ArrayUtility.WhereSingle(fieldPOArray,function (item) {
            return item.fieldName==fieldName;
        });
        if(fieldPO){
            return fieldPO;
        }
        return null;
    },
    FindFieldPOInOneDataRecord:function(oneDataRecord,fieldName){
        var fieldPO=this.FindFieldPOInOneDataRecordEnableNull(oneDataRecord,fieldName);
        if (!fieldPO){
            throw "FormRuntime.FindFieldPOInOneDataRecord:找不到字段"+fieldName+"的数据值!";
        }
        return fieldPO;
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
            return FormRelationPOUtility.IsMainRelationPO(item);
        });
    },
    IsMainRelationPO:function(relationPO){
        return relationPO.isMain==true||relationPO.parentId=="-1";
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
    /*FindRelationPOBySingleName:function (relationPOList, singleName) {
        return ArrayUtility.WhereSingle(relationPOList,function (po) {
            return po.singleName==singleName;
        })
    },*/
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
    FindParentFieldValueInFormDataRelationListWith1To1DataRecord:function(formDataRelationList,parentRelationPOId,outerFieldName,outerFieldValue){
        var parentRelationPO=ArrayUtility.WhereSingle(this._FormDataRelationList,function (item) {
            return item.id==relationPO.parentId;
        });
    },
    /*FindChildRelationPOList:function (relationPOList,parentRelationPO) {
        return ArrayUtility.Where(relationPOList,function (item) {
            return item.parentId=parentRelationPO.id;
        });
    },*/
    /*HasChildRelationPO:function (relationPOList,parentPOId) {
        return ArrayUtility.Exist(relationPOList,function (item) {
            return item.parentId==parentPOId;
        });
    },*/
    CreateFieldInRecordFieldPOArray:function(recordFieldPOArray, fieldName, fieldValue) {
        //var recordFieldPOArray=this.FindRecordFieldPOArray(oneDataRecord)
        var fieldPO = JsonUtility.CloneSimple(recordFieldPOArray[0]);
        fieldPO.fieldName = fieldName;
        fieldPO.value = fieldValue;
        recordFieldPOArray.push(fieldPO);
    },
    CreateIdFieldInRecordFieldPOArray:function(recordFieldPOArray, idValue,formPO,tableId){
        if(!idValue){
            idValue = StringUtility.Guid();
        }
        if(!tableId){
            throw "FormRelationPOUtility.CreateIdFieldInRecordFieldPOArray:tableId不能为空!";
        }
        //console.log(formPO);
        var pkFieldPO=ArrayUtility.WhereSingle(formPO.formRecordComplexPO.allDataRelationTableFieldsMap[tableId],function (item) {
            return item.fieldIsPk=="是";
        });
        var pkFieldName=pkFieldPO.fieldName;
        console.log(pkFieldName);
        this.CreateFieldInRecordFieldPOArray(recordFieldPOArray,pkFieldName,idValue);
        //return idValue;
    }
}