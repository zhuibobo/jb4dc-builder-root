package com.jb4dc.builder.config.impl;

import com.jb4dc.builder.config.IBuilderConfigService;
import com.jb4dc.core.base.tools.FileUtility;
import com.jb4dc.core.base.tools.XMLDocumentUtility;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */

@Service
public class BuilderConfigServiceImpl implements IBuilderConfigService {
    static String configResource="/config/builder/builder-config.xml";
    static Document xmlDocument=null;
    static String _tablePrefix=null;

    public BuilderConfigServiceImpl() throws ParserConfigurationException, SAXException, IOException, URISyntaxException {
        if(xmlDocument==null) {
            //InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(configResource);
            //xmlDocument = XMLUtility.parseForDoc(inputStream);
            loadDocument();
        }
    }

    private void loadDocument() throws ParserConfigurationException, SAXException, IOException, URISyntaxException {
        //InputStream inputStream = this.getClass().getResourceAsStream(configResource);
        InputStream is = FileUtility.getStreamByLevel(configResource);
        xmlDocument = XMLDocumentUtility.parseForDoc(is);
    }

    @Override
    public String getTablePrefix() throws XPathExpressionException {
        if(_tablePrefix==null){
            Node tablePrefixNode= XMLDocumentUtility.parseForNode(xmlDocument,"/Config/TableConfig/Default/TablePrefix");
            _tablePrefix= XMLDocumentUtility.getAttribute(tablePrefixNode,"Value");
        }
        return _tablePrefix;
    }

    @Override
    public boolean getResolveSQLEnable() throws IOException, SAXException, ParserConfigurationException, XPathExpressionException, URISyntaxException {
        //重新加载配置文件
        loadDocument();
        Node resolveSQLEnableNode= XMLDocumentUtility.parseForNode(xmlDocument,"/Config/DataSetConfig/ResolveSQLEnable");
        if(XMLDocumentUtility.getAttribute(resolveSQLEnableNode,"Value").toLowerCase().equals("true")){
            return true;
        }
        return false;
    }
}
