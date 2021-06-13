package com.jb4dc.workflow.client.rest.client;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.po.SimpleFilePO;
import com.jb4dc.workflow.client.service.IWorkFlowInstanceFileRuntimeService;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/Client/InstanceFileRuntime")
public class InstanceFileRuntimeRest {

    @Autowired
    IWorkFlowInstanceFileRuntimeService workFlowInstanceFileRuntimeService;

    @RequestMapping(value = "/UploadFile")
    JBuild4DCResponseVo UploadFile(HttpServletRequest request, HttpServletResponse response, String fileType, String instanceId,String businessKey) throws IOException, JBuild4DCGenerallyException, URISyntaxException {

        SimpleFilePO simpleFilePO = getSingleFilePOFromRequest(request);

        InstanceFileEntity instanceFileEntity = workFlowInstanceFileRuntimeService.addInstanceFile(
                JB4DCSessionUtility.getSession(),
                simpleFilePO.getFileName(), simpleFilePO.getFileByte(),
                fileType, instanceId,businessKey);

        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/GetAttachmentFileListData")
    JBuild4DCResponseVo<List<InstanceFileEntity>> getAttachmentFileListData(HttpServletRequest request, HttpServletResponse response,String instanceId) throws IOException, JBuild4DCGenerallyException, URISyntaxException {

        return workFlowInstanceFileRuntimeService.getAttachmentFileListData(JB4DCSessionUtility.getSession(),instanceId);
    }

    private SimpleFilePO getSingleFilePOFromRequest(HttpServletRequest request) throws IOException, JBuild4DCGenerallyException {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession()
                .getServletContext());
        if (multipartResolver.isMultipart(request)) {
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            // 取得request中的所有文件名
            Iterator<String> iter = multiRequest.getFileNames();
            String upLoadFileName = null;
            byte[] fileByte = null;
            while (iter.hasNext()) {
                // 记录上传过程起始时的时间，用来计算上传时间
                // int pre = (int) System.currentTimeMillis();
                // 取得上传文件
                MultipartFile file = multiRequest.getFile(iter.next());
                if (file != null) {
                    // 取得当前上传文件的文件名称
                    upLoadFileName = file.getOriginalFilename();
                    // 如果名称不为“”,说明该文件存在，否则说明该文件不存在
                    if (upLoadFileName.trim() != "") {
                        // 获得图片的原始名称
                        upLoadFileName = file.getOriginalFilename();
                        fileByte=file.getBytes();
                    }
                }
            }
            SimpleFilePO result=new SimpleFilePO(upLoadFileName,fileByte);
            return result;
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE,"HttpServletRequest中不存在上传的文件!");
    }
}
