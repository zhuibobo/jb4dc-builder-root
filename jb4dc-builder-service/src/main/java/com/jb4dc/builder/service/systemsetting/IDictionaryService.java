package com.jb4dc.builder.service.systemsetting;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.builder.dbentities.systemsetting.DictionaryEntity;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface IDictionaryService  extends IBaseService<DictionaryEntity> {
    List<DictionaryEntity> getListDataByGroupId(JB4DCSession JB4DCSession, String groupId);

    void setSelected(JB4DCSession JB4DCSession, String recordId) throws JBuild4DCGenerallyException;

    List<DictionaryEntity> getListDataByGroupValue(JB4DCSession session, String groupValue);

    List<DictionaryEntity> getEnableListDataByGroupValue(JB4DCSession session, String groupValue);

    List<DictionaryEntity> getDictionaryByGroup3Level(String groupId);

    Map<String, Map<String, Object>> getAllDictionaryMinMapJsonProp();
}
