package com.jb4dc.gridsystem.api;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.builder.client.service.api.ApiRunPara;
import com.jb4dc.builder.client.service.api.ApiRunResult;
import com.jb4dc.builder.client.service.api.IApiForButton;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.po.SimpleFilePathPO;
import com.jb4dc.files.service.IFileInfoService;
import com.jb4dc.files.service.IFileRefService;
import com.jb4dc.gridsystem.dbentities.setting.AppVersionEntity;
import com.jb4dc.gridsystem.service.person.IFamilyService;
import com.jb4dc.gridsystem.service.setting.IAppVersionService;
import liquibase.pro.packaged.F;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

public class NewAppVersionSupplementFieldDataApi  implements IApiForButton {

    @Autowired
    IAppVersionService appVersionService;

    @Autowired
    IFileInfoService fileInfoService;

    @Override
    public ApiRunResult runApi(ApiRunPara apiRunPara) throws JBuild4DCGenerallyException {
        List<FileInfoEntity> fileInfoEntities=fileInfoService.getFileInfoListByObjectId(JB4DCSessionUtility.getSession(),apiRunPara.getRecordId());
        if(fileInfoEntities.size()==0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"请上传需要发布的APP");
        }
        if(fileInfoEntities.stream().filter(item->item.getFileExtension().toLowerCase().equals("apk")).count()>1){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"只能上传一个APP");
        }
        FileInfoEntity fileInfoEntity=fileInfoEntities.stream().filter(item->item.getFileExtension().toLowerCase().equals("apk")).findFirst().get();

        try {

            String sourcePath=fileInfoService.buildFilePath(fileInfoEntity);
            SimpleFilePathPO simpleFilePathPO=fileInfoService.buildSavePath("apk-public",apiRunPara.getRecordId(),fileInfoEntity.getFileName());
            File sourceFile = new File(sourcePath);
            File newFile=new File(simpleFilePathPO.getFullFileStorePath());
            FileUtils.copyFile(sourceFile,newFile);

            AppVersionEntity appVersionEntity=appVersionService.getByPrimaryKey(JB4DCSessionUtility.getSession(),apiRunPara.getRecordId());
            appVersionEntity.setAppVersionUploadDate(new Date());
            appVersionEntity.setAppVersionFilePath(simpleFilePathPO.getRelativeFileStorePath());

            String code=appVersionEntity.getAppVersionCode();

            if(!Pattern.matches("^\\d\\d.\\d.\\d", code)){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"版本号不符合规则!");
            }

            appVersionService.updateByKeySelective(JB4DCSessionUtility.getSession(),appVersionEntity);

            return ApiRunResult.successResult();

        } catch (FileNotFoundException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,e.getMessage());
        } catch (URISyntaxException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,e.getMessage());
        } catch (IOException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,e.getMessage());
        }
        //return null;
    }
}
