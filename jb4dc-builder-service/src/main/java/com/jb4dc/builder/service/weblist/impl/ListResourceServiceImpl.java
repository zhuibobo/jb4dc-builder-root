package com.jb4dc.builder.service.weblist.impl;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.service.dataset.IDatasetService;
import com.jb4dc.builder.client.service.weblist.IWebListButtonService;
import com.jb4dc.builder.dao.weblist.ListResourceMapper;
import com.jb4dc.builder.dbentities.dataset.DatasetEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntityWithBLOBs;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntity;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.dbentities.weblist.ListResourceEntityWithBLOBs;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.builder.client.service.weblist.IListResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/18
 * To change this template use File | Settings | File Templates.
 */

@Service
public class ListResourceServiceImpl extends BaseServiceImpl<ListResourceEntityWithBLOBs> implements IListResourceService
{
    @Autowired
    IModuleService moduleService;

    ListResourceMapper listResourceMapper;

    @Autowired
    IHTMLRuntimeResolve htmlRuntimeResolve;

    @Autowired
    IWebListButtonService webListButtonService;

    /*@Autowired
    ;*/

    public ListResourceServiceImpl(ListResourceMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        listResourceMapper=_defaultBaseMapper;
        //moduleService=_moduleService;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, ListResourceEntityWithBLOBs record) throws JBuild4DCGenerallyException {
        //修改时设置为未解析的状态.
        //record.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
        //保存时进行同步的表单内容的解析,并存入对应的字段中.
        String resolvedHtml= null;
        try {
            resolvedHtml = htmlRuntimeResolve.resolveSourceHTMLAtSave(jb4DCSession,id,record.getListHtmlSource());
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        record.setListHtmlResolve(resolvedHtml);
        record.setListIsResolve(TrueFalseEnum.True.getDisplayName());

        return super.save(jb4DCSession,id, record, new IAddBefore<ListResourceEntityWithBLOBs>() {
            @Override
            public ListResourceEntityWithBLOBs run(JB4DCSession jb4DCSession,ListResourceEntityWithBLOBs sourceEntity) throws JBuild4DCGenerallyException {

                sourceEntity.setListCreateTime(new Date());
                sourceEntity.setListCreator(jb4DCSession.getUserName());
                sourceEntity.setListUpdateTime(new Date());
                sourceEntity.setListUpdater(jb4DCSession.getUserName());
                sourceEntity.setListOrderNum(listResourceMapper.nextOrderNum());
                sourceEntity.setListStatus(EnableTypeEnum.enable.getDisplayName());
                sourceEntity.setListOrganId(jb4DCSession.getOrganId());
                sourceEntity.setListOrganName(jb4DCSession.getOrganName());
                sourceEntity.setListCode(moduleService.buildModuleItemCode(sourceEntity.getListOrderNum()));
                if(StringUtility.isEmpty(sourceEntity.getListCode())){
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"Code不能为空!");
                }
                return sourceEntity;
            }
        });
    }

    /*@Override
    public ListResourcePO getFormPreviewHTMLContent(JB4DCSession session, String listId) throws JBuild4DCGenerallyException {
        return getListRuntimeHTMLContent(session,listId);
    }*/

    @Override
    public ListResourcePO getListRuntimeHTMLContent(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"1111111111111111111111111111111111111");
        ListResourceEntityWithBLOBs listResourceEntity=getByPrimaryKey(jb4DCSession,id);
        //String runtimeForm=htmlRuntimeResolve.dynamicBind(jb4DCSession,id,listResourceEntity.getListHtmlResolve(),null);
        return new ListResourcePO(listResourceEntity,"",listResourceEntity.getListJsContent());
    }

    @Override
    public List<ListResourceEntity> getByModuleId(JB4DCSession jb4DCSession, String moduleId) {
        return listResourceMapper.selectByModuleId(moduleId);
    }

    @Override
    public List<ListResourcePO> getListDataForModule(JB4DCSession jb4DSession, String listModuleId,IDatasetService datasetService) throws JBuild4DCGenerallyException, IOException {
        List<ListResourceEntity> moduleListEntities=getByModuleId(jb4DSession,listModuleId);
        List<ListResourcePO> resourcePOList= JsonUtility.parseEntityListToPOList(moduleListEntities,ListResourcePO.class);
        for (ListResourcePO listResourcePO : resourcePOList) {
            String mainDataSetId=listResourcePO.getListDatasetId();
            List<DataSetPO> dataSetPOList=new ArrayList<>();
            if(StringUtility.isNotEmpty(mainDataSetId)) {
                DataSetPO dataSetPO = DataSetPO.parseToPO(datasetService.getEntityByPrimaryKey(jb4DSession, mainDataSetId));
                List<String> useForDescList=datasetService.getDataSetUseForDescList(dataSetPO.getDsId());
                dataSetPO.setUserForDescList(useForDescList);
                dataSetPOList.add(dataSetPO);
            }
            listResourcePO.setDataSetPOList(dataSetPOList);
        }
        return resourcePOList;
    }

    @Override
    public void copyList(JB4DCSession session, String listId) throws JBuild4DCGenerallyException {
        ListResourceEntityWithBLOBs source=getByPrimaryKey(session,listId);
        List<ListButtonEntity> sourceListButtonList=webListButtonService.getByListId(session,source.getListId());

        ListResourceEntityWithBLOBs newList=source;
        newList.setListId(UUIDUtility.getUUID());
        newList.setListName(source.getListName()+"[复制]");
        saveSimple(session,newList.getListId(),newList);

        for (ListButtonEntity listButtonEntity : sourceListButtonList) {
            listButtonEntity.setButtonId(UUIDUtility.getUUID());
            listButtonEntity.setButtonListId(newList.getListId());
            webListButtonService.saveSimple(session,listButtonEntity.getButtonId(),listButtonEntity);
        }
    }
}
