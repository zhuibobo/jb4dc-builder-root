let FormRelationPOUtility={
    //配合FindFieldPOInRelationFormRecordComplexPoOneDataRecord方法使用,避免每次进行查询
    _FieldPOCache:null,
    Add1To1DataRecord:function (relationPO, data) {
        relationPO.oneDataRecord=data;
        return relationPO;
    },
    Get1To1DataRecord:function (relationPO) {
        return relationPO.oneDataRecord;
    },
    Add1ToNDataRecord:function (relationPO, arrayData) {
        relationPO.listDataRecord=arrayData;
        return relationPO;
    },
    Get1ToNDataRecord:function (relationPO) {
        return relationPO.listDataRecord;
    },
    FindFieldPOInOneDataRecord:function(oneDataRecord,fieldName){
        var fieldPO=ArrayUtility.WhereSingle(oneDataRecord,function (item) {
            return item.fieldName==fieldName;
        });
        if(fieldPO){
            return fieldPO;
        }
        else{
            DialogUtility.AlertText("FormRuntime.FindFieldPOByRelationPO:找不到字段"+fieldName+"的数据值!");
        }
    },
    FindFieldValueInOneDataRecord:function(oneDataRecord,fieldName){
        var fieldPO=ArrayUtility.WhereSingle(oneDataRecord,function (item) {
            return item.fieldName==fieldName;
        });
        if(fieldPO){
            return fieldPO.value;
        }
        else{
            DialogUtility.AlertText("FormRuntime.FindFieldPOByRelationPO:找不到字段"+fieldName+"的数据值!");
        }
    },
    FindFieldPOInOneDataRecordByID:function(oneDataRecord){
        return this.FindFieldPOInOneDataRecord(oneDataRecord,"ID");
    },
    FindFieldPOByRelationPO:function(relationPO,fieldName){
        var oneDataRecord = FormRelationPOUtility.Get1To1DataRecord(relationPO);
        var fieldPO=ArrayUtility.WhereSingle(oneDataRecord,function (item) {
            return item.fieldName==fieldName;
        });
        if(fieldPO){
            return fieldPO;
        }
        else{
            DialogUtility.AlertText("FormRuntime.FindFieldPOByRelationPO:找不到字段"+fieldName+"的数据值!");
        }
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
        if (this._FieldPOCache == null) {
            this._FieldPOCache = {};
            var formRecordDataRelationPOList = relationFormRecordComplexPo.formRecordDataRelationPOList;
            for (var i = 0; i < formRecordDataRelationPOList.length; i++) {
                var formRecordDataRelationPO = formRecordDataRelationPOList[i];
                var innerRelationId = formRecordDataRelationPO.id;
                var oneDataRecord = this.Get1To1DataRecord(formRecordDataRelationPO);
                if(oneDataRecord) {
                    for (var j = 0; j < oneDataRecord.length; j++) {
                        var fieldPO = oneDataRecord[j];
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
    }
    /*ConnectRelationPOToDynamicContainerControl:function (relationPO,dynamicContainerControlInstance) {
        this._RelationPOWithDynamicContainerControl[relationPO.id]=dynamicContainerControlInstance;
    }*/
}