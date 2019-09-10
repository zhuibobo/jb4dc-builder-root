package com.jb4dc.builder.webpackage.rest.builder.envvariable;

import com.jb4dc.builder.client.service.IEnvVariableClientService;
import com.jb4dc.builder.po.EnvVariablePO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/Rest/Env/EnvVariable1")
public class EnvVariableRest1 {

    //@Autowired
    IEnvVariableClientService envVariableService;

    @RequestMapping(value = "/GetSelectData",method = RequestMethod.POST)
    public JBuild4DCResponseVo getSelectData() throws XPathExpressionException, ParserConfigurationException, JBuild4DCGenerallyException, SAXException, IOException {
        Map<String,List<EnvVariablePO>> resultData=new HashMap<>();
        List<EnvVariablePO> dateTimeVoList=envVariableService.getDateTimeVars();
        List<EnvVariablePO> apiVarVoList=envVariableService.getAPIVars();
        resultData.put("datetimeTreeData",dateTimeVoList);
        resultData.put("envVarTreeData",apiVarVoList);
        return JBuild4DCResponseVo.success("获取成功!",resultData);
    }
}
