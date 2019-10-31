package com.jb4dc.builder.client.service.datastorage.impl;

import com.jb4dc.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jb4dc.builder.client.service.datastorage.IDataStorageRuntimeService;
import com.jb4dc.builder.client.service.datastorage.IFormDataRelationService;
import com.jb4dc.builder.po.formdata.FormRecordDataRelationPO;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DataStorageRuntimeServiceImpl implements IDataStorageRuntimeService {
    @Autowired
    IFormDataRelationService formDataRelationService;

    ISQLBuilderMapper sqlBuilderMapper;

    public static String MAIN_RECORD_KEY="DataStorageMainRecord";

    @Autowired
    public DataStorageRuntimeServiceImpl(ISQLBuilderMapper sqlBuilderMapper) {
        this.sqlBuilderMapper = sqlBuilderMapper;
    }

    @Override
    public List<FormRecordDataRelationPO> getStorageDate(JB4DCSession session, String recordId, List<FormRecordDataRelationPO> formRecordDataRelationPOList) {
        //Map result=new HashMap();

        FormRecordDataRelationPO mainDataPO=formDataRelationService.getMainPO(formRecordDataRelationPOList);

        String sql="select * from "+mainDataPO.getTableName()+" where ID=#{ID}";
        Map mainRecord=sqlBuilderMapper.selectOne(sql,recordId);

        //mainDataPO.addDataRecord(mainRecord);

        for (FormRecordDataRelationPO formRecordDataRelationPO : formRecordDataRelationPOList) {
            if(formDataRelationService.isNotMain(formRecordDataRelationPO)){
                String selfKeyFieldName= formRecordDataRelationPO.getSelfKeyFieldName();
                String outerKeyFieldName= formRecordDataRelationPO.getOuterKeyFieldName();
            }
        }

        return formRecordDataRelationPOList;
    }
}
