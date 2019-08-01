package com.jb4dc.builder.config;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import javax.xml.xpath.XPathExpressionException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public interface IDataSetColumnCaptionConfigService {
    String getCaption(String columnName) throws XPathExpressionException, JBuild4DCGenerallyException;
}
