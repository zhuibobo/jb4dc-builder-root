package com.jb4dc.builder.htmldesign.impl;

import com.jb4dc.builder.htmldesign.ICKEditorPluginsService;
import com.jb4dc.builder.po.HtmlControlDefinitionVo;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
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
public class CKEditorPluginsServiceImpl implements ICKEditorPluginsService {

    //IJb4dCacheService jb4dCacheService;

    public CKEditorPluginsServiceImpl() {
        //this.jb4dCacheService = jb4dCacheService;
    }

    @Override
    public List<HtmlControlDefinitionVo> getWebFormControlVoList() throws JBuild4DCGenerallyException {
        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService(jb4dCacheService);
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformBuilderCacheName, jb4dCacheService.sysRunStatusIsDebug(), "getWebFormControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionVo>>() {
            @Override
            public List<HtmlControlDefinitionVo> BuildObj() throws JBuild4DCGenerallyException {
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
    public List<HtmlControlDefinitionVo> getListControlVoList() throws JBuild4DCGenerallyException {
        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService(jb4dCacheService);
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformBuilderCacheName, jb4dCacheService.sysRunStatusIsDebug(), "getListControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionVo>>() {
            @Override
            public List<HtmlControlDefinitionVo> BuildObj() throws JBuild4DCGenerallyException {
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
    public List<HtmlControlDefinitionVo> getAllControlVoList() throws JBuild4DCGenerallyException {
        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService(jb4dCacheService);
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformBuilderCacheName, jb4dCacheService.sysRunStatusIsDebug(), "getAllControlVoList", new IBuildGeneralObj<List<HtmlControlDefinitionVo>>() {
            @Override
            public List<HtmlControlDefinitionVo> BuildObj() throws JBuild4DCGenerallyException {
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
    public HtmlControlDefinitionVo getVo(String singleName) throws JBuild4DCGenerallyException {
        List<HtmlControlDefinitionVo> allControlVoList=getAllControlVoList();
        List<HtmlControlDefinitionVo> temp=allControlVoList.stream().filter(item->item.getSingleName().equals(singleName)).collect(Collectors.toList());
        return temp.get(0);
    }

    private List<HtmlControlDefinitionVo> parseNodeListToVoList(List<Node> nodeList) throws JBuild4DCGenerallyException {
        try {
            List<HtmlControlDefinitionVo> result = new ArrayList<>();
            for (Node node : nodeList) {
                result.add(HtmlControlDefinitionVo.parseWebFormControlNode(node));
            }
            return result;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }
    }
}
