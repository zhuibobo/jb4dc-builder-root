package com.jb4dc.gridsystem.service.build.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.gridsystem.dao.build.BuildInfoMapper;
import com.jb4dc.gridsystem.dbentities.build.BuildInfoEntity;
import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;
import com.jb4dc.gridsystem.service.build.IBuildInfoService;
import com.jb4dc.gridsystem.service.build.IHouseInfoService;
import com.jb4dc.gridsystem.service.person.IFamilyService;
import com.jb4dc.gridsystem.service.person.IPersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.beans.Transient;
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
    ISQLBuilderService sqlBuilderService;

    @Override
    public int saveSimple(JB4DCSession jb4DCSession, String id, BuildInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DCSession,id, record, new IAddBefore<BuildInfoEntity>() {
            @Override
            public BuildInfoEntity run(JB4DCSession jb4DCSession,BuildInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
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
}