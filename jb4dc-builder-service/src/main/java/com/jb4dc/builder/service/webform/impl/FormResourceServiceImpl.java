package com.jb4dc.builder.service.webform.impl;

import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.builder.client.service.datastorage.ITableFieldService;
import com.jb4dc.builder.dao.webform.FormResourceMapper;
import com.jb4dc.builder.dbentities.datastorage.TableEntity;
import com.jb4dc.builder.dbentities.datastorage.TableFieldEntity;
import com.jb4dc.builder.dbentities.webform.FormResourceEntity;
import com.jb4dc.builder.client.htmldesign.IHTMLRuntimeResolve;
import com.jb4dc.builder.dbentities.webform.FormResourceEntityWithBLOBs;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.TableFieldPO;
import com.jb4dc.builder.po.TablePO;
import com.jb4dc.builder.service.datastorage.ITableService;
import com.jb4dc.builder.service.module.IModuleService;
import com.jb4dc.builder.client.service.webform.IFormResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
@Service
public class FormResourceServiceImpl extends BaseServiceImpl<FormResourceEntityWithBLOBs> implements IFormResourceService {

    FormResourceMapper formResourceMapper;

    @Autowired
    IModuleService moduleService;

    @Autowired
    ITableService tableService;

    @Autowired
    ITableFieldService tableFieldService;

    @Autowired
    IHTMLRuntimeResolve htmlRuntimeResolve;

    public FormResourceServiceImpl(FormResourceMapper _defaultBaseMapper) {
        super(_defaultBaseMapper);
        formResourceMapper = _defaultBaseMapper;
        //moduleService = _moduleService;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, FormResourceEntityWithBLOBs record) throws JBuild4DCGenerallyException {

        //修改时设置为未解析的状态.
        //record.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
        //保存时进行同步的表单内容的解析,并存入对应的字段中.
        String resolvedHtml= null;
        try {
            resolvedHtml = htmlRuntimeResolve.resolveSourceHTML(jb4DCSession,id,record.getFormHtmlSource());
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        record.setFormHtmlResolve(resolvedHtml);
        record.setFormIsResolve(TrueFalseEnum.True.getDisplayName());
        return super.save(jb4DCSession, id, record, new IAddBefore<FormResourceEntityWithBLOBs>() {
            @Override
            public FormResourceEntityWithBLOBs run(JB4DCSession jb4DCSession, FormResourceEntityWithBLOBs sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setFormOrderNum(formResourceMapper.nextOrderNum());
                sourceEntity.setFormCreator(jb4DCSession.getUserName());
                sourceEntity.setFormCreateTime(new Date());
                sourceEntity.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
                sourceEntity.setFormIsSystem(TrueFalseEnum.False.getDisplayName());
                sourceEntity.setFormIsTemplate(TrueFalseEnum.False.getDisplayName());
                sourceEntity.setFormOrganId(jb4DCSession.getOrganId());
                sourceEntity.setFormOrganName(jb4DCSession.getOrganName());
                sourceEntity.setFormUpdater(jb4DCSession.getUserName());
                sourceEntity.setFormUpdateTime(new Date());
                sourceEntity.setFormCode(moduleService.buildModuleItemCode(sourceEntity.getFormOrderNum()));
                return sourceEntity;
            }
        });
    }

    @Override
    public void moveUp(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        FormResourceEntityWithBLOBs selfEntity = formResourceMapper.selectByPrimaryKey(id);
        FormResourceEntityWithBLOBs ltEntity = formResourceMapper.selectGreaterThanRecord(id, selfEntity.getFormModuleId());
        switchOrder(ltEntity, selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        FormResourceEntityWithBLOBs selfEntity = formResourceMapper.selectByPrimaryKey(id);
        FormResourceEntityWithBLOBs ltEntity = formResourceMapper.selectLessThanRecord(id, selfEntity.getFormModuleId());
        switchOrder(ltEntity, selfEntity);
    }

    private void switchOrder(FormResourceEntityWithBLOBs toEntity, FormResourceEntityWithBLOBs selfEntity) {
        if (toEntity != null) {
            int newNum = toEntity.getFormOrderNum();
            toEntity.setFormOrderNum(selfEntity.getFormOrderNum());
            selfEntity.setFormOrderNum(newNum);
            formResourceMapper.updateByPrimaryKeySelective(toEntity);
            formResourceMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }

    @Override
    public FormResourcePO getFormPreviewHTMLContent(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        return getFormRuntimePageContent(jb4DCSession,id);
    }

    @Override
    public FormResourcePO getFormRuntimePageContent(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        FormResourceEntityWithBLOBs formResourceEntity=getByPrimaryKey(jb4DCSession,id);
        //String formHtmlRuntime=htmlRuntimeResolve.dynamicBind(jb4DCSession,id,formResourceEntity.getFormHtmlResolve());
        return new FormResourcePO(formResourceEntity,"");
    }

    @Override
    public List<FormResourceEntity> getByModuleId(JB4DCSession jb4DCSession, String moduleId) {
        return formResourceMapper.selectByModuleId(moduleId);
    }

    @Override
    public void tryLoadAboutTable(JB4DCSession jb4DCSession, List<FormResourcePO> formResourcePOList) throws IOException, JBuild4DCGenerallyException {
        if(formResourcePOList!=null){
            Map<String,TablePO> tablePOCacheMap=new HashMap<>();
            for (FormResourcePO formResourcePO : formResourcePOList) {
                String formDataRelation=formResourcePO.getFormDataRelation();
                List<TablePO> thisFormAboutTables=new ArrayList<>();

                List<HashMap> formDataRelationList= JsonUtility.toObjectList(formDataRelation, HashMap.class);
                for (HashMap hashMap : formDataRelationList) {
                    String tableId=hashMap.get("tableId").toString();
                    if(!tablePOCacheMap.containsKey(tableId)){
                        TableEntity tableEntity=tableService.getByPrimaryKey(jb4DCSession,tableId);
                        TablePO tablePO=JsonUtility.parseEntityToPO(tableEntity,TablePO.class);
                        if(hashMap.get("parentId").equals("-1")){
                            tablePO.setMain(true);
                        }
                        else{
                            tablePO.setMain(false);
                        }
                        List<TableFieldPO> tableFieldPOList=tableFieldService.getTableFieldsByTableId(tableId);
                        tablePO.setTableFieldPOList(tableFieldPOList);
                        tablePOCacheMap.put(tableId,tablePO);
                    }
                    thisFormAboutTables.add(tablePOCacheMap.get(tableId));
                }

                formResourcePO.setTablePOList(thisFormAboutTables);

                System.out.println(formDataRelationList);
            }
        }
    }

    @Override
    public void copyForm(JB4DCSession jb4DCSession, String formId) throws JBuild4DCGenerallyException {
        FormResourceEntityWithBLOBs source=getByPrimaryKey(jb4DCSession,formId);
        source.setFormId(UUIDUtility.getUUID());
        source.setFormName(source.getFormName()+"[复制]");
        saveSimple(jb4DCSession,source.getFormId(),source);
    }
}
