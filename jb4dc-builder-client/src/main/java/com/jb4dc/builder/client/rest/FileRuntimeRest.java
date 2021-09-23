package com.jb4dc.builder.client.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCBaseException;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.tools.DateUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.po.SimpleFilePO;
import com.jb4dc.files.service.IFileInfoService;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URISyntaxException;
import java.util.Iterator;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/10/12
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Builder/RunTime/FileRuntime")
public class FileRuntimeRest {

    @Autowired
    IFileInfoService fileInfoService;

    @RequestMapping(value = "/UploadCKE4Image*")
    void uploadCKE4Image(HttpServletRequest request, HttpServletResponse response,String uploadType,String objId) throws IOException, JBuild4DCGenerallyException, URISyntaxException {

        SimpleFilePO simpleFilePO = getSingleFilePOFromRequest(request);
        FileInfoEntity fileInfoEntity = fileInfoService.addFileToFileSystem(
                JB4DCSessionUtility.getSession(),UUIDUtility.getUUID(),
                simpleFilePO.getFileName(), simpleFilePO.getFileByte(),simpleFilePO.getFileByte().length,
                objId, String.valueOf(System.currentTimeMillis()),
                "Builder-Runtime-CKE4-Image", "Image",true);

        String imageContextPath = request.getContextPath()+"/Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId?fileId="+fileInfoEntity.getFileId();
        response.setContentType("text/html;charset=UTF-8");
        //String callback = request.getParameter("CKEditorFuncNum");
        PrintWriter out = response.getWriter();

        out.println("{\n" +
                "\"uploaded\": 1," +
                "\"fileName\": \"img.png\"," +
                "\"url\": \"" +imageContextPath+"\""+
                "}");
        out.flush();
        out.close();
    }

    @RequestMapping(value = "/UploadFile")
    JBuild4DCResponseVo UploadFile(HttpServletRequest request, HttpServletResponse response,String objType,String objId,String categoryType) throws IOException, JBuild4DCGenerallyException, URISyntaxException {

        SimpleFilePO simpleFilePO = getSingleFilePOFromRequest(request);

        FileInfoEntity fileInfoEntity = fileInfoService.addFileToFileSystem(
                JB4DCSessionUtility.getSession(),UUIDUtility.getUUID(),
                simpleFilePO.getFileName(), simpleFilePO.getFileByte(), simpleFilePO.getFileByte().length,
                objId, String.valueOf(System.currentTimeMillis()),
                objType, categoryType,true);

        return JBuild4DCResponseVo.opSuccess();
        /*String imageContextPath = request.getContextPath()+"//Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId?fileId="+fileInfoEntity.getFileId();
        response.setContentType("text/html;charset=UTF-8");
        //String callback = request.getParameter("CKEditorFuncNum");
        PrintWriter out = response.getWriter();

        out.println("{\n" +
                "\"uploaded\": 1," +
                "\"fileName\": \"img.png\"," +
                "\"url\": \"" +imageContextPath+"\""+
                "}");
        out.flush();
        out.close();*/
    }

    @RequestMapping(value = "UploadBase64Image")
    JBuild4DCResponseVo uploadBase64Image(HttpServletRequest request, HttpServletResponse response,String base64Image,String objType,String objId,String categoryType,String fileName) throws IOException, JBuild4DCGenerallyException, URISyntaxException {
        try {
            BASE64Decoder decoder = new BASE64Decoder();
            byte[] byteData = decoder.decodeBuffer(base64Image);
            FileInfoEntity fileInfoEntity = fileInfoService.addFileToFileSystem(
                    JB4DCSessionUtility.getSession(),
                    UUIDUtility.getUUID(),fileName, byteData,byteData.length,
                    objId, String.valueOf(System.currentTimeMillis()),
                    objType, categoryType,true);
            return JBuild4DCResponseVo.opSuccess(fileInfoEntity);
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,ex.getMessage());
        }
    }

    @RequestMapping(value = "UploadVideo")
    JBuild4DCResponseVo uploadVideo(HttpServletRequest request, HttpServletResponse response,String objType,String objId,String categoryType) throws IOException, JBuild4DCGenerallyException, URISyntaxException {
        try {
            SimpleFilePO simpleFilePO = getSingleFilePOFromRequest(request);
            FileInfoEntity fileInfoEntity = fileInfoService.addFileToFileSystem(
                    JB4DCSessionUtility.getSession(),UUIDUtility.getUUID(),
                    simpleFilePO.getFileName(), simpleFilePO.getFileByte(),simpleFilePO.getFileByte().length,
                    objId, String.valueOf(System.currentTimeMillis()),
                    objType, categoryType,true);

            return JBuild4DCResponseVo.opSuccess();
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,ex.getMessage());
        }
    }

    @RequestMapping(value = "/GetFileListData")
    JBuild4DCResponseVo getFileListData(HttpServletRequest request, HttpServletResponse response,String objId,String categoryType) throws IOException, JBuild4DCGenerallyException {
        List<FileInfoEntity> fileInfoEntityList=fileInfoService.getFileInfoListByObjectId(JB4DCSessionUtility.getSession(),objId,categoryType);
        return JBuild4DCResponseVo.getDataSuccess(fileInfoEntityList);
    }

    @RequestMapping(value = "/GetImageFileListData")
    JBuild4DCResponseVo getImageFileListData(HttpServletRequest request, HttpServletResponse response,String objId,String categoryType) throws IOException, JBuild4DCGenerallyException {
        List<FileInfoEntity> fileInfoEntityList=fileInfoService.getImageFileInfoListByObjectId(JB4DCSessionUtility.getSession(),objId,categoryType);
        return JBuild4DCResponseVo.getDataSuccess(fileInfoEntityList);
    }

    @RequestMapping(value = "/GetVideoFileListData")
    JBuild4DCResponseVo getVideoFileListData(HttpServletRequest request, HttpServletResponse response,String objId,String categoryType) throws IOException, JBuild4DCGenerallyException {
        List<FileInfoEntity> fileInfoEntityList=fileInfoService.getVideoFileInfoListByObjectId(JB4DCSessionUtility.getSession(),objId,categoryType);
        return JBuild4DCResponseVo.getDataSuccess(fileInfoEntityList);
    }

    @RequestMapping(value = "/GetImageBase64String", method = RequestMethod.GET)
    public JBuild4DCResponseVo getImageBase64String(String fileId) throws JBuild4DCGenerallyException, IOException, URISyntaxException {
        byte[] bytes =fileInfoService.getContentInFileSystem(JB4DCSessionUtility.getSession(),fileId);
        BASE64Encoder encoder = new BASE64Encoder();
        String imageBase64String=encoder.encode(bytes);//返回Base64编码过的字节数组字符串
        return JBuild4DCResponseVo.getDataSuccess(imageBase64String);
    }

    @RequestMapping(value = "/DownLoadFileByFileId")
    void downLoadFile(HttpServletRequest request, HttpServletResponse response,String fileId) throws JBuild4DCGenerallyException {
        FileInfoEntity fileInfoEntity=fileInfoService.getByPrimaryKey(JB4DCSessionUtility.getSession(),fileId);
        response.setCharacterEncoding(request.getCharacterEncoding());
        response.setContentType("application/octet-stream");
        FileInputStream fis = null;
        try {
            String filePath=fileInfoService.buildFilePath(fileInfoEntity);
            File file = new File(filePath);
            fis = new FileInputStream(file);
            response.setHeader("Content-Disposition", "attachment; filename="+fileInfoEntity.getFileName());
            IOUtils.copy(fis,response.getOutputStream());
            response.flushBuffer();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
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

    @RequestMapping(value = "/DeleteFileByFileId")
    JBuild4DCResponseVo deleteFileByFileId(HttpServletRequest request, HttpServletResponse response,String fileId) throws IOException, JBuild4DCGenerallyException {
        fileInfoService.deleteByKey(JB4DCSessionUtility.getSession(),fileId);
        return JBuild4DCResponseVo.opSuccess();
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
