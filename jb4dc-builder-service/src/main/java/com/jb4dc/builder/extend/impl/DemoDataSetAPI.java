package com.jb4dc.builder.extend.impl;


import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.exenum.TrueFalseEnum;
import com.jb4dc.builder.extend.IDataSetAPI;
import com.jb4dc.builder.po.DataSetColumnPO;
import com.jb4dc.builder.po.DataSetPO;
import com.jb4dc.builder.po.DataSetRelatedTablePO;
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
    public DataSetPO getDataSetStructure(JB4DCSession session, String dsId, String op, String groupId, String paras) {
        DataSetPO dataSetPO = new DataSetPO();

        dataSetPO.setDsId(UUIDUtility.getUUID());
        dataSetPO.setDsCaption("测试API结果集");
        dataSetPO.setDsName("DemoDataSetAPI");
        dataSetPO.setDsOrganId(session.getOrganId());
        dataSetPO.setDsCreateTime(new Date());
        dataSetPO.setDsCreator(session.getUserName());
        dataSetPO.setDsUpdateTime(new Date());
        dataSetPO.setDsUpdater(session.getUserName());
        dataSetPO.setDsType("APIDataSet");
        dataSetPO.setDsIsSystem(TrueFalseEnum.False.getDisplayName());
        dataSetPO.setDsOrderNum(0);
        dataSetPO.setDsDesc("");
        dataSetPO.setDsGroupId(groupId);
        dataSetPO.setDsStatus(EnableTypeEnum.enable.getDisplayName());
        dataSetPO.setDsSqlSelectText("");
        dataSetPO.setDsSqlSelectValue("");
        dataSetPO.setDsClassName("com.jbuild4d.platform.builder.extend.impl.DemoDataSetAPI");
        dataSetPO.setDsRestStructureUrl("");
        dataSetPO.setDsRestDataUrl("");

        List<DataSetColumnPO> dataSetColumnVoList=new ArrayList<>();

        for(int i=0;i<10;i++){
            DataSetColumnPO dataSetColumnVo=new DataSetColumnPO();
            dataSetColumnVo.setColumnId(UUIDUtility.getUUID());
            dataSetColumnVo.setColumnDsId(dataSetPO.getDsId());
            dataSetColumnVo.setColumnCaption("标题"+i);
            dataSetColumnVo.setColumnName("NAME"+i);
            dataSetColumnVo.setColumnIsCustom("否");
            dataSetColumnVo.setColumnOrderNum(i+1);
            dataSetColumnVo.setColumnTableName("API_TABLE");
            dataSetColumnVoList.add(dataSetColumnVo);
        }

        List<DataSetRelatedTablePO> dataSetRelatedTablePOList =new ArrayList<>();

        dataSetPO.setColumnVoList(dataSetColumnVoList);
        dataSetPO.setRelatedTableVoList(dataSetRelatedTablePOList);

        return dataSetPO;
    }
}
