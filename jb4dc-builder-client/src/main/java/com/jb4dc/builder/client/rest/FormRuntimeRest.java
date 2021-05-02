package com.jb4dc.builder.client.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.remote.WebFormRuntimeRemote;
import com.jb4dc.builder.client.remote.WebListButtonRuntimeRemote;
import com.jb4dc.builder.client.service.webform.IWebFormRuntimeService;
import com.jb4dc.builder.dbentities.weblist.ListButtonEntity;
import com.jb4dc.builder.po.FormResourceComplexPO;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.tools.BaseUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/9/21
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/FormRuntime")
public class FormRuntimeRest {

    //@Autowired
    //FormRuntimeRemote formRuntimeRemote;

    @Autowired
    WebFormRuntimeRemote webFormRuntimeRemote;

    @Autowired
    WebListButtonRuntimeRemote webListButtonRuntimeRemote;
    //@Autowired
    //ListButtonRuntimeRemote listButtonRuntimeRemote;

    @Autowired
    IWebFormRuntimeService webFormRuntimeService;

    //加载html同时会根据数据关系,加载数据
    @RequestMapping("/LoadHTML")
    public JBuild4DCResponseVo<FormResourceComplexPO> loadHTML(String formId, String recordId, String buttonId,String operationType,String formRuntimeCategory) throws JBuild4DCGenerallyException, IOException, JBuild4DCSQLKeyWordException, ParserConfigurationException, XPathExpressionException, SAXException {

        if(StringUtility.isEmpty(formId)){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "FormRuntimeRest.loadHTML:formId不能为空!");
        }
        String loadTimeDesc="";
        long startTime=System.currentTimeMillis();
        FormResourcePO formResourcePO = webFormRuntimeRemote.loadHTML(formId).getData();
        long endTime=System.currentTimeMillis(); //获取结束时间
        loadTimeDesc="从构建系统加载原始记录信息时间:"+(endTime-startTime)+"ms;";

        ListButtonEntity listButtonEntity = null;
        //String formRuntimeCategory=FormResourceComplexPO.FORM_RUNTIME_CATEGORY_LIST;
        String isIndependenceCurrentOperationType=operationType;

        if (formRuntimeCategory.toLowerCase().equals(FormResourceComplexPO.FORM_RUNTIME_CATEGORY_INDEPENDENCE.toLowerCase())) {
            if (StringUtility.isEmpty(formResourcePO.getFormOperationType())) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "独立运行的窗体必须设置OperationType");
            }
            if (formResourcePO.getFormOperationType().toLowerCase().equals("add")) {
                operationType = BaseUtility.getAddOperationName();
            } else {
                //判断是否进入编辑状态
            }
            //构建按钮
            listButtonEntity=new ListButtonEntity();
            listButtonEntity.setButtonId(UUIDUtility.getUUID());
            listButtonEntity.setButtonListId(FormResourceComplexPO.FORM_RUNTIME_CATEGORY_INDEPENDENCE);
            listButtonEntity.setButtonListElemId(FormResourceComplexPO.FORM_RUNTIME_CATEGORY_INDEPENDENCE);
            listButtonEntity.setButtonSingleName("");
            listButtonEntity.setButtonCaption(FormResourceComplexPO.FORM_RUNTIME_CATEGORY_INDEPENDENCE);
            listButtonEntity.setButtonContent("");
            listButtonEntity.setButtonAuth("");
            listButtonEntity.setButtonRtContentRenderer("");
            listButtonEntity.setButtonOuterId("");
            listButtonEntity.setButtonCustSingleName("");
            listButtonEntity.setButtonCustProp1("");
            listButtonEntity.setButtonCustProp2("");
            listButtonEntity.setButtonCustProp3("");
            listButtonEntity.setButtonCustProp4("");
            listButtonEntity.setButtonDesc("");
            listButtonEntity.setButtonInnerConfig(formResourcePO.getFormInnerButton());
            listButtonEntity.setButtonOperationType(operationType);
            formRuntimeCategory=FormResourceComplexPO.FORM_RUNTIME_CATEGORY_INDEPENDENCE;
            isIndependenceCurrentOperationType=operationType;

        } else {
            if (StringUtility.isNotEmpty(buttonId)) {
                listButtonEntity = webListButtonRuntimeRemote.getButtonPO(buttonId).getData();
            }
        }
        //JBuild4DCResponseVo<FormResourcePO> formResourcePOJBuild4DCResponseVo = formRuntimeRemote.loadHTML(formId);
        //if (!formResourcePOJBuild4DCResponseVo.isSuccess()) {
        //    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "获取远程窗体失败!" + formResourcePOJBuild4DCResponseVo.getMessage());
        //}

        //JBuild4DCResponseVo<ListButtonEntity> listButtonEntityJBuild4DCResponseVo = listButtonRuntimeRemote.getButtonPO(buttonId);
        //if (!listButtonEntityJBuild4DCResponseVo.isSuccess()) {
        //    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "获取远程按钮设置失败!" + listButtonEntityJBuild4DCResponseVo.getMessage());
        //}
        //startTime=System.currentTimeMillis();
        FormResourceComplexPO formResourceComplexPO = webFormRuntimeService.resolveFormResourceComplex(JB4DCSessionUtility.getSession(), recordId, formResourcePO, listButtonEntity, operationType,formRuntimeCategory,isIndependenceCurrentOperationType,loadTimeDesc);
        //endTime=System.currentTimeMillis(); //获取结束时间
        //loadTimeDesc=formResourceComplexPO.getLoadTimeDesc() + ";解析表单总耗时:"+(endTime-startTime)+"ms;";

        //formResourceComplexPO.setFormSource("");
        formResourceComplexPO.setFormHtmlSource("");
        formResourceComplexPO.setFormHtmlResolve("");
        //formResourceComplexPO.setLoadTimeDesc(loadTimeDesc);
        return JBuild4DCResponseVo.getDataSuccess(formResourceComplexPO);
    }

    //@RequestMapping("/")
}
