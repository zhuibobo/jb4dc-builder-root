package com.jb4dc.gridsystem.po;

import com.jb4dc.gridsystem.dbentities.build.HouseInfoEntity;

import java.util.List;

public class HouseInfoPO {
    HouseInfoEntity editHouseData;

    List<HouseRelevanterPO> editRelevanterPersons;

    public HouseInfoEntity getEditHouseData() {
        return editHouseData;
    }

    public void setEditHouseData(HouseInfoEntity editHouseData) {
        this.editHouseData = editHouseData;
    }

    public List<HouseRelevanterPO> getEditRelevanterPersons() {
        return editRelevanterPersons;
    }

    public void setEditRelevanterPersons(List<HouseRelevanterPO> editRelevanterPersons) {
        this.editRelevanterPersons = editRelevanterPersons;
    }
}
