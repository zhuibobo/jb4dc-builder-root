package com.jb4dc.devmock.provide;

import com.jb4dc.base.service.po.DictionaryPO;
import com.jb4dc.base.service.provide.IDictionaryProvide;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.sso.client.remote.DictionaryRemote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/27
 * To change this template use File | Settings | File Templates.
 */
@Service
public class DictionaryProvide implements IDictionaryProvide {

    @Autowired
    DictionaryRemote dictionaryRemote;

    @Override
    public List<DictionaryPO> getListDataByGroupValue(JB4DCSession session, String groupValue) {
        List<DictionaryPO> dictionaryPOList = dictionaryRemote.getEnableListDataByGroupId(groupValue).getData();
        return dictionaryPOList;
    }
}
