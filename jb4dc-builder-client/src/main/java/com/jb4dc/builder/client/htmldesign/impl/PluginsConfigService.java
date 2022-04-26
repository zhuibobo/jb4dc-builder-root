package com.jb4dc.builder.client.htmldesign.impl;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.po.ControlPluginsPO;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.core.base.tools.XMLDocumentUtility;
import org.springframework.stereotype.Service;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PluginsConfigService {
    String configResource= "/config/builder/htmldesign/ControlPlugins.json";

    ControlPluginsPO controlPluginsPO;

    public ControlPluginsPO getControlPluginsPO() throws XPathExpressionException, ParserConfigurationException, SAXException, IOException {
        InputStream inputStream = this.getClass().getResourceAsStream(configResource);
        String text = new BufferedReader(
                new InputStreamReader(inputStream, StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining());
        return JsonUtility.toObjectIgnoreProp(text,ControlPluginsPO.class);
    }

    public List<HtmlControlDefinitionPO> getALLHtmlControlDefinitionPO() throws XPathExpressionException, ParserConfigurationException, IOException, SAXException {
        ControlPluginsPO controlPluginsPO=getControlPluginsPO();
        List<HtmlControlDefinitionPO> allHtmlControlDefinitionPOList=new ArrayList<>();
        loopLoad(allHtmlControlDefinitionPOList,controlPluginsPO.getAppFormDesign().getControls(),"appFormDesign");
        loopLoad(allHtmlControlDefinitionPOList,controlPluginsPO.getAppListDesign().getControls(),"appListDesign");
        loopLoad(allHtmlControlDefinitionPOList,controlPluginsPO.getWebFormDesign().getControls(),"webFormDesign");
        loopLoad(allHtmlControlDefinitionPOList,controlPluginsPO.getWebListDesign().getControls(),"webListDesign");
        return allHtmlControlDefinitionPOList;
    }

    private void loopLoad(List<HtmlControlDefinitionPO> allHtmlControlDefinitionPOList,List<HtmlControlDefinitionPO> htmlControlDefinitionPOList,String designType){
        if(htmlControlDefinitionPOList!=null){
            for (HtmlControlDefinitionPO htmlControlDefinitionPO : htmlControlDefinitionPOList) {
                htmlControlDefinitionPO.setDesignType(designType);
                allHtmlControlDefinitionPOList.add(htmlControlDefinitionPO);
                if(htmlControlDefinitionPO.getChildren()!=null){
                    loopLoad(allHtmlControlDefinitionPOList,htmlControlDefinitionPO.getChildren(),designType);
                }
            }
        }
    }
}
