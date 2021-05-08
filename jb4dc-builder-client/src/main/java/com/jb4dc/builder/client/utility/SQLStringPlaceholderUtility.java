package com.jb4dc.builder.client.utility;

import com.jb4dc.builder.po.SQLStringPlaceholderResultPO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.sso.client.remote.OrganRuntimeRemote;
import com.jb4dc.sso.client.remote.RoleRuntimeRemote;
import com.jb4dc.sso.dbentities.role.RoleEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SQLStringPlaceholderUtility {

    @Autowired
    OrganRuntimeRemote organRuntimeRemote;

    @Autowired
    RoleRuntimeRemote roleRuntimeRemote;

    public SQLStringPlaceholderResultPO generalPlaceholderHandler(JB4DCSession jb4DCSession, String sourceSQL) throws JBuild4DCGenerallyException {
        SQLStringPlaceholderResultPO resultPO=new SQLStringPlaceholderResultPO();
        Map<String,Object> sqlParas=new HashMap<>();
        String resultSql=ChildOrganIdPlaceholderHandler(jb4DCSession.getOrganId(),sourceSQL,sqlParas);
        resultSql=ChildOrganIdAndRolePlaceholderHandler(jb4DCSession.getUserId(),jb4DCSession.getOrganId(),resultSql,sqlParas);
        resultPO.setSql(resultSql);
        resultPO.setSqlParas(sqlParas);
        return resultPO;
    }

    public SQLStringPlaceholderResultPO generalPlaceholderHandler(String userId,String organId, String sourceSQL) throws JBuild4DCGenerallyException {
        SQLStringPlaceholderResultPO resultPO=new SQLStringPlaceholderResultPO();
        Map<String,Object> sqlParas=new HashMap<>();
        String resultSql=ChildOrganIdPlaceholderHandler(organId,sourceSQL,sqlParas);
        resultSql=ChildOrganIdAndRolePlaceholderHandler(userId,organId,resultSql,sqlParas);
        resultPO.setSql(resultSql);
        resultPO.setSqlParas(sqlParas);
        return resultPO;
    }

    private String ChildOrganIdPlaceholderHandler(String organId,String sourceSQL,Map<String,Object> sqlParas) throws JBuild4DCGenerallyException {
        //sourceSQL.replaceAll("",)
        if(sourceSQL.indexOf("ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}")>0) {
            JBuild4DCResponseVo<List<String>> jBuild4DCResponseVo = organRuntimeRemote.getAllChildOrganIdIncludeSelfRT(organId);
            List<String> allChildOrganIdList = jBuild4DCResponseVo.getData();
            String replaceSqlWord = "";
            for (int i = 0; i < allChildOrganIdList.size(); i++) {
                String key = "sspocid" + i + "";
                replaceSqlWord += "#{" + key + "},";
                sqlParas.put(key, allChildOrganIdList.get(i));
            }
            replaceSqlWord = StringUtility.removeLastChar(replaceSqlWord);
            return sourceSQL.replaceAll("'#\\{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF}'", replaceSqlWord);
        }
        return sourceSQL;
    }

    private String ChildOrganIdAndRolePlaceholderHandler(String userId,String organId,String sourceSQL,Map<String,Object> sqlParas) throws JBuild4DCGenerallyException {
        //sourceSQL.replaceAll("",)
        if(sourceSQL.indexOf("ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF_AND_ROLE}")>0) {
            JBuild4DCResponseVo<List<RoleEntity>> jBuild4DCResponseVoRoleEntity = roleRuntimeRemote.getUserRolesRT(userId);
            if(jBuild4DCResponseVoRoleEntity.getData()!=null&&jBuild4DCResponseVoRoleEntity.getData().size()>0){
                List<RoleEntity> roleList= jBuild4DCResponseVoRoleEntity.getData();
                if(roleList.stream().anyMatch(roleEntity -> roleEntity.getRoleId().equals("DataFilter-With-DataSet-AllData"))){
                    return sourceSQL.replaceAll("IN \\('#\\{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF_AND_ROLE}'\\)", "like '%%'");
                }
            }

            JBuild4DCResponseVo<List<String>> jBuild4DCResponseVoOrganIds = organRuntimeRemote.getAllChildOrganIdIncludeSelfRT(organId);
            List<String> allChildOrganIdList = jBuild4DCResponseVoOrganIds.getData();
            String replaceSqlWord = "";
            for (int i = 0; i < allChildOrganIdList.size(); i++) {
                String key = "sspocid" + i + "";
                replaceSqlWord += "#{" + key + "},";
                sqlParas.put(key, allChildOrganIdList.get(i));
            }
            replaceSqlWord = StringUtility.removeLastChar(replaceSqlWord);
            return sourceSQL.replaceAll("'#\\{ENVVAR.ENV_SYSTEM_CURRENT_USER_CHILD_ORGAN_ID_INCLUDE_SELF_AND_ROLE}'", replaceSqlWord);
        }
        return sourceSQL;
    }
}
