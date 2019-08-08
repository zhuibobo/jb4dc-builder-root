package com.jb4dc.builder.webpackage.rest.builder.list;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.po.FormResourcePO;
import com.jb4dc.builder.po.ListResourcePO;
import com.jb4dc.builder.service.weblist.IListResourceService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/Rest/Builder/ListRuntime")
public class ListRuntimeRest {
    @Autowired
    IListResourceService listResourceService;

    @RequestMapping("/ListPreview")
    public JBuild4DCResponseVo<ListResourcePO> getListPreviewHTMLContent(String listId) throws JBuild4DCGenerallyException {
        ListResourcePO listResourcePO=listResourceService.getFormPreviewHTMLContent(JB4DCSessionUtility.getSession(),listId);
        return JBuild4DCResponseVo.getDataSuccess(listResourcePO);
    }
}
