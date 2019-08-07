package com.jb4dc.builder.extend.impl;


import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.builder.extend.IDataSetAPI;
import com.jb4dc.builder.po.DataSetColumnVo;
import com.jb4dc.builder.po.DataSetRelatedTableVo;
import com.jb4dc.builder.po.DataSetVo;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/7
 * To change this template use File | Settings | File Templates.
 */
public class DemoDataSetAPI implements IDataSetAPI {
    @Override
    public DataSetVo getDataSetStructure(JB4DCSession session, String dsId, String op, String groupId, String paras) {
        DataSetVo dataSetVo= new DataSetVo();

        dataSetVo.setDsId(UUIDUtility.getUUID());
        dataSetVo.setDsCaption("测试API结果集");
        dataSetVo.setDsName("DemoDataSetAPI");
        dataSetVo.setDsOrganId(session.getOrganId());
        dataSetVo.setDsCreateTime(new Date());
        dataSetVo.setDsCreator(session.getUserName());
        dataSetVo.setDsUpdateTime(new Date());
        dataSetVo.setDsUpdater(session.getUserName());
        dataSetVo.setDsType("APIDataSet");
        dataSetVo.setDsIsSystem(TrueFalseEnum.False.getDisplayName());
        dataSetVo.setDsOrderNum(0);
        dataSetVo.setDsDesc("");
        dataSetVo.setDsGroupId(groupId);
        dataSetVo.setDsStatus(EnableTypeEnum.enable.getDisplayName());
        dataSetVo.setDsSqlSelectText("");
        dataSetVo.setDsSqlSelectValue("");
        dataSetVo.setDsClassName("com.jbuild4d.platform.builder.extend.impl.DemoDataSetAPI");
        dataSetVo.setDsRestStructureUrl("");
        dataSetVo.setDsRestDataUrl("");

        List<DataSetColumnVo> dataSetColumnVoList=new ArrayList<>();

        for(int i=0;i<10;i++){
            DataSetColumnVo dataSetColumnVo=new DataSetColumnVo();
            dataSetColumnVo.setColumnId(UUIDUtility.getUUID());
            dataSetColumnVo.setColumnDsId(dataSetVo.getDsId());
            dataSetColumnVo.setColumnCaption("标题"+i);
            dataSetColumnVo.setColumnName("NAME"+i);
            dataSetColumnVo.setColumnIsCustom("否");
            dataSetColumnVo.setColumnOrderNum(i+1);
            dataSetColumnVo.setColumnTableName("API_TABLE");
            dataSetColumnVoList.add(dataSetColumnVo);
        }

        List<DataSetRelatedTableVo> dataSetRelatedTableVoList=new ArrayList<>();

        dataSetVo.setColumnVoList(dataSetColumnVoList);
        dataSetVo.setRelatedTableVoList(dataSetRelatedTableVoList);

        return dataSetVo;
    }
}
