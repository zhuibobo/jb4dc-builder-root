package com.jb4dc.builder.client.service.datastorage.impl;

import com.jb4dc.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jb4dc.builder.client.service.datastorage.IDataStorageRuntimeService;
import com.jb4dc.builder.client.service.datastorage.IFormDataRelationService;
import com.jb4dc.builder.po.FormDataRelationPO;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
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
    public Map getStorageDate(JB4DCSession session, String recordId, List<FormDataRelationPO> formDataRelationPOList) {
        Map result=new HashMap();

        FormDataRelationPO mainDataPO=formDataRelationService.getMainPO(formDataRelationPOList);

        String sql="select * from "+mainDataPO.getTableName()+" where ID=#{ID}";
        Map mainRecord=sqlBuilderMapper.selectOne(sql,recordId);

        result.put(MAIN_RECORD_KEY,mainRecord);
        return result;
    }
}
