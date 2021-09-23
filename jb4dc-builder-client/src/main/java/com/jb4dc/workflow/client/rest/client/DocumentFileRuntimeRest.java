package com.jb4dc.workflow.client.rest.client;

import com.aspose.words.SaveFormat;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.po.SimpleFilePO;
import com.jb4dc.files.service.IFileInfoService;
import com.jb4dc.workflow.client.service.IWorkFlowInstanceFileRuntimeService;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aspose.words.Document;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequestMapping(value = "/Rest/Workflow/RunTime/Client/DocumentFileRuntime")
public class DocumentFileRuntimeRest extends InstanceFileRuntimeRest {

    @Autowired
    IWorkFlowInstanceFileRuntimeService workFlowInstanceFileRuntimeService;

    @Autowired
    IFileInfoService fileInfoService;

    @RequestMapping(value = "/UploadFileAndConvertToPDF")
    JBuild4DCResponseVo<InstanceFileEntity> uploadFileAndConvertToPDF(HttpServletRequest request, HttpServletResponse response, String instanceId, String businessKey) throws Exception {

        SimpleFilePO simpleFilePO = getSingleFilePOFromRequest(request);

        InstanceFileEntity instancePdfFileEntity= workFlowInstanceFileRuntimeService.uploadFileAndConvertToPDF(JB4DCSessionUtility.getSession(),simpleFilePO,instanceId,businessKey);
        /*Document wpd = new Document(simpleFilePO.getInputStream());
        wpd.save("D:\\文档资料\\"+ UUIDUtility.getUUID() +".pdf", SaveFormat.PDF);*/
        return JBuild4DCResponseVo.opSuccess(instancePdfFileEntity);
    }

    @RequestMapping(value = "/TryGetLastOnlineDocument")
    JBuild4DCResponseVo<InstanceFileEntity> tryGetLastOnlineDocument(String instanceId) throws Exception {
        InstanceFileEntity instancePdfFileEntity= workFlowInstanceFileRuntimeService.tryGetLastOnlineDocument(JB4DCSessionUtility.getSession(),instanceId);
        return JBuild4DCResponseVo.opSuccess(instancePdfFileEntity);
    }

    @RequestMapping(value = "/DownLoadPdfDocumentByFileId")
    void downLoadPdfDocumentByFileId(HttpServletRequest request, HttpServletResponse response,String fileId) throws JBuild4DCGenerallyException {
        InstanceFileEntity instanceFileEntity=workFlowInstanceFileRuntimeService.getInstanceFile(JB4DCSessionUtility.getSession(),fileId);
        response.setCharacterEncoding(request.getCharacterEncoding());
        response.setContentType("application/pdf");
        FileInputStream fis = null;
        try {
            String filePath=fileInfoService.buildFilePath(instanceFileEntity.getFileStorePath());
            File file = new File(filePath);
            fis = new FileInputStream(file);
            response.setHeader("Content-Disposition", "attachment; filename="+instanceFileEntity.getFileName());
            IOUtils.copy(fis,response.getOutputStream());
            response.flushBuffer();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
