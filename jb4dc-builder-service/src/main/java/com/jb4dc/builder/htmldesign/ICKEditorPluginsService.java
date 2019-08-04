package com.jb4dc.builder.htmldesign;

import com.jb4dc.builder.po.HtmlControlDefinitionVo;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */
public interface ICKEditorPluginsService {
    List<HtmlControlDefinitionVo> getWebFormControlVoList() throws JBuild4DCGenerallyException;

    List<HtmlControlDefinitionVo> getListControlVoList() throws JBuild4DCGenerallyException;

    List<HtmlControlDefinitionVo> getAllControlVoList() throws JBuild4DCGenerallyException;

    HtmlControlDefinitionVo getVo(String singleName) throws JBuild4DCGenerallyException;
}
