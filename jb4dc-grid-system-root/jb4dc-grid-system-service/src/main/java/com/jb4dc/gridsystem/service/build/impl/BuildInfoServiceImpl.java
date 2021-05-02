package com.jb4dc.gridsystem.service.build.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.build.BuildInfoMapper;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.po.BuildInfoPO;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.dbentities.organ.OrganEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/15
 * To change this template use File | Settings | File Templates.
 */
@Service
public class BuildInfoServiceImpl extends BaseServiceImpl<BuildInfoEntity> implements IBuildInfoService
{
    BuildInfoMapper buildInfoMapper;
    public BuildInfoServiceImpl(BuildInfoMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        buildInfoMapper=_defaultBaseMapper;
    }

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    @Autowired
    ISQLBuilderService sqlBuilderService;

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, BuildInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<BuildInfoEntity>() {
            @Override
            public BuildInfoEntity run(JB4DCSession jb4DCSession,BuildInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setBuildInputDate(new Date());
                sourceEntity.setBuildInputUnitName(jb4DCSession.getOrganName());
                sourceEntity.setBuildInputUnitId(jb4DCSession.getOrganId());
                sourceEntity.setBuildInputUserName(jb4DCSession.getUserName());
                sourceEntity.setBuildInputUserId(jb4DCSession.getUserId());
                sourceEntity.setBuildOrderNum(buildInfoMapper.nextOrderNum()+5);

                if(sourceEntity.getBuildProperty()==null){
                    sourceEntity.setBuildProperty("");
                }
                return sourceEntity;
            }
        });
    }

    @Override
    public List<BuildInfoEntity> getMyBuild(JB4DCSession session, String userId, String organId, String includeGrid) {
        if(includeGrid.toLowerCase().equals("true")){
            return buildInfoMapper.selectByInputUnitId(organId);
        }
        else{
            return buildInfoMapper.selectByInputUserId(userId);
        }
    }

    @Override
    public List<BuildInfoEntity> getByBuildCode(String buildCode) {
        return buildInfoMapper.selectByBuildCode(buildCode);
    }

    @Override
    @Transactional(rollbackFor= {JBuild4DCGenerallyException.class, JBuild4DCSQLKeyWordException.class})
    public void codeAdd1(String buildId) throws JBuild4DCGenerallyException {
        try {
            BuildInfoEntity buildInfoEntity = buildInfoMapper.selectByPrimaryKey(buildId);
            String oldCode = buildInfoEntity.getBuildCode();
            String newCode = String.valueOf(Long.parseLong(buildInfoEntity.getBuildCode()) + 1);
            List<BuildInfoEntity> buildInfoEntities = getByBuildCode(newCode);
            if (buildInfoEntities.size() > 0) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, "已经存在+1编号的记录!");
            } else {
                buildInfoEntity.setBuildCode(newCode);
                buildInfoMapper.updateByPrimaryKeySelective(buildInfoEntity);
                //更新相关的房屋编号
                String sql = "update tgrid_house_info set HOUSE_CODE_FULL=concat('" + newCode + "',HOUSE_CODE) where HOUSE_BUILD_ID=#{buildId}";
                Map<String, String> paras = new HashMap<>();
                paras.put("buildId", buildId);
                sqlBuilderService.update(sql, paras);

                //更新相关的家庭编号
                sql = "update tgrid_family set FAMILY_HOUSE_CODE_FULL=replace(FAMILY_HOUSE_CODE_FULL,'" + oldCode + "','" + newCode + "') where FAMILY_HOUSE_ID in (select HOUSE_ID from tgrid_house_info where HOUSE_BUILD_ID=#{buildId})";
                paras = new HashMap<>();
                paras.put("buildId", buildId);
                sqlBuilderService.update(sql, paras);

                //更新相关的人口编号
                sql = "update tgrid_person set PERSON_HOUSE_CODE_FULL=replace(PERSON_HOUSE_CODE_FULL,'" + oldCode + "','" + newCode + "') where PERSON_HOUSE_ID in (select HOUSE_ID from tgrid_house_info where HOUSE_BUILD_ID=#{buildId})";
                paras = new HashMap<>();
                paras.put("buildId", buildId);
                sqlBuilderService.update(sql, paras);
            }
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,ex.getMessage());
        }
    }

    @Override
    public void codeSub1(String buildId) throws JBuild4DCGenerallyException {
        try {
            BuildInfoEntity buildInfoEntity = buildInfoMapper.selectByPrimaryKey(buildId);
            String oldCode = buildInfoEntity.getBuildCode();
            String newCode = String.valueOf(Long.parseLong(buildInfoEntity.getBuildCode()) - 1);
            List<BuildInfoEntity> buildInfoEntities = getByBuildCode(newCode);
            if (buildInfoEntities.size() > 0) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE, "已经存在-1编号的记录!");
            } else {
                buildInfoEntity.setBuildCode(newCode);
                buildInfoMapper.updateByPrimaryKeySelective(buildInfoEntity);
                //更新相关的房屋编号
                String sql = "update tgrid_house_info set HOUSE_CODE_FULL=concat('" + newCode + "',HOUSE_CODE) where HOUSE_BUILD_ID=#{buildId}";
                Map<String, String> paras = new HashMap<>();
                paras.put("buildId", buildId);
                sqlBuilderService.update(sql, paras);

                //更新相关的家庭编号
                sql = "update tgrid_family set FAMILY_HOUSE_CODE_FULL=replace(FAMILY_HOUSE_CODE_FULL,'" + oldCode + "','" + newCode + "') where FAMILY_HOUSE_ID in (select HOUSE_ID from tgrid_house_info where HOUSE_BUILD_ID=#{buildId})";
                paras = new HashMap<>();
                paras.put("buildId", buildId);
                sqlBuilderService.update(sql, paras);

                //更新相关的人口编号
                sql = "update tgrid_person set PERSON_HOUSE_CODE_FULL=replace(PERSON_HOUSE_CODE_FULL,'" + oldCode + "','" + newCode + "') where PERSON_HOUSE_ID in (select HOUSE_ID from tgrid_house_info where HOUSE_BUILD_ID=#{buildId})";
                paras = new HashMap<>();
                paras.put("buildId", buildId);
                sqlBuilderService.update(sql, paras);
            }
        }
        catch (Exception ex){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,ex.getMessage());
        }
    }

    @Override
    public boolean testCodeSingle(BuildInfoEntity buildInfoEntity) throws JBuild4DCGenerallyException {
        //判断编号是否唯一
        List<BuildInfoEntity> codeBuildInfoEntities=this.getByBuildCode(buildInfoEntity.getBuildCode());
        if(codeBuildInfoEntities.size()>1){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"建筑物编码不能重复!");
        }
        if(codeBuildInfoEntities.size()>0&&!codeBuildInfoEntities.get(0).getBuildId().equals(buildInfoEntity.getBuildId())){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"建筑物编码不能重复!");
        }
        return true;
    }

    @Override
    public BuildInfoPO saveBuildData(JB4DCSession session, BuildInfoPO buildInfoPO) throws JBuild4DCGenerallyException {
        OrganEntity organEntity=organRuntimeRemote.getOrganById(session.getOrganId()).getData();
        if (organEntity==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"找不到组织机构信息!");
        }
        if(!organEntity.getOrganTypeValue().equals("GridUnit")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"当前功能仅限于网格员使用!");
        }
        OrganEntity parentOrganEntity=organRuntimeRemote.getOrganById(organEntity.getOrganParentId()).getData();
        if (parentOrganEntity==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"找不到父组织机构信息!");
        }
        buildInfoPO.setBuildGridId(organEntity.getOrganId());
        buildInfoPO.setBuildCommunityId(organEntity.getOrganParentId());
        buildInfoPO.setBuildStreetId(parentOrganEntity.getOrganParentId());
        buildInfoPO.setBuildChildCount(0);
        buildInfoPO.setBuildIsVirtual(TrueFalseEnum.False.getDisplayName());
        buildInfoPO.setBuildParentId("0");
        buildInfoPO.setBuildParentIdList("0*"+buildInfoPO.getBuildId());
        buildInfoPO.setBuildRecordStatus(EnableTypeEnum.enable.getDisplayName());
        buildInfoPO.setBuildMapLocation("[]");

        if(buildInfoPO.getBuildCode().length()!=18){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_GRID_CODE,"建筑物编码必须为18位!");
        }

        this.testCodeSingle(buildInfoPO);

        this.saveSimple(session,buildInfoPO.getBuildId(),buildInfoPO);
        return buildInfoPO;
    }

    @Override
    public List<BuildInfoEntity> getBuildMapLocationByOrganId(JB4DCSession jb4DCSession, String organId, String buildCategory) {
        return buildInfoMapper.selectBuildMapLocationByOrganId(organId,buildCategory);
    }
}