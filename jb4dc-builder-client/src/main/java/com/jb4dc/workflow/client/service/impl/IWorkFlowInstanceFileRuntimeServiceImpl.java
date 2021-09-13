package com.jb4dc.workflow.client.service.impl;
import java.util.Date;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.DateUtility;
import com.jb4dc.core.base.tools.FileUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.dbentities.FileRefEntity;
import com.jb4dc.files.po.SimpleFilePathPO;
import com.jb4dc.files.service.IFileInfoService;
import com.jb4dc.workflow.client.remote.FlowInstanceFileIntegratedRuntimeRemote;
import com.jb4dc.workflow.client.service.IWorkFlowInstanceFileRuntimeService;
import com.jb4dc.workflow.dbentities.InstanceFileEntity;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IWorkFlowInstanceFileRuntimeServiceImpl extends WorkFlowRuntimeServiceImpl implements IWorkFlowInstanceFileRuntimeService {

    @Autowired
    IFileInfoService fileInfoService;

    @Autowired
    FlowInstanceFileIntegratedRuntimeRemote flowInstanceFileIntegratedRuntimeRemote;

    @Override
    public InstanceFileEntity addInstanceFile(JB4DCSession jb4DCSession, String fileName, byte[] fileByte, String fileType, String instanceId, String businessKey) throws JBuild4DCGenerallyException, IOException, URISyntaxException {
        String fileId = UUIDUtility.getUUID();

        String extensionName = FilenameUtils.getExtension(fileName);
        if (StringUtility.isEmpty(extensionName)) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE, "扩展名不能为空!");
        }

        SimpleFilePathPO fileSaveInfo = fileInfoService.buildRelativeFileSavePath(fileId, extensionName);
        FileInfoEntity fileInfoEntity=fileInfoService.addFileToFileSystem(jb4DCSession,fileName,fileByte,businessKey,String.valueOf(System.currentTimeMillis()),fileType,"*");

        InstanceFileEntity instanceFileEntity = new InstanceFileEntity();
        instanceFileEntity.setFileId(fileInfoEntity.getFileId());
        instanceFileEntity.setFileInstId(instanceId);
        instanceFileEntity.setFileName(fileInfoEntity.getFileName());
        instanceFileEntity.setFileStorePath(fileInfoEntity.getFileStorePath());
        instanceFileEntity.setFileStoreName(fileInfoEntity.getFileStoreName());
        instanceFileEntity.setFileExtension(fileInfoEntity.getFileExtension());
        instanceFileEntity.setFileDescription("");
        instanceFileEntity.setFileCreateTime(new Date());
        instanceFileEntity.setFileCreator(jb4DCSession.getUserName());
        instanceFileEntity.setFileCreatorId(jb4DCSession.getUserId());
        instanceFileEntity.setFileOrganName(jb4DCSession.getOrganName());
        instanceFileEntity.setFileOrganId(jb4DCSession.getOrganId());
        instanceFileEntity.setFileOrderNum(fileInfoEntity.getFileOrderNum());
        instanceFileEntity.setFileStatus("新建");
        instanceFileEntity.setFileType(fileType);
        instanceFileEntity.setFileSize(fileInfoEntity.getFileSize());
        instanceFileEntity.setFilePreId("NotPreId");
        instanceFileEntity.setFileVersion("10000");
        instanceFileEntity.setFileVersionLast("是");

        JBuild4DCResponseVo jBuild4DCResponseVo=flowInstanceFileIntegratedRuntimeRemote.addInstanceFile(instanceFileEntity);
        if(!jBuild4DCResponseVo.isSuccess()){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_WORKFLOW_CODE,jBuild4DCResponseVo.getMessage());
        }

        return instanceFileEntity;
    }

    @Override
    public JBuild4DCResponseVo<List<InstanceFileEntity>> getAttachmentFileListData(JB4DCSession session, String instanceId) throws JBuild4DCGenerallyException {
        return flowInstanceFileIntegratedRuntimeRemote.getAttachmentFileListData(session.getUserId(),session.getOrganId(),instanceId);
    }

    /*private SimpleFilePathPO buildRelativeFileSavePath(String fileId, String extensionName) throws URISyntaxException, FileNotFoundException {
        Map<String, String> result = new HashMap<>();
        String fileRootPath=fileInfoService.getFileRootPath();
        String base_path = FileUtility.getRootPath() + File.separator + fileRootPath;

        if(fileRootPath.indexOf(":")>0){
            base_path=fileRootPath;
        }
        String file_name = fileId + "." + extensionName.replaceAll("/.", "");
        String relative_file_store_path = DateUtility.getDate_yyyy_MM() + File.separator + file_name;

        SimpleFilePathPO simpleFilePathPO=new SimpleFilePathPO();
        simpleFilePathPO.setFileStoreName(file_name);
        simpleFilePathPO.setFullFileStorePath(base_path + File.separator + relative_file_store_path);
        simpleFilePathPO.setRelativeFileStorePath(relative_file_store_path);
        *//*result.put(FULL_FILE_STORE_PATH, base_path + File.separator + relative_file_store_path);
        result.put(RELATIVE_FILE_STORE_PATH, relative_file_store_path);
        result.put(FILE_STORE_NAME, file_name);*//*
        return simpleFilePathPO;
    }*/
}
