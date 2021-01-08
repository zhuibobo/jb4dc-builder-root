package com.jb4dc.builder.client.proxy;

import com.jb4dc.builder.client.remote.DictionaryRuntimeRemote;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/25
 * To change this template use File | Settings | File Templates.
 */
public interface IDictionaryRuntimeProxy {
    List<DictionaryEntity> loadAllDD() throws IOException, JBuild4DCGenerallyException;

    List<DictionaryEntity> getDDByGroupId(String groupId) throws JBuild4DCGenerallyException, IOException;

    List<DictionaryEntity> getDictionaryByGroup3Level(String groupId) throws JBuild4DCGenerallyException, IOException;

    Map<String, Map<String,Object>> getAllDictionaryMinMapJsonPropRT() throws JBuild4DCGenerallyException, IOException;
}
