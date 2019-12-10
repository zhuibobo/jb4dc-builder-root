package com.jb4dc.builder.po;

import com.jb4dc.builder.dbentities.envvar.EnvGroupEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/12/10
 * To change this template use File | Settings | File Templates.
 */
public class EnvGroupPO extends EnvGroupEntity {
    List<EnvVariablePO> envVariablePOList;

    public List<EnvVariablePO> getEnvVariablePOList() {
        return envVariablePOList;
    }

    public void setEnvVariablePOList(List<EnvVariablePO> envVariablePOList) {
        this.envVariablePOList = envVariablePOList;
    }
}
