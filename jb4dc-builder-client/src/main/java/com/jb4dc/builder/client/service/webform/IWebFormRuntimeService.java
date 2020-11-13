package com.jb4dc.builder.client.service.webform;

import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.FormResourceComplexPO;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/22
 * To change this template use File | Settings | File Templates.
 */
public interface IWebFormRuntimeService {
    FormResourceComplexPO resolveFormResourceComplex(JB4DCSession session,String recordId, FormResourcePO data, ListButtonEntity listButtonEntity,String operationType,String formRuntimeCategory,
                                                     String isIndependenceCurrentOperationType,String loadTimeDesc) throws IOException, JBuild4DCGenerallyException, JBuild4DCSQLKeyWordException, XPathExpressionException, SAXException, ParserConfigurationException;
}
