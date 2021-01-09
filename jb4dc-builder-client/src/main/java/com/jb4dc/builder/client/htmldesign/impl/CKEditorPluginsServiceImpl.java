package com.jb4dc.builder.client.htmldesign.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;

import com.jb4dc.builder.client.cache.BuilderCacheManager;
import com.jb4dc.builder.client.cache.ClientBuilderCacheManager;
import com.jb4dc.builder.client.htmldesign.ICKEditorPluginsService;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */

@Service
public class CKEditorPluginsServiceImpl implements ICKEditorPluginsService {
    Logger logger= LoggerFactory.getLogger(this.getClass());
    //IJb4dCacheService jb4dCacheService;

    @Autowired
    ClientBuilderCacheManager clientBuilderCacheManager;

    public CKEditorPluginsServiceImpl() {
        //this.jb4dCacheService = jb4dCacheService;
    }

    public <T> List<T> autoGetFromCache(Class aClass,String classInnerSingleValue, IBuildGeneralObj<List<T>> builder,Class<T> valueType) throws JBuild4DCGenerallyException, IOException {
        String cacheKey = aClass.getCanonicalName() + classInnerSingleValue;
        if (clientBuilderCacheManager.exist(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME, cacheKey)) {
            logger.info("从缓存中获取数据" + cacheKey);
            String cacheValue = clientBuilderCacheManager.getString(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME, cacheKey);
            return JsonUtility.toObjectList(cacheValue, valueType);
        }

        logger.info("不从缓存中获取数据" + cacheKey);
        List<T> objList = builder.BuildObj();
        if (objList == null) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "不能将Null存入缓存,Key:" + cacheKey);
        }
        String json = JsonUtility.toObjectString(objList);
        clientBuilderCacheManager.put(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME, cacheKey, json);
        return objList;
    }

    @Override
    public List<HtmlControlDefinitionPO> getWebFormControlVoList() throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException {
        /*String cacheKey="getWebFormControlVoList";
        if(clientBuilderCacheManager.exist(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey)){
            List<HtmlControlDefinitionPO> htmlControlDefinitionPOList= JsonUtility.toObjectList(clientBuilderCacheManager.getString(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey),HtmlControlDefinitionPO.class);
            return htmlControlDefinitionPOList;
        }*/
        return autoGetFromCache(CKEditorPluginsServiceImpl.class, "getWebFormControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionPO>>() {
            @Override
            public List<HtmlControlDefinitionPO> BuildObj() throws JBuild4DCGenerallyException {
                CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService();
                List<Node> nodeList= null;
                try {
                    nodeList = configService.getWebFormControlNodes();
                } catch (Exception ex) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
                List<HtmlControlDefinitionPO> htmlControlDefinitionPOList=parseNodeListToVoList(nodeList);
                //clientBuilderCacheManager.put(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey,JsonUtility.toObjectString(htmlControlDefinitionPOList));
                return htmlControlDefinitionPOList;
            }
        },HtmlControlDefinitionPO.class);

        /*return builderCacheManager.autoGetFromCache(BuilderCacheManager.BUILDER_CACHE_NAME, JBuild4DCYaml.isDebug(), "getWebFormControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionPO>>() {
            @Override
            public List<HtmlControlDefinitionPO> BuildObj() throws JBuild4DCGenerallyException {
                try
                {

                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
            }
        });*/
    }

    @Override
    public List<HtmlControlDefinitionPO> getListControlVoList() throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException {
        /*String cacheKey="getListControlVoList";
        if(clientBuilderCacheManager.exist(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey)){
            List<HtmlControlDefinitionPO> htmlControlDefinitionPOList= JsonUtility.toObjectList(clientBuilderCacheManager.getString(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey),HtmlControlDefinitionPO.class);
            return htmlControlDefinitionPOList;
        }

        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService();
        List<Node> nodeList=configService.getListControlNodes();
        List<HtmlControlDefinitionPO> htmlControlDefinitionPOList=parseNodeListToVoList(nodeList);
        clientBuilderCacheManager.put(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey,JsonUtility.toObjectString(htmlControlDefinitionPOList));
        return htmlControlDefinitionPOList;*/

        return autoGetFromCache(CKEditorPluginsServiceImpl.class, "getListControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionPO>>() {
            @Override
            public List<HtmlControlDefinitionPO> BuildObj() throws JBuild4DCGenerallyException {
                CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService();
                List<Node> nodeList= null;
                try {
                    nodeList = configService.getListControlNodes();
                } catch (Exception ex) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
                List<HtmlControlDefinitionPO> htmlControlDefinitionPOList=parseNodeListToVoList(nodeList);
                //clientBuilderCacheManager.put(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey,JsonUtility.toObjectString(htmlControlDefinitionPOList));
                return htmlControlDefinitionPOList;
            }
        },HtmlControlDefinitionPO.class);
        /*return builderCacheManager.autoGetFromCache(BuilderCacheManager.BUILDER_CACHE_NAME, JBuild4DCYaml.isDebug(), "getListControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionPO>>() {
            @Override
            public List<HtmlControlDefinitionPO> BuildObj() throws JBuild4DCGenerallyException {
                try
                {

                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
            }
        });*/
    }

    @Override
    public List<HtmlControlDefinitionPO> getAllControlVoList() throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException {
        /*String cacheKey="getAllControlVoList";
        if(clientBuilderCacheManager.exist(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey)){
            List<HtmlControlDefinitionPO> htmlControlDefinitionPOList= JsonUtility.toObjectList(clientBuilderCacheManager.getString(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey),HtmlControlDefinitionPO.class);
            return htmlControlDefinitionPOList;
        }

        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService();
        List<Node> nodeList=configService.getALLControlNodes();
        List<HtmlControlDefinitionPO> htmlControlDefinitionPOList=parseNodeListToVoList(nodeList);

        clientBuilderCacheManager.put(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey,JsonUtility.toObjectString(htmlControlDefinitionPOList));
        return htmlControlDefinitionPOList;*/
        return autoGetFromCache(CKEditorPluginsServiceImpl.class, "getAllControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionPO>>() {
            @Override
            public List<HtmlControlDefinitionPO> BuildObj() throws JBuild4DCGenerallyException {
                CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService();
                List<Node> nodeList= null;
                try {
                    nodeList = configService.getALLControlNodes();
                } catch (Exception ex) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
                List<HtmlControlDefinitionPO> htmlControlDefinitionPOList=parseNodeListToVoList(nodeList);
                //clientBuilderCacheManager.put(ClientBuilderCacheManager.HTML_CONTROL_PLUGIN_BUILDER_CACHE_NAME,cacheKey,JsonUtility.toObjectString(htmlControlDefinitionPOList));
                return htmlControlDefinitionPOList;
            }
        },HtmlControlDefinitionPO.class);
        /*return builderCacheManager.autoGetFromCache(BuilderCacheManager.BUILDER_CACHE_NAME,, JBuild4DCYaml.isDebug(), "getAllControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionPO>>() {
            @Override
            public List<HtmlControlDefinitionPO> BuildObj() throws JBuild4DCGenerallyException {
                try
                {

                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
            }
        });*/
    }

    @Override
    public HtmlControlDefinitionPO getVo(String singleName) throws JBuild4DCGenerallyException, ParserConfigurationException, SAXException, XPathExpressionException, IOException {
        List<HtmlControlDefinitionPO> allControlVoList=getAllControlVoList();
        List<HtmlControlDefinitionPO> temp=allControlVoList.stream().filter(item->item.getSingleName().equals(singleName)).collect(Collectors.toList());
        return temp.get(0);
    }

    private List<HtmlControlDefinitionPO> parseNodeListToVoList(List<Node> nodeList) throws JBuild4DCGenerallyException {
        try {
            List<HtmlControlDefinitionPO> result = new ArrayList<>();
            for (Node node : nodeList) {
                result.add(HtmlControlDefinitionPO.parseWebFormControlNode(node));
            }
            return result;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }
    }
}
