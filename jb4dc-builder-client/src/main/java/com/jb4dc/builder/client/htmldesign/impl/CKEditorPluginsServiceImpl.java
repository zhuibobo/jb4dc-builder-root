package com.jb4dc.builder.client.htmldesign.impl;

import com.jb4dc.base.service.cache.IBuildGeneralObj;
import com.jb4dc.base.ymls.JBuild4DCYaml;

import com.jb4dc.builder.client.cache.BuilderCacheManager;
import com.jb4dc.builder.client.htmldesign.ICKEditorPluginsService;
import com.jb4dc.builder.po.HtmlControlDefinitionPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Node;

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

    //IJb4dCacheService jb4dCacheService;

    @Autowired
    BuilderCacheManager builderCacheManager;

    public CKEditorPluginsServiceImpl() {
        //this.jb4dCacheService = jb4dCacheService;
    }

    @Override
    public List<HtmlControlDefinitionPO> getWebFormControlVoList() throws JBuild4DCGenerallyException {
        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService();
        return builderCacheManager.autoGetFromCache(BuilderCacheManager.BUILDER_CACHE_NAME, JBuild4DCYaml.isDebug(), "getWebFormControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionPO>>() {
            @Override
            public List<HtmlControlDefinitionPO> BuildObj() throws JBuild4DCGenerallyException {
                try
                {
                    List<Node> nodeList=configService.getWebFormControlNodes();
                    return parseNodeListToVoList(nodeList);
                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
            }
        });
    }

    @Override
    public List<HtmlControlDefinitionPO> getListControlVoList() throws JBuild4DCGenerallyException {
        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService();
        return builderCacheManager.autoGetFromCache(BuilderCacheManager.BUILDER_CACHE_NAME, JBuild4DCYaml.isDebug(), "getListControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionPO>>() {
            @Override
            public List<HtmlControlDefinitionPO> BuildObj() throws JBuild4DCGenerallyException {
                try
                {
                    List<Node> nodeList=configService.getListControlNodes();
                    return parseNodeListToVoList(nodeList);
                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
            }
        });
    }

    @Override
    public List<HtmlControlDefinitionPO> getAllControlVoList() throws JBuild4DCGenerallyException {
        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService();
        return builderCacheManager.autoGetFromCache(BuilderCacheManager.BUILDER_CACHE_NAME, JBuild4DCYaml.isDebug(), "getAllControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionPO>>() {
            @Override
            public List<HtmlControlDefinitionPO> BuildObj() throws JBuild4DCGenerallyException {
                try
                {
                    List<Node> nodeList=configService.getALLControlNodes();
                    return parseNodeListToVoList(nodeList);
                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
                }
            }
        });
    }

    @Override
    public HtmlControlDefinitionPO getVo(String singleName) throws JBuild4DCGenerallyException {
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
