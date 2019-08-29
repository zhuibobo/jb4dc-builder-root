package com.jb4dc.builder.service.envvariable.impl;

import com.jb4dc.builder.client.service.IEnvVariableClientService;
import com.jb4dc.builder.extend.apivariable.IAPIVariableCreator;
import com.jb4dc.builder.po.EnvVariablePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.list.IListWhereCondition;
import com.jb4dc.core.base.list.ListUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.ClassUtility;
import com.jb4dc.core.base.tools.FileUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.XMLDocumentUtility;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/3
 * To change this template use File | Settings | File Templates.
 */

@Service
public class EnvVariableServiceImpl1 implements IEnvVariableClientService {

    static String configResource= "/config/envvariable/env-variable-config.xml";
    //IJb4dCacheService jb4dCacheService;

    public EnvVariableServiceImpl1() {
        //jb4dCacheService=_jb4dCacheService;
    }

    @Override
    public List<EnvVariablePO> getDateTimeVars() throws JBuild4DCGenerallyException {
        return ListUtility.Where(getVoListFromCache(), new IListWhereCondition<EnvVariablePO>() {
            @Override
            public boolean Condition(EnvVariablePO item) {
                return item.getType().equals("DateTime");
            }
        });
    }

    @Override
    public List<EnvVariablePO> getAPIVars() throws JBuild4DCGenerallyException {
        return ListUtility.Where(getVoListFromCache(), new IListWhereCondition<EnvVariablePO>() {
            @Override
            public boolean Condition(EnvVariablePO item) {
                return item.getType().equals("ApiVar");
            }
        });
    }

    @Override
    public String execEnvVarResult(JB4DCSession jb4DCSession, String value) throws XPathExpressionException, JBuild4DCGenerallyException, IOException, SAXException, ParserConfigurationException {
        List<EnvVariablePO> envVariableVoList=getVoListFromCache();
        EnvVariablePO envVariableVo=ListUtility.WhereSingle(envVariableVoList, new IListWhereCondition<EnvVariablePO>() {
            @Override
            public boolean Condition(EnvVariablePO item) {
                return item.getValue().equals(value);
            }
        });
        if(envVariableVo==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"找不到Value为"+value+"的变量节点!");
        }
        String className=envVariableVo.getClassName();
        if(StringUtility.isEmpty(className)){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"Value为"+value+"的变量节点中未设置对应的ClassName!");
        }
        IAPIVariableCreator varCreater=null;
        try {
            varCreater=(IAPIVariableCreator) ClassUtility.loadClass(className).newInstance();
        } catch (InstantiationException ex) {
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        } catch (IllegalAccessException ex) {
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }

        try {
            return varCreater.createVar(jb4DCSession,envVariableVo);
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }
    }

    @Override
    public String getValueByName(String name) throws XPathExpressionException, ParserConfigurationException, IOException, SAXException, JBuild4DCGenerallyException {
        List<EnvVariablePO> _allEnvVariableVoList=getVoListFromCache();
        EnvVariablePO vo=ListUtility.WhereSingle(_allEnvVariableVoList, new IListWhereCondition<EnvVariablePO>() {
            @Override
            public boolean Condition(EnvVariablePO item) {
                return item.getText().equals(name);
            }
        });
        if(vo==null){
            return "";
        }
        return vo.getValue();
    }

    private List<EnvVariablePO> getVoListFromCache() throws JBuild4DCGenerallyException {
        /*List<EnvVariableVo> allEnvVariableVoList=null;
        if(jb4dCacheService.sysRunStatusIsDebug()){
            allEnvVariableVoList=loadDocumentToVoList();
            return allEnvVariableVoList;
        }
        else{
            allEnvVariableVoList=JB4DCacheManager.getObject(JB4DCacheManager.jb4dPlatformBuilderCacheName,"EnvVariableVoList");
            if(allEnvVariableVoList==null){
                allEnvVariableVoList=loadDocumentToVoList();
                JB4DCacheManager.put(JB4DCacheManager.jb4dPlatformBuilderCacheName,"EnvVariableVoList",allEnvVariableVoList);
                return allEnvVariableVoList;
            }
            return allEnvVariableVoList;
        }*/
        return loadDocumentToVoList();
    }

    private List<EnvVariablePO> loadDocumentToVoList() throws JBuild4DCGenerallyException {
        try {
            Document xmlDocument = null;
            List<EnvVariablePO> allEnvVariableVoList = null;
            InputStream inputStream = FileUtility.getStreamByLevel(configResource);
            xmlDocument = XMLDocumentUtility.parseForDoc(inputStream);
            validateDocumentEnable(xmlDocument);
            allEnvVariableVoList = new ArrayList<>();
            /*List<Node> nodes = XMLUtility.parseForNodeList(xmlDocument, "//EnvVariable");
            for (Node node : nodes) {
                allEnvVariableVoList.add(EnvVariableVo.parseEnvVarNode(node, "", ""));
            }*/
            Node groupRootNode = XMLDocumentUtility.parseForNode(xmlDocument, "/Config/Type[@Value='DateTime']/Group");
            EnvVariablePO groupRootVo = EnvVariablePO.parseGroupNode(groupRootNode, "-1", "DateTime");
            allEnvVariableVoList.add(groupRootVo);
            loopLoadGroup(allEnvVariableVoList, groupRootNode, groupRootVo, "DateTime");

            groupRootNode = XMLDocumentUtility.parseForNode(xmlDocument, "/Config/Type[@Value='ApiVar']/Group");
            groupRootVo = EnvVariablePO.parseGroupNode(groupRootNode, "-1", "ApiVar");
            allEnvVariableVoList.add(groupRootVo);
            loopLoadGroup(allEnvVariableVoList, groupRootNode, groupRootVo, "ApiVar");

            return allEnvVariableVoList;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,ex.getMessage());
        }
    }

    private void loopLoadGroup(List<EnvVariablePO> result,Node parentGroupNode,EnvVariablePO parentGroupVo,String type){
        NodeList childNodes = parentGroupNode.getChildNodes();
        for(int i=0;i<childNodes.getLength();i++){
            if(childNodes.item(i).getNodeName().equals("Group")){
                EnvVariablePO groupVo=EnvVariablePO.parseGroupNode(childNodes.item(i),parentGroupVo.getId(), type);
                result.add(groupVo);
                loopLoadGroup(result,childNodes.item(i),groupVo, type);
            }
            else if(childNodes.item(i).getNodeName().equals("EnvVariable")){
                EnvVariablePO groupVo=EnvVariablePO.parseEnvVarNode(childNodes.item(i),parentGroupVo.getId(), type);
                result.add(groupVo);
            }
        }
    }

    private void validateDocumentEnable(Document xmlDocument) throws XPathExpressionException, JBuild4DCGenerallyException, ParserConfigurationException, SAXException, IOException {
        //Document xmlDocument=XMLUtility.parseForDoc(configResource);
        List<Node> nodes= XMLDocumentUtility.parseForNodeList(xmlDocument,"//EnvVariable");
        List<EnvVariablePO> voList=new ArrayList<>();
        for (Node node : nodes) {
            EnvVariablePO vo=EnvVariablePO.parseEnvVarNode(node,"-1","");
            if(vo.getValue().equals("")){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"存在Value为空的EnvVariable节点!");
            }
            if(ListUtility.Exist(voList, new IListWhereCondition<EnvVariablePO>() {
                @Override
                public boolean Condition(EnvVariablePO item) {
                    return item.getValue().equals(vo.getValue());
                }
            })){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"存在Value="+vo.getValue()+"的重复EnvVariable节点!");
            }
            if(ListUtility.Exist(voList, new IListWhereCondition<EnvVariablePO>() {
                @Override
                public boolean Condition(EnvVariablePO item) {
                    return item.getText().equals(vo.getText());
                }
            })){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"存在Text="+vo.getText()+"的重复EnvVariable节点!");
            }
            voList.add(vo);
        }
    }
}
