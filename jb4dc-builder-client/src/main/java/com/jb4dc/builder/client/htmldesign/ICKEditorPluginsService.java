package com.jb4dc.builder.client.htmldesign;

import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */
public interface ICKEditorPluginsService {
    List<HtmlControlDefinitionPO> getWebFormControlVoList() throws JBuild4DCGenerallyException;

    List<HtmlControlDefinitionPO> getListControlVoList() throws JBuild4DCGenerallyException;

    List<HtmlControlDefinitionPO> getAllControlVoList() throws JBuild4DCGenerallyException;

    HtmlControlDefinitionPO getVo(String singleName) throws JBuild4DCGenerallyException;
}
